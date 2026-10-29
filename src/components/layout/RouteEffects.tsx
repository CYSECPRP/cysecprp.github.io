import { useEffect } from "react";
import { useLocation } from "react-router";
import { ScrollTrigger } from "../../lib/gsap";
import { useReducedMotion } from "../../lib/media";
import { scrollToTarget, startSmoothScroll } from "../../lib/scroll";

/** Owns smooth scrolling and resets the scroll position (or jumps to a #section) on navigation. */
export default function RouteEffects() {
  const reduced = useReducedMotion();
  const { pathname, hash } = useLocation();

  useEffect(() => (reduced ? undefined : startSmoothScroll()), [reduced]);

  useEffect(() => {
    document.fonts.ready
      .then(() => ScrollTrigger.refresh())
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToTarget(hash || 0, true);
    }, 60);
    return () => window.clearTimeout(id);
  }, [pathname, hash]);

  return null;
}
