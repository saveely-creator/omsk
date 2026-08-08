/**
 * Procedural matcaps and a procedural stone normal map.
 *
 * The museum has to run with an empty /public folder, so every texture the
 * sculptures need is painted on a 2D canvas at runtime and cached. A matcap
 * encodes the whole lighting model into one sphere image, which is why the
 * clay figures keep their soft studio look even on mobile where we drop most
 * of the postprocessing.
 *
 * All builders return `null` during SSR (no document) and the callers fall
 * back to MeshStandardMaterial, so nothing throws on the server.
 */

import * as THREE from "three";

type Rgb = { r: number; g: number; b: number };

const cache = new Map<string, THREE.Texture>();

function hasDom(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof document.createElement === "function"
  );
}

function hex2rgb(hex: string): Rgb {
  const s = hex.replace("#", "").trim();
  const full =
    s.length === 3
      ? s[0] + s[0] + s[1] + s[1] + s[2] + s[2]
      : s.length >= 6
        ? s.slice(0, 6)
        : "eaf3ec";
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgba({ r, g, b }: Rgb, a: number): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function shade(c: Rgb, amount: number): Rgb {
  const target: Rgb =
    amount > 0 ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };
  return mix(c, target, Math.abs(amount));
}

function makeCanvas(size: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

function finish(canvas: HTMLCanvasElement, key: string): THREE.Texture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.name = key;
  cache.set(key, texture);
  return texture;
}

export type MatcapOptions = {
  /** Base albedo of the material, e.g. the clay #EAF3EC or a garment swatch. */
  color: string;
  /** Rim colour pushed in from the back-left, taken from the active env rig. */
  rim?: string;
  /** Fake subsurface amount: warms up the terminator like thin plaster does. */
  sss?: number;
  /** Colour of the shadow side; keeps everything inside the green palette. */
  shadow?: string;
  /** Texture resolution. 256 is plenty for a matte surface. */
  size?: number;
};

/**
 * Paints one matcap sphere: key light from the upper front, a mint rim behind,
 * a soft bounce from the floor and a subtle specular sheen.
 */
