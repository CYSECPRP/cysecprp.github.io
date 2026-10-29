import type { GeometryCollection, Topology } from "topojson-specification";
import landUrl from "world-atlas/land-110m.json?url";

let cache: Promise<Float32Array> | null = null;

/** Evenly spread unit-sphere points (x, y, z triplets) that fall on land, built once and cached. */
export function loadLandDots(count = 12000) {
  cache ??= buildLandDots(count);
  return cache;
}

async function buildLandDots(count: number) {
  const [{ geoEquirectangular, geoPath }, { feature }, response] =
    await Promise.all([
      import("d3-geo"),
      import("topojson-client"),
      fetch(landUrl),
    ]);
  const topology = (await response.json()) as Topology<{
    land: GeometryCollection;
  }>;
  const land = feature(topology, topology.objects.land);

  // Rasterize the land polygons once, then sample the mask instead of testing every point against polygons.
  const width = 720;
  const height = 360;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return new Float32Array();
  const projection = geoEquirectangular()
    .scale(width / (2 * Math.PI))
    .translate([width / 2, height / 2]);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  geoPath(projection, ctx)(land);
  ctx.fill();
  const mask = ctx.getImageData(0, 0, width, height).data;

  const points: number[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const lat = Math.asin(y);
    const lon = Math.atan2(z, x);
    const px = Math.min(
      width - 1,
      Math.floor(((lon + Math.PI) / (2 * Math.PI)) * width),
    );
    const py = Math.min(
      height - 1,
      Math.floor(((Math.PI / 2 - lat) / Math.PI) * height),
    );
    if (mask[(py * width + px) * 4 + 3] > 127) points.push(x, y, z);
  }
  return new Float32Array(points);
}
