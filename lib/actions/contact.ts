"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { notifyWhatsApp } from "../whatsapp";
import { connectDB } from "../db";
import { MessageModel } from "../models";
import { contactSchema } from "../schemas";
import { checkContact, type FieldErrors } from "../contact-rules";
import { clientIp, rateHit } from "../rate-limit";

export type ContactState =
  | { ok?: boolean; error?: "validation" | "rate" | "server"; fieldErrors?: FieldErrors }
  | undefined;

// At most 5 messages per IP per 10 minutes, counted in the DB so it holds across instances.
const CONTACT_MAX = 5;
const CONTACT_WINDOW_MS = 10 * 60_000;

export async function sendMessage(_: ContactState, formData: FormData): Promise<ContactState> {
  const values = Object.fromEntries(formData);
  // Same rules as the browser, so a bypassed form still gets field-by-field reasons.
  const fieldErrors = checkContact(values);
  if (Object.keys(fieldErrors).length) return { error: "validation", fieldErrors };
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { error: "validation" };
  if (parsed.data.website) return { ok: true }; // bot filled the honeypot: pretend success

  try {
    if ((await rateHit(`contact:${await clientIp()}`, CONTACT_WINDOW_MS)) > CONTACT_MAX) return { error: "rate" };
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
