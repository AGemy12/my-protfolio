// The contact form as data: which fields it has, the message template they fill,
// and the ways a visitor can send it. Edited from the dashboard, stored in
// MongoDB, and read by both the public form and the server action. Client-safe.
import { tr, type L } from "./types";
import { formatPhone } from "./phone";

export const CONTACT_FIELD_TYPES = ["text", "textarea", "email", "phone", "select", "chips"] as const;
export type ContactFieldType = (typeof CONTACT_FIELD_TYPES)[number];

/**
 * whatsapp / email open the visitor's app with the message ready; gmail is sent
 * from the server to the owner's Gmail (App Password); site only keeps it in the inbox.
 */
export const CONTACT_CHANNELS = ["whatsapp", "gmail", "email", "site"] as const;
export type ContactChannel = (typeof CONTACT_CHANNELS)[number];

/** Field keys the form itself uses, so a field can't take them. */
export const RESERVED_KEYS = ["website", "channel", "locale", "fields"] as const;
export const FIELD_KEY = /^[a-zA-Z][a-zA-Z0-9_]{0,39}$/;

export type ContactOption = { value: string; label: L };

export type ContactFieldDef = {
  /** Variable name in the template: {{key}}. */
  key: string;
  type: ContactFieldType;
  label: L;
  placeholder: L;
  hint: L;
  required: boolean;
  enabled: boolean;
  /** Takes half the row on wide screens. */
  half: boolean;
  /** Length limits for text / textarea (0 = no minimum). */
  min: number;
  max: number;
  /** chips only: allow picking more than one. */
  multiple: boolean;
  options: ContactOption[];
};

export type ContactFormConfig = {
  fields: ContactFieldDef[];
  channels: Record<ContactChannel, boolean>;
  template: L;
  emailSubject: L;
};

export type ContactValues = Record<string, string | string[]>;

export const isChoice = (type: ContactFieldType) => type === "select" || type === "chips";
export const hasLength = (type: ContactFieldType) => type === "text" || type === "textarea";

/* ---------------- defaults ---------------- */

const l = (en = "", ar = ""): L => ({ en, ar });

export function newField(key: string, type: ContactFieldType = "text"): ContactFieldDef {
  return {
    key,
    type,
    label: l(),
    placeholder: l(),
    hint: l(),
    required: false,
    enabled: true,
    half: false,
    min: 0,
    max: type === "textarea" ? 5000 : 200,
    multiple: false,
    options: [],
  };
}

const field = (key: string, type: ContactFieldType, label: L, rest: Partial<ContactFieldDef> = {}) => ({
  ...newField(key, type),
  label,
  ...rest,
});

const option = (value: string, en: string, ar: string): ContactOption => ({ value, label: l(en, ar) });

export const defaultContactForm: ContactFormConfig = {
  fields: [
    field("name", "text", l("Your name", "الاسم"), { required: true, half: true, min: 2, max: 100 }),
    field("email", "email", l("Your email", "البريد الإلكتروني"), {
      required: true,
      half: true,
      placeholder: l("name@gmail.com", "name@gmail.com"),
    }),
    // The country picker shows each country's own example number, so no placeholder or hint is needed.
    field("whatsapp", "phone", l("WhatsApp number", "رقم الواتساب"), { required: true }),
    field("timeline", "select", l("When do you need it?", "متى تحتاجه؟"), {
      placeholder: l("Choose a timeline", "اختر الموعد"),
      options: [
        option("asap", "As soon as possible", "في أقرب وقت"),
        option("month", "Within a month", "خلال شهر"),
        option("quarter", "In 1–3 months", "خلال 1–3 أشهر"),
        option("flexible", "I'm flexible", "الوقت مرن"),
      ],
    }),
    field("projectType", "chips", l("What do you want to build?", "ماذا تريد أن تبني؟"), {
      required: true,
      options: [
        option("website", "A website", "موقع إلكتروني"),
        option("fix", "Fix or improve a site", "إصلاح أو تطوير موقع"),
        option("platform", "A web platform", "منصة ويب"),
        option("store", "Online store", "متجر إلكتروني"),
        option("dashboard", "Dashboard / admin panel", "لوحة تحكم"),
        option("portfolio", "Portfolio", "بورتفوليو"),
        option("landing", "Landing page", "صفحة هبوط"),
        option("other", "Something else", "شيء آخر"),
      ],
    }),
    field("subject", "text", l("Subject", "الموضوع"), { enabled: false, max: 200 }),
    // Optional: the choices above already say what's needed, details are a bonus.
    field("message", "textarea", l("Project details", "تفاصيل المشروع"), {
      max: 5000,
      hint: l(
        "Your idea, the pages or features you need, and any useful links.",
        "فكرتك، والصفحات أو الميزات المطلوبة، وأي روابط مفيدة.",
      ),
    }),
  ],
  channels: { whatsapp: true, gmail: true, email: false, site: false },
  template: l(
    [
      "Hi! I'm {{name}} 👋",
      "",
      "*What I need:* {{projectType}}",
      "*Timeline:* {{timeline}}",
      "*Subject:* {{subject}}",
      "",
      "{{message}}",
      "",
      "📧 {{email}}",
      "📱 {{whatsapp}}",
    ].join("\n"),
    [
      "مرحباً، أنا {{name}} 👋",
      "",
      "*أحتاج:* {{projectType}}",
      "*الموعد:* {{timeline}}",
      "*الموضوع:* {{subject}}",
      "",
      "{{message}}",
      "",
      "📧 {{email}}",
      "📱 {{whatsapp}}",
    ].join("\n"),
  ),
  emailSubject: l("New project inquiry from {{name}}", "طلب مشروع جديد من {{name}}"),
};

