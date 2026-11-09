"use client";

import { useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { ChevronsUpDown, FileText, ImagePlus, Plus, Upload, X } from "lucide-react";
import { ServiceIcon, SkillIcon, serviceIcons, skillIcons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { L, LList } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FieldLabel } from "./ui";

/* ---------------- uploads ---------------- */

async function uploadFile(file: File) {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-");
  const blob = await upload(`portfolio/${safeName}`, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    multipart: file.size > 5 * 1024 * 1024,
  });
  return blob.url;
}

function useUploader() {
  const t = useTranslations("admin.common");
  const [busy, setBusy] = useState(false);
  const run = async (files: File[]) => {
    setBusy(true);
    try {
      return await Promise.all(files.map(uploadFile));
    } catch (error) {
      toast.error(t("uploadFailed"), { description: (error as Error).message });
      return [];
    } finally {
      setBusy(false);
    }
  };
  return { busy, run };
}

const isPdf = (url: string) => /\.pdf($|\?)/i.test(url);

export function FileField({
  label,
  value,
  onChange,
  accept = "image/*",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}) {
  const t = useTranslations("admin.common");
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const { busy, run } = useUploader();

  return (
    <div className="sm:col-span-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed bg-muted">
          {value && !isPdf(value) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : value ? (
            <FileText className="size-8 text-brand" />
          ) : (
            <ImagePlus className="size-6 text-muted-foreground" />
          )}
          {busy && (
            <div className="absolute inset-0 grid place-items-center bg-background/70">
              <Spinner className="size-5" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <LoadingButton
              type="button"
              variant="outline"
              size="sm"
              loading={busy}
              icon={<Upload />}
              onClick={() => input.current?.click()}
            >
              {busy ? t("uploading") : t("upload")}
            </LoadingButton>
            {value && (
              <>
                <Button asChild variant="ghost" size="sm">
                  <a href={value} target="_blank" rel="noopener noreferrer">
                    {t("open")}
                  </a>
                </Button>
                <Button type="button" variant="ghost-destructive" size="sm" onClick={() => onChange("")}>
                  {t("remove")}
                </Button>
              </>
            )}
          </div>
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("pasteUrl")}
            dir="ltr"
            className="h-8 text-xs md:text-xs"
          />
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept={accept}
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const [url] = await run([file]);
          if (url) onChange(url);
        }}
      />
    </div>
  );
}

export function GalleryField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const t = useTranslations("admin.common");
  const input = useRef<HTMLInputElement>(null);
  const { busy, run } = useUploader();
  return (
    <div className="sm:col-span-2">
      <FieldLabel hint={`${value.length} ${t("items")}`}>{label}</FieldLabel>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {value.map((src, i) => (
          <div key={src + i} className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="size-full object-cover" />
            <Button
              type="button"
              size="icon-xs"
              variant="secondary"
              aria-label={t("remove")}
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute end-1.5 top-1.5 rounded-full opacity-0 shadow transition group-hover:opacity-100 focus-visible:opacity-100"
            >
              <X />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => input.current?.click()}
          disabled={busy}
          aria-label={t("upload")}
          className="aspect-[4/3] h-auto border-dashed text-muted-foreground hover:border-brand hover:text-brand"
        >
          {busy ? <Spinner className="size-5" /> : <Plus className="size-5" />}
        </Button>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (!files.length) return;
          const urls = await run(files);
          if (urls.length) onChange([...value, ...urls]);
        }}
      />
    </div>
  );
}

/* ---------------- text ---------------- */

/**
 * Field frame with the language tag as its own segment (not an overlay),
 * laid out in the field's own direction, so it can never cover the text.
 */
function LangBox({
  lang,
  dir,
  multiline,
  children,
}: {
  lang: string;
  dir: "ltr" | "rtl";
  multiline?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      dir={dir}
      className="flex w-full overflow-hidden rounded-md border border-input shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-[[aria-invalid=true]]:border-destructive dark:bg-input/30"
    >
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 select-none justify-center border-e border-input bg-muted/50 px-2 font-mono text-[10px] font-medium uppercase text-muted-foreground",
          multiline ? "items-start pt-2.5" : "items-center",
        )}
      >
        {lang}
      </span>
      {children}
    </div>
  );
}

/** Strips the standalone field chrome so the control sits flush inside LangBox. */
const inBox = "rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent";

