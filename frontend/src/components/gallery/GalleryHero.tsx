'use client';

/**
 * GalleryHero.tsx
 *
 * Exact implementation of the Gallery Hero Banner:
 * - Church background with gradient overlay
 * - Gold geometric corner accents (.hero-card::before & ::after)
 * - Breadcrumb: 🏠 Home › Gallery
 * - Gold vertical line with title "Gallery" and descriptive paragraph
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export function GalleryHero() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  return (
    <section className="relative w-full max-w-[1280px] mx-auto px-6 sm:px-9 pt-6">
      <div
        className="relative rounded-2xl p-7 sm:p-10 md:p-12 min-h-[190px] flex flex-col justify-center overflow-hidden border border-[#C99A3B]/30 shadow-[0_4px_20px_rgba(15,27,62,0.06)] bg-cover bg-right"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(250, 246, 239, 0.96) 0%, rgba(250, 246, 239, 0.88) 45%, rgba(250, 246, 239, 0.2) 100%), url('https://i.pinimg.com/736x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg')`,
        }}
      >
        {/* Gold Geometric Corner Accents */}
        <div
          className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-85"
          style={{ background: 'linear-gradient(135deg, #C99A3B 50%, transparent 50%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none opacity-85"
          style={{ background: 'linear-gradient(315deg, #C99A3B 50%, transparent 50%)' }}
        />

        {/* Breadcrumb */}
        <div className="relative z-10 flex items-center gap-2 text-[13px] font-semibold text-[#0F1B3E] mb-3">
          <Link href="/" className="hover:underline flex items-center gap-1">
            <span>🏠</span>
            <span>{isAm ? 'ዋና ገጽ' : 'Home'}</span>
          </Link>
          <span className="text-slate-400">›</span>
          <span className="text-[#0F1B3E] font-bold">
            {isAm ? 'የፎቶ ማህደር' : 'Gallery'}
          </span>
        </div>

        {/* Title Container with Gold Vertical Line */}
        <div className="relative z-10 flex items-start gap-3 sm:gap-3.5">
          <div className="w-1 h-12 bg-[#C99A3B] rounded-xs mt-1 shrink-0" />
          <div className="hero-text-content">
            <h2 className="text-3xl sm:text-[38px] font-extrabold text-[#0F1B3E] leading-[1.1] mb-2 font-serif sm:font-sans">
              {isAm ? 'የፎቶ ማህደር' : 'Gallery'}
            </h2>
            <p className="text-sm sm:text-[14.5px] text-[#505E7B] max-w-[520px] leading-relaxed">
              {isAm
                ? 'የቤተክርስቲያናችንን ልዩ ልዩ የፎቶ ስብስቦችና ታሪካዊ የበዓላት ሁነቶችን እዚህ ይመልከቱ!'
                : 'Explore various photo collections and historic event moments of our church!'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
