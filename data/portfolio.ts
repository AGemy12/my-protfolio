// Language-independent data. All visible text lives in messages/en.json and
// messages/ar.json; entries here are matched to it by `id`.
//
// profile, projects and defaultPalette are only the starting values: once the
// admin dashboard (/admin) saves, the live values come from MongoDB.

export const profile = {
  email: "aggamal98@gmail.com",
  phone: "+20 114 956 0988",
  whatsapp: "https://wa.me/201149560988",
  github: "https://github.com/AGemy12",
  githubUser: "AGemy12",
  linkedin: "https://www.linkedin.com/in/ahmad-marzouk-9430b1233/",
  linkedinName: "Ahmad Marzouk",
  cv: "/assets/media/cv/cv.pdf",
  photo: "/assets/media/my-photo.png",
};

export const sectionIds = [
  "work",
  "services",
  "about",
  "experience",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

export const projects = [
  { id: "alarabify", image: "/assets/media/projects/arabify.png", link: "https://www.alarabify.com" },
  { id: "bestClean", image: "/assets/media/projects/best-clean.png", link: "https://www.best-cleanteam.com/" },
  { id: "itqan", image: "/assets/media/projects/itqan.png", link: "https://www.itqanforquran.com/ar" },
  { id: "rowad", image: "/assets/media/projects/rowad.png", link: "https://www.rowad4u.com/" },
  { id: "cmt", image: "/assets/media/projects/cmt.png", link: "https://cmt-azure.vercel.app/" },
  { id: "stars", image: "/assets/media/projects/stars.png", link: "https://2-stars-seven.vercel.app/" },
] as const;

export type ProjectId = (typeof projects)[number]["id"];

// Swatch colors for the palette picker. The full token sets live in
// app/globals.css under [data-palette="..."].
export const palettes = [
  { id: "ink", bg: "#f7f7f5", accent: "#2b3f63" },
  { id: "sage", bg: "#f5f6f2", accent: "#4a6a55" },
  { id: "harbor", bg: "#f5f7f7", accent: "#1f5663" },
  { id: "mulberry", bg: "#f8f6f5", accent: "#6b3b4e" },
] as const;

export type PaletteId = (typeof palettes)[number]["id"];

export const defaultPalette: PaletteId = "ink";
