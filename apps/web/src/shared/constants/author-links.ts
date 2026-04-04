import telegramSrc from "@/shared/ui/icons/telegram_icon.svg";
import githubSrc from "@/shared/ui/icons/github_icon.svg";
import linkedinSrc from "@/shared/ui/icons/linkedin_icon.svg";

/** Supported social keys — order is render order */
export const AUTHOR_LINK_KEYS = ["telegram", "linkedin", "github"] as const;
export type AuthorLinkKey = (typeof AUTHOR_LINK_KEYS)[number];

export type AuthorLinks = Partial<Record<AuthorLinkKey, string>>;

export const AUTHOR_LINK_LABEL: Record<AuthorLinkKey, string> = {
  telegram: "Telegram",
  linkedin: "LinkedIn",
  github: "GitHub",
};

export const AUTHOR_LINK_ICON_SRC: Record<AuthorLinkKey, string> = {
  telegram: telegramSrc,
  github: githubSrc,
  linkedin: linkedinSrc,
};

export function pickAuthorLinks(
  raw: unknown,
  legacyTelegram?: string | null,
): AuthorLinks {
  const out: AuthorLinks = {};
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

export function orderedLinkEntries(
  links: AuthorLinks,
): [AuthorLinkKey, string][] {
  return AUTHOR_LINK_KEYS.filter((k) => links[k]?.trim()).map((k) => [
    k,
    links[k]!,
  ]);
}

/** Wide “Telegram” pill — only when the only link is Telegram */
export function isTelegramOnlyPillCase(links: AuthorLinks): boolean {
  const entries = orderedLinkEntries(links);
  return entries.length === 1 && entries[0][0] === "telegram";
}
