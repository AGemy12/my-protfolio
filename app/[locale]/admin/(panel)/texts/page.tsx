import { adminSiteTexts } from "@/lib/admin-data";
import { SiteTextsEditor } from "@/components/admin/site-texts-editor";

export default async function SiteTextsPage() {
  const { builtIn, args, values } = await adminSiteTexts();
  return <SiteTextsEditor builtIn={builtIn} args={args} initial={values} />;
}
