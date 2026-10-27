'use client';

/** HeroSection.tsx — cream-to-photo hero, welcome cross, watermark crosses, corner triangle + cross. */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Cross } from './Cross';
import { HomeIcon } from './HomeIcons';

const BG = 'https://i.pinimg.com/474x/3b/9e/b5/3b9eb5a3ef7a8df03cf1fea3e666eb4f.jpg';
const PF = { fontFamily: '"Playfair Display", Georgia, serif' };

export function HeroSection() {
  const { locale } = useAppStore();

  return (
    <section className="relative min-h-[292px] overflow-hidden bg-[#dfe6f0]" aria-label="Hero banner">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BG} alt="" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover object-right" />
      <div aria-hidden className="absolute inset-0 bg-[#f5eee1]/90 md:bg-[linear-gradient(90deg,#f5eee1_0%,#f5eee1_30%,rgba(245,238,225,.7)_46%,rgba(245,238,225,0)_66%)]" />

      <Cross className="absolute left-[27%] top-10 z-[1] hidden h-24 opacity-[.14] md:block" />
      <Cross className="absolute right-2.5 top-[62px] z-[1] hidden h-[120px] opacity-[.14] md:block" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 pb-6 pt-[34px]">
        <div className="flex items-center gap-2.5 text-[11.5px] uppercase tracking-[.1em] text-[#c8952f]">
          <Cross className="h-7" />
          {locale === 'am' ? 'እንኳን ወደ አቡነ ሚዲያ በደህና መጡ' : 'Welcome to Abune Media'}
        </div>

        <h1 className="mt-2.5 text-[36px] font-bold leading-[1.1] text-[#0f2352] md:text-[46px]" style={PF}>
          Faith. Culture.
          <em className="block font-semibold not-italic text-[#c8952f]">Community.</em>
        </h1>

        <p className="my-3.5 mb-[18px] max-w-[340px] text-[13px] text-[#2e3a58]">
          {locale === 'am'
            ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነት፣ ሥርዓትና ትውፊት ማስተማሪያ ይፋዊ የሰንበት ትምህርት ቤት መድረክ።'
            : 'A digital platform dedicated to sharing the teachings, spirituality, and rich heritage of the Ethiopian Orthodox Tewahedo Church.'}
        </p>

        <div className="flex flex-col gap-[18px] sm:flex-row">
          <Link href="/teachings" className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-[#d3a03c] to-[#b9852a] px-[26px] py-3 text-xs font-semibold text-white">
            Explore Our Content <HomeIcon name="arrow" />
          </Link>
          <Link href="/schedule" className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-[#b9c0cf] bg-white/55 px-[26px] py-3 text-xs font-semibold text-[#0f2352]">
            <HomeIcon name="cal" /> View Schedule
          </Link>
        </div>

        <div className="absolute right-12 top-[78px] hidden max-w-[190px] text-right text-[10px] italic leading-[1.9] text-[#33425f] md:block" style={PF}>
          “For where two or three are gathered in my name, there am I among them.”
          <small className="mt-2 block text-[9px]" style={{ fontFamily: 'Inter, sans-serif' }}>— Matthew 18:20</small>
        </div>
      </div>

      {/* Corner triangle + cross */}
      <div aria-hidden className="absolute bottom-0 right-0 h-[100px] w-[150px]">
        <svg viewBox="0 0 150 100" className="absolute inset-0 h-full w-full">
          <path d="M150 0V100H0z" fill="#f5eee1" />
          <path d="M0 100 150 0" stroke="#c8952f" strokeWidth="1.5" />
        </svg>
        <Cross className="absolute bottom-3 right-3 h-[42px]" />
      </div>
    </section>
  );
}