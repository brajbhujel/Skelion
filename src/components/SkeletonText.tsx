import React from "react";
import type { AnimationVariant, SkeletonTextProps } from "../types";

function getAnimationClass(animation: AnimationVariant): string {
  return `skeleton-animate-${animation}`;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  width = "100%",
  height = 16,
  lines = 1,
  gap = 8,
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

  if (lines > 1) {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", gap, ...style }}
        aria-hidden="true"
      >
        {Array.from({ length: lines }, (_, i) => {
          // Last line is shorter for a natural look
          const lineWidth = i === lines - 1 ? "75%" : width;
          return (
            <div
              key={i}
              className={classes}
              style={{
                position: "relative",
                width: lineWidth,
                height,
                "--skeleton-duration": `${duration}s`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>
    );
  }

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

SkeletonText.displayName = "Skeleton.Text";
