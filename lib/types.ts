// Shared, client-safe content types.

export type L = { en: string; ar: string };
export type LList = { en: string[]; ar: string[] };

export const SECTION_KEYS = ["about", "skills", "experience", "projects", "services", "contact"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

/**
 * Site wording that can be overridden from the dashboard. Empty means "use the
 * built-in text" (messages/*.json), so nothing has to be filled in.
 */
export const TEXT_GROUPS = {
  hero: ["heroPrimary", "heroSecondary"],
  about: ["aboutEyebrow", "aboutTitle"],
  experience: ["experienceEyebrow", "experienceTitle"],
  projects: ["projectsEyebrow", "projectsTitle"],
  services: ["servicesEyebrow", "servicesTitle"],
  contact: ["contactEyebrow", "contactTitle", "contactLead"],
} as const;
export type TextKey = (typeof TEXT_GROUPS)[keyof typeof TEXT_GROUPS][number];
export const TEXT_KEYS = Object.values(TEXT_GROUPS).flat() as TextKey[];
export type SiteTexts = Partial<Record<TextKey, L>>;

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
  texts: SiteTexts;
};

export const PROJECT_CATEGORIES = [
  "platform",
  "dashboard",
  "education",
  "ecommerce",
  "corporate",
  "landing",
  "portfolio",
  "mobile",
  "other",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

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
  category: ProjectCategory;
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

/** A dashboard override for site wording, or `fallback` when it is empty in this language. */
export function siteText(texts: SiteTexts | undefined, key: TextKey, locale: string, fallback: string) {
  const value = texts?.[key];
  const own = (locale === "ar" ? value?.ar : value?.en)?.trim();
  return own || fallback;
}

export function trList(value: LList | undefined, locale: string) {
  if (!value) return [];
  const primary = locale === "ar" ? value.ar : value.en;
  return primary?.length ? primary : (locale === "ar" ? value.en : value.ar) || [];
}
