export const AUTHOR_LINK_KEYS = ["telegram", "linkedin", "github"] as const;
export type AuthorLinkKey = (typeof AUTHOR_LINK_KEYS)[number];

export type AuthorLinksDto = Partial<Record<AuthorLinkKey, string>>;

export function pickAuthorLinks(
  raw: unknown,
  legacyTelegram?: string | null,
): AuthorLinksDto {
  const out: AuthorLinksDto = {};
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    for (const key of AUTHOR_LINK_KEYS) {
      const v = (raw as Record<string, unknown>)[key];
      if (typeof v === "string" && v.trim()) out[key] = v.trim();
    }
  }
  const tg = legacyTelegram?.trim();
  if (tg && !out.telegram) out.telegram = tg;
  return out;
}
