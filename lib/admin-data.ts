// Read-side data access for the dashboard (always live, never the starter fallback).
import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "./db";
import {
  CategoryModel,
  ContactFormModel,
  ExperienceModel,
  MessageModel,
  ProjectModel,
  ServiceModel,
  SettingsModel,
  SkillModel,
} from "./models";
import { parseContactForm, serialize } from "./data";
import { defaultCategories, defaultSettings } from "./defaults";
import { defaultContactForm } from "./contact-form";
import { resources, type RefOptions, type ResourceKey } from "./resources";
import type { Category, Message, Settings } from "./types";

const models = {
  projects: ProjectModel,
  categories: CategoryModel,
  experience: ExperienceModel,
  skills: SkillModel,
  services: ServiceModel,
} as const;

export async function adminList(resource: ResourceKey) {
  await connectDB();
  // Projects already point to the starter category slugs, so the first visit to an
  // empty Categories page saves them. Otherwise adding one category would replace
  // all of them on the site and existing projects would lose their category names.
  if (resource === "categories" && (await CategoryModel.estimatedDocumentCount()) === 0) {
    await CategoryModel.insertMany(defaultCategories, { ordered: false }).catch(() => {});
  }
  return serialize<Array<Record<string, unknown> & { _id: string }>>(
    await models[resource].find().sort({ order: 1, createdAt: -1 }).lean(),
  );
}

export async function adminGet(resource: ResourceKey, id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const doc = await models[resource].findById(id).lean();
  return doc ? serialize<Record<string, unknown> & { _id: string }>(doc) : null;
}

/**
 * The choices for every "ref" field of this resource's form (e.g. the categories
 * for a project). Before any category is saved, the starter ones are offered so
 * the form still works; they are written to the database by "Import".
 */
export async function adminRefOptions(resource: ResourceKey): Promise<RefOptions> {
  const refs = [...new Set(resources[resource].fields.flatMap((f) => (f.type === "ref" ? [f.ref] : [])))];
  if (!refs.length) return {};
  await connectDB();
  const entries = await Promise.all(
    refs.map(async (ref) => {
      const items = serialize<Category[]>(await models[ref].find().sort({ order: 1, createdAt: -1 }).lean());
      const list = items.length ? items : defaultCategories;
      return [ref, list.map((c) => ({ value: c.slug, label: c.name }))] as const;
    }),
  );
  return Object.fromEntries(entries);
}

export async function adminSettings(): Promise<{ settings: Settings; saved: boolean }> {
  await connectDB();
  const doc = await SettingsModel.findOne({ key: "main" }).lean();
  if (!doc) return { settings: defaultSettings, saved: false };
  const s = serialize<Settings>(doc);
  return {
    settings: {
      ...defaultSettings,
      ...s,
      sections: { ...defaultSettings.sections, ...s.sections },
      texts: { ...defaultSettings.texts, ...s.texts },
    },
    saved: true,
  };
}

export async function adminContactForm() {
  await connectDB();
  const doc = await ContactFormModel.findOne({ key: "main" }).lean();
  return doc ? parseContactForm(serialize(doc)) : defaultContactForm;
}

export async function adminMessages(limit = 200) {
  await connectDB();
  return serialize<Message[]>(await MessageModel.find().sort({ createdAt: -1 }).limit(limit).lean());
}

export async function adminCounts() {
  await connectDB();
  const [projects, experience, skills, services, messages, unread, settings] = await Promise.all([
    ProjectModel.countDocuments(),
    ExperienceModel.countDocuments(),
    SkillModel.countDocuments(),
    ServiceModel.countDocuments(),
    MessageModel.countDocuments(),
    MessageModel.countDocuments({ read: false }),
    SettingsModel.exists({ key: "main" }),
  ]);
  return { projects, experience, skills, services, messages, unread, hasSettings: Boolean(settings) };
}

export async function unreadCount() {
  try {
    await connectDB();
    return await MessageModel.countDocuments({ read: false });
  } catch {
    return 0;
  }
}
