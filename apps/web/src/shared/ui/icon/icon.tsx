import type { ReactNode } from "react";
import styles from "./icon.module.scss";

type IconProps = {
  children: ReactNode;
  size?: number;
  className?: string;
  onClick?: () => void;
};

export const Icon = ({
  children,
  size = 20,
  className,
  onClick,
}: IconProps) => {
  return (
    <span
      className={[styles.icon, className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
      aria-hidden
      onClick={onClick}
    >
      {children}
    </span>
  );
};
