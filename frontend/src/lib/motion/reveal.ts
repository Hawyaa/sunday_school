/**
 * lib/motion/reveal.ts
 *
 * Small, page-agnostic helpers for "reveal when scrolled into view".
 * An element that has been revealed gets a `data-in` attribute, so it is
 * never animated twice, even if React re-renders around it.
 */

import { gsap, ScrollTrigger, EASE, DURATION, STAGGER } from './gsap';

export type RevealKind = 'up' | 'right' | 'fade' | 'scale';

const FROM: Record<RevealKind, gsap.TweenVars> = {
  up: { opacity: 0, y: 36 },
  right: { opacity: 0, x: -32 },
  fade: { opacity: 0 },
  scale: { opacity: 0, scale: 0.85 },
};

const SEEN = 'data-in';

/** Matching elements inside `root` that have not been revealed yet. */
export function unseen(root: ParentNode, selector: string): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute(SEEN),
  );
}

/** Marks elements as revealed (lifts the CSS "hidden until revealed" rule). */
export function markSeen(els: Iterable<Element>): void {
  for (const el of els) el.setAttribute(SEEN, '');
}

/** Plays a reveal on the given elements right now. */
export function reveal(
  targets: HTMLElement[],
  kind: RevealKind,
  vars: gsap.TweenVars = {},
): void {
  if (!targets.length) return;
  gsap.fromTo(targets, FROM[kind], {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration: DURATION.base,
    ease: EASE,
    stagger: STAGGER,
    clearProps: 'transform', // so CSS :hover transforms keep working afterwards
    ...vars,
  });
  markSeen(targets);
}

/**
 * Reveals matching elements as they enter the viewport.
 * `onReveal` runs with each batch, for extras like an image zoom.
 */
export function revealOnScroll(
  root: ParentNode,
  selector: string,
  kind: RevealKind,
  onReveal?: (batch: HTMLElement[]) => void,
): void {
  const targets = unseen(root, selector);
  if (!targets.length) return;

  ScrollTrigger.batch(targets, {
    start: 'top 88%',
    once: true,
    batchMax: 4,
    interval: 0.1,
    onEnter: (batch) => {
      const els = batch as HTMLElement[];
      reveal(els, kind);
      onReveal?.(els);
    },
  });
}
