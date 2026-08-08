/**
 * Eight hand-authored poses for the procedural figure. Rotations are radians in
 * the figure's local space; every person picks one of these and then differs by
 * proportions, outfit and accent colour (pipeline C in the brief).
 */

export type Arm = {
	/** shoulder rotation [x, y, z] */
	shoulder: [number, number, number]
	/** elbow bend around x */
	elbow: number
	/** wrist bend around x */
	wrist?: number
}

export type Leg = {
	hip: [number, number, number]
	knee: number
	/** foot lift, world units */
	lift?: number
}

export type Pose = {
	id: number
	name: string
	/** torso rotation */
	spine: [number, number, number]
	head: [number, number, number]
	armL: Arm
	armR: Arm
	legL: Leg
	legR: Leg
	/** vertical offset of the whole rig (sitting, mid-step) */
	hipY: number
	/** true when the forearms should be tucked across the chest */
	crossed?: boolean
	/** figure is seated on the edge of its own plinth */
	seated?: boolean
	/** subtle idle breathing amplitude multiplier */
	breathe?: number
}

const d = (deg: number) => (deg * Math.PI) / 180

export const POSES: Pose[] = [
	{
		id: 0,
		name: "\u0410-\u043f\u043e\u0437\u0430",
		spine: [0, 0, 0],
		head: [0, 0, 0],
		armL: { shoulder: [0, 0, d(9)], elbow: d(4) },
		armR: { shoulder: [0, 0, d(-9)], elbow: d(4) },
		legL: { hip: [0, 0, d(2)], knee: 0 },
		legR: { hip: [0, 0, d(-2)], knee: 0 },
		hipY: 0,
		breathe: 1,
	},
	{
		id: 1,
		name: "\u0420\u0443\u043a\u0438 \u0441\u043a\u0440\u0435\u0449\u0435\u043d\u044b",
		spine: [d(-2), d(4), 0],
		head: [d(-4), d(-6), 0],
		armL: { shoulder: [d(-64), d(16), d(34)], elbow: d(78), wrist: d(-10) },
		armR: { shoulder: [d(-58), d(-16), d(-38)], elbow: d(84), wrist: d(-10) },
		legL: { hip: [0, 0, d(3)], knee: d(2) },
		legR: { hip: [0, 0, d(-4)], knee: d(5) },
		hipY: 0,
		crossed: true,
		breathe: 0.7,
	},
	{
		id: 2,
		name: "\u041b\u0435\u043a\u0442\u043e\u0440",
		spine: [d(-3), d(-8), 0],
		head: [d(-9), d(8), d(2)],
		armL: { shoulder: [d(-18), 0, d(12)], elbow: d(22) },
		armR: { shoulder: [d(-74), d(-10), d(-16)], elbow: d(58), wrist: d(-24) },
		legL: { hip: [0, 0, d(4)], knee: 0 },
		legR: { hip: [d(4), 0, d(-6)], knee: d(8) },
		hipY: 0,
		breathe: 0.8,
	},
	{
		id: 3,
		name: "\u0423\u043a\u0430\u0437\u0430\u0442\u0435\u043b\u044c",
		spine: [0, d(14), d(-3)],
		head: [d(-2), d(-18), 0],
		armL: { shoulder: [d(-6), 0, d(112)], elbow: d(6) },
		armR: { shoulder: [d(8), 0, d(-14)], elbow: d(16) },
		legL: { hip: [0, 0, d(6)], knee: d(3) },
		legR: { hip: [0, 0, d(-3)], knee: 0 },
		hipY: 0,
		breathe: 0.9,
	},
	{
		id: 4,
		name: "\u041e\u0431\u0432\u0438\u043d\u0435\u043d\u0438\u0435",
		spine: [d(-4), d(-10), 0],
		head: [d(-6), d(6), d(-2)],
		armL: { shoulder: [d(-12), 0, d(14)], elbow: d(26) },
		armR: { shoulder: [d(-92), d(-6), d(-6)], elbow: d(10), wrist: d(-6) },
		legL: { hip: [0, 0, d(5)], knee: d(2) },
		legR: { hip: [0, 0, d(-5)], knee: d(4) },
		hipY: 0,
		breathe: 1,
	},
	{
		id: 5,
		name: "\u0420\u0443\u043a\u0438 \u0432 \u0441\u0442\u043e\u0440\u043e\u043d\u044b",
		spine: [0, d(-22), 0],
		head: [d(-3), d(26), 0],
		armL: { shoulder: [d(-8), 0, d(74)], elbow: d(28) },
		armR: { shoulder: [d(-8), 0, d(-74)], elbow: d(28) },
		legL: { hip: [0, 0, d(7)], knee: 0 },
		legR: { hip: [0, 0, d(-7)], knee: 0 },
		hipY: 0,
		breathe: 1.2,
	},
	{
		id: 6,
		name: "\u0428\u0430\u0433",
		spine: [d(-8), d(6), 0],
		head: [d(-10), d(-4), 0],
		armL: { shoulder: [d(-38), 0, d(18)], elbow: d(34) },
		armR: { shoulder: [d(30), 0, d(-16)], elbow: d(18) },
		legL: { hip: [d(-26), 0, d(4)], knee: d(16), lift: 0.14 },
		legR: { hip: [d(14), 0, d(-3)], knee: d(6) },
		hipY: 0.03,
		breathe: 0.6,
	},
	{
		id: 7,
		name: "\u041d\u0430 \u043a\u0440\u0430\u044e \u043a\u0430\u043c\u043d\u044f",
		spine: [d(-6), d(10), 0],
		head: [d(4), d(-10), d(3)],
		armL: { shoulder: [d(-24), d(10), d(26)], elbow: d(52) },
		armR: { shoulder: [d(24), d(-8), d(-8)], elbow: d(8) },
		legL: { hip: [d(-78), 0, d(6)], knee: d(14) },
		legR: { hip: [d(-64), 0, d(-8)], knee: d(58) },
		hipY: -0.34,
		seated: true,
		breathe: 0.8,
	},
]

export function getPose(index: number): Pose {
	const i = ((Math.round(index) % POSES.length) + POSES.length) % POSES.length
	return POSES[i]
}

export const POSE_NAMES = POSES.map((p) => p.name)
