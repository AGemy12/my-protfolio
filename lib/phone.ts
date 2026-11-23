// Phone helpers shared by the contact form and its rules. Client-safe.
import {
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

export const FALLBACK_COUNTRY: CountryCode = "EG";

/** Shown first in the country list, after the visitor's own country. */
export const SUGGESTED_COUNTRIES: CountryCode[] = ["EG", "SA", "AE", "KW", "QA", "BH", "OM", "JO"];

/**
 * Time zones say more than the browser language (plenty of people in Cairo browse
 * in en-US), so they come first; only zones that map to one country are listed.
 */
const ZONES: Record<string, CountryCode> = {
  "Africa/Cairo": "EG",
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Asia/Kuwait": "KW",
  "Asia/Qatar": "QA",
  "Asia/Bahrain": "BH",
  "Asia/Muscat": "OM",
  "Asia/Amman": "JO",
  "Asia/Beirut": "LB",
  "Asia/Baghdad": "IQ",
  "Asia/Damascus": "SY",
  "Asia/Gaza": "PS",
  "Asia/Hebron": "PS",
  "Asia/Aden": "YE",
  "Africa/Tripoli": "LY",
  "Africa/Tunis": "TN",
  "Africa/Algiers": "DZ",
  "Africa/Casablanca": "MA",
  "Africa/Khartoum": "SD",
  "Europe/Istanbul": "TR",
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL",
  "Asia/Karachi": "PK",
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
};

/** Best guess at the visitor's country, for the phone field's starting flag. Browser only. */
export function guessCountry(): CountryCode {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (ZONES[zone]) return ZONES[zone];
  } catch {
    // no Intl time zone support: fall through
  }
  for (const tag of navigator.languages ?? [navigator.language]) {
    const region = tag?.split("-")[1]?.toUpperCase();
    if (region && isSupportedCountry(region)) return region;
  }
  return FALLBACK_COUNTRY;
}

const CALLING_CODES = new Set(getCountries().map((c) => getCountryCallingCode(c)));

/**
 * Lets people type an international number without the "+": "966 50…" or
 * "00966 50…" becomes "+966 50…", so the field switches to Saudi Arabia.
 *
 * Local numbers are left alone. A number is taken as local when it starts with
 * the trunk "0" ("0100…", "050…") or with the same digit as the selected
 * country's mobile numbers ("100…" in Egypt, "50…" in Saudi Arabia), since this
 * is a WhatsApp field. Only 2–3 digit codes switch on their own: "1" and "7"
 * are too often the start of a local number, so those need "+" or "00".
 */
export function smartInternational(raw: string, country?: CountryCode) {
  if (raw.includes("+")) return raw;
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (!digits || digits.startsWith("0")) return raw;
  if (country) {
    // North American local numbers can start with almost any digit, so there is no safe guess.
    if (getCountryCallingCode(country) === "1") return raw;
    const mobile = getExampleNumber(country, examples)?.nationalNumber;
    if (mobile && digits[0] === mobile[0]) return raw;
  }
  for (const length of [2, 3]) {
    if (digits.length >= length && CALLING_CODES.has(digits.slice(0, length) as never)) return `+${digits}`;
  }
  return raw;
}

/** "+201001234567" → "+20 100 123 4567"; anything unparsable is returned as is. */
export function formatPhone(value: string) {
  return parsePhoneNumberFromString(value)?.formatInternational() ?? value;
}

export const flagSrc = (country: string) => `/flags/${country}.svg`;
