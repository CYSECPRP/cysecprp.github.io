import { useEffect, useRef } from "react";
import { runCanvasLoop } from "../../lib/canvas";
import { readPalette, rgba } from "../../lib/colors";
import { useMode } from "../../lib/flags";
import { useReducedMotion } from "../../lib/media";
import { noise3 } from "../../lib/noise";
import styles from "./Visual.module.css";

const RAYS = 220;
const PACKETS = 16;

/** Radial "packet capture" burst: rays breathe with noise while packets travel outward. */
export default function PacketBurst() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const mode = useMode();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const { paper, accent } = readPalette();

    const loop = runCanvasLoop(
      canvas,
      (ctx, width, height, time) => {
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2;
        const cy = height / 2;
        const inner = Math.min(width, height) * 0.14;
        const outer = Math.min(width, height) * 0.47;
        const reach = (angle: number) => {
          const n =
            noise3(Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, time * 0.25) *
              0.5 +
            0.5;
          return inner + (outer - inner) * Math.pow(n, 1.6);
        };

        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba(paper, 0.72);
        ctx.beginPath();
        for (let i = 0; i < RAYS; i++) {
          const angle = (i / RAYS) * Math.PI * 2;
          const length = reach(angle);
          ctx.moveTo(
            cx + Math.cos(angle) * inner,
            cy + Math.sin(angle) * inner,
          );
          ctx.lineTo(
            cx + Math.cos(angle) * length,
            cy + Math.sin(angle) * length,
          );
        }
        ctx.stroke();

        ctx.strokeStyle = rgba(paper, 0.4);
        ctx.beginPath();
        ctx.arc(cx, cy, inner * 0.78, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = rgba(accent, 1);
        for (let k = 0; k < PACKETS; k++) {
          const angle = (Math.round((k * 137.508) % 360) / 360) * Math.PI * 2;
          const progress = (time * 0.2 + k * 0.137) % 1;
          const distance = inner + (reach(angle) - inner) * progress;
          ctx.fillRect(
            cx + Math.cos(angle) * distance - 1.5,
            cy + Math.sin(angle) * distance - 1.5,
            3,
            3,
          );
        }
      },
      { animate: !reduced, staticTime: 8 },
    );
    return loop.stop;
  }, [reduced, mode]);

  return <canvas ref={ref} className={styles.canvas} aria-hidden="true" />;
}
