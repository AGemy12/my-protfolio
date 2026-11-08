"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { sectionIds } from "@/data/portfolio";

const labels: Record<string, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  ar: { short: "ع", name: "العربية" },
};

/** The section currently in view, so switching language keeps the reader's place. */
function currentSection() {
  let current = "";
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id;
  }
  return current;
}

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="inline-flex flex-none gap-0.5 rounded-full border border-line bg-surface p-[3px]"
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <a
            key={l}
            href={`/${l}`}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            title={labels[l].name}
            onClick={(e) => {
              e.preventDefault();
              if (active) return;
              const section = currentSection();
              window.location.assign(`/${l}${section ? `#${section}` : ""}`);
            }}
            className={`grid h-[28px] min-w-[34px] place-items-center rounded-full px-2.5 text-[13px] transition-colors duration-200 ${
              active ? "bg-panel text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {labels[l].short}
          </a>
        );
      })}
    </div>
  );
}
