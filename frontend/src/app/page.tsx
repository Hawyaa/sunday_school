'use client';

/**
 * app/page.tsx — Home Page
 *
 * Architecture contract (unchanged):
 *  1. This is the ONLY file that fetches data (via useHomeData).
 *  2. Components are pure presentational — they receive data as props.
 *  3. Layout components (UrgentBanner, Header, Footer) are shared across pages.
 *  4. Adding a new section = add a component + wire data here.
 *
 * Section order (matches the design):
 *   Header > Hero > Ministries strip
 *   > [Announcements | Upcoming Event]
 *   > [Featured Teachings | Gallery Highlights]
 *   > Our Mission > Footer
 */

import React from 'react';

// Layout (shared across pages)
import { UrgentBanner } from '@/components/layout/UrgentBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Home-page sections
import { HeroSection } from '@/components/home/HeroSection';
import { MinistriesStrip } from '@/components/home/MinistriesStrip';
import { AnnouncementsCard } from '@/components/home/AnnouncementsCard';
import { EventWidget } from '@/components/home/EventWidget';
import { TeachingsSection } from '@/components/home/TeachingsSection';
import { GalleryHighlights } from '@/components/home/GalleryHighlights';
import { MissionCard } from '@/components/home/MissionCard';

// Data layer
import { useHomeData } from '@/hooks/useHomeData';

export default function HomePage() {
  const { announcements, nextEvent, teachings, isLoading } = useHomeData();

  return (
    <div className="min-h-screen flex flex-col bg-[#f5eee1]">
      {/* 1. Urgent Alert Banner */}
      <UrgentBanner />

      {/* 2. Sticky Navigation Header */}
      <Header />

      {/* 3. Hero */}
      <HeroSection />

      {/* 4. Main content */}
      <main
        id="main-content"
        className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col gap-5 pt-6 pb-8"
      >
        {/* 4a. Ministries strip */}
        <MinistriesStrip />

        {/* 4b. Row 1: Announcements (wide) + Upcoming Events (narrow) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1fr] gap-4 items-stretch">
          <div className="min-w-0">
            <AnnouncementsCard items={announcements} isLoading={isLoading} />
          </div>
          <div className="min-w-0">
            <EventWidget event={nextEvent} isLoading={isLoading} />
          </div>
        </div>

        {/* 4c. Row 2: Featured Teachings (wide) + Gallery Highlights (narrow) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1fr] gap-4 items-stretch">
          <div className="min-w-0">
            <TeachingsSection items={teachings} isLoading={isLoading} />
          </div>
          <div className="min-w-0">
            <GalleryHighlights />
          </div>
        </div>

        {/* 4d. Our Mission */}
        <MissionCard />
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}