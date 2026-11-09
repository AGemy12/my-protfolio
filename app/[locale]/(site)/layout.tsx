import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
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
  const sections = SECTION_KEYS.filter((k) => settings.sections[k]);

  return (
    <>
      <Header name={tr(settings.name, locale)} sections={sections} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
