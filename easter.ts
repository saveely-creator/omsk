/**
 * Easter eggs, the `~` terminal, the lab-analysis generator and the tiny
 * WebAudio kit. No audio files ship with the museum: every sound is
 * synthesised, so /public stays empty and nothing 404s.
 */
import { useEffect, useRef } from "react";

import { PEOPLE, type Person, getPerson } from "@/data/people";
import { CHAT } from "@/data/chat";

/* ------------------------------------------------------------------ random */

/** Deterministic PRNG so server HTML and client hydration agree. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function dayIndex(date = new Date()): number {
  return Math.floor(date.getTime() / 86400000);
}

/* ------------------------------------------------------------------ konami */

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Konami code -> acid-green mode. */
export function useKonami(onUnlock: () => void) {
  const pos = useRef(0);
  const cb = useRef(onUnlock);
  cb.current = onUnlock;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const want = KONAMI[pos.current];
      if (key === want) {
        pos.current += 1;
        if (pos.current === KONAMI.length) {
          pos.current = 0;
          cb.current();
        }
      } else {
        pos.current = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/* ------------------------------------------------------- console ascii egg */

let consolePrinted = false;

export function consoleArt() {
  if (consolePrinted || typeof window === "undefined") return;
  consolePrinted = true;
  const art = [
    "",
    "  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
    "  \u2502  O M S K   I M P I R E  \u00b7  \u041c\u0423\u0417\u0415\u0419        \u2502",
    "  \u2502  \u043e\u0431\u0440\u0430\u0437\u0446\u043e\u0432: " +
      String(PEOPLE.length).padEnd(4) +
      " \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439: " +
      String(CHAT.totals.messages).padEnd(9) +
      "\u2502",
    "  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
    "",
    "  \u0442\u044b \u0447\u0438\u0442\u0430\u0435\u0448\u044c \u043a\u043e\u043d\u0441\u043e\u043b\u044c \u2014 \u0437\u043d\u0430\u0447\u0438\u0442, \u0442\u044b \u0442\u043e\u0442, \u043a\u0442\u043e \u0447\u0438\u0442\u0430\u043b.",
    "  \u043d\u0430\u0436\u043c\u0438 ~ \u2014 \u043e\u0442\u043a\u0440\u043e\u0435\u0442\u0441\u044f \u0442\u0435\u0440\u043c\u0438\u043d\u0430\u043b. \u043a\u043e\u043c\u0430\u043d\u0434\u0430: /help",
    "",
  ];
  // eslint-disable-next-line no-console
  console.log(
    "%c" + art.join("\n"),
    "color:#4ADE80;font-family:ui-monospace,monospace;line-height:1.35",
  );
}

/* ------------------------------------------------------------- lab analysis */

const SUBSTANCES = [
  "\u043a\u0438\u0432\u0438\u0430\u0442 \u043a\u0430\u043b\u0438\u044f",
  "\u0441\u0430\u0440\u043a\u0430\u0437\u043c\u0438\u043d",
  "\u043c\u0435\u043c\u043e\u0433\u043b\u043e\u0431\u0438\u043d",
  "\u043e\u0444\u0444\u0442\u043e\u043f\u043e\u0432\u0430\u044f \u043a\u0438\u0441\u043b\u043e\u0442\u0430",
  "\u0446\u044b\u043f\u0430\u043b\u0430\u0442\u0430\u0437\u0430",
  "\u0431\u0443\u0440\u043c\u0430\u043b\u044c\u0434\u0435\u0433\u0438\u0434",
  "\u043d\u043e\u0447\u043d\u043e\u0439 \u043c\u0435\u043b\u0430\u0442\u043e\u043d\u0438\u043d (\u0441\u043b\u0435\u0434\u044b)",
  "\u043a\u0430\u043f\u0441-\u0444\u0435\u0440\u043c\u0435\u043d\u0442",
  "\u0441\u0442\u0438\u043a\u0435\u0440\u043d\u0430\u044f \u0441\u043c\u043e\u043b\u0430",
];

const METHODS = [
  "\u0441\u0443\u0445\u043e\u0435 \u043e\u0437\u043e\u043b\u0435\u043d\u0438\u0435 \u0447\u0430\u0442\u0430",
  "\u0446\u0435\u043d\u0442\u0440\u0438\u0444\u0443\u0433\u0430 \u043e\u0442\u0432\u0435\u0442\u043e\u0432",
  "\u0442\u043e\u043d\u043a\u043e\u0441\u043b\u043e\u0439\u043d\u0430\u044f \u0445\u0440\u043e\u043c\u0430\u0442\u043e\u0433\u0440\u0430\u0444\u0438\u044f \u043c\u0435\u043c\u043e\u0432",
  "\u0441\u043f\u0435\u043a\u0442\u0440\u043e\u0441\u043a\u043e\u043f\u0438\u044f \u043a\u0430\u043f\u0441\u0430",
  "\u0442\u0438\u0442\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043a\u0438\u0432\u0438",
];

const VERDICTS = [
  "\u0433\u043e\u0434\u0435\u043d \u043a \u0432\u044b\u0441\u0442\u0430\u0432\u043a\u0435",
  "\u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043d\u043e\u0447\u043d\u043e\u0433\u043e \u043d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u044f",
  "\u0441\u0442\u0430\u0431\u0438\u043b\u0435\u043d \u0434\u043e 03:00",
  "\u0440\u0435\u0430\u0433\u0438\u0440\u0443\u0435\u0442 \u043d\u0430 \u043a\u0438\u0432\u0438",
  "\u0431\u0435\u0437 \u043e\u0441\u0430\u0434\u043a\u0430",
];

export type LabReport = {
  code: string;
  method: string;
  rows: { label: string; value: string }[];
  verdict: string;
};

/** Pseudo-scientific nonsense, stable for a given person + seed. */
export function labAnalysis(person: Person, seed = 0): LabReport {
  const rnd = mulberry32(hashString(person.slug) + Math.floor(seed));
  const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
  const pct = (min: number, max: number) =>
    (min + rnd() * (max - min)).toFixed(1) + " %";

  const used = new Set<string>();
  const rows: { label: string; value: string }[] = [];
  while (rows.length < 4) {
    const s = pick(SUBSTANCES);
    if (used.has(s)) continue;
    used.add(s);
    rows.push({ label: s, value: pct(0.4, 96) });
  }
  rows.push({
    label:
      "\u043f\u043b\u043e\u0442\u043d\u043e\u0441\u0442\u044c \u0440\u0435\u0447\u0438",
    value:
      person.stats.avgLen.toFixed(1) +
      " \u0437\u043d/\u0441\u043e\u043e\u0431\u0449.",
  });
  rows.push({
    label:
      "\u043d\u043e\u0447\u043d\u0430\u044f \u0444\u0440\u0430\u043a\u0446\u0438\u044f",
    value: person.stats.nightPct.toFixed(1) + " %",
  });

  return {
    code:
      "\u0410\u041d." +
      person.dossier.spec +
      "-" +
      String(Math.floor(rnd() * 9000) + 1000),
    method: pick(METHODS),
    rows,
    verdict: pick(VERDICTS),
  };
}

/* -------------------------------------------------------------- footer eggs */

/** The counter that will never move. */
export function daysWithoutOfftop(): number {
  return 0;
}

export function quoteOfTheDayLine(date = new Date()): string {
  const d = dayIndex(date);
  const person = PEOPLE[d % PEOPLE.length];
  const quote = person.quotes[d % person.quotes.length];
  return "\u00ab" + quote + "\u00bb \u2014 " + person.hero;
}

/* ------------------------------------------------------------------ sounds */

let ctx: AudioContext | null = null;

let soundOn = false;

/**
 * Mirrors the UI sound toggle. Every blip goes through `tone`, so gating this
 * single flag mutes the whole museum without touching call sites.
 */
export function setSoundEnabled(on: boolean): void {
  soundOn = on;
  if (!on && ctx && ctx.state === "running") void ctx.suspend();
}

export function soundEnabled(): boolean {
  return soundOn;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type ToneOptions = {
  freq?: number;
  dur?: number;
  gain?: number;
  type?: OscillatorType;
  sweep?: number;
};

/** One short sine blip. Everything else is built from these. */
export function tone(opts: ToneOptions = {}) {
  if (!soundOn) return;
  const ac = audio();
  if (!ac) return;
  const { freq = 440, dur = 0.12, gain = 0.05, type = "sine", sweep } = opts;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime);
  if (sweep) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(40, sweep),
      ac.currentTime + dur,
    );
  }
  amp.gain.setValueAtTime(0.0001, ac.currentTime);
  amp.gain.exponentialRampToValueAtTime(gain, ac.currentTime + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  osc.connect(amp).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + dur + 0.02);
}

