import { describe, expect, it } from "vitest";
import { tr, trList } from "@/lib/types";
import { slugify } from "@/lib/utils";

describe("tr / trList", () => {
  it("uses the requested language and falls back to the other", () => {
    expect(tr({ en: "Hello", ar: "مرحبا" }, "ar")).toBe("مرحبا");
    expect(tr({ en: "Hello", ar: "  " }, "ar")).toBe("Hello");
    expect(tr(undefined, "en")).toBe("");
    expect(trList({ en: ["a"], ar: [] }, "ar")).toEqual(["a"]);
  });
});

describe("slugify", () => {
  it("makes kebab-case slugs without accents", () => {
    expect(slugify("Café  Menu — 2024!")).toBe("cafe-menu-2024");
    expect(slugify("--Hello--")).toBe("hello");
  });
});
