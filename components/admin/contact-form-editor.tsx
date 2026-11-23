"use client";

import { useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowDown, ArrowUp, ExternalLink, Mail, Plus, RotateCcw, Send, Trash, TriangleAlert, X } from "lucide-react";
import { SiGmail, SiWhatsapp } from "react-icons/si";
import { Link, useRouter } from "@/i18n/navigation";
import { saveContactForm } from "@/lib/actions/content";
import {
  CONTACT_CHANNELS,
  CONTACT_FIELD_TYPES,
  FIELD_KEY,
  RESERVED_KEYS,
  buildMessage,
  defaultContactForm,
  hasLength,
  isChoice,
  newField,
  templateKeys,
  type ContactChannel,
  type ContactFieldDef,
  type ContactFieldType,
  type ContactFormConfig,
  type ContactOption,
  type ContactValues,
} from "@/lib/contact-form";
import { confirmDialog } from "@/lib/stores/confirm";
import { tr, type L } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CardSection, FieldLabel, Hint, PageHeader } from "./ui";
import { LocalizedField, SwitchField } from "./fields";
import { useActionToast } from "./resource-form";
import { SaveBar, useDirty, useFormGuard } from "./save-bar";

/** A field plus a stable id for React keys and the open/closed state (the key itself is editable). */
type Row = ContactFieldDef & { rowId: string };
type Draft = Omit<ContactFormConfig, "fields"> & { fields: Row[] };
/** Where each way of sending goes; empty when it isn't set up. gmail is the mailbox the server sends to. */
type Targets = { whatsapp: string; email: string; gmail: string };

const withRowIds = (c: ContactFormConfig, prefix: string): Draft => ({
  ...c,
  fields: c.fields.map((f, i) => ({ ...f, rowId: `${prefix}${i}` })),
});

function toConfig(d: Draft): ContactFormConfig {
  return {
    ...d,
    fields: d.fields.map((row) => {
      const f: Partial<Row> = { ...row };
      delete f.rowId;
      return f as ContactFieldDef;
    }),
  };
}

