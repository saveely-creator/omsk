"use client";

/**
 * Mounts the museum canvas in the browser only. The scene never renders on the
 * server, so a WebGL quirk cannot break hydration of the whole layout, and any
 * failure inside stays caught by the boundary instead of blanking the site.
 */

import dynamic from "next/dynamic";

import { CanvasBoundary } from "./CanvasBoundary";

const PersistentCanvas = dynamic(() => import("./PersistentCanvas"), {
  ssr: false,
  loading: () => null,
});

export function CanvasMount() {
  return (
    <CanvasBoundary>
      <PersistentCanvas />
    </CanvasBoundary>
  );
}

export default CanvasMount;
