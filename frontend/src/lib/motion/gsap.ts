/**
 * lib/motion/gsap.ts
 *
 * The ONLY place GSAP is imported and its plugins registered.
 * Every other file imports from here, so timing and easing stay consistent
 * and swapping the animation library later means editing one file.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

/** Shared timing: change it here and every animation follows. */
export const EASE = 'power2.out';
export const DURATION = { fast: 0.6, base: 0.8, slow: 1 } as const;
export const STAGGER = 0.12;

const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** False on the server and for visitors who asked the OS for reduced motion. */
export function motionAllowed(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches;
}