/* ---------------- values → message ---------------- */

/** A raw form value as a list of trimmed, non-empty strings. */
export function asList(value: unknown): string[] {
  const list = Array.isArray(value) ? value : [value];
  return list.filter((v): v is string => typeof v === "string").map((v) => v.trim()).filter(Boolean);
}

/** What the visitor entered, as text: option labels for choices, the typed text otherwise. */
export function displayValue(f: ContactFieldDef, value: unknown, locale: string) {
  const list = asList(value);
  if (f.type === "phone") return list[0] ? formatPhone(list[0]) : "";
  if (!isChoice(f.type)) return list[0] ?? "";
  return list
    .map((v) => f.options.find((o) => o.value === v))
    .filter((o): o is ContactOption => Boolean(o))
    .map((o) => tr(o.label, locale))
    .join(locale === "ar" ? "، " : ", ");
}

const PLACEHOLDER = /\{\{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\}\}/g;

/** Template variables used in a text, e.g. ["name", "email"]. */
export function templateKeys(template: string) {
  return [...template.matchAll(PLACEHOLDER)].map((m) => m[1]);
}

/**
 * Fills {{key}} placeholders. A line whose placeholders are all empty is
 * dropped (so "Subject: {{subject}}" disappears when there is no subject),
 * and runs of blank lines collapse to one.
 */
export function renderTemplate(template: string, vars: Record<string, string>) {
  const lines = template.split(/\r?\n/).flatMap((line) => {
    const keys = templateKeys(line);
    if (keys.length && keys.every((k) => !vars[k]?.trim())) return [];
    return [line.replace(PLACEHOLDER, (_, k: string) => vars[k] ?? "")];
  });
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** WhatsApp's *bold* / _italic_ marks read as noise in an email. */
export const plainText = (text: string) => text.replace(/\*([^*\n]+)\*/g, "$1").replace(/(^|\s)_([^_\n]+)_(?=\s|$)/g, "$1$2");

export function buildMessage(config: ContactFormConfig, values: ContactValues, locale: string) {
  const fields = config.fields.filter((f) => f.enabled);
  const vars: Record<string, string> = {};
  for (const f of fields) vars[f.key] = displayValue(f, values[f.key], locale);
  // {{fields}}: every filled field as "Label: value", for templates that don't list them one by one.
  vars.fields = fields
    .filter((f) => vars[f.key])
    .map((f) => `*${tr(f.label, locale)}:* ${vars[f.key]}`)
    .join("\n");
  const template = tr(config.template, locale).trim() || "{{fields}}";
  return {
    text: renderTemplate(template, vars),
    subject: renderTemplate(tr(config.emailSubject, locale), vars).replace(/\s+/g, " "),
    vars,
  };
}

/* ---------------- links ---------------- */

/** Digits of a WhatsApp number or wa.me link: "https://wa.me/201001234567" → "201001234567". */
export const waDigits = (value: string) => value.replace(/^https?:\/\/(wa\.me|api\.whatsapp\.com)\/?/i, "").replace(/\?.*$/, "").replace(/\D/g, "");

export function channelUrl(channel: ContactChannel, to: string, subject: string, text: string) {
  const enc = encodeURIComponent;
  switch (channel) {
    case "whatsapp":
      return `https://wa.me/${waDigits(to)}?text=${enc(text)}`;
    case "email":
      return `mailto:${to}?subject=${enc(subject)}&body=${enc(plainText(text))}`;
    case "gmail": // sent by the server, nothing to open
    case "site":
      return "";
  }
}
