"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  BASE_OUTFIT,
  PRESETS,
  type Outfit,
  type PresetId,
  type Slot,
} from "@/data/wardrobe";
import { PEOPLE_BY_SLUG } from "@/data/people";

type OutfitState = {
  /** Only user-made overrides live here; defaults stay in data/people.ts. */
  overrides: Record<string, Partial<Outfit>>;
  /** Seed for the /together shuffle, so the arrangement survives navigation. */
  arrangement: number;
  setSlot: (slug: string, slot: Slot, value: string) => void;
  applyPreset: (slug: string, preset: PresetId) => void;
  applyPatch: (slug: string, patch: Partial<Outfit>) => void;
  reset: (slug: string) => void;
  resetAll: () => void;
  dressEveryone: (patch: Partial<Outfit>) => void;
  shuffleArrangement: () => void;
};

export const useOutfitStore = create<OutfitState>()(
  persist(
    (set) => ({
      overrides: {},
      arrangement: 0,
      setSlot: (slug, slot, value) =>
        set((s) => ({
          overrides: {
            ...s.overrides,
            [slug]: { ...(s.overrides[slug] ?? {}), [slot]: value },
          },
        })),
      applyPreset: (slug, preset) =>
        set((s) => {
          if (preset === "default") {
            const next = { ...s.overrides };
            delete next[slug];
            return { overrides: next };
          }
          return {
            overrides: {
              ...s.overrides,
              [slug]: {
                ...(s.overrides[slug] ?? {}),
                ...PRESETS[preset].patch,
              },
            },
          };
        }),
      applyPatch: (slug, patch) =>
        set((s) => ({
          overrides: {
            ...s.overrides,
            [slug]: { ...(s.overrides[slug] ?? {}), ...patch },
          },
        })),
      reset: (slug) =>
        set((s) => {
          const next = { ...s.overrides };
          delete next[slug];
          return { overrides: next };
        }),
      resetAll: () => set({ overrides: {} }),
      dressEveryone: (patch) =>
        set((s) => {
          const next: Record<string, Partial<Outfit>> = { ...s.overrides };
          for (const slug of Object.keys(PEOPLE_BY_SLUG)) {
            next[slug] = { ...(next[slug] ?? {}), ...patch };
          }
          return { overrides: next };
        }),
      shuffleArrangement: () =>
        set((s) => ({ arrangement: s.arrangement + 1 })),
    }),
    { name: "omsk-impire.outfit.v1" },
  ),
);

/** Full resolved outfit: base <- person default <- user override. */
export function resolveOutfit(
  slug: string,
  overrides: Partial<Outfit> | undefined,
): Outfit {
  const person = PEOPLE_BY_SLUG[slug];
  return {
    ...BASE_OUTFIT,
    ...(person ? person.outfitDefault : {}),
    ...(overrides ?? {}),
  };
}

/** Hook form, used by both the wardrobe UI and the canvas. */
export function useOutfit(slug: string): Outfit {
  const overrides = useOutfitStore((s) => s.overrides[slug]);
  return resolveOutfit(slug, overrides);
}

/* ------------------------------------------------ imperative helpers */

/**
 * Non-hook wrappers so buttons, the terminal and the easter eggs can fire
 * store actions from plain callbacks without subscribing to the store.
 */
export function resetAll(): void {
  useOutfitStore.getState().resetAll();
}

export function dressEveryone(patch: Partial<Outfit>): void {
  useOutfitStore.getState().dressEveryone(patch);
}

export function shuffleArrangement(): void {
  useOutfitStore.getState().shuffleArrangement();
}
