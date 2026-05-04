import { useRef, useState, useEffect, useCallback } from "react";
import { detectElements } from "../utils/detectElements";
import type { Density } from "../types";
import type { DetectedElement } from "../utils/detectElements";

interface UseLayoutMeasureOptions {
  enabled: boolean;
  density?: Density;
}

interface LayoutMeasureResult {
  containerRef: React.RefObject<HTMLDivElement>;
  elements: DetectedElement[];
  measured: boolean;
  containerSize: { width: number; height: number };
}

export function useLayoutMeasure({
  enabled,
  density = "medium",
}: UseLayoutMeasureOptions): LayoutMeasureResult {
  const containerRef = useRef<HTMLDivElement>(null!);
  const [elements, setElements] = useState<DetectedElement[]>([]);
  const [measured, setMeasured] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });

    const detected = detectElements(container, density);
    setElements(detected);
    setMeasured(true);
  }, [density]);

  useEffect(() => {
    if (!enabled) {
      setMeasured(false);
      setElements([]);
      return;
    }

    // Use requestAnimationFrame to ensure layout is painted before measuring
    const rafId = requestAnimationFrame(() => {
      measure();
    });

    // Set up ResizeObserver for dynamic layouts
    const container = containerRef.current;
    let observer: ResizeObserver | null = null;

    if (container && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        // Debounce resize measurements
        if (resizeTimerRef.current) {
          clearTimeout(resizeTimerRef.current);
        }
        resizeTimerRef.current = setTimeout(() => {
          measure();
        }, 150);
      });
      observer.observe(container);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, [enabled, measure]);

  return { containerRef, elements, measured, containerSize };
}
