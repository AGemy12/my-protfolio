import "server-only";
import mongoose, { Schema, type Model } from "mongoose";
import { EXPERIENCE_TYPES, PROJECT_CATEGORIES, SKILL_CATEGORIES } from "./types";

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
    category: { type: String, enum: PROJECT_CATEGORIES, default: "other" },
    year: Number,
    liveUrl: String,
    repoUrl: String,
    featured: { type: Boolean, default: false },
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
    read: { type: Boolean, default: false },
  },
  opts,
);

const AdminSchema = define(  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  opts,
);

export const SettingsModel = model("Settings", SettingsSchema);
export const ProjectModel = model("Project", ProjectSchema);
export const ExperienceModel = model("Experience", ExperienceSchema);
export const SkillModel = model("Skill", SkillSchema);
export const ServiceModel = model("Service", ServiceSchema);
export const MessageModel = model("Message", MessageSchema);
export const AdminModel = model("Admin", AdminSchema);
