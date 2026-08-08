"use client"

/**
 * Motion plumbing: Lenis smooth scroll wired into GSAP ScrollTrigger, the
 * preloader, the overlay curtain between routes, the screen counter, the `~`
 * terminal and the lab-analysis panel.
 */

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react"

import { LOADER_LINES } from "@/data/chat"
import type { Person } from "@/data/people"
import {
	consoleArt,
	labAnalysis,
	runCommand,
	setSoundEnabled,
	sfx,
	useKonami,
	type LabReport,
} from "@/lib/easter"
import { useHotkey, useMotionOff } from "@/lib/hooks"
import { useScene, type Stage } from "@/store/scene"
import { useUi } from "@/store/ui"
import { SectionCounter } from "./chrome"

/* ============================================================ bootstrap */

/** Mirrors the toggles onto <html>, prints the console egg, arms the konami. */
export function Bootstrap() {
	const acid = useUi((s) => s.acid)
	const vhs = useUi((s) => s.vhs)
	const motion = useUi((s) => s.motion)
	const sound = useUi((s) => s.sound)
	const toggleAcid = useUi((s) => s.toggleAcid)

	useEffect(() => {
		const el = document.documentElement
		el.dataset.acid = acid ? "on" : "off"
		el.dataset.vhs = vhs ? "on" : "off"
		el.dataset.motion = motion ? "on" : "off"
	}, [acid, motion, vhs])

	useEffect(() => setSoundEnabled(sound), [sound])
	useEffect(() => consoleArt(), [])

	useKonami(() => {
		toggleAcid()
		sfx.unlock()
	})

	return null
}

/* ========================================================= smooth scroll */

export function SmoothScroll({ children }: { children: ReactNode }) {
	const off = useMotionOff()
	const pathname = usePathname()

	useEffect(() => {
		if (off) return
		gsap.registerPlugin(ScrollTrigger)

		const lenis = new Lenis({
			duration: 1.05,
			smoothWheel: true,
			wheelMultiplier: 0.9,
			touchMultiplier: 1.6,
			easing: (t: number) => 1 - Math.pow(1 - t, 3),
		})

		lenis.on("scroll", ScrollTrigger.update)
		const tick = (time: number) => lenis.raf(time * 1000)
		gsap.ticker.add(tick)
		gsap.ticker.lagSmoothing(0)
		ScrollTrigger.refresh()

		return () => {
			gsap.ticker.remove(tick)
			lenis.destroy()
		}
	}, [off])

	/* every route is a new document height */
	useEffect(() => {
		window.scrollTo(0, 0)
		const id = window.setTimeout(() => ScrollTrigger.refresh(), 240)
		return () => window.clearTimeout(id)
	}, [pathname])

	return <>{children}</>
}

/* ============================================================= preloader */

export function Preloader() {
	const ready = useScene((s) => s.ready)
	const introDone = useUi((s) => s.introDone)
	const setIntroDone = useUi((s) => s.setIntroDone)
	const off = useMotionOff()
	const [pct, setPct] = useState(0)
	const [line, setLine] = useState(0)
	const [gone, setGone] = useState(false)

	/* climbs to 92 on its own, then waits for the first rendered frame */
	useEffect(() => {
		if (introDone) return
		let raf = 0
		const start = performance.now()
		const loop = (now: number) => {
			const t = (now - start) / 1500
			const soft = Math.min(92, Math.round((1 - Math.pow(1 - Math.min(1, t), 2)) * 92))
			setPct((p) => Math.max(p, ready ? Math.min(100, Math.max(soft, p + 3)) : soft))
			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)
		return () => cancelAnimationFrame(raf)
	}, [introDone, ready])

	useEffect(() => {
		if (introDone) return
		const id = window.setInterval(() => setLine((l) => (l + 1) % LOADER_LINES.length), 780)
		return () => window.clearInterval(id)
	}, [introDone])

	useEffect(() => {
		if (introDone || pct < 100) return
		sfx.curtain()
		const id = window.setTimeout(() => {
			setGone(true)
			setIntroDone(true)
		}, 620)
		return () => window.clearTimeout(id)
	}, [introDone, pct, setIntroDone])

	if (introDone || gone) return null

	return (
		<motion.div
			initial={{ y: 0 }}
			animate={{ y: pct >= 100 ? "-100%" : 0 }}
			transition={{ duration: off ? 0 : 0.82, ease: [0.76, 0, 0.24, 1] }}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 90,
				background: "var(--bg-deep)",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: "var(--margin)",
			}}
			role="status"
			aria-live="polite"
		>
			<div className="micro">OMSK IMPIRE / музей образцов / ISO 2026</div>

			<div>
				<div className="display" style={{ fontSize: "clamp(3rem, 12vw, 9rem)", lineHeight: 0.9 }}>
					<span className="num">{String(pct).padStart(3, "0")}</span>
					<span style={{ opacity: 0.35, fontSize: "0.4em" }}> %</span>
				</div>
				<div className="label" style={{ marginTop: 10, minHeight: "1.6em" }}>
					{LOADER_LINES[line]}
				</div>
				<div className="hairline" style={{ marginTop: 18 }}>
					<div
						style={{
							height: 1,
							width: `${pct}%`,
							background: "var(--accent)",
							transition: off ? "none" : "width 260ms linear",
						}}
					/>
				</div>
			</div>

			<div className="micro">подготовка витрины…</div>
		</motion.div>
	)
}

