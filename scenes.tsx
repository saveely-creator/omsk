"use client"

/**
 * Scenes that live inside the single persistent canvas. The canvas is never
 * recreated on navigation: SceneRoot just swaps which scene is mounted, so
 * materials, matcaps and the shadow buffer survive route changes.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Html, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { usePathname, useRouter } from "next/navigation"
import * as THREE from "three"

import { PEOPLE, PEOPLE_BY_SLUG, SLUGS, randomQuote } from "@/data/people"
import { PRESETS, type Outfit } from "@/data/wardrobe"
import { resolveOutfit, useOutfit, useOutfitStore } from "@/store/outfit"
import { useScene, RESET_CAMERA } from "@/store/scene"
import { useUi } from "@/store/ui"
import { useIsMobile, useMotionOff } from "@/lib/hooks"
import { mulberry32, sfx } from "@/lib/easter"
import { Figure } from "./Figure"
import { MatcapProvider } from "./props"
import { Effects, Floor, Mist, Plinth, Pollen, Rig, rigOf } from "./Stage"

/* ------------------------------------------------------------- utilities */

/** Turns the "\u0440\u0430\u0437\u0431\u0443\u0434\u0438\u0442\u044c \u0447\u0430\u0442" counter into a timestamp the figures can decay from. */
function useWakeStamp(): number {
	const wake = useUi((s) => s.wake)
	const [stamp, setStamp] = useState(0)
	useEffect(() => {
		if (wake > 0) setStamp(performance.now())
	}, [wake])
	return stamp
}

/**
 * Shifts the projection instead of the camera, so the sculpture can slide left
 * for the wardrobe panel without fighting OrbitControls.
 */
function ViewShift({ x }: { x: number }) {
	const { camera, size, invalidate } = useThree()
	const cur = useRef(0)

	useFrame(() => {
		const cam = camera as THREE.PerspectiveCamera
		if (Math.abs(x - cur.current) < 0.0005) return
		cur.current += (x - cur.current) * 0.08
		if (Math.abs(cur.current) < 0.002) {
			cam.clearViewOffset()
		} else {
			cam.setViewOffset(
				size.width,
				size.height,
				cur.current * size.width,
				0,
				size.width,
				size.height,
			)
		}
		invalidate()
	})

	useEffect(() => {
		const cam = camera as THREE.PerspectiveCamera
		return () => cam.clearViewOffset()
	}, [camera])

	return null
}

/** Speech bubble with a real quote, anchored over the sculpture's head. */
function QuoteBubble({ slug, y }: { slug: string; y: number }) {
	const bubble = useUi((s) => s.bubble)
	const setBubble = useUi((s) => s.setBubble)

	useEffect(() => {
		if (!bubble) return
		const t = setTimeout(() => setBubble(null), 4600)
		return () => clearTimeout(t)
	}, [bubble, setBubble])

	if (!bubble || bubble.slug !== slug) return null

	return (
		<Html position={[0.16, y, 0]} center distanceFactor={3.4} zIndexRange={[20, 10]}>
			<div
				style={{
					maxWidth: 260,
					padding: "12px 16px",
					background: "rgba(22,50,31,0.92)",
					border: "1px solid rgba(234,243,236,0.16)",
					borderRadius: 8,
					color: "var(--clay, #EAF3EC)",
					fontSize: 15,
					lineHeight: 1.35,
					backdropFilter: "blur(6px)",
					pointerEvents: "none",
					whiteSpace: "pre-wrap",
				}}
			>
				{bubble.text}
			</div>
		</Html>
	)
}

/* --------------------------------------------------------- person scene */