export function LocalizedField({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
  required,
}: {
  label: string;
  value: L;
  onChange: (v: L) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) {
  const t = useTranslations("admin.common");
  const langs = [
    { key: "en" as const, label: t("english"), dir: "ltr" as const },
    { key: "ar" as const, label: t("arabic"), dir: "rtl" as const },
  ];
  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-2 text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </legend>
      <div className="grid gap-3 md:grid-cols-2">
        {langs.map((lang) => {
          const common = {
            value: value?.[lang.key] ?? "",
            dir: lang.dir,
            lang: lang.key,
            "aria-label": `${label} (${lang.label})`,
            required: required && lang.key === "en",
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              onChange({ ...value, [lang.key]: e.target.value }),
          };
          return (
            <LangBox key={lang.key} lang={lang.key} dir={lang.dir} multiline={multiline}>
              {multiline ? (
                <Textarea rows={rows} className={cn("min-h-0 resize-y", inBox)} {...common} />
              ) : (
                <Input className={inBox} {...common} />
              )}
            </LangBox>
          );
        })}
      </div>
    </fieldset>
  );
}

export function LocalizedListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: LList;
  onChange: (v: LList) => void;
}) {
  const t = useTranslations("admin.common");
  const toText = (list: string[] = []) => list.join("\n");
  const toList = (text: string) =>
    text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  const [draft, setDraft] = useState({ en: toText(value?.en), ar: toText(value?.ar) });

  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-2 flex w-full justify-between text-sm font-medium">
        {label}
        <span className="text-xs font-normal text-muted-foreground">{t("onePerLine")}</span>
      </legend>
      <div className="grid gap-3 md:grid-cols-2">
        {(["en", "ar"] as const).map((lang) => (
          <LangBox key={lang} lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} multiline>
            <Textarea
              rows={5}
              dir={lang === "ar" ? "rtl" : "ltr"}
              lang={lang}
              aria-label={`${label} (${lang})`}
              className={cn("min-h-0 resize-y", inBox)}
              value={draft[lang]}
              onChange={(e) => {
                const next = { ...draft, [lang]: e.target.value };
                setDraft(next);
                onChange({ en: toList(next.en), ar: toList(next.ar) });
              }}
            />
          </LangBox>
        ))}
      </div>
    </fieldset>
  );
}

export function TagsField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const t = useTranslations("admin.common");
  const id = useId();
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) onChange([...new Set([...value, ...parts])]);
    setDraft("");
  };
  return (
    <div className="sm:col-span-2">
      <FieldLabel htmlFor={id} hint={t("addTag")}>
        {label}
      </FieldLabel>
      <div
        dir="ltr"
        className="flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:bg-input/30"
      >
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 rounded-md py-1 ps-2 pe-1 font-mono">
            {tag}
            <button
              type="button"
              aria-label={`${t("remove")} ${tag}`}
              onClick={() => onChange(value.filter((v) => v !== tag))}
              className="rounded-sm text-muted-foreground transition hover:text-destructive"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={add}
          className="min-w-32 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
        />
      </div>
    </div>
  );
}

/* ---------------- switch ---------------- */

export function SwitchField({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border bg-background px-4 py-3">
      <Label htmlFor={id} className="flex-1 cursor-pointer">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

/* ---------------- icon picker ---------------- */

export function IconPicker({
  label,
  value,
  onChange,
  kind,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  kind: "skill" | "service";
}) {
  const t = useTranslations("admin.common");
  const id = useId();
  const [open, setOpen] = useState(false);
  const names = Object.keys(kind === "skill" ? skillIcons : serviceIcons);
  const Preview = kind === "skill" ? SkillIcon : ServiceIcon;

  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start gap-3 font-normal"
          >
            <Preview name={value} className="size-4 text-brand" />
            <span className="flex-1 truncate text-start font-mono text-xs">{value || t("none")}</span>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-0">
          <Command>
            <CommandInput placeholder={t("search")} />
            <CommandList className="max-h-64">
              <CommandEmpty>{t("empty")}</CommandEmpty>
              <CommandGroup className="[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-6 [&_[cmdk-group-items]]:gap-1">
                {names.map((n) => (
                  <CommandItem
                    key={n}
                    value={n}
                    title={n}
                    onSelect={() => {
                      onChange(n);
                      setOpen(false);
                    }}
                    className={cn(
                      "aspect-square justify-center p-0",
                      n === value && "bg-brand-soft [&_svg]:text-brand data-[selected=true]:bg-brand-soft",
                    )}
                  >
                    <Preview name={n} className="size-5" />
                    <span className="sr-only">{n}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
