'use client';

/**
 * ReportsHero.tsx
 * Same layout as AboutHero: cross at left-0 top-[42px] (92px tall), text column offset 73px,
 * scripture quote on the right, curved bottom-right edge.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { Divider } from '@/components/reports/icons';

const HERO_IMAGE = 'https://i.pinimg.com/474x/3b/9e/b5/3b9eb5a3ef7a8df03cf1fea3e666eb4f.jpg';

export function ReportsHero() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <section
      aria-label="Reports Hero"
      className="relative min-h-[238px] overflow-hidden bg-[#dfe6f0] bg-cover bg-[position:right_center]"
      style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
    >
      {/* cream fade from the left */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg,#f7f1e6 0%,#f7f1e6 38%,rgba(247,241,230,.55) 56%,rgba(247,241,230,0) 72%)' }}
      />
      {/* light fade on the right so the quote stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden xl:block"
        style={{ background: 'linear-gradient(270deg,rgba(247,241,230,.85) 0%,rgba(247,241,230,.55) 16%,rgba(247,241,230,0) 30%)' }}
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
              <Link href="/" className="hover:text-[#0f2352]">
                {am ? 'ዋና ገጽ' : 'Home'}
              </Link>
              <span className="font-semibold text-[#0f2352]">›</span>
              <span className="font-semibold text-[#0f2352]">{am ? 'ሪፖርቶች' : 'Reports'}</span>
            </nav>

            <h1 className="mb-1 font-['Playfair_Display',serif] text-[40px] font-bold leading-[1.1] text-[#0f2352] sm:text-[54px]">
              {am ? 'ሪፖርቶች' : 'Reports'}
            </h1>

            <p className="max-w-[360px] font-['Crimson_Text',serif] text-[16px] leading-[1.3] text-[#1c3a63]">
              {am
                ? 'ይፋዊ የቤተክርስቲያን እና የአስተዳደር ሪፖርቶችን፣ የፋይናንስ፣ የትምህርት፣ የአገልግሎት እና የማህበረሰብ ሪፖርቶችን እዚህ ያግኙና ይመልከቱ።'
                : 'Access and review various official church and administrative reports, including financial, educational, service, and community reports.'}
            </p>

            <Divider className="mt-3.5 w-[172px]" />
          </div>

          {/* Quote on the right */}
          <div className="pointer-events-none absolute right-4 top-8 z-10 hidden max-w-[250px] select-none text-right font-['Crimson_Text',serif] text-[18px] italic leading-[1.4] text-[#26385a] lg:right-[66px] xl:block">
            {am
              ? '“ሀብታችሁ ባለበት ልባችሁም በዚያ ይሆናልና።”'
              : '“For where your treasure is, there your heart will be also.”'}
            <small className="mt-2 block text-[13.5px] not-italic">— {am ? 'ማቴዎስ 6:21' : 'Matthew 6:21'}</small>
          </div>
        </div>
      </div>

      {/* Curved bottom-right edge */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-px left-0 z-20 block h-16 w-full"
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
      >
        <path d="M0 64V63H1290C1360 63 1410 50 1440 30V64Z" fill="#f7f1e6" />
        <path d="M1200 63H1290C1360 63 1410 50 1440 30" fill="none" stroke="#c8952f" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </section>
  );
}