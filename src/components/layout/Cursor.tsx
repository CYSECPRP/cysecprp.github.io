import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useFinePointer, useReducedMotion } from "../../lib/media";
import styles from "./Cursor.module.css";

const INTERACTIVE = "a, button, input, textarea, label, [data-cursor]";

export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = root.current;
    if (!enabled || !container || !dot.current || !ring.current) return;
    // Percent offsets keep both centred while the ring grows for hover states.
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50 });
    const dotX = gsap.quickTo(dot.current, "x", {
      duration: 0.12,
      ease: "power3.out",
    });
    const dotY = gsap.quickTo(dot.current, "y", {
      duration: 0.12,
      ease: "power3.out",
    });
    const ringX = gsap.quickTo(ring.current, "x", {
      duration: 0.45,
      ease: "power3.out",
    });
    const ringY = gsap.quickTo(ring.current, "y", {
      duration: 0.45,
      ease: "power3.out",
    });

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
      container.dataset.visible = "true";
    };
    const onOver = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      container.dataset.hover = element?.closest(INTERACTIVE)
        ? "true"
        : "false";
      const text =
        element?.closest<HTMLElement>("[data-cursor-label]")?.dataset
          .cursorLabel ?? "";
      container.dataset.label = text ? "true" : "false";
      // The old text stays while the label fades out.
      if (text && label.current) label.current.textContent = text;
    };
    const onLeave = () => {
      container.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={root}
      className={styles.cursor}
      data-visible="false"
      aria-hidden="true"
    >
      <div ref={ring} className={styles.ring}>
        <span ref={label} className={styles.label} />
      </div>
      <div ref={dot} className={styles.dot} />
    </div>
  );
}
