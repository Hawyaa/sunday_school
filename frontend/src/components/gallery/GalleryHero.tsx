'use client';

/**
 * GalleryHero.tsx
 *
 * Gallery Hero Banner (layout, colours and copy unchanged):
 * - Church background with gradient overlay (background now on its own layer so it can slow-zoom)
 * - Gold geometric corner accents
 * - Breadcrumb: 🏠 Home › Gallery
 * - Gold vertical line with title "Gallery" and descriptive paragraph
 * Entrance animation lives in gallery-animations.css and replays on every visit.
 */

import React, { useRef } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useHeroReplay } from '@/components/gallery/useGalleryMotion';

const HERO_IMAGE = 'https://i.pinimg.com/736x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg';

/** Masked per-character slide-up (screen readers get the plain text via sr-only). */
function SplitText({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={`${text}-${i}`} className="gl-char-mask">
          <span className="gl-char" style={{ '--i': i } as React.CSSProperties}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        </span>
      ))}
    </>
  );
}

export function GalleryHero() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';
  const ref = useRef<HTMLElement>(null);
  useHeroReplay(ref);

  const title = isAm ? 'የፎቶ ማህደር' : 'Gallery';

  return (
    <section ref={ref} className="gl-play relative w-full max-w-[1280px] mx-auto px-6 sm:px-9 pt-6">
      <div className="relative rounded-2xl p-7 sm:p-10 md:p-12 min-h-[190px] flex flex-col justify-center overflow-hidden border border-[#C99A3B]/30 shadow-[0_4px_20px_rgba(15,27,62,0.06)]">
        {/* Background image (slow zoom) */}
        <div
          aria-hidden="true"
          className="gl-hero-bg absolute inset-0 bg-cover bg-right"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        {/* Cream gradient overlay (same stops as before) */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(250, 246, 239, 0.96) 0%, rgba(250, 246, 239, 0.88) 45%, rgba(250, 246, 239, 0.2) 100%)',
          }}
        />

        {/* Gold Geometric Corner Accents */}
        <div
          className="gl-corner-tl absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-85"
          style={{ background: 'linear-gradient(135deg, #C99A3B 50%, transparent 50%)' }}
        />
        <div
          className="gl-corner-br absolute bottom-0 right-0 w-16 h-16 pointer-events-none opacity-85"
          style={{ background: 'linear-gradient(315deg, #C99A3B 50%, transparent 50%)' }}
        />

        {/* Breadcrumb */}
        <div className="gl-crumb relative z-10 flex items-center gap-2 text-[13px] font-semibold text-[#0F1B3E] mb-3">
          <Link href="/" className="hover:underline flex items-center gap-1">
            <span>🏠</span>
            <span>{isAm ? 'ዋና ገጽ' : 'Home'}</span>
          </Link>
          <span className="text-slate-400">›</span>
          <span className="text-[#0F1B3E] font-bold">{title}</span>
        </div>

        {/* Title Container with Gold Vertical Line */}
        <div className="relative z-10 flex items-start gap-3 sm:gap-3.5">
          <div className="gl-line w-1 h-12 bg-[#C99A3B] rounded-xs mt-1 shrink-0" />
          <div className="hero-text-content">
            <h2 className="text-3xl sm:text-[38px] font-extrabold text-[#0F1B3E] leading-[1.1] mb-2 font-serif sm:font-sans">
              <span className="sr-only">{title}</span>
              <span aria-hidden="true">
                <SplitText text={title} />
              </span>
            </h2>
            <p className="gl-desc text-sm sm:text-[14.5px] text-[#505E7B] max-w-[520px] leading-relaxed">
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
