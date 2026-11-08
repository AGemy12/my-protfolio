"use client";

import { createContext, useContext, useId, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { Locale } from "@/i18n/routing";
import type { SiteContent } from "@/lib/content/types";

// ---------------------------------------------------------------------------
// Editor state shared by every field.

type Path = (string | number)[];
type Draft = Record<string | number, unknown>;

export function getAt(source: unknown, path: Path): unknown {
  return path.reduce<unknown>(
    (node, key) => (node == null ? undefined : (node as Draft)[key]),
    source,
  );
}

export function setAt(target: unknown, path: Path, value: unknown) {
  let node = target as Draft;
  path.slice(0, -1).forEach((key, i) => {
    if (node[key] == null) node[key] = typeof path[i + 1] === "number" ? [] : {};
    node = node[key] as Draft;
  });
  node[path[path.length - 1]] = value;
}

type Editor = {
  content: SiteContent;
  /** Applies a change to a copy of the content. */
  edit: (change: (draft: SiteContent) => void) => void;
  uploadsReady: boolean;
};

export const EditorContext = createContext<Editor | null>(null);

export function useEditor() {
  const editor = useContext(EditorContext);
  if (!editor) throw new Error("useEditor must be used inside <EditorContext>");
  return editor;
}

// Arabic first: in a right-to-left page it sits on the right.
export const LOCALES: { id: Locale; label: string; dir: "rtl" | "ltr" }[] = [
  { id: "ar", label: "عربي", dir: "rtl" },
  { id: "en", label: "English", dir: "ltr" },
];

// ---------------------------------------------------------------------------
// Layout pieces.

export function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-line bg-surface p-5 sm:p-7">
      <h2 className="text-[1.3rem]">{title}</h2>
      {description && <p className="mt-1 text-[14px] text-muted">{description}</p>}
      <div className="mt-6 grid gap-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={htmlFor} className="text-[14px] font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-[13px] text-faint">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-[15px] leading-relaxed outline-none transition-colors placeholder:text-faint focus:border-accent focus:bg-surface";

function TextInput({
  id,
  value,
  onChange,
  long,
  dir,
  lang,
  placeholder,
  type = "text",
  label,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  long?: boolean;
  dir?: "rtl" | "ltr";
  lang?: string;
  placeholder?: string;
  type?: string;
  label?: string;
}) {
  const shared = {
    id,
    value,
    dir,
    lang,
    placeholder,
    "aria-label": label,
    className: inputClass,
  };
  return long ? (
    <textarea
      {...shared}
      rows={3}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} field-sizing-content min-h-[5.5em] resize-y`}
    />
  ) : (
    <input {...shared} type={type} onChange={(e) => onChange(e.target.value)} />
  );
}

function LocaleBadge({ label }: { label: string }) {
  return <span className="text-[12px] text-faint">{label}</span>;
}

// ---------------------------------------------------------------------------
// Fields bound to the content.

/** One text, edited in both languages side by side. `path` is inside messages.<locale>. */
export function LocalizedText({
  path,
  label,
  hint,
  long,
}: {
  path: Path;
  label: string;
  hint?: string;
  long?: boolean;
}) {
  const { content, edit } = useEditor();
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={`${id}-ar`}>
      <div className="grid gap-3 md:grid-cols-2">
        {LOCALES.map((locale) => (
          <div key={locale.id} className="grid gap-1">
            <LocaleBadge label={locale.label} />
            <TextInput
              id={`${id}-${locale.id}`}
              label={`${label} (${locale.label})`}
              dir={locale.dir}
              lang={locale.id}
              long={long}
              value={String(getAt(content.messages[locale.id], path) ?? "")}
              onChange={(value) => edit((d) => setAt(d.messages[locale.id], path, value))}
            />
          </div>
        ))}
      </div>
    </Field>
  );
}

/** A list of short texts (tags, skills, bullet points), one per line, in both languages. */
export function LocalizedLines({ path, label, hint }: { path: Path; label: string; hint?: string }) {
  const { content, edit } = useEditor();
  const id = useId();
  return (
    <Field label={label} hint={hint ?? "سطر لكل عنصر."} htmlFor={`${id}-ar`}>
      <div className="grid gap-3 md:grid-cols-2">
        {LOCALES.map((locale) => {
          const lines = (getAt(content.messages[locale.id], path) as string[] | undefined) ?? [];
          return (
            <div key={locale.id} className="grid gap-1">
              <LocaleBadge label={locale.label} />
              <TextInput
                id={`${id}-${locale.id}`}
                label={`${label} (${locale.label})`}
                dir={locale.dir}
                lang={locale.id}
                long
                value={lines.join("\n")}
                onChange={(value) =>
                  edit((d) => setAt(d.messages[locale.id], path, value.split("\n")))
                }
              />
            </div>
          );
        })}
      </div>
    </Field>
  );
}

/** A value that is the same in every language (links, email, phone). */
export function PlainField({
  label,
  hint,
  value,
  onChange,
  type,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <TextInput id={id} value={value} onChange={onChange} type={type} dir="ltr" placeholder={placeholder} />
    </Field>
  );
}

// ---------------------------------------------------------------------------
// Lists kept in step across languages: adding, removing or moving an item
// does the same in Arabic and English.

function listIn(draft: SiteContent, locale: Locale, path: Path): unknown[] {
  const found = getAt(draft.messages[locale], path);
  if (Array.isArray(found)) return found;
  const list: unknown[] = [];
  setAt(draft.messages[locale], path, list);
  return list;
}

export function ItemList({
  path,
  label,
  addLabel,
  itemTitle,
  newItem,
  children,
}: {
  path: Path;
  label: string;
  addLabel: string;
  itemTitle: (index: number) => string;
  newItem: () => unknown;
  children: (index: number) => React.ReactNode;
}) {
  const { content, edit } = useEditor();
  const count = Math.max(
    ...LOCALES.map((l) => ((getAt(content.messages[l.id], path) as unknown[]) ?? []).length),
  );

  const change = (fn: (list: unknown[]) => void) =>
    edit((d) => LOCALES.forEach((l) => fn(listIn(d, l.id, path))));

  return (
    <div className="grid gap-3">
      <h3 className="font-sans! text-[14px] font-medium">{label}</h3>
      {Array.from({ length: count }, (_, index) => (
        <ItemCard
          key={index}
          title={itemTitle(index) || `عنصر ${index + 1}`}
          index={index}
          count={count}
          onMove={(to) =>
            change((list) => {
              const [item] = list.splice(index, 1);
              list.splice(to, 0, item);
            })
          }
          onRemove={() => change((list) => list.splice(index, 1))}
        >
          {children(index)}
        </ItemCard>
      ))}
      <AddButton onClick={() => change((list) => list.push(newItem()))}>{addLabel}</AddButton>
    </div>
  );
}

export function ItemCard({
  title,
  index,
  count,
  onMove,
  onRemove,
  children,
}: {
  title: string;
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-[14.5px] font-medium">
          <span className="text-faint tabular-nums">{index + 1}. </span>
          {title}
        </span>
        <div className="flex shrink-0 gap-1">
          <IconButton label="تحريك لأعلى" disabled={index === 0} onClick={() => onMove(index - 1)}>
            <path d="M12 19V5M6 11l6-6 6 6" />
          </IconButton>
          <IconButton label="تحريك لأسفل" disabled={index === count - 1} onClick={() => onMove(index + 1)}>
            <path d="M12 5v14M6 13l6 6 6-6" />
          </IconButton>
          <IconButton
            label="حذف"
            danger
            onClick={() => {
              if (window.confirm(`حذف «${title}»؟`)) onRemove();
            }}
          >
            <path d="M5 7h14M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
          </IconButton>
        </div>
      </div>
      <div className="grid gap-5">{children}</div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-panel disabled:opacity-30 disabled:hover:bg-transparent ${
        danger ? "hover:text-danger" : "hover:text-fg"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-line py-3 text-[14.5px] text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <span aria-hidden="true" className="text-[18px] leading-none">+</span>
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Uploads to Vercel Blob.

const MAX_UPLOAD = 15 * 1024 * 1024;

const safeName = (name: string) => {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return `${base || "file"}${ext ? `.${ext}` : ""}`;
};

export function UploadField({
  label,
  hint,
  value,
  onChange,
  kind,
  previewClassName = "aspect-[16/11] object-cover object-top",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  kind: "image" | "pdf";
  previewClassName?: string;
}) {
  const { uploadsReady } = useEditor();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const id = useId();

  const choose = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    if (file.size > MAX_UPLOAD) {
      setError("حجم الملف أكبر من 15 ميجابايت.");
      return;
    }
    setProgress(0);
    try {
      const blob = await upload(`${kind === "image" ? "images" : "files"}/${safeName(file.name)}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        contentType: file.type || undefined,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      // downloadUrl makes the browser save the CV instead of only opening it.
      onChange(kind === "pdf" ? blob.downloadUrl : blob.url);
    } catch (e) {
      console.error(e);
      setError("تعذّر رفع الملف. تأكد من نوعه (صورة أو PDF) وحاول مرة أخرى.");
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className="grid gap-3">
        {kind === "image" && value && (
          // A plain <img>: the preview must show any URL typed in, before it is saved.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className={`w-full max-w-[420px] rounded-xl bg-panel ${previewClassName}`} />
        )}
        {kind === "pdf" && value && (
          <a href={value} target="_blank" rel="noopener noreferrer" className="w-fit text-[14px] text-accent underline underline-offset-4">
            عرض الملف الحالي
          </a>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={input}
            id={id}
            type="file"
            accept={kind === "image" ? "image/png,image/jpeg,image/webp,image/avif,image/gif" : "application/pdf"}
            className="sr-only"
            disabled={!uploadsReady || progress !== null}
            onChange={(e) => choose(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={!uploadsReady || progress !== null}
            onClick={() => input.current?.click()}
            className="rounded-full border border-line bg-surface px-4 py-2 text-[14px] transition-colors hover:border-fg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line"
          >
            {progress !== null
              ? `جارٍ الرفع… ${progress}%`
              : kind === "image"
                ? "رفع صورة جديدة"
                : "رفع ملف PDF"}
          </button>
          {!uploadsReady && (
            <span className="text-[13px] text-faint">
              لتفعيل الرفع أضف <code dir="ltr">BLOB_READ_WRITE_TOKEN</code>
            </span>
          )}
        </div>
        {error && <p className="text-[13.5px] text-danger">{error}</p>}
        <TextInput label={`${label}: الرابط`} value={value} onChange={onChange} dir="ltr" placeholder="/assets/… أو رابط الملف المرفوع" />
      </div>
    </Field>
  );
}
