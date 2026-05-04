import React from "react";
import type { AnimationVariant, SkeletonImageProps } from "../types";

function getAnimationClass(animation: AnimationVariant): string {
  return `skeleton-animate-${animation}`;
}

export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  width = "100%",
  height = 200,
  animation = "pulse",
  duration = 1.5,
  className,
  style,
}) => {
  const classes = [
    "skeleton-node",
    "skeleton-node--rounded",
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "--skeleton-duration": `${duration}s`,
        ...style,
      } as React.CSSProperties}
    >
      {/* Image placeholder icon */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.2 }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
};

SkeletonImage.displayName = "Skeleton.Image";
