"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";

/**
 * Protects unsaved edits: warns before the tab is closed or reloaded while the
 * form is dirty, and saves with Ctrl/⌘ + S.
 */
export function useFormGuard(dirty: boolean, form: React.RefObject<HTMLFormElement | null>) {
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        form.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [form]);
}

/** Tracks whether `value` differs from the last saved snapshot. */
export function useDirty<T>(value: T) {
  const [saved, setSaved] = useState(() => JSON.stringify(value));
  const dirty = JSON.stringify(value) !== saved;
  return {
    dirty,
    markSaved: (next: T = value) => setSaved(JSON.stringify(next)),
    savedValue: () => JSON.parse(saved) as T,
  };
}

/**
 * Sticky bar at the bottom of a form: says whether there are unsaved changes,
 * and offers Discard and Save in the same place on every screen.
 */
export function SaveBar({
  dirty,
  saving,
  onDiscard,
}: {
  dirty: boolean;
  saving: boolean;
  onDiscard: () => void;
}) {
  const t = useTranslations("admin.common");
  return (
    <div className="sticky bottom-4 z-20 mt-6">
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-xl border bg-popover/95 px-4 py-3 shadow-xl backdrop-blur transition-colors",
          dirty && "border-brand/50",
        )}
      >
        <p className="flex flex-1 items-center gap-2 text-sm" role="status" aria-live="polite">
          {dirty ? (
            <>
              <span className="size-2 rounded-full bg-brand" aria-hidden />
              {t("unsaved")}
            </>
          ) : (
            <>
              <Check className="size-4 text-emerald-500" aria-hidden />
              <span className="text-muted-foreground">{t("allSaved")}</span>
            </>
          )}
          <kbd className="ms-2 hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            Ctrl + S
          </kbd>
        </p>
        <Button type="button" variant="ghost" disabled={!dirty || saving} onClick={onDiscard}>
          <RotateCcw />
          {t("discard")}
        </Button>
        <LoadingButton type="submit" loading={saving} disabled={!dirty && !saving}>
          {saving ? t("saving") : t("save")}
        </LoadingButton>
      </div>
    </div>
  );
}
