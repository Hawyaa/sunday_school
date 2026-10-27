'use client';

/** TeachingsLessonCard.tsx — one teaching row: thumbnail, title, summary, meta, Watch / Listen. */

import React from 'react';
import Link from 'next/link';
import { TIcon } from './TeachingsIcons';

export interface TeachingLesson {
  id: string | number;
  title: string;
  description: string;
  speaker: string;
  date: string;      // ISO date, e.g. "2025-01-30"
  minutes: number;
  category: string;
  image: string;
  href?: string;
}

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function TeachingsLessonCard({ item }: { item: TeachingLesson }) {
  const href = item.href ?? `/teachings/${item.id}`;
  return (
    <article className="mb-2.5 grid grid-cols-[120px_1fr] items-center gap-3.5 rounded-xl border border-[#ece5d8] bg-[#fffdf9] py-2.5 pl-2.5 pr-3 shadow-[0_2px_10px_rgba(15,35,82,.05)] md:grid-cols-[168px_1fr_auto_18px] md:gap-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-20 w-[120px] rounded-md object-cover md:h-[95px] md:w-[168px]" />

      <div className="min-w-0 font-['Crimson_Text',serif]">
        <h3 className="text-[19px] font-semibold leading-[1.2] text-[#0f2352]">{item.title}</h3>
        <p className="mb-[9px] mt-1 max-w-[440px] text-[14.5px] leading-[1.3] text-[#35609a] line-clamp-2">{item.description}</p>
        <div className="flex flex-wrap items-center gap-x-9 gap-y-1 text-[13.5px] text-[#34476b]">
          <span className="flex items-center gap-[9px]"><TIcon name="user" solid className="h-[15px] w-[15px] text-[#35609a]" />{item.speaker}</span>
          <span className="flex items-center gap-[9px]"><TIcon name="cal" className="h-[15px] w-[15px] text-[#35609a]" />{fmtDate(item.date)}</span>
          <span className="flex items-center gap-[9px]"><TIcon name="clock" className="h-[15px] w-[15px] text-[#35609a]" />{item.minutes} min</span>
        </div>
      </div>

      <Link href={href} className="col-span-2 flex w-[181px] items-center gap-3.5 justify-self-start rounded-full border-[1.5px] border-[#dcc08a] bg-[#fffbf1] py-2 pl-[26px] pr-[18px] font-['Crimson_Text',serif] text-sm text-[#b9852a] md:col-span-1 md:justify-self-auto">
        <span className="grid h-[15px] w-[15px] place-items-center rounded-full bg-[#b9852a] text-white"><TIcon name="play" solid className="h-[7px] w-[7px]" /></span>
        Watch / Listen
        <TIcon name="chr" className="ml-auto h-[11px] w-[11px]" />
      </Link>
      <TIcon name="chr" className="hidden h-[11px] w-[11px] text-[#d9a84a] md:block" />
    </article>
  );
}