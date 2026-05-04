import { generateSkeleton } from "../utils/generateSkeleton";
import type { DetectedElement } from "../utils/detectElements";

describe("generateSkeleton", () => {
  it("converts detected elements to skeleton nodes with matching dimensions", () => {
    const detected: DetectedElement[] = [
      {
        type: "image",
        rect: { x: 0, y: 0, width: 200, height: 150 },
        rounded: false,
      },
      {
        type: "text",
        rect: { x: 0, y: 160, width: 300, height: 20 },
        rounded: false,
      },
      {
        type: "button",
        rect: { x: 0, y: 200, width: 100, height: 36 },
        rounded: true,
      },
    ];

    const nodes = generateSkeleton(detected);

    expect(nodes).toHaveLength(3);

    // Each node must exactly match the detected element's position and size
    expect(nodes[0]).toEqual({
      id: "skeleton-0",
      x: 0,
      y: 0,
      width: 200,
      height: 150,
      rounded: false,
      circle: false,
      type: "image",
    });

    expect(nodes[1]).toEqual({
      id: "skeleton-1",
      x: 0,
      y: 160,
      width: 300,
      height: 20,
      rounded: false,
      circle: false,
      type: "text",
    });

    expect(nodes[2]).toEqual({
      id: "skeleton-2",
      x: 0,
      y: 200,
      width: 100,
      height: 36,
      rounded: true,
      circle: false,
      type: "button",
    });
  });

  it("marks circle-type elements with circle: true", () => {
    const detected: DetectedElement[] = [
      {
        type: "circle",
        rect: { x: 10, y: 10, width: 48, height: 48 },
        rounded: true,
      },
    ];

    const nodes = generateSkeleton(detected);

    expect(nodes[0].circle).toBe(true);
    expect(nodes[0].rounded).toBe(true);
    expect(nodes[0].width).toBe(48);
    expect(nodes[0].height).toBe(48);
  });

  it("returns empty array for empty input", () => {
    expect(generateSkeleton([])).toEqual([]);
  });

  it("generates unique IDs for each node", () => {
    const detected: DetectedElement[] = Array.from({ length: 5 }, (_, i) => ({
      type: "text" as const,
      rect: { x: 0, y: i * 24, width: 300, height: 20 },
      rounded: false,
    }));

    const nodes = generateSkeleton(detected);
    const ids = nodes.map((n) => n.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(5);
  });
});
