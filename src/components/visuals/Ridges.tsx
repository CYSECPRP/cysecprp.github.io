import { useEffect, useRef } from "react";
import { runCanvasLoop } from "../../lib/canvas";
import { readPalette, rgba } from "../../lib/colors";
import { useMode } from "../../lib/flags";
import { useReducedMotion } from "../../lib/media";
import { noise3 } from "../../lib/noise";
import styles from "./Visual.module.css";

type Props = { variant?: "card" | "footer"; className?: string };

/** Stacked ridge lines; in the card variant one line is flagged as an anomaly. */
export default function Ridges({ variant = "card", className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const mode = useMode();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const { ink, paper, accent } = readPalette();
    const footer = variant === "footer";
    const rows = footer ? 30 : 40;
    const anomalyRow = footer ? -1 : Math.floor(rows * 0.58);

    const loop = runCanvasLoop(
      canvas,
      (ctx, width, height, time) => {
        ctx.clearRect(0, 0, width, height);
        const marginX = width * (footer ? 0.03 : 0.1);
        const top = height * (footer ? 0.3 : 0.16);
        const bottom = height * (footer ? 0.98 : 0.9);
        const step = (bottom - top) / rows;
        const amplitude = step * (footer ? 4.4 : 5.5);
        const span = width - marginX * 2;
        const stepX = Math.max(3, span / 170);
        ctx.lineWidth = 1;

        for (let row = 0; row < rows; row++) {
          const baseY = top + row * step;
          const anomaly = row === anomalyRow;
          const curve = new Path2D();
          curve.moveTo(marginX, baseY);
          for (let x = marginX; x <= width - marginX + 0.5; x += stepX) {
            const nx = (x - width / 2) / (span / 2);
            const envelope = Math.exp(-nx * nx * (footer ? 2.2 : 4.2));
            const n = noise3(x * 0.011, row * 0.32, time * 0.3) * 0.5 + 0.5;
            let lift = amplitude * envelope * n * n;
            if (anomaly) lift *= 1.9 + 0.5 * Math.sin(time * 2.2);
            curve.lineTo(x, baseY - lift);
          }
          curve.lineTo(width - marginX, baseY);

          // Fill below each line so nearer ridges hide the ones behind them.
          const occluder = new Path2D(curve);
          occluder.lineTo(width - marginX, height);
          occluder.lineTo(marginX, height);
          occluder.closePath();
          ctx.fillStyle = rgba(ink, 1);
          ctx.fill(occluder);

          ctx.strokeStyle = anomaly
            ? rgba(accent, 1)
            : rgba(paper, footer ? 0.42 : 0.78);
          ctx.stroke(curve);
        }
      },
      { animate: !reduced, staticTime: 4 },
    );
    return loop.stop;
  }, [variant, reduced, mode]);

  return (
    <canvas
      ref={ref}
      className={[styles.canvas, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}
