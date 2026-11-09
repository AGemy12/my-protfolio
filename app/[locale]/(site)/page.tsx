import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import {
  About, ContactSection, ExperienceSection, ProjectsSection, ServicesSection, Skills,
} from "@/components/site/sections";
import { getExperience, getProjects, getServices, getSettings, getSkills } from "@/lib/data";
import { tr } from "@/lib/types";
import { siteUrl } from "@/lib/utils";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [settings, projects, experience, skills, services] = await Promise.all([
    getSettings(),
    getProjects(),
    getExperience(),
    getSkills(),
    getServices(),
  ]);
  const show = settings.sections;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: tr(settings.name, locale),
    jobTitle: tr(settings.role, locale),
    email: settings.email ? `mailto:${settings.email}` : undefined,
    url: `${siteUrl()}/${locale}`,
    image: settings.avatar ? new URL(settings.avatar, siteUrl()).toString() : undefined,
    sameAs: [settings.github, settings.linkedin, settings.x].filter(Boolean),
    knowsAbout: skills.map((s) => s.name),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero settings={settings} projects={projects} />
      {show.about && <About settings={settings} />}
      {show.skills && skills.length > 0 && <Skills skills={skills} />}
      {show.experience && experience.length > 0 && <ExperienceSection items={experience} />}
      {show.projects && projects.length > 0 && <ProjectsSection projects={projects} />}
      {show.services && services.length > 0 && <ServicesSection services={services} />}
      {show.contact && <ContactSection settings={settings} />}
    </>
  );
}
