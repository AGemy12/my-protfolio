import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectsGrid } from "@/components/site/projects-grid";
import { Eyebrow } from "@/components/site/section";
import { getProjects } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: t("pageTitle"),
    description: t("pageLead"),
    alternates: { canonical: `/${locale}/projects`, languages: { en: "/en/projects", ar: "/ar/projects" } },
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const projects = await getProjects();

  return (
    <div className="relative">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-96" />
      <div className="relative mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl rtl:leading-[1.3] rtl:tracking-normal">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("pageLead")}</p>
        <div className="mt-12">
          <ProjectsGrid projects={projects} />
        </div>
      </div>
    </div>
  );
}
