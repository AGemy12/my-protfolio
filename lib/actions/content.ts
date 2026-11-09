"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { connectDB } from "../db";
import { requireAdmin } from "../auth";
import { ExperienceModel, MessageModel, ProjectModel, ServiceModel, SettingsModel, SkillModel } from "../models";
import { experienceSchema, projectSchema, serviceSchema, settingsSchema, skillSchema } from "../schemas";
import { defaultExperience, defaultProjects, defaultServices, defaultSettings, defaultSkills } from "../defaults";
import type { ResourceKey } from "../resources";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string; issues?: string[] };

const registry = {
  projects: { model: ProjectModel, schema: projectSchema },
  experience: { model: ExperienceModel, schema: experienceSchema },
  skills: { model: SkillModel, schema: skillSchema },
  services: { model: ServiceModel, schema: serviceSchema },
} as const;

/** Content changed → regenerate every statically rendered page (both locales). */
function refresh() {
  revalidatePath("/", "layout");
}

function fail(error: unknown): ActionResult {
  if ((error as { code?: number }).code === 11000) return { ok: false, error: "slugTaken" };
  console.error("[content action]", error);
  return { ok: false, error: (error as Error).message === "Unauthorized" ? "unauthorized" : "server" };
}

export async function saveItem(resource: ResourceKey, id: string | null, data: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const { model, schema } = registry[resource];
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return {
        ok: false,
        error: "validation",
        issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      };
    }
    await connectDB();
    let savedId = id;
    if (id) {
      const updated = await model.findByIdAndUpdate(id, parsed.data, { runValidators: true });
      if (!updated) return { ok: false, error: "notFound" };
    } else {
      const created = await model.create(parsed.data);
      savedId = String(created._id);
    }
    refresh();
    return { ok: true, id: savedId ?? undefined };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteItem(resource: ResourceKey, id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    await registry[resource].model.findByIdAndDelete(id);
    refresh();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function toggleItem(
  resource: ResourceKey,
  id: string,
  field: "published" | "featured",
  value: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    await registry[resource].model.findByIdAndUpdate(id, { [field]: value });
    refresh();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

/** Persists a new order after drag/arrow reordering in a list. */
export async function reorderItems(resource: ResourceKey, ids: string[]): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    await registry[resource].model.bulkWrite(
      ids.map((_id, index) => ({ updateOne: { filter: { _id }, update: { order: index + 1 } } })),
    );
    refresh();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function saveSettings(data: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = settingsSchema.safeParse(data);
    if (!parsed.success) {
      return {
        ok: false,
        error: "validation",
        issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      };
    }
    await connectDB();
    await SettingsModel.findOneAndUpdate({ key: "main" }, { ...parsed.data, key: "main" }, { upsert: true });
    refresh();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

/** Copies the starter content (from the CV) into every collection that is still empty. */
export async function importStarterContent(): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    const pairs = [
      [ProjectModel, defaultProjects],
      [ExperienceModel, defaultExperience],
      [SkillModel, defaultSkills],
      [ServiceModel, defaultServices],
    ] as const;
    for (const [model, items] of pairs) {
      if ((await model.estimatedDocumentCount()) === 0) await model.insertMany(items);
    }
    if (!(await SettingsModel.exists({ key: "main" }))) {
      await SettingsModel.create({ ...defaultSettings, key: "main" });
    }
    refresh();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function setMessageRead(id: string, read: boolean): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    await MessageModel.findByIdAndUpdate(id, { read });
    revalidatePath("/[locale]/admin", "layout");
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    await MessageModel.findByIdAndDelete(id);
    revalidatePath("/[locale]/admin", "layout");
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteBlob(url: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!/^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(url)) {
      return { ok: false, error: "notBlob" };
    }
    await del(url);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
