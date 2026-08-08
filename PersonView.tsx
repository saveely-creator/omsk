"use client"

/**
 * /p/[slug] — the main dish. Six screens, hero variant B «Картотека».
 * The sculpture itself lives in the persistent canvas; this file is the paper
 * around it: the specimen card, the dossier, the formula, the quotes, the
 * wardrobe and the links.
 */

import Link from "next/link"
import { useEffect } from "react"

import {
	Counter,
	DragCarousel,
	Footer,
	MagneticButton,
	Rail,
	Reveal,
	ScrollHint,
	Tube,
	VisitTracker,
} from "@/components/chrome"
import { LabAnalysisPanel, Screen, ScreenSpy, WakeButton } from "@/components/flow"
import { Wardrobe } from "@/components/Wardrobe"
import { CHAT } from "@/data/chat"
import { PEOPLE, neighbours, type Person } from "@/data/people"
import { POSE_NAMES } from "@/three/poses"
import { poseIndex } from "@/data/wardrobe"
import { useOutfit } from "@/store/outfit"
import { useScene } from "@/store/scene"
import { useUi } from "@/store/ui"

const pad2 = (n: number) => String(n).padStart(2, "0")

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				gap: 16,
				padding: "9px 0",
				borderBottom: "1px solid var(--line)",
			}}
		>
			<span className="micro">{label}</span>
			<span className="num label" style={{ color: "var(--clay)", letterSpacing: "0.08em" }}>
				{value}
			</span>
		</div>
	)
}

