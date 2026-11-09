"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { connectDB } from "../db";
import { AdminModel } from "../models";
import { requireAdmin } from "../auth";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "../session";

export type FormState = { ok?: boolean; error?: string } | undefined;

const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1).max(200),
});

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
    let admin = await AdminModel.findOne({ email });

    if (!admin && (await AdminModel.estimatedDocumentCount()) === 0) {
      const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const envPassword = process.env.ADMIN_PASSWORD;
      if (envEmail && envPassword && email === envEmail && password === envPassword) {
        admin = await AdminModel.create({ email, passwordHash: await bcrypt.hash(password, 12) });
      }
    }

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      await new Promise((r) => setTimeout(r, 600)); // slow down guessing
      return { error: "invalid" };
    }

    const token = await signSession({ sub: String(admin._id), email: admin.email });
    (await cookies()).set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
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
  await admin.save();
  return { ok: true };
}
