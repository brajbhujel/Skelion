// --- Primary API ---
export { Skeleton } from "./components/Skeleton";

// --- Sub-components (also available as Skeleton.*) ---
export { SkeletonText } from "./components/SkeletonText";
export { SkeletonCircle } from "./components/SkeletonCircle";
export { SkeletonBlock } from "./components/SkeletonBlock";
export { SkeletonImage } from "./components/SkeletonImage";

// --- Types ---
export type {
  SkeletonProps,
  AnimationVariant,
  Variant,
  Density,
  ShapePreset,
  SkeletonNode,
  SkeletonTextProps,
  SkeletonCircleProps,
  SkeletonBlockProps,
  SkeletonImageProps,
} from "./types";

// --- SSR Hook ---
export { useSSRSkeleton } from "./hooks/useSSRSkeleton";

// --- Deprecated (backward compat — will be removed in v3) ---
export { Skelion } from "./components/Skelion";
export type { SkelionProps } from "./types";

// --- CSS side-effect ---
import "./styles/skeleton.css";
