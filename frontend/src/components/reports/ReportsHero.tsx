'use client';

/**
 * ReportsHero.tsx  (components/reports/ReportsHero.tsx)
 *
 * Reports hero with a layered entrance animation (see ReportsHero.css).
 * Layers (each its own SVG, so they animate independently):
 *   edge (small navy diamond + chevrons) · cream (large polygon) · divider (navy triangle + diagonal band + gold line)
 *   corner (bottom navy extension) · pattern (gold filigree) · crosses
 *
 * Replay: the animation plays when the page mounts and again on browser back/forward restores
 * (pageshow). It is driven by a data attribute set through a ref, so normal React re-renders do not replay it.
 */

import './ReportsHero.css';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

const PHOTO = 'https://i.pinimg.com/1200x/aa/b6/55/aab655bda9ce179c5c34b95c20816317.jpg';
const CROSS = '/images/cross.png';
const NAVY = '#0e1b38'; // sampled from the screenshot

export function ReportsHero() {
  const { locale } = useAppStore();
  const am = locale === 'am';
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let raf = 0;

    const play = () => {
      cancelAnimationFrame(raf);
      el.removeAttribute('data-play');
      void el.offsetWidth; // restart animations
      raf = requestAnimationFrame(() => el.setAttribute('data-play', '1'));
    };

    play();
    const onShow = (e: PageTransitionEvent) => e.persisted && play(); // back/forward cache restore
    window.addEventListener('pageshow', onShow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pageshow', onShow);
      el.removeAttribute('data-play'); // so the next mount / re-activation replays
    };
  }, []);

  const title = am ? 'ሪፖርቶች' : 'Reports';

  return (
    <div className="rh-wrap">
      <section ref={heroRef} className="rh-hero" aria-label="Reports Hero">
        {/* 1 · background (photo over built-in illustration) — slow zoom */}
        <div className="rh-media" aria-hidden="true">
          <div className="rh-zoom">
            <svg viewBox="0 0 760 548" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="rh-room" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c3cde0" /><stop offset="1" stopColor="#8794ae" /></linearGradient>
                <linearGradient id="rh-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2c9a0" /><stop offset="1" stopColor="#b08d57" /></linearGradient>
                <linearGradient id="rh-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e9edf6" /></linearGradient>
                <filter id="rh-blur"><feGaussianBlur stdDeviation="8" /></filter>
              </defs>
              <rect width="760" height="548" fill="url(#rh-room)" />
              <g filter="url(#rh-blur)" opacity=".95">
                <rect x="90" y="30" width="90" height="190" fill="#e7eef8" />
                <rect x="210" y="20" width="90" height="210" fill="#f1f5fb" />
                <rect x="330" y="40" width="100" height="180" fill="#dfe8f5" />
                <rect x="470" y="10" width="110" height="220" fill="#f6f9fd" />
                <rect x="620" y="30" width="110" height="200" fill="#ffe3b8" />
                <rect x="150" y="225" width="150" height="50" fill="#56668a" />
                <rect x="430" y="235" width="170" height="45" fill="#4a5a7f" />
              </g>
              <polygon points="0,320 760,262 760,548 0,548" fill="url(#rh-desk)" />
              <g transform="rotate(-8 190 430)">
                <rect x="60" y="360" width="270" height="150" rx="8" fill="#1d2a47" />
                <rect x="76" y="371" width="238" height="130" fill="#f7f7f4" />
                <circle cx="132" cy="436" r="32" fill="#e8c26b" />
                <path d="M132 436 L132 404 A32 32 0 0 1 162 446 Z" fill="#1f3a6e" />
                <path d="M132 436 L162 446 A32 32 0 0 1 110 462 Z" fill="#6aa58b" />
                <rect x="190" y="410" width="110" height="6" fill="#c8ccd6" />
                <rect x="190" y="427" width="90" height="6" fill="#c8ccd6" />
                <rect x="190" y="444" width="100" height="6" fill="#c8ccd6" />
                <rect x="190" y="461" width="70" height="6" fill="#c8ccd6" />
              </g>
              <polygon points="310,410 650,385 715,448 340,478" fill="#aeb5c4" />
              <polygon points="340,478 715,448 715,458 345,489" fill="#7d8598" />
              <polygon points="330,175 650,152 672,380 345,402" fill="#2a3144" />
              <polygon points="344,188 638,167 658,368 357,388" fill="url(#rh-screen)" />
              <rect x="360" y="196" width="270" height="14" fill="#122559" opacity=".9" transform="rotate(-4 360 196)" />
              <g transform="translate(420 285) rotate(-4)">
                <circle r="42" fill="#c7a03e" />
                <path d="M0 0 L0 -42 A42 42 0 0 1 36 21 Z" fill="#1f3a6e" />
                <path d="M0 0 L36 21 A42 42 0 0 1 -30 30 Z" fill="#7d93c4" />
                <circle r="20" fill="#fff" />
              </g>
              <g transform="rotate(-4 550 290)">
                <rect x="500" y="290" width="20" height="40" fill="#7d93c4" />
                <rect x="530" y="265" width="20" height="65" fill="#1f3a6e" />
                <rect x="560" y="240" width="20" height="90" fill="#c7a03e" />
                <rect x="590" y="215" width="20" height="115" fill="#1f3a6e" />
                <rect x="495" y="330" width="125" height="3" fill="#aab2c5" />
              </g>
            </svg>
            <div className="rh-photo" style={{ backgroundImage: `url('${PHOTO}')` }} />
          </div>
        </div>

        {/* 4 · long diagonal navy-and-gold divider (reveals top → bottom). Sits under the cream polygon. */}
        <svg className="rh-layer rh-layer--divider" viewBox="0 0 1024 548" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="380,548 475,388 640,548" fill={NAVY} />
          <polygon points="0,0 484,0 620,203 430,548 0,548" fill="#fffaf0" opacity=".5" />
          <polyline className="rh-gold-line" points="443,0 588,203 383,548" fill="none" stroke="#c69c3f" strokeWidth="1.4" />
        </svg>

        {/* 3 · large cream polygon (clip-path wipe, left → right) */}
        <svg className="rh-layer rh-layer--cream" viewBox="0 0 1024 548" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="0,0 440,0 585,203 380,548 0,548" fill="#faf4e4" />
        </svg>

        {/* 2 · small navy edge with gold chevrons (slides in from the left) */}
        <svg className="rh-layer rh-layer--edge" viewBox="0 0 1024 548" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="0,185 46,233 0,278" fill={NAVY} />
          <polyline className="rh-gold-line" points="0,168 64,233 0,296" fill="none" stroke="#c69c3f" strokeWidth="1.4" />
          <polyline className="rh-gold-line" points="0,148 90,233 0,318" fill="none" stroke="#c69c3f" strokeWidth="1" opacity=".75" />
        </svg>

        {/* 5 · bottom navy extension (slides in from the left) */}
        <svg className="rh-layer rh-layer--corner" viewBox="0 0 1024 548" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="0,398 0,548 150,548" fill={NAVY} />
          <polyline className="rh-gold-line" points="0,380 168,548" fill="none" stroke="#c69c3f" strokeWidth="1.2" />
        </svg>

        {/* 6 · gold filigree pattern (fade + subtle scale) */}
        <svg className="rh-layer rh-layer--pattern" viewBox="0 0 1024 548" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" stroke="#c69c3f" strokeWidth="1.5">
            <path className="rh-gold-line" d="M10 548 C10 500 40 480 40 520 C40 540 18 540 18 520" />
            <path className="rh-gold-line" d="M34 548 C40 520 70 510 66 536 C64 548 50 546 52 534" />
            <path className="rh-gold-line" d="M2 462 C20 452 34 462 30 478 C26 490 12 486 14 476" />
            <path className="rh-gold-line" d="M72 548 C82 536 100 536 106 548" />
            <path className="rh-gold-line" d="M2 505 C16 498 28 506 24 518" />
            <path className="rh-gold-line" d="M44 470 C58 462 72 474 64 488 C58 498 46 492 50 484" />
            <path className="rh-gold-line" d="M84 520 C96 514 110 524 104 536 C100 544 90 540 92 534" />
            <path className="rh-gold-line" d="M28 440 C40 436 48 446 42 454" />
            <path className="rh-gold-line" d="M120 548 C126 540 136 540 140 548" />
          </g>
        </svg>

        {/* 6 · gold crosses (public/images/cross.png) */}
        {/* eslint-disable @next/next/no-img-element */}
        <img src={CROSS} alt="" aria-hidden="true" draggable={false} className="rh-cross rh-cross--wm1" />
        <img src={CROSS} alt="" aria-hidden="true" draggable={false} className="rh-cross rh-cross--wm2" />
        <img src={CROSS} alt="" aria-hidden="true" draggable={false} className="rh-cross rh-cross--tl" />
        <img src={CROSS} alt="" aria-hidden="true" draggable={false} className="rh-cross rh-cross--r" />
        <img src={CROSS} alt="" aria-hidden="true" draggable={false} className="rh-cross rh-cross--b" />
        {/* eslint-enable @next/next/no-img-element */}

        <nav className="rh-crumbs" aria-label="Breadcrumb">
          <Link href="/">{am ? 'ዋና ገጽ' : 'Home'}</Link>
          <svg viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M2 1l3 3-3 3" /></svg>
          <b>{am ? 'ሪፖርቶች' : 'Reports'}</b>
        </nav>

        <blockquote className="rh-quote">
          {am ? '“ሀብታችሁ ባለበት ልባችሁም በዚያ ይሆናልና።”' : '“For where your treasure is, there your heart will be also.”'}
          <cite>— {am ? 'ማቴዎስ 6:21' : 'Matthew 6:21'}</cite>
        </blockquote>

        <div className="rh-content">
          {/* 7 · label */}
          <div className="rh-eyebrow">
            {am ? (<>የሪፖርት <span>ማዕከል</span></>) : (<>Reports <span>Hub</span></>)}
          </div>
          {/* 8 · heading: split-text reveal + slide up */}
          <h1 className="rh-title" aria-label={title}>
            <span className="rh-line" aria-hidden="true">
              {Array.from(title).map((c, i) => (
                <span key={i} className="rh-char" style={{ '--i': i } as React.CSSProperties}>{c}</span>
              ))}
            </span>
          </h1>
          {/* 9 · description */}
          <p className="rh-desc">
            {am
              ? 'ይፋዊ የቤተክርስቲያን እና የአስተዳደር ሪፖርቶችን፣ የትምህርት፣ የአገልግሎት እና የማህበረሰብ ሪፖርቶችን እዚህ ያግኙና ይመልከቱ።'
              : 'Access and review various official church and administrative reports, including educational, service, and community reports.'}
          </p>
          {/* 10 · button */}
          <a href="#reports" className="rh-btn">
            {am ? 'ሁሉንም ሪፖርቶች ይመልከቱ' : 'View All Reports'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </div>
      </section>
    </div>
  );
}