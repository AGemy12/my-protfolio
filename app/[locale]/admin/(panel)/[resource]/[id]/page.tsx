import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { adminGet } from "@/lib/admin-data";
import { isResourceKey } from "@/lib/resources";
import { ResourceForm } from "@/components/admin/resource-form";

export default async function EditResourcePage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!isResourceKey(resource)) notFound();
  const item = await adminGet(resource, id);
  if (!item) notFound();
  const t = await getTranslations("admin");
  // key forces a fresh form state when navigating between items
  return <ResourceForm key={id} resource={resource} initial={item} title={`${t("common.edit")} — ${t(`nav.${resource}`)}`} />;
}
