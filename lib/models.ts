import "server-only";
import mongoose, { Schema, type Model } from "mongoose";
import { EXPERIENCE_TYPES, SKILL_CATEGORIES } from "./types";

const L = { en: { type: String, default: "" }, ar: { type: String, default: "" } };
const LList = { en: { type: [String], default: [] }, ar: { type: [String], default: [] } };
const opts = { timestamps: true, versionKey: false } as const;

// Schema definitions are passed untyped on purpose: Mongoose's automatic type
// inference on these nested definitions makes `tsc` run out of memory. Inputs are
// validated with zod (lib/schemas.ts) and outputs are typed in lib/types.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const define = (definition: Record<string, unknown>, options: object): Schema => new Schema(definition as any, options);

// Same reason as above: `mongoose.model<T>()` with a generic exhausts the type checker.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function model(name: string, schema: Schema): Model<any> {
  return mongoose.models[name] ?? mongoose.model(name, schema);
}

const SettingsSchema = define(  {
    key: { type: String, default: "main", unique: true },
    name: L,
    role: L,
    headline: L,
    bio: L,
    about: L,
    location: L,
    heroRoles: LList,
    email: String,
    phone: String,
    whatsapp: String,
    avatar: String,
    cvEn: String,
    cvAr: String,
    github: String,
    linkedin: String,
    x: String,
    available: { type: Boolean, default: true },
    yearsExperience: { type: Number, default: 0 },
    projectsDone: { type: Number, default: 0 },
    seoTitle: L,
    seoDescription: L,
    ogImage: String,
    sections: { type: Schema.Types.Mixed, default: {} },
    // Legacy: texts changed before "Site texts" existed (see lib/site-texts.ts).
    // Read until the next save of Site texts, which removes it.
    texts: Schema.Types.Mixed,
  },
  opts,
);

const ProjectSchema = define(  {
    slug: { type: String, required: true, unique: true, index: true },
    title: L,
    summary: L,
    description: L,
    role: L,
    cover: String,
    gallery: { type: [String], default: [] },
    tech: { type: [String], default: [] },
    // Slug of a Category document (not an enum: categories are managed in the dashboard).
    category: { type: String, default: "other", index: true },
    year: Number,
    liveUrl: String,
    repoUrl: String,
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  opts,
);

const CategorySchema = define(  {
    slug: { type: String, required: true, unique: true, index: true },
    name: L,
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  opts,
);

const ExperienceSchema = define(  {
    company: String,
    companyUrl: String,
    role: L,
    location: L,
    type: { type: String, enum: EXPERIENCE_TYPES, default: "work" },
    start: String,
    end: String,
    current: { type: Boolean, default: false },
    highlights: LList,
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  opts,
);

const SkillSchema = define(  {
    name: { type: String, required: true },
    icon: String,
    category: { type: String, enum: SKILL_CATEGORIES, default: "frontend" },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  opts,
);

const ServiceSchema = define(  {
    title: L,
    description: L,
    icon: String,
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  opts,
);

const MessageSchema = define(  {
    name: String,
    email: String,
    whatsapp: String,
    subject: String,
    message: String,
    // Everything the visitor filled in, as [{ key, label: {en, ar}, value }], in form order.
    fields: { type: Schema.Types.Mixed, default: [] },
    // How the visitor sent it: whatsapp | gmail | email | site.
    channel: String,
    locale: String,
    read: { type: Boolean, default: false },
  },
  opts,
);

// The contact form built in the dashboard (one document). Validated with
// contactFormSchema on the way in and on the way out.
const ContactFormSchema = define(  {
    key: { type: String, default: "main", unique: true },
    fields: { type: Schema.Types.Mixed, default: [] },
    channels: { type: Schema.Types.Mixed, default: {} },
    template: L,
    emailSubject: L,
  },
  opts,
);

// Site texts changed in the dashboard (one document): [{ key: "hero.available", en, ar }].
// An array rather than an object because the keys contain dots.
const SiteTextSchema = define(  {
    key: { type: String, default: "main", unique: true },
    items: { type: Schema.Types.Mixed, default: [] },
  },
  opts,
);

const AdminSchema = define(  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    // Stored in every session token; bumping it signs out all existing sessions.
    sessionVersion: { type: Number, default: 0 },
  },
  opts,
);

// Fixed-window counters for login attempts and contact messages. Kept in the DB
// (not in memory) so the limit holds across serverless instances; the TTL index
// removes each window once it ends.
const RateLimitSchema = define(  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { versionKey: false },
);

export const SettingsModel = model("Settings", SettingsSchema);
export const ProjectModel = model("Project", ProjectSchema);
export const CategoryModel = model("Category", CategorySchema);
export const ExperienceModel = model("Experience", ExperienceSchema);
export const SkillModel = model("Skill", SkillSchema);
export const ServiceModel = model("Service", ServiceSchema);
export const MessageModel = model("Message", MessageSchema);
export const ContactFormModel = model("ContactForm", ContactFormSchema);
export const SiteTextModel = model("SiteText", SiteTextSchema);
export const AdminModel = model("Admin", AdminSchema);
export const RateLimitModel = model("RateLimit", RateLimitSchema);
