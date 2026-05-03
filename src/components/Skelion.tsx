import React, { useMemo } from "react";
import { useLayoutMeasure } from "../hooks/useLayoutMeasure";
import { generateSkeleton } from "../utils/generateSkeleton";
import { SkeletonNode } from "./SkeletonNode";
import type { Density } from "../utils/detectElements";

// --- Sub-components for manual skeleton building ---

interface ManualSkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  shimmer?: boolean;
  duration?: number;
  style?: React.CSSProperties;
}

const SkelionText: React.FC<ManualSkeletonProps> = ({
  width = "100%",
  height = 16,
  className,
  shimmer = true,
  duration = 1.5,
  style,
}) => {
  const classes = [
    "skelion-node",
    "skelion-node--rounded",
    shimmer ? "skelion-shimmer" : "",
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
        animationDuration: shimmer ? `${duration}s` : undefined,
        ...style,
      }}
    />
  );
};

SkelionText.displayName = "Skelion.Text";

const SkelionCircle: React.FC<ManualSkeletonProps & { size?: number }> = ({
  size = 48,
  className,
  shimmer = true,
  duration = 1.5,
  style,
}) => {
  const classes = [
    "skelion-node",
    "skelion-node--circle",
    shimmer ? "skelion-shimmer" : "",
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
        animationDuration: shimmer ? `${duration}s` : undefined,
        ...style,
      }}
    />
  );
};

SkelionCircle.displayName = "Skelion.Circle";

const SkelionBlock: React.FC<ManualSkeletonProps & { rounded?: boolean }> = ({
  width = "100%",
  height = 100,
  rounded = true,
  className,
  shimmer = true,
  duration = 1.5,
  style,
}) => {
  const classes = [
    "skelion-node",
    rounded ? "skelion-node--rounded" : "",
    shimmer ? "skelion-shimmer" : "",
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
        animationDuration: shimmer ? `${duration}s` : undefined,
        ...style,
      }}
    />
  );
};

SkelionBlock.displayName = "Skelion.Block";

// --- Variant presets ---

type Variant = "auto" | "text" | "avatar" | "card" | "custom";

function renderPresetSkeleton(
  variant: Variant,
  shimmer: boolean,
  duration: number
): React.ReactNode {
  switch (variant) {
    case "text":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 4 }}>
          <SkelionText shimmer={shimmer} duration={duration} width="100%" height={14} />
          <SkelionText shimmer={shimmer} duration={duration} width="90%" height={14} />
          <SkelionText shimmer={shimmer} duration={duration} width="75%" height={14} />
        </div>
      );
    case "avatar":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 4 }}>
          <SkelionCircle shimmer={shimmer} duration={duration} size={48} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <SkelionText shimmer={shimmer} duration={duration} width="60%" height={14} />
            <SkelionText shimmer={shimmer} duration={duration} width="40%" height={12} />
          </div>
        </div>
      );
    case "card":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 4 }}>
          <SkelionBlock shimmer={shimmer} duration={duration} width="100%" height={160} />
          <SkelionText shimmer={shimmer} duration={duration} width="70%" height={18} />
          <SkelionText shimmer={shimmer} duration={duration} width="100%" height={14} />
          <SkelionText shimmer={shimmer} duration={duration} width="85%" height={14} />
        </div>
      );
    default:
      return null;
  }
}

// --- Main Skelion component ---

export interface SkelionProps {
  loading: boolean;
  children: React.ReactNode;
  shimmer?: boolean;
  duration?: number;
  density?: Density;
  rounded?: boolean;
  className?: string;
  as?: React.ElementType;
  variant?: Variant;
}

const SkelionMain: React.FC<SkelionProps> = ({
  loading,
  children,
  shimmer = true,
  duration = 1.5,
  density = "medium",
  rounded: _rounded,
  className,
  as: Wrapper = "div",
  variant = "auto",
}) => {
  const isSSR = typeof window === "undefined";

  const { containerRef, elements, measured, containerSize } = useLayoutMeasure({
    enabled: loading && variant === "auto",
    density,
  });

  const skeletonNodes = useMemo(
    () => generateSkeleton(elements),
    [elements]
  );

  // Not loading — render children normally
  if (!loading) {
    return <>{children}</>;
  }

  // Non-auto variants use preset skeletons
  if (variant !== "auto" && variant !== "custom") {
    return (
      <Wrapper
        className={className}
        aria-busy="true"
        role="status"
        aria-label="Loading content"
      >
        {renderPresetSkeleton(variant, shimmer, duration)}
      </Wrapper>
    );
  }

  // SSR or not yet measured — show fallback
  if (isSSR || !measured) {
    return (
      <Wrapper
        className={className}
        aria-busy="true"
        role="status"
        aria-label="Loading content"
      >
        {/* Hidden children for measurement */}
        <div
          ref={containerRef}
          style={{ visibility: "hidden", position: "absolute", top: 0, left: 0, right: 0, pointerEvents: "none" }}
          aria-hidden="true"
        >
          {children}
        </div>
        {/* Fallback skeleton during SSR / pre-measurement */}
        <div className={`skelion-fallback ${shimmer ? "skelion-shimmer" : ""}`} style={{ animationDuration: `${duration}s` }} />
      </Wrapper>
    );
  }

  // Measured — render layout-aware skeleton
  return (
    <Wrapper
      className={className}
      aria-busy="true"
      role="status"
      aria-label="Loading content"
    >
      {/* Keep hidden children for re-measurement on resize */}
      <div
        ref={containerRef}
        style={{ visibility: "hidden", position: "absolute", top: 0, left: 0, right: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        {children}
      </div>
      {/* Skeleton overlay */}
      <div
        className="skelion-wrapper"
        style={{
          width: containerSize.width || "100%",
          height: containerSize.height || undefined,
          minHeight: containerSize.height || 100,
        }}
      >
        {skeletonNodes.map((node) => (
          <SkeletonNode
            key={node.id}
            node={node}
            shimmer={shimmer}
            duration={duration}
          />
        ))}
      </div>
    </Wrapper>
  );
};

SkelionMain.displayName = "Skelion";

// --- Compose final export ---

type SkelionComponent = React.FC<SkelionProps> & {
  Text: typeof SkelionText;
  Circle: typeof SkelionCircle;
  Block: typeof SkelionBlock;
};

export const Skelion = SkelionMain as SkelionComponent;
Skelion.Text = SkelionText;
Skelion.Circle = SkelionCircle;
Skelion.Block = SkelionBlock;
