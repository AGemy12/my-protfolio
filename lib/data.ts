// Read-side data access for the public site. Every getter falls back to the
// starter content when the database is empty or unreachable, so the site
// always renders (including during `next build`).
import "server-only";
import { cache } from "react";
import { connectDB, hasDatabase } from "./db";
import { ExperienceModel, ProjectModel, ServiceModel, SettingsModel, SkillModel } from "./models";
import { defaultExperience, defaultProjects, defaultServices, defaultSettings, defaultSkills } from "./defaults";
import type { Experience, Project, Service, Settings, Skill } from "./types";

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

export const getSettings = cache(() =>
  safely<Settings>(
    async () => {
      await connectDB();
      const doc = await SettingsModel.findOne({ key: "main" }).lean();
      if (!doc) return null;
      const s = serialize<Settings>(doc);
      return { ...defaultSettings, ...s, sections: { ...defaultSettings.sections, ...s.sections } };
    },
    () => defaultSettings,
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

export const getProjects = cache(() => list<Project>(ProjectModel, { published: true }, defaultProjects, "project"));
export const getExperience = cache(() =>
  list<Experience>(ExperienceModel, { published: true }, defaultExperience, "exp"),
);
export const getSkills = cache(() => list<Skill>(SkillModel, { published: true }, defaultSkills, "skill"));
export const getServices = cache(() => list<Service>(ServiceModel, { published: true }, defaultServices, "service"));

export const getProject = cache(async (slug: string) => {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
});
