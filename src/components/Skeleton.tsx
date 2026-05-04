import React, { useMemo } from "react";
import { useLayoutMeasure } from "../hooks/useLayoutMeasure";
import { useSSRSkeleton } from "../hooks/useSSRSkeleton";
import { generateSkeleton } from "../utils/generateSkeleton";
import { SkeletonNodeComponent } from "./SkeletonNode";
import { SkeletonText } from "./SkeletonText";
import { SkeletonCircle } from "./SkeletonCircle";
import { SkeletonBlock } from "./SkeletonBlock";
import { SkeletonImage } from "./SkeletonImage";
import type {
  SkeletonProps,
  AnimationVariant,
  Variant,
} from "../types";

// --- Variant presets ---

function renderPresetSkeleton(
  variant: Variant,
  animation: AnimationVariant,
  duration: number
): React.ReactNode {
  switch (variant) {
    case "text":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 4 }}>
          <SkeletonText animation={animation} duration={duration} width="100%" height={14} />
          <SkeletonText animation={animation} duration={duration} width="90%" height={14} />
          <SkeletonText animation={animation} duration={duration} width="75%" height={14} />
        </div>
      );
    case "avatar":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 4 }}>
          <SkeletonCircle animation={animation} duration={duration} size={48} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <SkeletonText animation={animation} duration={duration} width="60%" height={14} />
            <SkeletonText animation={animation} duration={duration} width="40%" height={12} />
          </div>
        </div>
      );
    case "card":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 4 }}>
          <SkeletonBlock animation={animation} duration={duration} width="100%" height={160} />
          <SkeletonText animation={animation} duration={duration} width="70%" height={18} />
          <SkeletonText animation={animation} duration={duration} width="100%" height={14} />
          <SkeletonText animation={animation} duration={duration} width="85%" height={14} />
        </div>
      );
    case "image":
      return (
        <SkeletonImage animation={animation} duration={duration} width="100%" height={200} />
      );
    default:
      return null;
  }
}

// --- Main Skeleton component ---

const SkeletonMain: React.FC<SkeletonProps> = ({
  loading,
  children,
  animation = "pulse",
  duration = 1.5,
  density = "medium",
  rounded: _rounded,
  className,
  as: Wrapper = "div",
  variant,
  ssr = false,
  width,
  height,
  style,
}) => {
  // Resolve effective variant
  const effectiveVariant: Variant = variant ?? (children ? "auto" : "custom");

  const { isSSR, ssrClassName } = useSSRSkeleton(ssr);

  const { containerRef, elements, measured, containerSize } = useLayoutMeasure({
    enabled: loading && effectiveVariant === "auto" && !isSSR,
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

  // Custom variant with width/height (simple skeleton, no children)
  if (effectiveVariant === "custom" && (width || height)) {
    const animClass = `skeleton-animate-${animation}`;
    const classes = [
      "skeleton-node",
      "skeleton-node--rounded",
      animClass,
      ssrClassName,
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={classes}
        aria-busy="true"
        role="status"
        aria-label="Loading content"
        style={{
          position: "relative",
          width: width ?? "100%",
          height: height ?? 20,
          "--skeleton-duration": `${duration}s`,
          ...style,
        } as React.CSSProperties}
      />
    );
  }

  // Non-auto preset variants
  if (effectiveVariant !== "auto" && effectiveVariant !== "custom") {
    const wrapperClasses = [ssrClassName, className ?? ""]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <Wrapper
        className={wrapperClasses}
        aria-busy="true"
        role="status"
        aria-label="Loading content"
        style={style}
      >
        {renderPresetSkeleton(effectiveVariant, animation, duration)}
      </Wrapper>
    );
  }

  // SSR or not yet measured — show fallback with hidden children for measurement
  if (isSSR || !measured) {
    const fallbackAnimClass = `skeleton-animate-${animation}`;
    const wrapperClasses = [ssrClassName, className ?? ""]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <Wrapper
        className={wrapperClasses}
        aria-busy="true"
        role="status"
        aria-label="Loading content"
        style={style}
      >
        {/* Hidden children for measurement */}
        <div
          ref={containerRef}
          style={{
            visibility: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          {children}
        </div>
        {/* Fallback skeleton during SSR / pre-measurement */}
        <div
          className={`skeleton-fallback ${fallbackAnimClass}`}
          style={{
            "--skeleton-duration": `${duration}s`,
          } as React.CSSProperties}
        />
      </Wrapper>
    );
  }

  // Measured — render layout-aware skeleton
  const wrapperClasses = [ssrClassName, className ?? ""]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <Wrapper
      className={wrapperClasses}
      aria-busy="true"
      role="status"
      aria-label="Loading content"
      style={style}
    >
      {/* Keep hidden children for re-measurement on resize */}
      <div
        ref={containerRef}
        style={{
          visibility: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {children}
      </div>
      {/* Skeleton overlay */}
      <div
        className="skeleton-wrapper"
        style={{
          width: containerSize.width || "100%",
          height: containerSize.height || undefined,
          minHeight: containerSize.height || 100,
        }}
      >
        {skeletonNodes.map((node) => (
          <SkeletonNodeComponent
            key={node.id}
            node={node}
            animation={animation}
            duration={duration}
          />
        ))}
      </div>
    </Wrapper>
  );
};

SkeletonMain.displayName = "Skeleton";

// --- Compose final export with sub-components ---

type SkeletonComponent = React.FC<SkeletonProps> & {
  Text: typeof SkeletonText;
  Circle: typeof SkeletonCircle;
  Block: typeof SkeletonBlock;
  Image: typeof SkeletonImage;
};

export const Skeleton = SkeletonMain as SkeletonComponent;
Skeleton.Text = SkeletonText;
Skeleton.Circle = SkeletonCircle;
Skeleton.Block = SkeletonBlock;
Skeleton.Image = SkeletonImage;
