import { useRef } from "react";
import { bootLines, site } from "../../content/site";
import { finishBoot, revealBoot, useBootPhase } from "../../lib/boot";
import { gsap, useGSAP } from "../../lib/gsap";
import styles from "./Preloader.module.css";

export default function Preloader() {
  const phase = useBootPhase();
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const element = root.current;
      if (!element || phase !== "booting") return;
      const progress = { value: 0 };
      const timeline = gsap.timeline({ onComplete: finishBoot });

      timeline.to(
        progress,
        {
          value: 100,
          duration: 2.4,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counter.current)
              counter.current.textContent = String(
                Math.round(progress.value),
              ).padStart(3, "0");
          },
        },
        0,
      );
      gsap.utils
        .toArray<HTMLElement>("[data-line]", element)
        .forEach((line, index) => {
          const at = 0.1 + index * 0.45;
          timeline.fromTo(
            line,
            { autoAlpha: 0, y: 6 },
            { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" },
            at,
          );
          timeline.set(line, { attr: { "data-done": "true" } }, at + 0.35);
        });
      timeline.call(revealBoot, undefined, "+=0.2");
      timeline.to(
        element,
        { yPercent: -100, duration: 0.95, ease: "power4.inOut" },
        "<",
      );
    },
    { scope: root },
  );

  if (phase === "ready") return null;

  return (
    <div
      ref={root}
      className={styles.preloader}
      role="status"
      aria-label="Loading portfolio"
    >
      <div className={styles.row}>
        <span>{site.shortName} — Portfolio</span>
        <span>©2026</span>
      </div>
      <ol className={styles.lines}>
        {bootLines.map((line) => (
          <li key={line} className={styles.line} data-line="">
            <span>&gt; {line}</span>
            <span className={styles.ok}>ok</span>
          </li>
        ))}
      </ol>
      <div className={`${styles.row} ${styles.bottom}`}>
        <span ref={counter} className={styles.counter}>
          000
        </span>
        <span>
          {site.location.short} — {site.location.coords.split(" · ")[0]}
        </span>
      </div>
    </div>
  );
}
