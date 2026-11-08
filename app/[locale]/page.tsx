import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/lib/content/store";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const { profile, projects } = await getContent();

  return (
    <main id="top">
      <Hero profile={profile} />
      <Work profile={profile} projects={projects} />
      <Services />
      <About />
      <Experience />
      <Contact profile={profile} />
    </main>
  );
}
