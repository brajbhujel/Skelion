import React from "react";
import type { SkeletonCircleProps } from "../types";
import { useResolvedAnimation, useResolvedDuration } from "../context";

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 48,
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
    "skeleton-node--circle",
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
        width: size,
        height: size,
        flexShrink: 0,
        "--skeleton-duration": `${duration}s`,
        ...style,
      } as React.CSSProperties}
    />
  );
};

SkeletonCircle.displayName = "Skeleton.Circle";
