import type { Metadata, Viewport } from "next";
import {
  Instrument_Serif,
  JetBrains_Mono,
  Manrope,
  Playfair_Display,
} from "next/font/google";
import type { CSSProperties, ReactNode } from "react";

import "./globals.css";

import {
  Cursor,
  Fog,
  Grain,
  GridLines,
  Header,
  VhsLayer,
} from "@/components/chrome";
import {
  Bootstrap,
  PageCurtain,
  Preloader,
  SmoothScroll,
  Terminal,
} from "@/components/flow";
import { CHAT } from "@/data/chat";
import { CanvasMount } from "@/three/CanvasMount";

/* Display serif for the giant nicknames. Instrument Serif has no Cyrillic, so
   Playfair Display is loaded right behind it for СГЛЫПА / РАССОЛ / ТОЧКА. */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

const displayCyr = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-playfair",
  display: "swap",
});

const ui = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-jetbrains",
  display: "swap",
});

/* Film grain as an inline SVG data URI: no binary asset, no request. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E" +
  "%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E" +
  "%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E" +
  "%3Crect width='180' height='180' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E\")";

export const metadata: Metadata = {
  metadataBase: new URL("https://omsk-impire.vercel.app"),
  title: {
    default: "OMSK IMPIRE — музей образцов",
    template: "%s — OMSK IMPIRE",
  },
  description:
    "Цифровой музей участников чата: исследовано " +
    CHAT.totals.messages.toLocaleString("ru-RU") +
    " сообщений, выставлено " +
    CHAT.totals.people +
    " образцов. Каждую скульптуру можно крутить и переодевать.",
  keywords: ["OMSK IMPIRE", "музей чата", "3D", "WebGL", "образцы"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "OMSK IMPIRE — музей образцов",
    description: "Зал с образцами чата. Крутите, переодевайте, читайте цитаты.",
    siteName: "OMSK IMPIRE",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B1410",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const themeVars = {
  "--font-display":
    "var(--font-instrument), var(--font-playfair), Georgia, serif",
  "--font-ui": "var(--font-manrope), ui-sans-serif, system-ui, sans-serif",
  "--font-mono": "var(--font-jetbrains), ui-monospace, monospace",
  "--grain-url": GRAIN,
} as CSSProperties;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${displayCyr.variable} ${ui.variable} ${mono.variable}`}
      data-acid="off"
      data-vhs="off"
      data-motion="on"
      suppressHydrationWarning
    >
      <body style={themeVars}>
        <Bootstrap />

        {/* one canvas for the whole museum, mounted once, never remounted */}
        <CanvasMount />

        <GridLines columns={6} />
        <Fog />
        <Header />

        <SmoothScroll>
          <PageCurtain>{children}</PageCurtain>
        </SmoothScroll>

        <Grain />
        <VhsLayer />
        <Cursor />
        <Terminal />
        <Preloader />
      </body>
    </html>
  );
}
