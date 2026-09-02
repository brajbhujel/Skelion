import { useEffect, useState } from "react";
import { resolveMs, DEFAULT_TRANSITION_MS } from "../defaults";

interface LoadingTransition {
  showSkeleton: boolean;
  exiting: boolean;
  exitMs: number;
}

/**
 * Keep the skeleton mounted for `transition` ms after loading ends
 * so it can fade out over the real content.
 */
export function useLoadingTransition(
  loading: boolean,
  transition?: number | boolean
): LoadingTransition {
  const exitMs = resolveMs(transition, DEFAULT_TRANSITION_MS);
  const [showSkeleton, setShowSkeleton] = useState(loading);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
      setExiting(false);
      return;
    }

    if (!exitMs) {
      setShowSkeleton(false);
      setExiting(false);
      return;
    }

    setExiting(true);
    const id = window.setTimeout(() => {
      setShowSkeleton(false);
      setExiting(false);
    }, exitMs);

    return () => window.clearTimeout(id);
  }, [loading, exitMs]);

  return { showSkeleton: loading || showSkeleton, exiting, exitMs };
}
