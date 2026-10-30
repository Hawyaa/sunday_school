'use client';

/**
 * app/about/page.tsx — About Us Page
 * Redesigned to exactly match the Tewahedo design mockup:
 * - Hero with At-a-glance stats card & diamond lattice background
 * - Golden tricolor ribbon
 * - The Legacy of Abune Diskoros (arch portrait, facts, expandable bio)
 * - A Path of Faith and Service (horizontal milestone timeline)
 * - Guided by Faith, Driven by Service (3 pillar cards + James 2:17 quote)
 * - Sunday School Journey (deep navy section, 3 metrics + Mark 10:14 quote card)
 * - More Ways to Serve (4 ministry cards)
 * - Be Part of Our Mission (CTA banner)
 */

import React from 'react';
import './about.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { LeadersSection } from '@/components/about/LeadersSection';
import { JourneyTimeline } from '@/components/about/JourneyTimeline';
import { MissionVisionSection } from '@/components/about/MissionVisionSection';
import { SundaySchoolSection } from '@/components/about/SundaySchoolSection';
import { ServicesContentSection } from '@/components/about/ServicesContentSection';
import { AboutCta } from '@/components/about/AboutCta';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* SVG Defs for Orthodox Cross & Lattice Pattern */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <symbol id="x" viewBox="0 0 64 64">
            <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
              <path d="M26 6h12v14h14v12H38v26H26V32H12V20h14z" />
              <circle cx="32" cy="26" r="5" />
              <circle cx="32" cy="6" r="2" fill="currentColor" />
              <circle cx="12" cy="26" r="2" fill="currentColor" />
              <circle cx="52" cy="26" r="2" fill="currentColor" />
              <circle cx="32" cy="58" r="2" fill="currentColor" />
            </g>
          </symbol>
          <pattern id="lat" width="64" height="64" patternUnits="userSpaceOnUse">
            <path
              d="M32 6 58 32 32 58 6 32z M32 18 46 32 32 46 18 32z"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            />
          </pattern>
        </defs>
      </svg>

      <Header />
      <main>
        <AboutHero />
        <LeadersSection />
        <JourneyTimeline />
        <MissionVisionSection />
        <SundaySchoolSection />
        <ServicesContentSection />
        <AboutCta />
      </main>
      <Footer />
    </div>
  );
}
