import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router";
import { useMagnetic } from "../../lib/interactions";
import Icon, { type IconName } from "./Icon";
import ScrambleText from "./ScrambleText";
import SectionLink from "./SectionLink";
import styles from "./Button.module.css";

type Props = {
  children: ReactNode;
  to?: string;
  section?: string;
  href?: string;
  external?: boolean;
  download?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit";
  variant?: "solid" | "outline";
  icon?: IconName;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
};

export default function Button({
  children,
  to,
  section,
  href,
  external = false,
  download = false,
  onClick,
  type = "button",
  variant = "outline",
  icon,
  className,
  disabled,
  ariaLabel,
}: Props) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");
  const magnetic = useMagnetic();
  const content = (
    <>
      <span className={styles.label}>
        {typeof children === "string" ? (
          <ScrambleText text={children} />
        ) : (
          children
        )}
      </span>
      {icon ? <Icon name={icon} className={styles.icon} /> : null}
    </>
  );

  if (section) {
    return (
      <SectionLink
        ref={magnetic}
        to={section}
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </SectionLink>
    );
  }

  if (to) {
    return (
      <Link
        ref={magnetic}
        to={to}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        ref={magnetic}
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={magnetic}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
