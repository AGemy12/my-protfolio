"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { connectDB } from "../db";
import { AdminModel } from "../models";
import { requireAdmin } from "../auth";
import { clientIp, rateCount, rateHit } from "../rate-limit";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "../session";

export type FormState = { ok?: boolean; error?: string } | undefined;

// After this many wrong logins from one IP, further attempts are refused until the window ends.
const LOGIN_MAX_FAILURES = 5;
const LOGIN_WINDOW_MS = 15 * 60_000;

const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1).max(200),
});

async function startSession(admin: { _id: unknown; email: string; sessionVersion?: number }) {
  const token = await signSession({ sub: String(admin._id), email: admin.email, v: admin.sessionVersion ?? 0 });
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
}

/**
 * Logs in against the Admin collection. On the very first login (no admin in
 * the DB yet) the ADMIN_EMAIL / ADMIN_PASSWORD env vars are accepted and the
 * admin account is created with a bcrypt hash.
 */
export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "invalid" };
  const { email, password } = parsed.data;

  try {
    await connectDB();
    const limitKey = `login:${await clientIp()}`;
    if ((await rateCount(limitKey, LOGIN_WINDOW_MS)) >= LOGIN_MAX_FAILURES) return { error: "locked" };

    let admin = await AdminModel.findOne({ email });

    if (!admin && (await AdminModel.estimatedDocumentCount()) === 0) {
      const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const envPassword = process.env.ADMIN_PASSWORD;
      if (envEmail && envPassword && email === envEmail && password === envPassword) {
        admin = await AdminModel.create({ email, passwordHash: await bcrypt.hash(password, 12) });
      }
    }

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      const failures = await rateHit(limitKey, LOGIN_WINDOW_MS);
      await new Promise((r) => setTimeout(r, 600)); // slow down guessing
      return { error: failures >= LOGIN_MAX_FAILURES ? "locked" : "invalid" };
    }

    await startSession(admin);
    return { ok: true };
  } catch (error) {
    console.error("[login]", error);
    return { error: "server" };
  }
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
}

const passwordSchema = z
  .object({
    current: z.string().min(1),
    next: z.string().min(8).max(200),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { path: ["confirm"] });

/** Changes the password and signs out every other session; this one gets a fresh token. */
export async function changePassword(_: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "passwordRules" };

  await connectDB();
  const admin = await AdminModel.findById(session.sub);
  if (!admin || !(await bcrypt.compare(parsed.data.current, admin.passwordHash))) {
    return { error: "wrongPassword" };
  }
  admin.passwordHash = await bcrypt.hash(parsed.data.next, 12);
  admin.sessionVersion = (admin.sessionVersion ?? 0) + 1;
  await admin.save();
  await startSession(admin);
  return { ok: true };
}

/** Signs out every device, including this one. */
export async function logoutEverywhere(): Promise<FormState> {
  const session = await requireAdmin();
  await connectDB();
  await AdminModel.findByIdAndUpdate(session.sub, { $inc: { sessionVersion: 1 } });
  (await cookies()).delete(SESSION_COOKIE);
  return { ok: true };
}
