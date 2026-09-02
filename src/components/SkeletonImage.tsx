import React from "react";
import type { SkeletonImageProps } from "../types";
import { useResolvedAnimation, useResolvedDuration } from "../context";

export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  width = "100%",
  height = 200,
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
    "skeleton-node--rounded",
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "--skeleton-duration": `${duration}s`,
        ...style,
      } as React.CSSProperties}
    >
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
