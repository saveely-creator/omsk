"use client";

/**
 * Museum chrome: grain, grid, fog, custom cursor, header, footer, counters,
 * reveals, test tubes, drag carousels, achievement toast.
 *
 * Everything here is DOM-only, so it never pulls three.js into a page bundle.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { CHAT } from "@/data/chat";
import { quoteOfTheDay } from "@/data/people";
import {
  ACHIEVEMENT_PAGES,
  daysWithoutOfftop,
  sfx,
  visitedAll,
  visitedProgress,
} from "@/lib/easter";
import { useInView, useIsTouch, useMagnetic, useMotionOff } from "@/lib/hooks";
import { useUi } from "@/store/ui";

/* ============================================================== overlays */

export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

export function VhsLayer() {
  return <div className="vhs-layer" aria-hidden="true" />;
}

export function Fog() {
  return <div className="fog" aria-hidden="true" />;
}

/** Thin 1px column rules, the lab-grid backbone of every screen. */
export function GridLines({ columns = 6 }: { columns?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
      style={{ paddingLeft: "var(--margin)", paddingRight: "var(--margin)" }}
    >
      <div
        className="grid h-full"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns + 1 }).map((_, i) => (
          <div
            key={i}
            style={{
              gridColumn: i === columns ? columns : i + 1,
              justifySelf: i === columns ? "end" : "start",
              width: 1,
              height: "100%",
              background: "var(--line)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Rotated lab signature down the left rail: SPEC. 003 / SAMPLE ID / ISO 2026. */
export function Rail({ text }: { text: string }) {
  return (
    <div
      className="micro fixed left-0 top-1/2 z-20 hidden md:block"
      style={{
        transform: "translateY(-50%) rotate(-90deg)",
        transformOrigin: "left center",
        left: "calc(var(--margin) + 4px)",
        whiteSpace: "nowrap",
      }}
      aria-hidden="true"
    >
      {text}
    </div>
  );
}

/* ================================================================ cursor */

const CURSOR_LABEL: Record<string, string> = {
  drag: "drag to rotate",
  link: "",
  emoji: "",
  default: "",
  hidden: "",
};

export function Cursor() {
  const mode = useUi((s) => s.cursor);
  const touch = useIsTouch();
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (touch) return;
    document.documentElement.classList.add("cursor-none");
    return () => document.documentElement.classList.remove("cursor-none");
  }, [touch]);

  useEffect(() => {
    if (touch) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    };
    const loop = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.22;
      p.y += (p.ty - p.y) * 0.22;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [touch]);

  if (touch) return null;

  const label = CURSOR_LABEL[mode] ?? "";
  const size = mode === "drag" ? 74 : mode === "link" ? 34 : 12;

  return (
    <div ref={ref} className="cursor-dot" aria-hidden="true">
      <div
        style={{
          position: "absolute",
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          borderRadius: "999px",
          border: `1px solid ${mode === "default" ? "transparent" : "var(--clay)"}`,
          background: mode === "default" ? "var(--clay)" : "transparent",
          display: "grid",
          placeItems: "center",
          transition:
            "width 320ms var(--ease-lab), height 320ms var(--ease-lab)",
        }}
      >
        {mode === "emoji" ? (
          <span style={{ fontSize: 18, mixBlendMode: "normal" }}>
            {CHAT.topEmoji[0]?.e}
          </span>
        ) : label ? (
          <span
            className="micro"
            style={{
              color: "var(--clay)",
              fontSize: 8,
              letterSpacing: "0.1em",
              textAlign: "center",
            }}
          >
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* ================================================================ header */

const NAV = [
  { href: "/", label: "Образцы" },
  { href: "/together", label: "Общий снимок" },
  { href: "/wiki", label: "Чат.вики" },
];

export function Header() {
  const router = useRouter();
  const unlockLab = useUi((s) => s.unlockLab);
  const labUnlocked = useUi((s) => s.labUnlocked);
  const clicks = useRef(0);
  const [hint, setHint] = useState<string | null>(null);

  const onLogo = useCallback(() => {
    clicks.current += 1;
    sfx.tick();
    if (clicks.current >= 10) {
      clicks.current = 0;
      unlockLab();
      sfx.unlock();
      setHint("лаборатория открыта");
      router.push("/lab");
      setTimeout(() => setHint(null), 2600);
    } else if (clicks.current >= 6) {
      setHint(`ещё ${10 - clicks.current}`);
      setTimeout(() => setHint(null), 1200);
    }
  }, [router, unlockLab]);

  return (
    <header className="pass fixed inset-x-0 top-0 z-40">
      <div
        className="flex items-center justify-between"
        style={{ padding: "18px var(--margin)" }}
      >
        <div className="flex items-baseline gap-3">
          <button
            type="button"
            onClick={onLogo}
            className="display text-[1.05rem] leading-none tracking-tight"
            style={{ letterSpacing: "-0.01em" }}
            aria-label="OMSK IMPIRE — на главную"
          >
            OMSK IMPIRE
          </button>
          <span className="micro hidden sm:inline">музей образцов</span>
          {hint ? (
            <span className="micro" style={{ color: "var(--accent)" }}>
              {hint}
            </span>
          ) : null}
        </div>

        <nav className="flex items-center gap-5">
          {NAV.map((n) => (
            <NavLink key={n.href} href={n.href}>
              {n.label}
            </NavLink>
          ))}
          {labUnlocked ? (
            <NavLink href="/lab">
              <span style={{ color: "var(--accent)" }}>/lab</span>
            </NavLink>
          ) : null}
        </nav>
      </div>
      <div className="hairline" />
    </header>
  );
}

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const setCursor = useUi((s) => s.setCursor);
  return (
    <Link
      href={href}
      className="label ul"
      onPointerEnter={() => setCursor("link")}
      onPointerLeave={() => setCursor("default")}
      onClick={() => sfx.tick()}
    >
      {children}
    </Link>
  );
}

/* ================================================================ footer */

export function Footer() {
  const today = useMemo(() => quoteOfTheDay(), []);

  return (
    <footer
      className="above shell"
      style={{ paddingTop: 48, paddingBottom: 40 }}
    >
      <div className="hairline" style={{ marginBottom: 24 }} />
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="micro">цитата дня</div>
          <p
            className="display"
            style={{ fontSize: "1.5rem", lineHeight: 1.2, marginTop: 8 }}
          >
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

        <div className="space-y-2">
          <div className="micro">показатели зала</div>
          <div className="num label" style={{ color: "var(--clay)" }}>
            дней без оффтопа: {daysWithoutOfftop()}
          </div>
          <div className="num label" style={{ color: "var(--clay)" }}>
            образцов: {CHAT.totals.people}
          </div>
          <div className="num label" style={{ color: "var(--clay)" }}>
            сообщений: {CHAT.totals.messages.toLocaleString("ru-RU")}
          </div>
          <Achievements />
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <Toggles />
          <div className="micro">
            {CHAT.name} / ISO 2026 / {CHAT.years}
          </div>
          <div className="micro">tilde — терминал · konami — ацид</div>
        </div>
      </div>
    </footer>
  );
}

export function Toggles() {
  /* Separate primitive selectors: an object literal here would be a new
	   reference on every store read and would re-render forever. */
  const sound = useUi((s) => s.sound);
  const acid = useUi((s) => s.acid);
  const vhs = useUi((s) => s.vhs);
  const motion = useUi((s) => s.motion);
  const toggleSound = useUi((s) => s.toggleSound);
  const toggleAcid = useUi((s) => s.toggleAcid);
  const toggleVhs = useUi((s) => s.toggleVhs);
  const toggleMotion = useUi((s) => s.toggleMotion);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="chip"
        aria-pressed={sound}
        onClick={() => {
          toggleSound();
          sfx.setEnabled(!sound);
          if (!sound) sfx.hover();
        }}
      >
        звук {sound ? "вкл" : "выкл"}
      </button>
      <button
        type="button"
        className="chip"
        aria-pressed={acid}
        onClick={toggleAcid}
      >
        ацид
      </button>
      <button
        type="button"
        className="chip"
        aria-pressed={vhs}
        onClick={toggleVhs}
      >
        vhs
      </button>
      <button
        type="button"
        className="chip"
        aria-pressed={!motion}
        onClick={toggleMotion}
      >
        {motion ? "отключить анимации" : "включить анимации"}
      </button>
    </div>
  );
}

function Achievements() {
  const visited = useUi((s) => s.visited);
  const { done, total } = visitedProgress(visited);
  return (
    <div
      className="micro"
      style={{ color: visitedAll(visited) ? "var(--accent)" : undefined }}
    >
      залы пройдено: {done}/{total}
      {visitedAll(visited) ? " · ачивка «смотритель»" : ""}
    </div>
  );
}

/** Marks a route as visited and pops the achievement when all are seen. */
export function VisitTracker({ route }: { route: string }) {
  const markVisited = useUi((s) => s.markVisited);
  const visited = useUi((s) => s.visited);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (ACHIEVEMENT_PAGES.includes(route)) markVisited(route);
  }, [markVisited, route]);

  useEffect(() => {
    if (visitedAll(visited) && !shown) {
      setShown(true);
      sfx.unlock();
    }
  }, [shown, visited]);

  if (!shown) return null;
  return <Toast text="Ачивка получена: «смотритель» — все залы музея" />;
}

export function Toast({ text }: { text: string }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 5200);
    return () => clearTimeout(t);
  }, []);
  if (!open) return null;
  return (
    <div
      role="status"
      className="label"
      style={{
        position: "fixed",
        left: "var(--margin)",
        bottom: "calc(var(--margin) + 8px)",
        zIndex: 50,
        padding: "12px 16px",
        border: "1px solid var(--line-strong)",
        background: "var(--glass)",
        backdropFilter: "blur(8px)",
        color: "var(--clay)",
      }}
    >
      {text}
    </div>
  );
}

