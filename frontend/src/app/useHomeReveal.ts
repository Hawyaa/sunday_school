'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Intersection Observer-based reveal system
 * matching the HTML design's `.rv`, `.rl`, `.rr` pattern.
 */
export function useHomeReveal() {
  const rootRef = useRef<HTMLDivElement>(null);

  const observe = useCallback(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      rootRef.current.querySelectorAll('.rv,.rl,.rr').forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    rootRef.current.querySelectorAll('.rv,.rl,.rr').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = observe();
    return cleanup;
  }, [observe]);

  return rootRef;
}
