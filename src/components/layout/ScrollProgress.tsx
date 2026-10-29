import { useEffect, useRef } from "react";
import { ScrollTrigger } from "../../lib/gsap";
import styles from "./ScrollProgress.module.css";

/** Thin accent bar along the top frame that fills as the page scrolls. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = bar.current;
    if (!element) return;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        element.style.transform = `scaleX(${self.progress.toFixed(4)})`;
      },
    });
    return () => trigger.kill();
  }, []);

  return <div ref={bar} className={styles.bar} aria-hidden="true" />;
}
