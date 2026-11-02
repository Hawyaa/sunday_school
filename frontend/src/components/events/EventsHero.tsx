'use client';

/**
 * EventsHero.tsx: self-contained Church Events hero.
 *
 * Owns everything about itself: the looping YouTube background, the poster
 * fallback, and its entrance animation. Drop <EventsHero /> anywhere.
 *
 * Change here only:
 *   VIDEO_ID  the YouTube video (a Short works)
 *   POSTER    still image shown while loading / for reduced motion
 *
 * Motion:
 *   breadcrumb fades in -> heading words slide up from a mask -> subtitle fades in
 *   background slowly zooms out and drifts with a light parallax on scroll
 *   plays on every mount (page visit, back/forward) and on bfcache restore
 */

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { gsap, useGSAP, ScrollTrigger, EASE, DURATION, STAGGER, motionAllowed } from '@/lib/motion/gsap';
import { SplitWords } from '@/components/motion/SplitWords';
import { YouTubeBackground } from '@/components/motion/YouTubeBackground';

const VIDEO_ID = 'uPty-Paq2E4';
const POSTER = '/images/events/hero.jpg';

const TINT =
  'linear-gradient(90deg, rgba(9,18,38,.92) 0%, rgba(9,18,38,.6) 45%, rgba(9,18,38,.15) 100%),' +
  'linear-gradient(0deg, rgba(9,18,38,.55), transparent 40%)';

const SERIF = { fontFamily: 'var(--serif, "Fraunces", Georgia, serif)' } as const;

export function EventsHero() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const root = useRef<HTMLElement>(null);
  const replay = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !motionAllowed()) return;

      const part = (name: string) => el.querySelector<HTMLElement>(`[data-hero="${name}"]`);
      const crumbs = part('crumbs');
      const subtitle = part('subtitle');
      const zoom = part('zoom');
      const parallax = part('parallax');
      const words = el.querySelectorAll<HTMLElement>('[data-split-word]');
      if (!crumbs || !subtitle || !zoom || !parallax) return;

      const intro = gsap
        .timeline({ defaults: { ease: EASE } })
        .fromTo(crumbs, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DURATION.fast })
        .fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: DURATION.slow, stagger: STAGGER }, '-=0.3')
        .fromTo(subtitle, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: DURATION.base }, '+=0.1');

      const zoomOut = gsap.fromTo(zoom, { scale: 1.15 }, { scale: 1, duration: 14, ease: 'power1.out' });

      gsap.to(parallax, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });

      replay.current = () => {
        intro.restart();
        zoomOut.restart();
      };
    },
    { scope: root },
  );

  // Restored from the browser's back/forward cache: the page is not re-mounted, so replay by hand.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        replay.current?.();
        ScrollTrigger.refresh();
      }
    };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="events-title"
      className="relative flex min-h-[430px] items-center overflow-hidden bg-[#0e1b38] text-[#f6efdd]"
    >
      {/* Background: parallax > zoom > poster + video */}
      <div aria-hidden="true" className="absolute inset-0">
        <div data-hero="parallax" className="absolute inset-x-0 -bottom-[10%] -top-[10%] will-change-transform">
          <div data-hero="zoom" className="absolute inset-0 will-change-transform">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${POSTER}')` }} />
            <YouTubeBackground videoId={VIDEO_ID} />
          </div>
        </div>
      </div>

      {/* Navy tint, darker on the left so the title stays readable */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: TINT }} />

      {/* Content */}
      <div
        className="relative z-10 mx-auto pb-24 pt-[72px] lg:pl-20"
        style={{ width: 'min(1680px, 100% - clamp(32px, 5vw, 96px))' }}
      >
        <nav
          data-hero="crumbs"
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2.5 text-[13px] tracking-[0.08em] text-[#b4bfd9] motion-safe:opacity-0"
        >
          <Link href="/" className="transition hover:text-[#e3c476]">
            {am ? 'መነሻ' : 'Home'}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-[#e3c476]">
            {am ? 'ሁነቶች' : 'Events'}
          </span>
        </nav>

        <h1
          id="events-title"
          className="text-[clamp(46px,7vw,92px)] font-semibold leading-[0.95] tracking-[-0.03em] [text-shadow:0_3px_14px_rgba(0,0,0,.5)]"
          style={SERIF}
        >
          {am ? (
            <>
              <SplitWords text="የቤተክርስቲያን" />{' '}
              <em className="text-[#e3c476]">
                <SplitWords text="ሁነቶች" />
              </em>
            </>
          ) : (
            <>
              <SplitWords text="Church" />{' '}
              <em className="text-[#e3c476]">
                <SplitWords text="Events" />
              </em>
            </>
          )}
        </h1>

        <p
          data-hero="subtitle"
          className="mt-4 text-[clamp(19px,2.2vw,24px)] italic text-[#cdd6ea] motion-safe:opacity-0"
          style={SERIF}
        >
          {am ? 'ይሰብሰቡ። ያምልኩ። በአንድነት ያገልግሉ።' : 'Gather. Worship. Serve together.'}
        </p>
      </div>
    </section>
  );
}
