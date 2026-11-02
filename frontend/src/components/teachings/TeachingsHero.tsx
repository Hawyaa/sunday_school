'use client';

/** TeachingsHero.tsx — cream-to-photo hero: cross, breadcrumb, title, intro, 2 Peter 3:18 quote, gold curve. */

import React from 'react';
import Link from 'next/link';
import { Cross } from '@/components/home/Cross';
import { TIcon } from './TeachingsIcons';

const BG = 'https://i.pinimg.com/474x/3b/9e/b5/3b9eb5a3ef7a8df03cf1fea3e666eb4f.jpg';
const PF = { fontFamily: '"Playfair Display", Georgia, serif' };

export function TeachingsHero() {
  return (
    <section className="relative h-[220px] max-md:h-auto max-md:min-h-[240px] overflow-hidden bg-[#dfe6f0]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BG} alt="" referrerPolicy="no-referrer" className="absolute inset-0 z-0 h-full w-full object-cover object-right" />
      <div aria-hidden className="absolute inset-0 z-[1] bg-[#f7f1e6]/90 md:bg-[linear-gradient(90deg,#f7f1e6_0%,#f7f1e6_34%,rgba(247,241,230,.6)_48%,rgba(247,241,230,0)_64%)]" />

      <Cross className="absolute left-11 top-[34px] z-10 hidden h-[100px] drop-shadow-[0_2px_3px_rgba(120,80,10,.25)] md:block" />

      <div className="relative z-10 px-5 pb-6 pt-[26px] md:pl-[140px]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-3 font-['Crimson_Text',serif] text-[15px] text-[#1c2740]">
          <TIcon name="home" solid className="h-[15px] w-[15px] text-[#c8952f]" />
          <Link href="/">Home</Link><span className="text-[#c8952f]">›</span><span>Teachings</span>
        </nav>
        <h1 className="mb-2 mt-1 text-[40px] font-bold leading-[1.05] text-[#0f2352] md:text-[56px]" style={PF}>Teachings</h1>
        <p className="max-w-[480px] font-['Crimson_Text',serif] text-[16.5px] leading-[1.35] text-[#1c3a63]">
          Discover timeless teachings from the Holy Bible, the Church Fathers, and our spiritual tradition to strengthen your faith and live a Christ-centered life.
        </p>
        <div className="mt-4 flex w-[208px] items-center gap-1.5 text-[#c8952f]" aria-hidden>
          <span className="h-[1.5px] flex-1 bg-[#c8952f]" /><i className="h-[7px] w-[7px] rotate-45 bg-[#c8952f]" /><span className="h-[1.5px] flex-1 bg-[#c8952f]" />
        </div>
      </div>

      <div className="absolute right-20 top-[42px] z-10 hidden text-right font-['Crimson_Text',serif] text-[17px] italic leading-[1.3] text-[#26385a] md:block">
        “Grow in the grace<br />and knowledge of our Lord<br />and Savior Jesus Christ.”
        <small className="mt-3 block text-[14.5px]">— 2 Peter 3:18</small>
      </div>

      <svg aria-hidden viewBox="0 0 250 140" preserveAspectRatio="none" className="absolute bottom-0 right-0 z-[2] hidden h-[140px] w-[250px] md:block">
        <path d="M5 140C100 136 235 100 250 4V140Z" fill="#f7f1e6" />
        <path d="M5 140C100 136 235 100 250 4" fill="none" stroke="#c8952f" strokeWidth="1.6" />
      </svg>
    </section>
  );
}