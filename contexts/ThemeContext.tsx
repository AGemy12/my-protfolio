"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (t: Theme) => {
      document.documentElement.classList.remove("dark");
      if (t === "dark") document.documentElement.classList.add("dark");
    };

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme") === "system") {
        const newSystemTheme = e.matches ? "dark" : "light";
        applyTheme(newSystemTheme);
        setTheme("system");
      }
    };

    const initialTheme: Theme =
      storedTheme ?? (prefersDark.matches ? "dark" : "light");

    setTheme(initialTheme);
    applyTheme(
      initialTheme === "system"
        ? prefersDark.matches
          ? "dark"
          : "light"
        : initialTheme
    );

    prefersDark.addEventListener("change", handleSystemChange);
    return () => prefersDark.removeEventListener("change", handleSystemChange);
  }, []);

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    const targetTheme =
      newTheme === "system"
        ? prefersDark.matches
          ? "dark"
          : "light"
        : newTheme;

    document.documentElement.classList.remove("dark");
    if (targetTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
