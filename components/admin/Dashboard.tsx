"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { logout, saveContent } from "@/app/admin/actions";
import type { ContentIssue } from "@/lib/content/normalize";
import type { StoredContent } from "@/lib/content/store";
import type { SiteContent } from "@/lib/content/types";
import { EditorContext } from "./editor";
import {
  AboutTab,
  AppearanceTab,
  ContactTab,
  ExperienceTab,
  GeneralTab,
  HeroTab,
  ServicesTab,
  WorkTab,
} from "./tabs";

const TABS = [
  { id: "general", label: "عام و SEO", Component: GeneralTab },
  { id: "hero", label: "الواجهة الرئيسية", Component: HeroTab },
  { id: "work", label: "الأعمال", Component: WorkTab },
  { id: "services", label: "الخدمات", Component: ServicesTab },
  { id: "about", label: "نبذة", Component: AboutTab },
  { id: "experience", label: "الخبرات", Component: ExperienceTab },
  { id: "contact", label: "التواصل", Component: ContactTab },
  { id: "appearance", label: "المظهر", Component: AppearanceTab },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Which tab holds the field a validation issue points at. */
function tabOf(path: string): TabId {
  if (path === "profile.photo" || path === "profile.cv") return "hero";
  if (path.startsWith("profile.")) return "contact";
  if (path.startsWith("projects.")) return "work";
  const section = path.split(".")[2]; // messages.<locale>.<section>…
  if (section === "meta" || section === "nav" || section === "footer") return "general";
  if (section === "palettes") return "appearance";
  return TABS.find((t) => t.id === section)?.id ?? "general";
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

export default function Dashboard({
  initial,
  dbReady,
  uploadsReady,
}: {
  initial: StoredContent;
  dbReady: boolean;
  uploadsReady: boolean;
}) {
  const [content, setContent] = useState<SiteContent>(initial.content);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initial.content));
  const [version, setVersion] = useState(initial.version);
  const [updatedAt, setUpdatedAt] = useState(initial.updatedAt);
  const [tab, setTab] = useState<TabId>("general");
  const [error, setError] = useState<{ message: string; signedOut?: boolean } | null>(null);
  const [issues, setIssues] = useState<ContentIssue[]>([]);
  const [justSaved, setJustSaved] = useState(false);
  const [saving, startSaving] = useTransition();

  const dirty = useMemo(() => JSON.stringify(content) !== savedJson, [content, savedJson]);

  const edit = useCallback((change: (draft: SiteContent) => void) => {
    setJustSaved(false);
    setContent((previous) => {
      const next = structuredClone(previous);
      change(next);
      return next;
    });
  }, []);

  // Open the tab named in the address (#work) and keep it in sync.
  useEffect(() => {
    const fromHash = TABS.find((t) => t.id === window.location.hash.slice(1));
    if (fromHash) setTab(fromHash.id);
  }, []);
  const openTab = (id: TabId) => {
    setTab(id);
    history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0 });
  };

  const save = () => {
    if (!dbReady || saving) return;
    const sent = JSON.stringify(content);
    startSaving(async () => {
      const result = await saveContent(content, version);
      if (!result.ok) {
        setError({ message: result.error, signedOut: result.signedOut });
        setIssues(result.issues ?? []);
        return;
      }
      setError(null);
      setIssues([]);
      setVersion(result.version);
      setUpdatedAt(result.updatedAt);
      setSavedJson(JSON.stringify(result.content));
      // Show the cleaned-up copy (empty lines removed…) unless the user kept
      // typing while the save was in flight.
      setContent((current) => (JSON.stringify(current) === sent ? result.content : current));
      setJustSaved(true);
    });
  };

  // Ctrl/Cmd + S saves.
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const issueTabs = new Set(issues.map((i) => tabOf(i.path)));
  const current = TABS.find((t) => t.id === tab) ?? TABS[0];
  const Current = current.Component;

  return (
    <EditorContext.Provider value={{ content, edit, uploadsReady }}>
      <div className="min-h-svh">
        <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="font-medium">لوحة التحكم</p>
              <p className="text-[12.5px] text-faint" suppressHydrationWarning>
                {updatedAt ? `آخر حفظ: ${formatDate(updatedAt)}` : "المحتوى الأصلي من ملفات الموقع، لم يُحفظ بعد"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span aria-live="polite" className="text-[13.5px] text-muted">
                {saving ? "جارٍ الحفظ…" : dirty ? "تغييرات غير محفوظة" : justSaved ? "تم الحفظ، والموقع محدَّث" : ""}
              </span>
              <a
                href="/ar"
                target="_blank"
                className="rounded-full px-3.5 py-2 text-[14px] text-muted transition-colors hover:bg-panel hover:text-fg"
              >
                عرض الموقع
              </a>
              <button
                type="button"
                onClick={save}
                disabled={!dbReady || saving || !dirty}
                title="Ctrl + S"
                className="rounded-full bg-fg px-5 py-2 text-[14px] font-medium text-bg transition-colors hover:bg-accent hover:text-on-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-fg disabled:hover:text-bg"
              >
                حفظ التغييرات
              </button>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full px-3.5 py-2 text-[14px] text-muted transition-colors hover:bg-panel hover:text-fg"
                >
                  خروج
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1240px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10 lg:py-10">
          <nav aria-label="أقسام الموقع" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
            <ul className="flex gap-1 lg:sticky lg:top-[92px] lg:grid">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => openTab(t.id)}
                    aria-current={t.id === tab ? "page" : undefined}
                    className={`flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-start text-[14.5px] transition-colors ${
                      t.id === tab ? "bg-surface font-medium text-fg shadow-[0_0_0_1px_var(--line)]" : "text-muted hover:text-fg"
                    }`}
                  >
                    {t.label}
                    {issueTabs.has(t.id) && (
                      <span className="h-1.5 w-1.5 rounded-full bg-danger" aria-label="يحتاج مراجعة" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <main className="grid min-w-0 content-start gap-6">
            {!dbReady && (
              <Notice tone="warn">
                قاعدة البيانات غير مهيأة، لذلك الحفظ معطّل. أضف <code dir="ltr">MONGODB_URI</code> إلى متغيرات
                البيئة ثم أعد تشغيل الموقع.
              </Notice>
            )}
            {error && (
              <Notice tone="error">
                <p>{error.message}</p>
                {error.signedOut && (
                  <a href="/admin/login" target="_blank" className="mt-1 inline-block underline underline-offset-4">
                    سجّل الدخول في نافذة جديدة (تعديلاتك هنا لن تضيع)
                  </a>
                )}
                {issues.length > 0 && (
                  <ul className="mt-2 grid gap-1.5">
                    {issues.map((issue, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => openTab(tabOf(issue.path))}
                          className="text-start underline-offset-4 hover:underline"
                        >
                          {TABS.find((t) => t.id === tabOf(issue.path))?.label}: {issue.message}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Notice>
            )}

            <h1 className="text-[1.9rem]">{current.label}</h1>
            <Current />
          </main>
        </div>
      </div>
    </EditorContext.Provider>
  );
}

function Notice({ tone, children }: { tone: "warn" | "error"; children: React.ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-2xl border p-4 text-[14.5px] leading-7 ${
        tone === "error"
          ? "border-danger/40 bg-danger/5 text-danger"
          : "border-line bg-panel text-muted"
      }`}
    >
      {children}
    </div>
  );
}
