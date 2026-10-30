'use client';

/** GalleryHighlights.tsx — "Gallery Highlights" card with one large photo. (new file) */

import React from 'react';
import Link from 'next/link';
import { HomeIcon } from './HomeIcons';

const PHOTO = 'https://i.pinimg.com/474x/3b/9e/b5/3b9eb5a3ef7a8df03cf1fea3e666eb4f.jpg';
const PF = { fontFamily: '"Playfair Display", serif' };

export function GalleryHighlights() {
  return (
    <section aria-label="Gallery Highlights" className="rounded-xl border border-[#ece5d8] bg-[#fffdf9] px-5 py-[18px] shadow-[0_3px_14px_rgba(15,35,82,.06)]">
      <div className="mb-3 flex items-center gap-2.5">
        <HomeIcon name="img" className="h-5 w-5 text-[#0f2352]" />
        <h3 className="text-[17px] font-semibold text-[#0f2352]" style={PF}>Gallery Highlights</h3>
        <Link href="/gallery" className="ml-auto flex items-center gap-1 text-[9.5px] font-medium text-[#2c5a8f]">
          View All <HomeIcon name="arrow" className="h-3 w-3" />
        </Link>
      </div>
      <div className="relative h-[200px] overflow-hidden rounded-[10px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTO} alt="Holy Saturday Service" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent from-[45%] to-[#0b1a3f]/85" />
        <div className="absolute bottom-3 left-3.5 z-10 text-white">
          <b className="block text-sm font-semibold" style={PF}>Holy Saturday Service</b>
          <small className="block text-[9.5px]">A moment of faith and devotion.</small>
          <span className="mt-[5px] flex items-center gap-1.5 text-[10px] text-[#f1d79b]"><HomeIcon name="img" className="h-3 w-3" />24 photos</span>
        </div>
        <div className="absolute bottom-3.5 right-3 z-10 flex gap-1.5">
          {(['chl', 'chr'] as const).map((n) => (
            <span key={n} className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[#f6e3bf] text-[#7a5a1e]"><HomeIcon name={n} className="h-3 w-3" /></span>
          ))}
        </div>
      </div>
    </section>
  );
}