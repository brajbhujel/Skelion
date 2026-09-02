// --- Primary API ---
export { Skeleton } from "./components/Skeleton";
export { SkeletonProvider } from "./context";

// --- Sub-components (also available as Skeleton.*) ---
export { SkeletonText } from "./components/SkeletonText";
export { SkeletonCircle } from "./components/SkeletonCircle";
export { SkeletonBlock } from "./components/SkeletonBlock";
export { SkeletonImage } from "./components/SkeletonImage";

// --- Types ---
export type {
  SkeletonProps,
  SkeletonConfig,
  SkeletonProviderProps,
  AnimationVariant,
  Variant,
  Density,
  ShapePreset,
  SkeletonNode,
  SkeletonTextProps,
  SkeletonCircleProps,
  SkeletonBlockProps,
  SkeletonImageProps,
  SkelionConfig,
} from "./types";

// --- SSR Hook ---
export { useSSRSkeleton } from "./hooks/useSSRSkeleton";

// --- Deprecated (backward compat) ---
export { Skelion } from "./components/Skelion";
export type { SkelionProps } from "./types";

// --- CSS side-effect ---
import "./styles/skeleton.css";