export const sfx = {
  /** Mirror of setSoundEnabled, so UI toggles can stay on one object. */
  setEnabled: (on: boolean) => setSoundEnabled(on),
  enabled: () => soundEnabled(),
  tick: () => tone({ freq: 1180, dur: 0.05, gain: 0.025, type: "triangle" }),
  hover: () => tone({ freq: 720, dur: 0.06, gain: 0.02, type: "sine" }),
  curtain: () => tone({ freq: 260, sweep: 130, dur: 0.5, gain: 0.035 }),
  unlock: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      window.setTimeout(
        () => tone({ freq: f, dur: 0.16, gain: 0.04, type: "triangle" }),
        i * 90,
      ),
    );
  },
  /** "\u0440\u0430\u0437\u0431\u0443\u0434\u0438\u0442\u044c \u0447\u0430\u0442" */
  wake: () => {
    tone({ freq: 92, sweep: 420, dur: 0.42, gain: 0.06, type: "sawtooth" });
    window.setTimeout(
      () => tone({ freq: 1320, sweep: 300, dur: 0.3, gain: 0.03 }),
      120,
    );
  },
  shutter: () => {
    tone({ freq: 1600, dur: 0.04, gain: 0.05, type: "square" });
    window.setTimeout(
      () => tone({ freq: 900, dur: 0.06, gain: 0.03, type: "square" }),
      55,
    );
  },
};