/* =============================================================== curtain */

/**
 * Overlay curtain in surface green: the new route is already mounted under it,
 * the curtain lifts and the screen slides into place. 820 ms, per the spec.
 */
export function PageCurtain({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	const off = useMotionOff()
	const first = useRef(true)

	useEffect(() => {
		if (first.current) {
			first.current = false
			return
		}
		sfx.curtain()
	}, [pathname])

	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div key={pathname}>
				<motion.div
					className="curtain"
					initial={{ y: 0 }}
					animate={{ y: "-100%" }}
					transition={{ duration: off ? 0 : 0.82, ease: [0.76, 0, 0.24, 1] }}
				>
					<div className="curtain-label micro">переход…</div>
				</motion.div>

				<motion.div
					initial={{ y: off ? 0 : "5vh", opacity: off ? 1 : 0.4 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: off ? 0 : 0.86, ease: [0.16, 1, 0.3, 1], delay: off ? 0 : 0.06 }}
				>
					{children}
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}

/* ========================================================= screen spy */

/**
 * Watches elements marked `data-screen` and drives the fixed 01 / 06 counter,
 * plus the canvas stage (hero framing vs wardrobe framing).
 */
export function ScreenSpy({ total }: { total: number }) {
	const [index, setIndex] = useState(1)
	const setStage = useScene((s) => s.setStage)
	const setHeroProgress = useScene((s) => s.setHeroProgress)

	useLayoutEffect(() => {
		const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-screen]"))
		if (!nodes.length) return

		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (!e.isIntersecting) continue
					const el = e.target as HTMLElement
					const n = Number.parseInt(el.dataset.screen ?? "1", 10)
					setIndex(n)
					setStage((el.dataset.stage as Stage) ?? "off")
				}
			},
			{ threshold: 0.55 },
		)
		nodes.forEach((n) => io.observe(n))

		const onScroll = () => {
			const h = window.innerHeight || 1
			setHeroProgress(Math.max(0, Math.min(1, window.scrollY / h)))
		}
		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })

		return () => {
			io.disconnect()
			window.removeEventListener("scroll", onScroll)
		}
	}, [setHeroProgress, setStage])

	return <SectionCounter index={index} total={total} />
}

/** Declares which canvas framing a screen wants. */
export function Screen({
	index,
	stage = "off",
	id,
	className,
	children,
}: {
	index: number
	stage?: Stage
	id?: string
	className?: string
	children: ReactNode
}) {
	return (
		<section
			id={id}
			data-screen={index}
			data-stage={stage}
			className={className}
		>
			{children}
		</section>
	)
}

/* ============================================================== terminal */

