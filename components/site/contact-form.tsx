"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Mail,
  Send,
} from "lucide-react";
import { SiGmail, SiWhatsapp } from "react-icons/si";
import { sendMessage, type ContactState } from "@/lib/actions/contact";
import {
  asList,
  buildMessage,
  channelUrl,
  type ContactChannel,
  type ContactFieldDef,
  type ContactFormConfig,
  type ContactValues,
} from "@/lib/contact-form";
import {
  checkContact,
  checkField,
  type FieldError,
  type FieldErrors,
} from "@/lib/contact-rules";
import { tr } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "./phone-input";
import { cn } from "@/lib/utils";

const control = "h-11 bg-background px-4 dark:bg-background";
const fieldId = (key: string) => `contact-${key}`;

/** How long the "sent" note stays on screen, and how much of that is its fade-out. */
const SENT_VISIBLE_MS = 5000;
const SENT_FADE_MS = 500;

const CHANNEL_ICONS: Record<ContactChannel, React.ReactNode> = {
  whatsapp: <SiWhatsapp />,
  gmail: <SiGmail />,
  email: <Mail />,
  site: <Send className="rtl:-scale-x-100" />,
};

/**
 * Line under a field: the specific problem when there is one, otherwise the
 * hint. Keyed by the error code so it animates in when the problem changes,
 * not on every keystroke.
 */
function FieldNote({
  id,
  error,
  message,
  hint,
}: {
  id: string;
  error?: FieldError;
  message?: string;
  hint?: string;
}) {
  if (error && message) {
    return (
      <p
        key={error.code}
        id={`${id}-error`}
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
      <p
        id={`${id}-hint`}
        className="text-[13px] leading-snug text-muted-foreground"
      >
        {hint}
      </p>
    );
  }
  return null;
}

export type ContactTargets = { whatsapp: string; email: string };

/**
 * Which fields sit side by side. Two half-width fields in a row share it; a
 * half-width field with no partner takes the whole row instead of leaving a
 * gap. Phone fields always take the whole row: at half width the country
 * picker leaves the number too little room.
 */
function pairedFields(fields: ContactFieldDef[]) {
  const paired = new Set<string>();
  const half = (f?: ContactFieldDef) => Boolean(f?.half && f.type !== "phone");
  for (let i = 0; i < fields.length; i++) {
    if (half(fields[i]) && half(fields[i + 1])) {
      paired.add(fields[i].key).add(fields[i + 1].key);
      i++;
    }
  }
  return paired;
}

