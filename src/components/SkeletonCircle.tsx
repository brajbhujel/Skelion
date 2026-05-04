import React from "react";
import type { AnimationVariant, SkeletonCircleProps } from "../types";

function getAnimationClass(animation: AnimationVariant): string {
  return `skeleton-animate-${animation}`;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 48,
  animation = "pulse",
  duration = 1.5,
  className,
  style,
}) => {
  const classes = [
    "skeleton-node",
    "skeleton-node--circle",
    getAnimationClass(animation),
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      aria-hidden="true"
      style={{
        position: "relative",
        width: size,
        height: size,
        "--skeleton-duration": `${duration}s`,
        ...style,
      } as React.CSSProperties}
    />
  );
};

SkeletonCircle.displayName = "Skeleton.Circle";
