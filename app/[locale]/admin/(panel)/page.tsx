import { getLocale, getTranslations } from "next-intl/server";
import { Briefcase, FolderKanban, Inbox, Sparkles, Wrench } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { adminCounts, adminMessages } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/ui";
import { ImportButton } from "@/components/admin/import-button";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function OverviewPage() {
  const t = await getTranslations("admin");
  const locale = await getLocale();
  let counts: Awaited<ReturnType<typeof adminCounts>> | null = null;
  let recent: Awaited<ReturnType<typeof adminMessages>> = [];
  try {
    [counts, recent] = await Promise.all([adminCounts(), adminMessages(5)]);
  } catch (error) {
    console.error("[overview]", error);
  }

  const empty = counts && !counts.projects && !counts.experience && !counts.skills && !counts.services;
  const stats = [
    { key: "projects", value: counts?.projects, icon: FolderKanban },
    { key: "experience", value: counts?.experience, icon: Briefcase },
    { key: "skills", value: counts?.skills, icon: Wrench },
    { key: "services", value: counts?.services, icon: Sparkles },
    { key: "messages", value: counts?.unread, icon: Inbox, label: t("overview.unread") },
  ] as const;
  const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium" });

  return (
    <>
      <PageHeader title={t("overview.title")} description={t("overview.welcome")} />

      {(empty || (counts && !counts.hasSettings)) && (
        <Card className="mb-6 border-brand/40 bg-brand-soft/40 shadow-none">
          <CardHeader>
            <CardTitle>{t("overview.importTitle")}</CardTitle>
            <CardDescription className="max-w-xl">{t("overview.importText")}</CardDescription>
            <CardAction className="max-sm:col-start-1 max-sm:row-start-3 max-sm:mt-2 max-sm:justify-self-start">
              <ImportButton />
            </CardAction>
          </CardHeader>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map(({ key, value, icon: Icon, ...rest }) => (
          <Link key={key} href={`/admin/${key}`} className="group rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <Card className="h-full gap-0 p-5 transition-colors group-hover:border-brand">
              <Icon className="size-5 text-brand" />
              <p className="mt-4 text-3xl font-semibold tabular-nums">{value ?? "—"}</p>
              <p className="text-sm text-muted-foreground">{"label" in rest ? rest.label : t(`nav.${key}`)}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t("overview.recent")}</CardTitle>
          <CardAction>
            <Button asChild variant="link" size="sm" className="h-auto px-0 text-brand">
              <Link href="/admin/messages">{t("nav.messages")}</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("overview.noMessages")}</p>
          ) : (
            <ul className="divide-y">
              {recent.map((m) => (
                <li key={m._id} className="flex items-center gap-3 py-3">
                  <span className={cn("size-2 shrink-0 rounded-full", m.read ? "bg-border" : "bg-brand")} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.subject || m.message}</p>
                  </div>
                  <time className="text-xs text-muted-foreground">{fmt.format(new Date(m.createdAt))}</time>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
