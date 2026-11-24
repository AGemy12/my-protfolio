// Site wording that can be changed from the dashboard ("Site texts").
//
// The built-in wording lives in messages/*.json. The dashboard stores only the
// texts that were changed, keyed by their message path ("hero.available"), and
// they are laid over the built-in messages when a page renders (i18n/request.ts),
// so every component that calls t() picks them up with no code of its own.
import type { L } from "./types";

/** Message namespaces shown on the public site, in the order the dashboard lists them. */
export const TEXT_NAMESPACES = [
  "nav",
  "hero",
  "about",
  "experience",
  "projects",
  "services",
  "contact",
  "footer",
  "notFound",
  "error",
  "email",
  "loader",
] as const;
export type TextNamespace = (typeof TEXT_NAMESPACES)[number];

/** Changed texts by message path; an empty language keeps the built-in text. */
export type TextOverrides = Record<string, L>;

/** The built-in editable texts, flattened per language. */
export type BuiltInTexts = { en: Record<string, string>; ar: Record<string, string> };

type Messages = { [key: string]: string | Messages };

/** Every editable message as "namespace.key.sub" → text. */
export function flattenTexts(messages: Messages): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (node: string | Messages, path: string) => {
    if (typeof node === "string") out[path] = node;
    else for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
  };
  for (const ns of TEXT_NAMESPACES) if (messages[ns]) walk(messages[ns], ns);
  return out;
}

/** The built-in messages with the changed texts for `locale` laid over them. */
export function applyTexts<T extends Messages>(messages: T, overrides: TextOverrides, locale: string): T {
  const out = structuredClone(messages) as Messages;
  for (const [path, value] of Object.entries(overrides)) {
    const text = (locale === "ar" ? value.ar : value.en)?.trim();
    const [ns] = path.split(".");
    if (!text || !(TEXT_NAMESPACES as readonly string[]).includes(ns)) continue;
    const keys = path.split(".");
    const last = keys.pop()!;
    let node: Messages | undefined = out;
    for (const k of keys) node = typeof node?.[k] === "object" ? (node[k] as Messages) : undefined;
    // only replaces texts that exist, so a stale key can't add or break anything
    if (node && typeof node[last] === "string") node[last] = text;
  }
  return out as T;
}

/**
 * Texts changed before "Site texts" existed were saved in Settings under these
 * names. They are still read (below any newer change) until the next save there.
 */
export const LEGACY_TEXT_PATHS: Record<string, string> = {
  heroPrimary: "hero.startProject",
  heroSecondary: "hero.viewWork",
  aboutEyebrow: "about.eyebrow",
  aboutTitle: "about.title",
  experienceEyebrow: "experience.eyebrow",
  experienceTitle: "experience.title",
  projectsEyebrow: "projects.eyebrow",
  projectsTitle: "projects.title",
  servicesEyebrow: "services.eyebrow",
  servicesTitle: "services.title",
  contactEyebrow: "contact.eyebrow",
  contactTitle: "contact.title",
  contactLead: "contact.lead",
};

export function legacyTexts(texts: unknown): TextOverrides {
  const out: TextOverrides = {};
  if (!texts || typeof texts !== "object") return out;
  for (const [key, value] of Object.entries(texts as Record<string, Partial<L> | undefined>)) {
    const path = LEGACY_TEXT_PATHS[key];
    if (path && value && (value.en?.trim() || value.ar?.trim())) out[path] = { en: value.en ?? "", ar: value.ar ?? "" };
  }
  return out;
}
