'use client';

/**
 * MissionCard.tsx
 *
 * "Preserving Faith, Sharing Heritage" mission section:
 * - Left: Ethiopian Cross, large heading, mission description, and 3 pillars (Faith, Knowledge, Service).
 * - Right: Large rounded warm candlelit quote card: "The Church is the anchor of our soul."
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Cross } from './Cross';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
export function MissionCard() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  return (
    <section aria-label="Our Mission" className="max-w-[1140px] mx-auto px-4 sm:px-6 py-14 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Heading & Mission Details */}
        <div className="lg:col-span-7">
          <div className="text-[#C99A3B] mb-3">
            <Cross className="w-6 h-10" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C99A3B] block mb-2">
            {isAm ? 'ተልዕኳችን' : 'OUR MISSION'}
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F1B3E] leading-tight mb-4">
            {isAm ? 'እምነትን መጠበቅ፤ ቅርስን ማካፈል' : 'Preserving Faith, Sharing Heritage'}
          </h2>

          <p className="text-sm sm:text-base text-[#505E7B] leading-relaxed mb-8 max-w-xl">
            {isAm
              ? 'አቡነ ሚዲያ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን እምነትን፣ መንፈሳዊ እሴቶችን እና ባህላዊ ቅርሶችን ለማስፋፋት የተፈጠረ ዲጂታል መድረክ ነው።'
              : 'Axum Media is a digital platform created to spread the teachings and cultural heritage of the Ethiopian Orthodox Tewahedo Church.'}
          </p>

          {/* 3 Pillars */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#EAE6DF]">
            <div>
              <strong className="block text-base sm:text-lg font-serif font-bold text-[#0F1B3E]">
                {isAm ? 'እምነት' : 'Faith'}
              </strong>
              <span className="text-xs text-[#7C88A8]">
                {isAm ? 'ትምህርቶች' : 'Teachings'}
              </span>
            </div>
            <div>
              <strong className="block text-base sm:text-lg font-serif font-bold text-[#0F1B3E]">
                {isAm ? 'እውቀት' : 'Knowledge'}
              </strong>
              <span className="text-xs text-[#7C88A8]">
                {isAm ? 'መማር' : 'Learn'}
              </span>
            </div>
            <div>
              <strong className="block text-base sm:text-lg font-serif font-bold text-[#0F1B3E]">
                {isAm ? 'አገልግሎት' : 'Service'}
              </strong>
              <span className="text-xs text-[#7C88A8]">
                {isAm ? 'ማገልገል' : 'Serve'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Quote Card with warm glowing candlelit flare */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl border border-[#EAE6DF] bg-[#180A03] p-7 sm:p-9 flex flex-col justify-end">
            {/* Candle glow radial gradient */}
            <Parallax speed={0.06} className="absolute inset-x-0 -inset-y-[12%]">
  <div
    aria-hidden
    className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(235,145,30,0.6)_0%,rgba(165,80,10,0.3)_45%,rgba(15,8,3,0.95)_85%)]"
  />
</Parallax>
            {/* Dark bottom vignette */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30"
            />

            {/* Quote Text */}
            <div className="relative z-10">
              <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl text-white font-medium leading-snug drop-shadow-md">
                {isAm
                  ? '“ቤተክርስቲያን የነፍሳችን መልሕቅ ናት።”'
                  : '“The Church is the anchor of our soul.”'}
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
