import { expertise, skills } from "../content/site";
import { pad } from "../lib/format";
import { trackSpotlight } from "../lib/interactions";
import Chip from "../components/ui/Chip";
import Reveal from "../components/ui/Reveal";
import SplitText from "../components/ui/SplitText";
import styles from "./Skills.module.css";

const TOTAL = skills.reduce((count, group) => count + group.items.length, 0);

export default function Skills() {
  return (
    <div className={styles.skills}>
      <header className={styles.head}>
        <SplitText as="h3" text="Skills" className={styles.title} />
        <p className={styles.count}>Stack · {TOTAL}</p>
      </header>

      <div
        className={`${styles.grid} spotlight`}
        onPointerMove={trackSpotlight}
      >
        {skills.map((group, index) => (
          <Reveal
            key={group.title}
            className={styles.cell}
            delay={(index % 3) * 0.06}
          >
            <span className={styles.plus} aria-hidden="true">
              +
            </span>
            <div className={styles.cellHead}>
              <h4 className={styles.cellTitle}>{group.title}</h4>
              <span className={styles.cellIndex}>{pad(index + 1)}</span>
            </div>
            <ul className={styles.chips}>
              {group.items.map((item) => (
                <li key={item}>
                  <Chip>{item}</Chip>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className={styles.expertise}>
        <p className={styles.expertiseTitle}>Areas of expertise</p>
        <ul className={styles.expertiseList}>
          {expertise.map((item) => (
            <li key={item}>
              {item}
              <span aria-hidden="true">/</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
