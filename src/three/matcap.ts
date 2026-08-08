/**
 * Procedural materials for the museum: matcap spheres and a stone normal map,
 * both painted into a 2D canvas at runtime. Nothing is fetched, so the hall
 * lights up even offline, on a cold cache or behind a blocked CDN.
 *
 * Every texture is cached by its parameters: the same clay is reused across
 * routes while the persistent canvas stays mounted.
 */

import * as THREE from "three";

const cache = new Map<string, THREE.Texture>();

/** Server-side placeholder: keeps callers free of null checks. */
function blank(): THREE.Texture {
  return new THREE.Texture();
}

function mix(hex: string, target: string, amount: number): string {
  const a = new THREE.Color(hex);
  const b = new THREE.Color(target);
  return a.lerp(b, amount).getStyle();
}

export type MatcapOptions = {
  /** Body colour of the sculpture, e.g. the clay #EAF3EC. */
  color: string;
  /** Rim light colour: the mint or lime edge that separates figure from fog. */
  rim?: string;
  /** Fake subsurface scattering, 0 to 1: warms up the shadow side. */
  sss?: number;
  /** Deepest shade, also the colour outside the sphere. */
  shadow?: string;
  size?: number;
};

/**
 * Paints a matcap: a lit sphere seen head-on. Three.js samples it by surface
 * normal, so one 256px texture carries the whole studio rig with no lights.
 */
export function makeMatcap({
  color,
  rim = "#49C5B6",
  sss = 0.26,
  shadow = "#0B1410",
  size = 256,
}: MatcapOptions): THREE.Texture {
  const id = ["m", color, rim, sss, shadow, size].join("|");
  const hit = cache.get(id);
  if (hit) return hit;
  if (typeof document === "undefined") return blank();

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return blank();

  const r = size / 2;

  /* Outside the sphere: the void. Prevents bright fringes on silhouettes. */
  ctx.fillStyle = shadow;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.clip();

  /* Ambient body: darker at the bottom, the way a studio floor eats light. */
  const body = ctx.createLinearGradient(0, 0, 0, size);
  body.addColorStop(0, mix(color, "#ffffff", 0.1));
  body.addColorStop(0.55, color);
  body.addColorStop(1, mix(color, shadow, 0.62));
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, size, size);

  /* Key light, upper left, soft and wide: matte plaster, not plastic. */
  const key = ctx.createRadialGradient(
    r * 0.66,
    r * 0.52,
    r * 0.04,
    r * 0.7,
    r * 0.6,
    r * 1.25,
  );
  key.addColorStop(0, mix(color, "#ffffff", 0.92));
  key.addColorStop(0.32, mix(color, "#ffffff", 0.34));
  key.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = key;
  ctx.fillRect(0, 0, size, size);

  /* Subsurface bounce: light creeping through the lower mass. */
  if (sss > 0) {
    const warm = ctx.createRadialGradient(
      r,
      r * 1.42,
      r * 0.05,
      r,
      r * 1.3,
      r * 0.95,
    );
    warm.addColorStop(0, mix(color, "#f6c9a8", Math.min(0.7, sss)));
    warm.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = Math.min(1, 0.35 + sss);
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, size, size);
    ctx.globalAlpha = 1;
  }

  /* Rim: a crescent hugging the edge, drawn additively. */
  const edge = ctx.createRadialGradient(r, r * 0.94, r * 0.7, r, r, r);
  edge.addColorStop(0, "rgba(0,0,0,0)");
  edge.addColorStop(0.86, "rgba(0,0,0,0)");
  edge.addColorStop(0.97, rim);
  edge.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, size, size);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";

  /* Contact shade at the very bottom keeps the figure grounded. */
  const floor = ctx.createRadialGradient(r, size, r * 0.1, r, size, r * 0.85);
  floor.addColorStop(0, mix(shadow, "#000000", 0.2));
  floor.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, size, size);
  ctx.globalAlpha = 1;

  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  cache.set(id, tex);
  return tex;
}

/** The sculptures themselves: light matte clay under a mint rim. */
export function clayMatcap(): THREE.Texture {
  return makeMatcap({ color: "#EAF3EC", rim: "#49C5B6", sss: 0.3 });
}

/** The plinth: cold grey stone, almost no bounce. */
export function stoneMatcap(): THREE.Texture {
  return makeMatcap({
    color: "#3A4A42",
    rim: "#8FA79A",
    sss: 0.05,
    shadow: "#080F0C",
  });
}

/** Wardrobe items: same lighting, arbitrary swatch colour. */
export function itemMatcap(color: string): THREE.Texture {
  return makeMatcap({ color, rim: "#4ADE80", sss: 0.18 });
}

/* --------------------------------------------------------------- stone bump */

function hash2(x: number, y: number, seed: number): number {
  let h = x * 374761393 + y * 668265263 + seed * 69069;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const tx = smooth(x - xi);
  const ty = smooth(y - yi);
  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);
  return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
}

/**
 * Fractal noise turned into a tangent-space normal map for the plinth, so the
 * stone catches the key light with real grain instead of looking like plastic.
 */
export function makeStoneNormalMap(size = 256): THREE.Texture {
  const id = ["n", size].join("|");
  const hit = cache.get(id);
  if (hit) return hit;
  if (typeof document === "undefined") return blank();

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return blank();

  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0;
      let amp = 0.5;
      let freq = 8;
      for (let o = 0; o < 4; o++) {
        v += valueNoise((x / size) * freq, (y / size) * freq, o + 1) * amp;
        amp *= 0.5;
        freq *= 2;
      }
      height[y * size + x] = v;
    }
  }

  const img = ctx.createImageData(size, size);
  const at = (x: number, y: number) =>
    height[((y + size) % size) * size + ((x + size) % size)];
  const strength = 2.6;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x - 1, y) - at(x + 1, y)) * strength;
      const dy = (at(x, y - 1) - at(x, y + 1)) * strength;
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const i = (y * size + x) * 4;
      img.data[i] = ((dx / len) * 0.5 + 0.5) * 255;
      img.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      img.data[i + 2] = (1 / len) * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  cache.set(id, tex);
  return tex;
}

/** Frees every generated texture. Called when the canvas is torn down. */
export function disposeGeneratedTextures(): void {
  cache.forEach((tex) => tex.dispose());
  cache.clear();
}
