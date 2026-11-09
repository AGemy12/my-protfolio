"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { changePassword, login, type FormState } from "@/lib/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { FieldLabel } from "./ui";

export function LoginForm() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const [state, action, pending] = useActionState<FormState, FormData>(login, undefined);

  useEffect(() => {
    if (state?.ok) {
      router.replace("/admin");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-4">
      <div>
        <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
        <Input id="email" name="email" type="email" required autoComplete="username" dir="ltr" />
      </div>
      <div>
        <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
        <Input id="password" name="password" type="password" required autoComplete="current-password" dir="ltr" />
      </div>
      {state?.error && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
          <CircleAlert />
          <AlertDescription>{t(state.error === "invalid" ? "invalid" : "server")}</AlertDescription>
        </Alert>
      )}
      <LoadingButton type="submit" loading={pending} className="w-full">
        {t("submit")}
      </LoadingButton>
    </form>
  );
}

export function PasswordForm() {
  const t = useTranslations("admin.account");
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, undefined);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      toast.success(t("changed"));
      form.current?.reset();
    } else if (state?.error) {
      toast.error(t(state.error as "passwordRules" | "wrongPassword"));
    }
  }, [state, t]);

  return (
    <form ref={form} action={action} className="max-w-md space-y-4">
      {(["current", "next", "confirm"] as const).map((name) => (
        <div key={name}>
          <FieldLabel htmlFor={name}>{t(name)}</FieldLabel>
          <Input
            id={name}
            name={name}
            type="password"
            required
            minLength={name === "current" ? 1 : 8}
            autoComplete={name === "current" ? "current-password" : "new-password"}
            dir="ltr"
          />
        </div>
      ))}
      <LoadingButton type="submit" loading={pending}>
        {t("submit")}
      </LoadingButton>
    </form>
  );
}
