"use client"

/**
 * Wardrobe geometry. Every garment, prop and pet is built from three.js
 * primitives so the museum works with an empty /public folder.
 *
 * Units: the canonical figure is 1.0 tall, head radius 0.085. Figure.tsx scales
 * the whole rig by `model.height` and mounts these items on anchor groups
 * (headTop / face / spine / handL / handR / back / feet / ground), which is the
 * same slot layout the brief describes for the GLB pipeline.
 */

import { createContext, useContext, useMemo, type ReactNode } from "react"
import * as THREE from "three"

import { makeMatcap } from "./matcap"

/* ------------------------------------------------------------- materials */

export type MatcapFn = (color: string) => THREE.Texture | null

const MatcapContext = createContext<MatcapFn>(() => null)

export function useMatcapFn(): MatcapFn {
	return useContext(MatcapContext)
}

/**
 * Provides matcaps whose rim light matches the active environment rig, so the
 * "\u0424\u043e\u043d \u0438 \u0441\u0432\u0435\u0442" slot visibly repaints every sculpture.
 */
export function MatcapProvider({
	rim = "#49C5B6",
	sss = 0.34,
	shadow = "#16241D",
	children,
}: {
	rim?: string
	sss?: number
	shadow?: string
	children: ReactNode
}) {
	const fn = useMemo<MatcapFn>(() => {
		const local = new Map<string, THREE.Texture | null>()
		return (color: string) => {
			if (!local.has(color)) {
				local.set(color, makeMatcap({ color, rim, sss, shadow }))
			}
			return local.get(color) ?? null
		}
	}, [rim, sss, shadow])

	return <MatcapContext.Provider value={fn}>{children}</MatcapContext.Provider>
}

/** Matte plaster surface; falls back to a standard material during SSR. */
export function Surface({
	color,
	opacity,
}: {
	color: string
	opacity?: number
}) {
	const matcap = useMatcapFn()(color)
	const transparent = opacity !== undefined && opacity < 1
	if (!matcap) {
		return (
			<meshStandardMaterial
				color={color}
				roughness={0.88}
				metalness={0}
				transparent={transparent}
				opacity={opacity ?? 1}
			/>
		)
	}
	return (
		<meshMatcapMaterial
			matcap={matcap}
			transparent={transparent}
			opacity={opacity ?? 1}
			depthWrite={!transparent}
		/>
	)
}

/** Self-lit surface for haloes, visors and screens. */
export function Glow({ color, intensity = 1.6 }: { color: string; intensity?: number }) {
	return (
		<meshStandardMaterial
			color={color}
			emissive={color}
			emissiveIntensity={intensity}
			roughness={0.4}
			metalness={0}
		/>
	)
}

/* ------------------------------------------------------------------ head */

const HEAD_R = 0.085