/* ============================================================== counters */

/** Count-up number, tabular so the layout never shifts. */
export function Counter({
  value,
  duration = 1400,
  suffix = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.4);
  const off = useMotionOff();
  const [shown, setShown] = useState(off ? value : 0);

  useEffect(() => {
    if (!seen || off) {
      if (off) setShown(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, off, seen, value]);

  return (
    <span ref={ref} className="num">
      {shown.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}

/** Fixed screen counter, artlife style: 01 / 06. */
export function SectionCounter({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div
      className="micro num pass"
      style={{
        position: "fixed",
        right: "var(--margin)",
        bottom: "var(--margin)",
        zIndex: 30,
        color: "var(--clay)",
      }}
      aria-hidden="true"
    >
      <span style={{ color: "var(--accent)" }}>{pad(index)}</span>
      <span style={{ opacity: 0.5 }}> / {pad(total)}</span>
    </div>
  );
}

/* =============================================================== reveals */

/** Word-by-word reveal from behind a mask. */
export function Reveal({
  text,
  className,
  delay = 0,
  step = 42,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.2);
  const off = useMotionOff();
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="reveal-line"
          style={{ display: "inline-block" }}
        >
          <span
            className="reveal-word"
            style={{
              transform: seen || off ? "translateY(0)" : "translateY(105%)",
              opacity: seen || off ? 1 : 0,
              transition: off
                ? "none"
                : `transform 900ms var(--ease-lab) ${delay + i * step}ms, opacity 700ms linear ${delay + i * step}ms`,
            }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Animated test tube for the FORMULA screen. */
export function Tube({ value, delay = 0 }: { value: number; delay?: number }) {
  const { ref, seen } = useInView<HTMLDivElement>(0.35);
  const off = useMotionOff();
  return (
    <div className="tube" ref={ref}>
      <i
        style={{
          width: seen || off ? `${value}%` : 0,
          transition: off ? "none" : `width 1200ms var(--ease-lab) ${delay}ms`,
        }}
      />
    </div>
  );
}

/* ============================================================= carousels */

/** Horizontal drag carousel with inertia and the «Тяните» hint. */
export function DragCarousel({
  children,
  hint = "Тяните",
  className,
  onFocusIndex,
}: {
  children: ReactNode;
  hint?: string;
  className?: string;
  onFocusIndex?: (index: number) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const state = useRef({
    x: 0,
    target: 0,
    min: 0,
    down: false,
    startX: 0,
    startTarget: 0,
    v: 0,
  });
  const off = useMotionOff();
  const setCursor = useUi((s) => s.setCursor);

  useEffect(() => {
    const measure = () => {
      if (!viewport.current || !track.current) return;
      state.current.min = Math.min(
        0,
        viewport.current.clientWidth - track.current.scrollWidth,
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const s = state.current;
      if (!s.down) s.target += s.v;
      s.v *= 0.92;
      s.target = Math.max(s.min, Math.min(0, s.target));
      s.x += (s.target - s.x) * (off ? 1 : 0.11);
      if (track.current) {
        track.current.style.transform = `translate3d(${s.x.toFixed(2)}px, 0, 0)`;
      }
      if (onFocusIndex && track.current && track.current.children.length) {
        const first = track.current.children[0] as HTMLElement;
        const w = first.getBoundingClientRect().width + 20;
        onFocusIndex(Math.round(-s.x / w));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [off, onFocusIndex]);

  const onDown = (e: React.PointerEvent) => {
    const s = state.current;
    s.down = true;
    s.startX = e.clientX;
    s.startTarget = s.target;
    s.v = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    track.current?.classList.add("is-dragging");
  };
  const onMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.down) return;
    const next = s.startTarget + (e.clientX - s.startX);
    s.v = (next - s.target) * 0.35;
    s.target = next;
  };
  const onUp = () => {
    state.current.down = false;
    track.current?.classList.remove("is-dragging");
  };

  const nudge = (dir: 1 | -1) => {
    const first = track.current?.children[0] as HTMLElement | undefined;
    const w = first ? first.getBoundingClientRect().width + 20 : 320;
    state.current.target = Math.max(
      state.current.min,
      Math.min(0, state.current.target - dir * w),
    );
  };

  return (
    <div className={className}>
      <div
        ref={viewport}
        style={{ overflow: "hidden" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerEnter={() => setCursor("drag")}
        onPointerLeave={() => {
          setCursor("default");
          onUp();
        }}
      >
        <div className="drag-track" ref={track}>
          {children}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <span className="micro">← {hint} →</span>
        <div className="flex gap-2">
          <button
            type="button"
            className="chip"
            onClick={() => nudge(-1)}
            aria-label="назад"
          >
            ←
          </button>
          <button
            type="button"
            className="chip"
            onClick={() => nudge(1)}
            aria-label="вперёд"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

/* =============================================================== buttons */

export function MagneticButton({
  children,
  onClick,
  className = "btn",
  title,
  pressed,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  pressed?: boolean;
}) {
  const ref = useMagnetic<HTMLButtonElement>(0.16);
  const setCursor = useUi((s) => s.setCursor);
  return (
    <button
      ref={ref}
      type="button"
      title={title}
      className={className}
      aria-pressed={pressed}
      onClick={() => {
        sfx.tick();
        onClick?.();
      }}
      onPointerEnter={() => {
        setCursor("link");
        sfx.hover();
      }}
      onPointerLeave={() => setCursor("default")}
    >
      {children}
    </button>
  );
}

/** Bottom-left scroll hint. */
export function ScrollHint({ text = "Скролльте" }: { text?: string }) {
  return (
    <div
      className="micro"
      style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
      aria-hidden="true"
    >
      <span style={{ display: "inline-block", animation: "none" }}>↓</span>{" "}
      {text}
    </div>
  );
}
