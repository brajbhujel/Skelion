import type React from "react";
import type { SkeletonConfig } from "../types";
import { durationFor } from "../defaults";

export function buildThemeStyle(
  config: Pick<
    SkeletonConfig,
    | "color"
    | "darkColor"
    | "shimmerColor"
    | "darkShimmerColor"
    | "shimmerAngle"
    | "duration"
    | "animation"
  >,
  extra?: React.CSSProperties
): React.CSSProperties {
  const duration = durationFor(config.animation ?? "pulse", config.duration);

  const style: React.CSSProperties & Record<string, string | number> = {
    width: "100%",
    display: "block",
    position: "relative",
    "--skeleton-duration": `${duration}s`,
    "--skeleton-angle": `${config.shimmerAngle ?? 110}deg`,
  };

  if (config.color) style["--skeleton-light-color"] = config.color;
  if (config.darkColor) style["--skeleton-dark-color"] = config.darkColor;
  if (config.shimmerColor) style["--skeleton-light-shimmer"] = config.shimmerColor;
  if (config.darkShimmerColor) {
    style["--skeleton-dark-shimmer"] = config.darkShimmerColor;
  }

  return { ...style, ...extra };
}