export function HeadItem({ item, color }: { item: string; color: string }) {
	switch (item) {
		case "beanie":
			return (
				<group>
					<mesh position={[0, 0.012, 0]} scale={[1.06, 0.9, 1.06]}>
						<sphereGeometry args={[HEAD_R, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, -0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
						<torusGeometry args={[HEAD_R * 0.98, 0.014, 8, 22]} />
						<Surface color={color} />
					</mesh>
				</group>
			)

		case "cap":
			return (
				<group>
					<mesh position={[0, 0.006, 0]} scale={[1.04, 0.78, 1.04]}>
						<sphereGeometry args={[HEAD_R, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, -0.012, 0.072]} rotation={[-0.16, 0, 0]} scale={[1, 0.22, 1]}>
						<cylinderGeometry args={[0.075, 0.075, 0.06, 18, 1, false, 0, Math.PI]} />
						<Surface color={color} />
					</mesh>
				</group>
			)

		case "hood":
			return (
				<group position={[0, -0.03, -0.012]}>
					<mesh scale={[1.24, 1.2, 1.28]}>
						<sphereGeometry
							args={[HEAD_R, 22, 16, Math.PI * 0.16, Math.PI * 1.68, 0, Math.PI * 0.82]}
						/>
						<Surface color={color} />
					</mesh>
					<mesh position={[0, -0.05, -0.05]} rotation={[0.5, 0, 0]}>
						<torusGeometry args={[0.085, 0.019, 8, 20, Math.PI * 1.2]} />
						<Surface color={color} />
					</mesh>
				</group>
			)

		case "headphones":
			return (
				<group>
					<mesh position={[0, -0.004, 0]} rotation={[0, 0, 0]}>
						<torusGeometry args={[HEAD_R * 1.05, 0.011, 8, 24, Math.PI]} />
						<Surface color={color} />
					</mesh>
					{[-1, 1].map((s) => (
						<mesh
							key={s}
							position={[s * HEAD_R * 1.02, -0.042, 0]}
							rotation={[0, 0, Math.PI / 2]}
						>
							<cylinderGeometry args={[0.026, 0.026, 0.02, 14]} />
							<Surface color={color} />
						</mesh>
					))}
				</group>
			)

		case "halo":
			return (
				<mesh position={[0, 0.075, -0.012]} rotation={[Math.PI / 2 - 0.22, 0, 0.1]}>
					<torusGeometry args={[0.072, 0.0075, 8, 32]} />
					<Glow color={color} intensity={2.2} />
				</mesh>
			)

		case "horns":
			return (
				<group>
					{[-1, 1].map((s) => (
						<mesh
							key={s}
							position={[s * 0.042, 0.03, -0.006]}
							rotation={[-0.24, 0, s * 0.34]}
						>
							<coneGeometry args={[0.019, 0.075, 12]} />
							<Surface color={color} />
						</mesh>
					))}
				</group>
			)

		default:
			return null
	}
}

/* ------------------------------------------------------------------ face */

export function FaceItem({ item, color }: { item: string; color: string }) {
	switch (item) {
		case "glasses":
			return (
				<group>
					{[-1, 1].map((s) => (
						<mesh key={s} position={[s * 0.031, 0, 0]}>
							<torusGeometry args={[0.026, 0.005, 8, 20]} />
							<Surface color={color} />
						</mesh>
					))}
					<mesh rotation={[0, 0, Math.PI / 2]}>
						<cylinderGeometry args={[0.004, 0.004, 0.014, 8]} />
						<Surface color={color} />
					</mesh>
				</group>
			)

		case "shades":
			return (
				<group>
					<mesh scale={[1, 0.42, 0.3]}>
						<sphereGeometry args={[0.072, 18, 12, 0, Math.PI, 0, Math.PI]} />
						<Surface color={color} />
					</mesh>
					{[-1, 1].map((s) => (
						<mesh key={s} position={[s * 0.062, 0.004, -0.03]} rotation={[0, 0, 0]}>
							<boxGeometry args={[0.008, 0.008, 0.05]} />
							<Surface color={color} />
						</mesh>
					))}
				</group>
			)

		case "mask":
			return (
				<mesh position={[0, -0.03, -0.006]} scale={[1, 0.72, 0.6]}>
					<sphereGeometry args={[0.07, 18, 14, 0, Math.PI, 0, Math.PI]} />
					<Surface color={color} />
				</mesh>
			)

		case "visor":
			return (
				<mesh position={[0, 0.004, 0.004]} scale={[1, 0.3, 0.26]}>
					<sphereGeometry args={[0.078, 20, 12, 0, Math.PI, 0, Math.PI]} />
					<Glow color={color} intensity={1.4} />
				</mesh>
			)

		default:
			return null
	}
}

/* ------------------------------------------------------------------- top */

/** Torso shells. `width`/`depth` come from the person's proportions. */
export function TopItem({
	item,
	color,
	width,
	depth,
}: {
	item: string
	color: string
	width: number
	depth: number
}) {
	const shell = (sx: number, sy: number, len: number, y: number) => (
		<mesh position={[0, y, 0]} scale={[width * sx, sy, depth * sx]}>
			<capsuleGeometry args={[0.112, len, 6, 18]} />
			<Surface color={color} />
		</mesh>
	)

	switch (item) {
		case "hoodie":
			return (
				<group>
					{shell(1.09, 1, 0.19, 0)}
					<mesh position={[0, 0.115, -0.055]} scale={[1, 0.7, 0.8]}>
						<sphereGeometry args={[0.072, 16, 12]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, -0.035, depth * 0.115]} scale={[1, 0.5, 0.4]}>
						<sphereGeometry args={[0.05, 14, 10]} />
						<Surface color={color} />
					</mesh>
				</group>
			)

		case "jacket":
			return (
				<group>
					{shell(1.12, 1, 0.17, 0.004)}
					{[-1, 1].map((s) => (
						<mesh
							key={s}
							position={[s * width * 0.055, 0.075, depth * 0.115]}
							rotation={[0.1, 0, s * 0.22]}
						>
							<boxGeometry args={[0.042, 0.12, 0.012]} />
							<Surface color={color} />
						</mesh>
					))}
				</group>
			)

		case "tee":
			return (
				<group>
					{shell(1.06, 1, 0.14, -0.01)}
					{[-1, 1].map((s) => (
						<mesh
							key={s}
							position={[s * width * 0.125, 0.075, 0]}
							rotation={[0, 0, s * 0.3]}
						>
							<cylinderGeometry args={[0.037, 0.034, 0.05, 14]} />
							<Surface color={color} />
						</mesh>
					))}
				</group>
			)

		case "blazer":
			return (
				<group>
					{shell(1.13, 1.02, 0.2, 0.006)}
					{[-1, 1].map((s) => (
						<mesh
							key={s}
							position={[s * width * 0.048, 0.06, depth * 0.12]}
							rotation={[0.06, 0, s * 0.42]}
						>
							<boxGeometry args={[0.05, 0.16, 0.01]} />
							<Surface color={color} />
						</mesh>
					))}
					{[-1, 1].map((s) => (
						<mesh key={"pad" + s} position={[s * width * 0.135, 0.1, 0]}>
							<sphereGeometry args={[0.036, 12, 10]} />
							<Surface color={color} />
						</mesh>
					))}
				</group>
			)

		case "fur":
			return (
				<group>
					{shell(1.3, 1.02, 0.16, 0)}
					{[0.09, 0.02, -0.05].map((y, i) => (
						<mesh key={y} position={[0, y, 0]} scale={[width * 1.32, 0.6, depth * 1.3]}>
							<sphereGeometry args={[0.108 - i * 0.004, 16, 12]} />
							<Surface color={color} />
						</mesh>
					))}
					<mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
						<torusGeometry args={[0.062, 0.026, 8, 20]} />
						<Surface color={color} />
					</mesh>
				</group>
			)

		default:
			return null
	}
}

/* ---------------------------------------------------------------- bottom */

/** Rendered inside each thigh group so it follows the pose. */
export function LegItem({
	item,
	color,
	thigh,
	shin,
	radius,
}: {
	item: string
	color: string
	thigh: number
	shin: number
	radius: number
}) {
	if (item === "skirt") return null

	const long = item === "jeans" || item === "sweats"
	const len = long ? thigh + shin * 0.82 : thigh * 0.82
	const r = radius * (item === "sweats" ? 1.24 : 1.14)

	return (
		<group position={[0, -len / 2, 0]}>
			<mesh>
				<capsuleGeometry args={[r, len, 4, 14]} />
				<Surface color={color} />
			</mesh>
			{item === "sweats" ? (
				<mesh position={[0, -len / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
					<torusGeometry args={[r * 0.92, r * 0.22, 6, 16]} />
					<Surface color={color} />
				</mesh>
			) : null}
		</group>
	)
}

/** Skirts live on the hips instead of the legs. */
export function SkirtItem({ color, width }: { color: string; width: number }) {
	return (
		<mesh position={[0, -0.075, 0]}>
			<coneGeometry args={[width * 0.18, 0.19, 20, 1, true]} />
			<Surface color={color} />
		</mesh>
	)
}

/* ----------------------------------------------------------------- shoes */

export function ShoeItem({ item, color }: { item: string; color: string }) {
	if (item === "barefoot") return null

	if (item === "slides")
		return (
			<mesh position={[0, -0.006, 0.012]}>
				<boxGeometry args={[0.048, 0.012, 0.088]} />
				<Surface color={color} />
			</mesh>
		)

	const boot = item === "boots"
	return (
		<group>
			<mesh position={[0, 0.004, 0.016]}>
				<boxGeometry args={[0.052, 0.03, 0.098]} />
				<Surface color={color} />
			</mesh>
			<mesh position={[0, -0.014, 0.016]}>
				<boxGeometry args={[0.056, 0.012, 0.104]} />
				<Surface color={color} />
			</mesh>
			{boot ? (
				<mesh position={[0, 0.042, -0.004]}>
					<cylinderGeometry args={[0.031, 0.033, 0.07, 14]} />
					<Surface color={color} />
				</mesh>
			) : null}
		</group>
	)
}

/* ----------------------------------------------------------------- hands */

export function HandItem({ item, color }: { item: string; color: string }) {
	switch (item) {
		case "phone":
			return (
				<group rotation={[0.5, 0, 0]}>
					<mesh>
						<boxGeometry args={[0.042, 0.082, 0.008]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, 0, 0.0055]}>
						<boxGeometry args={[0.034, 0.07, 0.001]} />
						<Glow color="#B9FFD2" intensity={0.9} />
					</mesh>
				</group>
			)

		case "mug":
			return (
				<group>
					<mesh>
						<cylinderGeometry args={[0.026, 0.023, 0.055, 16]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0.03, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
						<torusGeometry args={[0.017, 0.005, 6, 14, Math.PI * 1.3]} />
						<Surface color={color} />
					</mesh>
				</group>
			)

		case "guitar":
			return (
				<group rotation={[0.15, 0, -0.5]}>
					<mesh position={[0, -0.05, 0]} scale={[1, 1, 0.36]}>
						<sphereGeometry args={[0.075, 18, 14]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, 0.09, 0]}>
						<boxGeometry args={[0.022, 0.2, 0.014]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, 0.2, 0]}>
						<boxGeometry args={[0.03, 0.04, 0.016]} />
						<Surface color={color} />
					</mesh>
				</group>
			)

		case "sword":
			return (
				<group rotation={[0, 0, 0.12]}>
					<mesh position={[0, 0.16, 0]}>
						<boxGeometry args={[0.022, 0.3, 0.008]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, 0.315, 0]}>
						<coneGeometry args={[0.012, 0.03, 8]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, 0.01, 0]}>
						<boxGeometry args={[0.08, 0.012, 0.014]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, -0.03, 0]}>
						<cylinderGeometry args={[0.011, 0.011, 0.06, 10]} />
						<Surface color="#0E1512" />
					</mesh>
				</group>
			)

		case "shawarma":
			return (
				<group rotation={[0.3, 0, 0.25]}>
					<mesh>
						<cylinderGeometry args={[0.024, 0.032, 0.11, 14]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, 0.062, 0]}>
						<sphereGeometry args={[0.026, 12, 10]} />
						<Surface color="#2F6B4A" />
					</mesh>
				</group>
			)

		case "kiwi":
			return (
				<group>
					<mesh scale={[1, 1.24, 1]}>
						<sphereGeometry args={[0.036, 18, 14]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, 0.045, 0]}>
						<cylinderGeometry args={[0.004, 0.006, 0.014, 6]} />
						<Surface color="#16321F" />
					</mesh>
				</group>
			)

		case "sign":
			return (
				<group>
					<mesh position={[0, 0.055, 0]}>
						<boxGeometry args={[0.12, 0.07, 0.008]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0.012, 0.055, 0.006]} rotation={[0, 0, -Math.PI / 4]}>
						<boxGeometry args={[0.05, 0.008, 0.002]} />
						<Surface color="#0E1512" />
					</mesh>
					<mesh position={[0.032, 0.075, 0.006]} rotation={[0, 0, -Math.PI / 4]}>
						<coneGeometry args={[0.014, 0.024, 3]} />
						<Surface color="#0E1512" />
					</mesh>
					<mesh>
						<cylinderGeometry args={[0.005, 0.005, 0.07, 8]} />
						<Surface color={color} />
					</mesh>
				</group>
			)

		default:
			return null
	}
}

