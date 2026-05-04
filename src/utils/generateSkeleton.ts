import type { DetectedElement } from "./detectElements";
import type { SkeletonNode } from "../types";

export type { SkeletonNode };

export function generateSkeleton(
  elements: DetectedElement[]
): SkeletonNode[] {
  return elements.map((el, index) => ({
    id: `skeleton-${index}`,
    x: el.rect.x,
    y: el.rect.y,
    width: el.rect.width,
    height: el.rect.height,
    rounded: el.rounded,
    circle: el.type === "circle",
    type: el.type,
  }));
}
