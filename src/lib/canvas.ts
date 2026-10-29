export type DrawFrame = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
) => void;

type LoopOptions = { animate: boolean; maxDpr?: number; staticTime?: number };

export type CanvasLoop = { stop: () => void; redraw: () => void };

/** Sizes a 2D canvas to its box, and only animates while it is on screen and the tab is visible. */
export function runCanvasLoop(
  canvas: HTMLCanvasElement,
  draw: DrawFrame,
  { animate, maxDpr = 2, staticTime = 6 }: LoopOptions,
): CanvasLoop {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { stop: () => undefined, redraw: () => undefined };

  let width = 0;
  let height = 0;
  let frame = 0;
  let visible = false;
  let stopped = false;
  const start = performance.now();

  const paint = (now: number) => {
    if (width === 0 || height === 0) return;
    draw(ctx, width, height, animate ? (now - start) / 1000 : staticTime);
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(performance.now());
  };

  const loop = (now: number) => {
    paint(now);
    frame = requestAnimationFrame(loop);
  };

  const update = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (animate && visible && !document.hidden && !stopped)
      frame = requestAnimationFrame(loop);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      update();
    },
    { rootMargin: "120px" },
  );
  intersectionObserver.observe(canvas);
  document.addEventListener("visibilitychange", update);

  return {
    stop: () => {
      stopped = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
    },
    redraw: () => paint(performance.now()),
  };
}
