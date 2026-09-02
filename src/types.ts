import type React from "react";

// --- Animation ---

export type AnimationVariant = "pulse" | "shimmer" | "wave" | "solid";

// --- Shape & Variant ---

export type ShapePreset = "text" | "avatar" | "card" | "image";
export type Variant = "auto" | ShapePreset | "custom";
export type Density = "low" | "medium" | "high";

// --- Detected element types (re-export from detectElements) ---

export type DetectedElementType =
  | "text"
  | "image"
  | "button"
  | "circle"
  | "container"
  | "input"
  | "unknown";

// --- Skeleton node (generated from detected elements) ---

export interface SkeletonNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rounded: boolean;
  circle: boolean;
  type: DetectedElementType;
  /** Computed border-radius from the real element, if any */
  radius?: string;
}

// --- Global / provider config ---

export interface SkeletonConfig {
  /** Animation style. Default: "pulse" */
  animation?: AnimationVariant;
  /** DOM traversal depth for auto-detection. Default: "medium" */
  density?: Density;
  /** Animation duration in seconds. Default: 2 (pulse: 1.8) */
  duration?: number;
  /** Bone fill color (light mode). Default: #f0f0f0 */
  color?: string;
  /** Bone fill color in dark mode. Default: rgba(255,255,255,0.08) */
  darkColor?: string;
  /** Shimmer highlight (light mode) */
  shimmerColor?: string;
  /** Shimmer highlight in dark mode */
  darkShimmerColor?: string;
  /** Shimmer gradient angle in degrees. Default: 110 */
  shimmerAngle?: number;
  /** Stagger delay between bones in ms. `true` = 80ms */
  stagger?: number | boolean;
  /** Fade-out duration when loading ends in ms. `true` = 300ms */
  transition?: number | boolean;
  /** Force rounded corners on generated bones */
  rounded?: boolean;
}

/** @deprecated Use SkeletonConfig */
export type SkelionConfig = SkeletonConfig;

// --- Component props ---

export interface SkeletonProps extends SkeletonConfig {
  /** Whether to show the skeleton or render children */
  loading: boolean;
  /** Content to measure for auto-skeleton generation */
  children?: React.ReactNode;
  /** Custom CSS class for the wrapper */
  className?: string;
  /** Wrapper element type. Default: "div" */
  as?: React.ElementType;
  /** Skeleton variant / preset. Default: "auto" when children present */
  variant?: Variant;
  /** Enable SSR-safe rendering (static markup, animations after hydrate) */
  ssr?: boolean;
  /** Custom width (for simple skeletons without children) */
  width?: number | string;
  /** Custom height (for simple skeletons without children) */
  height?: number | string;
  /** Inline style for the wrapper */
  style?: React.CSSProperties;
  /**
   * Mock content measured while `loading` is true.
   * Use when children would collapse without data (same idea as Boneyard's fixture).
   */
  fixture?: React.ReactNode;
  /** Shown while loading if no bones have been measured yet */
  fallback?: React.ReactNode;
  /** Extra class applied to each generated bone */
  boneClass?: string;
}

export interface SkeletonProviderProps extends SkeletonConfig {
  children: React.ReactNode;
}

// --- Sub-component props ---

export interface SkeletonTextProps {
  /** Width of text line. Default: "100%" */
  width?: number | string;
  /** Height of text line. Default: 16 */
  height?: number | string;
  /** Number of text lines to render. Default: 1 */
  lines?: number;
  /** Gap between lines in px. Default: 8 */
  gap?: number;
  /** Animation style. Inherited from provider, else "pulse" */
  animation?: AnimationVariant;
  /** Animation duration in seconds. Inherited from provider, else 2 */
  duration?: number;
  /** Custom CSS class */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

export interface SkeletonCircleProps {
  /** Diameter of the circle. Default: 48 */
  size?: number;
  /** Animation style. Inherited from provider, else "pulse" */
  animation?: AnimationVariant;
  /** Animation duration in seconds. Inherited from provider, else 2 */
  duration?: number;
  /** Custom CSS class */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

export interface SkeletonBlockProps {
  /** Width of the block. Default: "100%" */
  width?: number | string;
  /** Height of the block. Default: 100 */
  height?: number | string;
  /** Apply rounded corners. Default: true */
  rounded?: boolean;
  /** Animation style. Inherited from provider, else "pulse" */
  animation?: AnimationVariant;
  /** Animation duration in seconds. Inherited from provider, else 2 */
  duration?: number;
  /** Custom CSS class */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

export interface SkeletonImageProps {
  /** Width of the image placeholder. Default: "100%" */
  width?: number | string;
  /** Height of the image placeholder. Default: 200 */
  height?: number | string;
  /** Animation style. Inherited from provider, else "pulse" */
  animation?: AnimationVariant;
  /** Animation duration in seconds. Inherited from provider, else 2 */
  duration?: number;
  /** Custom CSS class */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

// --- Legacy type alias for backward compat ---

/** @deprecated Use SkeletonProps instead */
export type SkelionProps = SkeletonProps;
