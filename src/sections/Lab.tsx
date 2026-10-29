import { lab } from "../content/site";
import { openTerminal } from "../lib/terminal";
import Button from "../components/ui/Button";
import MagnifyText from "../components/ui/MagnifyText";
import SectionLabel from "../components/ui/SectionLabel";
import SplitText from "../components/ui/SplitText";
import styles from "./Lab.module.css";

export default function Lab() {
  return (
    <section id="lab" className={styles.lab} aria-labelledby="lab-title">
      <div className={styles.head}>
        <div className={styles.headText}>
          <SectionLabel index="03" label="Lab" />
          <SplitText
            as="h2"
            id="lab-title"
            text={lab.heading}
            className={styles.title}
          />
          <p className={styles.sub}>{lab.sub}</p>
        </div>
        <Button
          onClick={() => openTerminal("help")}
          variant="solid"
          icon="terminal"
        >
          Open the terminal
        </Button>
      </div>

      <ul className={styles.list}>
        {lab.items.map((item) => (
          <li key={item.name}>
            <button
              type="button"
              className={styles.row}
              onClick={() => openTerminal(item.command)}
              data-cursor-label="Run"
            >
              <span className={styles.name}>
                <MagnifyText text={item.name} strength={0.28} />
              </span>
              <span className={styles.rule} aria-hidden="true" />
              <span className={styles.tag}>{item.tag}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
              <span className="sr-only"> — open in the terminal</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
