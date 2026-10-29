import { useCallback, type PointerEvent as ReactPointerEvent } from "react";
import { gsap } from "./gsap";
import { useFinePointer, useReducedMotion } from "./media";
import { createSpring, isSettled, stepSpring } from "./spring";

function useHoverMotion() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  return fine && !reduced;
}

/** Ref callback: the element drifts toward the cursor and springs back when it leaves. */
export function useMagnetic(strength = 0.25) {
  const enabled = useHoverMotion();

  return useCallback(
    (element: HTMLElement | null) => {
      if (!element || !enabled) return;
      const node = element;
      const x = createSpring();
      const y = createSpring();
      let targetX = 0;
      let targetY = 0;
      let running = false;

      const stop = () => {
        running = false;
        gsap.ticker.remove(tick);
        x.value = x.velocity = y.value = y.velocity = 0;
        node.style.removeProperty("transform");
      };

      const tick = (_time: number, deltaMs: number) => {
        const seconds = Math.min(deltaMs, 50) / 1000;
        stepSpring(x, targetX, seconds, 220, 16);
        stepSpring(y, targetY, seconds, 220, 16);
        if (
          targetX === 0 &&
          targetY === 0 &&
          isSettled(x, 0, 0.05) &&
          isSettled(y, 0, 0.05)
        ) {
          stop();
          return;
        }
        node.style.transform = `translate3d(${x.value.toFixed(2)}px, ${y.value.toFixed(2)}px, 0)`;
      };

      const start = () => {
        if (running) return;
        running = true;
        gsap.ticker.add(tick);
      };
      const onMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const rect = node.getBoundingClientRect();
        // Measure from the resting centre, not from where the spring has already moved it.
        targetX =
          (event.clientX - (rect.left + rect.width / 2 - x.value)) * strength;
        targetY =
          (event.clientY - (rect.top + rect.height / 2 - y.value)) * strength;
        start();
      };
      const onLeave = () => {
        targetX = 0;
        targetY = 0;
        start();
      };

      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerleave", onLeave);
      return () => {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", onLeave);
        stop();
      };
    },
    [enabled, strength],
  );
}

/** Ref callback: tilts the element in 3D toward the cursor and feeds --glare-x / --glare-y. */
export function useTilt(maxDegrees = 7) {
  const enabled = useHoverMotion();

  return useCallback(
    (element: HTMLElement | null) => {
      if (!element || !enabled) return;
      const node = element;
      gsap.set(node, { transformPerspective: 900 });
      const rotateX = gsap.quickTo(node, "rotationX", {
        duration: 0.6,
        ease: "power3.out",
      });
      const rotateY = gsap.quickTo(node, "rotationY", {
        duration: 0.6,
        ease: "power3.out",
      });

      const onMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const rect = node.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = (event.clientY - rect.top) / rect.height;
        rotateY((nx - 0.5) * maxDegrees * 2);
        rotateX((0.5 - ny) * maxDegrees * 2);
        node.style.setProperty("--glare-x", `${(nx * 100).toFixed(1)}%`);
        node.style.setProperty("--glare-y", `${(ny * 100).toFixed(1)}%`);
      };
      const onLeave = () => {
        rotateX(0);
        rotateY(0);
      };

      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerleave", onLeave);
      return () => {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf(node);
        gsap.set(node, { clearProps: "transform" });
      };
    },
    [enabled, maxDegrees],
  );
}

/** Pointer-move handler that feeds the cursor position to the global .spotlight glow. */
export function trackSpotlight(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty(
    "--spot-x",
    `${(event.clientX - rect.left).toFixed(1)}px`,
  );
  target.style.setProperty(
    "--spot-y",
    `${(event.clientY - rect.top).toFixed(1)}px`,
  );
}
