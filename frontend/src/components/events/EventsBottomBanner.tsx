'use client';

/**
 * EventsBottomBanner.tsx
 *
 * Call-to-action banner linking to the full schedule or full events archive.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export function EventsBottomBanner() {
  const { locale } = useAppStore();

  return (
    <div className="bg-[#E3EEF8] rounded-xl p-5 sm:px-7 sm:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-[#2F5D9E]/20">
      <div>
        <h4 className="text-base font-extrabold text-[#1E2A5E]">
          {locale === 'am' ? '📅 የተሟላ የበዓላትና ሁነቶች መርሐ ግብር' : '📅 Complete Event Schedule List'}
        </h4>
        <p className="text-[13px] text-[#44506B] mt-0.5">
          {locale === 'am'
            ? 'የቤተክርስቲያን መጪ ሁነቶችን በዝርዝር በሰዓትና በቦታ ይመልከቱ'
            : 'View all church upcoming events in detail'}
        </p>
      </div>

      <Link
        href="/schedule"
        className="bg-[#1E2A5E] hover:bg-[#2F5D9E] text-white border-[1.5px] border-[#C99A3B] px-5 py-2.5 rounded-lg text-[13px] font-bold transition shadow-sm shrink-0"
      >
        {locale === 'am' ? 'መርሐ ግብር ይመልከቱ →' : 'View All →'}
      </Link>
    </div>
  );
}
