"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink, RotateCcw, Search } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { saveSiteTexts } from "@/lib/actions/content";
import { TEXT_NAMESPACES, type BuiltInTexts, type TextOverrides } from "@/lib/site-texts";
import type { L } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EmptyState, PageHeader } from "./ui";
import { LocalizedField } from "./fields";
import { useActionToast } from "./resource-form";
import { SaveBar, useDirty, useFormGuard } from "./save-bar";

/** Texts longer than this get a multi-line box. */
const LONG = 70;

export function SiteTextsEditor({
  builtIn,
  args,
  initial,
}: {
  builtIn: BuiltInTexts;
  args: Record<string, string[]>;
  initial: TextOverrides;
}) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const notify = useActionToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<TextOverrides>(initial);
  const [query, setQuery] = useState("");
  const [changedOnly, setChangedOnly] = useState(false);
  const [open, setOpen] = useState<string[]>([]);
  const [saving, start] = useTransition();
  const { dirty, markSaved, savedValue } = useDirty(values);
  useFormGuard(dirty, formRef);

  const isChanged = (key: string) => Boolean(values[key]?.en.trim() || values[key]?.ar.trim());

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const keys = Object.keys(builtIn.en);
    return TEXT_NAMESPACES.map((ns) => ({
      ns,
      keys: keys.filter((key) => {
        if (!key.startsWith(`${ns}.`)) return false;
        if (changedOnly && !(values[key]?.en.trim() || values[key]?.ar.trim())) return false;
        if (!q) return true;
        return [key, builtIn.en[key], builtIn.ar[key], values[key]?.en, values[key]?.ar].some((s) =>
          s?.toLowerCase().includes(q),
        );
      }),
    })).filter((g) => g.keys.length);
  }, [builtIn, values, query, changedOnly]);

  // While searching or filtering, every group with a match opens by itself.
  const filtering = Boolean(query.trim()) || changedOnly;
  const openGroups = filtering ? groups.map((g) => g.ns) : open;

  const set = (key: string, value: L) =>
    setValues((prev) => {
      const next = { ...prev };
      // an emptied text is the same as never changing it, so it doesn't count as unsaved
      if (value.en || value.ar) next[key] = value;
      else delete next[key];
      return next;
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    start(async () => {
      if (notify(await saveSiteTexts(values))) {
        markSaved(values);
        router.refresh();
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={submit}>
      <PageHeader
        title={t("siteTexts.title")}
        description={t("siteTexts.description")}
        actions={
          <Button asChild variant="outline">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              {t("common.viewOnSite")}
            </a>
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="relative max-w-sm flex-1 basis-60">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("siteTexts.search")}
            className="ps-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="changed-only" checked={changedOnly} onCheckedChange={setChangedOnly} />
          <Label htmlFor="changed-only">
            {t("siteTexts.changedOnly")} ({Object.keys(values).length})
          </Label>
        </div>
      </div>

      {groups.length === 0 ? (
        <EmptyState>{t("siteTexts.noMatch")}</EmptyState>
      ) : (
        <Card className="gap-0 px-5 py-1">
          <Accordion type="multiple" value={openGroups} onValueChange={(v) => !filtering && setOpen(v)}>
            {groups.map(({ ns, keys }) => {
              const changed = keys.filter(isChanged).length;
              return (
                <AccordionItem key={ns} value={ns}>
                  <AccordionTrigger className="text-base">
                    <span className="flex flex-1 items-center gap-2">
                      {t(`siteTexts.groups.${ns}`)}
                      <span className="font-mono text-xs font-normal text-muted-foreground">{keys.length}</span>
                      {changed > 0 && <Badge variant="brand">{t("siteTexts.changedCount", { count: changed })}</Badge>}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="grid gap-6 pt-2 pb-6">
                    {keys.map((key) => {
                      const original: L = { en: builtIn.en[key], ar: builtIn.ar[key] ?? "" };
                      const placeholders = args[key];
                      return (
                        <div key={key} className="grid gap-1.5">
                          <LocalizedField
                            label={locale === "ar" ? original.ar || original.en : original.en}
                            hint={key}
                            value={values[key] ?? { en: "", ar: "" }}
                            placeholder={original}
                            multiline={Math.max(original.en.length, original.ar.length) > LONG}
                            rows={2}
                            onChange={(v) => set(key, v)}
                          />
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                            <span>
                              {placeholders && (
                                <>
                                  {t("siteTexts.keep")}{" "}
                                  {placeholders.map((a) => (
                                    <code key={a} dir="ltr" className="mx-0.5 rounded bg-muted px-1 font-mono">
                                      {`{${a}}`}
                                    </code>
                                  ))}
                                </>
                              )}
                            </span>
                            {isChanged(key) && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => set(key, { en: "", ar: "" })}
                              >
                                <RotateCcw className="size-3.5" />
                                {t("siteTexts.restore")}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Card>
      )}

      <SaveBar dirty={dirty} saving={saving} onDiscard={() => setValues(savedValue())} />
    </form>
  );
}