export function makeMatcap({
  color,
  rim = "#49C5B6",
  sss = 0.34,
  shadow = "#16241D",
  size = 256,
}: MatcapOptions): THREE.Texture | null {
  if (!hasDom()) return null;

  const key = `matcap|${color}|${rim}|${sss}|${shadow}|${size}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const base = hex2rgb(color);
  const rimRgb = hex2rgb(rim);
  const shadowRgb = hex2rgb(shadow);
  const warm = mix(base, { r: 255, g: 214, b: 188 }, Math.min(0.6, sss));
  const r = size / 2;

  // the sphere sits on a transparent square; three.js samples the disc only
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.clip();

  // 1. ambient body: dark at the bottom-right, lifted at the top
  const body = ctx.createLinearGradient(0, 0, 0, size);
  body.addColorStop(0, rgba(shade(base, 0.06), 1));
  body.addColorStop(0.55, rgba(mix(base, shadowRgb, 0.35), 1));
  body.addColorStop(1, rgba(mix(base, shadowRgb, 0.72), 1));
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, size, size);

  // 2. key light, upper front left
  const key1 = ctx.createRadialGradient(
    size * 0.36,
    size * 0.28,
    size * 0.02,
    size * 0.36,
    size * 0.28,
    size * 0.78,
  );
  key1.addColorStop(0, rgba(shade(base, 0.42), 1));
  key1.addColorStop(0.42, rgba(shade(base, 0.1), 0.75));
  key1.addColorStop(1, rgba(base, 0));
  ctx.fillStyle = key1;
  ctx.fillRect(0, 0, size, size);

  // 3. subsurface warmth around the terminator
  if (sss > 0) {
    const sub = ctx.createRadialGradient(
      size * 0.58,
      size * 0.62,
      size * 0.05,
      size * 0.58,
      size * 0.62,
      size * 0.55,
    );
    sub.addColorStop(0, rgba(warm, Math.min(0.5, sss)));
    sub.addColorStop(1, rgba(warm, 0));
    ctx.fillStyle = sub;
    ctx.fillRect(0, 0, size, size);
  }

  // 4. mint rim from behind, hugging the silhouette
  const rimGrad = ctx.createRadialGradient(r, r, size * 0.34, r, r, r);
  rimGrad.addColorStop(0, rgba(rimRgb, 0));
  rimGrad.addColorStop(0.82, rgba(rimRgb, 0.16));
  rimGrad.addColorStop(1, rgba(rimRgb, 0.62));
  ctx.fillStyle = rimGrad;
  ctx.fillRect(0, 0, size, size);

  // 5. floor bounce, cool and weak
  const bounce = ctx.createRadialGradient(
    size * 0.5,
    size * 0.94,
    size * 0.02,
    size * 0.5,
    size * 0.94,
    size * 0.46,
  );
  bounce.addColorStop(0, rgba(mix(base, rimRgb, 0.4), 0.22));
  bounce.addColorStop(1, rgba(base, 0));
  ctx.fillStyle = bounce;
  ctx.fillRect(0, 0, size, size);

  // 6. tiny matte sheen so the plaster does not read as flat paper
  const sheen = ctx.createRadialGradient(
    size * 0.34,
    size * 0.22,
    size * 0.005,
    size * 0.34,
    size * 0.22,
    size * 0.2,
  );
  sheen.addColorStop(0, "rgba(255,255,255,0.3)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, size, size);

  ctx.restore();
  return finish(canvas, key);
}

/** The sculptures themselves: off-white plaster. */
export function clayMatcap(
  clay = "#EAF3EC",
  rim = "#49C5B6",
): THREE.Texture | null {
  return makeMatcap({ color: clay, rim, sss: 0.4, shadow: "#16241D" });
}

/** Dark plinth stone, almost no subsurface. */
export function stoneMatcap(rim = "#2F6B4A"): THREE.Texture | null {
  return makeMatcap({
    color: "#131F19",
    rim,
    sss: 0.05,
    shadow: "#070C0A",
    size: 128,
  });
}

/** Garments and props: a touch flatter than skin so silhouettes stay readable. */
export function itemMatcap(
  color: string,
  rim = "#49C5B6",
): THREE.Texture | null {
  return makeMatcap({ color, rim, sss: 0.18, shadow: "#101A15", size: 128 });
}

/**
 * Value-noise normal map for the plinth. Two octaves are enough for the pitted
 * basalt look at the distance the camera ever gets.
 */
export function makeStoneNormalMap(size = 256): THREE.Texture | null {
  if (!hasDom()) return null;

  const key = `stone-normal|${size}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grid = 32;
  const rand: number[] = new Array(grid * grid);
  let seed = 1337;
  for (let i = 0; i < rand.length; i++) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    rand[i] = seed / 4294967296;
  }

  const at = (x: number, y: number) => rand[(y % grid) * grid + (x % grid)];
  const smooth = (t: number) => t * t * (3 - 2 * t);

  const value = (u: number, v: number, freq: number) => {
    const x = u * freq;
    const y = v * freq;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = smooth(x - x0);
    const fy = smooth(y - y0);
    const a = at(x0, y0);
    const b = at(x0 + 1, y0);
    const c = at(x0, y0 + 1);
    const d = at(x0 + 1, y0 + 1);
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
  };

  const height = (u: number, v: number) =>
    value(u, v, 10) * 0.65 + value(u, v, 26) * 0.35;

  const image = ctx.createImageData(size, size);
  const step = 1 / size;
  const strength = 2.4;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const dx = (height(u + step, v) - height(u - step, v)) * strength;
      const dy = (height(u, v + step) - height(u, v - step)) * strength;
      const len = Math.hypot(-dx, -dy, 1);
      const i = (y * size + x) * 4;
      image.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      image.data[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      image.data[i + 2] = (1 / len) * 0.5 * 255 + 127.5;
      image.data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;
  texture.name = key;
  cache.set(key, texture);
  return texture;
}

/** Frees every generated texture. Called when the persistent canvas unmounts. */
export function disposeGeneratedTextures(): void {
  cache.forEach((texture) => texture.dispose());
  cache.clear();
}
