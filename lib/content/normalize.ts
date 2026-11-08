import { createTranslator } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import {
  defaultPalette as fallbackPalette,
  palettes,
  profile as fallbackProfile,
  projects as fallbackProjects,
} from "@/data/portfolio";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import type { Messages, Profile, Project, ProjectText, SiteContent } from "./types";

const MAX_STRING = 5000;
const MAX_ITEMS = 60;

type Obj = Record<string, unknown>;
const isObj = (value: unknown): value is Obj =>
  !!value && typeof value === "object" && !Array.isArray(value);

/** Same shape as `template`, with every string emptied and every list cleared. */
function blank(template: unknown): unknown {
  if (typeof template === "string") return "";
  if (Array.isArray(template)) return [];
  if (isObj(template)) {
    return Object.fromEntries(Object.entries(template).map(([k, v]) => [k, blank(v)]));
  }
  return template;
}

/**
 * Template for new list items. Keys from every default item are merged, so an
 * item that only some entries use (an experience role's "points") is kept.
 */
function itemTemplate(items: unknown[]): unknown {
  if (!items.length || typeof items[0] === "string") return "";
  return Object.assign({}, ...items.map(blank));
}

/**
 * Returns `value` reshaped to match `fallback`: unknown keys are dropped,
 * missing or mistyped values take the fallback, and strings are trimmed to a
 * safe length. This is what lets the site trust whatever is in the database.
 */
function conform(fallback: unknown, value: unknown): unknown {
  if (typeof fallback === "string") {
    return typeof value === "string" ? value.slice(0, MAX_STRING) : fallback;
  }
  if (Array.isArray(fallback)) {
    if (!Array.isArray(value)) return fallback;
    const template = itemTemplate(fallback);
    const items = value.slice(0, MAX_ITEMS).map((item) => conform(template, item));
    return typeof template === "string"
      ? (items as string[]).map((s) => s.trim()).filter(Boolean)
      : items;
  }
  if (isObj(fallback)) {
    const source = isObj(value) ? value : {};
    return Object.fromEntries(
      Object.keys(fallback).map((key) => [key, conform(fallback[key], source[key])]),
    );
  }
  return fallback;
}

const blankProjectText: ProjectText = { title: "", description: "", tags: [] };

function normalizeMessages(fallback: Messages, value: unknown, projectIds: string[]): Messages {
  const { projects: fallbackTexts, ...fallbackWork } = fallback.work;
  const messages = conform({ ...fallback, work: fallbackWork }, value) as Messages;
  const source = isObj(value) && isObj(value.work) && isObj(value.work.projects)
    ? value.work.projects
    : {};

  messages.work.projects = Object.fromEntries(
    projectIds.map((id) => [
      id,
      conform(fallbackTexts[id] ?? blankProjectText, source[id]) as ProjectText,
    ]),
  );
  return messages;
}

const PROJECT_ID = /^[A-Za-z0-9_-]{1,40}$/;

function normalizeProjects(value: unknown, fallback: Project[]): Project[] {
  if (!Array.isArray(value)) return fallback;
  const seen = new Set<string>();
  const projects: Project[] = [];
  for (const item of value.slice(0, MAX_ITEMS)) {
    if (!isObj(item) || typeof item.id !== "string" || !PROJECT_ID.test(item.id)) continue;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    projects.push({
      id: item.id,
      image: typeof item.image === "string" ? item.image.trim() : "",
      link: typeof item.link === "string" ? item.link.trim() : "",
    });
  }
  return projects;
}

const rawDefaults = {
  profile: fallbackProfile as Profile,
  projects: fallbackProjects.map((p) => ({ ...p })) as Project[],
  defaultPalette: fallbackPalette,
  messages: { en, ar } as unknown as Record<Locale, Messages>,
};

