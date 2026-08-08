/**
 * ГАРДЕРОБ — slots, items, colour swatches, poses, presets.
 *
 * Every outfit value is a string `"<itemId>.<variantId>"`, which is exactly what
 * we put into the share link: `?fit=hoodie.green,cap.black,pose.2`.
 * A value without a dot is allowed and falls back to the item's default variant.
 */

export const SLOTS = [
	"head",
	"face",
	"top",
	"bottom",
	"shoes",
	"hands",
	"back",
	"pet",
	"env",
	"pose",
] as const

export type Slot = (typeof SLOTS)[number]

export type Outfit = Record<Slot, string>

export type SwatchId =
	| "clay"
	| "mint"
	| "lime"
	| "moss"
	| "deep"
	| "ink"
	| "amber"
	| "coral"

/** Green gamma + exactly two contrast swatches, per the art direction. */
export const SWATCHES: Record<SwatchId, { label: string; hex: string }> = {
	clay: { label: "Глина", hex: "#EAF3EC" },
	mint: { label: "Мята", hex: "#49C5B6" },
	lime: { label: "Лайм", hex: "#4ADE80" },
	moss: { label: "Мох", hex: "#2F6B4A" },
	deep: { label: "Хвоя", hex: "#16321F" },
	ink: { label: "Тушь", hex: "#0E1512" },
	amber: { label: "Янтарь", hex: "#F2B23E" },
	coral: { label: "Корал", hex: "#E2564B" },
}

export const SWATCH_IDS = Object.keys(SWATCHES) as SwatchId[]

export type WardrobeItem = {
	id: string
	label: string
	/** false for items that have no paintable surface (poses, environments). */
	colorable: boolean
	defaultColor: SwatchId
}

export type SlotSpec = {
	id: Slot
	label: string
	items: WardrobeItem[]
}

const item = (
	id: string,
	label: string,
	defaultColor: SwatchId = "clay",
	colorable = true,
): WardrobeItem => ({ id, label, colorable, defaultColor })

export const WARDROBE: SlotSpec[] = [
	{
		id: "head",
		label: "Голова",
		items: [
			item("none", "Ничего", "clay", false),
			item("beanie", "Шапка", "moss"),
			item("cap", "Кепка", "ink"),
			item("hood", "Капюшон", "deep"),
			item("headphones", "Наушники", "ink"),
			item("halo", "Нимб", "lime"),
			item("horns", "Рожки", "ink"),
		],
	},
	{
		id: "face",
		label: "Лицо",
		items: [
			item("none", "Ничего", "clay", false),
			item("glasses", "Очки", "mint"),
			item("shades", "Солнечные", "ink"),
			item("mask", "Маска", "deep"),
			item("visor", "Визор", "lime"),
		],
	},
	{
		id: "top",
		label: "Верх",
		items: [
			item("bare", "Без верха", "clay", false),
			item("hoodie", "Худи", "moss"),
			item("jacket", "Куртка", "deep"),
			item("tee", "Футболка", "clay"),
			item("blazer", "Пиджак", "ink"),
			item("fur", "Шуба", "clay"),
		],
	},
	{
		id: "bottom",
		label: "Низ",
		items: [
			item("jeans", "Джинсы", "deep"),
			item("shorts", "Шорты", "moss"),
			item("sweats", "Спортивки", "ink"),
			item("skirt", "Юбка", "moss"),
		],
	},
	{
		id: "shoes",
		label: "Обувь",
		items: [
			item("barefoot", "Босиком", "clay", false),
			item("sneakers", "Кроссовки", "clay"),
			item("boots", "Ботинки", "ink"),
			item("slides", "Сланцы", "moss"),
		],
	},
	{
		id: "hands",
		label: "В руках",
		items: [
			item("none", "Пусто", "clay", false),
			item("phone", "Телефон", "ink"),
			item("mug", "Кружка", "clay"),
			item("guitar", "Гитара", "amber"),
			item("sword", "Меч", "mint"),
			item("shawarma", "Шаурма", "amber"),
			item("kiwi", "Киви", "moss"),
			item("sign", "Табличка", "clay"),
		],
	},
	{
		id: "back",
		label: "Спина",
		items: [
			item("none", "Ничего", "clay", false),
			item("wings", "Крылья", "clay"),
			item("backpack", "Рюкзак", "moss"),
			item("cape", "Плащ", "deep"),
		],
	},
	{
		id: "pet",
		label: "Питомец",
		items: [
			item("none", "Никого", "clay", false),
			item("kiwibird", "Киви-птица", "moss"),
			item("chick", "Цыпа", "amber"),
			item("owl", "Совунья", "clay"),
			item("snail", "Улитка", "mint"),
			item("cactus", "Кактус", "moss"),
			item("cube", "Куб", "lime"),
		],
	},
	{
		id: "env",
		label: "Фон и свет",
		items: [
			item("studio", "Студия", "clay", false),
			item("night", "3 ночи", "clay", false),
			item("call", "Созвон", "clay", false),
			item("acid", "Ацид", "clay", false),
			item("void", "Пустота", "clay", false),
		],
	},
	{
		id: "pose",
		label: "Поза",
		items: [
			item("pose", "A-поза", "clay", false),
			item("pose", "Руки в карманы", "clay", false),
			item("pose", "Скрещены", "clay", false),
			item("pose", "Указывает", "clay", false),
			item("pose", "Сидит на камне", "clay", false),
			item("pose", "Отвернулся", "clay", false),
			item("pose", "Тянется", "clay", false),
			item("pose", "Клонится", "clay", false),
		],
	},
]

