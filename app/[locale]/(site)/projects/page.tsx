import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectsGrid } from "@/components/site/projects-grid";
import { Eyebrow } from "@/components/site/section";
import { getCategories, getProjects } from "@/lib/data";

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
  const [projects, categories] = await Promise.all([getProjects(), getCategories()]);

  return (
    <div className="relative">
      <div className="relative mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl ltr:tracking-tight rtl:leading-[1.35]">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("pageLead")}</p>
        <div className="mt-12">
          <ProjectsGrid projects={projects} categories={categories} />
        </div>
      </div>
    </div>
  );
}
