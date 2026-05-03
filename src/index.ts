export { Skelion } from "./components/Skelion";
export type { SkelionProps } from "./components/Skelion";
export type { Density } from "./utils/detectElements";
export type { SkeletonNode } from "./utils/generateSkeleton";

// Side-effect: import CSS so bundlers can extract it
import "./styles/shimmer.css";
