"use client";

import { useTranslations } from "next-intl";
import { useAppearance } from "@/contexts/ThemeContext";
import { MoonIcon, SunIcon } from "@/components/ui/Icons";

export const iconButton =
  "grid h-9 w-9 flex-none place-items-center rounded-full border border-line bg-surface text-fg transition-colors duration-300 hover:border-fg";

export default function ThemeToggle() {
  const t = useTranslations("nav");
  const { isDark, setTheme } = useAppearance();

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("toLight") : t("toDark")}
      title={isDark ? t("toLight") : t("toDark")}
      className={iconButton}
    >
      {isDark ? <SunIcon className="h-[17px] w-[17px]" /> : <MoonIcon className="h-[17px] w-[17px]" />}
    </button>
  );
}
