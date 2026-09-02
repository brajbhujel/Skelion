import React from "react";
import type { SkeletonBlockProps } from "../types";
import { useResolvedAnimation, useResolvedDuration } from "../context";

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  width = "100%",
  height = 100,
  rounded = true,
  animation: animationProp,
  duration: durationProp,
  className,
  style,
}) => {
  const animation = useResolvedAnimation(animationProp);
  const duration = useResolvedDuration(durationProp, animation);
  const classes = [
    "skeleton-node",
    "skeleton-node--relative",
    rounded ? "skeleton-node--rounded" : "",
    `skeleton-animate-${animation}`,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      aria-hidden="true"
      style={{
        width,
        height,
        "--skeleton-duration": `${duration}s`,
        ...style,
      } as React.CSSProperties}
    />
  );
};

SkeletonBlock.displayName = "Skeleton.Block";