export function PersonScene({ slug }: { slug: string }) {
	const person = PEOPLE_BY_SLUG[slug]
	const outfit = useOutfit(slug)
	const stage = useScene((s) => s.stage)
	const heroProgress = useScene((s) => s.heroProgress)
	const setBubble = useUi((s) => s.setBubble)
	const acid = useUi((s) => s.acid)
	const vhs = useUi((s) => s.vhs)
	const motionOff = useMotionOff()
	const mobile = useIsMobile()
	const wake = useWakeStamp()

	const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null)
	const rig = useRef<THREE.Group>(null)
	const [touched, setTouched] = useState(false)

	const env = acid ? "acid" : outfit.env
	const light = rigOf(env)

	useEffect(() => {
		const onReset = () => {
			controls.current?.reset()
			setTouched(false)
		}
		window.addEventListener(RESET_CAMERA, onReset)
		return () => window.removeEventListener(RESET_CAMERA, onReset)
	}, [])

	useFrame(() => {
		if (!rig.current) return
		const targetY = -heroProgress * 0.42
		rig.current.position.y += (targetY - rig.current.position.y) * 0.1
	})

	const onFigureClick = useCallback(() => {
		if (!person) return
		setBubble({ slug, text: randomQuote(person), at: Date.now() })
		sfx.tick()
	}, [person, setBubble, slug])

	if (!person) return null

	const shift = stage === "wardrobe" && !mobile ? 0.17 : 0

	return (
		<MatcapProvider rim={light.rimColor} sss={0.28 + light.fill * 0.2}>
			<PerspectiveCamera makeDefault fov={mobile ? 40 : 33} position={[0, 1.05, 3.15]} />
			<ViewShift x={shift} />
			<Mist color={light.bg} density={0.16} />
			<Rig env={env} />

			<group ref={rig}>
				<group
					onClick={onFigureClick}
					onPointerOver={() => useUi.getState().setCursor("drag")}
					onPointerOut={() => useUi.getState().setCursor("default")}
				>
					<Figure
						outfit={outfit}
						accent={person.model.accent}
						height={person.model.height}
						seed={person.slug}
						opacity={person.anonymous ? 0.42 : 1}
						animate={!motionOff}
						wake={wake}
					/>
				</group>

				<Plinth radius={0.6} height={0.15} />
				<Floor y={-0.15} />
				{motionOff ? null : <Pollen count={mobile ? 40 : 90} area={2.2} color={person.model.accent} />}
				<QuoteBubble slug={slug} y={person.model.height * 0.62 + 0.35} />
			</group>

			<OrbitControls
				ref={controls}
				makeDefault
				target={[0, 0.82, 0]}
				enablePan={false}
				enableDamping
				dampingFactor={0.06}
				rotateSpeed={0.75}
				zoomSpeed={0.6}
				minDistance={1.9}
				maxDistance={4.2}
				minPolarAngle={Math.PI * 0.26}
				maxPolarAngle={Math.PI * 0.56}
				autoRotate={!touched && !motionOff}
				autoRotateSpeed={0.5}
				onStart={() => setTouched(true)}
			/>

			<Effects
				quality={motionOff ? "off" : mobile ? "low" : "high"}
				focus={3.1}
				vhs={vhs}
			/>
		</MatcapProvider>
	)
}

/* ------------------------------------------------------------ hub scene */

/** Catalogue row: the figures track the DOM drag carousel. */
export function HubScene() {
	const focus = useScene((s) => s.focus)
	const acid = useUi((s) => s.acid)
	const vhs = useUi((s) => s.vhs)
	const overrides = useOutfitStore((s) => s.overrides)
	const motionOff = useMotionOff()
	const mobile = useIsMobile()
	const wake = useWakeStamp()
	const row = useRef<THREE.Group>(null)

	const gap = 1.35
	const index = focus ? Math.max(0, SLUGS.indexOf(focus)) : 0
	const light = rigOf(acid ? "acid" : "studio")

	useFrame(() => {
		if (!row.current) return
		const targetX = -index * gap
		row.current.position.x += (targetX - row.current.position.x) * 0.075
	})

	return (
		<MatcapProvider rim={light.rimColor} sss={0.3}>
			<PerspectiveCamera makeDefault fov={mobile ? 42 : 32} position={[0, 1.15, 3.6]} />
			<Mist color="#0B1410" density={0.2} />
			<Rig env={acid ? "acid" : "studio"} />

			<group ref={row} position={[0, 0, 0]}>
				{PEOPLE.map((person, i) => {
					const near = Math.abs(i - index) <= 2
					if (!near) return null
					const outfit: Outfit = resolveOutfit(person.slug, overrides[person.slug])
					return (
						<group key={person.slug} position={[i * gap, 0, 0]}>
							<Figure
								outfit={outfit}
								accent={person.model.accent}
								height={person.model.height}
								seed={person.slug}
								opacity={person.anonymous ? 0.42 : 1}
								animate={!motionOff && i === index}
								wake={wake}
								lod={i === index ? "high" : "low"}
								rotation={[0, i === index ? 0 : (i - index) * 0.22, 0]}
							/>
							<Plinth radius={0.52} height={0.12} />
						</group>
					)
				})}
			</group>

			<Floor y={-0.12} />
			{motionOff ? null : <Pollen count={mobile ? 30 : 70} area={2.6} />}

			<Effects quality={motionOff ? "off" : mobile ? "low" : "high"} focus={3.6} vhs={vhs} />
		</MatcapProvider>
	)
}

