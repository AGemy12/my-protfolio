import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { getSiteTexts } from "@/lib/data";
import { applyTexts } from "@/lib/site-texts";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const [messages, overrides] = await Promise.all([
    import(`../messages/${locale}.json`).then((m) => m.default),
    getSiteTexts(),
  ]);
  // Texts changed in the dashboard replace the built-in ones, on the server and in the browser.
  return { locale, messages: applyTexts(messages, overrides, locale) };
});
