'use client';

/**
 * ContactMapSection.tsx
 *
 * Location and directions section with link to Google Maps.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export function ContactMapSection() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  return (
    <div className="bg-white rounded-2xl border border-[#E3EEF8] p-6 sm:p-8 overflow-hidden shadow-[0_4px_16px_rgba(30,42,94,0.03)] flex flex-col justify-between">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EEF8] text-[#1E2A5E] text-xs font-bold mb-4">
          <span>🗺️</span>
          <span>{isAm ? 'አድራሻና አቅጣጫ' : 'Directions & Parish Map'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E2A5E] mb-2">
          {isAm ? 'በአካል ይጎብኙን' : 'Visit Our Fellowship Center'}
        </h2>
        <p className="text-sm text-[#44506B] leading-relaxed mb-6">
          {isAm
            ? 'አቡነ ሚዲያ የሰንበት ትምህርት ቤት እና አገልግሎት ማዕከል በቅዱስ ዑራኤል ቤተክርስቲያን ቅጥር ግቢ ውስጥ ይገኛል።'
            : 'Abune Media Sunday School & Production Studios are located within the parish grounds of St. Urael Church, Addis Ababa.'}
        </p>

        {/* Map stylized placeholder / banner */}
        <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-[#E3EEF8] bg-gradient-to-br from-[#E3EEF8] to-[#FBF7F0] flex flex-col items-center justify-center text-center p-6 mb-6">
          <div className="w-14 h-14 rounded-full bg-white text-[#1E2A5E] shadow-md flex items-center justify-center text-2xl border-2 border-[#C99A3B] mb-3 animate-bounce">
            📍
          </div>
          <p className="font-extrabold text-[#1E2A5E] text-base">
            {isAm ? 'አዲስ አበባ፣ ኢትዮጵያ' : 'Addis Ababa, Ethiopia'}
          </p>
          <p className="text-xs text-[#44506B] mt-1 max-w-xs">
            {isAm ? 'ቦሌ / ዑራኤል አደባባይ አጠገብ' : 'Bole / Near Urael Junction'}
          </p>
        </div>
      </div>

      <div>
        <a
          href="https://maps.google.com/?q=St+Urael+Church+Addis+Ababa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-[#E3EEF8] hover:bg-[#1E2A5E] text-[#1E2A5E] hover:text-white border border-[#C99A3B] text-xs font-bold transition shadow-sm"
        >
          <span>🌐</span>
          <span>{isAm ? 'በጎግል ካርታ ክፈት' : 'Open in Google Maps'}</span>
        </a>
      </div>
    </div>
  );
}
