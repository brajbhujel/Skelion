import { useState, useEffect } from "react";

interface SSRSkeletonResult {
  isSSR: boolean;
  ssrClassName: string;
}

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
