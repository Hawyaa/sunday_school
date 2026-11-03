'use client';

/**
 * ReportsSidebar.tsx
 *
 * Right column: "Need a Specific Report?" card with ornate corners, and the blessing quote card.
 * Animation: card slides in from the right · gold corner borders draw outward · cross scales in ·
 * contact button fades in · quote image slowly zooms · quote reveals word by word.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { CornerOrnament, CrossIcon, Divider, MailIcon } from '@/components/reports/icons';
import { RmGroup, WordReveal, rmDelay } from '@/components/reports/motion';

const QUOTE_IMAGE = 'https://i.pinimg.com/1200x/aa/b6/55/aab655bda9ce179c5c34b95c20816317.jpg';

export function ReportsSidebar() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const quote = am
    ? '“እግዚአብሔር ቤተክርስቲያኑን በንጹሕ ልብ የሚያገለግሉትን ሁሉ ይባርክ።”'
    : '“May the Lord bless all who serve His Church with a pure heart.”';

  return (
    <aside className="mt-3 flex flex-col gap-[17px]">
      {/* Need a report — slides in from the right; corner borders draw outward */}
      <RmGroup
        rm="right"
        orn
        className="relative rounded-xl border border-[#ecdcb8] bg-[#fffdf9] px-[46px] pb-4 pt-3 text-center shadow-[0_3px_14px_rgba(15,35,82,0.05)]"
      >
        <CornerOrnament className="left-[5px] top-[5px] -scale-x-100" />
        <CornerOrnament className="right-[5px] top-[5px]" />
        <CornerOrnament className="bottom-[5px] left-[5px] -scale-100" />
        <CornerOrnament className="bottom-[5px] right-[5px] -scale-y-100" />

        {/* Cross — scale in */}
        <div data-rm="scale" style={rmDelay(350)} className="mb-1.5 mt-0.5 flex justify-center">
          <CrossIcon className="h-14 w-auto" />
        </div>

        <h2
          data-rm="fade"
          style={rmDelay(450)}
          className="mb-3 font-['Playfair_Display',serif] text-[25px] font-bold leading-[1.2] text-[#0f2352]"
        >
          {am ? 'የተወሰነ ሪፖርት ይፈልጋሉ?' : 'Need a Specific Report?'}
        </h2>
        <p data-rm="fade" style={rmDelay(550)} className="mb-3 text-[15px] leading-[1.35] text-[#1c2740]">
          {am
            ? 'የሚፈልጉትን ሪፖርት ማግኘት ካልቻሉ እባክዎ የቤተክርስቲያኒቱን አስተዳደር ያነጋግሩ።'
            : 'If you can’t find the report you’re looking for, please contact the church administration.'}
        </p>

        {/* Contact button — fade in */}
        <div data-rm="fade" style={rmDelay(650)}>
          <Link
            href="/contact"
            className="mx-auto flex max-w-[202px] items-center justify-center gap-3 rounded-full border-[1.5px] border-[#dcc08a] bg-[#fffbf1] p-[9px] font-[Inter,sans-serif] text-[12.5px] font-medium text-[#b9852a] transition duration-300 hover:scale-[1.04] hover:bg-[#fff4d9] hover:shadow-[0_6px_16px_rgba(185,133,42,0.18)]"
          >
            <MailIcon className="h-5 w-5" />
            {am ? 'አስተዳደሩን ያነጋግሩ' : 'Contact Admin'}
          </Link>
        </div>

        {/* Divider — line reveal */}
        <div data-rm="line" style={rmDelay(800)} className="mx-auto mt-4 w-[84px]">
          <Divider className="w-full" />
        </div>
      </RmGroup>

      {/* Quote card — slow image zoom + word-by-word quote */}
      <RmGroup className="relative flex h-[263px] items-end justify-center overflow-hidden rounded-xl text-center">
        <div
          data-rm="zoom"
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${QUOTE_IMAGE}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_38%,rgba(247,241,230,.92)_62%)]" />
        <div className="relative z-10 px-[30px] pb-4 font-['Crimson_Text',serif] text-[18px] italic leading-[1.35] text-[#26385a]">
          <WordReveal text={quote} delay={500} step={70} />
          <div data-rm="line" style={rmDelay(1300)} className="mx-auto mt-2.5 w-[140px]">
            <Divider className="w-full" />
          </div>
        </div>
      </RmGroup>
    </aside>
  );
}