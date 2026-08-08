"use client";

/** Мемная 404: выход там. */

import Link from "next/link";
import { useEffect, useMemo } from "react";

import { Footer, Rail, Reveal } from "@/components/chrome";
import { PEOPLE, quoteOfTheDay } from "@/data/people";
import { useScene } from "@/store/scene";
import { dayIndex } from "@/lib/easter";

const LINES = [
  "дачтоза",
  "выход там ↖️↙️⬆️",
  "такого образца в зале нет",
  "соболезную",
  "если не понел — страницы нет",
];

export default function NotFound() {
  const setStage = useScene((s) => s.setStage);
  const today = useMemo(() => quoteOfTheDay(), []);
  const line = useMemo(() => LINES[dayIndex() % LINES.length], []);

  useEffect(() => {
    setStage("off");
  }, [setStage]);

  return (
    <>
      <Rail text="error 404 · sample not found · iso 2026" />

      <section className="screen shell above">
        <div className="micro">ошибка каталога</div>

        <h1
          className="display"
          style={{
            fontSize: "clamp(5rem, 22vw, 18rem)",
            lineHeight: 0.82,
            marginTop: 12,
          }}
        >
          404
        </h1>

        <p
          className="display"
          style={{
            fontSize: "clamp(1.5rem,4vw,3rem)",
            marginTop: 8,
            color: "var(--accent-2)",
          }}
        >
          <Reveal text={line} />
        </p>

        <p style={{ marginTop: 20, maxWidth: "44ch", color: "var(--muted)" }}>
          Витрина пустая. В зале ровно {PEOPLE.length} образцов, и этого среди
          них нет. Может, его вынесли на реставрацию.
        </p>

        <div
          style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <Link href="/" className="btn">
            ← в зал
          </Link>
          <Link href="/together" className="btn">
            общий снимок
          </Link>
          <Link href="/wiki" className="btn">
            чат.вики
          </Link>
        </div>

        <div
          style={{
            marginTop: 40,
            paddingTop: 18,
            borderTop: "1px solid var(--line)",
            maxWidth: 520,
          }}
        >
          <div className="micro">цитата дня вместо извинений</div>
          <p className="display" style={{ fontSize: "1.5rem", marginTop: 8 }}>
            «{today.quote}»
          </p>
          <Link
            href={`/p/${today.person.slug}`}
            className="label ul"
            style={{ marginTop: 8, display: "inline-block" }}
          >
            {today.person.hero}
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
