/**
 * Contact-form rules shared by the browser (instant, per-field feedback) and
 * the server action (the real gate), so both report the same specific problem.
 * Each failure is a code; the message for it lives in messages/*.json under
 * `contact.errors.fields.<field>.<code>`.
 */

export const CONTACT_FIELDS = ["name", "email", "whatsapp", "subject", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type FieldError = { code: string; count?: number };
export type FieldErrors = Partial<Record<ContactField, FieldError>>;

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 5000;

/** "+20 114 956 0988", "0020-114…" → "+201149560988" */
export function normalizeWhatsApp(value: string) {
  return value.trim().replace(/^00/, "+").replace(/(?!^\+)\D/g, "");
}

export function checkField(field: ContactField, raw: string): FieldError | null {
  const v = raw.trim();
  switch (field) {
    case "name":
      if (!v) return { code: "required" };
      if (v.length < 2) return { code: "tooShort" };
      if (v.length > 100) return { code: "tooLong" };
      return null;

    case "email": {
      if (!v) return { code: "required" };
      if (/\s/.test(v)) return { code: "spaces" };
      const at = v.lastIndexOf("@");
      if (at === -1) return { code: "noAt" };
      if (at === 0) return { code: "noName" };
      const domain = v.slice(at + 1);
      if (!/^[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(domain)) return { code: "noDomain" };
      if (v.length > 200) return { code: "tooLong" };
      if (!/^[^\s@]+@[^\s@]+$/.test(v)) return { code: "invalid" };
      return null;
    }

    case "whatsapp": {
      if (!v) return { code: "required" };
      if (/[^\d\s+\-().]/.test(v)) return { code: "chars" };
      const n = normalizeWhatsApp(v);
      if (!n.startsWith("+")) return { code: "countryCode" };
      const digits = n.length - 1;
      if (digits < 8) return { code: "tooShort", count: digits };
      if (digits > 15) return { code: "tooLong", count: digits };
      return null;
    }

    case "subject":
      return v.length > 200 ? { code: "tooLong" } : null;

    case "message":
      if (!v) return { code: "required" };
      if (v.length < MESSAGE_MIN) return { code: "tooShort", count: v.length };
      if (v.length > MESSAGE_MAX) return { code: "tooLong", count: v.length };
      return null;
  }
}

export function checkContact(values: Partial<Record<ContactField, unknown>>): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of CONTACT_FIELDS) {
    const raw = values[field];
    const error = checkField(field, typeof raw === "string" ? raw : "");
    if (error) errors[field] = error;
  }
  return errors;
}
