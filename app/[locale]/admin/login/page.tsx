import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/admin/auth-forms";
import { LocaleSwitch, ThemeToggle } from "@/components/site/controls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Login", robots: { index: false, follow: false } };

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.login");
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
      <div className="absolute end-4 top-4 flex gap-2">
        <LocaleSwitch />
        <ThemeToggle />
      </div>
      <Card className="relative w-full max-w-sm rounded-3xl py-8 shadow-2xl">
        <CardHeader className="px-8">
          <span className="mb-4 grid size-11 place-items-center rounded-xl bg-primary font-mono text-sm text-primary-foreground">
            {"</>"}
          </span>
          <CardTitle className="text-2xl tracking-tight">{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
