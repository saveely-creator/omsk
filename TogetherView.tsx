"use client"

/**
 * /together — «Общий снимок»: every figure on one podium.
 * Buttons: shuffle the arrangement, dress everyone alike, take the group photo.
 * Easter egg: the lab radio («Зайцев Нет | Музыка», 1057 tracks in the export).
 */

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

import { Counter, Footer, MagneticButton, Rail, VisitTracker } from "@/components/chrome"
import { Screen, ScreenSpy } from "@/components/flow"
import { CHAT } from "@/data/chat"
import { PEOPLE, PEOPLE_BY_SLUG, randomQuote } from "@/data/people"
import { PRESETS, PRESET_IDS, type PresetId } from "@/data/wardrobe"
import { sfx } from "@/lib/easter"
import { exportStampedPng, findSceneCanvas } from "@/lib/screenshot"
import { requestGroupShot, resetCamera, useScene } from "@/store/scene"
import { dressEveryone, resetAll, shuffleArrangement, useOutfitStore } from "@/store/outfit"
import { useUi } from "@/store/ui"

export function TogetherView() {
	const setStage = useScene((s) => s.setStage)
	const highlight = useUi((s) => s.highlight)
	const setHighlight = useUi((s) => s.setHighlight)
	const setCursor = useUi((s) => s.setCursor)
	const arrangement = useOutfitStore((s) => s.arrangement)
	const [radio, setRadio] = useState(false)
	const radioTimer = useRef<number | null>(null)

	useEffect(() => {
		setStage("wide")
		return () => setHighlight(null)
	}, [setHighlight, setStage])

	/* lab radio: a slow synthesised loop, no external audio files */
	useEffect(() => {
		if (!radio) {
			if (radioTimer.current !== null) window.clearInterval(radioTimer.current)
			radioTimer.current = null
			return
		}
		sfx.unlock()
		radioTimer.current = window.setInterval(() => sfx.tick(), 620)
		return () => {
			if (radioTimer.current !== null) window.clearInterval(radioTimer.current)
			radioTimer.current = null
		}
	}, [radio])

	const groupPhoto = useCallback(async () => {
		sfx.shutter()
		requestGroupShot()
		/* one frame for the camera to settle into the group framing */
		await new Promise((r) => window.setTimeout(r, 900))
		await exportStampedPng(findSceneCanvas(), {
			title: CHAT.name,
			subtitle: `Общий снимок · ${CHAT.totals.people} образцов`,
			code: `групповое фото · ${CHAT.years}`,
			footer: "omsk impire / iso 2026",
			filename: "omsk-impire-together.png",
			portrait: false,
			scale: 2,
		})
	}, [])

	const dress = useCallback((id: PresetId) => {
		sfx.tick()
		if (id === "default") {
			resetAll()
			return
		}
		dressEveryone(PRESETS[id].patch)
	}, [])

	const hi = highlight ? PEOPLE_BY_SLUG[highlight] : undefined

	return (
		<>
			<VisitTracker route="/together" />
			<ScreenSpy total={2} />
			<Rail text="group shot · all specimens · iso 2026" />

			{/* =============================================== 01 СНИМОК */}
			<Screen index={1} stage="wide" className="screen shell pass">
				<div
					className="behind"
					style={{
						position: "absolute",
						inset: 0,
						display: "grid",
						placeItems: "center",
						overflow: "hidden",
						pointerEvents: "none",
					}}
					aria-hidden="true"
				>
					<span className="hero-name">ВМЕСТЕ</span>
				</div>

				<div className="above" style={{ position: "relative", maxWidth: 380 }}>
					<div className="micro">01 · общий снимок</div>
					<h1 className="display" style={{ fontSize: "clamp(2rem,4vw,3.25rem)", lineHeight: 1, marginTop: 12 }}>
						Все на одном камне
					</h1>
					<p style={{ marginTop: 14, color: "var(--muted)" }}>
						Тяните, чтобы облететь подиум. Клик по фигуре — подсветка и
						карточка, второй клик — страница образца.
					</p>

					<div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
						<MagneticButton
							onClick={() => {
								shuffleArrangement()
								sfx.tick()
							}}
						>
							перемешать расстановку
						</MagneticButton>
						<MagneticButton onClick={groupPhoto}>групповое фото → png</MagneticButton>
						<MagneticButton onClick={() => resetCamera()}>сброс камеры</MagneticButton>
					</div>

					<div style={{ marginTop: 18 }}>
						<div className="micro">одеть всех одинаково</div>
						<div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
							{PRESET_IDS.map((id) => (
								<button key={id} type="button" className="chip" onClick={() => dress(id)}>
									{PRESETS[id].label}
								</button>
							))}
						</div>
					</div>

					<div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "center" }}>
						<button
							type="button"
							className="chip"
							aria-pressed={radio}
							onClick={() => setRadio((v) => !v)}
						>
							лабораторное радио {radio ? "●" : "○"}
						</button>
						<span className="micro">Зайцев Нет · 1057 треков в выгрузке</span>
					</div>

					<div className="micro" style={{ marginTop: 16 }}>
						расстановка #{arrangement}
					</div>
				</div>

				{/* highlight card */}
				{hi ? (
					<div
						className="above"
						style={{
							position: "absolute",
							right: "var(--margin)",
							bottom: "calc(var(--margin) + 34px)",
							width: "min(90vw, 320px)",
							padding: 20,
							border: "1px solid var(--line-strong)",
							background: "var(--glass)",
							backdropFilter: "blur(10px)",
						}}
					>
						<div className="micro">spec. {hi.dossier.spec}</div>
						<div className="display" style={{ fontSize: "2rem", marginTop: 8 }}>{hi.hero}</div>
						<div className="label" style={{ color: "var(--accent-2)", marginTop: 4 }}>{hi.title}</div>
						<p style={{ marginTop: 12, color: "var(--muted)", fontSize: "0.95rem" }}>
							«{randomQuote(hi, hi.stats.messages)}»
						</p>
						<Link
							href={`/p/${hi.slug}`}
							className="label ul"
							style={{ marginTop: 12, display: "inline-block" }}
						>
							открыть страницу →
						</Link>
					</div>
				) : null}
			</Screen>

			{/* ============================================== 02 КТО ЕСТЬ КТО */}
			<Screen index={2} stage="off" className="screen shell above">
				<div className="grid12" style={{ rowGap: 40, alignItems: "start" }}>
					<div style={{ gridColumn: "span 5" }}>
						<div className="micro">02 · статистика зала</div>
						<h2 className="display" style={{ fontSize: "var(--t-h2)", marginTop: 12 }}>
							{CHAT.name}
						</h2>
						<div style={{ marginTop: 18 }}>
							{[
								{ label: "сообщений", value: CHAT.totals.messages },
								{ label: "реакций", value: CHAT.totals.reactions },
								{ label: "мемных реплик", value: CHAT.totals.memes },
								{ label: "ночных сообщений", value: CHAT.totals.night },
								{ label: "активных дней", value: CHAT.totals.days },
								{ label: "служебных записей", value: CHAT.totals.service },
							].map((row) => (
								<div
									key={row.label}
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "baseline",
										padding: "11px 0",
										borderBottom: "1px solid var(--line)",
									}}
								>
									<span className="micro">{row.label}</span>
									<span className="display num" style={{ fontSize: "1.5rem" }}>
										<Counter value={row.value} />
									</span>
								</div>
							))}
						</div>
						<div className="micro" style={{ marginTop: 14 }}>
							топ-эмодзи:{" "}
							{CHAT.topEmoji
								.slice(0, 5)
								.map((e) => `${e.e} ${e.n.toLocaleString("ru-RU")}`)
								.join(" · ")}
						</div>
					</div>

					<div style={{ gridColumn: "span 7" }}>
						<div className="micro">легенда — кто есть кто</div>
						<ul style={{ marginTop: 12 }}>
							{PEOPLE.map((p, i) => (
								<li key={p.slug}>
									<Link
										href={`/p/${p.slug}`}
										style={{
											display: "flex",
											alignItems: "center",
											gap: 14,
											padding: "12px 0",
											borderBottom: "1px solid var(--line)",
											background:
												highlight === p.slug ? "rgba(74,222,128,0.06)" : "transparent",
										}}
										onPointerEnter={() => {
											setHighlight(p.slug)
											setCursor("link")
										}}
										onPointerLeave={() => setCursor("default")}
										onFocus={() => setHighlight(p.slug)}
									>
										<span className="micro num" style={{ width: 28 }}>
											{String(i + 1).padStart(2, "0")}
										</span>
										<span
											aria-hidden="true"
											style={{
												width: 8,
												height: 8,
												borderRadius: 999,
												background: p.model.accent,
												flex: "0 0 auto",
											}}
										/>
										<span className="display" style={{ fontSize: "1.35rem", minWidth: 140 }}>
											{p.hero}
										</span>
										<span className="micro" style={{ flex: 1 }}>{p.title}</span>
										<span className="micro num">
											{p.stats.messages.toLocaleString("ru-RU")}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</Screen>

			<Footer />
		</>
	)
}

export default TogetherView
