import type { AnimationVariant, Density, SkeletonConfig } from "./types";

/** Light-mode bone fill. Lighter than gray-200 so skeletons don't look like solid bars. */
export const DEFAULT_COLOR = "#f0f0f0";

/** Light-mode shimmer highlight — Boneyard's #f7f7f7, a soft lift off #f0f0f0. */
export const DEFAULT_SHIMMER_COLOR = "#f7f7f7";

/** Dark-mode bone fill. Subtle lift off the surface, not a heavy gray slab. */
export const DEFAULT_DARK_COLOR = "rgba(255, 255, 255, 0.08)";

export const DEFAULT_DARK_SHIMMER_COLOR = "rgba(255, 255, 255, 0.16)";

/** Seconds. Shimmer reads frantic below ~2s; Boneyard uses 2s / 1.8s. */
export const DEFAULT_DURATION = 2;

export const DEFAULT_PULSE_DURATION = 1.8;

export const DEFAULT_ANIMATION: AnimationVariant = "pulse";

export const DEFAULT_DENSITY: Density = "medium";

export const DEFAULT_SHIMMER_ANGLE = 110;

export const DEFAULT_RADIUS = "6px";

export const DEFAULT_STAGGER_MS = 80;

export const DEFAULT_TRANSITION_MS = 300;

export const DEFAULT_CONFIG: Required<
  Pick<SkeletonConfig, "animation" | "density" | "duration" | "shimmerAngle">
> = {
  animation: DEFAULT_ANIMATION,
  density: DEFAULT_DENSITY,
  duration: DEFAULT_DURATION,
  shimmerAngle: DEFAULT_SHIMMER_ANGLE,
};

export function resolveMs(
  value: number | boolean | undefined,
  whenTrue: number
): number {
  if (value === true) return whenTrue;
  if (typeof value === "number" && value > 0) return value;
  return 0;
}

export function durationFor(animation: AnimationVariant, override?: number): number {
  if (override != null) return override;
  if (animation === "pulse") return DEFAULT_PULSE_DURATION;
  if (animation === "solid") return DEFAULT_DURATION;
  return DEFAULT_DURATION;
}
