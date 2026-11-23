import { describe, expect, it } from "vitest";
import { contactFormSchema, contactSubmitSchema, projectSchema } from "@/lib/schemas";
import { defaultContactForm, newField } from "@/lib/contact-form";

describe("contactSubmitSchema", () => {
  const valid = { channel: "whatsapp", locale: "en", values: { name: "Ali", projectType: ["website"] } };

  it("accepts text and multi-choice values", () => {
    expect(contactSubmitSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a filled honeypot and unknown channels", () => {
    expect(contactSubmitSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false);
    expect(contactSubmitSchema.safeParse({ ...valid, channel: "sms" }).success).toBe(false);
  });
});

describe("contactFormSchema", () => {
  it("accepts the default form", () => {
    expect(contactFormSchema.safeParse(defaultContactForm).success).toBe(true);
  });

  it("rejects duplicate, reserved or malformed variable names", () => {
    const withField = (key: string) => ({
      ...defaultContactForm,
      fields: [...defaultContactForm.fields, { ...newField(key), label: { en: "X", ar: "" } }],
    });
    expect(contactFormSchema.safeParse(withField("email")).success).toBe(false);
    expect(contactFormSchema.safeParse(withField("website")).success).toBe(false);
    expect(contactFormSchema.safeParse(withField("2nd field")).success).toBe(false);
    expect(contactFormSchema.safeParse(withField("company")).success).toBe(true);
  });

  it("needs options for a list and at least one way to send", () => {
    const list = { ...newField("budget", "select"), label: { en: "Budget", ar: "" } };
    expect(contactFormSchema.safeParse({ ...defaultContactForm, fields: [list] }).success).toBe(false);
    const off = { whatsapp: false, gmail: false, email: false, site: false };
    expect(contactFormSchema.safeParse({ ...defaultContactForm, channels: off }).success).toBe(false);
  });
});

describe("projectSchema", () => {
  const empty = { en: "", ar: "" };
  // The dashboard always sends every bilingual field, even when empty.
  const base = { slug: "my-project", title: { en: "My project", ar: "" }, summary: empty, description: empty, role: empty };

  it("fills defaults for a minimal project", () => {
    const project = projectSchema.parse(base);
    expect(project).toMatchObject({ category: "other", featured: false, published: true, order: 0, gallery: [] });
  });

  it("only accepts kebab-case slugs", () => {
    expect(projectSchema.safeParse({ ...base, slug: "My Project" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...base, slug: "-bad-" }).success).toBe(false);
  });

  it("only accepts http(s) or site-relative links", () => {
    expect(projectSchema.safeParse({ ...base, liveUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...base, liveUrl: "https://example.com" }).success).toBe(true);
    expect(projectSchema.safeParse({ ...base, cover: "/images/a.png" }).success).toBe(true);
  });
});
