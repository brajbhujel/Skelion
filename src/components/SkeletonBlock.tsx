import React from "react";
import type { AnimationVariant, SkeletonBlockProps } from "../types";

function getAnimationClass(animation: AnimationVariant): string {
  return `skeleton-animate-${animation}`;
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  width = "100%",
  height = 100,
  rounded = true,
  animation = "pulse",
  duration = 1.5,
  className,
  style,
}) => {
  const classes = [
    "skeleton-node",
    rounded ? "skeleton-node--rounded" : "",
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
        width,
        height,
        "--skeleton-duration": `${duration}s`,
        ...style,
      } as React.CSSProperties}
    />
  );
};

SkeletonBlock.displayName = "Skeleton.Block";
