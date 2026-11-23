import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProjects } from "@/lib/data";
import { siteUrl } from "@/lib/utils";

// Rebuilt on every content save (revalidatePath("/", "layout")), and hourly as a fallback.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const projects = await getProjects();

  const dates = projects.map((p) => p.updatedAt).filter(Boolean) as string[];
  const newest = dates.length ? new Date(dates.reduce((a, b) => (a > b ? a : b))) : undefined;

  const pages: { path: string; lastModified?: Date; priority: number }[] = [
    { path: "", lastModified: newest, priority: 1 },
    { path: "/projects", lastModified: newest, priority: 0.8 },
    ...projects.map((p) => ({
      path: `/projects/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      priority: 0.6,
    })),
  ];

  // One entry per language, each listing all its translations (what Google expects for hreflang).
  return pages.flatMap(({ path, lastModified, priority }) =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified,
      priority,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}${path}`])),
      },
    })),
  );
}
