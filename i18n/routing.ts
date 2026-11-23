import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
  // Always open in English; Arabic only when the visitor picks it (or follows an /ar link).
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const dirOf = (locale: string) => (locale === "ar" ? "rtl" : "ltr");
