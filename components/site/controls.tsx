"use client";

import { useEffect, useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const iconButton = "rounded-full bg-card/60 hover:border-brand hover:text-brand dark:bg-card/60";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("nav");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("toggleTheme")}
          onClick={() => setTheme(dark ? "light" : "dark")}
          className={cn(iconButton, className)}
        >
          <Sun className="scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t("toggleTheme")}</TooltipContent>
    </Tooltip>
  );
}

const LOCALE_LABELS: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  ar: { short: "ع", name: "العربية" },
};

/**
 * Segmented EN | ع pill with a sliding thumb. The thumb moves immediately on click
 * (optimistic) while the route switches in a transition.
 */
export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [requested, setRequested] = useState<Locale>(locale);
  // while switching, show the requested locale; otherwise trust the real one
  const target = pending ? requested : locale;

  const locales = routing.locales;
  const activeIndex = Math.max(0, locales.indexOf(target));

  const switchTo = (next: Locale) => {
    if (next === locale || pending) return;
    setRequested(next);
    startTransition(() => {
      // keep the hash (#projects) and the current page when switching
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      router.replace(pathname, { locale: next, scroll: false });
      if (hash) setTimeout(() => (window.location.hash = hash), 50);
    });
  };

  return (
    <div
      role="radiogroup"
      aria-label={t("switchLanguage")}
      aria-busy={pending || undefined}
      className={cn(
        "relative inline-grid h-9 shrink-0 grid-cols-2 items-center rounded-full border bg-card/60 p-0.5 shadow-xs",
        "transition-colors hover:border-brand/50",
        pending && "opacity-80",
        className,
      )}
    >
      {/* sliding thumb — logical inset so it follows the reading direction */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full bg-brand shadow-sm transition-[inset-inline-start] duration-300 ease-out"
        style={{ insetInlineStart: activeIndex === 0 ? "2px" : "50%" }}
      />
      {locales.map((l) => {
        const active = l === target;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={LOCALE_LABELS[l].name}
            title={LOCALE_LABELS[l].name}
            lang={l}
            onClick={() => switchTo(l)}
            className={cn(
              "relative z-10 grid h-full min-w-9 place-items-center rounded-full px-2.5 text-xs font-semibold transition-colors duration-300",
              "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              l === "ar" ? "font-(family-name:--font-arabic) text-sm leading-none" : "font-mono tracking-wide",
              active ? "text-brand-foreground" : "cursor-pointer text-muted-foreground hover:text-foreground",
            )}
          >
            {LOCALE_LABELS[l].short}
          </button>
        );
      })}
    </div>
  );
}
