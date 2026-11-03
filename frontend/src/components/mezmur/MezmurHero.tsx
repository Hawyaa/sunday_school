'use client';

/**
 * MezmurHero.tsx — same layout as About/Events/Reports heroes.
 * Taller hero, straight bottom edge, animated entrance (see mezmur-animations.css).
 */

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { Divider } from '@/components/reports/icons';
import { useHeroReplay } from '@/components/mezmur/useMezmurMotion';

const HERO_IMAGE = 'https://i.pinimg.com/474x/3b/9e/b5/3b9eb5a3ef7a8df03cf1fea3e666eb4f.jpg';

// Hero height — change here to make it taller/shorter.
const HERO_H = 'min-h-[300px] md:min-h-[360px] lg:min-h-[400px]';

/** Splits text into masked characters for the slide-up reveal (screen readers get the plain text). */
function SplitText({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={`${text}-${i}`} className="mz-char-mask">
          <span className="mz-char" style={{ '--i': i } as React.CSSProperties}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        </span>
      ))}
    </>
  );
}

export function MezmurHero() {
  const { locale } = useAppStore();
  const am = locale === 'am';
  const ref = useRef<HTMLElement>(null);
  useHeroReplay(ref);

  const title = am ? 'መዝሙር' : 'Mezmur';

  return (
    <section
      ref={ref}
      aria-label="Mezmur Hero"
      className={`mz-play relative ${HERO_H} overflow-hidden border-b border-[#ecdcb8] bg-[#dfe6f0]`}
    >
      {/* Background image (slow zoom) */}
      <div
        aria-hidden="true"
        className="mz-hero-bg absolute inset-0 bg-cover bg-[position:right_center]"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg,#f7f1e6 0%,#f7f1e6 38%,rgba(247,241,230,.55) 56%,rgba(247,241,230,0) 72%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden xl:block"
        style={{ background: 'linear-gradient(270deg,rgba(247,241,230,.85) 0%,rgba(247,241,230,.55) 16%,rgba(247,241,230,0) 30%)' }}
      />

      <div className="relative z-10 mx-auto max-w-[1536px] px-4 sm:px-8 lg:px-[70px]">
        <div className={`relative flex ${HERO_H} flex-col justify-center py-6`}>
          {/* Text block — cross is anchored to it so it stays aligned at any hero height */}
          <div className="relative flex flex-col justify-center md:ml-[73px]">
            <Image
              src="/images/cross.png"
              alt="Ethiopian Orthodox cross"
              width={213}
              height={420}
              priority
              className="mz-cross pointer-events-none absolute -left-[73px] top-0 hidden h-[92px] w-auto select-none drop-shadow-[0_2px_3px_rgba(120,80,10,0.25)] md:block"
            />

            <nav aria-label="Breadcrumb" className="mz-crumb mb-1.5 flex items-center gap-2 text-[13px] font-medium text-[#1c2740]">
              <Link href="/" className="hover:text-[#0f2352]">
                {am ? 'ዋና ገጽ' : 'Home'}
              </Link>
              <span className="font-semibold text-[#0f2352]">›</span>
              <span className="font-semibold text-[#0f2352]">{am ? 'መዝሙር' : 'Mezmur'}</span>
            </nav>

            <h1 className="mb-1 font-['Playfair_Display',serif] text-[40px] font-bold leading-[1.1] text-[#0f2352] sm:text-[54px]">
              <span className="sr-only">{title}</span>
              <span aria-hidden="true">
                <SplitText text={title} />
              </span>
            </h1>

            <p className="mz-desc max-w-[400px] font-['Crimson_Text',serif] text-[17px] leading-[1.3] text-[#1c3a63]">
              {am
                ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ መዝሙራትን፣ መንፈሳዊ ዝማሬዎችንና የመዘምራን ዜማዎችን ያስሱ።'
                : 'Explore our collection of Ethiopian Orthodox Mezmur lyrics, spiritual chants, and choir songs.'}
            </p>

            <div className="mz-draw mt-3.5 w-[172px]">
              <Divider className="w-full" />
            </div>
          </div>

          <div className="mz-quote pointer-events-none absolute right-4 top-[calc(50%-78px)] z-10 hidden max-w-[250px] select-none text-right font-['Crimson_Text',serif] text-[18px] italic leading-[1.4] text-[#26385a] lg:right-[66px] xl:block">
            {am ? '“በመለከት ድምፅ እግዚአብሔርን አመስግኑት።”' : '“Praise the Lord with the sound of the trumpet.”'}
            <small className="mt-2 block text-[13.5px] not-italic">— {am ? 'መዝሙር 150:3' : 'Psalm 150:3'}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