/** Coerces any value (a database document, a dashboard request) into valid content. */
export function normalizeContent(value: unknown, fallback: SiteContent = defaultContent): SiteContent {
  const source = isObj(value) ? value : {};
  const projects = normalizeProjects(source.projects, fallback.projects);
  const ids = projects.map((p) => p.id);
  const messagesSource = isObj(source.messages) ? source.messages : {};
  const palette = palettes.find((p) => p.id === source.defaultPalette)?.id ?? fallback.defaultPalette;

  return {
    profile: conform(fallback.profile, source.profile) as Profile,
    projects,
    defaultPalette: palette,
    messages: Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        normalizeMessages(fallback.messages[locale], messagesSource[locale], ids),
      ]),
    ) as Record<Locale, Messages>,
  };
}

/** The content shipped with the code (messages/*.json and data/portfolio.ts). */
export const defaultContent: SiteContent = normalizeContent(rawDefaults, rawDefaults);

// ---------------------------------------------------------------------------
// Validation: problems the dashboard reports instead of saving.

export type ContentIssue = { path: string; message: string };

const BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;
const isLocalPath = (url: string) => url.startsWith("/") && !url.startsWith("//");
const isWebLink = (url: string) => /^https?:\/\/[^\s/]+\.[^\s]+$/i.test(url);
// next/image only loads files from this site or from the configured Blob store.
const isImageSource = (url: string) => isLocalPath(url) || BLOB_HOST.test(url);

/** Every string the site formats with t() (lists are read raw and skipped). */
function formattedStrings(messages: Messages): { key: string; text: string }[] {
  const out: { key: string; text: string }[] = [];
  const walk = (node: unknown, path: string) => {
    if (typeof node === "string") out.push({ key: path, text: node });
    else if (isObj(node)) {
      for (const [key, child] of Object.entries(node)) {
        const next = path ? `${path}.${key}` : key;
        if (next !== "work.projects") walk(child, next);
      }
    }
  };
  walk(messages, "");
  return out;
}

type Translate = (key: string, values?: Record<string, unknown>) => string;
const makeTranslator = createTranslator as unknown as (options: {
  locale: string;
  messages: unknown;
  onError: (error: Error) => void;
}) => Translate;

export function validateContent(content: SiteContent): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const add = (path: string, message: string) => issues.push({ path, message });
  const { profile } = content;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) add("profile.email", "البريد الإلكتروني غير صحيح.");
  for (const key of ["whatsapp", "github", "linkedin"] as const) {
    if (!isWebLink(profile[key])) add(`profile.${key}`, "الرابط يجب أن يبدأ بـ https://");
  }
  if (!isImageSource(profile.photo)) add("profile.photo", "ارفع الصورة من اللوحة أو استخدم مساراً يبدأ بـ /");
  if (!isLocalPath(profile.cv) && !BLOB_HOST.test(profile.cv)) {
    add("profile.cv", "ارفع ملف السيرة الذاتية من اللوحة أو استخدم مساراً يبدأ بـ /");
  }

  content.projects.forEach((project, index) => {
    const name = content.messages.ar.work.projects[project.id]?.title || `#${index + 1}`;
    if (!isImageSource(project.image)) add(`projects.${index}.image`, `مشروع «${name}»: ارفع صورة للمشروع.`);
    if (!isWebLink(project.link)) add(`projects.${index}.link`, `مشروع «${name}»: الرابط يجب أن يبدأ بـ https://`);
  });

  // A stray "{" or a misspelled placeholder would break the text on the site.
  const sample = { name: "Ahmad", year: 2026, value: "x" };
  for (const locale of routing.locales) {
    const messages = content.messages[locale];
    let failed = false;
    const t = makeTranslator({ locale, messages, onError: () => (failed = true) });
    for (const { key, text } of formattedStrings(messages)) {
      failed = false;
      t(key, sample);
      if (failed) {
        add(
          `messages.${locale}.${key}`,
          `${locale === "ar" ? "النص العربي" : "النص الإنجليزي"} «${text.slice(0, 40)}»: ` +
            "الأقواس { } مخصصة للمتغيرات مثل {name} و {year}. احذفها أو صحّح اسم المتغير.",
        );
      }
    }
  }

  return issues;
}
