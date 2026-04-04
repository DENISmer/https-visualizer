import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GlassButton } from "@/shared/ui/glass-button";
import styles from "./authors-modal.module.scss";
import { Icon } from "@/shared/ui/icon";
import {
  FALLBACK_AUTHORS,
  parseAuthorsFromApiPayload,
  type Author,
} from "@/shared/constants/authors";
import authors_icon from "@/shared/ui/icons/authorsIcon.svg";
import { API_ROUTES, apiGet } from "@/shared/api/client";
import close_icon from "@/shared/ui/icons/close_icon.svg";
import { AuthorSocialLinks } from "@/modules/authors-modal/ui/author-social-links";

export const AuthorsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authors, setAuthors] = useState<Author[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await apiGet<unknown>(API_ROUTES.authors);
        const parsed = parseAuthorsFromApiPayload(data);
        if (!cancelled) {
          setAuthors(parsed.length > 0 ? parsed : FALLBACK_AUTHORS);
        }
      } catch {
        if (!cancelled) setAuthors(FALLBACK_AUTHORS);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = authors ?? FALLBACK_AUTHORS;

  return (
    <>
      <GlassButton
        className={styles.triggerButton}
        onClick={() => setIsOpen(true)}
      >
        <div className={styles.triggerButton}>
          <Icon size={20}>
            <img src={authors_icon} sizes="23px 20px" alt="" />
          </Icon>
          <span>Authors</span>
        </div>
      </GlassButton>

      {isOpen &&
        createPortal(
          <div
            className={styles.backdrop}
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Authors"
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.title}>
                <div className={styles.title_name}>
                  <Icon size={23}>
                    <img src={authors_icon} alt="" />
                  </Icon>
                  <span>Authors</span>
                </div>

                <Icon size={20} onClick={() => setIsOpen(false)}>
                  <img src={close_icon} alt="" />
                </Icon>
              </h2>

              <div className={styles.content}>
                {list.map((item) => (
                  <div key={item.id ?? item.name} className={styles.authorInfo}>
                    <div className={styles.authorInfo_title}>
                      <Icon size={54}>
                        <img src={item.avatarUrl || authors_icon} alt="" />
                      </Icon>{" "}
                      <div className={styles.authorInfo_name}>
                        <span>{item.name}</span>
                        <span className={styles.authorInfo_name_secondary}>
                          {item.role}
                        </span>
                      </div>
                    </div>
                    <AuthorSocialLinks links={item.links} />
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