export function ContactForm({
  config,
  channels,
  targets,
}: {
  /** Only the fields that are switched on. */
  config: ContactFormConfig;
  /** Ways to send that are on and have somewhere to go, in display order. */
  channels: ContactChannel[];
  targets: ContactTargets;
}) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const fields = config.fields;
  const honeypot = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<ContactValues>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState<{
    channel: ContactChannel;
    url: string;
  } | null>(null);
  const [serverError, setServerError] =
    useState<NonNullable<ContactState>["error"]>();
  const [pending, start] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fading, setFading] = useState(false);

  // The "sent" note stays 5 seconds: it fades over the last half second, then goes.
  useEffect(() => {
    if (!sent) return;
    const fade = window.setTimeout(
      () => setFading(true),
      SENT_VISIBLE_MS - SENT_FADE_MS,
    );
    const hide = window.setTimeout(() => {
      setSent(null);
      setFading(false);
    }, SENT_VISIBLE_MS);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(hide);
    };
  }, [sent]);

  const showSent = (next: { channel: ContactChannel; url: string }) => {
    setFading(false);
    setSent(next);
  };

  const focusFirst = (errs: FieldErrors) => {
    const first = fields.find((f) => errs[f.key]);
    if (first) document.getElementById(fieldId(first.key))?.focus();
  };

  const revalidate = (
    f: ContactFieldDef,
    value: ContactValues[string] | undefined,
  ) =>
    setErrors((prev) => {
      const next = { ...prev };
      const error = checkField(f, value);
      if (error) next[f.key] = error;
      else delete next[f.key];
      return next;
    });

  // Once a field has been checked, it re-checks as you type, so errors clear the moment they're fixed.
  // Choices are checked on every pick: there is no "half-typed" state to wait for.
  const update = (
    f: ContactFieldDef,
    value: string | string[],
    checkNow = false,
  ) => {
    setValues((prev) => ({ ...prev, [f.key]: value }));
    setSent(null);
    if (checkNow) setTouched((prev) => ({ ...prev, [f.key]: true }));
    if (checkNow || touched[f.key] || submitted) revalidate(f, value);
  };

  // Leaving a field checks it, but an untouched empty field stays quiet until submit.
  const onBlur = (f: ContactFieldDef) => {
    const value = values[f.key];
    if (!asList(value).length && !submitted) return;
    setTouched((prev) => ({ ...prev, [f.key]: true }));
    revalidate(f, value);
  };

  /** Checks every field; on a problem, shows it and moves focus there. */
  const validate = () => {
    const all = checkContact(fields, values);
    setSubmitted(true);
    setErrors(all);
    setServerError(undefined);
    if (!Object.keys(all).length) return true;
    setSent(null);
    focusFirst(all);
    return false;
  };

  const clear = () => {
    setValues({});
    setErrors({});
    setTouched({});
    setSubmitted(false);
  };

  const send = (channel: ContactChannel) => {
    setMenuOpen(false);
    const payload = {
      channel,
      locale,
      values,
      website: honeypot.current?.value ?? "",
    };

    if (channel === "whatsapp" || channel === "email") {
      // Opened right here, inside the click, so the browser doesn't treat it as a pop-up.
      const { text, subject } = buildMessage(config, values, locale);
      const url = channelUrl(
        channel,
        channel === "whatsapp" ? targets.whatsapp : targets.email,
        subject,
        text,
      );
      if (channel === "email") window.location.assign(url);
      else window.open(url, "_blank", "noopener,noreferrer");
      // The answers now live in the opened message, so the form starts fresh.
      clear();
      showSent({ channel, url });
      // A copy for the dashboard inbox; the visitor's own app does the delivering, so failures stay quiet.
      sendMessage(payload).catch(() => {});
      return;
    }

    // gmail / site: the server delivers it, so the form only clears once it has.
    start(async () => {
      const result = await sendMessage(payload);
      if (result?.ok) {
        clear();
        showSent({ channel, url: "" });
      } else {
        if (result?.fieldErrors) {
          setErrors(result.fieldErrors);
          focusFirst(result.fieldErrors);
        }
        setServerError(result?.error ?? "server");
      }
    });
  };

  // One way to send: the button sends. Several: it opens the menu, but only once the form is valid.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending || !validate()) return;
    if (channels.length === 1) send(channels[0]);
    else setMenuOpen(true);
  };

  const onMenuOpenChange = (open: boolean) => {
    if (!open) setMenuOpen(false);
    else if (!pending && validate()) setMenuOpen(true);
  };

  const messageFor = (key: string) => {
    const error = errors[key];
    return error
      ? t(`errors.field.${error.code}` as Parameters<typeof t>[0], {
          count: error.count ?? 0,
          min: error.min ?? 0,
          max: error.max ?? 0,
        })
      : undefined;
  };

  const describedBy = (f: ContactFieldDef) =>
    errors[f.key]
      ? `${fieldId(f.key)}-error`
      : tr(f.hint, locale)
        ? `${fieldId(f.key)}-hint`
        : undefined;

  const renderControl = (f: ContactFieldDef) => {
    const id = fieldId(f.key);
    const value = values[f.key];
    const text = typeof value === "string" ? value : "";
    const placeholder = tr(f.placeholder, locale) || undefined;
    const aria = {
      "aria-invalid": errors[f.key] ? true : undefined,
      "aria-describedby": describedBy(f),
    };

    switch (f.type) {
      case "textarea":
        return (
          <Textarea
            id={id}
            {...aria}
            value={text}
            placeholder={placeholder}
            required={f.required}
            maxLength={f.max || undefined}
            rows={5}
            onChange={(e) => update(f, e.target.value)}
            onBlur={() => onBlur(f)}
            // Fixed height: the base textarea grows with its text (field-sizing-content); here long text scrolls instead.
            className="h-36 field-sizing-fixed resize-none overflow-y-auto bg-background px-4 py-3 leading-relaxed dark:bg-background"
          />
        );

      case "select":
        return (
          <Select
            value={text}
            onValueChange={(v) => update(f, v, true)}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <SelectTrigger
              id={id}
              {...aria}
              // the trigger sets its own height and dark fill; match the text inputs
              className={cn(
                control,
                "w-full text-base data-[size=default]:h-11 md:text-sm dark:hover:bg-background",
              )}
            >
              <SelectValue placeholder={placeholder ?? t("choose")} />
            </SelectTrigger>
            <SelectContent position="popper">
              {f.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {tr(o.label, locale)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "chips": {
        const picked = asList(value);
        const toggle = (v: string) => {
          const on = picked.includes(v);
          const next = f.multiple
            ? on
              ? picked.filter((x) => x !== v)
              : [...picked, v]
            : on
              ? []
              : [v];
          update(f, next, true);
        };
        return (
          <div
            role="group"
            aria-labelledby={`${id}-label`}
            {...aria}
            className="flex flex-wrap gap-2"
          >
            {f.options.map((o, i) => {
              const on = picked.includes(o.value);
              return (
                <button
                  key={o.value}
                  id={i === 0 ? id : undefined}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(o.value)}
                  className={cn(
                    "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors outline-none",
                    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    on
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-input bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                    errors[f.key] && !on && "border-destructive/50",
                  )}
                >
                  {on && <Check aria-hidden className="size-3.5" />}
                  {tr(o.label, locale)}
                </button>
              );
            })}
          </div>
        );
      }

      case "phone":
        return (
          <PhoneInput
            id={id}
            value={text}
            onChange={(v) => update(f, v)}
            onBlur={() => onBlur(f)}
            invalid={Boolean(errors[f.key])}
            describedBy={describedBy(f)}
          />
        );

      default: {
        const kind = {
          text: {
            type: "text",
            autoComplete: f.key === "name" ? "name" : undefined,
          },
          email: {
            type: "email",
            autoComplete: "email",
            inputMode: "email",
            spellCheck: false,
            dir: "ltr",
          },
        }[f.type as "text" | "email"] as React.ComponentProps<typeof Input>;
        return (
          <Input
            id={id}
            {...aria}
            {...kind}
            value={text}
            required={f.required}
            maxLength={f.type === "text" ? f.max || undefined : 200}
            onChange={(e) => update(f, e.target.value)}
            onBlur={() => onBlur(f)}
            className={control}
          />
        );
      }
    }
  };

  const errorCount = Object.keys(errors).length;
  const showSummary = submitted && errorCount > 0;
  const generalError =
    serverError && !(serverError === "validation" && errorCount)
      ? serverError
      : undefined;

  const paired = pairedFields(fields);

  return (
    <Card className="rounded-2xl bg-linear-to-b from-sheen to-transparent shadow-none sm:py-8">
      <CardContent className="px-4">
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          {/*
            Each field spans three shared rows (label / control / note), so two fields side by side
            keep their boxes level even when one label wraps or only one has a hint.
          */}
          <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
            {fields.map((f) => {
              const id = fieldId(f.key);
              const length =
                typeof values[f.key] === "string"
                  ? (values[f.key] as string).trim().length
                  : 0;
              return (
                <div
                  key={f.key}
                  className={cn(
                    "row-span-3 grid min-w-0 grid-rows-subgrid gap-y-2",
                    !paired.has(f.key) && "sm:col-span-2",
                  )}
                >
                  <Label
                    id={`${id}-label`}
                    htmlFor={f.type === "chips" ? undefined : id}
                    className="block self-end leading-snug text-nowrap"
                  >
                    {tr(f.label, locale)}
                    {!f.required && (
                      <span className="ms-1.5 text-xs font-normal text-muted-foreground">
                        ({t("optional")})
                      </span>
                    )}
                  </Label>
                  {renderControl(f)}
                  <div className="flex min-h-0 items-start justify-between gap-4 pb-3">
                    <FieldNote
                      id={id}
                      error={errors[f.key]}
                      message={messageFor(f.key)}
                    />
                    {f.type === "textarea" && f.max > 0 && (
                      <span
                        dir="ltr"
                        aria-hidden
                        className={cn(
                          "ms-auto shrink-0 font-mono text-xs text-muted-foreground tabular-nums transition-colors",
                          length >= f.max * 0.9 && "text-brand",
                        )}
                      >
                        {length} / {f.max}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* honeypot */}
          <input
            ref={honeypot}
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          <div aria-live="polite" className="empty:hidden">
            {sent && !showSummary && (
              <Alert
                className={cn(
                  "animate-in border-brand/30 bg-brand-soft text-brand transition-opacity duration-500 fade-in-0 slide-in-from-top-1",
                  fading && "opacity-0",
                )}
              >
                <CircleCheck />
                <AlertDescription className="text-brand">
                  {sent.channel === "site" ? (
                    t("success")
                  ) : sent.channel === "gmail" ? (
                    t("emailSent")
                  ) : (
                    <span>
                      {t(`opened.${sent.channel}`)}{" "}
                      <a
                        href={sent.url}
                        target={sent.channel === "email" ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-4"
                      >
                        {t("openAgain")}
                      </a>
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
            {showSummary && (
              <p className="flex items-center gap-2 text-sm text-destructive">
                <CircleAlert aria-hidden className="size-4 shrink-0" />
                {t("fixSummary", { count: errorCount })}
              </p>
            )}
            {!showSummary && generalError && (
              <Alert
                variant="destructive"
                className="border-destructive/30 bg-destructive/10"
              >
                <CircleAlert />
                <AlertDescription>
                  {t(`errors.${generalError}`)}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="border-t pt-6 flex items-center justify-center">
            {channels.length === 1 ? (
              <LoadingButton
                type="submit"
                size="lg"
                variant="ember"
                loading={pending}
                icon={CHANNEL_ICONS[channels[0]]}
                className="h-12 w-full rounded-full px-7 sm:w-auto"
              >
                {pending ? t("sending") : t("send")}
              </LoadingButton>
            ) : (
              <DropdownMenu
                open={menuOpen}
                onOpenChange={onMenuOpenChange}
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                <DropdownMenuTrigger asChild>
                  <LoadingButton
                    type="button"
                    size="lg"
                    variant="ember"
                    loading={pending}
                    icon={<Send className="rtl:-scale-x-100" />}
                    className="group h-12 w-full rounded-full ps-6 pe-5 sm:w-auto"
                  >
                    {pending ? t("sending") : t("send")}
                    {!pending && (
                      <ChevronDown
                        aria-hidden
                        className="ms-1 opacity-60 transition-transform group-data-[state=open]:rotate-180"
                      />
                    )}
                  </LoadingButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={8}
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-72 rounded-xl p-1.5"
                >
                  <DropdownMenuLabel className="px-3 pt-2 pb-1.5 text-xs font-normal text-muted-foreground">
                    {t("sendWith")}
                  </DropdownMenuLabel>
                  {channels.map((c) => (
                    <DropdownMenuItem
                      key={c}
                      onSelect={() => send(c)}
                      className="cursor-pointer gap-3 rounded-lg px-3 py-2.5"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-foreground [&_svg]:size-4">
                        {CHANNEL_ICONS[c]}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium">
                          {t(`sendVia.${c}`)}
                        </span>
                        <span className="block text-xs leading-snug text-muted-foreground">
                          {t(`channelNote.${c}`)}
                        </span>
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
