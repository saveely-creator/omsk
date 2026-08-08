"use client";

/**
 * PNG capture bridge.
 *
 * The canvas deliberately runs without `preserveDrawingBuffer`: that flag plus
 * a transparent clear colour and the effect composer makes frames pile up on
 * top of each other instead of being cleared. Without the flag the WebGL
 * buffer is already gone by the time a click handler asks for a picture, so
 * this bridge listens for `museum:capture`, draws one fresh frame and copies it
 * into a 2D canvas synchronously, while the buffer is still intact.
 */

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

type CaptureDetail = {
  resolve?: (canvas: HTMLCanvasElement | null) => void;
};

export function CaptureBridge() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    const onCapture = (event: Event) => {
      const resolve = (event as CustomEvent<CaptureDetail>).detail?.resolve;
      if (!resolve) return;

      try {
        gl.render(scene, camera);
        const source = gl.domElement;
        const copy = document.createElement("canvas");
        copy.width = source.width;
        copy.height = source.height;
        const ctx = copy.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(source, 0, 0);
        resolve(copy);
      } catch {
        resolve(null);
      }
    };

    window.addEventListener("museum:capture", onCapture as EventListener);
    return () =>
      window.removeEventListener("museum:capture", onCapture as EventListener);
  }, [gl, scene, camera]);

  return null;
}

export default CaptureBridge;
