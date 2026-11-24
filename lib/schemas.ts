// Zod schemas that validate everything the dashboard sends to the server.
import { z } from "zod";
import { EXPERIENCE_TYPES, SECTION_KEYS, SKILL_CATEGORIES } from "./types";
import { textProblem } from "./site-texts-check";
import {
  CONTACT_CHANNELS,
  CONTACT_FIELD_TYPES,
  FIELD_KEY,
  RESERVED_KEYS,
  isChoice,
  type ContactChannel,
} from "./contact-form";

const str = (max = 300) => z.string().trim().max(max).default("");
const L = (max = 300) => z.object({ en: str(max), ar: str(max) });
const LList = z.object({
  en: z.array(z.string().trim().min(1).max(500)).max(30).default([]),
  ar: z.array(z.string().trim().min(1).max(500)).max(30).default([]),
});
const url = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), "Must be a URL")
  .default("");
const order = z.coerce.number().int().min(0).max(9999).default(0);

export const settingsSchema = z.object({
  name: L(80),
  role: L(120),
  headline: L(200),
  bio: L(800),
  about: L(5000),
  location: L(120),
  heroRoles: LList,
  email: z.union([z.literal(""), z.email().max(200)]).default(""),
  phone: str(40),
  whatsapp: url,
  avatar: url,
  cvEn: url,
  cvAr: url,
  github: url,
  linkedin: url,
  x: url,
  available: z.boolean().default(true),
  yearsExperience: z.coerce.number().int().min(0).max(80).default(0),
  projectsDone: z.coerce.number().int().min(0).max(100000).default(0),
  seoTitle: L(120),
  seoDescription: L(300),
  ogImage: url,
  sections: z.object(
    Object.fromEntries(SECTION_KEYS.map((k) => [k, z.boolean().default(true)])) as Record<
      (typeof SECTION_KEYS)[number],
      z.ZodDefault<z.ZodBoolean>
    >,
  ),
});

const slug = (max: number) =>
  z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")
    .max(max);

export const categorySchema = z
  .object({
    slug: slug(60),
    name: L(60),
    published: z.boolean().default(true),
    order,
  })
  .refine((c) => c.name.en || c.name.ar, { path: ["name"], message: "Add a name" });

export const projectSchema = z.object({
  slug: slug(80),
  title: L(120),
  summary: L(400),
  description: L(8000),
  role: L(120),
  cover: url,
  gallery: z.array(url).max(20).default([]),
  tech: z.array(z.string().trim().min(1).max(40)).max(30).default([]),
  category: slug(60).default("other"),
  year: z.coerce.number().int().min(1990).max(2100).optional(),
  liveUrl: url,
  repoUrl: url,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order,
});

export const experienceSchema = z.object({
  company: str(120),
  companyUrl: url,
  role: L(120),
  location: L(120),
  type: z.enum(EXPERIENCE_TYPES).default("work"),
  start: str(20),
  end: str(20),
  current: z.boolean().default(false),
  highlights: LList,
  published: z.boolean().default(true),
  order,
});

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(60),
  icon: str(60),
  category: z.enum(SKILL_CATEGORIES).default("frontend"),
  published: z.boolean().default(true),
  order,
});

export const serviceSchema = z.object({
  title: L(120),
  description: L(600),
  icon: str(60),
  published: z.boolean().default(true),
  order,
});

/* ---------------- site texts ---------------- */

/**
 * Changed site texts, checked against the built-in ones (`defaults`, flattened
 * per language): only known keys, valid messages, no placeholders the original
 * lacks. Unchanged (empty) texts are dropped.
 */
export function siteTextsSchema(defaults: { en: Record<string, string>; ar: Record<string, string> }) {
  return z
    .record(z.string().max(120), L(2000))
    .superRefine((texts, ctx) => {
      for (const [key, value] of Object.entries(texts)) {
        if (!(key in defaults.en)) {
          ctx.addIssue({ code: "custom", path: [key], message: "Unknown text" });
          continue;
        }
        for (const lang of ["en", "ar"] as const) {
          // either language's original may name a placeholder, so both are allowed
          const problem = value[lang] && textProblem(value[lang], `${defaults.en[key]} ${defaults.ar[key] ?? ""}`);
          if (problem) ctx.addIssue({ code: "custom", path: [key, lang], message: problem });
        }
      }
    })
    .transform((texts) => Object.fromEntries(Object.entries(texts).filter(([, v]) => v.en || v.ar)));
}

/* ---------------- contact form (built in the dashboard) ---------------- */

const contactOptionSchema = z.object({
  value: z.string().trim().regex(/^[a-zA-Z0-9_-]{1,40}$/),
  label: L(120),
});

const contactFieldSchema = z
  .object({
    key: z
      .string()
      .trim()
      .regex(FIELD_KEY, "Start with a letter; use letters, numbers and _ only")
      .refine((k) => !(RESERVED_KEYS as readonly string[]).includes(k), "This key is reserved"),
    type: z.enum(CONTACT_FIELD_TYPES),
    label: L(120),
    placeholder: L(200),
    hint: L(300),
    required: z.boolean().default(false),
    enabled: z.boolean().default(true),
    half: z.boolean().default(false),
    min: z.coerce.number().int().min(0).max(5000).default(0),
    max: z.coerce.number().int().min(1).max(5000).default(500),
    multiple: z.boolean().default(false),
    options: z.array(contactOptionSchema).max(30).default([]),
  })
  .superRefine((f, ctx) => {
    if (!f.label.en && !f.label.ar) ctx.addIssue({ code: "custom", path: ["label"], message: "Add a label" });
    if (f.min > f.max) ctx.addIssue({ code: "custom", path: ["min"], message: "Minimum is above the maximum" });
    if (isChoice(f.type) && !f.options.length) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "Add at least one option" });
    }
    if (new Set(f.options.map((o) => o.value)).size !== f.options.length) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "Options must be unique" });
    }
    f.options.forEach((o, i) => {
      if (!o.label.en && !o.label.ar) ctx.addIssue({ code: "custom", path: ["options", i], message: "Add a label" });
    });
  });

export const contactFormSchema = z.object({
  fields: z
    .array(contactFieldSchema)
    .min(1)
    .max(30)
    .superRefine((fields, ctx) => {
      const seen = new Set<string>();
      fields.forEach((f, i) => {
        if (seen.has(f.key)) ctx.addIssue({ code: "custom", path: [i, "key"], message: `"${f.key}" is used twice` });
        seen.add(f.key);
      });
      if (!fields.some((f) => f.enabled)) ctx.addIssue({ code: "custom", message: "Keep at least one field on" });
    }),
  channels: z
    .object(
      Object.fromEntries(CONTACT_CHANNELS.map((c) => [c, z.boolean().default(false)])) as Record<
        ContactChannel,
        z.ZodDefault<z.ZodBoolean>
      >,
    )
    .refine((c) => Object.values(c).some(Boolean), "Turn on at least one way to send"),
  template: L(4000),
  emailSubject: L(200),
});

/** What the public form posts. Field values are checked against the saved form with contact-rules. */
export const contactSubmitSchema = z.object({
  channel: z.enum(CONTACT_CHANNELS),
  locale: z.enum(["en", "ar"]).catch("en"),
  values: z.record(
    z.string().max(40),
    z.union([z.string().max(10_000), z.array(z.string().max(200)).max(30)]),
  ),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});
