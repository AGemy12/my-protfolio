import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

/** Every leaf key path, e.g. "admin.login.title". */
function keys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.entries(value).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

describe("messages", () => {
  it("English and Arabic have exactly the same keys", () => {
    const enKeys = new Set(keys(en));
    const arKeys = new Set(keys(ar));
    expect([...enKeys].filter((k) => !arKeys.has(k)), "missing in ar.json").toEqual([]);
    expect([...arKeys].filter((k) => !enKeys.has(k)), "missing in en.json").toEqual([]);
  });

  it("has no empty strings", () => {
    const empty = (obj: unknown, lang: string) =>
      keys(obj).filter((k) => k.split(".").reduce<unknown>((o, p) => (o as Record<string, unknown>)[p], obj) === "")
        .map((k) => `${lang}:${k}`);
    expect([...empty(en, "en"), ...empty(ar, "ar")]).toEqual([]);
  });
});
