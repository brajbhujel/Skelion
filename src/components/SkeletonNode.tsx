import React from "react";
import type { SkeletonNode as SkeletonNodeType, AnimationVariant } from "../types";

interface SkeletonNodeProps {
  node: SkeletonNodeType;
  animation: AnimationVariant;
  duration: number;
  className?: string;
  index?: number;
  staggerMs?: number;
  forceRounded?: boolean;
}

export const SkeletonNodeComponent: React.FC<SkeletonNodeProps> = React.memo(
  ({
    node,
    animation,
    duration,
    className,
    index = 0,
    staggerMs = 0,
    forceRounded,
  }) => {
    const rounded = forceRounded || node.rounded;
    const nodeClasses = [
      "skeleton-node",
      node.circle ? "skeleton-node--circle" : rounded ? "skeleton-node--rounded" : "",
      `skeleton-animate-${animation}`,
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    const style: React.CSSProperties = {
      left: node.x,
      top: node.y,
      width: node.width,
      height: node.height,
      "--skeleton-duration": `${duration}s`,
    } as React.CSSProperties;

    if (node.radius && !node.circle) {
      style.borderRadius = node.radius;
    }

    if (staggerMs > 0) {
      style.animationDelay = `${index * staggerMs}ms`;
    }

    return (
      <div
        className={nodeClasses}
        aria-hidden="true"
        style={style}
      />
    );
  }
);

SkeletonNodeComponent.displayName = "SkeletonNode";
