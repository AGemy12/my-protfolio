import { describe, expect, it } from "vitest";
import { legacySocials, socialName, SOCIAL_KEYS } from "@/lib/socials";
import { settingsSchema } from "@/lib/schemas";
import { defaultSettings } from "@/lib/defaults";
import { socialIcons } from "@/components/icons";

describe("legacySocials", () => {
  it("turns the old fixed fields into a list, skipping empty ones", () => {
    expect(legacySocials({ github: "https://github.com/a", linkedin: " ", x: "https://x.com/a" })).toEqual([
      { platform: "github", url: "https://github.com/a", label: "" },
      { platform: "x", url: "https://x.com/a", label: "" },
    ]);
    expect(legacySocials({})).toEqual([]);
  });
});

describe("socialName", () => {
  it("prefers the link's own name over the platform's", () => {
    expect(socialName({ platform: "website", url: "https://a.com", label: "My blog" })).toBe("My blog");
    expect(socialName({ platform: "devto", url: "https://dev.to/a", label: " " })).toBe("DEV");
  });
});

describe("settingsSchema socials", () => {
  const base = settingsSchema.parse(defaultSettings);

  it("accepts the starter links and keeps their order", () => {
    expect(base.socials.map((l) => l.platform)).toEqual(["github", "linkedin"]);
  });

  it("rejects unknown platforms, empty or unsafe links", () => {
    const withLink = (link: object) => settingsSchema.safeParse({ ...defaultSettings, socials: [link] }).success;
    expect(withLink({ platform: "myspace", url: "https://a.com", label: "" })).toBe(false);
    expect(withLink({ platform: "github", url: "", label: "" })).toBe(false);
    expect(withLink({ platform: "github", url: "javascript:alert(1)", label: "" })).toBe(false);
    expect(withLink({ platform: "telegram", url: "https://t.me/a" })).toBe(true);
  });
});

describe("socialIcons", () => {
  it("has an icon for every platform", () => {
    expect(SOCIAL_KEYS.filter((p) => !socialIcons[p])).toEqual([]);
  });
});
