import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./pill-link.module.scss";

type PillLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

export const PillLink = ({
  href,
  children,
  className,
  ...props
}: PillLinkProps) => {
  return (
    <a
      href={href}
      className={[styles.link, className].filter(Boolean).join(" ")}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
};
