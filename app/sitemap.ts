import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  // Project details open in a dialog on /projects, so there are no per-project pages.
  const paths = ["", "/projects"];
  return paths.map((path) => ({
    url: `${base}/en${path}`,
    lastModified: new Date(),
    alternates: { languages: { en: `${base}/en${path}`, ar: `${base}/ar${path}` } },
  }));
}