/* ---------------------------------------------------------------- terminal */

export type TerminalCtx = {
  go: (href: string) => void;
  acid: (on?: boolean) => void;
  vhs: (on?: boolean) => void;
  wake: () => void;
  unlockLab: () => void;
  close: () => void;
  clear: () => void;
};

const HELP = [
  "/help          \u2014 \u044d\u0442\u043e\u0442 \u0441\u043f\u0438\u0441\u043e\u043a",
  "/who           \u2014 \u0432\u0441\u0435 \u043e\u0431\u0440\u0430\u0437\u0446\u044b \u0437\u0430\u043b\u0430",
  "/who <slug>    \u2014 \u0434\u043e\u0441\u044c\u0435 \u043e\u0431\u0440\u0430\u0437\u0446\u0430",
  "/quote <slug>  \u2014 \u0446\u0438\u0442\u0430\u0442\u0430 \u0447\u0435\u043b\u043e\u0432\u0435\u043a\u0430",
  "/random        \u2014 \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u0430\u044f \u0446\u0438\u0442\u0430\u0442\u0430 \u0438\u0437 \u0432\u044b\u0433\u0440\u0443\u0437\u043a\u0438",
  "/goto <slug>   \u2014 \u043f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u043e\u0431\u0440\u0430\u0437\u0446\u0443",
  "/stats         \u2014 \u0446\u0438\u0444\u0440\u044b \u0447\u0430\u0442\u0430",
  "/acid          \u2014 \u0430\u0446\u0438\u0434-\u0440\u0435\u0436\u0438\u043c",
  "/vhs          \u2014 VHS-\u0434\u0438\u0437\u0435\u0440\u0438\u043d\u0433",
  "/wake          \u2014 \u0440\u0430\u0437\u0431\u0443\u0434\u0438\u0442\u044c \u0447\u0430\u0442",
  "/lab           \u2014 \u0441\u043b\u0443\u0436\u0435\u0431\u043d\u043e\u0435 \u043f\u043e\u043c\u0435\u0449\u0435\u043d\u0438\u0435",
  "/clear         \u2014 \u043e\u0447\u0438\u0441\u0442\u0438\u0442\u044c",
  "/exit          \u2014 \u0437\u0430\u043a\u0440\u044b\u0442\u044c \u0442\u0435\u0440\u043c\u0438\u043d\u0430\u043b",
];

function personLine(p: Person): string {
  return (
    p.dossier.spec +
    "  " +
    p.slug.padEnd(9) +
    " " +
    p.hero.padEnd(9) +
    " " +
    String(p.stats.messages).padStart(6) +
    "  " +
    p.title
  );
}

