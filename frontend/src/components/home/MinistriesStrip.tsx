'use client';

/** MinistriesStrip.tsx — "OUR MINISTRIES" label + 5 ministry cards. (new file) */

import React from 'react';
import Link from 'next/link';
import { HomeIcon, type HomeIconName } from './HomeIcons';

const ITEMS: { icon: HomeIconName; solid?: boolean; title: string; sub: string; href: string }[] = [
  { icon: 'book', solid: true, title: 'Teachings', sub: 'Learn & Grow', href: '/teachings' },
  { icon: 'music', solid: true, title: 'Mezmur', sub: 'Worship Together', href: '/mezmur' },
  { icon: 'cal', title: 'Events', sub: 'Join Our Community', href: '/events' },
  { icon: 'img', title: 'Gallery', sub: 'Our Moments', href: '/gallery' },
  { icon: 'mega', solid: true, title: 'Announcements', sub: 'Stay Informed', href: '/announcements' },
];

export function MinistriesStrip() {
  return (
    <section className="mt-[22px] grid grid-cols-2 gap-3.5 lg:grid-cols-[150px_repeat(5,1fr)]">
      <div className="col-span-2 self-center border-l-2 border-[#c8952f] pl-[18px] text-[10px] tracking-[.1em] text-[#5a6479] lg:col-span-1">
        OUR
        <b className="mb-2 mt-0.5 block text-base font-semibold tracking-[.02em] text-[#0f2352]" style={{ fontFamily: '"Playfair Display", serif' }}>MINISTRIES</b>
        <span className="block max-w-[100px] text-[10.5px] leading-[1.7] tracking-normal">Explore and grow in faith through our ministries.</span>
      </div>
      {ITEMS.map((m) => (
        <Link key={m.title} href={m.href} className="flex flex-col items-center gap-2 rounded-xl border border-[#ece5d8] bg-[#fffdf9] px-2 pb-3.5 pt-4 text-center shadow-[0_3px_14px_rgba(15,35,82,.06)] transition hover:-translate-y-0.5">
          <span className="grid h-[50px] w-[50px] place-items-center rounded-full border border-[#f1dcae] bg-gradient-to-b from-[#fcefd6] to-[#f6e3bf] text-[#bf7d17]">
            <HomeIcon name={m.icon} solid={m.solid} className="h-6 w-6" />
          </span>
          <b className="text-[13px] font-semibold text-[#0f2352]" style={{ fontFamily: '"Playfair Display", serif' }}>{m.title}</b>
          <span className="flex items-center gap-1 text-[10px] font-medium text-[#2c5a8f]">{m.sub} <HomeIcon name="arrow" className="h-3 w-3" /></span>
        </Link>
      ))}
    </section>
  );
}