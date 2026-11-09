// Client-safe description of every editable collection. The dashboard builds
// its list and form screens from this, so adding a field means adding one line here
// (plus the model / zod schema).
import { EXPERIENCE_TYPES, PROJECT_CATEGORIES, SKILL_CATEGORIES, tr, type L } from "./types";

export const RESOURCE_KEYS = ["projects", "experience", "skills", "services"] as const;
export type ResourceKey = (typeof RESOURCE_KEYS)[number];

export type Field =
  | { name: string; type: "text" | "url" | "number"; required?: boolean; half?: boolean }
  | { name: string; type: "slug"; from: string }
  | { name: string; type: "ltext" | "llist"; required?: boolean }
  | { name: string; type: "ltextarea"; rows?: number }
  | { name: string; type: "select"; options: readonly string[]; optionsKey: string; half?: boolean }
  | { name: string; type: "switch" }
  | { name: string; type: "image" }
  | { name: string; type: "images" }
  | { name: string; type: "tags" }
  | { name: string; type: "skillIcon" | "serviceIcon"; half?: boolean };

type Item = Record<string, unknown> & { _id: string };

export type ResourceConfig = {
  key: ResourceKey;
  fields: Field[];
  empty: Record<string, unknown>;
  title: (item: Item, locale: string) => string;
  subtitle: (item: Item, locale: string) => string;
  thumb?: (item: Item) => string;
  icon?: (item: Item) => string;
  featurable?: boolean;
};

const l = (): L => ({ en: "", ar: "" });

export const resources: Record<ResourceKey, ResourceConfig> = {
  projects: {
    key: "projects",
    featurable: true,
    fields: [
      { name: "title", type: "ltext", required: true },
      { name: "slug", type: "slug", from: "title" },
      { name: "summary", type: "ltextarea", rows: 2 },
      { name: "description", type: "ltextarea", rows: 8 },
      { name: "role", type: "ltext" },
      { name: "cover", type: "image" },
      { name: "gallery", type: "images" },
      { name: "tech", type: "tags" },
      { name: "category", type: "select", options: PROJECT_CATEGORIES, optionsKey: "categories", half: true },
      { name: "year", type: "number", half: true },
      { name: "liveUrl", type: "url", half: true },
      { name: "repoUrl", type: "url", half: true },
      { name: "order", type: "number", half: true },
      { name: "featured", type: "switch" },
      { name: "published", type: "switch" },
    ],
    empty: {
      title: l(), slug: "", summary: l(), description: l(), role: l(), cover: "", gallery: [], tech: [],
      category: "platform", year: new Date().getFullYear(), liveUrl: "", repoUrl: "", featured: false,
      published: true, order: 0,
    },
    title: (i, loc) => tr(i.title as L, loc),
    subtitle: (i) => [(i.tech as string[])?.slice(0, 4).join(" · "), i.year].filter(Boolean).join(" — "),
    thumb: (i) => i.cover as string,
  },
  experience: {
    key: "experience",
    fields: [
      { name: "company", type: "text", required: true, half: true },
      { name: "companyUrl", type: "url", half: true },
      { name: "role", type: "ltext", required: true },
      { name: "location", type: "ltext" },
      { name: "type", type: "select", options: EXPERIENCE_TYPES, optionsKey: "experienceTypes", half: true },
      { name: "order", type: "number", half: true },
      { name: "start", type: "text", half: true },
      { name: "end", type: "text", half: true },
      { name: "current", type: "switch" },
      { name: "highlights", type: "llist" },
      { name: "published", type: "switch" },
    ],
    empty: {
      company: "", companyUrl: "", role: l(), location: l(), type: "work", start: "", end: "", current: false,
      highlights: { en: [], ar: [] }, published: true, order: 0,
    },
    title: (i, loc) => `${tr(i.role as L, loc)} — ${i.company}`,
    subtitle: (i) => `${i.start || ""} → ${i.current ? "…" : i.end || ""}`,
  },
  skills: {
    key: "skills",
    fields: [
      { name: "name", type: "text", required: true, half: true },
      { name: "icon", type: "skillIcon", half: true },
      { name: "category", type: "select", options: SKILL_CATEGORIES, optionsKey: "skillCategories", half: true },
      { name: "order", type: "number", half: true },
      { name: "published", type: "switch" },
    ],
    empty: { name: "", icon: "", category: "frontend", published: true, order: 0 },
    title: (i) => i.name as string,
    subtitle: (i) => i.category as string,
    icon: (i) => i.icon as string,
  },
  services: {
    key: "services",
    fields: [
      { name: "title", type: "ltext", required: true },
      { name: "description", type: "ltextarea", rows: 3 },
      { name: "icon", type: "serviceIcon", half: true },
      { name: "order", type: "number", half: true },
      { name: "published", type: "switch" },
    ],
    empty: { title: l(), description: l(), icon: "layers", published: true, order: 0 },
    title: (i, loc) => tr(i.title as L, loc),
    subtitle: (i, loc) => tr(i.description as L, loc).slice(0, 90),
  },
};

export function isResourceKey(value: string): value is ResourceKey {
  return (RESOURCE_KEYS as readonly string[]).includes(value);
}
