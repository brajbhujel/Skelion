import { DetectedElement } from "./detectElements";

export interface SkeletonNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rounded: boolean;
  circle: boolean;
  type: DetectedElement["type"];
}

export function generateSkeleton(
  elements: DetectedElement[]
): SkeletonNode[] {
  return elements.map((el, index) => ({
    id: `skelion-${index}`,
    x: el.rect.x,
    y: el.rect.y,
    width: el.rect.width,
    height: el.rect.height,
    rounded: el.rounded,
    circle: el.type === "circle",
    type: el.type,
  }));
}
