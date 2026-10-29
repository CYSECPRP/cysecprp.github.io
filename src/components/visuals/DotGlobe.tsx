import { useEffect, useRef } from "react";
import { site } from "../../content/site";
import { runCanvasLoop } from "../../lib/canvas";
import { readPalette, rgba } from "../../lib/colors";
import { useMode } from "../../lib/flags";
import { useReducedMotion } from "../../lib/media";
import { loadLandDots } from "./globeData";
import styles from "./Visual.module.css";

type Vec3 = [number, number, number];

const DEG = Math.PI / 180;
const TILT = 0.22;
const ARC_SEGMENTS = 48;
const TRAIL_SEGMENTS = 14;

// Sources of the animated "threat" arcs that converge on Bengaluru.
const SOURCES: [number, number][] = [
  [40.71, -74.0],
  [-23.55, -46.63],
  [51.5, -0.12],
  [50.11, 8.68],
  [55.75, 37.62],
  [6.52, 3.38],
  [25.2, 55.27],
  [39.9, 116.4],
  [35.68, 139.69],
  [1.35, 103.82],
  [-33.87, 151.21],
  [-26.2, 28.05],
];

const toVector = (latitude: number, longitude: number): Vec3 => {
  const lat = latitude * DEG;
  const lon = longitude * DEG;
  return [
    Math.cos(lat) * Math.cos(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.sin(lon),
  ];
};

type Props = { variant?: "rank" | "ambient"; className?: string };

export default function DotGlobe({ variant = "rank", className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const mode = useMode();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const { paper, accent } = readPalette();
    const ambient = variant === "ambient";
    const target = toVector(site.location.lat, site.location.lon);
    const arcs = ambient
      ? []
      : SOURCES.map(([lat, lon], index) => {
          const from = toVector(lat, lon);
          const cosine = Math.min(
            1,
            Math.max(
              -1,
              from[0] * target[0] + from[1] * target[1] + target[2] * from[2],
            ),
          );
          const omega = Math.acos(cosine);
          return {
            from,
            omega,
            sinOmega: Math.sin(omega),
            offset: index * 0.173,
          };
        });
    // Rotation that puts Bengaluru in front of the camera.
    const facing = site.location.lon * DEG - Math.PI / 2;
    let dots: Float32Array | null = null;
    let disposed = false;

    const loop = runCanvasLoop(
      canvas,
      (ctx, width, height, time) => {
        ctx.clearRect(0, 0, width, height);
        const radius = Math.min(width, height) * (ambient ? 0.48 : 0.42);
        const cx = width / 2;
        const cy = height / 2;
        const lambda = ambient
          ? facing + time * 0.05
          : facing + Math.sin(time * 0.16) * 0.75;
        const cl = Math.cos(lambda);
        const sl = Math.sin(lambda);
        const cp = Math.cos(TILT);
        const sp = Math.sin(TILT);
        let sx = 0;
        let sy = 0;
        let sz = 0;
        const project = (x: number, y: number, z: number) => {
          const x1 = x * cl + z * sl;
          const z1 = -x * sl + z * cl;
          sx = cx - x1 * radius;
          sy = cy - (y * cp - z1 * sp) * radius;
          sz = y * sp + z1 * cp;
        };

        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba(paper, ambient ? 0.06 : 0.14);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        if (dots) {
          const size = ambient ? 1.3 : 1.6;
          ctx.fillStyle = rgba(paper, 1);
          for (let i = 0; i < dots.length; i += 3) {
            project(dots[i], dots[i + 1], dots[i + 2]);
            if (sz <= 0.02) continue;
            ctx.globalAlpha = ambient ? 0.12 + sz * 0.22 : 0.25 + sz * 0.7;
            ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
          }
          ctx.globalAlpha = 1;
        }

        if (ambient) return;

        const arcPoint = (arc: (typeof arcs)[number], u: number) => {
          const a = Math.sin((1 - u) * arc.omega) / arc.sinOmega;
          const b = Math.sin(u * arc.omega) / arc.sinOmega;
          const lift =
            1 + 0.22 * Math.sin(Math.PI * u) * Math.min(1, arc.omega);
          project(
            (arc.from[0] * a + target[0] * b) * lift,
            (arc.from[1] * a + target[1] * b) * lift,
            (arc.from[2] * a + target[2] * b) * lift,
          );
        };

        const strokeArc = (
          arc: (typeof arcs)[number],
          start: number,
          end: number,
          segments: number,
        ) => {
          ctx.beginPath();
          let penDown = false;
          for (let s = 0; s <= segments; s++) {
            arcPoint(arc, start + ((end - start) * s) / segments);
            if (sz <= 0) {
              penDown = false;
              continue;
            }
            if (penDown) ctx.lineTo(sx, sy);
            else ctx.moveTo(sx, sy);
            penDown = true;
          }
          ctx.stroke();
        };

        for (const arc of arcs) {
          const head = (time * 0.22 + arc.offset) % 1;
          ctx.lineWidth = 1;
          ctx.strokeStyle = rgba(accent, 0.16);
          strokeArc(arc, 0, 1, ARC_SEGMENTS);
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = rgba(accent, 0.95);
          strokeArc(arc, Math.max(0, head - 0.16), head, TRAIL_SEGMENTS);
        }

        project(target[0], target[1], target[2]);
        if (sz > 0) {
          const pulse = (time * 0.6) % 1;
          ctx.lineWidth = 1;
          ctx.strokeStyle = rgba(accent, 1 - pulse);
          ctx.beginPath();
          ctx.arc(sx, sy, 4 + pulse * 18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = rgba(accent, 1);
          ctx.fillRect(sx - 2.5, sy - 2.5, 5, 5);
          ctx.font = '500 10px "Geist Mono Variable", ui-monospace, monospace';
          ctx.fillText(
            `BLR · ${site.location.coords.split(" · ")[0]}`,
            sx + 12,
            sy - 10,
          );
        }
      },
      { animate: !reduced, staticTime: 3 },
    );

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadLandDots()
          .then((data) => {
            if (disposed) return;
            dots = data;
            loop.redraw();
          })
          .catch(() => undefined);
      },
      { rootMargin: "600px" },
    );
    observer.observe(canvas);

    return () => {
      disposed = true;
      observer.disconnect();
      loop.stop();
    };
  }, [variant, reduced, mode]);

  return (
    <canvas
      ref={ref}
      className={[styles.canvas, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}
