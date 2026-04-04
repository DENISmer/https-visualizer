import {
  type AuthorLinks,
  pickAuthorLinks,
} from "@/shared/constants/author-links";

export type Author = {
  id?: string;
  name: string;
  role: string;
  links: AuthorLinks;
  /** Absolute URL or site-relative path (e.g. /avatars/me.png in public/) */
  avatarUrl?: string | null;
};

export function parseAuthorFromApi(
  row: Record<string, unknown>,
): Author | null {
  if (typeof row.name !== "string" || typeof row.role !== "string") return null;
  const links = pickAuthorLinks(
    row.links,
    typeof row.telegram === "string" ? row.telegram : null,
  );
  const id = row.id;
  const avatarRaw = row.avatar_url ?? row.avatarUrl;
  return {
    ...(typeof id === "string" ? { id } : {}),
    name: row.name,
    role: row.role,
    links,
    avatarUrl: typeof avatarRaw === "string" ? avatarRaw : null,
  };
}

export function parseAuthorsFromApiPayload(data: unknown): Author[] {
  if (!Array.isArray(data)) return [];
  const out: Author[] = [];
  for (const row of data) {
    if (row && typeof row === "object") {
      const a = parseAuthorFromApi(row as Record<string, unknown>);
      if (a) out.push(a);
    }
  }
  return out;
}

/** Used when API is unavailable or returns no rows */
export const FALLBACK_AUTHORS: Author[] = [
  {
    name: "Denis",
    role: "Frontend Developer",
    links: {
      telegram: "https://t.me/#",
      github: "https://github.com/",
    },
  },
  {
    name: "Dmitriy",
    role: "UX/UI Designer",
    links: { linkedin: "https://www.linkedin.com/" },
  },
] satisfies Author[];
