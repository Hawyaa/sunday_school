'use client';

/**
 * useMezmurMotion.ts — tiny, dependency-free motion helpers for the Mezmur page.
 * (CSS keyframes + IntersectionObserver, so nothing extra to install.)
 */

import { useEffect, useRef, type RefObject } from 'react';
import './mezmur-animations.css';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Hero entrance. The SSR markup already carries `.mz-play`, so the first play
 * happens straight from CSS (no flash). We only re-trigger it when:
 *  - the page is restored from the browser's back/forward cache (`pageshow` persisted)
 *  - the page becomes visible again without a fresh mount (effects re-run)
 * Normal client-side navigation (incl. back/forward) remounts the page, which plays it naturally.
 * Ordinary re-renders never touch the class, so nothing replays.
 */
export function useHeroReplay(ref: RefObject<HTMLElement | null>) {
  const firstRun = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const replay = () => {
      el.classList.remove('mz-play');
      void el.offsetWidth; // force reflow so the animations restart cleanly
      el.classList.add('mz-play');
    };

    if (firstRun.current) firstRun.current = false;
    else replay();

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) replay();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [ref]);
}

/**
 * Scroll-triggered reveal. Any element inside `rootRef` with `data-mz-reveal`
 * gets `.mz-in` the first time it scrolls into view. Elements with
 * `data-mz-reveal="row"` also get a staggered `--mz-d` delay (100ms apart) per batch.
 *
 * Pass values that change when new reveal-able elements mount (filtered list,
 * current view) so they get observed. Already-revealed elements are left alone.
 */
export function useScrollReveal(rootRef: RefObject<HTMLElement | null>, depA: unknown, depB: unknown) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const all = () => Array.from(root.querySelectorAll<HTMLElement>('[data-mz-reveal]'));

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      all().forEach((el) => el.classList.add('mz-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

        let rowIndex = 0;
        visible.forEach((el) => {
          if (el.dataset.mzReveal === 'row') {
            el.style.setProperty('--mz-d', `${180 + Math.min(rowIndex, 12) * 100}ms`);
            rowIndex += 1;
          }
          el.classList.add('mz-in');
          io.unobserve(el);
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -6% 0px' },
    );

    const observePending = () => all().filter((el) => !el.classList.contains('mz-in')).forEach((el) => io.observe(el));
    observePending();

    // bfcache restore: play the content reveals again too
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      all().forEach((el) => el.classList.remove('mz-in'));
      void root.offsetWidth;
      observePending();
    };
    window.addEventListener('pageshow', onPageShow);

    return () => {
      io.disconnect();
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [rootRef, depA, depB]);
}
