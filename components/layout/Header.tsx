"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { sectionIds } from "@/data/portfolio";
import Button from "@/components/ui/Button";
import { container } from "@/components/ui/Section";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import ThemeToggle, { iconButton } from "@/components/layout/ThemeToggle";
import PalettePicker from "@/components/layout/PaletteSwitcher";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 border-b bg-bg/90 backdrop-blur-md transition-colors duration-300 ${
        scrolled || open ? "border-line" : "border-transparent"
      }`}
    >
      <div className={`${container} flex h-[72px] items-center gap-6`}>
        <a href="#top" className="me-auto min-w-0 truncate font-head text-[1.35rem] tracking-[var(--head-tracking)]">
          {t("name")}
        </a>

        <nav aria-label={t("label")} className="hidden lg:block">
          <ul className="flex gap-7">
            {sectionIds.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={`border-b py-1 text-[15px] transition-colors duration-200 ${
                    active === id
                      ? "border-fg text-fg"
                      : "border-transparent text-muted hover:text-fg"
                  }`}
                >
                  {t(id)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <PalettePicker />
          <ThemeToggle />
          <div className="ms-1 hidden lg:block">
            <Button href="#contact" size="sm">
              {t("cta")}
            </Button>
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((value) => !value)}
            className={`${iconButton} lg:hidden`}
          >
            {open ? <CloseIcon className="h-[17px] w-[17px]" /> : <MenuIcon className="h-[17px] w-[17px]" />}
          </button>
        </div>
      </div>

      <nav
        id="site-menu"
        aria-label={t("label")}
        className={`${open ? "block" : "hidden"} border-t border-line bg-bg lg:hidden`}
      >
        <ul className={`${container} pb-5 pt-2`}>
          {sectionIds.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="block border-b border-line py-3.5 text-[17px]"
              >
                {t(id)}
              </a>
            </li>
          ))}
          <li className="pt-5 sm:hidden">
            <LanguageSwitcher />
          </li>
        </ul>
      </nav>
    </header>
  );
}
