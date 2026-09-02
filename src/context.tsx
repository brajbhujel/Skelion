import React, { createContext, useContext, useMemo } from "react";
import type { SkeletonConfig, SkeletonProviderProps } from "./types";
import {
  DEFAULT_ANIMATION,
  durationFor,
} from "./defaults";

const SkeletonContext = createContext<SkeletonConfig | null>(null);

export function SkeletonProvider({
  children,
  ...config
}: SkeletonProviderProps) {
  const value = useMemo(() => config, [
    config.animation,
    config.density,
    config.duration,
    config.color,
    config.darkColor,
    config.shimmerColor,
    config.darkShimmerColor,
    config.shimmerAngle,
    config.stagger,
    config.transition,
    config.rounded,
  ]);

  return (
    <SkeletonContext.Provider value={value}>
      {children}
    </SkeletonContext.Provider>
  );
}

export function useSkeletonContext(): SkeletonConfig {
  return useContext(SkeletonContext) ?? {};
}

export function useResolvedAnimation(
  animation?: SkeletonConfig["animation"]
): NonNullable<SkeletonConfig["animation"]> {
  const ctx = useSkeletonContext();
  return animation ?? ctx.animation ?? DEFAULT_ANIMATION;
}

export function useResolvedDuration(
  duration?: number,
  animation?: SkeletonConfig["animation"]
): number {
  const ctx = useSkeletonContext();
  const resolvedAnimation = animation ?? ctx.animation ?? DEFAULT_ANIMATION;
  return durationFor(resolvedAnimation, duration ?? ctx.duration);
}

