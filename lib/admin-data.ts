// Read-side data access for the dashboard (always live, never the starter fallback).
import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "./db";
import {
  ContactFormModel,
  ExperienceModel,
  MessageModel,
  ProjectModel,
  ServiceModel,
  SettingsModel,
  SkillModel,
} from "./models";
import { parseContactForm, serialize } from "./data";
import { defaultSettings } from "./defaults";
import { defaultContactForm } from "./contact-form";
import type { ResourceKey } from "./resources";
import type { Message, Settings } from "./types";

const models = {
  projects: ProjectModel,
  experience: ExperienceModel,
  skills: SkillModel,
  services: ServiceModel,
} as const;

export async function adminList(resource: ResourceKey) {
  await connectDB();
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
