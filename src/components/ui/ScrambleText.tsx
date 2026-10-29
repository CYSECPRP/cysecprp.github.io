import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../lib/media";
import { scramble } from "../../lib/scramble";

type Props = {
  text: string;
  className?: string;
  /**
   * hover: replays when the nearest link or button is hovered (or keyboard-focused);
   * view: once when scrolled into view; play: whenever `play` turns true.
   */
  trigger?: "hover" | "view" | "play";
  play?: boolean;
  /** Characters marked with data-highlight so the parent can colour them. */
  highlight?: string;
};

/** Monospace text that "decrypts" through random glyphs before settling. */
export default function ScrambleText({
  text,
  className,
  trigger = "hover",
  play = false,
  highlight = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced) return;
    const nodes = Array.from(root.children) as HTMLElement[];
    let cancel: (() => void) | undefined;
    const run = () => {
      cancel?.();
      cancel = scramble(nodes);
    };

    if (trigger === "hover") {
      const host = root.closest<HTMLElement>("a, button") ?? root;
      const onEnter = (event: PointerEvent) => {
        if (event.pointerType !== "touch") run();
      };
      const onFocus = () => {
        if (host.matches(":focus-visible")) run();
      };
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("focus", onFocus);
      return () => {
        host.removeEventListener("pointerenter", onEnter);
        host.removeEventListener("focus", onFocus);
        cancel?.();
      };
    }

    if (trigger === "play") {
      if (play) run();
      return () => cancel?.();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        run();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      cancel?.();
    };
  }, [text, trigger, play, reduced]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {Array.from(text).map((char, index) => (
          <span
            key={index}
            data-final={char}
            data-highlight={highlight.includes(char) ? "" : undefined}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
