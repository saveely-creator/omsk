"use client";

/**
 * Catches failures in the root layout itself, which route-level error.tsx
 * cannot reach. This is the difference between a blank page with a generic
 * notice and a readable reason, so it carries its own styles.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0B1410",
          color: "#EAF3EC",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          display: "flex",
          alignItems: "center",
          padding: "6vh 7vw",
        }}
      >
        <main style={{ maxWidth: "78ch" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8FA79A",
            }}
          >
            spec. err / зал закрыт / iso 2026
          </p>
          <h1
            style={{
              margin: "0.6rem 0 1.1rem",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              fontSize: "clamp(2rem, 7vw, 4.6rem)",
              lineHeight: 1.02,
            }}
          >
            музей не открылся
          </h1>
          <p style={{ color: "#8FA79A", lineHeight: 1.6, maxWidth: "52ch" }}>
            Страница упала в браузере. Ниже точная причина, её достаточно
            скопировать целиком и переслать разработчику.
          </p>
          <pre
            style={{
              marginTop: "1.5rem",
              padding: "1rem 1.1rem",
              border: "1px solid rgba(234, 243, 236, 0.16)",
              borderRadius: 4,
              background: "rgba(22, 50, 31, 0.35)",
              fontSize: "0.8rem",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {error.name + ": " + (error.message || "unknown error")}
            {error.digest ? "\ndigest: " + error.digest : ""}
            {error.stack
              ? "\n\n" + error.stack.split("\n").slice(0, 6).join("\n")
              : ""}
          </pre>
          <div style={{ display: "flex", gap: "0.7rem", marginTop: "1.6rem" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "0.7rem 1.2rem",
                border: "1px solid #2F6B4A",
                borderRadius: 999,
                background: "transparent",
                color: "#4ADE80",
                font: "inherit",
                cursor: "pointer",
              }}
            >
              попробовать снова
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
