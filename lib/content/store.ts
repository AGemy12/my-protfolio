import { cache } from "react";
import { unstable_cache } from "next/cache";
import { contentCollection, isDbConfigured } from "@/lib/db";
import { defaultContent, normalizeContent } from "./normalize";
import type { SiteContent } from "./types";

export const CONTENT_TAG = "site-content";

export type StoredContent = {
  content: SiteContent;
  /** 0 until the first save from the dashboard. */
  version: number;
  updatedAt: string | null;
  source: "database" | "defaults";
};

/** Reads straight from MongoDB. Throws if the database can't be reached. */
export async function readStoredContent(): Promise<StoredContent> {
  if (!isDbConfigured()) {
    return { content: defaultContent, version: 0, updatedAt: null, source: "defaults" };
  }
  const doc = await (await contentCollection()).findOne({ _id: "site" });
  if (!doc) return { content: defaultContent, version: 0, updatedAt: null, source: "defaults" };
  return {
    content: normalizeContent(doc.data),
    version: doc.version,
    updatedAt: doc.updatedAt.toISOString(),
    source: "database",
  };
}

// Shared across requests and refreshed by revalidateTag(CONTENT_TAG) when the
// dashboard saves. A failed read throws inside the cache, so it is not stored
// and the next request tries again.
const cachedContent = unstable_cache(
  async () => (await readStoredContent()).content,
  ["site-content"],
  { tags: [CONTENT_TAG] },
);

/** Content for the public site. Falls back to the built-in defaults on error. */
export const getContent = cache(async (): Promise<SiteContent> => {
  try {
    return await cachedContent();
  } catch (error) {
    console.error("[content] Database unavailable, using built-in content.", error);
    return defaultContent;
  }
});

export class VersionConflictError extends Error {}

/** Saves content if nobody else saved since `expectedVersion` was read. */
export async function writeContent(content: SiteContent, expectedVersion: number) {
  const collection = await contentCollection();
  const updatedAt = new Date();
  const version = expectedVersion + 1;

  if (expectedVersion === 0) {
    try {
      await collection.insertOne({ _id: "site", data: content, version, updatedAt });
    } catch (error) {
      // 11000: duplicate key, so someone else made the first save.
      if ((error as { code?: number }).code === 11000) throw new VersionConflictError();
      throw error;
    }
  } else {
    const result = await collection.updateOne(
      { _id: "site", version: expectedVersion },
      { $set: { data: content, version, updatedAt } },
    );
    if (result.matchedCount === 0) throw new VersionConflictError();
  }

  return { version, updatedAt: updatedAt.toISOString() };
}
