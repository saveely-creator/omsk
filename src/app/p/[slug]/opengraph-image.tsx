import { ImageResponse } from "next/og";

import { CHAT } from "@/data/chat";
import { PEOPLE, getPerson } from "@/data/people";

export const alt = "Образец из цифрового музея чата";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PEOPLE.map((p) => ({ slug: p.slug }));
}

/**
 * Cyrillic needs a real font file: satori ships Latin only. We try to fetch one
 * at build time and degrade to the built-in font if the network is unavailable,
 * so the route never fails the build.
 */
async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/cyrillic-500-normal.ttf",
    );
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = getPerson(slug);
  const font = await loadFont();

  const hero = person?.hero ?? "OMSK IMPIRE";
  const title = person?.title ?? "Цифровой музей чата";
  const specimen = person?.dossier.spec ?? "000";
  const rows: Array<[string, string]> = person
    ? [
        ["сообщений", person.stats.messages.toLocaleString("ru-RU")],
        ["акт. дней", String(person.dossier.activeDays)],
        ["ночных", `${person.stats.nightPct} %`],
        ["реакций", person.dossier.reactionsReceived.toLocaleString("ru-RU")],
      ]
    : [["образцов", String(CHAT.totals.people)]];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        backgroundColor: "#0B1410",
        backgroundImage:
          "radial-gradient(900px 520px at 62% 34%, #1E3A2A 0%, rgba(11,20,16,0) 70%)",
        color: "#EAF3EC",
        fontFamily: font ? "Museum" : "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#8FA79A",
        }}
      >
        <span>{CHAT.name}</span>
        <span>spec. {specimen} / iso 2026</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 168,
            lineHeight: 1,
            letterSpacing: -4,
            color: "#EAF3EC",
          }}
        >
          {slug.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 14,
            alignItems: "baseline",
          }}
        >
          <span style={{ fontSize: 40, color: "#49C5B6" }}>{hero}</span>
          <span style={{ fontSize: 28, color: "#8FA79A" }}>{title}</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 48,
          borderTop: "1px solid rgba(234,243,236,0.16)",
          paddingTop: 26,
        }}
      >
        {rows.map(([label, value]) => (
          <div
            key={label}
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          >
            <span style={{ fontSize: 20, letterSpacing: 3, color: "#8FA79A" }}>
              {label}
            </span>
            <span style={{ fontSize: 40 }}>{value}</span>
          </div>
        ))}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <span style={{ fontSize: 20, letterSpacing: 3, color: "#4ADE80" }}>
            drag to rotate
          </span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: font
        ? [
            {
              name: "Museum",
              data: font,
              style: "normal" as const,
              weight: 500 as const,
            },
          ]
        : undefined,
    },
  );
}
