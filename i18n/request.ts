import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { getContent } from "@/lib/content/store";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Text is edited from the admin dashboard; messages/*.json are the defaults.
  const { messages } = await getContent();

  return { locale, messages: messages[locale] };
});
