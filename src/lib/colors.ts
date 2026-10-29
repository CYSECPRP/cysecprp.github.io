export type RGB = readonly [number, number, number];

function parseHex(value: string, fallback: RGB): RGB {
  const hex = value.trim().replace("#", "");
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return [
      parseInt(hex[0] + hex[0], 16),
      parseInt(hex[1] + hex[1], 16),
      parseInt(hex[2] + hex[2], 16),
    ];
  }
  return fallback;
}

/** Reads the live theme colors, so canvases follow the red-team mode switch. */
export function readPalette() {
  const style = getComputedStyle(document.documentElement);
  return {
    ink: parseHex(style.getPropertyValue("--ink"), [5, 5, 5]),
    paper: parseHex(style.getPropertyValue("--paper"), [242, 242, 238]),
    accent: parseHex(style.getPropertyValue("--accent"), [61, 255, 143]),
  };
}

export const rgba = ([r, g, b]: RGB, alpha: number) =>
  `rgba(${r}, ${g}, ${b}, ${alpha})`;