export const POSE_COUNT = 8

export const SLOT_SPEC: Record<Slot, SlotSpec> = WARDROBE.reduce(
	(acc, s) => {
		acc[s.id] = s
		return acc
	},
	{} as Record<Slot, SlotSpec>,
)

export const BASE_OUTFIT: Outfit = {
	head: "none",
	face: "none",
	top: "hoodie.moss",
	bottom: "jeans.deep",
	shoes: "sneakers.clay",
	hands: "none",
	back: "none",
	pet: "none",
	env: "studio",
	pose: "pose.0",
}

/** Parse `"hoodie.green"` -> `{ item: "hoodie", variant: "green" }`. */
export function parseSlotValue(
	slot: Slot,
	value: string | undefined,
): { item: string; variant: string } {
	const fallback = BASE_OUTFIT[slot]
	const raw = (value && value.length ? value : fallback) || "none"
	const dot = raw.indexOf(".")
	if (dot === -1) {
		if (slot === "pose") return { item: "pose", variant: "0" }
		const spec = SLOT_SPEC[slot]
		const found = spec?.items.find((i) => i.id === raw)
		return { item: raw, variant: found ? found.defaultColor : "clay" }
	}
	return { item: raw.slice(0, dot), variant: raw.slice(dot + 1) }
}

export function slotColor(slot: Slot, value: string | undefined): string {
	const { variant } = parseSlotValue(slot, value)
	const sw = SWATCHES[variant as SwatchId]
	return sw ? sw.hex : SWATCHES.clay.hex
}

export function poseIndex(value: string | undefined): number {
	const { variant } = parseSlotValue("pose", value)
	const n = Number.parseInt(variant, 10)
	if (!Number.isFinite(n)) return 0
	return ((n % POSE_COUNT) + POSE_COUNT) % POSE_COUNT
}

export type PresetId = "default" | "night3" | "call" | "godmode"

export const PRESETS: Record<
	PresetId,
	{ label: string; note: string; patch: Partial<Outfit> }
> = {
	default: {
		label: "Дефолт",
		note: "как образец поступил в лабораторию",
		patch: {},
	},
	night3: {
		label: "В чате в 3 ночи",
		note: "капюшон, телефон, свет от экрана",
		patch: {
			head: "hood.deep",
			face: "none",
			top: "hoodie.ink",
			bottom: "sweats.ink",
			shoes: "slides.moss",
			hands: "phone.ink",
			env: "night",
			pose: "pose.1",
		},
	},
	call: {
		label: "На созвоне",
		note: "пиджак сверху, спортивки снизу",
		patch: {
			head: "headphones.ink",
			face: "glasses.mint",
			top: "blazer.ink",
			bottom: "sweats.moss",
			shoes: "barefoot",
			hands: "mug.clay",
			env: "call",
			pose: "pose.2",
		},
	},
	godmode: {
		label: "God mode",
		note: "нимб, крылья, меч. Савели Бог одобряет",
		patch: {
			head: "halo.lime",
			face: "visor.lime",
			top: "fur.clay",
			bottom: "jeans.clay",
			shoes: "boots.clay",
			hands: "sword.mint",
			back: "wings.clay",
			pet: "kiwibird.moss",
			env: "acid",
			pose: "pose.3",
		},
	},
}

export const PRESET_IDS = Object.keys(PRESETS) as PresetId[]

/** Environment light rigs, referenced by the canvas. */
export const ENV_RIGS: Record<
	string,
	{ key: number; rim: number; fill: number; rimColor: string; bg: string }
> = {
	studio: { key: 2.1, rim: 1.5, fill: 0.45, rimColor: "#49C5B6", bg: "#1E3A2A" },
	night: { key: 0.85, rim: 2.4, fill: 0.12, rimColor: "#4ADE80", bg: "#0B1410" },
	call: { key: 2.6, rim: 0.7, fill: 0.9, rimColor: "#EAF3EC", bg: "#16321F" },
	acid: { key: 2.4, rim: 2.8, fill: 0.5, rimColor: "#B6FF2E", bg: "#0F5C26" },
	void: { key: 1.4, rim: 1.1, fill: 0.05, rimColor: "#8FA79A", bg: "#000000" },
}
