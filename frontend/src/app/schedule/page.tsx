'use client';

/**
 * app/schedule/page.tsx — Service Schedule Page
 *
 * Architecture contract:
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. Thin orchestrator — manages only the active tab state.
 *  2. All sections are pure presentational components from @/components/schedule.
 *  3. Tab filter state is local — no global store needed.
 *  4. Static data (no API) — schedule is content-managed via admin.
 *     Wire to backend /api/schedule when that module is ready.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScheduleHero } from '@/components/schedule/ScheduleHero';
import { ScheduleFilterTabs } from '@/components/schedule/ScheduleFilterTabs';
import { WeeklyScheduleTable } from '@/components/schedule/WeeklyScheduleTable';
import { DailyPrayerTimes } from '@/components/schedule/DailyPrayerTimes';
import { LocationBanner } from '@/components/schedule/LocationBanner';

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState('all');

  // Which sections to show based on active tab
  const showWeekly = ['all', 'weekly', 'special'].includes(activeTab);
  const showDaily = ['all', 'daily'].includes(activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF7F0]">
      {/* 1. Navigation Header */}
      <Header />

      {/* 2. Page Content */}
      <main
        className="max-w-[1280px] mx-auto px-6 py-8 w-full flex flex-col gap-8 flex-1"
        id="main-content"
      >
        {/* Hero Banner */}
        <ScheduleHero />

        {/* Category Filter Tabs */}
        <ScheduleFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Weekly Service Table */}
        {showWeekly && <WeeklyScheduleTable filter={activeTab} />}

        {/* Daily Prayer Times */}
        {showDaily && <DailyPrayerTimes />}

        {/* Location Banner */}
        <LocationBanner />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
