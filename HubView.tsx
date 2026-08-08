"use client"

/**
 * / — the hub: manifest, counters, catalogue of specimens.
 * Hovering a card moves that figure into the canvas row (our stand-in for
 * «preload the model on hover»: the sculpture is already there, we just focus it).
 */

import Link from "next/link"
import { useEffect } from "react"

import {
	Counter,
	DragCarousel,
	Footer,
	Rail,
	Reveal,
	ScrollHint,
	VisitTracker,
} from "@/components/chrome"
import { Screen, ScreenSpy, WakeButton } from "@/components/flow"
import { CHAT, TITLES } from "@/data/chat"
import { PEOPLE } from "@/data/people"
import { useScene } from "@/store/scene"
import { useUi } from "@/store/ui"

const pad2 = (n: number) => String(n).padStart(2, "0")

export function HubView() {
	const setFocus = useScene((s) => s.setFocus)
	const focus = useScene((s) => s.focus)
	const setCursor = useUi((s) => s.setCursor)

	useEffect(() => {
		if (!focus) setFocus(PEOPLE[0].slug)
	}, [focus, setFocus])

	return (
		<>
			<VisitTracker route="/" />
			<ScreenSpy total={3} />
			<Rail text="omsk impire · sample hall · iso 2026" />

			{/* ================================================ 01 МАНИФЕСТ */}
			<Screen index={1} stage="off" className="screen shell above">
				<div className="grid12" style={{ rowGap: 32, alignItems: "end" }}>
					<div style={{ gridColumn: "span 7" }}>
						<div className="micro">01 · манифест лаборатории</div>
						<h1
							className="display"
							style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)", lineHeight: 0.94, marginTop: 18 }}
						>
							<Reveal text="Мы исследовали чат" />
							<br />
							<span style={{ color: "var(--accent-2)" }}>
								<Reveal text="и выставили образцы" delay={120} />
							</span>
						</h1>
						<p style={{ marginTop: 24, maxWidth: "46ch", color: "var(--muted)" }}>
							{CHAT.totals.messages.toLocaleString("ru-RU")} сообщений за {CHAT.totals.days} активных
							дней разобраны, высушены и расставлены по витринам. Каждый
							образец можно крутить и переодевать. Цитаты не придуманы:
							все фразы взяты из выгрузки без правок.
						</p>
					</div>

					<div style={{ gridColumn: "span 5" }}>
						<div className="grid" style={{ gap: 0 }}>
							{[
								{ label: "образцов", value: CHAT.totals.people },
								{ label: "сообщений", value: CHAT.totals.messages },
								{ label: "мемных реплик", value: CHAT.totals.memes },
								{ label: "реакций", value: CHAT.totals.reactions },
								{ label: "ночных сообщений", value: CHAT.totals.night },
							].map((row) => (
								<div
									key={row.label}
									style={{
										display: "flex",
										alignItems: "baseline",
										justifyContent: "space-between",
										gap: 16,
										padding: "12px 0",
										borderBottom: "1px solid var(--line)",
									}}
								>
									<span className="micro">{row.label}</span>
									<span className="display num" style={{ fontSize: "clamp(1.5rem,2.4vw,2.25rem)" }}>
										<Counter value={row.value} />
									</span>
								</div>
							))}
						</div>
						<div className="micro" style={{ marginTop: 14 }}>
							выгрузка {CHAT.firstSeen.slice(0, 10)} — {CHAT.lastSeen.slice(0, 10)}
						</div>
					</div>
				</div>

				<div style={{ position: "absolute", left: "var(--margin)", bottom: "var(--margin)" }}>
					<ScrollHint text="Скролльте к каталогу" />
				</div>
			</Screen>

			{/* ================================================= 02 КАТАЛОГ */}
			<Screen index={2} stage="hero" className="screen above">
				<div className="shell">
					<div className="micro">02 · каталог образцов</div>
					<h2 className="display" style={{ fontSize: "var(--t-h2)", marginTop: 12, marginBottom: 26 }}>
						Кто стоит в зале
					</h2>
				</div>

				<div className="shell">
					<DragCarousel hint="Тяните">
						{PEOPLE.map((person, i) => (
							<Link
								key={person.slug}
								href={`/p/${person.slug}`}
								style={{
									flex: "0 0 auto",
									width: "min(72vw, 300px)",
									padding: 20,
									border: `1px solid ${focus === person.slug ? "var(--line-strong)" : "var(--line)"}`,
									background: focus === person.slug ? "rgba(22,50,31,0.5)" : "transparent",
									transition: "background-color 420ms var(--ease-lab), border-color 420ms var(--ease-lab)",
								}}
								onPointerEnter={() => {
									setFocus(person.slug)
									setCursor("link")
								}}
								onPointerLeave={() => setCursor("default")}
								onFocus={() => setFocus(person.slug)}
							>
								<div className="micro" style={{ display: "flex", justifyContent: "space-between" }}>
									<span>spec. {person.dossier.spec}</span>
									<span className="num">{pad2(i + 1)} / {pad2(PEOPLE.length)}</span>
								</div>

								<div
									className="display"
									style={{ fontSize: "2.5rem", lineHeight: 1, marginTop: 18 }}
								>
									{person.hero}
								</div>
								<div className="label" style={{ marginTop: 8, color: "var(--accent-2)" }}>
									{person.title}
								</div>
								<p style={{ marginTop: 14, color: "var(--muted)", fontSize: "0.95rem" }}>
									{person.tagline}
								</p>

								<div
									style={{
										marginTop: 18,
										display: "flex",
										justifyContent: "space-between",
										borderTop: "1px solid var(--line)",
										paddingTop: 12,
									}}
								>
									<span className="micro num">
										{person.stats.messages.toLocaleString("ru-RU")} сообщ.
									</span>
									<span className="micro" style={{ color: person.model.accent }}>
										● {person.model.base}
									</span>
								</div>
							</Link>
						))}
					</DragCarousel>
				</div>
			</Screen>

			{/* ==================================================== 03 ЗАЛЫ */}
			<Screen index={3} stage="off" className="screen shell above">
				<div className="micro">03 · другие залы</div>
				<div className="grid12" style={{ marginTop: 24, rowGap: 20 }}>
					<Link
						href="/together"
						style={{ gridColumn: "span 6", padding: 28, border: "1px solid var(--line)" }}
						onPointerEnter={() => setCursor("link")}
						onPointerLeave={() => setCursor("default")}
					>
						<div className="display" style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)" }}>
							Общий снимок
						</div>
						<p className="micro" style={{ marginTop: 10 }}>
							все {CHAT.totals.people} фигур на одном камне · экспорт png
						</p>
					</Link>

					<Link
						href="/wiki"
						style={{ gridColumn: "span 6", padding: 28, border: "1px solid var(--line)" }}
						onPointerEnter={() => setCursor("link")}
						onPointerLeave={() => setCursor("default")}
					>
						<div className="display" style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)" }}>Чат.вики</div>
						<p className="micro" style={{ marginTop: 10 }}>
							словарь, легенды, таймлайн · {TITLES.length} названия чата
						</p>
					</Link>
				</div>

				<div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
					<WakeButton />
					<span className="micro" style={{ alignSelf: "center" }}>
						нажмите ~ для терминала · конами-код для ацид-режима
					</span>
				</div>
			</Screen>

			<Footer />
		</>
	)
}

export default HubView
