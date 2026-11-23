"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { CircleAlert } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/** Dashboard errors render inside the panel, so the sidebar stays usable. */
export default function PanelError({ error, retry }: { error: unknown; retry: () => void }) {
  const t = useTranslations("error");
  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="mx-auto mt-10 max-w-lg">
      <CardContent className="flex flex-col items-center py-6 text-center">
        <CircleAlert className="size-8 text-destructive" />
        <h1 className="mt-4 text-xl font-semibold">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("text")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => retry()}>{t("retry")}</Button>
          <Button asChild variant="outline">
            <Link href="/admin">{t("home")}</Link>
          </Button>
        </div>
        {digest && (
          <p className="mt-5 text-xs text-muted-foreground">
            {t("code")}: <span className="font-mono" dir="ltr">{digest}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
