'use client';

/**
 * useAboutMotion.ts: motion for the About page, one hook per section.
 *
 * Each section component calls its own hook with its own ref, so every section is
 * independent: no changes to the page file, and a section can be removed or moved
 * without touching the others. Timing and easing come from lib/motion/gsap.ts.
 *
 * Markup contract (set in each component):
 *   data-a="name"     hidden until its animation plays (see about.motion.css)
 *   data-parallax     decorative layer that drifts slowly while scrolling
 *   data-line         gold line that draws in from the left
 *   data-count="200"  number that counts up (optional data-suffix="+")
 *   [data-split-word] word spans produced by <SplitWords /> inside headings/quotes
 *
 * Behaviour:
 *   - scroll-triggered effects run once, when the section enters the viewport
 *   - nothing replays on ordinary re-renders (effects depend only on mount)
 *   - the hero replays on every visit, back/forward navigation and bfcache restore
 *   - everything is cleaned up on unmount; reduced-motion visitors get no animation
 */

import './about.motion.css';
import { useEffect, useRef, type RefObject } from 'react';
import { gsap, useGSAP, ScrollTrigger, EASE, DURATION, STAGGER, motionAllowed } from '@/lib/motion/gsap';

type Scope = RefObject<HTMLElement | null>;

/* ---------- tiny helpers ---------- */
const all = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
const named = (root: ParentNode, name: string) => all(root, `[data-a="${name}"]`);
const wordsIn = (root: ParentNode, within: string) => all(root, `${within} [data-split-word]`);
const enter = (trigger: Element, start = 'top 80%') => ({ trigger, start, once: true });

/** timeline.fromTo that quietly skips when there is nothing to animate. */
function step(
  tl: gsap.core.Timeline,
  targets: HTMLElement[],
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  at?: number | string,
) {
  if (targets.length) tl.fromTo(targets, from, to, at);
  return tl;
}

const FADE = { opacity: 0 };
const FADE_UP = { opacity: 0, y: 28 };
const SHOWN = { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'transform' };

/** Slides words up from behind their masks (text produced by <SplitWords />). */
const WORDS_FROM = { yPercent: 110, opacity: 1 };
const WORDS_TO = { yPercent: 0, opacity: 1, duration: DURATION.slow, stagger: STAGGER };

/** Slow drift for decorative layers. */
function parallax(section: HTMLElement, from: number, to: number, start = 'top bottom') {
  all(section, '[data-parallax]').forEach((layer) =>
    gsap.fromTo(
      layer,
      { yPercent: from },
      { yPercent: to, ease: 'none', scrollTrigger: { trigger: section, start, end: 'bottom top', scrub: true } },
    ),
  );
}

function usePageShowReplay(replay: RefObject<(() => void) | null>) {
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        replay.current?.();
        ScrollTrigger.refresh();
      }
    };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, [replay]);
}

/* ===================================================================
   1. Hero: plays on every mount (visit, back/forward) and bfcache restore
   =================================================================== */
export function useHeroMotion(root: Scope, locale?: string) {
  const replay = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !motionAllowed()) return;

      const intro = gsap.timeline({ defaults: { ease: EASE } });
      step(intro, named(el, 'crumbs'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DURATION.fast });
      step(intro, named(el, 'sub'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: DURATION.base }, '+=0.5');
      step(intro, named(el, 'glance'), { opacity: 0, x: 32 }, { opacity: 1, x: 0, duration: DURATION.base }, '-=0.5');
      step(intro, all(el, '[data-line]'), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, '-=0.6');

      all(el, '[data-parallax]').forEach((layer) =>
        gsap.to(layer, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
        }),
      );

      replay.current = () => intro.restart();
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    // Re-run when the language changes.
    { scope: root, dependencies: [locale], revertOnUpdate: true },
  );

  usePageShowReplay(replay);
}

/* ===================================================================
   2. Legacy: portrait first, then the text
   =================================================================== */
export function useLegacyMotion(root: Scope) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el || !motionAllowed()) return;

      const tl = gsap.timeline({ defaults: { ease: EASE }, scrollTrigger: enter(el, 'top 70%') });

      // image first
      step(tl, named(el, 'arch'), { opacity: 0, x: -64 }, { opacity: 1, x: 0, duration: 1 }, 0);
      step(tl, all(el, '.ph img'), { scale: 1 }, { scale: 1.06, duration: 2.4, ease: 'power1.out' }, 0);
      step(tl, named(el, 'badge'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: DURATION.fast }, 0.7);

      // then the text
      step(tl, named(el, 'eyebrow'), FADE, { opacity: 1, duration: DURATION.fast }, 0.6);
      step(tl, wordsIn(el, 'h2'), WORDS_FROM, WORDS_TO, 0.7);
      step(tl, named(el, 'desc'), FADE_UP, { ...SHOWN, duration: DURATION.base, stagger: STAGGER }, '>-0.4');
      step(tl, named(el, 'fact'), FADE, { opacity: 1, duration: DURATION.fast, stagger: 0.15 }, '>-0.3');
      step(tl, named(el, 'btn'), { opacity: 0, y: 16 }, { ...SHOWN, duration: DURATION.fast }, '>-0.2');
    },
    { scope: root },
  );
}