export function PersonView({ person }: { person: Person }) {
	const { prev, next } = neighbours(person.slug)
	const setFocus = useScene((s) => s.setFocus)
	const setCursor = useUi((s) => s.setCursor)
	const outfit = useOutfit(person.slug)
	const index = PEOPLE.findIndex((p) => p.slug === person.slug) + 1

	useEffect(() => {
		setFocus(person.slug)
	}, [person.slug, setFocus])

	const hours = person.dossier.peakHours.map((h) => `${pad2(h)}:00`).join(" / ")

	return (
		<>
			<VisitTracker route={`/p/${person.slug}`} />
			<ScreenSpy total={6} />
			<Rail text={`spec. ${person.dossier.spec} · sample id ${person.slug} · iso 2026`} />

			{/* ============================================ 01 HERO — КАРТОТЕКА */}
			<Screen index={1} stage="hero" className="screen shell pass">
				{/* the giant nickname behind the sculpture, cropped by both edges */}
				<div
					className="behind"
					style={{
						position: "absolute",
						inset: 0,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						overflow: "hidden",
						pointerEvents: "none",
					}}
					aria-hidden="true"
				>
					<span className="hero-name" style={{ marginLeft: "-6vw" }}>
						{person.hero}
					</span>
					<span className="hero-name" style={{ marginLeft: "18vw", opacity: 0.14 }}>
						{person.hero}
					</span>
				</div>

				{/* the front half of the sandwich */}
				<div
					className="above"
					style={{
						position: "absolute",
						inset: 0,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						overflow: "hidden",
						pointerEvents: "none",
					}}
					aria-hidden="true"
				>
					<span className="hero-name hero-name--front" style={{ marginLeft: "-6vw" }}>
						{person.hero}
					</span>
					<span
						className="hero-name hero-name--front"
						style={{ marginLeft: "18vw", opacity: 0.16 }}
					>
						{person.hero}
					</span>
				</div>

				{/* the card: who this is, in the chat's own numbers */}
				<div
					className="above"
					style={{
						position: "relative",
						maxWidth: 360,
						padding: 22,
						border: "1px solid var(--line)",
						background: "var(--glass)",
						backdropFilter: "blur(8px)",
					}}
				>
					<div className="micro" style={{ display: "flex", justifyContent: "space-between" }}>
						<span>образец {pad2(index)} / {pad2(PEOPLE.length)}</span>
						<span>spec. {person.dossier.spec}</span>
					</div>

					<h1 className="display" style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1, margin: "14px 0 6px" }}>
						{person.hero}
					</h1>
					<div className="label" style={{ color: "var(--accent-2)" }}>
						{person.title}
					</div>

					<p style={{ marginTop: 14, color: "var(--muted)" }}>
						<Reveal text={person.tagline} />
					</p>

					<div style={{ marginTop: 16 }}>
						<Row label="сообщений" value={person.stats.messages.toLocaleString("ru-RU")} />
						<Row label="акт. дней" value={String(person.dossier.activeDays)} />
						<Row label="ночных" value={`${person.stats.nightPct} %`} />
						<Row label="пик" value={hours} />
						<Row
							label="реакций"
							value={person.dossier.reactionsReceived.toLocaleString("ru-RU")}
						/>
					</div>

					{person.anonymous ? (
						<div className="micro" style={{ marginTop: 14, color: "var(--accent)" }}>
							аккаунт удалён · имя не показываем
						</div>
					) : (
						<div className="micro" style={{ marginTop: 14 }}>{person.handle}</div>
					)}
				</div>

				{/* hints */}
				<div
					className="above"
					style={{
						position: "absolute",
						left: "var(--margin)",
						bottom: "calc(var(--margin) + 4px)",
						display: "flex",
						gap: 20,
						alignItems: "center",
					}}
				>
					<ScrollHint />
					<span
						className="micro"
						onPointerEnter={() => setCursor("drag")}
						onPointerLeave={() => setCursor("default")}
					>
						◜ drag to rotate ◝
					</span>
				</div>
			</Screen>

			{/* ==================================================== 02 ДОСЬЕ */}
			<Screen index={2} stage="wide" className="screen shell above">
				<div className="grid12" style={{ alignItems: "start", rowGap: 40 }}>
					<div style={{ gridColumn: "span 4" }}>
						<div className="micro">02 · досье образца</div>
						<h2 className="display" style={{ fontSize: "var(--t-h2)", marginTop: 12 }}>
							{person.title}
						</h2>
						<p style={{ marginTop: 16, color: "var(--muted)", maxWidth: "36ch" }}>
							{person.description}
						</p>

						<div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
							{person.emoji.map((e) => (
								<span key={e} className="chip" style={{ fontSize: 16 }}>
									{e}
								</span>
							))}
						</div>
					</div>

					<div style={{ gridColumn: "span 4" }}>
						<div className="micro">карта измерений</div>
						<div style={{ marginTop: 12 }}>
							<Row label="первое сообщение" value={person.dossier.firstSeen} />
							<Row label="последнее" value={person.dossier.lastSeen} />
							<Row label="активных дней" value={String(person.dossier.activeDays)} />
							<Row label="часы активности" value={hours} />
							<Row label="средняя длина" value={`${person.stats.avgLen} зн`} />
							<Row label="капс" value={`${person.stats.capsPct} %`} />
							<Row label="ночные" value={`${person.stats.nightPct} %`} />
							<Row label="медиа" value={person.dossier.mediaShared.toLocaleString("ru-RU")} />
						</div>
					</div>

					<div style={{ gridColumn: "span 4" }}>
						<div className="micro">ачивки</div>
						<ol style={{ marginTop: 12 }}>
							{person.achievements.map((a, i) => (
								<li
									key={a}
									style={{
										display: "flex",
										gap: 12,
										padding: "10px 0",
										borderBottom: "1px solid var(--line)",
									}}
								>
									<span className="micro num" style={{ color: "var(--accent)" }}>
										{pad2(i + 1)}
									</span>
									<span>{a}</span>
								</li>
							))}
						</ol>

						<div style={{ marginTop: 24 }}>
							<LabAnalysisPanel person={person} />
						</div>
					</div>
				</div>
			</Screen>

			{/* =================================================== 03 СОСТАВ */}
			<Screen index={3} stage="wide" className="screen shell above">
				<div className="grid12" style={{ rowGap: 40, alignItems: "start" }}>
					<div style={{ gridColumn: "span 4" }}>
						<div className="micro">03 · состав</div>
						<h2 className="display" style={{ fontSize: "var(--t-h2)", marginTop: 12 }}>
							Формула участника
						</h2>
						<p className="micro" style={{ marginTop: 14, lineHeight: 1.8 }}>
							состав выведен из выгрузки: доля мемных фраз, смеха,
							коротких реплик, эмодзи, вопросов, ночных сообщений и медиа.
						</p>
					</div>

					<div style={{ gridColumn: "span 8" }}>
						{person.formula.map((f, i) => (
							<div key={f.label} style={{ padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "baseline",
										gap: 16,
										marginBottom: 10,
									}}
								>
									<span className="label" style={{ color: "var(--clay)" }}>
										{f.label}
									</span>
									<span className="num display" style={{ fontSize: "1.5rem" }}>
										<Counter value={f.value} duration={1100 + i * 90} suffix=" %" />
									</span>
								</div>
								<Tube value={f.value} delay={i * 110} />
							</div>
						))}
						<div className="micro" style={{ marginTop: 16 }}>
							сумма состава — 100 % · погрешность лаборатории не признана
						</div>
					</div>
				</div>
			</Screen>

			{/* =================================================== 04 ЦИТАТЫ */}
			<Screen index={4} stage="wide" className="screen above">
				<div className="shell">
					<div className="micro">04 · цитаты из выгрузки</div>
					<h2 className="display" style={{ fontSize: "var(--t-h2)", marginTop: 12, marginBottom: 28 }}>
						Говорит сам
					</h2>
				</div>

				<div className="shell">
					<DragCarousel hint="Тяните">
						{person.quotes.map((q, i) => (
							<figure
								key={q}
								style={{
									flex: "0 0 auto",
									width: "min(78vw, 620px)",
									padding: 28,
									border: "1px solid var(--line)",
									background: "rgba(18,33,26,0.55)",
									minHeight: 320,
									display: "flex",
									flexDirection: "column",
									justifyContent: "space-between",
								}}
							>
								<div className="micro num">
									{pad2(i + 1)} / {pad2(person.quotes.length)}
								</div>
								<blockquote
									className="display"
									style={{ fontSize: "var(--t-quote)", lineHeight: 1.06, margin: "24px 0" }}
								>
									«{q}»
								</blockquote>
								<figcaption className="micro">
									{person.hero} · вербатим из чата
								</figcaption>
							</figure>
						))}
					</DragCarousel>

					<div
						style={{ marginTop: 32, display: "flex", gap: 8, flexWrap: "wrap" }}
						onPointerEnter={() => setCursor("emoji")}
						onPointerLeave={() => setCursor("default")}
					>
						<span className="micro" style={{ marginRight: 8 }}>фирменные слова:</span>
						{person.memes.map((m) => (
							<span key={m} className="chip">
								{m}
							</span>
						))}
					</div>
				</div>
			</Screen>

			{/* ================================================= 05 ГАРДЕРОБ */}
			<Screen index={5} stage="wardrobe" className="screen shell above">
				<div className="grid12" style={{ rowGap: 32, alignItems: "start" }}>
					<div style={{ gridColumn: "span 5" }}>
						<div className="micro">05 · гардероб</div>
						<h2 className="display" style={{ fontSize: "var(--t-h2)", marginTop: 12 }}>
							Переоденьте образец
						</h2>
						<p style={{ marginTop: 16, color: "var(--muted)", maxWidth: "40ch" }}>{person.look}</p>

						<div style={{ marginTop: 20 }}>
							<Row label="текущая поза" value={POSE_NAMES[poseIndex(outfit.pose)] ?? "—"} />
							<Row label="свет" value={outfit.env} />
							<Row label="база модели" value={person.model.base} />
							<Row label="рост" value={`${person.model.height.toFixed(2)} м`} />
						</div>

						<div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
							<WakeButton />
						</div>
					</div>

					<div style={{ gridColumn: "span 4", gridColumnStart: 9 }}>
						<Wardrobe person={person} />
					</div>
				</div>
			</Screen>

			{/* =================================================== 06 СВЯЗИ */}
			<Screen index={6} stage="wide" className="screen shell above">
				<div className="micro">06 · связи в зале</div>
				<h2 className="display" style={{ fontSize: "var(--t-h2)", marginTop: 12, marginBottom: 28 }}>
					С кем реагирует
				</h2>

				<div className="grid12" style={{ rowGap: 20 }}>
					{person.links.map((l) => (
						<Link
							key={`${l.kind}-${l.to}`}
							href={`/p/${l.to}`}
							style={{
								gridColumn: "span 4",
								padding: 20,
								border: "1px solid var(--line)",
								display: "block",
							}}
							onPointerEnter={() => setCursor("link")}
							onPointerLeave={() => setCursor("default")}
						>
							<div className="micro" style={{ display: "flex", justifyContent: "space-between" }}>
								<span>{l.kind === "reply" ? "ответы" : "реакции"}</span>
								<span className="num">{l.weight.toLocaleString("ru-RU")}</span>
							</div>
							<div className="display" style={{ fontSize: "1.75rem", marginTop: 10 }}>
								{l.to}
							</div>
							<div className="label" style={{ marginTop: 6 }}>{l.label}</div>
						</Link>
					))}
				</div>

				<div
					style={{
						marginTop: 48,
						display: "flex",
						gap: 16,
						flexWrap: "wrap",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Link href={`/p/${prev.slug}`} className="btn">
						← {prev.hero}
					</Link>
					<Link href="/together" className="label ul">
						все вместе — общий снимок
					</Link>
					<Link href={`/p/${next.slug}`} className="btn">
						{next.hero} →
					</Link>
				</div>

				<div className="micro" style={{ marginTop: 24 }}>
					всего в зале {CHAT.totals.people} образцов · {CHAT.years}
				</div>
			</Screen>

			<Footer />
		</>
	)
}

export default PersonView
