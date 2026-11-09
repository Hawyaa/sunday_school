'use client';

/**
 * AboutHero.tsx — Editorial hero on deep forest navy with glance stats card.
 * Exact layout from Tewahedo HTML design.
 */

import React, { useRef } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useHeroMotion } from './useAboutMotion';

export function AboutHero() {
  const { locale } = useAppStore();
  const am = locale === 'am';
  const root = useRef<HTMLDivElement>(null);
  useHeroMotion(root, locale);

  return (
    <div ref={root}>
      <style>{`
/* Title entrance: pure CSS, ends visible no matter what (fill-mode both). */
@keyframes hero-title-in {
  from { opacity: 0; transform: translateY(26px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-title-in { animation: hero-title-in 0.9s 0.35s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
@media (prefers-reduced-motion: reduce) { .hero-title-in { animation: none; } }
`}</style>
      <section className="about-hero">
        <div className="c">
          <svg className="pat" data-parallax viewBox="0 0 640 520" aria-hidden="true">
            <rect width="640" height="520" fill="url(#lat)" />
          </svg>
          <div className="hero-text">
            <nav aria-label="Breadcrumb" className="crumbs" data-a="crumbs">
              <Link href="/" className="hover:underline">
                {am ? 'መነሻ' : 'Home'}
              </Link>
              <span>/</span>
              <b>{am ? 'ስለ እኛ' : 'About'}</b>
            </nav>
            <h1 className="hero-title-in">
              {am ? (
                <>
                  ስለ <em>እኛ</em>
                </>
              ) : (
                <>
                  About <em>Us</em>
                </>
              )}
            </h1>
            <p data-a="sub">
              {am
                ? 'እምነታችን። ተልዕኳችን። ማኅበረሰባችን።'
                : 'Our Faith. Our Mission. Our Community.'}
            </p>
          </div>
          <div className="glance" data-a="glance">
            <h4>{am ? 'በጨረፍታ' : 'At a glance'}</h4>
            <div className="row">
              <span>{am ? 'የተቋቋመው' : 'Serving since'}</span>
              <b>1998</b>
            </div>
            <div className="row">
              <span>{am ? 'የሰንበት ት/ቤት ተማሪዎች' : 'Sunday School students'}</span>
              <b>200+</b>
            </div>
            <div className="row">
              <span>{am ? 'ንቁ አገልግሎቶች' : 'Active ministries'}</span>
              <b>4</b>
            </div>
          </div>
        </div>
      </section>
      <div className="about-ribbon" aria-hidden="true" data-line />
    </div>
  );
}