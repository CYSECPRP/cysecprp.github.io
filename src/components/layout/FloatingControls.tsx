import { usePastFirstScreen } from "../../lib/media";
import { scrollToTarget } from "../../lib/scroll";
import { toggleTerminal, useTerminal } from "../../lib/terminal";
import Icon from "../ui/Icon";
import styles from "./FloatingControls.module.css";

export default function FloatingControls() {
  const { open } = useTerminal();
  const scrolled = usePastFirstScreen();

  return (
    <>
      <button
        type="button"
        className={styles.top}
        data-visible={scrolled ? "true" : "false"}
        tabIndex={scrolled ? 0 : -1}
        aria-hidden={!scrolled}
        aria-label="Back to top"
        onClick={() => scrollToTarget(0)}
      >
        <Icon name="arrow-up" />
      </button>
      <button
        type="button"
        className={styles.launcher}
        data-open={open ? "true" : "false"}
        aria-expanded={open}
        aria-controls="prp-terminal"
        onClick={toggleTerminal}
      >
        <span className={styles.badge}>&gt;_</span>
        <span className={styles.label}>Terminal</span>
      </button>
    </>
  );
}
