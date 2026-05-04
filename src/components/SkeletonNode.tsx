import React from "react";
import type { SkeletonNode as SkeletonNodeType, AnimationVariant } from "../types";

interface SkeletonNodeProps {
  node: SkeletonNodeType;
  animation: AnimationVariant;
  duration: number;
  className?: string;
}

export const SkeletonNodeComponent: React.FC<SkeletonNodeProps> = React.memo(
  ({ node, animation, duration, className }) => {
    const nodeClasses = [
      "skeleton-node",
      node.circle ? "skeleton-node--circle" : node.rounded ? "skeleton-node--rounded" : "",
      `skeleton-animate-${animation}`,
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={nodeClasses}
        aria-hidden="true"
        style={{
          left: node.x,
          top: node.y,
          width: node.width,
          height: node.height,
          "--skeleton-duration": `${duration}s`,
        } as React.CSSProperties}
      />
    );
  }
);

SkeletonNodeComponent.displayName = "SkeletonNode";
