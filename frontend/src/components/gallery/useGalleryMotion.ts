'use client';

/**
 * useGalleryMotion.ts — dependency-free motion helpers for the Gallery page
 * (CSS keyframes + IntersectionObserver + one rAF scroll loop for parallax).
 */

import { useEffect, useRef, type RefObject } from 'react';
import './gallery-animations.css';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Hero entrance. SSR markup already has `.gl-play`, so the first play comes straight
 * from CSS (no flash). It's re-triggered only when the page is restored from the
 * bfcache (`pageshow` persisted) or its effects re-run after being hidden/shown.
 * Normal client-side navigation (incl. back/forward) remounts the page and plays naturally.
 * Re-renders never touch the class.
 */
export function useHeroReplay(ref: RefObject<HTMLElement | null>) {
  const firstRun = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const replay = () => {
      el.classList.remove('gl-play');
      void el.offsetWidth;
      el.classList.add('gl-play');
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
 * Viewport reveal. Elements with `data-gl-reveal` inside `rootRef` get `.gl-in`
 * the first time they enter the viewport (and never again while scrolling).
 * Items that enter together are staggered 120ms apart in DOM order via `--gl-d`;
 * the very first batch starts a little later so it follows the hero.
 */
export function useScrollReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const all = () => Array.from(root.querySelectorAll<HTMLElement>('[data-gl-reveal]'));

    if (reducedMotion() || typeof IntersectionObserver === 'undefined') {
      all().forEach((el) => el.classList.add('gl-in'));
      return;
    }

    let firstBatch = true;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        if (!visible.length) return;

        const base = firstBatch ? 300 : 0;
        firstBatch = false;
        visible.forEach((el, i) => {
          el.style.setProperty('--gl-d', `${base + Math.min(i, 10) * 120}ms`);
          el.classList.add('gl-in');
          io.unobserve(el);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    );

    const observePending = () => all().filter((el) => !el.classList.contains('gl-in')).forEach((el) => io.observe(el));
    observePending();

    // bfcache restore: play the reveals again as well
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      firstBatch = true;
      all().forEach((el) => el.classList.remove('gl-in'));
      void root.offsetWidth;
      observePending();
    };
    window.addEventListener('pageshow', onPageShow);

    return () => {
      io.disconnect();
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [rootRef]);
}

/**
 * Subtle parallax for `[data-gl-parallax]` image wrappers (desktop only, off for reduced motion).
 * One passive scroll listener + rAF; only elements near the viewport are touched.
 */
export function useParallax(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-gl-parallax]'));
    if (!els.length) return;

    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;

    const reset = () => els.forEach((el) => (el.style.transform = ''));

    const update = () => {
      raf = 0;
      if (!desktop.matches || reduced.matches) {
        reset();
        return;
      }
      const vh = window.innerHeight;
      els.forEach((el) => {
        const host = el.parentElement;
        if (!host) return;
        const r = host.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // about -1 .. 1
        const shift = Math.max(-1, Math.min(1, p)) * r.height * 0.06;
        el.style.transform = `translate3d(0, ${(-shift).toFixed(1)}px, 0)`;
      });
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    desktop.addEventListener('change', request);
    reduced.addEventListener('change', request);
    update();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      desktop.removeEventListener('change', request);
      reduced.removeEventListener('change', request);
      reset();
    };
  }, [rootRef]);
}
