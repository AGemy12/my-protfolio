/**
 * Contact-form rules shared by the browser (instant, per-field feedback) and
 * the server action (the real gate), so both report the same specific problem.
 * Fields come from the dashboard, so the rules follow each field's type and
 * limits. Each failure is a code; its message lives in messages/*.json under
 * `contact.errors.field.<code>`.
 */
import { isValidPhoneNumber, validatePhoneNumberLength } from "libphonenumber-js";
import { asList, isChoice, type ContactFieldDef, type ContactValues } from "./contact-form";

export type FieldError = { code: string; count?: number; min?: number; max?: number };
export type FieldErrors = Record<string, FieldError>;

/** "+20 100 123 4567", "0020-100…" → "+201001234567" */
export function normalizeWhatsApp(value: string) {
  return value.trim().replace(/^00/, "+").replace(/(?!^\+)\D/g, "");
}

function checkEmail(v: string): FieldError | null {
  if (/\s/.test(v)) return { code: "emailSpaces" };
  const at = v.lastIndexOf("@");
  if (at === -1) return { code: "emailNoAt" };
  if (at === 0) return { code: "emailNoName" };
  const domain = v.slice(at + 1);
  if (!/^[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(domain)) return { code: "emailNoDomain" };
  if (v.length > 200) return { code: "emailTooLong" };
  if (!/^[^\s@]+@[^\s@]+$/.test(v)) return { code: "emailInvalid" };
  return null;
}

/** Checked against each country's numbering plan (lengths and prefixes), via libphonenumber. */
function checkPhone(v: string): FieldError | null {
  if (/[^\d\s+\-().]/.test(v)) return { code: "phoneChars" };
  const n = normalizeWhatsApp(v);
  if (!n.startsWith("+")) return { code: "phoneCountryCode" };
  switch (validatePhoneNumberLength(n)) {
    case "INVALID_COUNTRY":
      return { code: "phoneCountryCode" };
    case "TOO_SHORT":
      return { code: "phoneTooShort" };
    case "TOO_LONG":
      return { code: "phoneTooLong" };
    case "NOT_A_NUMBER":
    case "INVALID_LENGTH":
      return { code: "phoneInvalid" };
  }
  return isValidPhoneNumber(n) ? null : { code: "phoneInvalid" };
}

export function checkField(f: ContactFieldDef, raw: unknown): FieldError | null {
  const list = asList(raw);

  if (isChoice(f.type)) {
    if (!list.length) return f.required ? { code: "requiredChoice" } : null;
    const known = list.every((v) => f.options.some((o) => o.value === v));
    if (!known || (list.length > 1 && !(f.type === "chips" && f.multiple))) return { code: "invalidChoice" };
    return null;
  }

  const v = list[0] ?? "";
  if (!v) return f.required ? { code: "required" } : null;
  switch (f.type) {
    case "email":
      return checkEmail(v);
    case "phone":
      return checkPhone(v);
    default:
      if (f.min && v.length < f.min) return { code: "tooShort", count: v.length, min: f.min };
      if (f.max && v.length > f.max) return { code: "tooLong", count: v.length, max: f.max };
      return null;
  }
}

/** One error per invalid field, checking only the fields that are switched on. */
export function checkContact(fields: ContactFieldDef[], values: Partial<ContactValues>): FieldErrors {
  const errors: FieldErrors = {};
  for (const f of fields) {
    if (!f.enabled) continue;
    const error = checkField(f, values[f.key]);
    if (error) errors[f.key] = error;
  }
  return errors;
}
