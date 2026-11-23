"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CircleAlert, CircleCheck, Send } from "lucide-react";
import { sendMessage, type ContactState } from "@/lib/actions/contact";
import {
  CONTACT_FIELDS,
  MESSAGE_MAX,
  checkContact,
  checkField,
  type ContactField,
  type FieldError,
  type FieldErrors,
} from "@/lib/contact-rules";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const field = "h-11 bg-background px-4 dark:bg-background";
const fieldId = (f: ContactField) => `contact-${f}`;

/**
 * Line under a field: the specific problem when there is one, otherwise the
 * hint. Keyed by the error code so it animates in when the problem changes,
 * not on every keystroke.
 */
function FieldNote({ f, error, message, hint }: { f: ContactField; error?: FieldError; message?: string; hint?: string }) {
  if (error && message) {
    return (
      <p
        key={error.code}
        id={`${fieldId(f)}-error`}
        aria-live="polite"
        className="flex animate-in items-start gap-1.5 text-[13px] leading-snug text-destructive duration-200 fade-in-0 slide-in-from-top-1"
      >
        <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
        <span>{message}</span>
      </p>
    );
  }
  if (hint) {
    return (
      <p id={`${fieldId(f)}-hint`} className="text-[13px] leading-snug text-muted-foreground">
        {hint}
      </p>
    );
  }
  return null;
}

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, undefined);
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [messageLength, setMessageLength] = useState(0);

  const focusFirst = (errs: FieldErrors) => {
    const first = CONTACT_FIELDS.find((f) => errs[f]);
    if (first) (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
  };

  useEffect(() => {
    if (state?.ok) {
      form.current?.reset();
      setErrors({});
      setTouched({});
      setSubmitted(false);
      setMessageLength(0);
    } else if (state?.fieldErrors) {
      setErrors(state.fieldErrors);
      focusFirst(state.fieldErrors);
    }
  }, [state]);

  const revalidate = (f: ContactField, value: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      const error = checkField(f, value);
      if (error) next[f] = error;
      else delete next[f];
      return next;
    });

  type FieldEvent = React.FocusEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

  // Leaving a field checks it, but an untouched empty field stays quiet until submit.
  const onBlur = (e: FieldEvent) => {
    const f = e.target.name as ContactField;
    if (!e.target.value.trim() && !submitted) return;
    setTouched((prev) => ({ ...prev, [f]: true }));
    revalidate(f, e.target.value);
  };

  // Once a field has been checked, it re-checks as you type, so errors clear the moment they're fixed.
  const onChange = (e: FieldEvent) => {
    const f = e.target.name as ContactField;
    if (f === "message") setMessageLength(e.target.value.trim().length);
    if (touched[f] || submitted) revalidate(f, e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const all = checkContact(Object.fromEntries(data));
    setSubmitted(true);
    setErrors(all);
    if (Object.keys(all).length) {
      focusFirst(all);
      return;
    }
    startTransition(() => action(data));
  };

  const messageFor = (f: ContactField) => {
    const error = errors[f];
    return error ? t(`errors.fields.${f}.${error.code}` as Parameters<typeof t>[0], { count: error.count ?? 0 }) : undefined;
  };

  const props = (f: ContactField, hasHint = false) => ({
    id: fieldId(f),
    name: f,
    onBlur,
    onChange,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `${fieldId(f)}-error` : hasHint ? `${fieldId(f)}-hint` : undefined,
  });

  const errorCount = Object.keys(errors).length;
  const showSummary = submitted && errorCount > 0;
  const generalError = state?.error && !(state.error === "validation" && state.fieldErrors) ? state.error : undefined;

  return (
    <Card className="rounded-2xl bg-linear-to-b from-sheen to-transparent shadow-none sm:py-8">
      <CardContent className="sm:px-8">
        <form ref={form} onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={fieldId("name")}>{t("name")}</Label>
              <Input {...props("name")} required maxLength={100} autoComplete="name" className={field} />
              <FieldNote f="name" error={errors.name} message={messageFor("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fieldId("email")}>{t("email")}</Label>
              <Input
                {...props("email")}
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                placeholder="name@gmail.com"
                dir="ltr"
                className={field}
              />
              <FieldNote f="email" error={errors.email} message={messageFor("email")} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={fieldId("whatsapp")}>{t("whatsapp")}</Label>
              <Input
                {...props("whatsapp", true)}
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="+20 1xx xxx xxxx"
                dir="ltr"
                className={field}
              />
              <FieldNote f="whatsapp" error={errors.whatsapp} message={messageFor("whatsapp")} hint={t("whatsappHint")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fieldId("subject")}>
                {t("subject")}
                <span className="font-normal text-muted-foreground">({t("optional")})</span>
              </Label>
              <Input {...props("subject")} maxLength={200} className={field} />
              <FieldNote f="subject" error={errors.subject} message={messageFor("subject")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={fieldId("message")}>{t("message")}</Label>
            <Textarea
              {...props("message", true)}
              required
              maxLength={MESSAGE_MAX}
              rows={5}
              className="resize-y bg-background px-4 py-3 dark:bg-background"
            />
            <div className="flex items-start justify-between gap-4">
              <FieldNote f="message" error={errors.message} message={messageFor("message")} hint={t("messageHint")} />
              <span
                dir="ltr"
                aria-hidden
                className={cn(
                  "ms-auto shrink-0 font-mono text-xs text-muted-foreground tabular-nums transition-colors",
                  messageLength >= MESSAGE_MAX * 0.9 && "text-brand",
                )}
              >
                {messageLength} / {MESSAGE_MAX}
              </span>
            </div>
          </div>

          {/* honeypot */}
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

          <div aria-live="polite" className="empty:hidden">
            {state?.ok && !submitted && (
              <Alert className="border-brand/30 bg-brand-soft text-brand">
                <CircleCheck />
                <AlertDescription className="text-brand">{t("success")}</AlertDescription>
              </Alert>
            )}
            {showSummary && (
              <p className="flex items-center gap-2 text-sm text-destructive">
                <CircleAlert aria-hidden className="size-4 shrink-0" />
                {t("fixSummary", { count: errorCount })}
              </p>
            )}
            {!showSummary && generalError && (
              <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                <CircleAlert />
                <AlertDescription>{t(`errors.${generalError}`)}</AlertDescription>
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
