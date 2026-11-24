"use client";

import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { saveSettings } from "@/lib/actions/content";
import { Link } from "@/i18n/navigation";
import { SECTION_KEYS, type L, type Settings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardSection, FieldLabel, PageHeader } from "./ui";
import { FileField, LocalizedField, SwitchField } from "./fields";
import { useActionToast } from "./resource-form";
import { SaveBar, useDirty, useFormGuard } from "./save-bar";

const PARTS = ["identity", "hero", "about", "files", "contact", "social", "visibility", "seo"] as const;

export function SettingsForm({ initial }: { initial: Settings }) {
  const t = useTranslations("admin");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const notify = useActionToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [s, setS] = useState<Settings>(initial);
  const [saving, start] = useTransition();
  const { dirty, markSaved, savedValue } = useDirty(s);
  useFormGuard(dirty, formRef);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setS((prev) => ({ ...prev, [key]: value }));
  const label = (k: string) => t(`fields.${k}` as never);

  const loc = (
    key: keyof Settings,
    opts: { multiline?: boolean; rows?: number; required?: boolean; max?: number; hint?: string } = {},
  ) => <LocalizedField label={label(key)} value={s[key] as L} onChange={(v) => set(key, v as never)} {...opts} />;

  const text = (key: keyof Settings, type = "text", half = true, placeholder?: string) => (
    <div className={half ? undefined : "sm:col-span-2"}>
      <FieldLabel htmlFor={key}>{label(key)}</FieldLabel>
      <Input
        id={key}
        type={type}
        dir="ltr"
        placeholder={placeholder}
        value={String(s[key] ?? "")}
        onChange={(e) => set(key, (type === "number" ? Number(e.target.value) : e.target.value) as never)}
      />
    </div>
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    start(async () => {
      if (notify(await saveSettings(s))) {
        markSaved(s);
        router.refresh();
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={submit} className="space-y-6">
      <PageHeader
        title={t("profile.title")}
        actions={
          <Button asChild variant="outline">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              {t("common.viewOnSite")}
            </a>
          </Button>
        }
      />

      {/* Quick jumps: the form is long, so every part is one click away. */}
      <nav aria-label={t("profile.jump")} className="-mt-2 flex flex-wrap gap-2">
        {PARTS.map((p) => (
          <a
            key={p}
            href={`#part-${p}`}
            className="rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
          >
            {t(`profile.${p}`)}
          </a>
        ))}
        {/* section headings, buttons and every other fixed text moved to their own page */}
        <Link
          href="/admin/texts"
          className="rounded-full border border-dashed px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
        >
          {t("nav.texts")}
        </Link>
      </nav>

      <CardSection id="part-identity" title={t("profile.identity")}>
        {loc("name", { required: true })}
        {loc("role")}
        {loc("location")}
      </CardSection>

      <CardSection id="part-hero" title={t("profile.hero")} description={t("profile.heroHint")}>
        {loc("headline", { multiline: true, rows: 2, hint: t("profile.headlineHint") })}
        {loc("bio", { multiline: true, rows: 3 })}
        {text("yearsExperience", "number")}
        {text("projectsDone", "number")}
        <div className="sm:col-span-2">
          <SwitchField label={label("available")} checked={s.available} onChange={(v) => set("available", v)} />
        </div>
      </CardSection>

      <CardSection id="part-about" title={t("profile.about")}>
        {loc("about", { multiline: true, rows: 10, hint: t("profile.aboutHint") })}
      </CardSection>

      <CardSection id="part-files" title={t("profile.files")}>
        <FileField label={label("avatar")} value={s.avatar} onChange={(v) => set("avatar", v)} />
        <FileField label={label("cvEn")} value={s.cvEn} accept="application/pdf" onChange={(v) => set("cvEn", v)} />
        <FileField label={label("cvAr")} value={s.cvAr} accept="application/pdf" onChange={(v) => set("cvAr", v)} />
      </CardSection>

      <CardSection id="part-contact" title={t("profile.contact")}>
        {text("email", "email", true, "name@example.com")}
        {text("phone", "tel", true, "+20 100 000 0000")}
        {text("whatsapp", "url", false, "https://wa.me/201000000000")}
      </CardSection>

      <CardSection id="part-social" title={t("profile.social")}>
        {text("github", "url", true, "https://github.com/…")}
        {text("linkedin", "url", true, "https://www.linkedin.com/in/…")}
        {text("x", "url", true, "https://x.com/…")}
      </CardSection>

      <CardSection id="part-visibility" title={t("profile.visibility")} description={t("profile.visibilityHint")}>
        {SECTION_KEYS.map((k) => (
          <SwitchField
            key={k}
            label={tNav(k)}
            checked={s.sections[k]}
            onChange={(v) => set("sections", { ...s.sections, [k]: v })}
          />
        ))}
      </CardSection>

      <CardSection id="part-seo" title={t("profile.seo")} description={t("profile.seoHint")}>
        {loc("seoTitle", { max: 60 })}
        {loc("seoDescription", { multiline: true, rows: 2, max: 160 })}
        <FileField label={label("ogImage")} value={s.ogImage} onChange={(v) => set("ogImage", v)} />
      </CardSection>

      <SaveBar dirty={dirty} saving={saving} onDiscard={() => setS(savedValue())} />
    </form>
  );
}
