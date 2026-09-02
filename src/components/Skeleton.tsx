import React, { useMemo } from "react";
import { useLayoutMeasure } from "../hooks/useLayoutMeasure";
import { useSSRSkeleton } from "../hooks/useSSRSkeleton";
import { useLoadingTransition } from "../hooks/useLoadingTransition";
import { generateSkeleton } from "../utils/generateSkeleton";
import { buildThemeStyle } from "../utils/theme";
import { SkeletonNodeComponent } from "./SkeletonNode";
import { SkeletonText } from "./SkeletonText";
import { SkeletonCircle } from "./SkeletonCircle";
import { SkeletonBlock } from "./SkeletonBlock";
import { SkeletonImage } from "./SkeletonImage";
import { useSkeletonContext } from "../context";
import {
  DEFAULT_ANIMATION,
  DEFAULT_DENSITY,
  DEFAULT_SHIMMER_ANGLE,
  DEFAULT_STAGGER_MS,
  durationFor,
  resolveMs,
} from "../defaults";
import type { SkeletonProps, AnimationVariant, Variant } from "../types";

function renderPresetSkeleton(
  variant: Variant,
  animation: AnimationVariant,
  duration: number
): React.ReactNode {
  switch (variant) {
    case "text":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
          <SkeletonText animation={animation} duration={duration} width="100%" height={14} />
          <SkeletonText animation={animation} duration={duration} width="90%" height={14} />
          <SkeletonText animation={animation} duration={duration} width="75%" height={14} />
        </div>
      );
    case "avatar":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
          <SkeletonCircle animation={animation} duration={duration} size={48} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0, width: "100%" }}>
            <SkeletonText animation={animation} duration={duration} width="60%" height={14} />
            <SkeletonText animation={animation} duration={duration} width="40%" height={12} />
          </div>
        </div>
      );
    case "card":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
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

function MeasureSlot({
  containerRef,
  children,
  hidden = true,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  hidden?: boolean;
}) {
  return (
    <div
      ref={containerRef}
      className="skeleton-measure"
      style={{
        visibility: hidden ? "hidden" : "visible",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        maxWidth: "100%",
        pointerEvents: hidden ? "none" : "auto",
      }}
      aria-hidden={hidden ? "true" : undefined}
    >
      {children}
    </div>
  );
}

const SkeletonMain: React.FC<SkeletonProps> = (props) => {
  const ctx = useSkeletonContext();

  const loading = props.loading;
  const children = props.children;
  const fixture = props.fixture;
  const fallback = props.fallback;
  const animation = props.animation ?? ctx.animation ?? DEFAULT_ANIMATION;
  const duration = durationFor(animation, props.duration ?? ctx.duration);
  const density = props.density ?? ctx.density ?? DEFAULT_DENSITY;
  const rounded = props.rounded ?? ctx.rounded;
  const className = props.className;
  const Wrapper = props.as ?? "div";
  const variant = props.variant;
  const ssr = props.ssr ?? false;
  const width = props.width;
  const height = props.height;
  const style = props.style;
  const boneClass = props.boneClass;
  const color = props.color ?? ctx.color;
  const darkColor = props.darkColor ?? ctx.darkColor;
  const shimmerColor = props.shimmerColor ?? ctx.shimmerColor;
  const darkShimmerColor = props.darkShimmerColor ?? ctx.darkShimmerColor;
  const shimmerAngle = props.shimmerAngle ?? ctx.shimmerAngle ?? DEFAULT_SHIMMER_ANGLE;
  const stagger = props.stagger ?? ctx.stagger;
  const transition = props.transition ?? ctx.transition;

  const effectiveVariant: Variant = variant ?? (children || fixture ? "auto" : "custom");
  const { isSSR, ssrClassName } = useSSRSkeleton(ssr);
  const { showSkeleton, exiting, exitMs } = useLoadingTransition(loading, transition);
  const staggerMs = resolveMs(stagger, DEFAULT_STAGGER_MS);

  const measureEnabled =
    showSkeleton && effectiveVariant === "auto" && !isSSR;

  const { containerRef, elements, measured, containerSize } = useLayoutMeasure({
    enabled: measureEnabled,
    density,
  });

  const skeletonNodes = useMemo(
    () => generateSkeleton(elements, { rounded }),
    [elements, rounded]
  );

  const themeStyle = buildThemeStyle(
    {
      color,
      darkColor,
      shimmerColor,
      darkShimmerColor,
      shimmerAngle,
      duration,
      animation,
    },
    {
      ...(exitMs ? ({ "--skeleton-exit": `${exitMs}ms` } as React.CSSProperties) : {}),
      ...style,
    }
  );

  const measureContent = fixture ?? children;

  if (!showSkeleton) {
    return <>{children}</>;
  }

  const rootClass = ["skeleton-root", ssrClassName, className ?? ""]
    .filter(Boolean)
    .join(" ");

  // Custom variant with width/height (simple skeleton, no children)
  if (effectiveVariant === "custom" && (width || height)) {
    const animClass = `skeleton-animate-${animation}`;
    const classes = [
      "skeleton-root",
      "skeleton-node",
      "skeleton-node--relative",
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
          ...themeStyle,
          width: width ?? "100%",
          height: height ?? 20,
        }}
      />
    );
  }

  // Non-auto preset variants
  if (effectiveVariant !== "auto" && effectiveVariant !== "custom") {
    return (
      <Wrapper
        className={rootClass}
        aria-busy="true"
        role="status"
        aria-label="Loading content"
        style={themeStyle}
      >
        {renderPresetSkeleton(effectiveVariant, animation, duration)}
      </Wrapper>
    );
  }

  const showShine = animation === "shimmer" || animation === "wave";
  const wrapperAnimClass =
    animation === "shimmer"
      ? "skeleton-wrapper--shimmer"
      : animation === "wave"
        ? "skeleton-wrapper--wave"
        : "";

  // SSR or not yet measured
  if (isSSR || !measured) {
    return (
      <Wrapper
        className={rootClass}
        aria-busy="true"
        role="status"
        aria-label="Loading content"
        style={themeStyle}
      >
        <MeasureSlot containerRef={containerRef}>{measureContent}</MeasureSlot>
        {fallback ?? (
          <div
            className={`skeleton-fallback skeleton-animate-${animation}`}
            style={{ "--skeleton-duration": `${duration}s` } as React.CSSProperties}
          />
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper
      className={rootClass}
      aria-busy="true"
      role="status"
      aria-label="Loading content"
      style={themeStyle}
    >
      <MeasureSlot containerRef={containerRef} hidden={!exiting}>
        {exiting ? children : measureContent}
      </MeasureSlot>
      <div
        className={[
          "skeleton-wrapper",
          wrapperAnimClass,
          exiting ? "skeleton-wrapper--exit" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          position: "relative",
          width: "100%",
          height: containerSize.height || undefined,
          minHeight: containerSize.height || 100,
        }}
      >
        {skeletonNodes.map((node, index) => (
              <SkeletonNodeComponent
                key={node.id}
                node={node}
                animation={animation}
                duration={duration}
                className={boneClass}
                index={index}
                staggerMs={staggerMs}
                forceRounded={rounded}
              />
            ))}
        {showShine && skeletonNodes.length > 0 ? (
          <div className="skeleton-shine" aria-hidden="true" />
        ) : null}
      </div>
    </Wrapper>
  );
};

SkeletonMain.displayName = "Skeleton";

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
