import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ProjectDetails } from "@/components/site/project-details";
import { ProjectCard } from "@/components/site/project-card";
import { getProject, getProjects, getSettings } from "@/lib/data";
import { tr } from "@/lib/types";
import { siteUrl } from "@/lib/utils";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const title = tr(project.title, locale);
  const description = tr(project.summary, locale) || tr(project.description, locale).slice(0, 160);
  const images = project.cover ? [{ url: project.cover, alt: title }] : undefined;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: { en: `/en/projects/${slug}`, ar: `/ar/projects/${slug}`, "x-default": `/en/projects/${slug}` },
    },
    openGraph: { type: "article", title, description, images },
    twitter: { card: "summary_large_image", title, description, images: project.cover ? [project.cover] : undefined },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [project, projects, settings, t, nav] = await Promise.all([
    getProject(slug),
    getProjects(),
    getSettings(),
    getTranslations("projects"),
    getTranslations("nav"),
  ]);
  if (!project) notFound();

  const base = siteUrl();
  const url = `${base}/${locale}/projects/${slug}`;
  const title = tr(project.title, locale);
  // Same category first, then the rest, so the suggestions feel related.
  const more = projects
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === project.category) - Number(a.category === project.category))
    .slice(0, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: title,
      description: tr(project.summary, locale),
      url,
      image: project.cover ? new URL(project.cover, base).toString() : undefined,
      dateCreated: project.year ? String(project.year) : undefined,
      keywords: project.tech.join(", ") || undefined,
      creator: { "@type": "Person", name: tr(settings.name, locale), url: `${base}/${locale}` },
      sameAs: project.liveUrl || undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: nav("home"), item: `${base}/${locale}` },
        { "@type": "ListItem", position: 2, name: t("pageTitle"), item: `${base}/${locale}/projects` },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 pt-28 pb-24 sm:px-6">
      <script
        type="application/ld+json"
        // `<` is escaped so text from the dashboard can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand"
      >
        <ArrowLeft className="size-4 rtl:-scale-x-100" />
        {t("back")}
      </Link>

      <article>
        <ProjectDetails project={project} variant="page" />
      </article>

      {more.length > 0 && (
        <section className="mt-20 border-t pt-12" aria-labelledby="more-projects">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 id="more-projects" className="text-2xl font-semibold tracking-tight">
              {t("more")}
            </h2>
            <Link href="/projects" className="text-sm text-muted-foreground transition-colors hover:text-brand">
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <ProjectCard
                key={p._id}
                project={p}
                locale={locale}
                labels={{ category: t(`categories.${p.category}`), private: t("private"), details: t("details") }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
