/**
 * @deprecated Use <Skeleton /> instead. This wrapper will be removed in v3.
 */
import React from "react";
import { Skeleton } from "./Skeleton";
import type { SkeletonProps } from "../types";

let warned = false;

const SkelionMain: React.FC<SkeletonProps> = (props) => {
  if (!warned && typeof console !== "undefined") {
    console.warn(
      "[skelion] <Skelion /> is deprecated and will be removed in v3. " +
      "Please use <Skeleton /> instead. " +
      "See migration guide: https://github.com/rajbhujell/Skelion#migration-v2"
    );
    warned = true;
  }

  return <Skeleton {...props} />;
};

SkelionMain.displayName = "Skelion";

// Compose with sub-components for backward compatibility
type SkelionComponent = React.FC<SkeletonProps> & {
  Text: typeof Skeleton.Text;
  Circle: typeof Skeleton.Circle;
  Block: typeof Skeleton.Block;
  Image: typeof Skeleton.Image;
};

export const Skelion = SkelionMain as SkelionComponent;
Skelion.Text = Skeleton.Text;
Skelion.Circle = Skeleton.Circle;
Skelion.Block = Skeleton.Block;
Skelion.Image = Skeleton.Image;

/** @deprecated Use SkeletonProps instead */
export type SkelionProps = SkeletonProps;
