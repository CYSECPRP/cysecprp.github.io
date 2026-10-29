import { useEffect, type RefObject } from "react";
import { gsap } from "./gsap";
import { useFinePointer, useReducedMotion } from "./media";

export type MagnifyOptions = {
  /** Extra scale of the letter right under the cursor (0.26 → 126%). */
  strength?: number;
  /** Radius of influence, in multiples of the root font size. */
  reach?: number;
};

const AWAY = -1e5;
const pointer = { x: AWAY, y: AWAY };
let tracking = false;

function trackPointer() {
  if (tracking) return;
  tracking = true;
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => {
    pointer.x = AWAY;
    pointer.y = AWAY;
  });
}

/** Swells the [data-glyph] letters of `root` by their distance to the cursor; returns a cleanup. */
export function attachMagnify(
  root: HTMLElement,
  { strength = 0.26, reach = 1.4 }: MagnifyOptions = {},
) {
  const glyphs = Array.from(root.querySelectorAll<HTMLElement>("[data-glyph]"));
  const count = glyphs.length;
  if (count === 0) return () => undefined;

  trackPointer();
  // Glyph centres come from offsetLeft/offsetTop, so `root` must be their offset parent.
  if (getComputedStyle(root).position === "static")
    root.style.position = "relative";
  root.style.setProperty("--magnify", String(strength));

  const centerX = new Float64Array(count);
  const centerY = new Float64Array(count);
  const level = new Float64Array(count);
  let radius = 0;
  let measured = false;
  let visible = false;
  let active = false;

  const measure = () => {
    radius = parseFloat(getComputedStyle(root).fontSize) * reach;
    for (let i = 0; i < count; i++) {
      let node: HTMLElement | null = glyphs[i];
      let x = node.offsetWidth / 2;
      let y = node.offsetHeight / 2;
      while (node && node !== root) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      centerX[i] = x;
      centerY[i] = y;
    }
    measured = true;
  };

  const tick = (_time: number, deltaMs: number) => {
    if (!visible) return;
    if (!measured) measure();
    const rect = root.getBoundingClientRect();
    const x = pointer.x - rect.left - root.clientLeft;
    const y = pointer.y - rect.top - root.clientTop;
    const near =
      x > -radius &&
      y > -radius &&
      x < rect.width + radius &&
      y < rect.height + radius;
    if (!near && !active) return;

    const ease = 1 - Math.exp(-Math.min(deltaMs, 64) / 90);
    let moving = false;
    for (let i = 0; i < count; i++) {
      let target = 0;
      if (near) {
        const dx = x - centerX[i];
        const dy = y - centerY[i];
        const t = 1 - Math.sqrt(dx * dx + dy * dy) / radius;
        if (t > 0) target = t * t * (3 - 2 * t);
      }
      const current = level[i];
      if (current === target) continue;
      let next = current + (target - current) * ease;
      if (Math.abs(target - next) < 0.004) next = target;
      else moving = true;
      level[i] = next;
      glyphs[i].style.setProperty("--m", next.toFixed(3));
    }
    active = near || moving;
  };

  const resizeObserver = new ResizeObserver(() => {
    measured = false;
  });
  resizeObserver.observe(root);
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
    },
    { rootMargin: "160px" },
  );
  intersectionObserver.observe(root);
  document.fonts.ready
    .then(() => {
      measured = false;
    })
    .catch(() => undefined);
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    for (const glyph of glyphs) glyph.style.removeProperty("--m");
  };
}

/**
 * Letter magnifier for mouse users; does nothing on touch screens or with reduced motion.
 * Pass the rendered text as `content` so the letters are collected again when it changes.
 */
export function useMagnify(
  ref: RefObject<HTMLElement | null>,
  { strength, reach }: MagnifyOptions = {},
  enabled = true,
  content = "",
) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const on = enabled && fine && !reduced;

  useEffect(() => {
    const root = ref.current;
    if (!on || !root) return;
    return attachMagnify(root, { strength, reach });
  }, [ref, on, strength, reach, content]);
}