/* ===================================================================
   3. Journey timeline: the line draws as you scroll, markers follow it
   =================================================================== */
export function useJourneyMotion(root: Scope) {
  useGSAP(
    () => {
      const el = root.current;
      const line = el?.querySelector<HTMLElement>('.tl');
      const head = el?.querySelector<HTMLElement>('.jhead');
      if (!el || !line || !head || !motionAllowed()) return;

      // header
      const intro = gsap.timeline({ defaults: { ease: EASE }, scrollTrigger: enter(head, 'top 80%') });
      step(intro, named(head, 'eyebrow'), FADE, { opacity: 1, duration: DURATION.fast }, 0);
      step(intro, wordsIn(head, 'h2'), WORDS_FROM, WORDS_TO, 0.1);
      step(intro, named(head, 'desc'), FADE_UP, { ...SHOWN, duration: DURATION.base }, 0.4);
      step(intro, named(head, 'btn'), { opacity: 0, y: 16 }, { ...SHOWN, duration: DURATION.fast }, 0.6);

      // timeline, synced with scroll: progress 0..1 draws the gold line left to right
      const items = all(line, 'a');
      const last = Math.max(items.length - 1, 1);
      const scrub = gsap.timeline({
        defaults: { ease: EASE },
        scrollTrigger: { trigger: line, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 },
      });
      scrub.fromTo(line, { '--tl-progress': 0 }, { '--tl-progress': 1, duration: last, ease: 'none' }, 0);

      items.forEach((item, i) => {
        // marker i sits where the line has reached i / last of its length
        const at = i;
        step(scrub, named(item, 'dot'), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5 }, at);
        step(scrub, named(item, 'ico'), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4 }, at + 0.15);
        step(
          scrub,
          [...named(item, 'yr'), ...named(item, 'ttl'), ...named(item, 'txt')],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          at + 0.1,
        );
      });
    },
    { scope: root },
  );
}

/* ===================================================================
   4. Mission, Vision, Values (+ the inspirational quote banner)
   =================================================================== */
export function useGuidedMotion(root: Scope) {
  useGSAP(
    () => {
      const el = root.current;
      const head = el?.querySelector<HTMLElement>('.ghead');
      if (!el || !head || !motionAllowed()) return;

      // header
      const intro = gsap.timeline({ defaults: { ease: EASE }, scrollTrigger: enter(head, 'top 80%') });
      step(intro, named(head, 'eyebrow'), FADE, { opacity: 1, duration: DURATION.fast }, 0);
      step(intro, wordsIn(head, 'h2'), WORDS_FROM, WORDS_TO, 0.1);
      step(intro, named(head, 'desc'), FADE_UP, { ...SHOWN, duration: DURATION.base }, 0.4);

      // cards: staggered fade up, then icon, title, description inside each
      const cards = named(el, 'card');
      if (cards.length) {
        ScrollTrigger.batch(cards, {
          start: 'top 85%',
          once: true,
          batchMax: 3,
          onEnter: (batch) =>
            (batch as HTMLElement[]).forEach((card, i) => {
              const t = gsap.timeline({ defaults: { ease: EASE }, delay: i * 0.12 });
              step(t, [card], { opacity: 0, y: 40 }, { ...SHOWN, duration: DURATION.base }, 0);
              step(t, named(card, 'icon'), { opacity: 0, scale: 0.5 }, { ...SHOWN, duration: DURATION.fast }, 0.2);
              step(t, named(card, 'title'), { opacity: 0, y: 18 }, { ...SHOWN, duration: DURATION.fast }, 0.3);
              step(t, named(card, 'desc'), FADE, { opacity: 1, duration: DURATION.base }, 0.45);
            }),
        });
      }

      // quote banner: icon, then word by word, then the reference
      const verse = el.querySelector<HTMLElement>('.verse');
      if (verse) {
        const q = gsap.timeline({ defaults: { ease: EASE }, scrollTrigger: enter(verse, 'top 85%') });
        step(q, named(verse, 'qicon'), { opacity: 0, scale: 0.5 }, { ...SHOWN, duration: DURATION.fast }, 0);
        step(q, wordsIn(verse, 'q'), WORDS_FROM, { yPercent: 0, opacity: 1, duration: DURATION.base, stagger: 0.07 }, 0.15);
        step(q, named(verse, 'cite'), { opacity: 0, y: 10 }, { ...SHOWN, duration: DURATION.fast }, '+=0.2');
      }
    },
    { scope: root },
  );
}

