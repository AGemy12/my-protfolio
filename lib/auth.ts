import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { isValidObjectId } from "mongoose";
import { connectDB, hasDatabase } from "./db";
import { AdminModel } from "./models";
import { SESSION_COOKIE, verifySession } from "./session";

/**
 * The signed-in admin, or null. Beyond the signature check the proxy does, this
 * confirms the admin still exists and the token's version matches, so changing
 * the password signs out every other session. Cached per request.
 */
export const getSession = cache(async () => {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session || !hasDatabase() || !isValidObjectId(session.sub)) return null;
  await connectDB();
  const admin = await AdminModel.findById(session.sub).select("sessionVersion").lean<{ sessionVersion?: number }>();
  if (!admin || (admin.sessionVersion ?? 0) !== session.v) return null;
  return session;
});

/** Call at the top of every mutating server action / route handler. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
