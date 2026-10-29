import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

let lenis: Lenis | null = null;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function startSmoothScroll() {
  const instance = new Lenis({ lerp: 0.1, anchors: false });
  lenis = instance;
  if (document.documentElement.classList.contains("is-booting"))
    instance.stop();

  instance.on("scroll", () => ScrollTrigger.update());
  const tick = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    if (lenis === instance) lenis = null;
  };
}

function resolveTarget(target: string | number | HTMLElement) {
  if (typeof target !== "string") return target;
  return document.getElementById(target.replace(/^#/, ""));
}

export function scrollToTarget(
  target: string | number | HTMLElement,
  immediate = false,
) {
  const resolved = resolveTarget(target);
  if (resolved === null) return;

  if (lenis) {
    lenis.scrollTo(resolved, { immediate, duration: 1.4, force: true });
    return;
  }

  const behavior: ScrollBehavior =
    immediate || prefersReducedMotion() ? "auto" : "smooth";
  if (typeof resolved === "number")
    window.scrollTo({ top: resolved, behavior });
  else resolved.scrollIntoView({ behavior, block: "start" });
}

export function setScrollLocked(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}
