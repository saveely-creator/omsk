"use client";

/**
 * Keeps a WebGL failure local. If the scene throws (no GPU, lost context,
 * driver quirk) the museum degrades into a typographic site instead of
 * blanking the whole page.
 */

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { failed: boolean };

export class CanvasBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[museum] 3d disabled", error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default CanvasBoundary;
