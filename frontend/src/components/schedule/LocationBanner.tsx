'use client';

/**
 * LocationBanner.tsx
 *
 * Compact banner with church address and link to Google Maps.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export function LocationBanner() {
  const { locale } = useAppStore();

  return (
    <div className="bg-gradient-to-r from-[#FDFBF7] to-[#F4F8FC] rounded-xl p-6 border border-[#E3EEF8] flex flex-wrap justify-between items-center gap-5">
      {/* Left: Location info */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-[#1E2A5E] text-[#C99A3B] rounded-xl flex items-center justify-center text-xl shrink-0">
          📍
        </div>
        <div>
          <h4 className="text-base font-extrabold text-[#1E2A5E]">
            {locale === 'am' ? 'ቦታችን' : 'Our Location'}
          </h4>
          <p className="text-[13px] text-[#44506B]">
            {locale === 'am' ? 'ቦሌ፣ አዲስ አበባ፣ ኢትዮጵያ' : 'Bole, Addis Ababa, Ethiopia'}
          </p>
        </div>
      </div>

      {/* Right: Map button */}
      <a
        href="https://maps.google.com/?q=Addis+Ababa+Ethiopia"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1E2A5E] hover:bg-[#2F5D9E] text-white border border-[#C99A3B] px-5 py-2.5 rounded-lg text-[13px] font-bold inline-flex items-center gap-2 transition shrink-0"
      >
        {locale === 'am' ? 'በ Google Maps ይመልከቱ →' : 'View on Google Maps →'}
      </a>
    </div>
  );
}
