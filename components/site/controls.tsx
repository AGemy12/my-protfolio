"use client";

import { useEffect, useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { Monitor, Moon, Sun } from "lucide-react";
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
import { cn } from "@/lib/utils";

const iconButton = "rounded-full bg-card/60 hover:border-brand hover:text-brand dark:bg-card/60";

const THEME_OPTIONS = [
  { value: "light", icon: Sun, label: "themeLight" },
  { value: "dark", icon: Moon, label: "themeDark" },
  { value: "system", icon: Monitor, label: "themeSystem" },
] as const;

/**
 * Theme picker: the trigger shows the current choice (sun / moon, or a screen when
 * following the system) and opens a short list — Light, Dark, System.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("nav");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // `theme` is unknown on the server; until mount, let the CSS pick sun or moon.
  const current = mounted ? (theme ?? "system") : undefined;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("theme")}
          className={cn(iconButton, "data-[state=open]:border-brand data-[state=open]:text-brand", className)}
        >
          {current === "system" ? (
            <Monitor />
          ) : (
            <>
              <Sun className="scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-40 rounded-xl border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur-xl"
      >
        <DropdownMenuLabel className="px-2 pt-1 pb-2 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          {t("theme")}
        </DropdownMenuLabel>
        {THEME_OPTIONS.map(({ value, icon: Icon, label }) => {
          const active = value === current;
          return (
            <DropdownMenuItem
              key={value}
              onSelect={() => setTheme(value)}
              aria-current={active || undefined}
              className={cn(
                "gap-2.5 rounded-lg px-3 py-2 text-sm",
                active
                  ? "cursor-default bg-brand/10 font-medium text-brand focus:bg-brand/15 focus:text-brand [&_svg]:text-brand"
                  : "cursor-pointer text-foreground/85",
              )}
            >
              <Icon aria-hidden className="size-4" />
              {t(label)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const LOCALE_LABELS: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  ar: { short: "ع", name: "العربية" },
};

const SWITCHING_ATTR = "data-locale-switching";

/**
 * Language picker: a round button (same as the theme picker) with the current code (EN / ع) that opens a short list
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
        <Button
          type="button"
          variant="outline"
          size="icon"
          onPointerEnter={prefetchOthers}
          aria-label={`${t("language")}: ${current.name}`}
          aria-busy={pending || undefined}
          className={cn(
            iconButton,
            "data-[state=open]:border-brand data-[state=open]:text-brand aria-busy:cursor-wait",
            className,
          )}
        >
          <span
            lang={locale}
            className={cn(
              "leading-none font-semibold",
              locale === "en" ? "font-mono text-xs tracking-wider" : "text-sm",
              pending && "animate-pulse",
            )}
          >
            {current.short}
          </span>
        </Button>
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
