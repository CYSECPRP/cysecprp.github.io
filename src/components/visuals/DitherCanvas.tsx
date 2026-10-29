import { useEffect, useRef } from "react";
import { readPalette, type RGB } from "../../lib/colors";
import { useMode } from "../../lib/flags";
import { useReducedMotion } from "../../lib/media";
import { createSpring, stepSpring } from "../../lib/spring";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./ditherShader";
import styles from "./DitherCanvas.module.css";

type Props = {
  shape: "padlock" | "servers";
  /** Size of one dither cell in CSS pixels; the canvas renders one pixel per cell. */
  cell?: number;
  interactive?: boolean;
  className?: string;
};

/** After this long without pointer movement the lock drifts back to its idle sway. */
const IDLE_AFTER_MS = 2600;

const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value));

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = vertex && fragment ? gl.createProgram() : null;
  if (!program || !vertex || !fragment) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

export default function DitherCanvas({
  shape,
  cell = 4,
  interactive = false,
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const mode = useMode();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    const program = gl ? createProgram(gl) : null;
    if (!gl || !program) {
      wrap.dataset.fallback = "true";
      return;
    }
    wrap.dataset.fallback = "false";
    wrap.style.setProperty("--cell", `${cell}px`);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const location = (name: string) => gl.getUniformLocation(program, name);
    const setColor = (name: string, [r, g, b]: RGB) =>
      gl.uniform3f(location(name), r / 255, g / 255, b / 255);
    const uRes = location("uRes");
    const uTime = location("uTime");
    const uMouse = location("uMouse");
    const uOpen = location("uOpen");
    const uRoll = location("uRoll");
    const uEngage = location("uEngage");
    const palette = readPalette();
    gl.uniform1f(location("uShape"), shape === "padlock" ? 0 : 1);
    setColor("uInk", palette.ink);
    setColor("uPaper", palette.paper);
    setColor("uAccent", palette.accent);
    gl.clearColor(0, 0, 0, 0);

    const pointer = { x: 0, y: 0, movedAt: Number.NEGATIVE_INFINITY };
    const yaw = createSpring();
    const pitch = createSpring();
    const engage = createSpring();
    const open = createSpring();
    let unlocked = false;
    let time = reduced ? 2.4 : 0;
    let last = performance.now();
    let frame = 0;
    let visible = false;

    const draw = () => {
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, yaw.value, -pitch.value);
      gl.uniform1f(uOpen, open.value);
      gl.uniform1f(uRoll, clamp(-yaw.velocity * 0.05, 0.18));
      gl.uniform1f(uEngage, Math.min(1, Math.max(0, engage.value)));
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      // Layout size rather than getBoundingClientRect: the hero parallax scales an ancestor.
      const cols = Math.max(1, Math.floor(wrap.clientWidth / cell));
      const rows = Math.max(1, Math.floor(wrap.clientHeight / cell));
      canvas.width = cols;
      canvas.height = rows;
      canvas.style.width = `${cols * cell}px`;
      canvas.style.height = `${rows * cell}px`;
      gl.viewport(0, 0, cols, rows);
      gl.uniform2f(uRes, cols, rows);
      draw();
    };

    // Critically damped springs follow the cursor; the shackle spring is softer so it pops open.
    const follow = (now: number, seconds: number) => {
      const rect = wrap.getBoundingClientRect();
      const dx = pointer.x - (rect.left + rect.width / 2);
      const dy = pointer.y - (rect.top + rect.height / 2);
      const engaged = now - pointer.movedAt < IDLE_AFTER_MS;
      const over =
        engaged &&
        Math.abs(dx) < rect.width * 0.3 &&
        Math.abs(dy) < rect.height * 0.38;
      stepSpring(engage, engaged ? 1 : 0, seconds, 12, 7);
      stepSpring(
        yaw,
        engaged ? clamp(dx / (window.innerWidth * 0.5), 1.25) : 0,
        seconds,
        26,
        10.2,
      );
      stepSpring(
        pitch,
        engaged ? clamp(dy / (window.innerHeight * 0.5), 1.25) : 0,
        seconds,
        26,
        10.2,
      );
      stepSpring(open, over ? 1 : 0, seconds, 70, 8.5);
      const opened = open.value > 0.6;
      if (opened !== unlocked) {
        unlocked = opened;
        wrap.dataset.open = String(opened);
      }
    };

    const loop = (now: number) => {
      const seconds = Math.min((now - last) / 1000, 0.1);
      last = now;
      time += seconds;
      if (interactive) follow(now, seconds);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (reduced || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.movedAt = performance.now();
    };
    const onPointerLeave = () => {
      pointer.movedAt = Number.NEGATIVE_INFINITY;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);
    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      update();
    });
    intersectionObserver.observe(wrap);
    document.addEventListener("visibilitychange", update);
    if (interactive && !reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      delete wrap.dataset.open;
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [shape, cell, interactive, reduced, mode]);

  return (
    <div
      ref={wrapRef}
      className={[styles.wrap, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      {shape === "padlock" && interactive ? (
        <span className={styles.badge}>Access granted</span>
      ) : null}
      <svg
        className={styles.fallback}
        viewBox="0 0 120 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {shape === "padlock" ? (
          <>
            <path d="M34 62V44a26 26 0 0 1 52 0v18" />
            <rect x="18" y="62" width="84" height="66" />
            <circle cx="60" cy="90" r="7" />
            <path d="M60 97v14" />
          </>
        ) : (
          <>
            <rect x="14" y="30" width="92" height="22" />
            <rect x="14" y="60" width="92" height="22" />
            <rect x="14" y="90" width="92" height="22" />
            <path d="M80 41h14M80 71h14M80 101h14" />
          </>
        )}
      </svg>
    </div>
  );
}
