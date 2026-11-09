import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/admin/ui";
import { PasswordForm } from "@/components/admin/auth-forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AccountPage() {
  const t = await getTranslations("admin.account");
  const session = await getSession();
  return (
    <>
      <PageHeader title={t("title")} description={`${t("signedInAs")} ${session?.email ?? ""}`} />
      <Card>
        <CardHeader>
          <CardTitle>{t("change")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </>
  );
}
