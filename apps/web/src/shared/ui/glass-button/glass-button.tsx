import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./glass-button.module.scss";

type GlassButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

export const GlassButton = ({
  children,
  type = "button",
  className,
  ...props
}: GlassButtonProps) => {
  const buttonClassName = className
    ? `${styles.button} ${className}`
    : styles.button;

  return (
    <button className={buttonClassName} type={type} {...props}>
      <span className={styles.label}>{children}</span>
    </button>
  );
};