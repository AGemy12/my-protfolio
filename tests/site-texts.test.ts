import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import { applyTexts, flattenTexts, legacyTexts } from "@/lib/site-texts";
import { messageArgs, textProblem } from "@/lib/site-texts-check";
import { siteTextsSchema } from "@/lib/schemas";

const builtIn = { en: flattenTexts(en), ar: flattenTexts(ar) };

describe("flattenTexts", () => {
  it("lists site texts by path and leaves the dashboard's own texts out", () => {
    expect(builtIn.en["hero.available"]).toBe(en.hero.available);
    expect(builtIn.en["contact.errors.field.required"]).toBe(en.contact.errors.field.required);
    expect(Object.keys(builtIn.en).some((k) => k.startsWith("admin."))).toBe(false);
  });

  it("every built-in text is a valid message", () => {
    for (const [key, text] of Object.entries({ ...builtIn.en, ...builtIn.ar })) {
      expect(() => messageArgs(text), key).not.toThrow();
    }
  });
});

describe("applyTexts", () => {
  const overrides = {
    "hero.available": { en: "Open to work", ar: "" },
    "contact.errors.field.required": { en: "", ar: "مطلوب" },
    "admin.brand": { en: "Hacked", ar: "Hacked" },
    "hero.nope": { en: "x", ar: "x" },
  };

  it("replaces changed texts in their language only", () => {
    const out = applyTexts(en, overrides, "en");
    expect(out.hero.available).toBe("Open to work");
    expect(out.contact.errors.field.required).toBe(en.contact.errors.field.required);
    expect(applyTexts(ar, overrides, "ar").contact.errors.field.required).toBe("مطلوب");
    expect(applyTexts(ar, overrides, "ar").hero.available).toBe(ar.hero.available);
  });

  it("ignores dashboard texts and keys that don't exist, and never changes the source", () => {
    const out = applyTexts(en, overrides, "en");
    expect(out.admin.brand).toBe(en.admin.brand);
    expect("nope" in out.hero).toBe(false);
    expect(en.hero.available).not.toBe("Open to work");
  });
});

describe("legacyTexts", () => {
  it("maps texts saved under Settings to their message paths", () => {
    expect(legacyTexts({ aboutTitle: { en: "Me", ar: "" }, heroPrimary: { en: "", ar: "" }, junk: 1 })).toEqual({
      "about.title": { en: "Me", ar: "" },
    });
    expect(legacyTexts(undefined)).toEqual({});
  });
});

describe("textProblem", () => {
  it("allows the original placeholders and plain text", () => {
    expect(textProblem("See all {count}", "All {count} projects")).toBeNull();
    expect(textProblem("Projects", "All {count} projects")).toBeNull();
    expect(textProblem("Let's talk", "Have a project? Let's talk")).toBeNull();
  });

  it("rejects unknown placeholders, broken braces and tags", () => {
    expect(textProblem("{total} projects", "All {count} projects")).toMatch(/total/);
    expect(textProblem("All {count projects", "All {count} projects")).not.toBeNull();
    expect(textProblem("<b>Hi</b>", "Hi")).not.toBeNull();
  });
});

describe("siteTextsSchema", () => {
  const schema = siteTextsSchema(builtIn);

  it("keeps changed texts and drops empty ones", () => {
    const parsed = schema.parse({
      "hero.available": { en: " Open to work ", ar: "" },
      "hero.busy": { en: "", ar: "" },
    });
    expect(parsed).toEqual({ "hero.available": { en: "Open to work", ar: "" } });
  });

  it("rejects unknown keys and bad placeholders", () => {
    expect(schema.safeParse({ "admin.brand": { en: "x", ar: "" } }).success).toBe(false);
    expect(schema.safeParse({ "hero.allProjects": { en: "All {total}", ar: "" } }).success).toBe(false);
    expect(schema.safeParse({ "hero.allProjects": { en: "", ar: "كل المشاريع ({count})" } }).success).toBe(true);
  });
});
