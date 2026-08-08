"use client"

/**
 * The hall: stone plinth, matte floor with contact shadow, pollen, light rig
 * and post processing.
 *
 * The light rig is fully procedural (drei <Lightformer> inside <Environment>),
 * never a CDN HDRI, so the museum boots offline and on the first paint.
 */

import { useMemo, useRef } from "react"
import {
	ContactShadows,
	Environment,
	Lightformer,
	RoundedBox,
} from "@react-three/drei"
import {
	Bloom,
	ChromaticAberration,
	DepthOfField,
	EffectComposer,
	Noise,
	Vignette,
} from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import { ENV_RIGS } from "@/data/wardrobe"
import { makeStoneNormalMap } from "./matcap"

export type EnvId = keyof typeof ENV_RIGS

export function rigOf(env: string | undefined) {
	return ENV_RIGS[(env || "studio").split(".")[0]] ?? ENV_RIGS.studio
}

/* ----------------------------------------------------------------- plinth */

export function Plinth({
	radius = 0.62,
	height = 0.16,
	square = false,
	position = [0, 0, 0],
}: {
	radius?: number
	height?: number
	square?: boolean
	position?: THREE.Vector3Tuple
}) {
	const normalMap = useMemo(() => makeStoneNormalMap(256), [])

	const stone = (
		<meshStandardMaterial
			color="#131F19"
			roughness={0.96}
			metalness={0}
			normalMap={normalMap ?? undefined}
			normalScale={new THREE.Vector2(0.55, 0.55)}
		/>
	)

	return (
		<group position={position}>
			{square ? (
				<RoundedBox
					args={[radius * 2, height, radius * 2]}
					radius={0.018}
					smoothness={4}
					position={[0, -height / 2, 0]}
					receiveShadow
				>
					{stone}
				</RoundedBox>
			) : (
				<mesh position={[0, -height / 2, 0]} receiveShadow>
					<cylinderGeometry args={[radius, radius * 1.02, height, 48]} />
					{stone}
				</mesh>
			)}

			{/* thin lighter lip, so the stone edge catches the key light */}
			<mesh position={[0, -0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<ringGeometry args={[radius * 0.985, radius, square ? 4 : 48]} />
				<meshStandardMaterial color="#1D2F25" roughness={0.9} metalness={0} />
			</mesh>

			<ContactShadows
				position={[0, 0.002, 0]}
				scale={radius * 3.4}
				resolution={512}
				blur={2.6}
				opacity={0.62}
				far={1.2}
				color="#04120A"
				frames={1}
			/>
		</group>
	)
}

/** Matte floor that fades into the fog under the plinth. */
export function Floor({ y = -0.16 }: { y?: number }) {
	return (
		<mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
			<circleGeometry args={[9, 48]} />
			<meshStandardMaterial color="#0B1410" roughness={1} metalness={0} />
		</mesh>
	)
}

/* ----------------------------------------------------------------- pollen */

export function Pollen({
	count = 90,
	area = 2.4,
	color = "#8FA79A",
	animate = true,
}: {
	count?: number
	area?: number
	color?: string
	animate?: boolean
}) {
	const ref = useRef<THREE.Points>(null)

	const { positions, speeds } = useMemo(() => {
		const positions = new Float32Array(count * 3)
		const speeds = new Float32Array(count)
		for (let i = 0; i < count; i++) {
			positions[i * 3] = (Math.random() - 0.5) * area * 2
			positions[i * 3 + 1] = Math.random() * area * 1.1
			positions[i * 3 + 2] = (Math.random() - 0.5) * area
			speeds[i] = 0.012 + Math.random() * 0.04
		}
		return { positions, speeds }
	}, [count, area])

	useFrame((_, delta) => {
		if (!animate || !ref.current) return
		const attr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute
		const arr = attr.array as Float32Array
		const step = Math.min(delta, 0.05)
		for (let i = 0; i < count; i++) {
			arr[i * 3 + 1] += speeds[i] * step
			arr[i * 3] += Math.sin(arr[i * 3 + 1] * 2.4 + i) * 0.0006
			if (arr[i * 3 + 1] > area * 1.2) arr[i * 3 + 1] = -0.05
		}
		attr.needsUpdate = true
	})

	return (
		<points ref={ref} frustumCulled={false}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" args={[positions, 3]} />
			</bufferGeometry>
			<pointsMaterial
				size={0.009}
				color={color}
				transparent
				opacity={0.5}
				sizeAttenuation
				depthWrite={false}
				blending={THREE.AdditiveBlending}
			/>
		</points>
	)
}

/* ------------------------------------------------------------------- rig */

/**
 * Studio rig: key from above-front, mint rim from behind, weak fill, plus a
 * procedural environment map built from the same lightformers.
 */
export function Rig({
	env = "studio",
	wide = false,
	environment = true,
}: {
	env?: string
	wide?: boolean
	environment?: boolean
}) {
	const rig = rigOf(env)
	const spread = wide ? 2.1 : 1

	return (
		<>
			<ambientLight intensity={rig.fill * 0.6} color="#CFE6D8" />

			<directionalLight
				position={[1.6 * spread, 3.1, 2.4 * spread]}
				intensity={rig.key}
				color="#FFFFFF"
				castShadow
				shadow-mapSize={[1024, 1024]}
				shadow-bias={-0.0009}
			>
				<orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 0.1, 12]} />
			</directionalLight>

			<directionalLight
				position={[-1.4 * spread, 1.5, -2.6 * spread]}
				intensity={rig.rim}
				color={rig.rimColor}
			/>

			<directionalLight
				position={[-2.2 * spread, 0.6, 1.8 * spread]}
				intensity={rig.fill}
				color="#9FC4AE"
			/>

			{environment ? (
				<Environment resolution={256} frames={1}>
					<Lightformer
						form="rect"
						intensity={rig.key * 1.6}
						color="#FFFFFF"
						scale={[6, 3, 1]}
						position={[0, 4, 3]}
						rotation={[-Math.PI / 3, 0, 0]}
					/>
					<Lightformer
						form="rect"
						intensity={rig.rim * 1.4}
						color={rig.rimColor}
						scale={[5, 4, 1]}
						position={[-3, 1.6, -4]}
						rotation={[0, Math.PI / 2.4, 0]}
					/>
					<Lightformer
						form="circle"
						intensity={rig.fill * 2.2}
						color="#B8D8C4"
						scale={[3, 3, 1]}
						position={[3.4, 0.6, 2]}
						rotation={[0, -Math.PI / 3, 0]}
					/>
					<Lightformer
						form="rect"
						intensity={0.35}
						color={rig.bg}
						scale={[10, 10, 1]}
						position={[0, -3, 0]}
						rotation={[Math.PI / 2, 0, 0]}
					/>
				</Environment>
			) : null}
		</>
	)
}

