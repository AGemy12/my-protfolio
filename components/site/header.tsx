"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { dirOf } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";
import { LocaleSwitch, ThemeToggle } from "./controls";

const HOME = "home";

const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

/** Waits this long for a jump's scroll to start, and for a moving scroll to settle. */
const JUMP_START_MS = 450;
const SCROLL_SETTLE_MS = 160;

/** Swap the #hash without a new history entry, keeping the router's own history state. */
function setHash(id: string) {
  const hash = id === HOME ? "" : `#${id}`;
  if (window.location.hash === hash) return;
  history.replaceState(history.state, "", window.location.pathname + window.location.search + hash);
}

/**
 * Which nav entry matches what's on screen.
 *
 * On the home page the scroll position is the only source of truth: the section
 * under a reading line a third of the way down the viewport ("home" above the
 * first one). Near the bottom the line slides down so short closing sections still
 * get their turn.
 *
 * A jump (any link to #id, nav or not, or arriving with a #hash) shows its target
 * right away and holds it only while that scroll is moving, so the highlight doesn't
 * flicker through the sections in between; once the page settles, or if it never
 * moves, the position decides again. A #hash alone never decides.
 *
 * After the person scrolls on their own, the #hash follows the highlighted section,
 * so the address bar (and a reload) never points at a section that isn't on screen.
 *
 * On /projects it is "projects".
 */
function useActiveSection(ids: string[]) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string>(HOME);
  const key = ids.join(",");

  useEffect(() => {
    if (!onHome) return;
    const known = key.split(",");
    // Looked up on every pass, not once: the page streams in after the header has
    // hydrated, so the sections may not exist yet when this effect first runs.
    const sections = () =>
      known.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);

    let held: string | null = null;
    let holdTimer = 0;
    let frame = 0;
    let userScrolled = false;

    const measure = () => {
      const vh = window.innerHeight;
      const left = document.documentElement.scrollHeight - (window.scrollY + vh);
      // a third of the way down, sliding to the bottom edge over the last 2/3 screen of scroll
      const line = vh / 3 + Math.max(0, (vh * 2) / 3 - left);
      let current = HOME;
      for (const el of sections()) if (el.getBoundingClientRect().top <= line - 1) current = el.id;
      setActive(current);
      if (userScrolled) setHash(current);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    const letGo = () => {
      clearTimeout(holdTimer);
      held = null;
      update();
    };
    const hold = (id: string) => {
      held = id;
      setActive(id);
      clearTimeout(holdTimer);
      holdTimer = window.setTimeout(letGo, JUMP_START_MS);
    };

    const onScroll = () => {
      if (!held) return update();
      // still travelling: keep the target until the scroll comes to rest
      clearTimeout(holdTimer);
      holdTimer = window.setTimeout(letGo, SCROLL_SETTLE_MS);
    };
    const onUserScroll = () => {
      userScrolled = true;
      if (held) letGo();
    };
    const onKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) onUserScroll();
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self")) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new tab / window
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname) return;
      const id = a.hasAttribute("data-nav-home") ? HOME : decodeURIComponent(url.hash.slice(1));
      if (id !== HOME && !known.includes(id)) return;
      hold(id);
      // Scroll here instead of leaving it to the router: when the address already ends in
      // this #hash (after a jump, then back to the top with the button or the scrollbar),
      // the router sees the same URL and doesn't move. Runs in the capture phase, so the
      // link's own navigation is skipped (next/link ignores default-prevented clicks).
      const target = id === HOME ? null : document.getElementById(id);
      if (id !== HOME && !target) return;
      e.preventDefault();
      setHash(id);
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      if (target) target.scrollIntoView({ behavior, block: "start" });
      else window.scrollTo({ top: 0, behavior });
    };

    // Arriving with /#section: show it while the browser scrolls there — but only then.
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (known.includes(hash)) hold(hash);
    else update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("wheel", onUserScroll, { passive: true });
    window.addEventListener("touchmove", onUserScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(holdTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      window.removeEventListener("wheel", onUserScroll);
      window.removeEventListener("touchmove", onUserScroll);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick, true);
    };
  }, [key, onHome]);

  if (onHome) return { active, onHome };
  return { active: pathname.startsWith("/projects") ? "projects" : null, onHome };
}

