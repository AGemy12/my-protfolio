import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { adminList } from "@/lib/admin-data";
import { isResourceKey } from "@/lib/resources";
import { ResourceList } from "@/components/admin/resource-list";

export default async function ResourceListPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResourceKey(resource)) notFound();
  const t = await getTranslations("admin.nav");
  const items = await adminList(resource);
  return <ResourceList resource={resource} items={items} title={t(resource)} />;
}
