import type { DetectedElement } from "./detectElements";
import type { SkeletonNode } from "../types";

export type { SkeletonNode };

export function generateSkeleton(
  elements: DetectedElement[],
  options?: { rounded?: boolean }
): SkeletonNode[] {
  return elements.map((el, index) => {
    const rounded = options?.rounded ? true : el.rounded;
    const node: SkeletonNode = {
      id: `skeleton-${index}`,
      x: el.rect.x,
      y: el.rect.y,
      width: el.rect.width,
      height: el.rect.height,
      rounded,
      circle: el.type === "circle",
      type: el.type,
    };
    if (el.radius) node.radius = el.radius;
    return node;
  });
}