/* ------------------------------------------------------------ post stack */

export type Quality = "high" | "low" | "off"

/**
 * Deliberately restrained: 60 fps beats a heavy stack. Mobile drops depth of
 * field and chromatic aberration, reduced-motion drops the stack entirely.
 */
export function Effects({
	quality = "high",
	focus = 2.6,
	vhs = false,
}: {
	quality?: Quality
	focus?: number
	vhs?: boolean
}) {
	if (quality === "off") return null

	if (quality === "low") {
		return (
			<EffectComposer enableNormalPass={false} multisampling={0}>
				<Bloom intensity={0.35} luminanceThreshold={0.65} luminanceSmoothing={0.3} mipmapBlur />
				<Vignette offset={0.28} darkness={0.72} blendFunction={BlendFunction.NORMAL} />
				<Noise opacity={vhs ? 0.16 : 0.045} blendFunction={BlendFunction.OVERLAY} />
			</EffectComposer>
		)
	}

	return (
		<EffectComposer enableNormalPass={false} multisampling={4}>
			<Bloom
				intensity={0.42}
				luminanceThreshold={0.6}
				luminanceSmoothing={0.28}
				mipmapBlur
			/>
			<DepthOfField
				focusDistance={0}
				focalLength={focus * 0.02}
				bokehScale={vhs ? 4 : 2.2}
				height={480}
			/>
			<Vignette offset={0.26} darkness={0.78} blendFunction={BlendFunction.NORMAL} />
			<Noise opacity={vhs ? 0.2 : 0.055} blendFunction={BlendFunction.OVERLAY} />
			<ChromaticAberration
				offset={vhs ? [0.0022, 0.0016] : [0.00055, 0.00042]}
				radialModulation={false}
				modulationOffset={0}
			/>
		</EffectComposer>
	)
}

/* ------------------------------------------------------------------- fog */

/** Soft mist at the bottom of the hall. */
export function Mist({ color = "#0B1410", density = 0.14 }: { color?: string; density?: number }) {
	return <fogExp2 attach="fog" args={[color, density]} />
}
