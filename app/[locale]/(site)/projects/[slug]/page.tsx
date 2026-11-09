import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Old per-project URLs → the projects page, where `#slug` opens that project's dialog. */
export default async function LegacyProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  permanentRedirect(`/${locale}/projects#${encodeURIComponent(slug)}`);
}
