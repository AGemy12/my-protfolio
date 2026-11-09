"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/navigation";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-all duration-300",
        scrolled ? "bg-background/75 backdrop-blur-xl" : "border-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:inset-s-4 focus:top-3 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {t("skip")}
      </a>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={name}
          className="group flex items-center gap-2.5 font-semibold"
        >
          <LogoMark className="text-foreground" />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {sections.map((id) => (
            <li key={id}>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full text-muted-foreground hover:text-foreground"
              >
                <Link href={`/#${id}`}>{t(id)}</Link>
              </Button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full md:hidden"
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
                {sections.map((id) => (
                  <li key={id}>
                    <Button
                      asChild
                      variant="ghost"
                      size="lg"
                      className="h-12 w-full justify-start px-4 text-lg font-medium"
                    >
                      <Link href={`/#${id}`} onClick={() => setOpen(false)}>
                        {t(id)}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
