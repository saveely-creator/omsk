"use client";

/**
 * Route-level error screen. Without it Next.js shows a blank page with the
 * generic "Application error" text, which hides the real reason. Here the
 * message is printed as-is, so a broken sample can be reported verbatim.
 */

import { useEffect } from "react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[museum] route error", error);
  }, [error]);

  return (
    <main
      className="shell"
      style={{ paddingTop: "18vh", paddingBottom: "12vh" }}
    >
      <p className="micro">spec. err / sample damaged / iso 2026</p>
      <h1 className="display" style={{ fontSize: "clamp(2.4rem, 9vw, 7rem)" }}>
        образец повреждён
      </h1>
      <p className="label" style={{ marginTop: "1.4rem", maxWidth: "46ch" }}>
        Витрина не собралась. Ниже техническая причина, её можно переслать
        разработчику как есть.
      </p>
      <pre
        style={{
          marginTop: "1.6rem",
          padding: "1rem 1.2rem",
          maxWidth: "70ch",
          overflowX: "auto",
          border: "1px solid rgba(234, 243, 236, 0.14)",
          borderRadius: 4,
          background: "rgba(11, 20, 16, 0.6)",
          fontSize: "0.82rem",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        {error.message || "unknown error"}
        {error.digest ? "\ndigest: " + error.digest : ""}
      </pre>
      <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.8rem" }}>
        <button type="button" className="btn" onClick={reset}>
          попробовать снова
        </button>
        <a className="btn" href="/">
          в холл
        </a>
      </div>
    </main>
  );
}