/** Runs one terminal line and returns the output lines. */
export function runCommand(input: string, ctx: TerminalCtx): string[] {
  const raw = input.trim();
  if (!raw) return [];
  const [cmdRaw, ...rest] = raw.split(/\s+/);
  const cmd = cmdRaw.toLowerCase().replace(/^\/?/, "/");
  const arg = rest.join(" ").toLowerCase();

  switch (cmd) {
    case "/help":
    case "/?":
      return HELP;

    case "/who": {
      if (!arg) return PEOPLE.map(personLine);
      const p = getPerson(arg);
      if (!p)
        return [
          "\u043d\u0435\u0442 \u0442\u0430\u043a\u043e\u0433\u043e \u043e\u0431\u0440\u0430\u0437\u0446\u0430: " +
            arg,
        ];
      return [
        p.hero + "  \u00b7  " + p.title,
        p.tagline,
        "\u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439: " +
          p.stats.messages +
          "   \u043d\u043e\u0447\u043d\u044b\u0445: " +
          p.stats.nightPct +
          "%   \u0434\u043d\u0435\u0439: " +
          p.dossier.activeDays,
        "\u043f\u0438\u043a: " +
          p.dossier.peakHours
            .map((h) => String(h).padStart(2, "0") + ":00")
            .join(", "),
      ];
    }

    case "/quote": {
      const p = arg
        ? getPerson(arg)
        : PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
      if (!p)
        return [
          "\u043d\u0435\u0442 \u0442\u0430\u043a\u043e\u0433\u043e \u043e\u0431\u0440\u0430\u0437\u0446\u0430: " +
            arg,
        ];
      const q = p.quotes[Math.floor(Math.random() * p.quotes.length)];
      return ["\u00ab" + q + "\u00bb", "   \u2014 " + p.hero];
    }

    case "/random": {
      const p = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
      const q = p.quotes[Math.floor(Math.random() * p.quotes.length)];
      return [
        "\u00ab" + q + "\u00bb",
        "   \u2014 " + p.hero + " (" + p.dossier.spec + ")",
      ];
    }

    case "/goto": {
      const p = getPerson(arg);
      if (!p)
        return [
          "\u0444\u043e\u0440\u043c\u0430\u0442: /goto " + PEOPLE[0].slug,
        ];
      ctx.go("/p/" + p.slug);
      ctx.close();
      return ["\u0438\u0434\u0451\u043c \u043a " + p.hero + "\u2026"];
    }

    case "/stats":
      return [
        "\u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439: " +
          CHAT.totals.messages,
        "\u0440\u0435\u0430\u043a\u0446\u0438\u0439:   " +
          CHAT.totals.reactions,
        "\u043c\u0435\u043c\u043e\u0432:      " + CHAT.totals.memes,
        "\u043d\u043e\u0447\u043d\u044b\u0445:    " + CHAT.totals.night,
        "\u0434\u043d\u0435\u0439:       " + CHAT.totals.days,
        "\u0431\u0435\u0437 \u043e\u0444\u0444\u0442\u043e\u043f\u0430: " +
          daysWithoutOfftop(),
      ];

    case "/acid":
      ctx.acid();
      return [
        "\u0430\u0446\u0438\u0434-\u0440\u0435\u0436\u0438\u043c \u043f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0451\u043d",
      ];

    case "/vhs":
      ctx.vhs();
      return [
        "VHS-\u0434\u0438\u0437\u0435\u0440\u0438\u043d\u0433 \u043f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0451\u043d",
      ];

    case "/wake":
      ctx.wake();
      return [
        "\u0431\u0443\u0434\u0438\u043c \u0432\u0441\u0435\u0445. \u0438\u0437\u0432\u0438\u043d\u0438\u0442\u0435.",
      ];

    case "/lab":
      ctx.unlockLab();
      ctx.go("/lab");
      ctx.close();
      return [
        "\u0434\u043e\u0441\u0442\u0443\u043f \u0432 \u0441\u043b\u0443\u0436\u0435\u0431\u043d\u043e\u0435 \u043f\u043e\u043c\u0435\u0449\u0435\u043d\u0438\u0435 \u043e\u0442\u043a\u0440\u044b\u0442",
      ];

    case "/clear":
      ctx.clear();
      return [];

    case "/exit":
    case "/q":
      ctx.close();
      return [];

    case "/\u0431\u0443\u0440\u043c\u0430\u043b\u0434\u0430":
    case "\u0431\u0443\u0440\u043c\u0430\u043b\u0434\u0430":
      return [
        "\u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 \u0434\u043e\u0441\u0442\u0430\u0432\u043b\u0435\u043d\u043e. \u0441\u043e\u0431\u0435\u0441\u0435\u0434\u043d\u0438\u043a \u0432\u0430\u0441 \u0441\u043d\u043e\u0432\u0430 \u0432\u0438\u0434\u0438\u0442.",
      ];

    default:
      return [
        "\u0447\u0442\u043e\u0437\u0430: " + raw,
        "\u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439 /help",
      ];
  }
}

/* ------------------------------------------------------------ achievements */

export const ACHIEVEMENT_PAGES = ["/", "/together", "/wiki", "/lab"];

export function visitedAll(visited: string[]): boolean {
  const set = new Set(visited);
  const pages = ACHIEVEMENT_PAGES.every((p) => set.has(p));
  const people = PEOPLE.every((p) => set.has("/p/" + p.slug));
  return pages && people;
}

export function visitedProgress(visited: string[]): {
  done: number;
  total: number;
} {
  const set = new Set(visited);
  const all = [...ACHIEVEMENT_PAGES, ...PEOPLE.map((p) => "/p/" + p.slug)];
  return { done: all.filter((p) => set.has(p)).length, total: all.length };
}
