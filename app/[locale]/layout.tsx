import type { Metadata, Viewport } from "next";
import { Geist_Mono, Readex_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { dirOf, routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { getSettings } from "@/lib/data";
import { tr } from "@/lib/types";
import { siteUrl } from "@/lib/utils";
import "../globals.css";

// Readex Pro (makkook.ai's typeface) covers Arabic and Latin, so one family serves both locales.
// It is a variable font (160–700), so every weight is available.
const readex = Readex_Pro({ subsets: ["arabic", "latin"], variable: "--font-readex", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#161313" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const s = await getSettings();
  const title = tr(s.seoTitle, locale) || tr(s.name, locale);
  const description = tr(s.seoDescription, locale) || tr(s.bio, locale);
  const image = s.ogImage || s.avatar;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s — ${tr(s.name, locale)}` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      title,
      description,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
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
  const dir = dirOf(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${readex.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh font-sans">
        <NextIntlClientProvider>
          <Providers dir={dir}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
