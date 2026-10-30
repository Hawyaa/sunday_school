'use client';

/**
 * MezmurPlayerBanner.tsx
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export function MezmurPlayerBanner() {
  const { locale } = useAppStore();

  return (
    <div className="bg-[#E3EEF8] rounded-xl p-5 sm:px-7 sm:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-[#2F5D9E]/20">
      <div>
        <h4 className="text-base font-extrabold text-[#1E2A5E]">
          {locale === 'am' ? '🎵 መንፈሳዊ ዝማሬዎችን ያዳምጡ' : '🎵 Listen to Audio Hymns'}
        </h4>
        <p className="text-[13px] text-[#44506B] mt-0.5">
          {locale === 'am'
            ? 'በሰንበት ትምህርት ቤታችን መዘምራን የተዘጋጁ ልዩ መንፈሳዊ መዝሙራት'
            : 'Spiritual hymns recorded by our choir'}
        </p>
      </div>

      <button
        type="button"
        className="bg-[#1E2A5E] hover:bg-[#2F5D9E] text-white border-[1.5px] border-[#C99A3B] px-6 py-2.5 rounded-full text-[13px] font-bold cursor-pointer inline-flex items-center gap-2 transition shadow-sm shrink-0"
      >
        {locale === 'am' ? 'ያዳምጡ →' : 'Listen →'}
      </button>
    </div>
  );
}
