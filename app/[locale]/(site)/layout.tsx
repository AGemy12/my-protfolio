import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ScrollRestore } from "@/components/site/scroll-restore";
import { ScrollTop } from "@/components/site/scroll-top";
import { getSettings } from "@/lib/data";
import { SECTION_KEYS, tr } from "@/lib/types";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  // Skills live in the hero marquee now, so they get no nav entry of their own.
  const sections = SECTION_KEYS.filter((k) => settings.sections[k] && k !== "skills");

  return (
    <>
      <Header name={tr(settings.name, locale)} sections={sections} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
      <ScrollTop />
      <ScrollRestore />
      {/* Visitor counts and real-user page speed, on Vercel only (no-ops elsewhere). The dashboard isn't tracked. */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
