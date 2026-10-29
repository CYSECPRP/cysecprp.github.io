import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "../../lib/gsap";

type Props = {
  value: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Tie the count to scroll position instead of playing once. */
  scrub?: boolean;
  className?: string;
};

export default function Counter({
  value,
  from = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  scrub = false,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        const state = { n: from };
        const render = () => {
          element.textContent = format(state.n);
        };
        render();
        gsap.to(state, {
          n: value,
          ease: scrub ? "none" : "power2.out",
          duration: scrub ? 1 : 1.8,
          onUpdate: render,
          scrollTrigger: scrub
            ? { trigger: element, start: "top 85%", end: "top 30%", scrub: 0.6 }
            : { trigger: element, start: "top 92%", once: true },
        });
        return () => {
          element.textContent = format(value);
        };
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