export function Terminal() {
	const open = useUi((s) => s.terminalOpen)
	const setTerminal = useUi((s) => s.setTerminal)
	const toggleAcid = useUi((s) => s.toggleAcid)
	const toggleVhs = useUi((s) => s.toggleVhs)
	const pokeWake = useUi((s) => s.pokeWake)
	const unlockLab = useUi((s) => s.unlockLab)
	const router = useRouter()
	const [lines, setLines] = useState<string[]>([
		"OMSK IMPIRE terminal · набери /help",
	])
	const [value, setValue] = useState("")
	const inputRef = useRef<HTMLInputElement>(null)
	const logRef = useRef<HTMLDivElement>(null)

	useHotkey(
		useCallback((e: KeyboardEvent) => e.key === "~" || e.key === "ё" || e.code === "Backquote", []),
		useCallback(() => {
			setTerminal(!useUi.getState().terminalOpen)
			sfx.tick()
		}, [setTerminal]),
	)

	useEffect(() => {
		if (open) inputRef.current?.focus()
	}, [open])

	useEffect(() => {
		if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
	}, [lines])

	const ctx = useMemo(
		() => ({
			go: (href: string) => router.push(href),
			acid: () => toggleAcid(),
			vhs: () => toggleVhs(),
			wake: () => {
				pokeWake()
				sfx.wake()
			},
			unlockLab: () => unlockLab(),
			close: () => setTerminal(false),
			clear: () => setLines([]),
		}),
		[pokeWake, router, setTerminal, toggleAcid, toggleVhs, unlockLab],
	)

	const submit = () => {
		const input = value
		setValue("")
		if (!input.trim()) return
		const out = runCommand(input, ctx)
		setLines((prev) => [...prev, "> " + input, ...out])
		sfx.tick()
	}

	if (!open) return null

	return (
		<div
			className="thin-scroll"
			style={{
				position: "fixed",
				left: "var(--margin)",
				right: "var(--margin)",
				bottom: "var(--margin)",
				zIndex: 85,
				maxWidth: 720,
				border: "1px solid var(--line-strong)",
				background: "rgba(6,14,10,0.94)",
				backdropFilter: "blur(10px)",
				fontFamily: "var(--font-mono)",
				fontSize: 12,
			}}
			role="dialog"
			aria-label="терминал музея"
		>
			<div
				ref={logRef}
				className="thin-scroll"
				style={{ maxHeight: "38vh", overflowY: "auto", padding: "14px 16px", whiteSpace: "pre-wrap" }}
			>
				{lines.map((l, i) => (
					<div key={i} style={{ color: l.startsWith(">") ? "var(--accent)" : "var(--muted)" }}>
						{l}
					</div>
				))}
			</div>
			<div
				style={{
					display: "flex",
					gap: 8,
					alignItems: "center",
					borderTop: "1px solid var(--line)",
					padding: "10px 16px",
				}}
			>
				<span style={{ color: "var(--accent)" }}>&gt;</span>
				<input
					ref={inputRef}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") submit()
						if (e.key === "Escape") setTerminal(false)
					}}
					spellCheck={false}
					aria-label="команда"
					style={{
						flex: 1,
						background: "transparent",
						border: 0,
						outline: "none",
						color: "var(--clay)",
						fontFamily: "inherit",
						fontSize: "inherit",
					}}
				/>
				<button type="button" className="chip" onClick={() => setTerminal(false)}>
					esc
				</button>
			</div>
		</div>
	)
}

/* ========================================================= lab analysis */

/** Лабораторный анализ: pseudo-scientific nonsense, re-rollable. */
export function LabAnalysisPanel({ person }: { person: Person }) {
	const [report, setReport] = useState<LabReport | null>(null)

	const roll = () => {
		setReport(labAnalysis(person, Math.floor(Math.random() * 100000)))
		sfx.tick()
	}

	return (
		<div>
			<button type="button" className="btn" onClick={roll}>
				{report ? "пересдать анализ" : "лабораторный анализ"}
			</button>

			{report ? (
				<div style={{ marginTop: 20, border: "1px solid var(--line)", padding: 20 }}>
					<div className="micro" style={{ display: "flex", justifyContent: "space-between" }}>
						<span>{report.code}</span>
						<span>{report.method}</span>
					</div>
					<dl style={{ marginTop: 14 }}>
						{report.rows.map((r) => (
							<div
								key={r.label}
								style={{
									display: "flex",
									justifyContent: "space-between",
									gap: 16,
									padding: "7px 0",
									borderBottom: "1px solid var(--line)",
								}}
							>
								<dt className="label" style={{ color: "var(--clay)" }}>
									{r.label}
								</dt>
								<dd className="num micro">{r.value}</dd>
							</div>
						))}
					</dl>
					<div className="label" style={{ marginTop: 14, color: "var(--accent)" }}>
						вердикт: {report.verdict}
					</div>
				</div>
			) : null}
		</div>
	)
}

/* ============================================================ wake chat */

export function WakeButton({ label = "разбудить чат" }: { label?: string }) {
	const pokeWake = useUi((s) => s.pokeWake)
	return (
		<button
			type="button"
			className="btn"
			onClick={() => {
				pokeWake()
				sfx.wake()
			}}
		>
			{label}
		</button>
	)
}
