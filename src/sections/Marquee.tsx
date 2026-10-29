import { useRef } from "react";
import { marqueeWords, site } from "../content/site";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "../lib/gsap";
import { useMagnify } from "../lib/magnify";
import styles from "./Marquee.module.css";

const ROW = Array.from({ length: 4 }, () => marqueeWords).flat();
const LOOP_SECONDS = 48;

function Row({ reverse = false }: { reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useMagnify(ref, { strength: 0.2, reach: 0.8 });

  return (
    <div
      ref={ref}
      className={[styles.row, reverse ? styles.reverse : ""].join(" ")}
      data-row=""
      data-magnify=""
    >
      {[...ROW, ...ROW].map((word, index) => (
        <span key={index} className={styles.item}>
          <span>
            {Array.from(word).map((char, charIndex) => (
              <span key={charIndex} data-glyph="">
                {char}
              </span>
            ))}
          </span>
          <span className={styles.star}>✳</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        const track = section.querySelector<HTMLElement>("[data-track]");
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]", section);
        if (!track) return;
        let progress = 0;
        let direction = 1;
        let velocity = 0;
        let boost = 0;
        let active = true;

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            active = self.isActive;
          },
          onUpdate: (self) => {
            velocity = self.getVelocity();
          },
        });

        // Scroll speed (px/s) speeds the rows up, flips them with the scroll direction and skews the track.
        const tick = (_time: number, deltaMs: number) => {
          if (!active) return;
          const seconds = Math.min(deltaMs, 64) / 1000;
          velocity *= Math.exp(-seconds * 5);
          if (Math.abs(velocity) > 30) direction = velocity > 0 ? 1 : -1;
          const target = Math.min(Math.abs(velocity) / 220, 7);
          boost += (target - boost) * (1 - Math.exp(-seconds * 6));
          progress =
            (progress +
              (seconds / LOOP_SECONDS) * (1 + boost) * direction +
              1) %
            1;
          rows.forEach((row, index) => {
            const offset = index % 2 ? progress - 1 : -progress;
            row.style.transform = `translate3d(${(offset * 50).toFixed(3)}%, 0, 0)`;
          });
          track.style.transform = `skewX(${(-direction * Math.min(boost, 6)).toFixed(2)}deg)`;
        };
        gsap.ticker.add(tick);

        return () => {
          gsap.ticker.remove(tick);
          trigger.kill();
          rows.forEach((row) => row.style.removeProperty("transform"));
          track.style.removeProperty("transform");
        };
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className={styles.marquee}
      aria-label={marqueeWords.join(", ")}
    >
      <div className={styles.track} data-track="" aria-hidden="true">
        <Row />
        <Row reverse />
      </div>
      <p className={styles.tagline}>{site.tagline}</p>
    </section>
  );
}
