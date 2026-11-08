"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navLinks, profile } from "@/data/portfolio";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Header() {
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
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    document
      .querySelectorAll("section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 border-b bg-bg/90 backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="relative mx-auto flex h-[72px] max-w-[1120px] items-center justify-between gap-5 px-[18px] sm:px-6">
        <Link
          href="#top"
          className="whitespace-nowrap font-head text-[1.4rem] tracking-[-0.015em]"
        >
          {profile.name}
        </Link>

        <nav aria-label="Main">
          <ul
            id="site-menu"
            className={`${
              open ? "flex" : "hidden"
            } absolute inset-x-0 top-[72px] flex-col border-b border-line bg-bg px-[18px] pb-4 pt-2 md:static md:flex md:flex-row md:gap-8 md:border-0 md:bg-transparent md:p-0`}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-line py-3 text-fg transition-colors duration-200 md:border-0 md:py-0 md:text-[15px] ${
                    active === link.href
                      ? "md:text-fg"
                      : "md:text-muted md:hover:text-fg"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button href="#contact" size="sm" className="hidden md:inline-flex">
            Get in touch
          </Button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-line px-4 py-2 text-[14.5px] md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}
