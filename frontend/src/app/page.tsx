'use client';

/**
 * app/page.tsx — Home Page
 *
 * Implements the requested clean, dark candle-lit church aesthetic:
 * 1. Hero: Navigation header sits directly on the hero image with "Faith. Culture. Community."
 * 2. Ministries: Floating card overlapping the hero with 5 round gold-tinted icon items.
 * 3. Announcements & Events: Side-by-side grid with large glowing image panel and highlighted first event.
 * 4. Teachings: "Wisdom for Your Journey" 4-card grid with category tags.
 * 5. Gallery Highlights: Full-width deep navy section with 3 cards over dark fade captions.
 * 6. Mission & Quote: "Preserving Faith, Sharing Heritage" with glowing candle quote card.
 * 7. Footer: Compact deep navy footer.
 */

import React from 'react';

// Layout components
import { UrgentBanner } from '@/components/layout/UrgentBanner';
import { Footer } from '@/components/layout/Footer';

// Home sections
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
    <div className="min-h-screen flex flex-col bg-[#FAF6EF]">
      {/* 1. Optional Urgent Alert Banner */}
      <UrgentBanner />

      {/* 2. Hero Section (Header sits directly on the hero image) */}
      <HeroSection />

      {/* 3. Floating Ministries Strip (Overlaps the bottom of the hero) */}
      <MinistriesStrip />

      {/* 4. Main Body Content */}
      <main id="main-content" className="w-full flex-1 flex flex-col">
        {/* 4a. Announcements & Upcoming Events (Side-by-side) */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 w-full pt-14 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <AnnouncementsCard items={announcements} isLoading={isLoading} />
            <EventWidget event={nextEvent} isLoading={isLoading} />
          </div>
        </section>

        {/* 4b. Featured Teachings ("Wisdom for Your Journey") */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 w-full py-8">
          <TeachingsSection items={teachings} isLoading={isLoading} />
        </section>

        {/* 4c. Gallery Highlights (Full-width deep navy section) */}
        <GalleryHighlights />

        {/* 4d. Our Mission ("Preserving Faith, Sharing Heritage") */}
        <MissionCard />
      </main>

      {/* 5. Compact Navy Footer */}
      <Footer compact={true} />
    </div>
  );
}
