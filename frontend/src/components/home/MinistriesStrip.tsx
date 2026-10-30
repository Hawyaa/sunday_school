'use client';

/**
 * MinistriesStrip.tsx
 *
 * Floating card that overlaps the hero with 5 ministries:
 * Teachings, Mezmur, Events, Gallery, Announcements.
 * Round gold-tinted icons and clean consistent spacing.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Reveal } from '@/components/motion/Reveal';

interface MinistryItem {
  icon: string;
  title: string;
  titleAm: string;
  sub: string;
  subAm: string;
  href: string;
}

const MINISTRIES: MinistryItem[] = [
  {
    icon: '📖',
    title: 'Teachings',
    titleAm: 'ትምህርቶች',
    sub: 'Learn & grow',
    subAm: 'ይማሩና ያድጉ',
    href: '/teachings',
  },
  {
    icon: '🎵',
    title: 'Mezmur',
    titleAm: 'መዝሙር',
    sub: 'Spiritual hymns',
    subAm: 'መንፈሳዊ ዜማዎች',
    href: '/mezmur',
  },
  {
    icon: '📅',
    title: 'Events',
    titleAm: 'መርሐ ግብራት',
    sub: 'Join our community',
    subAm: 'ከእኛ ጋር ይተባበሩ',
    href: '/events',
  },
  {
    icon: '🖼️',
    title: 'Gallery',
    titleAm: 'ጋለሪ',
    sub: 'Our memories',
    subAm: 'ትዝታዎቻችን',
    href: '/gallery',
  },
  {
    icon: '📢',
    title: 'Announcements',
    titleAm: 'ማስታወቂያዎች',
    sub: 'Stay updated',
    subAm: 'ወቅታዊ መረጃዎች',
    href: '/announcements',
  },
];

export function MinistriesStrip() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  return (
    <div className="relative -mt-14 sm:-mt-16 z-20 max-w-[1140px] mx-auto px-4 sm:px-6 w-full">
      <div className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(15,27,62,0.08)] border border-[#EAE6DF] p-5 sm:p-6 md:p-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 items-center">
        {/* Left: Ministries Label */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1 pr-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C99A3B] block mb-1">
            {isAm ? 'አገልግሎቶች' : 'MINISTRIES'}
          </span>
          <p className="text-xs text-[#505E7B] leading-relaxed">
            {isAm
              ? 'በአገልግሎቶቻችን አማካኝነት በእምነት ያድጉ።'
              : 'Explore and grow in faith through our ministries.'}
          </p>
        </div>

        {/* 5 Ministries Items */}
        {MINISTRIES.map((m, i) => (
  <Reveal key={m.title} delay={1000 + i * 90} className="h-full">
    <Link
      href={m.href}
      className="group flex h-full flex-col items-center text-center p-2 rounded-xl transition-all hover:-translate-y-1 hover:bg-[#FAF9F5]"
    >
      {/* ...everything inside the Link stays exactly the same */}
    </Link>
  </Reveal>
))}
      </div>
    </div>
  );
}
