'use client';

/**
 * app/about/page.tsx — About Us Page
 *
 * Order matches the design:
 * Hero > Legacy of Abune Diskoros > Journey > Mission/Vision/Values
 * > Sunday School > Programs > CTA > Footer.
 * ValuesSection now renders inside MissionVisionSection, so it's not imported here.
 */

import React from 'react';
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
    <div className="min-h-screen flex flex-col bg-[#f5eee1]">
      {/* 1. Header Navigation */}
      <Header />

      {/* 2. Full-width hero (outside the container so it runs edge to edge) */}
      <AboutHero />

      {/* 3. Main Page Container */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-9 pb-[26px] w-full flex-1">
        <LeadersSection />
        <JourneyTimeline />
        <MissionVisionSection />
        <SundaySchoolSection />
        <ServicesContentSection />
      </main>

      {/* 4 + 5. CTA strip and footer sit flush (no gap): any top margin on the footer root is cancelled here */}
      <div className="flex flex-col [&>*]:!mt-0">
        <AboutCta />
        <Footer />
      </div>
    </div>
  );
}