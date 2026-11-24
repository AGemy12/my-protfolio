// Social links shown in the contact section and the footer, managed from the
// dashboard as an ordered list. Icons live in components/icons.tsx (socialIcons).

/** Every platform a link can be, with its display name and an example URL. */
export const SOCIAL_PLATFORMS = {
  github: { name: "GitHub", example: "https://github.com/username" },
  gitlab: { name: "GitLab", example: "https://gitlab.com/username" },
  linkedin: { name: "LinkedIn", example: "https://www.linkedin.com/in/username" },
  x: { name: "X", example: "https://x.com/username" },
  facebook: { name: "Facebook", example: "https://www.facebook.com/username" },
  instagram: { name: "Instagram", example: "https://www.instagram.com/username" },
  threads: { name: "Threads", example: "https://www.threads.net/@username" },
  tiktok: { name: "TikTok", example: "https://www.tiktok.com/@username" },
  youtube: { name: "YouTube", example: "https://www.youtube.com/@channel" },
  snapchat: { name: "Snapchat", example: "https://www.snapchat.com/add/username" },
  pinterest: { name: "Pinterest", example: "https://www.pinterest.com/username" },
  reddit: { name: "Reddit", example: "https://www.reddit.com/user/username" },
  telegram: { name: "Telegram", example: "https://t.me/username" },
  discord: { name: "Discord", example: "https://discord.gg/invite" },
  behance: { name: "Behance", example: "https://www.behance.net/username" },
  dribbble: { name: "Dribbble", example: "https://dribbble.com/username" },
  figma: { name: "Figma", example: "https://www.figma.com/@username" },
  medium: { name: "Medium", example: "https://medium.com/@username" },
  devto: { name: "DEV", example: "https://dev.to/username" },
  hashnode: { name: "Hashnode", example: "https://hashnode.com/@username" },
  stackoverflow: { name: "Stack Overflow", example: "https://stackoverflow.com/users/1/username" },
  leetcode: { name: "LeetCode", example: "https://leetcode.com/u/username" },
  kaggle: { name: "Kaggle", example: "https://www.kaggle.com/username" },
  upwork: { name: "Upwork", example: "https://www.upwork.com/freelancers/~id" },
  fiverr: { name: "Fiverr", example: "https://www.fiverr.com/username" },
  mostaql: { name: "Mostaql", example: "https://mostaql.com/u/username" },
  khamsat: { name: "Khamsat", example: "https://khamsat.com/user/username" },
  calendly: { name: "Calendly", example: "https://calendly.com/username" },
  website: { name: "Website", example: "https://example.com" },
  other: { name: "Link", example: "https://" },
} as const;

export type SocialPlatform = keyof typeof SOCIAL_PLATFORMS;
export const SOCIAL_KEYS = Object.keys(SOCIAL_PLATFORMS) as SocialPlatform[];

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
  /** Optional name shown on hover instead of the platform's (e.g. "My blog"). */
  label: string;
};

/** The name a link is announced and shown with. */
export const socialName = (link: SocialLink) => link.label.trim() || SOCIAL_PLATFORMS[link.platform].name;

/**
 * Before links became a list they were three fixed fields; a profile saved back
 * then still has them, so they are turned into the list until it is saved again.
 */
export function legacySocials(doc: { github?: unknown; linkedin?: unknown; x?: unknown }): SocialLink[] {
  return (["github", "linkedin", "x"] as const)
    .filter((p) => typeof doc[p] === "string" && (doc[p] as string).trim())
    .map((platform) => ({ platform, url: (doc[platform] as string).trim(), label: "" }));
}
