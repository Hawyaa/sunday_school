'use client';

/**
 * ScheduleHero.tsx
 *
 * Hero banner for the Schedule page with church background.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export function ScheduleHero() {
  const { locale } = useAppStore();

  return (
    <section
      className="relative rounded-2xl p-8 sm:p-12 flex justify-between items-center overflow-hidden border border-[#E3EEF8] min-h-[280px] bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(251,247,240,0.95) 0%, rgba(227,238,248,0.7) 45%, rgba(255,255,255,0) 100%), url('https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1200&q=80')`,
      }}
      aria-label="Schedule hero"
    >
      <div className="max-w-[600px] relative z-10">
        <span className="text-[11px] uppercase tracking-[1.5px] text-[#8A6414] font-bold border-l-[3px] border-[#C99A3B] pl-2 block mb-2">
          {locale === 'am' ? 'መርሐ ግብር' : 'SCHEDULE'}
        </span>
        <h1 className="text-3xl sm:text-[38px] font-extrabold text-[#1E2A5E] leading-[1.1] mb-1">
          የምርሃ ግዜ መርኃ ግብር
        </h1>
        <h2 className="text-2xl sm:text-[30px] italic text-[#C99A3B] font-normal mb-4">
          Service Schedule
        </h2>
        <p className="text-sm sm:text-[15px] text-[#44506B] leading-relaxed">
          {locale === 'am'
            ? 'በአቡነ ሚዲያ ሰንበት ትምህርት ቤት የቤተክርስቲያን አገልግሎቶችን፣ ጸሎቶችንና መንፈሳዊ ስብሰባዎችን ሳምንታዊ መርሐ ግብር ይመልከቱ።'
            : 'Find the weekly schedule of church services, prayers, and spiritual gatherings at Abune Media.'}
        </p>
      </div>
    </section>
  );
}
