export type Author = {
  id?: string;
  name: string;
  role: string;
  telegram: string;
  /** Absolute URL or site-relative path (e.g. /avatars/me.png in public/) */
  avatarUrl?: string | null;
};

/** Used when API is unavailable or returns no rows */
export const FALLBACK_AUTHORS: Author[] = [
  {
    name: "Denis",
    role: "Frontend Developer",
    telegram: "https://t.me/#",
  },
  {
    name: "Dmitriy",
    role: "UX/UI Designer",
    telegram: "https://t.me/#",
  },
];