/* ===================================================================
   5. Sunday School: heading, count-up stats, quote card from the right
   =================================================================== */
export function useSchoolMotion(root: Scope) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el || !motionAllowed()) return;

      const counters = all(el, '[data-count]');
      const finalText = counters.map((n) => n.textContent);

      const tl = gsap.timeline({ defaults: { ease: EASE }, scrollTrigger: enter(el, 'top 70%') });
      step(tl, named(el, 'eyebrow'), FADE, { opacity: 1, duration: DURATION.fast }, 0);
      step(tl, named(el, 'title'), { opacity: 0, y: 36 }, { ...SHOWN, duration: DURATION.base }, 0.1);
      step(tl, named(el, 'sub'), FADE, { opacity: 1, duration: DURATION.base }, 0.35);
      step(tl, named(el, 'desc'), FADE_UP, { ...SHOWN, duration: DURATION.base }, 0.45);
      step(tl, named(el, 'stat'), FADE_UP, { ...SHOWN, duration: DURATION.base, stagger: STAGGER }, 0.6);
      step(tl, named(el, 'quote'), { opacity: 0, x: 64 }, { ...SHOWN, duration: 1 }, 0.3);

      // count up: runs once per mount (the tween lives inside the one-shot timeline)
      counters.forEach((node, i) => {
        const to = Number(node.dataset.count);
        const suffix = node.dataset.suffix ?? '';
        if (Number.isNaN(to)) return;
        const state = { value: 0 };
        node.textContent = `0${suffix}`;
        tl.to(
          state,
          {
            value: to,
            duration: 1.6,
            ease: 'power1.out',
            onUpdate: () => {
              node.textContent = `${Math.round(state.value)}${suffix}`;
            },
            onComplete: () => {
              node.textContent = `${to}${suffix}`;
            },
          },
          0.7 + i * 0.12,
        );
      });

      parallax(el, -8, 8);

      // restore the real numbers if the animation is torn down early
      return () => counters.forEach((node, i) => (node.textContent = finalText[i]));
    },
    { scope: root },
  );
}

/* ===================================================================
   6. More ways to serve
   =================================================================== */
export function useServeMotion(root: Scope) {
  useGSAP(
    () => {
      const el = root.current;
      const head = el?.querySelector<HTMLElement>('.shead');
      if (!el || !head || !motionAllowed()) return;

      const intro = gsap.timeline({ defaults: { ease: EASE }, scrollTrigger: enter(head, 'top 80%') });
      step(intro, named(head, 'eyebrow'), FADE, { opacity: 1, duration: DURATION.fast }, 0);
      step(intro, wordsIn(head, 'h2'), WORDS_FROM, WORDS_TO, 0.1);
      step(intro, named(head, 'desc'), FADE_UP, { ...SHOWN, duration: DURATION.base }, 0.4);

      const cards = named(el, 'card');
      if (cards.length) {
        ScrollTrigger.batch(cards, {
          start: 'top 88%',
          once: true,
          batchMax: 4,
          onEnter: (batch) =>
            (batch as HTMLElement[]).forEach((card, i) => {
              const t = gsap.timeline({ defaults: { ease: EASE }, delay: i * 0.12 });
              step(t, [card], { opacity: 0, y: 56 }, { ...SHOWN, duration: DURATION.base }, 0);
              step(
                t,
                named(card, 'icon'),
                { opacity: 0, scale: 0.6, rotate: -14 },
                { opacity: 1, scale: 1, rotate: 0, duration: DURATION.base, clearProps: 'transform' },
                0.2,
              );
              step(t, named(card, 'title'), { opacity: 0, y: 18 }, { ...SHOWN, duration: DURATION.fast }, 0.3);
              step(t, named(card, 'desc'), { opacity: 0, y: 14 }, { ...SHOWN, duration: DURATION.fast, stagger: 0.1 }, 0.4);
            }),
        });
      }
    },
    { scope: root },
  );
}

/* ===================================================================
   7. Final call to action
   =================================================================== */
export function useCtaMotion(root: Scope) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el || !motionAllowed()) return;

      const tl = gsap.timeline({ defaults: { ease: EASE }, scrollTrigger: enter(el, 'top 80%') });
      step(tl, wordsIn(el, 'h2'), WORDS_FROM, WORDS_TO, 0);
      step(tl, named(el, 'desc'), FADE, { opacity: 1, duration: DURATION.base }, 0.4);
      step(tl, named(el, 'btn'), { opacity: 0, scale: 0.85 }, { ...SHOWN, duration: DURATION.fast }, 0.6);

      parallax(el, -5, 5);
    },
    { scope: root },
  );
}