"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { notifyWhatsApp } from "../whatsapp";
import { hasMailer, sendContactEmail } from "../mailer";
import { connectDB } from "../db";
import { getTranslations } from "next-intl/server";
import { getContactForm, getSettings } from "../data";
import { MessageModel } from "../models";
import { contactSubmitSchema } from "../schemas";
import {
  asList,
  buildMessage,
  displayValue,
  isChoice,
  plainText,
  type ContactFieldDef,
  type ContactValues,
} from "../contact-form";
import { renderContactEmail, type EmailRow } from "../email-template";
import { tr } from "../types";
import { siteUrl } from "../utils";
import { checkContact, normalizeWhatsApp, type FieldErrors } from "../contact-rules";
import { clientIp, rateHit } from "../rate-limit";

export type ContactState =
  | { ok?: boolean; error?: "validation" | "rate" | "server" | "mail"; fieldErrors?: FieldErrors }
  | undefined;

/**
 * The branded HTML email: the sender's name as the title, short answers as
 * rows (picked options as tags), and the long text as the message block.
 */
async function composeEmail(
  fields: ContactFieldDef[],
  values: ContactValues,
  locale: string,
  who: { name: string; email: string; phone: string },
) {
  const [t, settings] = await Promise.all([getTranslations({ locale, namespace: "email" }), getSettings()]);
  const messageField = fields.find((f) => f.type === "textarea" && asList(values[f.key]).length);
  const nameField = fields.find((f) => displayValue(f, values[f.key], locale) === who.name && !isChoice(f.type));

  const rows: EmailRow[] = fields
    .filter((f) => f !== messageField && f !== nameField)
    .map((f): EmailRow => {
      const label = tr(f.label, locale) || f.key;
      if (isChoice(f.type)) {
        const picked = asList(values[f.key])
          .map((v) => f.options.find((o) => o.value === v))
          .filter((o) => o !== undefined)
          .map((o) => tr(o.label, locale));
        return { label, values: picked, kind: "choice" };
      }
      const kind = f.type === "email" ? "email" : f.type === "phone" ? "phone" : "text";
      return { label, values: [displayValue(f, values[f.key], locale)].filter(Boolean), kind };
    })
    .filter((row) => row.values.length);

  const site = tr(settings.name, locale);
  return renderContactEmail({
    locale,
    siteName: site,
    siteUrl: siteUrl(),
    name: who.name || t("visitor"),
    email: who.email,
    phone: who.phone,
    rows,
    message: messageField ? displayValue(messageField, values[messageField.key], locale) : "",
    sentAt: new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: process.env.CONTACT_TIMEZONE || "Africa/Cairo",
    }).format(new Date()),
    copy: {
      eyebrow: t("eyebrow"),
      intro: t("intro"),
      details: t("details"),
      message: t("message"),
      replyEmail: t("replyEmail"),
      replyWhatsapp: t("replyWhatsapp"),
      footer: t("footer", { site, name: who.name || t("visitor") }),
      dashboard: t("dashboard"),
    },
  });
}

// At most 5 messages per IP per 10 minutes, counted in the DB so it holds across instances.
const CONTACT_MAX = 5;
const CONTACT_WINDOW_MS = 10 * 60_000;

/**
 * Records a contact message in the dashboard inbox. For WhatsApp / email the
 * visitor's own app delivers it, so this only keeps a copy; "gmail" also sends
 * it to the owner's Gmail (SMTP + App Password); "site" only keeps it, and the
 * owner gets a WhatsApp notice (CallMeBot).
 */
export async function sendMessage(input: unknown): Promise<ContactState> {
  const parsed = contactSubmitSchema.safeParse(input);
  if (!parsed.success) return { error: "validation" };
  const { channel, locale, values, website } = parsed.data;
  if (website) return { ok: true }; // bot filled the honeypot: pretend success

  try {
    const config = await getContactForm();
    // "site" is the fallback the page offers when no other way is set up, so it is always accepted.
    if (channel !== "site" && !config.channels[channel]) return { error: "validation" };
    if (channel === "gmail" && !hasMailer()) return { error: "mail" };
    const fields = config.fields.filter((f) => f.enabled);
    // Same rules as the browser, so a bypassed form still gets field-by-field reasons.
    const fieldErrors = checkContact(fields, values);
    if (Object.keys(fieldErrors).length) return { error: "validation", fieldErrors };

    if ((await rateHit(`contact:${await clientIp()}`, CONTACT_WINDOW_MS)) > CONTACT_MAX) return { error: "rate" };

    const clean: ContactValues = Object.fromEntries(fields.map((f) => [f.key, values[f.key] ?? ""]));
    const { text, subject } = buildMessage(config, clean, locale);
    const filled = fields
      .map((f) => ({ key: f.key, label: f.label, value: displayValue(f, clean[f.key], locale) }))
      .filter((f) => f.value);
    // The inbox list and replies read these columns, whatever the fields are called.
    const valueOf = (pick: (f: (typeof fields)[number]) => boolean) => {
      const f = fields.find(pick);
      return f ? displayValue(f, clean[f.key], locale) : "";
    };
    const whatsapp = valueOf((f) => f.type === "phone");

    // Gmail is the delivery itself, so it goes first and its failure is reported to the visitor.
    if (channel === "gmail") {
      try {
        const name = valueOf((f) => f.key === "name") || valueOf((f) => f.type === "text");
        const email = valueOf((f) => f.type === "email");
        await sendContactEmail({
          subject,
          html: await composeEmail(fields, clean, locale, { name, phone: whatsapp, email }),
          plain: plainText(text),
          replyTo: email,
          name,
        });
      } catch (error) {
        console.error("[contact mail]", error);
        return { error: "mail" };
      }
    }

    try {
      await connectDB();
      await MessageModel.create({
        name: valueOf((f) => f.key === "name") || valueOf((f) => f.type === "text"),
        email: valueOf((f) => f.type === "email"),
        whatsapp: whatsapp ? normalizeWhatsApp(whatsapp) : "",
        subject: valueOf((f) => f.key === "subject") || valueOf((f) => isChoice(f.type)),
        message: valueOf((f) => f.type === "textarea") || plainText(text),
        fields: filled,
        channel,
        locale,
      });
      revalidatePath("/[locale]/admin", "layout");
    } catch (error) {
      // The email already went out: the inbox copy is a bonus, and an error here would invite a duplicate resend.
      if (channel !== "gmail") throw error;
      console.error("[contact inbox copy]", error);
    }
    // Runs after the response is sent, so the visitor doesn't wait on WhatsApp.
    if (channel === "site") after(() => notifyWhatsApp({ text, replyTo: whatsapp }));
    return { ok: true };
  } catch (error) {
    console.error("[contact]", error);
    return { error: "server" };
  }
}
