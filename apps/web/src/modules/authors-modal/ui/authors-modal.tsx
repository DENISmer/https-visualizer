import { useState } from "react";
import { createPortal } from "react-dom";
import { GlassButton } from "@/shared/ui/glass-button";
import styles from "./authors-modal.module.scss";
import { Icon } from "@/shared/ui/icon";
import { AUTHORS } from "@/shared/constants/authors";
import authors_icon from "@/shared/ui/icons/authorsIcon.svg";
import close_icon from "@/shared/ui/icons/close_icon.svg";
import telegram_icon from "@/shared/ui/icons/telegram_icon.svg";
import { PillLink } from "@/shared/ui/pill-link";

export const AuthorsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <GlassButton onClick={() => setIsOpen(true)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "20px",
            fontWeight: 400,
            columnGap: "8px",
          }}
        >
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
                {AUTHORS.map((item, index) => (
                  <div key={item.name} className={styles.authorInfo}>
                    <div className={styles.authorInfo_title}>
                      <Icon size={54}>
                        <img src={authors_icon} />
                      </Icon>{" "}
                      <div className={styles.authorInfo_name}>
                        <span>{item.name}</span>
                        <span className={styles.authorInfo_name_secondary}>
                          {item.role}
                        </span>
                      </div>
                    </div>
                    <PillLink
                      style={
                        window.visualViewport?.width &&
                        window.visualViewport?.width < 1000
                          ? { fontSize: "14px", maxWidth: "135px" }
                          : {}
                      }
                      href={item.telegram}
                    >
                      <Icon size={16}>
                        <img src={telegram_icon} alt="" />
                      </Icon>
                      <span>Telegram</span>
                    </PillLink>
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
