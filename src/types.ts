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
}

// --- Component props ---

export interface SkeletonProps {
  /** Whether to show the skeleton or render children */
  loading: boolean;
  /** Content to measure for auto-skeleton generation */
  children?: React.ReactNode;
  /** Animation style. Default: "pulse" */
  animation?: AnimationVariant;
  /** Animation duration in seconds. Default: 1.5 */
  duration?: number;
  /** DOM traversal depth for auto-detection. Default: "medium" */
  density?: Density;
  /** Force rounded corners on all nodes */
  rounded?: boolean;
  /** Custom CSS class for the wrapper */
  className?: string;
  /** Wrapper element type. Default: "div" */
  as?: React.ElementType;
  /** Skeleton variant / preset. Default: "auto" when children present */
  variant?: Variant;
  /** Enable SSR-safe Boneyard Pattern rendering */
  ssr?: boolean;
  /** Custom width (for simple skeletons without children) */
  width?: number | string;
  /** Custom height (for simple skeletons without children) */
  height?: number | string;
  /** Inline style for the wrapper */
  style?: React.CSSProperties;
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
  /** Animation style. Default: "pulse" */
  animation?: AnimationVariant;
  /** Animation duration in seconds. Default: 1.5 */
  duration?: number;
  /** Custom CSS class */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

export interface SkeletonCircleProps {
  /** Diameter of the circle. Default: 48 */
  size?: number;
  /** Animation style. Default: "pulse" */
  animation?: AnimationVariant;
  /** Animation duration in seconds. Default: 1.5 */
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
  /** Animation style. Default: "pulse" */
  animation?: AnimationVariant;
  /** Animation duration in seconds. Default: 1.5 */
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
  /** Animation style. Default: "pulse" */
  animation?: AnimationVariant;
  /** Animation duration in seconds. Default: 1.5 */
  duration?: number;
  /** Custom CSS class */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

// --- Legacy type alias for backward compat ---

/** @deprecated Use SkeletonProps instead */
export type SkelionProps = SkeletonProps;
