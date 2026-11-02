'use client';

/**
 * ReportsSidebar.tsx  (NEW)
 *
 * Right column: "Need a Specific Report?" card with ornate corners,
 * and the blessing quote card.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { CornerOrnament, CrossIcon, Divider, MailIcon } from '@/components/reports/icons';

const QUOTE_IMAGE = 'https://i.pinimg.com/1200x/aa/b6/55/aab655bda9ce179c5c34b95c20816317.jpg';

export function ReportsSidebar() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <aside className="mt-3 flex flex-col gap-[17px]">
      {/* Need a report */}
      <div className="relative rounded-xl border border-[#ecdcb8] bg-[#fffdf9] px-[46px] pb-4 pt-3 text-center shadow-[0_3px_14px_rgba(15,35,82,0.05)]">
        <CornerOrnament className="left-[5px] top-[5px] -scale-x-100" />
        <CornerOrnament className="right-[5px] top-[5px]" />
        <CornerOrnament className="bottom-[5px] left-[5px] -scale-100" />
        <CornerOrnament className="bottom-[5px] right-[5px] -scale-y-100" />

        <CrossIcon className="mx-auto mb-1.5 mt-0.5 h-14 w-auto" />

        <h2 className="mb-3 font-['Playfair_Display',serif] text-[25px] font-bold leading-[1.2] text-[#0f2352]">
          {am ? 'የተወሰነ ሪፖርት ይፈልጋሉ?' : 'Need a Specific Report?'}
        </h2>
        <p className="mb-3 text-[15px] leading-[1.35] text-[#1c2740]">
          {am
            ? 'የሚፈልጉትን ሪፖርት ማግኘት ካልቻሉ እባክዎ የቤተክርስቲያኒቱን አስተዳደር ያነጋግሩ።'
            : 'If you can’t find the report you’re looking for, please contact the church administration.'}
        </p>

        <Link
          href="/contact"
          className="mx-auto flex max-w-[202px] items-center justify-center gap-3 rounded-full border-[1.5px] border-[#dcc08a] bg-[#fffbf1] p-[9px] font-[Inter,sans-serif] text-[12.5px] font-medium text-[#b9852a] transition hover:bg-[#fff4d9]"
        >
          <MailIcon className="h-5 w-5" />
          {am ? 'አስተዳደሩን ያነጋግሩ' : 'Contact Admin'}
        </Link>

        <Divider className="mx-auto mt-4 w-[84px]" />
      </div>

      {/* Quote card */}
      <div
        className="relative flex h-[263px] items-end justify-center overflow-hidden rounded-xl bg-cover bg-center text-center"
        style={{ backgroundImage: `url('${QUOTE_IMAGE}')` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(transparent_38%,rgba(247,241,230,.92)_62%)]" />
        <div className="relative z-10 px-[30px] pb-4 font-['Crimson_Text',serif] text-[18px] italic leading-[1.35] text-[#26385a]">
          {am
            ? '“እግዚአብሔር ቤተክርስቲያኑን በንጹሕ ልብ የሚያገለግሉትን ሁሉ ይባርክ።”'
            : '“May the Lord bless all who serve His Church with a pure heart.”'}
          <Divider className="mx-auto mt-2.5 w-[140px]" />
        </div>
      </div>
    </aside>
  );
}