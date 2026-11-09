// Zod schemas that validate everything the dashboard sends to the server.
import { z } from "zod";
import { EXPERIENCE_TYPES, PROJECT_CATEGORIES, SECTION_KEYS, SKILL_CATEGORIES } from "./types";

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

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")
    .max(80),
  title: L(120),
  summary: L(400),
  description: L(8000),
  role: L(120),
  cover: url,
  gallery: z.array(url).max(20).default([]),
  tech: z.array(z.string().trim().min(1).max(40)).max(30).default([]),
  category: z.enum(PROJECT_CATEGORIES).default("other"),
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

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  // International WhatsApp number: "+20 114 956 0988", "0020-114…" → "+201149560988"
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/^00/, "+").replace(/(?!^\+)\D/g, ""))
    .pipe(z.string().regex(/^\+?\d{8,15}$/)),
  subject: z.string().trim().max(200).default(""),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});
