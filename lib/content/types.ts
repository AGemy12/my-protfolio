import type { Locale } from "@/i18n/routing";
import type { PaletteId } from "@/data/portfolio";

// Everything the admin dashboard can change. One copy of this object is kept
// in MongoDB; the JSON files in messages/ and data/portfolio.ts are the
// defaults used before the first save or when the database can't be reached.

export type Profile = {
  email: string;
  phone: string;
  whatsapp: string;
  github: string;
  githubUser: string;
  linkedin: string;
  linkedinName: string;
  cv: string;
  photo: string;
};

export type Project = { id: string; image: string; link: string };

export type ProjectText = { title: string; description: string; tags: string[] };

type Pair<K extends string> = { [key in K]: string };

export type Messages = {
  meta: Pair<"title" | "description" | "ogDescription">;
  nav: Pair<
    | "label" | "name" | "work" | "services" | "about" | "experience" | "contact"
    | "cta" | "openMenu" | "closeMenu" | "language" | "toDark" | "toLight" | "palette"
  >;
  palettes: Pair<PaletteId>;
  hero: Pair<
    | "available" | "role" | "location" | "titleStart" | "titleEnd" | "intro"
    | "viewWork" | "downloadCv" | "portraitAlt"
  > & { facts: { value: string; label: string }[] };
  work: Pair<
    "eyebrow" | "title" | "intro" | "github" | "visit" | "privateLabel" | "private" | "privateNote"
  > & { projects: Record<string, ProjectText> };
  services: Pair<"eyebrow" | "title" | "intro"> & {
    items: { title: string; description: string }[];
  };
  about: Pair<"eyebrow" | "title" | "lead" | "body" | "toolkit"> & {
    details: { term: string; value: string }[];
    groups: { name: string; items: string[] }[];
  };
  experience: Pair<"eyebrow" | "title" | "projectsLabel"> & {
    roles: { period: string; title: string; org: string; points: string[]; projects: string }[];
  };
  contact: Pair<"eyebrow" | "title" | "intro" | "email" | "phone" | "copy" | "copied" | "copyLabel"> & {
    form: Pair<
      | "name" | "namePlaceholder" | "email" | "message" | "messagePlaceholder"
      | "send" | "sending" | "invalid" | "success" | "error"
    >;
  };
  footer: Pair<"label" | "rights" | "top">;
};

export type SiteContent = {
  profile: Profile;
  projects: Project[];
  defaultPalette: PaletteId;
  messages: Record<Locale, Messages>;
};
