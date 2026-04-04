import { useEffect, useState } from "react";
import { PillLink } from "@/shared/ui/pill-link";
import { Icon } from "@/shared/ui/icon";
import {
  AUTHOR_LINK_ICON_SRC,
  AUTHOR_LINK_LABEL,
  isTelegramOnlyPillCase,
  orderedLinkEntries,
  type AuthorLinks,
  type AuthorLinkKey,
} from "@/shared/constants/author-links";
import styles from "./authors-modal.module.scss";

type AuthorSocialLinksProps = {
  links: AuthorLinks;
};

export const AuthorSocialLinks = ({ links }: AuthorSocialLinksProps) => {
  const [compactPill, setCompactPill] = useState(false);

  useEffect(() => {
    const q = window.matchMedia("(max-width: 999px)");
    const sync = () => setCompactPill(q.matches);
    sync();
    q.addEventListener("change", sync);
    return () => q.removeEventListener("change", sync);
  }, []);

  const entries = orderedLinkEntries(links);
  if (entries.length === 0) return null;

  if (isTelegramOnlyPillCase(links)) {
    const url = entries[0][1];
    return (
      <PillLink
        href={url}
        style={
          compactPill ? { fontSize: "14px", maxWidth: "135px" } : undefined
        }
      >
        <Icon size={16}>
          <img src={AUTHOR_LINK_ICON_SRC.telegram} alt="" />
        </Icon>
        <span>Telegram</span>
      </PillLink>
    );
  }

  return (
    <div className={styles.authorLinks}>
      {entries.map(([kind, url]) => {
        const label = AUTHOR_LINK_LABEL[kind];
        return (
          <PillLink
            key={kind}
            variant="icon"
            href={url}
            title={label}
            aria-label={label}
            data-network={kind}
          >
            <Icon size={20}>
              <img src={AUTHOR_LINK_ICON_SRC[kind as AuthorLinkKey]} alt="" />
            </Icon>
          </PillLink>
        );
      })}
    </div>
  );
};