function move<T>(list: T[], i: number, by: number) {
  const j = i + by;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

const randomId = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const CHANNEL_ICONS: Record<ContactChannel, React.ReactNode> = {
  whatsapp: <SiWhatsapp />,
  gmail: <SiGmail />,
  email: <Mail />,
  site: <Send className="rtl:-scale-x-100" />,
};

/** Made-up answers for the preview, in the preview's language. */
function sampleValues(fields: ContactFieldDef[], lang: "en" | "ar"): ContactValues {
  return Object.fromEntries(
    fields.map((f) => {
      switch (f.type) {
        case "email":
          return [f.key, "sara@example.com"];
        case "phone":
          return [f.key, "+20 100 123 4567"];
        case "select":
          return [f.key, f.options[0]?.value ?? ""];
        case "chips":
          return [f.key, f.options.slice(0, f.multiple ? 2 : 1).map((o) => o.value)];
        default:
          return [f.key, f.key === "name" ? (lang === "ar" ? "سارة" : "Sara") : `[${tr(f.label, lang) || f.key}]`];
      }
    }),
  );
}

/** WhatsApp-style *bold*. */
function Formatted({ text }: { text: string }) {
  return text
    .split(/(\*[^*\n]+\*)/g)
    .map((part, i) => (/^\*[^*\n]+\*$/.test(part) ? <strong key={i}>{part.slice(1, -1)}</strong> : part));
}

/* ---------------- template with insertable variables ---------------- */

function TemplateField({
  label,
  hint,
  value,
  onChange,
  tokens,
}: {
  label: string;
  hint: string;
  value: L;
  onChange: (v: L) => void;
  tokens: { token: string; label: string }[];
}) {
  const tc = useTranslations("admin.common");
  const boxes = { en: useRef<HTMLTextAreaElement>(null), ar: useRef<HTMLTextAreaElement>(null) };
  const last = useRef<"en" | "ar">("en");

  // Inserts at the cursor of the box that was focused last.
  const insert = (token: string) => {
    const lang = last.current;
    const el = boxes[lang].current;
    const text = value[lang];
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    onChange({ ...value, [lang]: text.slice(0, start) + token + text.slice(end) });
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + token.length, start + token.length);
    });
  };

  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      <p className="mb-3 text-xs text-muted-foreground">{hint}</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {tokens.map(({ token, label: name }) => (
          <button
            key={token}
            type="button"
            // keep the cursor where it is in the textarea
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => insert(token)}
            title={token}
            className="inline-flex h-7 items-center gap-1 rounded-full border bg-background px-2.5 text-xs transition-colors hover:border-brand hover:text-brand"
          >
            <Plus className="size-3" />
            {name}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {(["en", "ar"] as const).map((lang) => (
          <div key={lang}>
            <p className="mb-1 font-mono text-[10px] font-medium text-muted-foreground uppercase">
              {lang === "en" ? tc("english") : tc("arabic")}
            </p>
            <Textarea
              ref={boxes[lang]}
              dir={lang === "ar" ? "rtl" : "ltr"}
              lang={lang}
              rows={11}
              aria-label={`${label} (${lang})`}
              value={value[lang]}
              onFocus={() => (last.current = lang)}
              onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              className="resize-y font-mono text-[13px] leading-relaxed md:text-[13px]"
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}

/* ---------------- options of a list / choice buttons ---------------- */

function OptionsField({ value, onChange }: { value: ContactOption[]; onChange: (v: ContactOption[]) => void }) {
  const t = useTranslations("admin.contactForm");
  const tc = useTranslations("admin.common");
  const set = (i: number, patch: Partial<L>) =>
    onChange(value.map((o, j) => (j === i ? { ...o, label: { ...o.label, ...patch } } : o)));

  return (
    <div className="sm:col-span-2">
      <FieldLabel hint={`${value.length} ${tc("items")}`}>{t("options")}</FieldLabel>
      <ul className="space-y-2">
        {value.map((o, i) => (
          <li key={o.value} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-center font-mono text-xs text-muted-foreground">{i + 1}</span>
            <Input
              dir="ltr"
              lang="en"
              value={o.label.en}
              placeholder={tc("english")}
              aria-label={`${t("options")} ${i + 1} (${tc("english")})`}
              onChange={(e) => set(i, { en: e.target.value })}
            />
            <Input
              dir="rtl"
              lang="ar"
              value={o.label.ar}
              placeholder={tc("arabic")}
              aria-label={`${t("options")} ${i + 1} (${tc("arabic")})`}
              onChange={(e) => set(i, { ar: e.target.value })}
            />
            <div className="flex shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={tc("moveUp")}
                disabled={i === 0}
                onClick={() => onChange(move(value, i, -1))}
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={tc("moveDown")}
                disabled={i === value.length - 1}
                onClick={() => onChange(move(value, i, 1))}
              >
                <ArrowDown />
              </Button>
              <Button
                type="button"
                variant="ghost-destructive"
                size="icon-sm"
                aria-label={tc("remove")}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
              >
                <X />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {!value.length && <p className="text-xs text-destructive">{t("noOptions")}</p>}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={() => onChange([...value, { value: randomId("o"), label: { en: "", ar: "" } }])}
      >
        <Plus />
        {t("addOption")}
      </Button>
    </div>
  );
}

/* ---------------- one field's settings ---------------- */

function FieldEditor({
  row,
  keyError,
  onChange,
  onKey,
}: {
  row: Row;
  keyError?: string;
  onChange: (patch: Partial<ContactFieldDef>) => void;
  onKey: (key: string) => void;
}) {
  const t = useTranslations("admin.contactForm");
  const id = `cf-${row.rowId}`;
  const choice = isChoice(row.type);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <LocalizedField label={t("label")} value={row.label} required onChange={(v) => onChange({ label: v })} />

      <div>
        <FieldLabel htmlFor={`${id}-key`}>{t("key")}</FieldLabel>
        <Input
          id={`${id}-key`}
          dir="ltr"
          spellCheck={false}
          autoComplete="off"
          value={row.key}
          aria-invalid={keyError ? true : undefined}
          onChange={(e) => onKey(e.target.value.replace(/\s+/g, "_"))}
          className="font-mono"
        />
        <p className={cn("mt-1.5 text-xs", keyError ? "text-destructive" : "text-muted-foreground")}>
          {keyError ?? t("keyHint", { token: `{{${row.key}}}` })}
        </p>
      </div>

      <div>
        <FieldLabel htmlFor={`${id}-type`}>{t("type")}</FieldLabel>
        <Select
          value={row.type}
          onValueChange={(v) => {
            const type = v as ContactFieldType;
            onChange({ type, ...(type === "textarea" && row.max <= 200 ? { max: 5000 } : {}) });
          }}
        >
          <SelectTrigger id={`${id}-type`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTACT_FIELD_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`types.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
        <SwitchField label={t("required")} checked={row.required} onChange={(v) => onChange({ required: v })} />
        {/* a phone field always takes the full row: the country picker needs the room */}
        <SwitchField
          label={t("half")}
          checked={row.half && row.type !== "phone"}
          disabled={row.type === "phone"}
          onChange={(v) => onChange({ half: v })}
        />
        {row.type === "chips" && (
          <SwitchField label={t("multiple")} checked={row.multiple} onChange={(v) => onChange({ multiple: v })} />
        )}
      </div>

      {choice && <OptionsField value={row.options} onChange={(options) => onChange({ options })} />}

      {/* choice buttons have no box to hold one; phone boxes show each country's own example number */}
      {row.type !== "chips" && row.type !== "phone" && (
        <LocalizedField label={t("placeholder")} value={row.placeholder} onChange={(v) => onChange({ placeholder: v })} />
      )}
      <LocalizedField label={t("hint")} value={row.hint} onChange={(v) => onChange({ hint: v })} />

      {hasLength(row.type) && (
        <>
          <div>
            <FieldLabel htmlFor={`${id}-min`}>{t("min")}</FieldLabel>
            <Input
              id={`${id}-min`}
              type="number"
              min={0}
              max={5000}
              dir="ltr"
              value={row.min}
              onChange={(e) => onChange({ min: Math.max(0, Number(e.target.value) || 0) })}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${id}-max`}>{t("max")}</FieldLabel>
            <Input
              id={`${id}-max`}
              type="number"
              min={1}
              max={5000}
              dir="ltr"
              value={row.max}
              onChange={(e) => onChange({ max: Math.min(5000, Math.max(1, Number(e.target.value) || 1)) })}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- the page ---------------- */

export function ContactFormEditor({ initial, targets }: { initial: ContactFormConfig; targets: Targets }) {
  const t = useTranslations("admin.contactForm");
  const tc = useTranslations("admin.common");
  const locale = useLocale();
  const router = useRouter();
  const notify = useActionToast();
  const formRef = useRef<HTMLFormElement>(null);
  const nextId = useRef(0);
  const [draft, setDraft] = useState<Draft>(() => withRowIds(initial, "r"));
  const [open, setOpen] = useState("");
  const [previewLang, setPreviewLang] = useState<"en" | "ar">(locale === "ar" ? "ar" : "en");
  const [saving, start] = useTransition();
  const config = toConfig(draft);
  const { dirty, markSaved, savedValue } = useDirty(config);
  useFormGuard(dirty, formRef);

  const patch = (rowId: string, change: Partial<ContactFieldDef>) =>
    setDraft((prev) => ({ ...prev, fields: prev.fields.map((f) => (f.rowId === rowId ? { ...f, ...change } : f)) }));

  // Renaming a variable also renames it in the template, unless another field shares the old or new name.
  const rename = (rowId: string, key: string) =>
    setDraft((prev) => {
      const old = prev.fields.find((f) => f.rowId === rowId)?.key ?? "";
      const others = prev.fields.filter((f) => f.rowId !== rowId).map((f) => f.key);
      const safe = FIELD_KEY.test(old) && FIELD_KEY.test(key) && !others.includes(old) && !others.includes(key);
      const swap = (text: string) => (safe ? text.replace(new RegExp(`\\{\\{\\s*${old}\\s*\\}\\}`, "g"), `{{${key}}}`) : text);
      const swapL = (v: L) => ({ en: swap(v.en), ar: swap(v.ar) });
      return {
        ...prev,
        template: swapL(prev.template),
        emailSubject: swapL(prev.emailSubject),
        fields: prev.fields.map((f) => (f.rowId === rowId ? { ...f, key } : f)),
      };
    });

  const keyError = (row: Row) => {
    if (!FIELD_KEY.test(row.key)) return t("keyInvalid");
    if ((RESERVED_KEYS as readonly string[]).includes(row.key)) return t("keyReserved");
    if (draft.fields.some((f) => f.rowId !== row.rowId && f.key === row.key)) return t("keyTaken");
    return undefined;
  };

  const addField = () => {
    const used = new Set(draft.fields.map((f) => f.key));
    let n = 1;
    while (used.has(`field${n}`)) n++;
    const row: Row = { ...newField(`field${n}`), rowId: `n${nextId.current++}` };
    setDraft((prev) => ({ ...prev, fields: [...prev.fields, row] }));
    setOpen(row.rowId);
  };

  const removeField = async (row: Row) => {
    if (!(await confirmDialog({ title: t("deleteField"), confirmLabel: tc("delete"), destructive: true }))) return;
    setDraft((prev) => ({ ...prev, fields: prev.fields.filter((f) => f.rowId !== row.rowId) }));
  };

  const reset = async () => {
    if (!(await confirmDialog({ title: t("resetConfirm"), confirmLabel: t("resetAction") }))) return;
    setDraft(withRowIds(defaultContactForm, `d${nextId.current++}-`));
    setOpen("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const bad = draft.fields.find((f) => keyError(f));
    if (bad) {
      setOpen(bad.rowId);
      requestAnimationFrame(() => document.getElementById(`cf-${bad.rowId}-key`)?.focus());
      return;
    }
    start(async () => {
      if (notify(await saveContactForm(config))) {
        markSaved(config);
        router.refresh();
      }
    });
  };

  const enabled = draft.fields.filter((f) => f.enabled);
  const tokens = [
    ...enabled.map((f) => ({ token: `{{${f.key}}}`, label: tr(f.label, locale) || f.key })),
    { token: "{{fields}}", label: t("allFields") },
  ];
  const used = new Set(templateKeys(`${draft.template.en}\n${draft.template.ar}`));
  const unused = used.has("fields") ? [] : enabled.filter((f) => !used.has(f.key));
  const preview = buildMessage(config, sampleValues(enabled, previewLang), previewLang);

  return (
    <form ref={formRef} onSubmit={submit} className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <>
            <Button type="button" variant="outline" onClick={reset}>
              <RotateCcw />
              {t("reset")}
            </Button>
            <Button asChild variant="outline">
              <a href="/#contact" target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                {tc("viewOnSite")}
              </a>
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("fields")}</CardTitle>
          <CardDescription>{t("fieldsHint")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-lg border">
            <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
              {draft.fields.map((row, i) => (
                <AccordionItem key={row.rowId} value={row.rowId} className={cn(!row.enabled && "bg-muted/40")}>
                  <div className="flex items-center gap-1 pe-2">
                    <AccordionTrigger className="min-w-0 items-center gap-3 rounded-none px-4 py-3 hover:no-underline">
                      <div className={cn("min-w-0 flex-1", !row.enabled && "opacity-60")}>
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="truncate">{tr(row.label, locale) || t("untitled")}</span>
                          {row.required && (
                            <Badge variant="brand" className="px-1.5 text-[10px]">
                              {t("requiredBadge")}
                            </Badge>
                          )}
                          {!row.enabled && (
                            <Badge variant="secondary" className="px-1.5 text-[10px]">
                              {t("hidden")}
                            </Badge>
                          )}
                          {keyError(row) && <TriangleAlert className="size-3.5 text-destructive" aria-hidden />}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs font-normal text-muted-foreground">
                          <span>{t(`types.${row.type}`)}</span>
                          <code dir="ltr" className="font-mono">{`{{${row.key}}}`}</code>
                        </p>
                      </div>
                    </AccordionTrigger>
                    <Hint label={t("visible")}>
                      <Switch
                        checked={row.enabled}
                        aria-label={t("visible")}
                        onCheckedChange={(v) => patch(row.rowId, { enabled: v })}
                        className="me-2"
                      />
                    </Hint>
                    <Hint label={tc("moveUp")}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={tc("moveUp")}
                        disabled={i === 0}
                        onClick={() => setDraft((prev) => ({ ...prev, fields: move(prev.fields, i, -1) }))}
                      >
                        <ArrowUp />
                      </Button>
                    </Hint>
                    <Hint label={tc("moveDown")}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={tc("moveDown")}
                        disabled={i === draft.fields.length - 1}
                        onClick={() => setDraft((prev) => ({ ...prev, fields: move(prev.fields, i, 1) }))}
                      >
                        <ArrowDown />
                      </Button>
                    </Hint>
                    <Hint label={tc("delete")}>
                      <Button
                        type="button"
                        variant="ghost-destructive"
                        size="icon-sm"
                        aria-label={tc("delete")}
                        disabled={draft.fields.length === 1}
                        onClick={() => removeField(row)}
                      >
                        <Trash />
                      </Button>
                    </Hint>
                  </div>
                  <AccordionContent className="border-t bg-background/40 px-4 pt-5 pb-6">
                    <FieldEditor
                      row={row}
                      keyError={keyError(row)}
                      onChange={(change) => patch(row.rowId, change)}
                      onKey={(key) => rename(row.rowId, key)}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addField}
            className="w-full border-dashed text-muted-foreground hover:border-brand hover:text-brand"
          >
            <Plus />
            {t("addField")}
          </Button>
        </CardContent>
      </Card>

      <CardSection title={t("sending")} description={t("sendingHint")}>
        {CONTACT_CHANNELS.map((c) => {
          const target = c === "site" ? "" : targets[c];
          const missing = c !== "site" && !target;
          const missingText = t(
            c === "whatsapp" ? "missingWhatsapp" : c === "gmail" ? "missingGmail" : "missingEmail",
          );
          return (
            <div key={c} className="flex items-start gap-3 rounded-md border bg-background px-4 py-3">
              <span className="mt-0.5 text-muted-foreground [&_svg]:size-4">{CHANNEL_ICONS[c]}</span>
              <div className="min-w-0 flex-1">
                <Label htmlFor={`channel-${c}`} className="cursor-pointer">
                  {t(`channels.${c}`)}
                </Label>
                {missing && c === "gmail" ? (
                  // set in the server environment, not in the dashboard
                  <p className="mt-1 text-xs text-destructive">{missingText}</p>
                ) : missing ? (
                  <Link href="/admin/profile#part-contact" className="mt-1 block text-xs text-destructive underline underline-offset-2">
                    {missingText}
                  </Link>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {/* isolate the number / address so it reads correctly inside Arabic text */}
                    {t(`channelHints.${c}`, { target: `⁨${target}⁩` })}
                  </p>
                )}
              </div>
              <Switch
                id={`channel-${c}`}
                checked={draft.channels[c]}
                onCheckedChange={(v) => setDraft((prev) => ({ ...prev, channels: { ...prev.channels, [c]: v } }))}
              />
            </div>
          );
        })}

        <TemplateField
          label={t("template")}
          hint={t("templateHint")}
          value={draft.template}
          onChange={(template) => setDraft((prev) => ({ ...prev, template }))}
          tokens={tokens}
        />
        {unused.length > 0 && (
          <p className="-mt-2 flex items-start gap-2 text-xs text-amber-600 sm:col-span-2 dark:text-amber-400">
            <TriangleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
            {t("unused", { fields: unused.map((f) => tr(f.label, locale) || f.key).join(locale === "ar" ? "، " : ", ") })}
          </p>
        )}

        <LocalizedField
          label={t("emailSubject")}
          hint={t("emailSubjectHint")}
          value={draft.emailSubject}
          onChange={(emailSubject) => setDraft((prev) => ({ ...prev, emailSubject }))}
        />

        <div className="sm:col-span-2">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">
              {t("preview")} <span className="text-xs font-normal text-muted-foreground">· {t("previewHint")}</span>
            </p>
            <div className="flex rounded-md border p-0.5" role="group" aria-label={t("preview")}>
              {(["en", "ar"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  aria-pressed={previewLang === lang}
                  onClick={() => setPreviewLang(lang)}
                  className={cn(
                    "rounded px-2.5 py-1 text-xs transition-colors",
                    previewLang === lang ? "bg-brand-soft text-brand" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {lang === "en" ? tc("english") : tc("arabic")}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="mb-2 text-xs text-muted-foreground" dir={previewLang === "ar" ? "rtl" : "ltr"}>
              <span className="font-medium text-foreground">{t("emailSubject")}:</span> {preview.subject}
            </p>
            <div
              dir={previewLang === "ar" ? "rtl" : "ltr"}
              className="max-w-md rounded-xl rounded-ss-sm bg-background p-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm"
            >
              <Formatted text={preview.text} />
            </div>
          </div>
        </div>
      </CardSection>

      <SaveBar dirty={dirty} saving={saving} onDiscard={() => setDraft(withRowIds(savedValue(), `s${nextId.current++}-`))} />
    </form>
  );
}
