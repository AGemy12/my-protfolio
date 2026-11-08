"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { checkPassword, endSession, isAdmin, isAuthConfigured, startSession } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";
import { normalizeContent, validateContent, type ContentIssue } from "@/lib/content/normalize";
import { CONTENT_TAG, VersionConflictError, writeContent } from "@/lib/content/store";
import type { SiteContent } from "@/lib/content/types";

export type LoginState = { error?: string };

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { error: "لوحة التحكم غير مهيأة بعد. أضف ADMIN_PASSWORD و ADMIN_SECRET إلى متغيرات البيئة." };
  }
  if (!checkPassword(String(formData.get("password") ?? ""))) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // slows down guessing
    return { error: "كلمة المرور غير صحيحة." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export type SaveResult =
  | { ok: true; content: SiteContent; version: number; updatedAt: string }
  | { ok: false; error: string; issues?: ContentIssue[]; conflict?: boolean; signedOut?: boolean };

export async function saveContent(input: unknown, expectedVersion: number): Promise<SaveResult> {
  if (!(await isAdmin())) {
    return { ok: false, signedOut: true, error: "انتهت الجلسة. سجّل الدخول مرة أخرى ثم احفظ." };
  }
  if (!isDbConfigured()) {
    return { ok: false, error: "قاعدة البيانات غير مهيأة. أضف MONGODB_URI إلى متغيرات البيئة." };
  }
  if (JSON.stringify(input ?? null).length > 1_000_000) {
    return { ok: false, error: "المحتوى أكبر من الحد المسموح." };
  }

  const content = normalizeContent(input);
  const issues = validateContent(content);
  if (issues.length) {
    return { ok: false, error: "راجع هذه الحقول قبل الحفظ:", issues };
  }

  try {
    const saved = await writeContent(content, Math.max(0, Math.floor(Number(expectedVersion) || 0)));
    revalidateTag(CONTENT_TAG);
    revalidatePath("/", "layout");
    return { ok: true, content, ...saved };
  } catch (error) {
    if (error instanceof VersionConflictError) {
      return {
        ok: false,
        conflict: true,
        error: "تم حفظ نسخة أحدث من نافذة أو جهاز آخر. أعد تحميل الصفحة لترى آخر نسخة، ثم أعد تعديلك.",
      };
    }
    console.error("[admin] Save failed", error);
    return { ok: false, error: "تعذّر الحفظ في قاعدة البيانات. تحقق من الاتصال وحاول مرة أخرى." };
  }
}
