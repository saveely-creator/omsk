"use client"

/**
 * Thin bridge between the DOM layer and the persistent WebGL canvas.
 * Kept free of three.js imports on purpose: DOM components (preloader,
 * wardrobe, page chrome) can read and write it without pulling three into
 * their bundle.
 */

import { create } from "zustand"

/** Which framing the canvas should hold for the current scroll position. */
export type Stage = "hero" | "wardrobe" | "wide" | "off"

type SceneState = {
	/** first frame rendered: releases the preloader */
	ready: boolean
	setReady: (v: boolean) => void

	/** slug the hub carousel is centred on (also used for hover preload) */
	focus: string | null
	setFocus: (slug: string | null) => void

	stage: Stage
	setStage: (stage: Stage) => void

	/** 0..1 scroll progress of the current hero, drives the parallax */
	heroProgress: number
	setHeroProgress: (v: number) => void
}

export const useScene = create<SceneState>()((set) => ({
	ready: false,
	setReady: (v) => set({ ready: v }),
	focus: null,
	setFocus: (slug) => set({ focus: slug }),
	stage: "hero",
	setStage: (stage) => set({ stage }),
	heroProgress: 0,
	setHeroProgress: (v) => set({ heroProgress: v }),
}))

/* ------------------------------------------------------- canvas commands */

export const RESET_CAMERA = "museum:reset-camera"
export const GROUP_SHOT = "museum:group-shot"
export const SHUFFLE = "museum:shuffle"

export function resetCamera() {
	if (typeof window === "undefined") return
	window.dispatchEvent(new Event(RESET_CAMERA))
}

export function requestGroupShot() {
	if (typeof window === "undefined") return
	window.dispatchEvent(new Event(GROUP_SHOT))
}
