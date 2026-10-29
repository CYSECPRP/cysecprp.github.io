import { Fragment, useRef } from "react";
import { useMagnify, type MagnifyOptions } from "../../lib/magnify";
import styles from "./MagnifyText.module.css";

type Props = MagnifyOptions & {
  text: string;
  className?: string;
  /** Leave out the screen-reader copy when an ancestor already labels or hides the text. */
  decorative?: boolean;
};

/** Plain text whose letters swell toward the cursor. */
export default function MagnifyText({
  text,
  className,
  decorative = false,
  strength,
  reach,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  useMagnify(ref, { strength, reach }, true, text);

  return (
    <>
      {decorative ? null : <span className="sr-only">{text}</span>}
      <span
        ref={ref}
        className={[styles.root, className].filter(Boolean).join(" ")}
        data-magnify=""
        aria-hidden="true"
      >
        {text.split(" ").map((word, wordIndex) => (
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
    </>
  );
}
