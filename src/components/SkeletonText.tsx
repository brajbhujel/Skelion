import React from "react";
import type { SkeletonTextProps } from "../types";
import { useResolvedAnimation, useResolvedDuration } from "../context";

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  width = "100%",
  height = 16,
  lines = 1,
  gap = 8,
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

  if (lines > 1) {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", gap, width: "100%", ...style }}
        aria-hidden="true"
      >
        {Array.from({ length: lines }, (_, i) => {
          const lineWidth = i === lines - 1 ? "75%" : width;
          return (
            <div
              key={i}
              className={classes}
              style={{
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
        width,
        height,
        "--skeleton-duration": `${duration}s`,
        ...style,
      } as React.CSSProperties}
    />
  );
};

SkeletonText.displayName = "Skeleton.Text";
