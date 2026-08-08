import { SLOTS, type Outfit, type Slot } from "@/data/wardrobe"
import { PEOPLE_BY_SLUG } from "@/data/people"
import { resolveOutfit } from "@/store/outfit"

/**
 * Share format: `?fit=hoodie.green,cap.black,pose.2`
 * Only slots that differ from the person's default are written, so links stay short.
 */
export function serializeFit(slug: string, outfit: Outfit): string {
	const base = resolveOutfit(slug, undefined)
	const parts: string[] = []
	for (const slot of SLOTS) {
		const value = outfit[slot]
		if (value && value !== base[slot]) parts.push(value)
	}
	return parts.join(",")
}

/** Which slot does a given item id belong to? Built once from the wardrobe. */
import { WARDROBE } from "@/data/wardrobe"

const ITEM_TO_SLOT: Record<string, Slot> = (() => {
	const map: Record<string, Slot> = {}
	for (const spec of WARDROBE) {
		for (const it of spec.items) {
			// "none" and "pose" repeat across slots; first definition wins, and the
			// ambiguous ones are resolved explicitly below.
			if (!(it.id in map)) map[it.id] = spec.id
		}
	}
	map.pose = "pose"
	return map
})()

export function parseFit(fit: string | null | undefined): Partial<Outfit> {
	if (!fit) return {}
	const out: Partial<Outfit> = {}
	for (const token of fit.split(",")) {
		const clean = token.trim()
		if (!clean) continue
		const dot = clean.indexOf(".")
		const itemId = dot === -1 ? clean : clean.slice(0, dot)
		const slot = ITEM_TO_SLOT[itemId]
		if (!slot) continue
		if (slot === "env" || slot === "pose") {
			out[slot] = clean
			continue
		}
		out[slot] = clean
	}
	return out
}

export function buildShareUrl(slug: string, outfit: Outfit): string {
	const fit = serializeFit(slug, outfit)
	const origin =
		typeof window === "undefined" ? "https://omsk-impire.vercel.app" : window.location.origin
	const url = new URL(`/p/${slug}`, origin)
	if (fit) url.searchParams.set("fit", fit)
	return url.toString()
}

export function personExists(slug: string): boolean {
	return Boolean(PEOPLE_BY_SLUG[slug])
}
