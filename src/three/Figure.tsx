"use client";

/**
 * The sculpture. Pipeline C from the brief: a procedural plaster figure built
 * from capsules, spheres and boxes, so the museum renders with zero external
 * assets. Per-person difference comes from proportions, one of eight poses,
 * outfit slots and the accent colour.
 *
 * The rig mirrors the GLB slot layout (headTop / face / spine / handL / handR /
 * back), so swapping in a real GLB later means replacing the meshes, not the
 * wardrobe logic.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
  parseSlotValue,
  poseIndex,
  slotColor,
  type Outfit,
} from "@/data/wardrobe";
import { getPose } from "./poses";
import {
  BackItem,
  FaceItem,
  HandItem,
  HeadItem,
  LegItem,
  PetItem,
  ShoeItem,
  SkirtItem,
  Surface,
  SHOULDER_PETS,
  FLOATING_PETS,
  TopItem,
} from "./props";
import { hashString } from "@/lib/easter";

/** Canonical figure height in world units before `height` scaling. */
export const FIGURE_UNIT_HEIGHT = 1;

const Y = {
  ankle: 0.06,
  knee: 0.28,
  hip: 0.52,
  waist: 0.6,
  chest: 0.68,
  shoulder: 0.8,
  neck: 0.855,
  head: 0.915,
};

const L = {
  thigh: Y.hip - Y.knee,
  shin: Y.knee - Y.ankle,
  upperArm: 0.2,
  forearm: 0.18,
};

export type FigureProps = {
  outfit: Outfit;
  /** person accent, used for the rim light of the plaster matcap */
  accent?: string;
  /** real-world height in metres, 1.6 - 1.85 */
  height?: number;
  /** seed for silent per-person proportion jitter */
  seed?: string;
  /** body colour of the sculpture */
  clay?: string;
  /** below 1 renders the deleted account as a translucent ghost */
  opacity?: number;
  /** idle breathing + sway */
  animate?: boolean;
  /** overrides the pose coming from the outfit */
  pose?: number;
  /** timestamp of the last "\u0440\u0430\u0437\u0431\u0443\u0434\u0438\u0442\u044c \u0447\u0430\u0442" poke */
  wake?: number;
  /** cheaper geometry for /together and hub previews */
  lod?: "high" | "low";
  /** highlight ring under the feet (used on /together hover) */
  dim?: boolean;
} & Omit<React.ComponentProps<"group">, "scale">;

