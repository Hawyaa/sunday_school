'use client';

/**
 * ContactQuoteFooter.tsx
 *
 * Scripture reflection footer for Contact page.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export function ContactQuoteFooter() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  return (
    <section className="mt-12">
      <div className="bg-[#1E2A5E] rounded-2xl p-8 sm:p-10 text-center text-white relative overflow-hidden shadow-md border-t-2 border-[#C99A3B]">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block text-2xl mb-2 text-[#C99A3B]">✞</span>
          <blockquote className="text-base sm:text-lg md:text-xl font-serif italic text-[#FBF7F0] leading-relaxed mb-3">
            {isAm
              ? '«እግዚአብሔር ቸር ነው፥ በመከራ ቀንም መጠጊያ ነው፤ በእርሱ የሚታመኑትንም ያውቃቸዋል።»'
              : '"The Lord is good, a refuge in times of trouble. He cares for those who trust in him."'}
          </blockquote>
          <cite className="not-italic text-xs font-bold tracking-wider text-[#C99A3B] uppercase">
            {isAm ? 'ትንቢተ ናሆም 1:7' : 'Nahum 1:7'}
          </cite>
        </div>
      </div>
    </section>
  );
}
