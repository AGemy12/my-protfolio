import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CircleAlert } from "lucide-react";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import { unreadCount } from "@/lib/admin-data";
import { Sidebar } from "@/components/admin/sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default async function PanelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSession(); // the proxy already checks; this is defense in depth
  if (!session) redirect({ href: "/admin/login", locale });
  const t = await getTranslations("admin.overview");

  return (
    <div className="min-h-dvh bg-background">
      <Sidebar unread={await unreadCount()} email={session!.email} />
      <div className="lg:ps-64">
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
          {!hasDatabase() && (
            <Alert variant="destructive" className="mb-6 border-destructive/30 bg-destructive/10">
              <CircleAlert />
              <AlertDescription>{t("noDb")}</AlertDescription>
            </Alert>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
