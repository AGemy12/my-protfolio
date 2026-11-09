"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { CircleAlert, CircleCheck, Send } from "lucide-react";
import { sendMessage, type ContactState } from "@/lib/actions/contact";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";

const field = "h-11 bg-background px-4 dark:bg-background";

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, undefined);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);

  return (
    <Card className="rounded-3xl shadow-none sm:py-8">
      <CardContent className="sm:px-8">
        <form ref={form} action={action} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">{t("name")}</Label>
              <Input id="contact-name" name="name" required minLength={2} maxLength={100} autoComplete="name" className={field} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">{t("email")}</Label>
              <Input id="contact-email" name="email" type="email" required autoComplete="email" dir="ltr" className={field} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-whatsapp">{t("whatsapp")}</Label>
              <Input
                id="contact-whatsapp"
                name="whatsapp"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                pattern="[+0-9\s\-()]{8,22}"
                placeholder="+20 1xx xxx xxxx"
                title={t("whatsappHint")}
                dir="ltr"
                className={field}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-subject">{t("subject")}</Label>
              <Input id="contact-subject" name="subject" maxLength={200} className={field} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">{t("message")}</Label>
            <Textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              className="resize-y bg-background px-4 py-3 dark:bg-background"
            />
          </div>
          {/* honeypot */}
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

          <div aria-live="polite">
            {state?.ok && (
              <Alert className="border-brand/30 bg-brand-soft text-brand">
                <CircleCheck />
                <AlertDescription className="text-brand">{t("success")}</AlertDescription>
              </Alert>
            )}
            {state?.error && (
              <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                <CircleAlert />
                <AlertDescription>{t(`errors.${state.error}`)}</AlertDescription>
              </Alert>
            )}
          </div>

          <LoadingButton
            type="submit"
            size="lg"
            loading={pending}
            icon={<Send className="rtl:-scale-x-100" />}
            className="h-12 w-full rounded-full px-6 sm:w-auto"
          >
            {pending ? t("sending") : t("send")}
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}
