"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

/** Catches runtime errors on the public pages (and the login page) inside the site's own layout. */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  const t = useTranslations("error");
  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm text-brand">500</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-muted-foreground">{t("text")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="h-11 rounded-full px-6" onClick={() => retry()}>
            {t("retry")}
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6">
            <Link href="/">{t("home")}</Link>
          </Button>
        </div>
        {digest && (
          <p className="mt-6 text-xs text-muted-foreground">
            {t("code")}: <span className="font-mono" dir="ltr">{digest}</span>
          </p>
        )}
      </div>
    </main>
  );
}
