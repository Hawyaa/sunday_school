'use client';

/** TeachingsLessonCard.tsx — one teaching row: thumbnail, title, summary, meta, format badge, Watch / Read. */

import React from 'react';
import Link from 'next/link';
import { TIcon } from './TeachingsIcons';
import { DEFAULT_TEACHING_COVER } from '@/types/teaching';

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
  format?: 'pdf' | 'audio' | 'video' | 'both';
  pdfUrl?: string | null;
  pdfFileName?: string | null;
  videoUrl?: string | null;
  audioUrl?: string | null;
}

const fmtDate = (iso: string) => {
  try {
    return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

export function TeachingsLessonCard({ item }: { item: TeachingLesson }) {
  const href = item.href ?? `/teachings/${item.id}`;

  // Determine media badge & action button text based on available media
  const isBoth =
    item.format === 'both' ||
    (Boolean(item.pdfUrl) && Boolean(item.videoUrl || item.audioUrl));
  const isPdf =
    item.format === 'pdf' ||
    (Boolean(item.pdfUrl) && !item.videoUrl && !item.audioUrl);
  const isVideo =
    item.format === 'video' || (Boolean(item.videoUrl) && !item.pdfUrl);
  const isAudio =
    item.format === 'audio' ||
    (Boolean(item.audioUrl) && !item.pdfUrl && !item.videoUrl);

  const formatBadge = isBoth ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#6B21A8]/10 px-2 py-0.5 text-[11px] font-semibold text-[#6B21A8]">
      🎥 Video + 📖 Book
    </span>
  ) : isPdf ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#b9852a]/10 px-2 py-0.5 text-[11px] font-semibold text-[#b9852a]">
      📄 PDF Book
    </span>
  ) : isVideo ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#DC2626]/10 px-2 py-0.5 text-[11px] font-semibold text-[#DC2626]">
      🎥 Video Lecture
    </span>
  ) : isAudio ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#0284C7]/10 px-2 py-0.5 text-[11px] font-semibold text-[#0284C7]">
      🎧 Audio Sermon
    </span>
  ) : null;

  const actionText = isBoth
    ? 'Watch & Read'
    : isPdf
    ? 'Read Document'
    : isAudio
    ? 'Listen Audio'
    : 'Watch / Listen';

  return (
    <article className="mb-2.5 grid grid-cols-[120px_1fr] items-center gap-3.5 rounded-xl border border-[#ece5d8] bg-[#fffdf9] py-2.5 pl-2.5 pr-3 shadow-[0_2px_10px_rgba(15,35,82,.05)] hover:shadow-md transition-shadow md:grid-cols-[168px_1fr_auto_18px] md:gap-6">
      <Link href={href} className="block relative overflow-hidden rounded-md group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image || DEFAULT_TEACHING_COVER}
          alt={item.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-20 w-[120px] rounded-md object-cover md:h-[95px] md:w-[168px] transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="min-w-0 font-['Crimson_Text',serif]">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Link
            href={href}
            className="text-[19px] font-semibold leading-[1.2] text-[#0f2352] hover:text-[#b9852a] transition-colors"
          >
            {item.title}
          </Link>
          {formatBadge}
        </div>
        <p className="mb-[9px] max-w-[440px] text-[14.5px] leading-[1.3] text-[#35609a] line-clamp-2">
          {item.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[13.5px] text-[#34476b]">
          <span className="flex items-center gap-1.5">
            <TIcon name="user" solid className="h-[14px] w-[14px] text-[#35609a]" />
            {item.speaker}
          </span>
          <span className="flex items-center gap-1.5">
            <TIcon name="cal" className="h-[14px] w-[14px] text-[#35609a]" />
            {fmtDate(item.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <TIcon name="clock" className="h-[14px] w-[14px] text-[#35609a]" />
            {item.minutes} min
          </span>
        </div>
      </div>

      <Link
        href={href}
        className="col-span-2 flex w-[181px] items-center gap-2.5 justify-self-start rounded-full border-[1.5px] border-[#dcc08a] bg-[#fffbf1] hover:bg-[#b9852a] hover:text-white group py-2 pl-[20px] pr-[16px] font-['Crimson_Text',serif] text-sm text-[#b9852a] transition-all md:col-span-1 md:justify-self-auto"
      >
        <span className="grid h-[16px] w-[16px] place-items-center rounded-full bg-[#b9852a] group-hover:bg-white text-white group-hover:text-[#b9852a] transition-colors">
          <TIcon name="play" solid className="h-[7px] w-[7px]" />
        </span>
        <span className="font-semibold">{actionText}</span>
        <TIcon name="chr" className="ml-auto h-[11px] w-[11px]" />
      </Link>
      <TIcon name="chr" className="hidden h-[11px] w-[11px] text-[#d9a84a] md:block" />
    </article>
  );
}