export function Figure({
  outfit,
  accent = "#49C5B6",
  height = 1.74,
  seed = "base",
  clay = "#EAF3EC",
  opacity = 1,
  animate = true,
  pose: poseOverride,
  wake = 0,
  lod = "high",
  dim = false,
  ...group
}: FigureProps) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const wakeAt = useRef(0);

  const pose = getPose(poseOverride ?? poseIndex(outfit.pose));

  /* Silent proportion jitter: nobody is a clone of the base figure. */
  const prop = useMemo(() => {
    const h = hashString(seed);
    const r = (n: number) => ((h >> (n * 3)) & 255) / 255;
    const build = 0.88 + r(1) * 0.36;
    return {
      build,
      shoulderX: 0.098 * (0.94 + r(2) * 0.22),
      hipX: 0.052 * (0.95 + r(3) * 0.16),
      limb: 0.94 + r(4) * 0.14,
      headScale: 0.95 + r(5) * 0.12,
      hair: Math.floor(r(6) * 3),
      neckLen: 0.03 + r(7) * 0.018,
    };
  }, [seed]);

  const items = useMemo(
    () => ({
      head: parseSlotValue("head", outfit.head),
      face: parseSlotValue("face", outfit.face),
      top: parseSlotValue("top", outfit.top),
      bottom: parseSlotValue("bottom", outfit.bottom),
      shoes: parseSlotValue("shoes", outfit.shoes),
      hands: parseSlotValue("hands", outfit.hands),
      back: parseSlotValue("back", outfit.back),
      pet: parseSlotValue("pet", outfit.pet),
    }),
    [outfit],
  );

  const color = useMemo(
    () => ({
      head: slotColor("head", outfit.head),
      face: slotColor("face", outfit.face),
      top: slotColor("top", outfit.top),
      bottom: slotColor("bottom", outfit.bottom),
      shoes: slotColor("shoes", outfit.shoes),
      hands: slotColor("hands", outfit.hands),
      back: slotColor("back", outfit.back),
      pet: slotColor("pet", outfit.pet),
    }),
    [outfit],
  );

  const seg = lod === "low" ? 0.5 : 1;
  const cap = (n: number) => Math.max(6, Math.round(n * seg));
  const body = clay;
  const propHand = pose.id === 3 ? -1 : 1;
  const ghost = opacity < 1;

  if (wake > wakeAt.current) wakeAt.current = wake;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const amp = (pose.breathe ?? 1) * (animate ? 1 : 0);

    if (torso.current) {
      torso.current.scale.y = 1 + Math.sin(t * 1.1) * 0.012 * amp;
      torso.current.rotation.z = Math.sin(t * 0.42) * 0.008 * amp;
    }
    if (headRef.current) {
      headRef.current.rotation.y =
        pose.head[1] + Math.sin(t * 0.33) * 0.05 * amp;
      headRef.current.rotation.x =
        pose.head[0] + Math.sin(t * 0.51) * 0.02 * amp;
    }

    // "\u0440\u0430\u0437\u0431\u0443\u0434\u0438\u0442\u044c \u0447\u0430\u0442": a short jolt, then back to stillness.
    if (root.current) {
      const since = (performance.now() - wakeAt.current) / 1000;
      if (wakeAt.current > 0 && since < 0.9) {
        const decay = 1 - since / 0.9;
        root.current.rotation.z = Math.sin(since * 46) * 0.05 * decay;
        root.current.position.y = Math.abs(Math.sin(since * 22)) * 0.05 * decay;
      } else if (root.current.rotation.z !== 0) {
        root.current.rotation.z = 0;
        root.current.position.y = 0;
      }
    }
  });

  const legs = ([-1, 1] as const).map((side) => {
    const leg = side === -1 ? pose.legL : pose.legR;
    const long =
      items.bottom.item === "jeans" || items.bottom.item === "sweats";
    const r = 0.043 * prop.build;

    return (
      <group
        key={"leg" + side}
        position={[side * prop.hipX, Y.hip, 0]}
        rotation={leg.hip}
      >
        <mesh position={[0, -L.thigh / 2, 0]}>
          <capsuleGeometry args={[r, L.thigh * prop.limb, cap(4), cap(14)]} />
          <Surface color={body} opacity={opacity} />
        </mesh>

        {items.bottom.item !== "skirt" ? (
          <LegItem
            item={items.bottom.item}
            color={color.bottom}
            thigh={L.thigh}
            shin={0}
            radius={r}
          />
        ) : null}

        <group
          position={[0, -L.thigh * prop.limb, 0]}
          rotation={[leg.knee, 0, 0]}
        >
          <mesh position={[0, -L.shin / 2, 0]}>
            <capsuleGeometry
              args={[r * 0.86, L.shin * prop.limb, cap(4), cap(12)]}
            />
            <Surface color={body} opacity={opacity} />
          </mesh>

          {long ? (
            <LegItem
              item={items.bottom.item}
              color={color.bottom}
              thigh={L.shin * 0.98}
              shin={0}
              radius={r * 0.88}
            />
          ) : null}

          <group position={[0, -L.shin * prop.limb, 0]}>
            <mesh position={[0, -0.014, 0.024]}>
              <boxGeometry args={[0.044, 0.03, 0.09]} />
              <Surface color={body} opacity={opacity} />
            </mesh>
            <ShoeItem item={items.shoes.item} color={color.shoes} />
          </group>
        </group>
      </group>
    );
  });

  const arms = ([-1, 1] as const).map((side) => {
    const arm = side === -1 ? pose.armL : pose.armR;
    const r = 0.033 * prop.build;

    return (
      <group
        key={"arm" + side}
        position={[side * prop.shoulderX * 1.16, Y.shoulder - Y.chest, 0]}
        rotation={arm.shoulder}
      >
        <mesh position={[0, -L.upperArm / 2, 0]}>
          <capsuleGeometry
            args={[r, L.upperArm * prop.limb, cap(4), cap(12)]}
          />
          <Surface color={body} opacity={opacity} />
        </mesh>

        <group
          position={[0, -L.upperArm * prop.limb, 0]}
          rotation={[arm.elbow, 0, 0]}
        >
          <mesh position={[0, -L.forearm / 2, 0]}>
            <capsuleGeometry
              args={[r * 0.86, L.forearm * prop.limb, cap(4), cap(12)]}
            />
            <Surface color={body} opacity={opacity} />
          </mesh>

          <group
            position={[0, -L.forearm * prop.limb, 0]}
            rotation={[arm.wrist ?? 0, 0, 0]}
          >
            <mesh scale={[1, 1.22, 0.72]}>
              <sphereGeometry args={[r * 0.92, cap(12), cap(10)]} />
              <Surface color={body} opacity={opacity} />
            </mesh>

            {side === propHand && items.hands.item !== "none" ? (
              <group position={[0, -0.03, 0.01]}>
                <HandItem item={items.hands.item} color={color.hands} />
              </group>
            ) : null}
          </group>
        </group>
      </group>
    );
  });

  const hairShapes = [
    { scale: [1.04, 0.74, 1.04] as const, phi: 0.52, y: 0.012 },
    { scale: [1.06, 0.92, 1.02] as const, phi: 0.62, y: 0.004 },
    { scale: [1.02, 0.6, 1.06] as const, phi: 0.46, y: 0.018 },
  ];
  const hair = hairShapes[prop.hair];

  return (
    <group {...group}>
      <group ref={root} scale={height / 1.74}>
        <group position={[0, pose.hipY, 0]}>
          {legs}

          {/* hips */}
          <mesh
            position={[0, Y.hip + 0.02, 0]}
            scale={[prop.build, 0.8, prop.build * 0.82]}
          >
            <sphereGeometry args={[0.088, cap(18), cap(12)]} />
            <Surface color={body} opacity={opacity} />
          </mesh>

          {items.bottom.item === "skirt" ? (
            <group position={[0, Y.hip + 0.02, 0]}>
              <SkirtItem color={color.bottom} width={prop.build} />
            </group>
          ) : null}

          {/* torso: spine slot */}
          <group ref={torso} position={[0, Y.chest, 0]} rotation={pose.spine}>
            <mesh scale={[prop.build, 1, prop.build * 0.78]}>
              <capsuleGeometry args={[0.104, 0.2, cap(6), cap(18)]} />
              <Surface color={body} opacity={opacity} />
            </mesh>

            {items.top.item !== "bare" ? (
              <TopItem
                item={items.top.item}
                color={color.top}
                width={prop.build}
                depth={prop.build * 0.78}
              />
            ) : null}

            {/* back slot */}
            <group position={[0, 0.02, -0.05]}>
              <BackItem
                item={items.back.item}
                color={color.back}
                width={prop.build}
              />
            </group>

            {/* shoulder pet */}
            {SHOULDER_PETS.has(items.pet.item) ? (
              <group position={[-prop.shoulderX * 1.1, 0.13, 0.01]} scale={0.8}>
                <PetItem item={items.pet.item} color={color.pet} />
              </group>
            ) : null}

            {arms}

            {/* neck + head */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry
                args={[0.03, 0.034, prop.neckLen + 0.03, cap(12)]}
              />
              <Surface color={body} opacity={opacity} />
            </mesh>

            <group
              ref={headRef}
              position={[0, Y.head - Y.chest, 0]}
              rotation={pose.head}
            >
              <mesh
                scale={[
                  prop.headScale,
                  prop.headScale * 1.08,
                  prop.headScale * 0.98,
                ]}
              >
                <sphereGeometry args={[0.085, cap(24), cap(18)]} />
                <Surface color={body} opacity={opacity} />
              </mesh>

              {/* generalised features, like a rough 3D scan */}
              <mesh
                position={[0, -0.004, 0.078]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <coneGeometry args={[0.014, 0.03, cap(10)]} />
                <Surface color={body} opacity={opacity} />
              </mesh>
              <mesh position={[0, -0.052, 0.04]} scale={[0.9, 0.5, 0.7]}>
                <sphereGeometry args={[0.05, cap(14), cap(10)]} />
                <Surface color={body} opacity={opacity} />
              </mesh>

              {/* hair cap, only when the head slot leaves room */}
              {items.head.item === "none" ||
              items.head.item === "halo" ||
              items.head.item === "horns" ? (
                <mesh
                  position={[0, hair.y, -0.004]}
                  scale={hair.scale as unknown as THREE.Vector3Tuple}
                >
                  <sphereGeometry
                    args={[
                      0.086,
                      cap(20),
                      cap(14),
                      0,
                      Math.PI * 2,
                      0,
                      Math.PI * hair.phi,
                    ]}
                  />
                  <Surface color={body} opacity={opacity} />
                </mesh>
              ) : null}

              {/* face slot */}
              <group position={[0, 0.004, 0.062]}>
                <FaceItem item={items.face.item} color={color.face} />
              </group>

              {/* headTop slot */}
              <group position={[0, 0.072, 0]}>
                <HeadItem item={items.head.item} color={color.head} />
              </group>
            </group>
          </group>
        </group>

        {/* ground / floating pets */}
        {items.pet.item !== "none" && !SHOULDER_PETS.has(items.pet.item) ? (
          <group
            position={[
              0.28,
              FLOATING_PETS.has(items.pet.item) ? 0.62 : 0,
              0.16,
            ]}
            rotation={[0, -0.5, 0]}
          >
            <PetItem item={items.pet.item} color={color.pet} />
          </group>
        ) : null}

        {/* ghosts stand on a faint disc so they still read on the stone */}
        {ghost ? (
          <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.2, 32]} />
            <meshBasicMaterial color={accent} transparent opacity={0.22} />
          </mesh>
        ) : null}

        {dim ? null : null}
      </group>
    </group>
  );
}

/** Height of a figure in world units, used for camera framing. */
export function figureHeight(height = 1.74): number {
  return FIGURE_UNIT_HEIGHT * (height / 1.74);
}
