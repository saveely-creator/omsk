"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useUi } from "@/store/ui"

/** True only after the first client render: guards localStorage-backed UI. */
export function useHydrated(): boolean {
	const [hydrated, setHydrated] = useState(false)
	useEffect(() => setHydrated(true), [])
	return hydrated
}

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false)
	useEffect(() => {
		const mql = window.matchMedia(query)
		setMatches(mql.matches)
		const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
		mql.addEventListener("change", onChange)
		return () => mql.removeEventListener("change", onChange)
	}, [query])
	return matches
}

export function useIsMobile(): boolean {
	return useMediaQuery("(max-width: 767px)")
}

export function useIsTouch(): boolean {
	return useMediaQuery("(hover: none)")
}

export function useSystemReducedMotion(): boolean {
	return useMediaQuery("(prefers-reduced-motion: reduce)")
}

/**
 * Single source of truth for "should we animate": the OS setting OR the
 * in-product "отключить анимации" toggle.
 */
export function useMotionOff(): boolean {
	const system = useSystemReducedMotion()
	const motion = useUi((s) => s.motion)
	return system || !motion
}

/** DPR clamp: retina on desktop, 1.5 max on phones (perf budget). */
export function useDpr(): [number, number] {
	const mobile = useIsMobile()
	return mobile ? [1, 1.5] : [1, 2]
}

/** Magnetic button: the element leans toward the pointer, then springs back. */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
	const ref = useRef<T | null>(null)
	const off = useMotionOff()

	useEffect(() => {
		const el = ref.current
		if (!el || off) return
		let raf = 0
		let tx = 0
		let ty = 0
		let cx = 0
		let cy = 0

		const loop = () => {
			cx += (tx - cx) * 0.14
			cy += (ty - cy) * 0.14
			el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`
			raf = requestAnimationFrame(loop)
		}

		const onMove = (e: PointerEvent) => {
			const r = el.getBoundingClientRect()
			tx = (e.clientX - (r.left + r.width / 2)) * strength
			ty = (e.clientY - (r.top + r.height / 2)) * strength
		}
		const onLeave = () => {
			tx = 0
			ty = 0
		}

		el.addEventListener("pointermove", onMove)
		el.addEventListener("pointerleave", onLeave)
		raf = requestAnimationFrame(loop)
		return () => {
			el.removeEventListener("pointermove", onMove)
			el.removeEventListener("pointerleave", onLeave)
			cancelAnimationFrame(raf)
			el.style.transform = ""
		}
	}, [off, strength])

	return ref
}

/** Sets the custom cursor label while the pointer is inside the element. */
export function useCursorZone(mode: "drag" | "link" | "emoji") {
	const setCursor = useUi((s) => s.setCursor)
	const onEnter = useCallback(() => setCursor(mode), [mode, setCursor])
	const onLeave = useCallback(() => setCursor("default"), [setCursor])
	return { onPointerEnter: onEnter, onPointerLeave: onLeave, onFocus: onEnter, onBlur: onLeave }
}

/** Fires when the element first enters the viewport. */
export function useInView<T extends Element>(threshold = 0.25) {
	const ref = useRef<T | null>(null)
	const [seen, setSeen] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el || seen) return
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setSeen(true)
						io.disconnect()
					}
				}
			},
			{ threshold },
		)
		io.observe(el)
		return () => io.disconnect()
	}, [seen, threshold])

	return { ref, seen }
}

export function useHotkey(match: (e: KeyboardEvent) => boolean, run: () => void) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const t = e.target as HTMLElement | null
			if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return
			if (match(e)) {
				e.preventDefault()
				run()
			}
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [match, run])
}
