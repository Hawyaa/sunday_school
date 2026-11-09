'use client';

/**
 * ContactHero.tsx
 *
 * Dedicated hero section for the Contact Us page.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export function ContactHero() {
  const { locale } = useAppStore();

  const isAm = locale === 'am';

  return (
    <section className="bg-gradient-to-b from-[#1E2A5E] to-[#2F5D9E] text-white py-14 sm:py-18 px-4 relative overflow-hidden border-b-4 border-[#C99A3B]">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#C99A3B]/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#C99A3B]/20 border border-[#C99A3B]/40 text-[#FBF7F0] text-xs font-semibold tracking-wider uppercase mb-4">
          {isAm ? 'አቡነ ሚዲያ | መረጃና ግንኙነት' : 'Abune Media | Get in Touch'}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          {isAm ? 'ያግኙን' : 'Contact Us'}
        </h1>
        <p className="text-base sm:text-lg text-[#E3EEF8] max-w-2xl mx-auto leading-relaxed">
          {isAm
            ? 'ጥያቄ፣ የጸሎት ጥያቄ፣ አስተያየት ወይም ከአገልግሎታችን ጋር ለመተባበር እባክዎ ከታች ባሉት አድራሻዎች ያግኙን።'
            : 'Reach out to Abune Media with any inquiries, prayer requests, feedback, or fellowship partnerships.'}
        </p>
      </div>
    </section>
  );
}
