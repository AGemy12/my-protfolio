"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { saveSettings } from "@/lib/actions/content";
import { SECTION_KEYS, type L, type Settings } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { CardSection, FieldLabel, PageHeader } from "./ui";
import { FileField, LocalizedField, SwitchField } from "./fields";
import { useActionToast } from "./resource-form";

export function SettingsForm({ initial }: { initial: Settings }) {
  const t = useTranslations("admin");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const notify = useActionToast();
  const [s, setS] = useState<Settings>(initial);
  const [saving, start] = useTransition();

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setS((prev) => ({ ...prev, [key]: value }));
  const label = (k: string) => t(`fields.${k}` as never);

  const loc = (key: keyof Settings, opts: { multiline?: boolean; rows?: number; required?: boolean } = {}) => (
    <LocalizedField label={label(key)} value={s[key] as L} onChange={(v) => set(key, v as never)} {...opts} />
  );
  const text = (key: keyof Settings, type = "text", half = true) => (
    <div className={half ? undefined : "sm:col-span-2"}>
      <FieldLabel htmlFor={key}>{label(key)}</FieldLabel>
      <Input
        id={key}
        type={type}
        dir="ltr"
        value={String(s[key] ?? "")}
        onChange={(e) => set(key, (type === "number" ? Number(e.target.value) : e.target.value) as never)}
      />
    </div>
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      if (notify(await saveSettings(s))) router.refresh();
    });
  };

  const saveButton = (
    <LoadingButton type="submit" loading={saving} className="shadow-xl sm:shadow-none">
      {saving ? t("common.saving") : t("common.save")}
    </LoadingButton>
  );

  return (
    <form onSubmit={submit} className="space-y-6">
      <PageHeader title={t("profile.title")} actions={saveButton} />

      <CardSection title={t("profile.identity")}>
        {loc("name", { required: true })}
        {loc("role")}
        {loc("location")}
      </CardSection>

      <CardSection title={t("profile.hero")}>
        {loc("headline", { multiline: true, rows: 2 })}
        {text("yearsExperience", "number")}
        {text("projectsDone", "number")}
        <div className="sm:col-span-2">
          <SwitchField label={label("available")} checked={s.available} onChange={(v) => set("available", v)} />
        </div>
      </CardSection>

      <CardSection title={t("profile.about")}>
        {loc("bio", { multiline: true, rows: 3 })}
        {loc("about", { multiline: true, rows: 10 })}
      </CardSection>

      <CardSection title={t("profile.files")}>
        <FileField label={label("avatar")} value={s.avatar} onChange={(v) => set("avatar", v)} />
        <FileField label={label("cvEn")} value={s.cvEn} accept="application/pdf" onChange={(v) => set("cvEn", v)} />
        <FileField label={label("cvAr")} value={s.cvAr} accept="application/pdf" onChange={(v) => set("cvAr", v)} />
      </CardSection>

      <CardSection title={t("profile.contact")}>
        {text("email", "email")}
        {text("phone")}
        {text("whatsapp", "url", false)}
      </CardSection>

      <CardSection title={t("profile.social")}>
        {text("github", "url")}
        {text("linkedin", "url")}
        {text("x", "url")}
      </CardSection>

      <CardSection title={t("profile.visibility")} description={t("profile.visibilityHint")}>
        {SECTION_KEYS.map((k) => (
          <SwitchField
            key={k}
            label={tNav(k)}
            checked={s.sections[k]}
            onChange={(v) => set("sections", { ...s.sections, [k]: v })}
          />
        ))}
      </CardSection>

      <CardSection title={t("profile.seo")}>
        {loc("seoTitle")}
        {loc("seoDescription", { multiline: true, rows: 2 })}
        <FileField label={label("ogImage")} value={s.ogImage} onChange={(v) => set("ogImage", v)} />
      </CardSection>

      <div className="sticky bottom-4 flex justify-end">{saveButton}</div>
    </form>
  );
}
