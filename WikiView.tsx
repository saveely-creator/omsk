"use client"

/**
 * /wiki — «Чат.вики»: timeline, dictionary, legends, titles.
 * The whole section runs the emoji cursor (easter egg) and keeps the canvas off
 * so the type can breathe.
 */

import Link from "next/link"
import { useEffect } from "react"

import { DragCarousel, Footer, Rail, Reveal, VisitTracker } from "@/components/chrome"
import { Screen, ScreenSpy } from "@/components/flow"
import { CHAT, DICTIONARY, LEGENDS, TIMELINE, TITLES } from "@/data/chat"
import { PEOPLE } from "@/data/people"
import { useScene } from "@/store/scene"
import { useUi } from "@/store/ui"

export function WikiView() {
	const setStage = useScene((s) => s.setStage)
	const setCursor = useUi((s) => s.setCursor)

	useEffect(() => {
		setStage("off")
		setCursor("emoji")
		return () => setCursor("default")
	}, [setCursor, setStage])

	return (
		<>
			<VisitTracker route="/wiki" />
			<ScreenSpy total={4} />
			<Rail text="chat.wiki · folklore archive · iso 2026" />

			{/* ================================================ 01 ТАЙМЛАЙН */}
			<Screen index={1} stage="off" className="screen shell above">
				<div className="micro">01 · таймлайн зала</div>
				<h1
					className="display"
					style={{ fontSize: "clamp(2.5rem,7vw,5.5rem)", lineHeight: 0.96, marginTop: 16 }}
				>
					<Reveal text="Чат.вики" />
				</h1>
				<p style={{ marginTop: 18, maxWidth: "48ch", color: "var(--muted)" }}>
					Словарь, легенды и даты — всё собрано из выгрузки без ретуши.
					Цифры рядом с терминами — реальное число употреблений.
				</p>

				<ol style={{ marginTop: 36 }}>
					{TIMELINE.map((t, i) => (
						<li
							key={t.date + t.label}
							className="grid12"
							style={{ padding: "18px 0", borderTop: "1px solid var(--line)", rowGap: 8 }}
						>
							<span className="micro num" style={{ gridColumn: "span 1" }}>
								{String(i + 1).padStart(2, "0")}
							</span>
							<span className="label num" style={{ gridColumn: "span 2", color: "var(--accent-2)" }}>
								{t.date}
							</span>
							<span className="display" style={{ gridColumn: "span 4", fontSize: "1.6rem" }}>
								{t.label}
							</span>
							<span style={{ gridColumn: "span 5", color: "var(--muted)" }}>{t.note}</span>
						</li>
					))}
				</ol>
			</Screen>

			{/* ================================================== 02 СЛОВАРЬ */}
			<Screen index={2} stage="off" className="screen shell above">
				<div className="micro">02 · словарь чата</div>
				<h2 className="display" style={{ fontSize: "var(--t-h2)", marginTop: 12, marginBottom: 26 }}>
					На чём здесь говорят
				</h2>

				<div className="grid12" style={{ rowGap: 0 }}>
					{DICTIONARY.map((d) => (
						<div
							key={d.term}
							style={{
								gridColumn: "span 6",
								padding: "16px 0",
								borderBottom: "1px solid var(--line)",
							}}
						>
							<div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
								<span className="display" style={{ fontSize: "1.5rem" }}>{d.term}</span>
								{d.count > 0 ? (
									<span className="micro num" style={{ color: "var(--accent)" }}>
										{d.count.toLocaleString("ru-RU")}×
									</span>
								) : null}
							</div>
							<p style={{ marginTop: 8, color: "var(--muted)", fontSize: "0.95rem" }}>{d.gloss}</p>
						</div>
					))}
				</div>

				<div
					style={{
						marginTop: 32,
						padding: 24,
						border: "1px solid var(--line)",
						background: "rgba(22,50,31,0.35)",
					}}
				>
					<div className="micro">копипаста зала</div>
					<p className="display" style={{ fontSize: "clamp(1.25rem,2.6vw,2rem)", marginTop: 12, lineHeight: 1.2 }}>
						«Я был прастое савэли и прокачалс мне жадныст пгубыла и я стал
						демонм 👹😈»
					</p>
					<div className="micro" style={{ marginTop: 14 }}>
						протокол бурмалды: «собеседник не видит ваше сообщение! для
						отправки напишите: Бурмалда»
					</div>
				</div>
			</Screen>

			{/* ================================================== 03 ЛЕГЕНДЫ */}
			<Screen index={3} stage="off" className="screen above">
				<div className="shell">
					<div className="micro">03 · легенды</div>
					<h2 className="display" style={{ fontSize: "var(--t-h2)", marginTop: 12, marginBottom: 26 }}>
						Истории, которые пересказывают
					</h2>
				</div>
				<div className="shell">
					<DragCarousel hint="Тяните">
						{LEGENDS.map((l, i) => (
							<article
								key={l.title}
								style={{
									flex: "0 0 auto",
									width: "min(80vw, 420px)",
									minHeight: 260,
									padding: 26,
									border: "1px solid var(--line)",
									display: "flex",
									flexDirection: "column",
									justifyContent: "space-between",
								}}
							>
								<span className="micro num">легенда {String(i + 1).padStart(2, "0")}</span>
								<h3 className="display" style={{ fontSize: "2rem", margin: "18px 0 12px" }}>
									{l.title}
								</h3>
								<p style={{ color: "var(--muted)" }}>{l.body}</p>
							</article>
						))}
					</DragCarousel>
				</div>
			</Screen>

			{/* ============================================ 04 НАЗВАНИЯ И ТИТУЛЫ */}
			<Screen index={4} stage="off" className="screen shell above">
				<div className="grid12" style={{ rowGap: 40, alignItems: "start" }}>
					<div style={{ gridColumn: "span 5" }}>
						<div className="micro">04 · названия чата</div>
						<ol style={{ marginTop: 14 }}>
							{TITLES.map((t, i) => (
								<li
									key={t}
									style={{
										display: "flex",
										gap: 14,
										padding: "12px 0",
										borderBottom: "1px solid var(--line)",
									}}
								>
									<span className="micro num">{String(i + 1).padStart(2, "0")}</span>
									<span className="display" style={{ fontSize: "1.35rem" }}>{t}</span>
								</li>
							))}
						</ol>
						<p className="micro" style={{ marginTop: 16, lineHeight: 1.8 }}>
							голосовые чаты: ≈ 4787 часов · 213 входов · 106 выходов · 56
							закреплённых сообщений
						</p>
					</div>

					<div style={{ gridColumn: "span 7" }}>
						<div className="micro">титулы участников</div>
						<div className="grid12" style={{ marginTop: 14, rowGap: 0 }}>
							{PEOPLE.map((p) => (
								<Link
									key={p.slug}
									href={`/p/${p.slug}`}
									style={{
										gridColumn: "span 6",
										padding: "14px 0",
										borderBottom: "1px solid var(--line)",
									}}
								>
									<div className="label" style={{ color: "var(--clay)" }}>{p.hero}</div>
									<div className="micro" style={{ marginTop: 6 }}>{p.title}</div>
								</Link>
							))}
						</div>
						<div className="micro" style={{ marginTop: 18 }}>
							топ-эмодзи всего зала: {CHAT.topEmoji.map((e) => e.e).join(" ")}
						</div>
					</div>
				</div>
			</Screen>

			<Footer />
		</>
	)
}

export default WikiView
