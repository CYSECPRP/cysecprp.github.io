import { impact } from "../content/site";
import { pad } from "../lib/format";
import { trackSpotlight } from "../lib/interactions";
import Reveal from "../components/ui/Reveal";
import SplitText from "../components/ui/SplitText";
import styles from "./Impact.module.css";

export default function Impact() {
  return (
    <div className={styles.impact}>
      <header className={styles.head}>
        <SplitText as="h3" text="Impact & results" className={styles.title} />
        <p className={styles.tag}>Results</p>
      </header>
      <ol className={`${styles.grid} spotlight`} onPointerMove={trackSpotlight}>
        {impact.map((text, index) => (
          <li key={text} className={styles.cell}>
            <Reveal className={styles.tile} delay={(index % 3) * 0.06}>
              <p className={styles.index}>{pad(index + 1)}</p>
              <p className={styles.text}>{text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
