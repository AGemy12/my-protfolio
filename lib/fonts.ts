import { IBM_Plex_Sans_Arabic, Newsreader, Noto_Naskh_Arabic, Onest } from "next/font/google";

// Shared by the site and the admin dashboard. The variables go on <html>
// because the typography tokens in globals.css are defined on :root.

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
});

// Arabic faces cover Arabic letters only; Latin words inside Arabic text
// (Next.js, NestJS…) keep using Onest and Newsreader.
const naskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

export const fontVariables = `${newsreader.variable} ${onest.variable} ${naskh.variable} ${plexArabic.variable}`;
