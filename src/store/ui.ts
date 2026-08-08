"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CursorMode = "default" | "drag" | "link" | "emoji" | "hidden"

export type Bubble = { slug: string; text: string; at: number } | null

type UiState = {
	/** preloader finished at least once in this tab */
	introDone: boolean
	setIntroDone: (v: boolean) => void

	/* toggles (persisted) */
	acid: boolean
	vhs: boolean
	motion: boolean
	sound: boolean
	toggleAcid: () => void
	toggleVhs: () => void
	toggleMotion: () => void
	toggleSound: () => void

	/* achievements (persisted) */
	visited: string[]
	markVisited: (route: string) => void
	labUnlocked: boolean
	unlockLab: () => void

	/* transient */
	cursor: CursorMode
	setCursor: (m: CursorMode) => void
	terminalOpen: boolean
	setTerminal: (v: boolean) => void
	bubble: Bubble
	setBubble: (b: Bubble) => void
	/** incremented by the "разбудить чат" button; the canvas watches it */
	wake: number
	pokeWake: () => void
	/** which slug the /together scene has highlighted */
	highlight: string | null
	setHighlight: (s: string | null) => void
}

export const useUi = create<UiState>()(
	persist(
		(set) => ({
			introDone: false,
			setIntroDone: (v) => set({ introDone: v }),

			acid: false,
			vhs: false,
			motion: true,
			sound: false,
			toggleAcid: () => set((s) => ({ acid: !s.acid })),
			toggleVhs: () => set((s) => ({ vhs: !s.vhs })),
			toggleMotion: () => set((s) => ({ motion: !s.motion })),
			toggleSound: () => set((s) => ({ sound: !s.sound })),

			visited: [],
			markVisited: (route) =>
				set((s) => (s.visited.includes(route) ? s : { visited: [...s.visited, route] })),
			labUnlocked: false,
			unlockLab: () => set({ labUnlocked: true }),

			cursor: "default",
			setCursor: (m) => set({ cursor: m }),
			terminalOpen: false,
			setTerminal: (v) => set({ terminalOpen: v }),
			bubble: null,
			setBubble: (b) => set({ bubble: b }),
			wake: 0,
			pokeWake: () => set((s) => ({ wake: s.wake + 1 })),
			highlight: null,
			setHighlight: (s2) => set({ highlight: s2 }),
		}),
		{
			name: "omsk-impire.ui.v1",
			partialize: (s) => ({
				acid: s.acid,
				vhs: s.vhs,
				motion: s.motion,
				sound: s.sound,
				visited: s.visited,
				labUnlocked: s.labUnlocked,
			}),
		},
	),
)
