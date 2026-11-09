"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { importStarterContent } from "@/lib/actions/content";
import { LoadingButton } from "@/components/ui/loading-button";
import { useActionToast } from "./resource-form";

export function ImportButton() {
  const t = useTranslations("admin.overview");
  const router = useRouter();
  const notify = useActionToast();
  const [pending, start] = useTransition();
  return (
    <LoadingButton
      loading={pending}
      icon={<Download />}
      onClick={() =>
        start(async () => {
          if (notify(await importStarterContent(), t("imported"))) router.refresh();
        })
      }
    >
      {t("importButton")}
    </LoadingButton>
  );
}
