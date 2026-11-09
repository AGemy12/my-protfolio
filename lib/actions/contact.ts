"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { notifyWhatsApp } from "../whatsapp";
import { connectDB } from "../db";
import { MessageModel } from "../models";
import { contactSchema } from "../schemas";

export type ContactState = { ok?: boolean; error?: "validation" | "rate" | "server" } | undefined;

// Best-effort per-instance limiter: 5 messages per IP per 10 minutes.
const hits = new Map<string, number[]>();

export async function sendMessage(_: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "validation" };
  if (parsed.data.website) return { ok: true }; // bot filled the honeypot: pretend success

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 5) return { error: "rate" };
  hits.set(ip, [...recent, now]);

  try {
    await connectDB();
    const { name, email, whatsapp, subject, message } = parsed.data;
    await MessageModel.create({ name, email, whatsapp, subject, message });
    revalidatePath("/[locale]/admin", "layout");
    // Runs after the response is sent, so the visitor doesn't wait on WhatsApp.
    after(() => notifyWhatsApp({ name, email, whatsapp, subject, message }));
    return { ok: true };
  } catch (error) {
    console.error("[contact]", error);
    return { error: "server" };
  }
}
