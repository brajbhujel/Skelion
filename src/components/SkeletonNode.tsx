import React from "react";
import type { SkeletonNode as SkeletonNodeType } from "../utils/generateSkeleton";

interface SkeletonNodeProps {
  node: SkeletonNodeType;
  shimmer: boolean;
  duration: number;
  className?: string;
}

export const SkeletonNode: React.FC<SkeletonNodeProps> = React.memo(
  ({ node, shimmer, duration, className }) => {
    const nodeClasses = [
      "skelion-node",
      node.circle ? "skelion-node--circle" : node.rounded ? "skelion-node--rounded" : "",
      shimmer ? "skelion-shimmer" : "",
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
          animationDuration: shimmer ? `${duration}s` : undefined,
        }}
      />
    );
  }
);

SkeletonNode.displayName = "SkeletonNode";