/* ------------------------------------------------------- together scene */

/** Group-photo arrangement on one big stone podium. */
function arrangement(seed: number) {
	const rnd = mulberry32(seed * 7919 + 13)
	const order = [...PEOPLE].sort((a, b) => b.stats.messages - a.stats.messages)
	const back = order.filter((_, i) => i % 2 === 0)
	const front = order.filter((_, i) => i % 2 === 1)

	const place = (list: typeof order, z: number, y: number) =>
		list.map((person, i) => {
			const span = (list.length - 1) / 2
			const x = (i - span) * 0.62 + (rnd() - 0.5) * 0.09
			return {
				person,
				position: [x, y, z + (rnd() - 0.5) * 0.12] as THREE.Vector3Tuple,
				rotation: [0, -x * 0.22 + (rnd() - 0.5) * 0.12, 0] as THREE.Vector3Tuple,
			}
		})

	return [...place(back, -0.62, 0.22), ...place(front, 0.14, 0)]
}

export function TogetherScene() {
	const overrides = useOutfitStore((s) => s.overrides)
	const seed = useOutfitStore((s) => s.arrangement)
	const highlight = useUi((s) => s.highlight)
	const setHighlight = useUi((s) => s.setHighlight)
	const acid = useUi((s) => s.acid)
	const vhs = useUi((s) => s.vhs)
	const motionOff = useMotionOff()
	const mobile = useIsMobile()
	const wake = useWakeStamp()
	const router = useRouter()
	const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null)

	const cast = useMemo(() => arrangement(seed), [seed])
	const light = rigOf(acid ? "acid" : "studio")

	useEffect(() => {
		const onReset = () => controls.current?.reset()
		window.addEventListener(RESET_CAMERA, onReset)
		return () => window.removeEventListener(RESET_CAMERA, onReset)
	}, [])

	return (
		<MatcapProvider rim={light.rimColor} sss={0.3}>
			<PerspectiveCamera makeDefault fov={mobile ? 46 : 36} position={[0, 1.5, 5.4]} />
			<Mist color="#0B1410" density={0.13} />
			<Rig env={acid ? "acid" : "studio"} wide />

			<group position={[0, 0, 0]}>
				{cast.map(({ person, position, rotation }) => {
					const outfit: Outfit = resolveOutfit(person.slug, overrides[person.slug])
					const dim = highlight !== null && highlight !== person.slug
					return (
						<group
							key={person.slug}
							position={position}
							rotation={rotation}
							onPointerOver={(e) => {
								e.stopPropagation()
								setHighlight(person.slug)
								useUi.getState().setCursor("link")
							}}
							onPointerOut={() => {
								useUi.getState().setCursor("default")
							}}
							onClick={(e) => {
								e.stopPropagation()
								sfx.tick()
								if (highlight === person.slug) router.push(`/p/${person.slug}`)
								else setHighlight(person.slug)
							}}
						>
							<Figure
								outfit={outfit}
								accent={person.model.accent}
								height={person.model.height}
								seed={person.slug}
								clay={dim ? "#B9C9BE" : "#EAF3EC"}
								opacity={person.anonymous ? 0.4 : 1}
								animate={!motionOff}
								wake={wake}
								lod="low"
							/>
							{highlight === person.slug ? (
								<mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
									<ringGeometry args={[0.24, 0.27, 40]} />
									<meshBasicMaterial color={person.model.accent} transparent opacity={0.85} />
								</mesh>
							) : null}
						</group>
					)
				})}
			</group>

			{/* the podium everyone stands on */}
			<Plinth radius={2.7} height={0.22} square position={[0, 0.22, -0.24]} />
			<mesh position={[0, 0.11, -0.24]}>
				<boxGeometry args={[5.4, 0.22, 5.4]} />
				<meshStandardMaterial color="#101B15" roughness={0.95} metalness={0} />
			</mesh>
			<Floor y={0} />
			{motionOff ? null : <Pollen count={mobile ? 40 : 110} area={3.4} />}

			<OrbitControls
				ref={controls}
				makeDefault
				target={[0, 0.95, 0]}
				enablePan={false}
				enableDamping
				dampingFactor={0.06}
				rotateSpeed={0.6}
				minDistance={3.4}
				maxDistance={8}
				minPolarAngle={Math.PI * 0.24}
				maxPolarAngle={Math.PI * 0.52}
				autoRotate={!motionOff && highlight === null}
				autoRotateSpeed={0.28}
			/>

			<Effects quality={motionOff ? "off" : mobile ? "low" : "high"} focus={5.4} vhs={vhs} />
		</MatcapProvider>
	)
}

