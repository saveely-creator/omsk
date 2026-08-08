"use client"

/**
 * ГАРДЕРОБ — the customisation panel: ten slots, colour swatches, four presets,
 * share link, PNG export, camera reset. Desktop: a column beside the sculpture.
 * Mobile: a bottom sheet.
 */

import { useCallback, useEffect, useMemo, useState } from "react"

import type { Person } from "@/data/people"
import {
	PRESETS,
	PRESET_IDS,
	SLOT_SPEC,
	SWATCHES,
	SWATCH_IDS,
	WARDROBE,
	parseSlotValue,
	poseIndex,
	type PresetId,
	type Slot,
	type SwatchId,
} from "@/data/wardrobe"
import { buildShareUrl, parseFit } from "@/lib/fitUrl"
import { useIsMobile } from "@/lib/hooks"
import { sfx } from "@/lib/easter"
import { exportStampedPng, findSceneCanvas } from "@/lib/screenshot"
import { resetCamera } from "@/store/scene"
import { useOutfit, useOutfitStore } from "@/store/outfit"
import { MagneticButton } from "./chrome"

export function Wardrobe({ person }: { person: Person }) {
	const slug = person.slug
	const outfit = useOutfit(slug)
	const setSlot = useOutfitStore((s) => s.setSlot)
	const applyPreset = useOutfitStore((s) => s.applyPreset)
	const applyPatch = useOutfitStore((s) => s.applyPatch)
	const reset = useOutfitStore((s) => s.reset)
	const mobile = useIsMobile()

	const [slot, setActiveSlot] = useState<Slot>("top")
	const [sheetOpen, setSheetOpen] = useState(false)
	const [copied, setCopied] = useState(false)

	/* ?fit=hoodie.green,cap.black,pose.2 — applied once, from the real URL */
	useEffect(() => {
		const fit = new URLSearchParams(window.location.search).get("fit")
		if (!fit) return
		const patch = parseFit(fit)
		if (Object.keys(patch).length) applyPatch(slug, patch)
	}, [applyPatch, slug])

	const spec = SLOT_SPEC[slot]
	const current = parseSlotValue(slot, outfit[slot])
	const isPose = slot === "pose"
	const isEnv = slot === "env"
	const activeItem = spec.items.find((i) => i.id === current.item)
	const colorable = Boolean(activeItem?.colorable) && !isPose && !isEnv

	const pickItem = useCallback(
		(itemId: string, index: number, defaultColor: SwatchId, canColor: boolean) => {
			sfx.tick()
			if (isPose) {
				setSlot(slug, "pose", `pose.${index}`)
				return
			}
			if (isEnv) {
				setSlot(slug, "env", itemId)
				return
			}
			if (!canColor) {
				setSlot(slug, slot, itemId)
				return
			}
			/* keep the colour the user already chose for this slot */
			const keep = SWATCH_IDS.includes(current.variant as SwatchId)
				? (current.variant as SwatchId)
				: defaultColor
			setSlot(slug, slot, `${itemId}.${keep}`)
		},
		[current.variant, isEnv, isPose, setSlot, slot, slug],
	)

	const pickColor = useCallback(
		(sw: SwatchId) => {
			sfx.tick()
			setSlot(slug, slot, `${current.item}.${sw}`)
		},
		[current.item, setSlot, slot, slug],
	)

	const share = useCallback(async () => {
		const url = buildShareUrl(slug, outfit)
		try {
			await navigator.clipboard.writeText(url)
			setCopied(true)
			sfx.unlock()
			window.setTimeout(() => setCopied(false), 2400)
		} catch {
			window.prompt("Ссылка на образ:", url)
		}
	}, [outfit, slug])

	const savePng = useCallback(async () => {
		sfx.shutter()
		await exportStampedPng(findSceneCanvas(), {
			title: person.hero,
			subtitle: person.title,
			code: `spec. ${person.dossier.spec} · sample id ${slug}`,
			footer: "omsk impire / iso 2026",
			filename: `omsk-impire-${slug}.png`,
			portrait: true,
			scale: 2,
		})
	}, [person.dossier.spec, person.hero, person.title, slug])

	const poseActive = useMemo(() => poseIndex(outfit.pose), [outfit.pose])

	const panel = (
		<div
			className="thin-scroll"
			style={{
				border: "1px solid var(--line)",
				background: "var(--glass)",
				backdropFilter: "blur(10px)",
				padding: 20,
				maxHeight: mobile ? "58svh" : "none",
				overflowY: mobile ? "auto" : "visible",
			}}
		>
			<div className="flex items-baseline justify-between">
				<div className="micro">гардероб образца {person.dossier.spec}</div>
				<button type="button" className="micro ul" onClick={() => reset(slug)}>
					сбросить
				</button>
			</div>

			{/* presets */}
			<div className="mt-4 flex flex-wrap gap-2">
				{PRESET_IDS.map((id: PresetId) => (
					<button
						key={id}
						type="button"
						className="chip"
						title={PRESETS[id].note}
						onClick={() => {
							applyPreset(slug, id)
							sfx.tick()
						}}
					>
						{PRESETS[id].label}
					</button>
				))}
			</div>

			<div className="hairline" style={{ margin: "18px 0" }} />

			{/* slot tabs */}
			<div className="flex flex-wrap gap-x-4 gap-y-2">
				{WARDROBE.map((s) => (
					<button
						key={s.id}
						type="button"
						className="label ul"
						style={{ color: s.id === slot ? "var(--accent)" : undefined }}
						aria-pressed={s.id === slot}
						onClick={() => {
							setActiveSlot(s.id)
							sfx.hover()
						}}
					>
						{s.label}
					</button>
				))}
			</div>

			{/* items of the active slot */}
			<div className="mt-5 grid gap-2" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
				{spec.items.map((it, index) => {
					const active = isPose
						? poseActive === index
						: isEnv
							? outfit.env === it.id
							: current.item === it.id
					return (
						<button
							key={`${it.id}-${index}`}
							type="button"
							className="chip"
							aria-pressed={active}
							style={{ justifyContent: "space-between", minHeight: 44 }}
							onClick={() => pickItem(it.id, index, it.defaultColor, it.colorable)}
						>
							<span>{it.label}</span>
							{active ? <span style={{ color: "var(--accent)" }}>●</span> : null}
						</button>
					)
				})}
			</div>

			{/* swatches */}
			{colorable ? (
				<div className="mt-5">
					<div className="micro">цвет — {SWATCHES[(current.variant as SwatchId) in SWATCHES ? (current.variant as SwatchId) : "clay"].label}</div>
					<div className="mt-2 flex flex-wrap gap-2">
						{SWATCH_IDS.map((sw) => (
							<button
								key={sw}
								type="button"
								title={SWATCHES[sw].label}
								aria-label={SWATCHES[sw].label}
								aria-pressed={current.variant === sw}
								onClick={() => pickColor(sw)}
								style={{
									width: 44,
									height: 44,
									display: "grid",
									placeItems: "center",
									border: `1px solid ${current.variant === sw ? "var(--accent)" : "var(--line)"}`,
								}}
							>
								<span
									style={{
										width: 20,
										height: 20,
										borderRadius: 2,
										background: SWATCHES[sw].hex,
										boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.35)",
									}}
								/>
							</button>
						))}
					</div>
				</div>
			) : null}

			<div className="hairline" style={{ margin: "18px 0" }} />

			{/* actions */}
			<div className="flex flex-wrap gap-2">
				<MagneticButton onClick={() => resetCamera()}>сброс камеры</MagneticButton>
				<MagneticButton onClick={share}>{copied ? "ссылка скопирована" : "поделиться образом"}</MagneticButton>
				<MagneticButton onClick={savePng}>сохранить png</MagneticButton>
			</div>

			<p className="micro" style={{ marginTop: 14, lineHeight: 1.6 }}>
				образ сохраняется в браузере · ссылка вида ?fit=hoodie.moss,cap.ink,pose.2
			</p>
		</div>
	)

	if (!mobile) return panel

	return (
		<>
			<div className="flex">
				<MagneticButton onClick={() => setSheetOpen(true)}>открыть гардероб</MagneticButton>
			</div>

			{sheetOpen ? (
				<div
					style={{
						position: "fixed",
						insetInline: 0,
						bottom: 0,
						zIndex: 45,
						padding: "0 12px 12px",
					}}
					role="dialog"
					aria-label="Гардероб"
				>
					<div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 0" }}>
						<button type="button" className="chip" onClick={() => setSheetOpen(false)}>
							закрыть
						</button>
					</div>
					{panel}
				</div>
			) : null}
		</>
	)
}

export default Wardrobe
