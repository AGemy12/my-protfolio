import { list } from "@vercel/blob";
import { getTranslations } from "next-intl/server";
import { CircleAlert } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { MediaLibrary } from "@/components/admin/media-library";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function MediaPage() {
  const t = await getTranslations("admin.media");
  const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  let blobs: { url: string; pathname: string; size: number; uploadedAt: string }[] = [];
  if (hasBlob) {
    try {
      const result = await list({ prefix: "portfolio/", limit: 500 });
      blobs = result.blobs
        .map((b) => ({ url: b.url, pathname: b.pathname, size: b.size, uploadedAt: b.uploadedAt.toISOString() }))
        .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
    } catch (error) {
      console.error("[media]", error);
    }
  }
  return (
    <>
      <PageHeader title={t("title")} description={t("text")} />
      {hasBlob ? (
        <MediaLibrary blobs={blobs} />
      ) : (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
          <CircleAlert />
          <AlertDescription>{t("noBlob")}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
