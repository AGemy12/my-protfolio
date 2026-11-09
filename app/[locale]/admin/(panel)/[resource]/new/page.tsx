import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { isResourceKey } from "@/lib/resources";
import { ResourceForm } from "@/components/admin/resource-form";

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResourceKey(resource)) notFound();
  const t = await getTranslations("admin");
  return <ResourceForm resource={resource} initial={null} title={`${t("common.new")} — ${t(`nav.${resource}`)}`} />;
}
