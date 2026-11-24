// Shared, client-safe content types.

export type L = { en: string; ar: string };
export type LList = { en: string[]; ar: string[] };

export const SECTION_KEYS = ["about", "skills", "experience", "projects", "services", "contact"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export type Settings = {
  name: L;
  role: L;
  headline: L;
  bio: L;
  about: L;
  location: L;
  heroRoles: LList;
  email: string;
  phone: string;
  whatsapp: string;
  avatar: string;
  cvEn: string;
  cvAr: string;
  github: string;
  linkedin: string;
  x: string;
  available: boolean;
  yearsExperience: number;
  projectsDone: number;
  seoTitle: L;
  seoDescription: L;
  ogImage: string;
  sections: Record<SectionKey, boolean>;
};

/** A project category, managed from the dashboard. Projects point to it by `slug`. */
export type Category = {
  _id: string;
  slug: string;
  name: L;
  /** Hidden categories still label their projects but get no filter on /projects. */
  published: boolean;
  order: number;
};

export type Project = {
  _id: string;
  slug: string;
  title: L;
  summary: L;
  description: L;
  role: L;
  cover: string;
  gallery: string[];
  tech: string[];
  /** Slug of a Category. */
  category: string;
  /** The category's name, filled in when projects are read for the site (not stored). */
  categoryName?: L;
  year: number;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
  /** Set by Mongo timestamps; missing for the built-in starter content. */
  updatedAt?: string;
};

export const EXPERIENCE_TYPES = ["work", "freelance", "education"] as const;

export type Experience = {
  _id: string;
  company: string;
  companyUrl: string;
  role: L;
  location: L;
  type: (typeof EXPERIENCE_TYPES)[number];
  start: string;
  end: string;
  current: boolean;
  highlights: LList;
  published: boolean;
  order: number;
};

export const SKILL_CATEGORIES = ["frontend", "backend", "database", "devops", "tools", "ai"] as const;

export type Skill = {
  _id: string;
  name: string;
  icon: string;
  category: (typeof SKILL_CATEGORIES)[number];
  published: boolean;
  order: number;
};

export type Service = {
  _id: string;
  title: L;
  description: L;
  icon: string;
  published: boolean;
  order: number;
};

export type Message = {
  _id: string;
  name: string;
  email: string;
  whatsapp?: string;
  subject: string;
  message: string;
  /** Every filled field, in form order (messages from before the form builder have none). */
  fields?: { key: string; label: L; value: string }[];
  channel?: "whatsapp" | "gmail" | "email" | "site";
  read: boolean;
  createdAt: string;
};

/** Picks the requested language, falling back to the other one when empty. */
export function tr(value: L | undefined, locale: string) {
  if (!value) return "";
  const primary = locale === "ar" ? value.ar : value.en;
  return primary?.trim() ? primary : (locale === "ar" ? value.en : value.ar) || "";
}

export function trList(value: LList | undefined, locale: string) {
  if (!value) return [];
  const primary = locale === "ar" ? value.ar : value.en;
  return primary?.length ? primary : (locale === "ar" ? value.en : value.ar) || [];
}