export function Header({
  name,
  sections,
}: {
  name: string;
  sections: string[];
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { active, onHome } = useActiveSection(sections);
  const items = [HOME, ...sections];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hrefOf = (id: string) => (id === HOME ? "/" : `/#${id}`);

  // "Home" on the home page just glides back to the top and drops any #hash.
  const goHome = (e: React.MouseEvent) => {
    if (!onHome) return;
    e.preventDefault();
    setHash(HOME);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:inset-s-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {t("skip")}
      </a>
      <nav
        className={cn(
          "mx-auto flex h-16 max-w-6xl items-center gap-4 rounded-2xl border px-4 transition-[background-color,box-shadow,border-color] duration-300 sm:px-5",
          "border-border/80 bg-card/70 backdrop-blur-xl dark:border-white/8 dark:bg-[#1a1716]/75",
          scrolled
            ? "shadow-[0_12px_40px_-12px_rgb(0_0_0/0.35)]"
            : "shadow-[0_8px_30px_-16px_rgb(0_0_0/0.25)]",
        )}
      >
        <Link
          href="/"
          onClick={goHome}
          data-nav-home
          aria-label={name}
          className="flex shrink-0 items-center gap-2.5 font-semibold"
        >
          <LogoMark className="text-heading" />
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {items.map((id) => {
            const isActive = id === active;
            return (
              <li key={id}>
                <Link
                  href={hrefOf(id)}
                  onClick={id === HOME ? goHome : undefined}
                  data-nav-home={id === HOME || undefined}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative inline-flex h-10 items-center px-3.5 text-sm font-medium transition-colors",
                    "after:absolute after:inset-x-3.5 after:bottom-0.5 after:h-px after:origin-center after:rounded-full after:bg-linear-to-r after:from-transparent after:via-brand after:to-transparent after:transition-transform after:duration-300",
                    isActive
                      ? "text-brand after:scale-x-100"
                      : "text-foreground/75 after:scale-x-0 hover:text-heading",
                  )}
                >
                  {t(id)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ms-auto flex shrink-0 items-center gap-2 lg:ms-0">
          <span aria-hidden className="me-2 hidden h-7 w-px bg-border lg:block" />
          <LocaleSwitch />
          <ThemeToggle />
          {sections.includes("contact") && (
            <Button
              asChild
              size="sm"
              variant="ember"
              className="ms-1 hidden h-10 rounded-full px-5 text-xs font-bold tracking-[0.12em] uppercase sm:inline-flex"
            >
              <Link href="/#contact">{t("cta")}</Link>
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full lg:hidden"
                aria-label={t("menu")}
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={dirOf(locale) === "rtl" ? "right" : "left"}
              className="w-80 max-w-[85vw]"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2.5">
                  <LogoMark className="text-foreground" />
                  {name}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  {t("menu")}
                </SheetDescription>
              </SheetHeader>
              <ul className="flex flex-col gap-1 px-4">
                {items.map((id) => {
                  const isActive = id === active;
                  return (
                    <li key={id}>
                      <Button
                        asChild
                        variant="ghost"
                        size="lg"
                        className={cn(
                          "h-12 w-full justify-start px-4 text-lg font-medium",
                          isActive && "bg-brand/10 text-brand hover:bg-brand/15 hover:text-brand",
                        )}
                      >
                        <Link
                          href={hrefOf(id)}
                          data-nav-home={id === HOME || undefined}
                          aria-current={isActive ? "location" : undefined}
                          onClick={(e) => {
                            if (id === HOME) goHome(e);
                            setOpen(false);
                          }}
                        >
                          {t(id)}
                        </Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
