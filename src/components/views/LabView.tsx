"use client"

/**
 * /lab — the secret room. Opened by ten clicks on the logo (or /lab in the
 * terminal). Holds exhibit 000 (three candy messages that somebody sent once),
 * the hidden admin sculpture and the achievement progress board.
 */

import Link from "next/link"
import { useEffect } from "react"

import { Counter, Footer, MagneticButton, Rail, Reveal, VisitTracker } from "@/components/chrome"
import { LabAnalysisPanel, Screen, ScreenSpy, WakeButton } from "@/components/flow"
import { CHAT } from "@/data/chat"
import { PEOPLE, PEOPLE_BY_SLUG } from "@/data/people"
import { ACHIEVEMENT_PAGES, visitedProgress } from "@/lib/easter"
import { resetCamera, useScene } from "@/store/scene"
import { useUi } from "@/store/ui"

export function LabView() {
	const setStage = useScene((s) => s.setStage)
	const visited = useUi((s) => s.visited)
	const toggleVhs = useUi((s) => s.toggleVhs)
	const vhs = useUi((s) => s.vhs)
	const admin = PEOPLE_BY_SLUG.shadow ?? PEOPLE[0]
	const progress = visitedProgress(visited)

	useEffect(() => {
		setStage("hero")
	}, [setStage])

	return (
		<>
			<VisitTracker route="/lab" />
			<ScreenSpy total={2} />
			<Rail text="restricted · exhibit 000 · iso 2026" />

			{/* ============================================== 01 ЭКСПОНАТ 000 */}
			<Screen index={1} stage="hero" className="screen shell pass">
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
					<span className="hero-name">000</span>
				</div>

				<div
					className="above"
					style={{
						position: "relative",
						maxWidth: 400,
						padding: 22,
						border: "1px solid var(--line-strong)",
						background: "var(--glass)",
						backdropFilter: "blur(8px)",
					}}
				>
					<div className="micro" style={{ color: "var(--accent)" }}>
						закрытая секция · вход по 10 кликам по логотипу
					</div>
					<h1 className="display" style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1, marginTop: 12 }}>
						<Reveal text="Экспонат 000" />
					</h1>
					<p style={{ marginTop: 14, color: "var(--muted)" }}>
						Три сообщения 🍬🍬🍬 — всё, что осталось от одного участника
						в выгрузке. Ни одного слова, три капсулы. Стоят здесь как есть.
					</p>

					<div className="hairline" style={{ margin: "18px 0" }} />

					<div className="micro">скрытая модель админа</div>
					<div className="display" style={{ fontSize: "1.75rem", marginTop: 8 }}>
						{admin.hero} · god mode
					</div>
					<p className="micro" style={{ marginTop: 8, lineHeight: 1.7 }}>
						в ацид-свете, с нимбом и крыльями. В обычном зале такого не
						выставляют.
					</p>

					<div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
						<WakeButton />
						<MagneticButton onClick={() => resetCamera()}>сброс камеры</MagneticButton>
						<MagneticButton onClick={() => toggleVhs()}>
							vhs {vhs ? "●" : "○"}
						</MagneticButton>
					</div>
				</div>
			</Screen>

			{/* ============================================== 02 ЛАБОРАТОРИЯ */}
			<Screen index={2} stage="off" className="screen shell above">
				<div className="grid12" style={{ rowGap: 40, alignItems: "start" }}>
					<div style={{ gridColumn: "span 5" }}>
						<div className="micro">02 · журнал лаборатории</div>
						<h2 className="display" style={{ fontSize: "var(--t-h2)", marginTop: 12 }}>
							Ачивка за весь зал
						</h2>
						<p style={{ marginTop: 14, color: "var(--muted)" }}>
							Посетите все страницы — и зал отметит вас как единственного,
							кто дошёл до конца.
						</p>

						<div
							style={{
								marginTop: 20,
								display: "flex",
								alignItems: "baseline",
								justifyContent: "space-between",
								borderBottom: "1px solid var(--line)",
								paddingBottom: 12,
							}}
						>
							<span className="micro">прогресс</span>
							<span className="display num" style={{ fontSize: "2rem" }}>
								<Counter value={progress.done} /> / {progress.total}
							</span>
						</div>

						<ul style={{ marginTop: 14 }}>
							{ACHIEVEMENT_PAGES.map((route) => (
								<li
									key={route}
									style={{
										display: "flex",
										justifyContent: "space-between",
										padding: "10px 0",
										borderBottom: "1px solid var(--line)",
									}}
								>
									<Link href={route} className="label ul">
										{route}
									</Link>
									<span className="micro" style={{ color: visited.includes(route) ? "var(--accent)" : undefined }}>
										{visited.includes(route) ? "посещено" : "не посещено"}
									</span>
								</li>
							))}
						</ul>

						<div className="micro" style={{ marginTop: 16, lineHeight: 1.8 }}>
							терминал: ~ · команды /who /quote /random /lab /acid /vhs /wake
							<br />
							конами-код: ↑↑↓↓←→←→ b a
							<br />
							консоль браузера: там тоже есть кое-что
						</div>
					</div>

					<div style={{ gridColumn: "span 4" }}>
						<LabAnalysisPanel person={admin} />
					</div>

					<div style={{ gridColumn: "span 3" }}>
						<div className="micro">сводка зала</div>
						<div className="display num" style={{ fontSize: "3rem", marginTop: 10, lineHeight: 1 }}>
							{CHAT.totals.messages.toLocaleString("ru-RU")}
						</div>
						<div className="micro" style={{ marginTop: 8 }}>сообщений в выгрузке</div>
						<div className="micro" style={{ marginTop: 18, lineHeight: 1.8 }}>
							дней без оффтопа: 0
							<br />
							образцов в зале: {CHAT.totals.people}
							<br />
							голосовые чаты: ≈ 4787 ч
						</div>
						<Link href="/together" className="btn" style={{ marginTop: 20, display: "inline-block" }}>
							к общему снимку →
						</Link>
					</div>
				</div>
			</Screen>

			<Footer />
		</>
	)
}

export default LabView
