import { getTranslations } from "next-intl/server";
import { adminSettings } from "@/lib/admin-data";
import { TEXT_KEYS, type L, type TextKey } from "@/lib/types";
import { SettingsForm } from "@/components/admin/settings-form";

/** The built-in wording for each editable text, in both languages, shown as placeholders. */
const SOURCE: Record<TextKey, [namespace: string, key: string]> = {
  heroPrimary: ["hero", "startProject"],
  heroSecondary: ["hero", "viewWork"],
  aboutEyebrow: ["about", "eyebrow"],
  aboutTitle: ["about", "title"],
  experienceEyebrow: ["experience", "eyebrow"],
  experienceTitle: ["experience", "title"],
  projectsEyebrow: ["projects", "eyebrow"],
  projectsTitle: ["projects", "title"],
  servicesEyebrow: ["services", "eyebrow"],
  servicesTitle: ["services", "title"],
  contactEyebrow: ["contact", "eyebrow"],
  contactTitle: ["contact", "title"],
  contactLead: ["contact", "lead"],
};

export default async function ProfilePage() {
  const [{ settings }, en, ar] = await Promise.all([
    adminSettings(),
    getTranslations({ locale: "en" }),
    getTranslations({ locale: "ar" }),
  ]);
  const textDefaults = Object.fromEntries(
    TEXT_KEYS.map((k) => {
      const path = SOURCE[k].join(".") as never;
      return [k, { en: en(path), ar: ar(path) } satisfies L];
    }),
  ) as Record<TextKey, L>;
  return <SettingsForm initial={settings} textDefaults={textDefaults} />;
}
