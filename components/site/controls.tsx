"use client";

import { useEffect, useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const SWITCHING_ATTR = "data-locale-switching";

/**
 * Language picker: a quiet pill with the current code (EN / ع) that opens a short list
 * of language names, the current one on a soft brand-tinted background.
 * Nothing in the trigger changes until the new page has rendered,
 * so the control and the page always switch together:
 *  - the other locales are prefetched up front, so the switch is near-instant;
 *  - while the route loads the page dims (html[data-locale-switching]) and comes back
 *    as one movement once the new locale is on screen.
 */
export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const current = LOCALE_LABELS[locale];

  // Warm the other locales' pages so choosing one doesn't wait on the network.
  const prefetchOthers = () => {
    for (const l of routing.locales) if (l !== locale) router.prefetch(pathname, { locale: l });
  };
  useEffect(() => {
    for (const l of routing.locales) if (l !== locale) router.prefetch(pathname, { locale: l });
  }, [router, pathname, locale]);

  // The new locale is on screen (or the switch was abandoned): bring the page back.
  useEffect(() => {
    if (!pending) document.documentElement.removeAttribute(SWITCHING_ATTR);
  }, [pending, locale]);

  const switchTo = (next: Locale) => {
    if (next === locale || pending) return;
    document.documentElement.setAttribute(SWITCHING_ATTR, "");
    // keep the current page and its hash (#projects) when switching
    const hash = window.location.hash;
    startTransition(() => {
      router.replace(`${pathname}${hash}`, { locale: next, scroll: false });
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onPointerEnter={prefetchOthers}
          aria-label={`${t("language")}: ${current.name}`}
          aria-busy={pending || undefined}
          className={cn(
            "group inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border bg-card/60 ps-3 pe-2.5 text-foreground/85 shadow-xs outline-none",
            "transition-[color,border-color,background-color] duration-200",
            "hover:border-brand/60 hover:text-heading data-[state=open]:border-brand/60 data-[state=open]:text-heading",
            "focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-busy:cursor-wait",
            className,
          )}
        >
          <span
            lang={locale}
            className={cn(
              "min-w-4 text-center leading-none font-semibold",
              locale === "en" ? "font-mono text-xs tracking-wider" : "text-sm",
            )}
          >
            {current.short}
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180",
              pending && "animate-pulse",
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-40 rounded-xl border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur-xl"
      >
        <DropdownMenuLabel className="px-2 pt-1 pb-2 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          {t("language")}
        </DropdownMenuLabel>
        {routing.locales.map((l) => {
          const active = l === locale;
          return (
            <DropdownMenuItem
              key={l}
              lang={l}
              onSelect={() => switchTo(l)}
              aria-current={active || undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm",
                active
                  ? "cursor-default bg-brand/10 font-medium text-brand focus:bg-brand/15 focus:text-brand"
                  : "cursor-pointer text-foreground/85",
              )}
            >
              {LOCALE_LABELS[l].name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
