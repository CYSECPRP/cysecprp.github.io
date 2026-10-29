import { Fragment, useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "../../lib/gsap";
import { useMagnify, type MagnifyOptions } from "../../lib/magnify";
import styles from "./SplitText.module.css";

type Props = {
  text: string | readonly string[];
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  /** Hold the reveal until this becomes true (used while the boot screen is up). */
  play?: boolean;
  /** Reveal when scrolled into view; otherwise reveal immediately. */
  scroll?: boolean;
  delay?: number;
  /** Letters swell toward the cursor; pass false to turn it off. */
  magnify?: boolean | MagnifyOptions;
};

export default function SplitText({
  text,
  as: Tag = "h2",
  id,
  className,
  play = true,
  scroll = true,
  delay = 0,
  magnify = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const lines = typeof text === "string" ? [text] : text;
  useMagnify(
    ref,
    typeof magnify === "object" ? magnify : undefined,
    magnify !== false,
    lines.join("\n"),
  );

  useGSAP(
    () => {
      const visual = ref.current;
      if (!play || !visual) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(visual.querySelectorAll("[data-char]"), {
          yPercent: 118,
          duration: 1.05,
          ease: "power4.out",
          stagger: 0.016,
          delay,
          scrollTrigger: scroll
            ? { trigger: visual, start: "top 88%", once: true }
            : undefined,
          // Words only clip while letters slide in; afterwards swollen letters must not be cut off.
          onComplete: () => visual.setAttribute("data-revealed", ""),
        });
      });
    },
    { scope: ref, dependencies: [play] },
  );

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      <span
        ref={ref}
        className={styles.visual}
        data-magnify={magnify === false ? undefined : ""}
        aria-hidden="true"
      >
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className={styles.line}>
            {line.split(" ").map((word, wordIndex) => (
              <Fragment key={wordIndex}>
                {wordIndex > 0 ? " " : null}
                <span className={styles.word}>
                  {Array.from(word).map((char, charIndex) => (
                    <span key={charIndex} className={styles.char} data-char="">
                      <span data-glyph="">{char}</span>
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}
