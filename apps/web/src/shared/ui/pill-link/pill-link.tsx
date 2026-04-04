import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./pill-link.module.scss";

export type PillLinkVariant = "pill" | "icon";

type PillLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: PillLinkVariant;
};

export const PillLink = ({
  href,
  children,
  className,
  variant = "pill",
  ...props
}: PillLinkProps) => {
  return (
    <a
      href={href}
      className={[
        styles.link,
        variant === "icon" && styles.linkIconOnly,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
};
