'use client';

/**
 * ServicesContentSection.tsx
 * "More Ways to Serve": 4 program cards linking to the main portals.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { PF, Eyebrow, IconBadge, card, panel } from './shared';

const PROGRAMS = [
  { icon: 'music', href: '/mezmur', tEn: 'Mezmur & Spiritual Music', tAm: 'መዝሙርና መንፈሳዊ ሙዚቃ',
    dEn: 'Sacred hymns and prayers to uplift your soul.', dAm: 'መንፈስን የሚያድሱ ቅዱሳት ዝማሬዎችና ጸሎታት።' },
  { icon: 'users', href: '/announcements', tEn: 'Community Service', tAm: 'የማኅበረሰብ አገልግሎት',
    dEn: 'Serving together for a better tomorrow.', dAm: 'ለተሻለ ነገ በአንድነት ማገልገል።' },
  { icon: 'bank', href: '/gallery', tEn: 'Cultural Heritage', tAm: 'ባህላዊ ቅርስ',
    dEn: 'Preserving our roots and traditions.', dAm: 'ሥረ መሠረታችንንና ትውፊታችንን መጠበቅ።' },
  { icon: 'cal', href: '/events', tEn: 'Events & Gatherings', tAm: 'መርሐ ግብራትና ጉባኤዎች',
    dEn: 'Church events and community gatherings.', dAm: 'የቤተክርስቲያን በዓላትና የማኅበረሰብ ጉባኤዎች።' },
];

export function ServicesContentSection() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <section aria-label="Our Programs" className={panel}>
      <Eyebrow>{am ? 'ፕሮግራሞቻችን' : 'Our Programs'}</Eyebrow>
      <h2 className={`${PF} text-[22px] font-bold text-[#0f2352]`}>{am ? 'ተጨማሪ የአገልግሎት መንገዶች' : 'More Ways to Serve'}</h2>
      <p className="mb-4 mt-1 max-w-[320px] text-[11.5px] text-[#5a6479]">
        {am
          ? 'በተለያዩ ፕሮግራሞቻችን እምነትን እናካፍላለን፣ ማኅበረሰብን እንገነባለን፣ ባለጸጋ ቅርሳችንን እንጠብቃለን።'
          : 'Through our diverse programs, we share faith, build community, and preserve our rich heritage.'}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROGRAMS.map((p) => (
          <Link key={p.tEn} href={p.href} className={`${card} flex items-center gap-3.5 p-4 transition hover:-translate-y-0.5`}>
            <IconBadge name={p.icon} solid />
            <div>
              <b className="block text-[12.5px] font-semibold text-[#2c5a8f]">{am ? p.tAm : p.tEn}</b>
              <span className="mt-0.5 block text-[10.5px] leading-[1.4] text-[#5b6b86]">{am ? p.dAm : p.dEn}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}