import "server-only";
import { headers } from "next/headers";
import { connectDB } from "./db";
import { RateLimitModel } from "./models";

/** Best guess at the visitor's IP (Vercel sets x-forwarded-for / x-real-ip). */
export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

function windowOf(key: string, windowMs: number) {
  const bucket = Math.floor(Date.now() / windowMs);
  return { id: `${key}:${bucket}`, expiresAt: new Date((bucket + 1) * windowMs) };
}

/** How many hits `key` has in the current window, without adding one. */
export async function rateCount(key: string, windowMs: number): Promise<number> {
  await connectDB();
  const doc = await RateLimitModel.findOne({ key: windowOf(key, windowMs).id }).lean<{ count: number }>();
  return doc?.count ?? 0;
}

/** Adds one hit to `key` in the current window and returns the new total. */
export async function rateHit(key: string, windowMs: number): Promise<number> {
  await connectDB();
  const { id, expiresAt } = windowOf(key, windowMs);
  const bump = () =>
    RateLimitModel.findOneAndUpdate(
      { key: id },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, returnDocument: "after" },
    ).lean<{ count: number }>();
  try {
    return (await bump())?.count ?? 1;
  } catch (error) {
    // Two first hits in the same window can race on the upsert; the second one retries as an update.
    if ((error as { code?: number }).code !== 11000) throw error;
    return (await bump())?.count ?? 1;
  }
}
