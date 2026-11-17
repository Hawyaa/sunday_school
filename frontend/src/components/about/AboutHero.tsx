'use client';

/**
 * AboutHero.tsx — Split two-column photo hero:
 * LEFT: Church building photograph (~50% width)
 * RIGHT: Breadcrumb, heading "About Us", tagline, and glance stats (~50% width)
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
    <div ref={root} className="about-hero-wrapper">
      <style>{`
/* Title entrance: pure CSS, ends visible no matter what (fill-mode both). */
@keyframes hero-title-in {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-title-in { animation: hero-title-in 0.85s 0.25s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
@media (prefers-reduced-motion: reduce) { .hero-title-in { animation: none; } }
`}</style>
      <section className="about-hero">
        <div className="c about-hero-split-container">
          {/* LEFT SIDE: About Us content */}
          <div className="about-hero-details">
            <nav aria-label="Breadcrumb" className="crumbs-left" data-a="crumbs">
              <Link href="/">
                {am ? 'መነሻ' : 'Home'}
              </Link>
              <span className="crumb-sep">›</span>
              <b>{am ? 'ስለ እኛ' : 'About Us'}</b>
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

            <p className="hero-tagline" data-a="sub">
              {am
                ? 'እምነታችን። ተልዕኳችን። ማኅበረሰባችን።'
                : 'Our Faith. Our Mission. Our Community.'}
            </p>

            <div className="glance-bar-clean" data-a="glance">
              <div className="glance-item">
                <span className="glance-lbl">{am ? 'የተቋቋመው' : 'Serving since'}</span>
                <b className="glance-val">1998</b>
              </div>
              <div className="glance-divider" aria-hidden="true" />
              <div className="glance-item">
                <span className="glance-lbl">{am ? 'የሰንበት ት/ቤት ተማሪዎች' : 'Sunday School students'}</span>
                <b className="glance-val">200+</b>
              </div>
              <div className="glance-divider" aria-hidden="true" />
              <div className="glance-item">
                <span className="glance-lbl">{am ? 'ንቁ አገልግሎቶች' : 'Active ministries'}</span>
                <b className="glance-val">4</b>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Church building photograph */}
          <div className="about-hero-media">
            <div className="about-hero-img-frame">
              <img
                src="/images/about-church.jpg"
                alt={am ? 'የደብረ ዲዮስቆሮስ ቤተክርስቲያን' : 'Debre Dioskoros Church'}
                className="about-hero-photo"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="about-ribbon" aria-hidden="true" data-line />
    </div>
  );
}