/* ------------------------------------------------------------ lab scene */

/** /lab: the hidden admin model, god mode by default, plus exhibit 000. */
export function LabScene() {
	const motionOff = useMotionOff()
	const mobile = useIsMobile()
	const vhs = useUi((s) => s.vhs)
	const wake = useWakeStamp()
	const admin = PEOPLE_BY_SLUG.shadow ?? PEOPLE[0]

	const outfit = useMemo<Outfit>(
		() => ({ ...admin.outfitDefault, ...PRESETS.godmode.patch, env: "acid" }) as Outfit,
		[admin],
	)

	const light = rigOf("acid")

	return (
		<MatcapProvider rim={light.rimColor} sss={0.36}>
			<PerspectiveCamera makeDefault fov={mobile ? 44 : 34} position={[0.4, 1.2, 3.2]} />
			<Mist color="#07170C" density={0.22} />
			<Rig env="acid" />

			<Figure
				outfit={outfit}
				accent="#B6FF2E"
				height={admin.model.height + 0.06}
				seed="admin"
				animate={!motionOff}
				wake={wake}
			/>
			<Plinth radius={0.62} height={0.18} />
			<Floor y={-0.18} />

			{/* exhibit 000: three candies that once appeared in the chat */}
			<group position={[-0.78, 0.06, 0.42]}>
				{[0, 1, 2].map((i) => (
					<mesh key={i} position={[i * 0.09 - 0.09, 0.04, i * 0.03]} rotation={[0, i, 0.4]}>
						<capsuleGeometry args={[0.026, 0.03, 3, 10]} />
						<meshStandardMaterial
							color="#E2564B"
							emissive="#E2564B"
							emissiveIntensity={0.35}
							roughness={0.5}
						/>
					</mesh>
				))}
			</group>

			{motionOff ? null : <Pollen count={mobile ? 40 : 120} area={2.4} color="#B6FF2E" />}

			<OrbitControls
				makeDefault
				target={[0, 0.85, 0]}
				enablePan={false}
				enableDamping
				dampingFactor={0.06}
				minDistance={2}
				maxDistance={4.4}
				minPolarAngle={Math.PI * 0.26}
				maxPolarAngle={Math.PI * 0.56}
				autoRotate={!motionOff}
				autoRotateSpeed={0.9}
			/>

			<Effects quality={motionOff ? "off" : mobile ? "low" : "high"} focus={3.2} vhs={vhs} />
		</MatcapProvider>
	)
}

/* ----------------------------------------------------------- scene root */

/** Marks the first rendered frame, which releases the preloader. */
function ReadyBridge() {
	const setReady = useScene((s) => s.setReady)
	const done = useRef(false)
	useFrame(() => {
		if (done.current) return
		done.current = true
		setReady(true)
	})
	return null
}

export function SceneRoot() {
	const pathname = usePathname() || "/"

	let scene: React.ReactNode = null
	if (pathname === "/") scene = <HubScene />
	else if (pathname.startsWith("/p/")) {
		const slug = pathname.split("/")[2]
		scene = PEOPLE_BY_SLUG[slug] ? <PersonScene slug={slug} /> : null
	} else if (pathname.startsWith("/together")) scene = <TogetherScene />
	else if (pathname.startsWith("/lab")) scene = <LabScene />

	return (
		<>
			<ReadyBridge />
			{scene}
		</>
	)
}
