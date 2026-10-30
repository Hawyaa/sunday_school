'use client';

/**
 * useEventsMotion.ts: scroll/entrance motion for the Events page body.
 * (The hero animates itself; see components/events/EventsHero.tsx.)
 *
 * The page opts in with data attributes, and this hook never needs to know
 * about layout or class names:
 *
 *   [data-featured]            the featured card (wrapper)
 *     [data-reveal="media"]      image: slow zoom in
 *     [data-reveal="text"]       pill / title / description: staggered slide up
 *     [data-reveal="fade"]       date / time / place: fade in
 *     [data-reveal="scale"]      button: scale in
 *   [data-reveal="card"]       list cards: staggered fade up on scroll (+ image settle)
 *   [data-reveal="side"]       sidebar panels: fade + slide right
 *   [data-reveal="cat"]        category rows: staggered slide up (+ icon pop)
 *
 * Replays are avoided: anything already revealed carries `data-in` and is skipped,
 * so typing in the search box or changing language never re-runs old animations.
 * Visitors who prefer reduced motion get no animation at all.
 */

import type { RefObject } from 'react';
import { gsap, useGSAP, ScrollTrigger, EASE, DURATION, STAGGER, motionAllowed } from '@/lib/motion/gsap';
import { markSeen, revealOnScroll, unseen } from '@/lib/motion/reveal';

interface Keys {
  /** Changes when the featured card appears or is replaced. '' = not shown. */
  featuredId: string;
  /** Changes when the set of list cards changes (filter / search). */
  cardsKey: string;
  /** Changes when the set of categories changes. */
  catsKey: string;
}

type Scope = RefObject<HTMLElement | null>;

export function useEventsMotion(scope: Scope, keys: Keys): void {
  useFeaturedCard(scope, keys.featuredId);
  useListCards(scope, keys.cardsKey);
  useSidebar(scope, keys.catsKey);
}

/* ---------- Featured card ---------- */
function useFeaturedCard(scope: Scope, featuredId: string) {
  useGSAP(
    () => {
      const root = scope.current;
      const card = root?.querySelector<HTMLElement>('[data-featured]');
      if (!card || card.hasAttribute('data-in') || !motionAllowed()) return;

      const part = (name: string) => unseen(card, `[data-reveal="${name}"]`);
      const media = part('media');
      const text = part('text');
      const fade = part('fade');
      const scale = part('scale');

      gsap
        .timeline({
          defaults: { ease: EASE },
          scrollTrigger: { trigger: card, start: 'top 85%', once: true },
        })
        .fromTo(media, { opacity: 0, scale: 1 }, { opacity: 1, scale: 1.06, duration: 1.6 }, 0)
        .fromTo(
          text,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: DURATION.base, stagger: STAGGER, clearProps: 'transform' },
          0.15,
        )
        .fromTo(fade, { opacity: 0 }, { opacity: 1, duration: DURATION.fast, stagger: 0.1 }, '>-0.3')
        .fromTo(
          scale,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: DURATION.fast, clearProps: 'transform' },
          '>-0.2',
        );

      markSeen([card, ...media, ...text, ...fade, ...scale]);
    },
    { scope, dependencies: [featuredId], revertOnUpdate: false },
  );
}

/* ---------- Event list cards ---------- */
function useListCards(scope: Scope, cardsKey: string) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !motionAllowed()) return;

      revealOnScroll(root, '[data-reveal="card"]', 'up', (cards) => {
        // Each image settles from a slight zoom as its card appears.
        const images = cards
          .map((card) => card.querySelector<HTMLElement>('.ev-media'))
          .filter((el): el is HTMLElement => el !== null);
        gsap.fromTo(
          images,
          { scale: 1.12 },
          { scale: 1, duration: 1.2, ease: EASE, stagger: STAGGER, clearProps: 'transform' },
        );
      });

      // The list height just changed, so scroll positions need recalculating.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope, dependencies: [cardsKey], revertOnUpdate: false },
  );
}

/* ---------- Sidebar ---------- */
function useSidebar(scope: Scope, catsKey: string) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !motionAllowed()) return;

      revealOnScroll(root, '[data-reveal="side"]', 'right');

      revealOnScroll(root, '[data-reveal="cat"]', 'up', (rows) => {
        const icons = rows
          .map((row) => row.querySelector<HTMLElement>('.ev-cats__icon'))
          .filter((el): el is HTMLElement => el !== null);
        gsap.fromTo(
          icons,
          { opacity: 0, scale: 0.4 },
          { opacity: 1, scale: 1, duration: DURATION.fast, ease: EASE, stagger: STAGGER, delay: 0.15, clearProps: 'transform' },
        );
      });
    },
    { scope, dependencies: [catsKey], revertOnUpdate: false },
  );
}
