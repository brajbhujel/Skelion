import { useState, useEffect } from "react";

interface SSRSkeletonResult {
  /** True when rendering on the server or before client hydration completes */
  isSSR: boolean;
  /** CSS class to apply during SSR (disables animations) */
  ssrClassName: string;
}

/**
 * Boneyard Pattern hook for SSR-safe skeleton rendering.
 *
 * Server renders static skeleton markup with animations disabled.
 * Client hydrates identically on first pass (no mismatch).
 * After useEffect, animations are enabled.
 */
export function useSSRSkeleton(ssr: boolean): SSRSkeletonResult {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (ssr) {
      setHydrated(true);
    }
  }, [ssr]);

  return {
    isSSR: ssr && !hydrated,
    ssrClassName: ssr && !hydrated ? "skeleton-ssr" : "",
  };
}