/* ------------------------------------------------------------------ back */

export function BackItem({
	item,
	color,
	width,
}: {
	item: string
	color: string
	width: number
}) {
	switch (item) {
		case "wings":
			return (
				<group position={[0, 0.02, -0.02]}>
					{[-1, 1].map((s) => (
						<mesh
							key={s}
							position={[s * 0.05, 0.05, -0.01]}
							rotation={[0.24, s * 0.5, s * 0.26]}
							scale={[0.28, 1, 1]}
						>
							<sphereGeometry args={[0.15, 16, 12, 0, Math.PI, 0, Math.PI * 0.8]} />
							<Surface color={color} />
						</mesh>
					))}
				</group>
			)

		case "backpack":
			return (
				<group position={[0.012, -0.01, -0.055]}>
					<mesh scale={[width * 0.9, 1, 0.62]}>
						<capsuleGeometry args={[0.058, 0.075, 4, 14]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[-0.02, 0.06, 0.055]} rotation={[0, 0, 0.3]}>
						<boxGeometry args={[0.018, 0.12, 0.01]} />
						<Surface color={color} />
					</mesh>
				</group>
			)

		case "cape":
			return (
				<group position={[0, 0.06, -0.05]}>
					<mesh rotation={[0.1, 0, 0]} scale={[width * 1.05, 1, 0.42]}>
						<cylinderGeometry
							args={[0.11, 0.2, 0.62, 20, 1, true, Math.PI * 0.15, Math.PI * 1.7]}
						/>
						<Surface color={color} />
					</mesh>
					<mesh position={[0, 0.31, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
						<torusGeometry args={[0.06, 0.011, 6, 16]} />
						<Surface color={color} />
					</mesh>
				</group>
			)

		default:
			return null
	}
}

/* ------------------------------------------------------------------- pets */

/** Pets that sit on the plinth next to the figure (owl perches on a shoulder). */
export function PetItem({ item, color }: { item: string; color: string }) {
	switch (item) {
		case "kiwibird":
			return (
				<group>
					<mesh position={[0, 0.055, 0]} scale={[1, 0.9, 1.1]}>
						<sphereGeometry args={[0.055, 16, 12]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, 0.095, 0.05]} rotation={[0.5, 0, 0]}>
						<coneGeometry args={[0.011, 0.075, 8]} />
						<Surface color="#EAF3EC" />
					</mesh>
					{[-1, 1].map((s) => (
						<mesh key={s} position={[s * 0.018, 0.012, 0.01]}>
							<cylinderGeometry args={[0.005, 0.005, 0.026, 6]} />
							<Surface color="#EAF3EC" />
						</mesh>
					))}
				</group>
			)

		case "chick":
			return (
				<group>
					<mesh position={[0, 0.036, 0]}>
						<sphereGeometry args={[0.036, 14, 12]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, 0.078, 0]}>
						<sphereGeometry args={[0.026, 14, 12]} />
						<Surface color={color} />
					</mesh>
					<mesh position={[0, 0.078, 0.026]} rotation={[Math.PI / 2, 0, 0]}>
						<coneGeometry args={[0.008, 0.018, 6]} />
						<Surface color="#F2B23E" />
					</mesh>
				</group>
			)

		case "owl":
			return (
				<group>
					<mesh position={[0, 0.045, 0]} scale={[1, 1.2, 1]}>
						<sphereGeometry args={[0.04, 16, 12]} />
						<Surface color={color} />
					</mesh>
					{[-1, 1].map((s) => (
						<mesh key={s} position={[s * 0.02, 0.085, 0.004]} rotation={[0, 0, s * 0.4]}>
							<coneGeometry args={[0.012, 0.03, 6]} />
							<Surface color={color} />
						</mesh>
					))}
					{[-1, 1].map((s) => (
						<mesh key={"eye" + s} position={[s * 0.016, 0.056, 0.034]}>
							<sphereGeometry args={[0.009, 10, 8]} />
							<Surface color="#0E1512" />
						</mesh>
					))}
				</group>
			)

		case "snail":
			return (
				<group>
					<mesh position={[0, 0.014, 0]} scale={[1, 0.6, 1.6]}>
						<sphereGeometry args={[0.03, 14, 10]} />
						<Surface color="#EAF3EC" />
					</mesh>
					<mesh position={[0, 0.038, -0.012]} rotation={[0, 0, Math.PI / 2]}>
						<torusGeometry args={[0.024, 0.011, 8, 20]} />
						<Surface color={color} />
					</mesh>
					{[-1, 1].map((s) => (
						<mesh key={s} position={[s * 0.008, 0.04, 0.04]} rotation={[0.3, 0, s * 0.2]}>
							<cylinderGeometry args={[0.0025, 0.0025, 0.026, 6]} />
							<Surface color="#EAF3EC" />
						</mesh>
					))}
				</group>
			)

		case "cactus":
			return (
				<group>
					<mesh position={[0, 0.024, 0]}>
						<cylinderGeometry args={[0.032, 0.026, 0.048, 14]} />
						<Surface color="#EAF3EC" />
					</mesh>
					<mesh position={[0, 0.088, 0]}>
						<capsuleGeometry args={[0.019, 0.07, 4, 12]} />
						<Surface color={color} />
					</mesh>
					{[-1, 1].map((s) => (
						<mesh key={s} position={[s * 0.026, 0.092, 0]} rotation={[0, 0, s * 0.9]}>
							<capsuleGeometry args={[0.011, 0.03, 3, 10]} />
							<Surface color={color} />
						</mesh>
					))}
				</group>
			)

		case "cube":
			return (
				<mesh position={[0, 0.11, 0]} rotation={[0.4, 0.6, 0.2]}>
					<boxGeometry args={[0.07, 0.07, 0.07]} />
					<Glow color={color} intensity={1.1} />
				</mesh>
			)

		default:
			return null
	}
}

export const SHOULDER_PETS = new Set(["owl"])
export const FLOATING_PETS = new Set(["cube"])
