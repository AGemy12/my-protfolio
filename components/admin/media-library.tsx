"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Copy, FileText, Trash } from "lucide-react";
import { deleteBlob } from "@/lib/actions/content";
import { useConfirmDelete } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, Hint } from "./ui";
import { useActionToast } from "./resource-form";

type BlobItem = { url: string; pathname: string; size: number; uploadedAt: string };

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;

export function MediaLibrary({ blobs: initial }: { blobs: BlobItem[] }) {
  const t = useTranslations("admin");
  const notify = useActionToast();
  const confirmDelete = useConfirmDelete();
  const [blobs, setBlobs] = useState(initial);
  const [, start] = useTransition();

  if (!blobs.length) return <EmptyState>{t("media.empty")}</EmptyState>;

  const remove = async (b: BlobItem) => {
    if (!(await confirmDelete())) return;
    setBlobs((list) => list.filter((x) => x.url !== b.url));
    start(async () => {
      notify(await deleteBlob(b.url));
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {blobs.map((b) => {
        const image = /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(b.pathname);
        return (
          <Card key={b.url} className="group gap-0 overflow-hidden py-0">
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="grid aspect-[4/3] place-items-center bg-muted"
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.url} alt="" loading="lazy" className="size-full object-cover" />
              ) : (
                <FileText className="size-10 text-brand" />
              )}
            </a>
            <div className="p-3">
              <p className="truncate text-xs font-medium" dir="ltr" title={b.pathname}>
                {b.pathname.split("/").pop()}
              </p>
              <p className="text-[11px] text-muted-foreground">{formatSize(b.size)}</p>
              <div className="mt-2 flex gap-1">
                <Hint label={t("common.copy")}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("common.copy")}
                    onClick={async () => {
                      await navigator.clipboard.writeText(b.url);
                      toast.success(t("common.copied"));
                    }}
                  >
                    <Copy />
                  </Button>
                </Hint>
                <Hint label={t("common.delete")}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("common.delete")}
                    className="hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => remove(b)}
                  >
                    <Trash />
                  </Button>
                </Hint>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
