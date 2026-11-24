import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { adminRefOptions } from "@/lib/admin-data";
import { isResourceKey } from "@/lib/resources";
import { ResourceForm } from "@/components/admin/resource-form";

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResourceKey(resource)) notFound();
  const [t, refs] = await Promise.all([getTranslations("admin"), adminRefOptions(resource)]);
  return (
    <ResourceForm resource={resource} initial={null} refs={refs} title={`${t("common.new")} — ${t(`nav.${resource}`)}`} />
  );
}
