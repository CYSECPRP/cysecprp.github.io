import type { ReactNode } from "react";
import styles from "./Chip.module.css";

export default function Chip({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent";
}) {
  return (
    <span
      className={
        tone === "accent" ? `${styles.chip} ${styles.accent}` : styles.chip
      }
    >
      {children}
    </span>
  );
}
