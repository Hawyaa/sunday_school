'use client';

/**
 * ReportsSecurityBanner.tsx
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { ChevronRight, ShieldIcon, UserIcon } from '@/components/reports/icons';

export function ReportsSecurityBanner() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <div className="mt-1 flex flex-wrap items-center gap-5 rounded-xl border border-[#d5e3f3] bg-[#e9f1fa] py-2 pl-[22px] pr-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#dbe6f3] text-[#0f2352]">
        <ShieldIcon className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <b className="block font-[Inter,sans-serif] text-[11.5px] font-medium text-[#0f2352]">
          {am ? 'ለደህንነትና የመረጃ ሚስጥራዊነት ጥበቃ' : 'For Security and Information Privacy Protection'}
        </b>
        <small className="font-[Inter,sans-serif] text-[9.5px] text-[#35609a]">
          {am
            ? 'አንዳንድ ሚስጥራዊ ሰነዶች ሊገኙ የሚችሉት ወደ ተረጋገጠ የአባልነት አካውንትዎ ከገቡ በኋላ ብቻ ነው።'
            : 'Some confidential documents are available only after logging into your verified member account.'}
        </small>
      </div>

      <Link
        href="/admin"
        className="ml-auto flex items-center gap-3 rounded-full bg-[#0f2352] px-[22px] py-[11px] font-[Inter,sans-serif] text-xs font-medium text-white transition hover:bg-[#35609a]"
      >
        <UserIcon className="h-[15px] w-[15px]" />
        {am ? 'ለመድረስ ይግቡ' : 'Login to Access'}
        <ChevronRight className="h-2.5 w-2.5" />
      </Link>
    </div>
  );
}