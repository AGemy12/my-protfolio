import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isRtl, routing } from "@/i18n/routing";
import { AppearanceProvider } from "@/contexts/ThemeContext";
import { appearanceScript } from "@/contexts/appearanceScript";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getContent } from "@/lib/content/store";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

// Pages are static and refreshed right after each dashboard save. The daily
// refresh is a safety net, e.g. if the database was down during a build.
export const revalidate = 86400;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar", "x-default": "/en" },
    },
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const { profile, defaultPalette } = await getContent();

  return (
    // Font variables sit on <html> because the typography tokens in
    // globals.css are defined on :root and reference them.
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: appearanceScript(defaultPalette) }} />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider>
          <AppearanceProvider fallbackPalette={defaultPalette}>
            <Header />
            {children}
            <Footer profile={profile} />
          </AppearanceProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
