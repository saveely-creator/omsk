"use client";

/**
 * Canvas -> framed PNG with a lab specimen label.
 * The renderer draws without `preserveDrawingBuffer` (that flag together with
 * the effect composer smears frames on top of each other), so a capture asks
 * the live renderer for one fresh frame through the `museum:capture` bridge.
 */

export type StampOptions = {
  /** big serif line, e.g. SHADOW */
  title: string;
  /** small uppercase line under the title */
  subtitle?: string;
  /** mono code in the top-left, e.g. SPEC. 001 */
  code?: string;
  /** mono line in the bottom-right, e.g. OMSK IMPIRE / ISO 2026 */
  footer?: string;
  filename?: string;
  /** 1 = source size, 2 = retina export */
  scale?: number;
  /** crop to a 4:5 portrait plate instead of the raw viewport ratio */
  portrait?: boolean;
};

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

function fontStack(varName: string, fallback: string): string {
  const v = cssVar(varName, "");
  return v ? `${v}, ${fallback}` : fallback;
}

export function composeStamped(
  source: HTMLCanvasElement,
  opts: StampOptions,
): HTMLCanvasElement {
  const scale = opts.scale ?? 2;
  const srcW = source.width;
  const srcH = source.height;

  // Target plate
  const ratio = opts.portrait ? 4 / 5 : srcW / srcH;
  const outW = Math.round(1200 * scale);
  const outH = Math.round((1200 / ratio) * scale);

  const out = document.createElement("canvas");
  out.width = outW;
  out.height = outH;
  const ctx = out.getContext("2d");
  if (!ctx) return out;

  const bgDeep = cssVar("--bg-deep", "#0B1410");
  const clay = cssVar("--clay", "#EAF3EC");
  const muted = cssVar("--muted", "#8FA79A");
  const accent = cssVar("--accent", "#4ADE80");
  const display = fontStack("--font-display", "Georgia, serif");
  const mono = fontStack("--font-mono", "ui-monospace, monospace");
  const ui = fontStack("--font-ui", "system-ui, sans-serif");

  ctx.fillStyle = bgDeep;
  ctx.fillRect(0, 0, outW, outH);

  // cover-fit the render into the plate
  const s = Math.max(outW / srcW, outH / srcH);
  const dw = srcW * s;
  const dh = srcH * s;
  ctx.drawImage(source, (outW - dw) / 2, (outH - dh) / 2, dw, dh);

  // bottom fog so the label always sits on a readable base
  const grad = ctx.createLinearGradient(0, outH * 0.55, 0, outH);
  grad.addColorStop(0, "rgba(11,20,16,0)");
  grad.addColorStop(1, "rgba(11,20,16,0.92)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, outH * 0.55, outW, outH * 0.45);

  // hairline frame, open corners (the /together "vitrine" motif)
  const pad = Math.round(28 * scale);
  const corner = Math.round(54 * scale);
  ctx.strokeStyle = "rgba(234,243,236,0.22)";
  ctx.lineWidth = Math.max(1, Math.round(scale));
  ctx.beginPath();
  // top
  ctx.moveTo(pad + corner, pad);
  ctx.lineTo(outW - pad - corner, pad);
  // right
  ctx.moveTo(outW - pad, pad + corner);
  ctx.lineTo(outW - pad, outH - pad - corner);
  // bottom
  ctx.moveTo(outW - pad - corner, outH - pad);
  ctx.lineTo(pad + corner, outH - pad);
  // left
  ctx.moveTo(pad, outH - pad - corner);
  ctx.lineTo(pad, pad + corner);
  ctx.stroke();

  // code, top-left
  if (opts.code) {
    ctx.fillStyle = muted;
    ctx.font = `${Math.round(11 * scale)}px ${mono}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.save();
    ctx.letterSpacing = `${0.22 * 11 * scale}px`;
    ctx.fillText(
      opts.code.toUpperCase(),
      pad + Math.round(14 * scale),
      pad + Math.round(14 * scale),
    );
    ctx.restore();
  }

  // title, bottom-left
  const baseY = outH - pad - Math.round(30 * scale);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = clay;
  const titleSize = Math.round(64 * scale);
  ctx.font = `400 ${titleSize}px ${display}`;
  ctx.fillText(opts.title, pad + Math.round(14 * scale), baseY);

  if (opts.subtitle) {
    ctx.fillStyle = muted;
    ctx.font = `500 ${Math.round(12 * scale)}px ${ui}`;
    ctx.save();
    ctx.letterSpacing = `${0.18 * 12 * scale}px`;
    ctx.fillText(
      opts.subtitle.toUpperCase(),
      pad + Math.round(16 * scale),
      baseY + Math.round(26 * scale),
    );
    ctx.restore();
  }

  if (opts.footer) {
    ctx.fillStyle = accent;
    ctx.font = `${Math.round(11 * scale)}px ${mono}`;
    ctx.textAlign = "right";
    ctx.save();
    ctx.letterSpacing = `${0.22 * 11 * scale}px`;
    ctx.fillText(
      opts.footer.toUpperCase(),
      outW - pad - Math.round(14 * scale),
      outH - pad - Math.round(16 * scale),
    );
    ctx.restore();
  }

  // specimen tick marks under the label
  ctx.strokeStyle = "rgba(234,243,236,0.16)";
  ctx.beginPath();
  for (let i = 0; i < 24; i++) {
    const x = pad + Math.round(16 * scale) + i * Math.round(9 * scale);
    const h = i % 5 === 0 ? 10 : 5;
    ctx.moveTo(x, baseY + Math.round(40 * scale));
    ctx.lineTo(x, baseY + Math.round((40 + h) * scale));
  }
  ctx.stroke();

  return out;
}

export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
) {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png"),
  );
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // give Safari a tick before revoking
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function exportStampedPng(
  source: HTMLCanvasElement | null,
  opts: StampOptions,
) {
  if (!source) return;
  const plate = composeStamped(source, opts);
  await downloadCanvas(plate, opts.filename ?? "omsk-impire.png");
}

/** Finds the live WebGL canvas of the persistent renderer. */
export function findSceneCanvas(): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;

  /* The bridge answers synchronously, inside dispatchEvent. */
  const box: { canvas: HTMLCanvasElement | null } = { canvas: null };
  window.dispatchEvent(
    new CustomEvent("museum:capture", {
      detail: {
        resolve: (canvas: HTMLCanvasElement | null) => {
          box.canvas = canvas;
        },
      },
    }),
  );
  if (box.canvas) return box.canvas;

  /* Fallback for when 3D is switched off entirely. */
  return document.querySelector<HTMLCanvasElement>(".canvas-host canvas");
}
