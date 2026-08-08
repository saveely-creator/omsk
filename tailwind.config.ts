import type { Config } from "tailwindcss"

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				"bg-deep": "var(--bg-deep)",
				bg: "var(--bg)",
				surface: "var(--surface)",
				"green-mid": "var(--green-mid)",
				accent: "var(--accent)",
				"accent-2": "var(--accent-2)",
				clay: "var(--clay)",
				muted: "var(--muted)",
				line: "var(--line)",
				"line-strong": "var(--line-strong)",
			},
			fontFamily: {
				display: "var(--font-display)",
				ui: "var(--font-ui)",
				mono: "var(--font-mono)",
			},
			fontSize: {
				hero: ["var(--t-hero)", { lineHeight: "0.82", letterSpacing: "-0.03em" }],
				h1: ["var(--t-h1)", { lineHeight: "0.94", letterSpacing: "-0.02em" }],
				h2: ["var(--t-h2)", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
				quote: ["var(--t-quote)", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
				body: ["var(--t-body)", { lineHeight: "1.62" }],
				label: ["var(--t-label)", { lineHeight: "1", letterSpacing: "0.18em" }],
				micro: ["var(--t-micro)", { lineHeight: "1", letterSpacing: "0.22em" }],
			},
			spacing: {
				margin: "var(--margin)",
				gutter: "var(--gutter)",
				rail: "var(--rail)",
			},
			maxWidth: {
				measure: "38ch",
				prose2: "62ch",
			},
			transitionTimingFunction: {
				lab: "cubic-bezier(0.16, 1, 0.3, 1)",
				curtain: "cubic-bezier(0.76, 0, 0.24, 1)",
			},
			keyframes: {
				scanline: {
					"0%": { transform: "translateY(-100%)" },
					"100%": { transform: "translateY(100%)" },
				},
				breathe: {
					"0%,100%": { opacity: "0.35" },
					"50%": { opacity: "1" },
				},
				nudge: {
					"0%,100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(6px)" },
				},
			},
			animation: {
				scanline: "scanline 7s linear infinite",
				breathe: "breathe 2.4s ease-in-out infinite",
				nudge: "nudge 2s ease-in-out infinite",
			},
		},
	},
	plugins: [],
}

export default config
