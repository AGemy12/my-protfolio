// Read-side data access for the public site. Every getter falls back to the
// starter content when the database is empty or unreachable, so the site
// always renders (including during `next build`).
import "server-only";
import { cache } from "react";
import { connectDB, hasDatabase } from "./db";
import {
  CategoryModel,
  ContactFormModel,
  ExperienceModel,
  ProjectModel,
  ServiceModel,
  SettingsModel,
  SiteTextModel,
  SkillModel,
} from "./models";
import { legacyTexts, type TextOverrides } from "./site-texts";
import { legacySocials } from "./socials";
import {
  defaultCategories,
  defaultExperience,
  defaultProjects,
  defaultServices,
  defaultSettings,
  defaultSkills,
} from "./defaults";
import { defaultContactForm, type ContactFormConfig } from "./contact-form";
import { contactFormSchema } from "./schemas";
import type { Category, Experience, Project, Service, Settings, Skill } from "./types";

/** Converts Mongo documents to plain JSON-safe objects (ObjectId/Date → string). */
export function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc));
}

const withIds = <T,>(items: Omit<T, "_id">[], prefix: string) =>
  items.map((item, i) => ({ ...item, _id: `${prefix}-${i}` }) as T);

async function safely<T>(load: () => Promise<T | null>, fallback: () => T): Promise<T> {
  if (!hasDatabase()) return fallback();
  try {
    const value = await load();
    return value ?? fallback();
  } catch (error) {
    console.error("[data] falling back to starter content:", (error as Error).message);
    return fallback();
  }
}

/** A stored Settings document as complete Settings (defaults for anything missing). */
export function settingsFromDoc(doc: unknown): Settings {
  const s = serialize<Settings & { github?: string; linkedin?: string; x?: string }>(doc);
  return {
    ...defaultSettings,
    ...s,
    sections: { ...defaultSettings.sections, ...s.sections },
    // saved before links became a list → build it from the old fixed fields
    socials: Array.isArray(s.socials) ? s.socials : legacySocials(s),
  };
}

export const getSettings = cache(() =>
  safely<Settings>(
    async () => {
      await connectDB();
      const doc = await SettingsModel.findOne({ key: "main" }).lean();
      return doc ? settingsFromDoc(doc) : null;
    },
    () => defaultSettings,
  ),
);

/** Reads the stored site-text changes: [{ key, en, ar }] → { key: { en, ar } }. */
export function parseTextItems(items: unknown): TextOverrides {
  const out: TextOverrides = {};
  if (!Array.isArray(items)) return out;
  for (const item of items as { key?: unknown; en?: unknown; ar?: unknown }[]) {
    if (typeof item?.key !== "string") continue;
    out[item.key] = { en: typeof item.en === "string" ? item.en : "", ar: typeof item.ar === "string" ? item.ar : "" };
  }
  return out;
}

/** Site texts changed in the dashboard, laid over messages/*.json by i18n/request.ts. */
export const getSiteTexts = cache(() =>
  safely<TextOverrides>(
    async () => {
      await connectDB();
      const [doc, settings] = await Promise.all([
        SiteTextModel.findOne({ key: "main" }).lean<{ items?: unknown }>(),
        SettingsModel.findOne({ key: "main" }, { texts: 1 }).lean<{ texts?: unknown }>(),
      ]);
      return { ...legacyTexts(settings?.texts), ...parseTextItems(doc?.items) };
    },
    () => ({}),
  ),
);

async function list<T>(model: typeof ProjectModel, filter: object, seed: Omit<T, "_id">[], prefix: string) {
  return safely<T[]>(
    async () => {
      await connectDB();
      const total = await model.estimatedDocumentCount();
      if (total === 0) return null; // nothing imported yet → starter content
      return serialize<T[]>(await model.find(filter).sort({ order: 1, createdAt: -1 }).lean());
    },
    () => withIds<T>(seed, prefix).filter((x) => (x as { published?: boolean }).published !== false),
  );
}

/** Every category, hidden ones included: they still name their projects. */
export const getCategories = cache(() => list<Category>(CategoryModel, {}, defaultCategories, "category"));

/** Published projects, each with its category's name attached (`categoryName`). */
export const getProjects = cache(async () => {
  const [projects, categories] = await Promise.all([
    list<Project>(ProjectModel, { published: true }, defaultProjects, "project"),
    getCategories(),
  ]);
  const names = new Map(categories.map((c) => [c.slug, c.name]));
  // A project whose category was removed falls back to showing the slug.
  return projects.map((p) => ({ ...p, categoryName: names.get(p.category) ?? { en: p.category, ar: p.category } }));
});
export const getExperience = cache(() =>
  list<Experience>(ExperienceModel, { published: true }, defaultExperience, "exp"),
);
export const getSkills = cache(() => list<Skill>(SkillModel, { published: true }, defaultSkills, "skill"));
export const getServices = cache(() => list<Service>(ServiceModel, { published: true }, defaultServices, "service"));

/** A stored contact form, checked again on the way out; anything unreadable falls back to the default form. */
export function parseContactForm(doc: unknown): ContactFormConfig {
  const parsed = contactFormSchema.safeParse(doc);
  return parsed.success ? parsed.data : defaultContactForm;
}

export const getContactForm = cache(() =>
  safely<ContactFormConfig>(
    async () => {
      await connectDB();
      const doc = await ContactFormModel.findOne({ key: "main" }).lean();
      return doc ? parseContactForm(serialize(doc)) : null;
    },
    () => defaultContactForm,
  ),
);

export const getProject = cache(async (slug: string) => {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
});
