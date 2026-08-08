"use client"

/**
 * One canvas for the whole museum. Mounted once in the root layout, never
 * unmounted on navigation, so the renderer, matcaps and shadow buffers are
 * reused between routes and nothing "reloads" when you open another sample.
 */

import { Suspense, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"

import { useDpr, useMotionOff } from "@/lib/hooks"
import { useScene } from "@/store/scene"
import { useUi } from "@/store/ui"
import { SceneRoot } from "./scenes"

export function PersistentCanvas() {
	const dpr = useDpr()
	const motionOff = useMotionOff()
	const stage = useScene((s) => s.stage)
	const vhs = useUi((s) => s.vhs)
	const host = useRef<HTMLDivElement>(null)

	/* With reduced motion we run on demand; a nudge on input keeps it responsive. */
	useEffect(() => {
		if (!motionOff) return
		const el = host.current
		if (!el) return
		const nudge = () => {
			el.dispatchEvent(new Event("pointermove", { bubbles: true }))
		}
		window.addEventListener("scroll", nudge, { passive: true })
		return () => window.removeEventListener("scroll", nudge)
	}, [motionOff])

	return (
		<div
			ref={host}
			className="canvas-host"
			data-stage={stage}
			data-vhs={vhs ? "on" : "off"}
		>
			<Canvas
				dpr={dpr}
				shadows
				frameloop={motionOff ? "demand" : "always"}
				flat={false}
				gl={{
					antialias: true,
					alpha: true,
					// required by "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c PNG": we read the buffer back after the frame
					preserveDrawingBuffer: true,
					powerPreference: "high-performance",
					stencil: false,
				}}
				camera={{ position: [0, 1.05, 3.2], fov: 34, near: 0.1, far: 60 }}
				onCreated={({ gl }) => {
					gl.toneMapping = THREE.ACESFilmicToneMapping
					gl.toneMappingExposure = 1.04
					gl.shadowMap.type = THREE.PCFSoftShadowMap
					gl.setClearColor(0x000000, 0)
				}}
			>
				<Suspense fallback={null}>
					<SceneRoot />
				</Suspense>
			</Canvas>
		</div>
	)
}

export default PersistentCanvas
