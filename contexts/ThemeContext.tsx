"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { defaultPalette, palettes, type PaletteId } from "@/data/portfolio";

type Theme = "light" | "dark" | "system";

type AppearanceContextType = {
  theme: Theme;
  isDark: boolean;
  palette: PaletteId;
  setTheme: (theme: Theme) => void;
  setPalette: (palette: PaletteId) => void;
};

const AppearanceContext = createContext<AppearanceContextType>({
  theme: "system",
  isDark: false,
  palette: defaultPalette,
  setTheme: () => {},
  setPalette: () => {},
});

const isPalette = (value: string | null): value is PaletteId =>
  palettes.some((p) => p.id === value);

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }
};

// The saved theme and palette are applied before the first paint by
// appearanceScript (contexts/appearanceScript.ts).

export function AppearanceProvider({
  children,
  fallbackPalette = defaultPalette,
}: {
  children: React.ReactNode;
  fallbackPalette?: PaletteId;
}) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [isDark, setIsDark] = useState(false);
  const [palette, setPaletteState] = useState<PaletteId>(fallbackPalette);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = read("theme");
    const storedPalette = read("palette");
    if (stored === "light" || stored === "dark" || stored === "system") setThemeState(stored);
    if (isPalette(storedPalette)) setPaletteState(storedPalette);
    setIsDark(document.documentElement.classList.contains("dark"));
    setLoaded(true);
  }, []);

  // Follow the operating system while the choice is "system".
  useEffect(() => {
    if (!loaded) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", dark);
      setIsDark(dark);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme, loaded]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    write("theme", next);
  }, []);

  const setPalette = useCallback((next: PaletteId) => {
    setPaletteState(next);
    write("palette", next);
    document.documentElement.setAttribute("data-palette", next);
  }, []);

  return (
    <AppearanceContext.Provider value={{ theme, isDark, palette, setTheme, setPalette }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export const useAppearance = () => useContext(AppearanceContext);
