'use client';

/**
 * AboutHero.tsx
 * Same layout as EventsHero: cross at left-0 top-[42px] (92px tall), text column offset 73px.
 * Plus: small bottom-left corner ornament, scripture-style quote on the right, curved bottom-right edge.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { PF, Icon } from './shared';

export function AboutHero() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <section
      aria-label="About Abune Media Hero"
      className="relative min-h-[238px] overflow-hidden bg-[#dfe6f0] bg-cover bg-[position:right_center]"
      style={{ backgroundImage: "url('https://i.pinimg.com/474x/3b/9e/b5/3b9eb5a3ef7a8df03cf1fea3e666eb4f.jpg')" }}
    >
      {/* Gradient mask */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg,#f5eee1 0%,#f5eee1 38%,rgba(245,238,225,.55) 56%,rgba(245,238,225,0) 72%)' }}
      />
      {/* Bottom-left corner ornament (artwork is a top-right corner, so rotate 180°) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/corner-ornament.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute bottom-2 left-2 z-[5] hidden w-[80px] -scale-100 select-none mix-blend-multiply sm:block lg:w-[100px]"
      />

      {/* Inner container (same paddings as EventsHero) */}
      <div className="relative z-10 mx-auto max-w-[1536px] px-4 sm:px-8 lg:px-[70px]">
        <div className="relative flex min-h-[238px] flex-col justify-center py-6">
          {/* Gold Ethiopian Orthodox cross (public/images/cross.png) */}
          <Image
            src="/images/cross.png"
            alt="Ethiopian Orthodox cross"
            width={213}
            height={420}
            priority
            className="pointer-events-none absolute left-0 top-[42px] hidden h-[92px] w-auto select-none drop-shadow-[0_2px_3px_rgba(120,80,10,0.25)] md:block"
          />

          {/* Text column */}
          <div className="flex flex-col justify-center md:ml-[73px]">
            <nav aria-label="Breadcrumb" className="mb-1.5 flex items-center gap-2 text-[13px] font-medium text-[#1c2740]">
              <Link href="/" className="flex items-center gap-1.5 hover:text-[#0f2352]">
                <Icon name="home" className="size-3.5 text-[#0f2352]" />
                <span>{am ? 'መነሻ' : 'Home'}</span>
              </Link>
              <span className="font-semibold text-[#0f2352]">›</span>
              <span className="font-semibold text-[#0f2352]">{am ? 'ስለ እኛ' : 'About'}</span>
            </nav>

            <h1 className={`${PF} mb-1 text-[32px] font-bold leading-[1.15] text-[#0f2352] sm:text-[40px]`}>
              {am ? 'ስለ አቡነ ሚዲያ' : 'About Abune Media'}
            </h1>
            <div className={`${PF} mb-3 text-[21px] font-medium italic text-[#c8952f]`}>
              {am ? 'እምነታችን። ተልዕኳችን። ማኅበረሰባችን።' : 'Our Faith. Our Mission. Our Community.'}
            </div>
            <p className="max-w-[340px] text-[13px] text-[#4a5670]">
              {am
                ? 'አቡነ ሚዲያ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያንን ትምህርት፣ መንፈሳዊ እሴቶችና ባህላዊ ቅርስ ለዓለም ለማካፈል የተፈጠረ ዲጂታል መድረክ ነው።'
                : 'Abune Media is a digital platform created to share the teachings, spiritual values, and cultural heritage of the Ethiopian Orthodox Tewahedo Church with the world.'}
            </p>
            <div aria-hidden="true" className="mt-3.5 flex w-[68px] items-center gap-1.5 before:h-[1.5px] before:flex-1 before:bg-[#c8952f] after:h-[1.5px] after:flex-1 after:bg-[#c8952f]">
              <i className="size-1.5 rotate-45 bg-[#c8952f]" />
            </div>
          </div>

          {/* Quote on the right */}
          <div className={`${PF} pointer-events-none absolute right-4 top-8 hidden max-w-[230px] select-none text-right text-sm font-medium italic text-white [text-shadow:0_2px_8px_rgba(0,0,0,.6)] lg:right-[66px] lg:block`}>
            {am ? '“ቤተክርስቲያን ቦታ ብቻ ሳትሆን የሕይወት መንገድ ናት።”' : '“The Church is not only a place, but a way of life.”'}
            <small className="mt-3.5 block font-sans text-[11px]">— {am ? 'አቡነ ዲዮስቆሮስ' : 'Abune Diskoros'}</small>
          </div>
        </div>
      </div>

      {/* Curved bottom-right edge */}
      <svg aria-hidden="true" className="pointer-events-none absolute -bottom-px left-0 z-20 block h-16 w-full" viewBox="0 0 1440 64" preserveAspectRatio="none">
        <path d="M0 64V63H1290C1360 63 1410 50 1440 30V64Z" fill="#f5eee1" />
        <path d="M1200 63H1290C1360 63 1410 50 1440 30" fill="none" stroke="#c8952f" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </section>
  );
}