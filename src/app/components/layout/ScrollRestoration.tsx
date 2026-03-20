import { useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigationType } from "react-router";

/**
 * Manages scroll-to-top on forward navigation and scroll restoration on back/forward.
 * Pass a ref to the scrollable container element.
 */
export function useScrollRestoration(scrollRef: React.RefObject<HTMLElement | null>) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const previousPath = useRef<string>(location.pathname + location.search);

  const saveScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      scrollPositions.current.set(previousPath.current, scrollRef.current.scrollTop);
    }
  }, [scrollRef]);

  useEffect(() => {
    const currentKey = location.pathname + location.search;

    // Save the scroll position of the page we're leaving
    if (currentKey !== previousPath.current) {
      saveScrollPosition();
    }

    // Restore or reset scroll
    const el = scrollRef.current;
    if (!el) return;

    if (navigationType === "POP") {
      // Back/forward button: restore saved position
      const saved = scrollPositions.current.get(currentKey);
      // Use requestAnimationFrame to ensure content has rendered
      requestAnimationFrame(() => {
        el.scrollTop = saved ?? 0;
      });
    } else {
      // PUSH or REPLACE: scroll to top
      el.scrollTop = 0;
    }

    previousPath.current = currentKey;
  }, [location.pathname, location.search, navigationType, scrollRef, saveScrollPosition]);
}

/**
 * Same logic but for window/document scroll (used by public shell).
 */
export function useWindowScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const previousPath = useRef<string>(location.pathname + location.search);

  useEffect(() => {
    const currentKey = location.pathname + location.search;

    // Save the scroll position of the page we're leaving
    if (currentKey !== previousPath.current) {
      scrollPositions.current.set(previousPath.current, window.scrollY);
    }

    if (navigationType === "POP") {
      const saved = scrollPositions.current.get(currentKey);
      requestAnimationFrame(() => {
        window.scrollTo(0, saved ?? 0);
      });
    } else {
      window.scrollTo(0, 0);
    }

    previousPath.current = currentKey;
  }, [location.pathname, location.search, navigationType]);
}
