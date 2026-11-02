'use client';

/**
 * EventWidget.tsx
 *
 * "Upcoming Events" card matching the structure:
 * - Highlighted first event (Meskel Celebration) with deep navy date badge and gold "Read More" button.
 * - Subsequent events with date badges and trailing arrow.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import type { ChurchEvent } from '@/types/event';

const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface EventRow {
  badgeMonth: string;
  badgeDay: string;
  dayOfWeek?: string;
  title: string;
  titleAm?: string;
  place: string;
  placeAm?: string;
}

const FALLBACK_EVENTS: EventRow[] = [
  {
    badgeMonth: 'SEP',
    badgeDay: '15',
    dayOfWeek: 'TUE',
    title: 'Meskel Celebration',
    titleAm: 'የመስቀል ደመራ በዓል',
    place: 'Church Hall',
    placeAm: 'የቤተክርስቲያን አዳራሽ',
  },
  {
    badgeMonth: 'OCT',
    badgeDay: '09',
    dayOfWeek: 'SUN',
    title: 'Youth Fellowship',
    titleAm: 'የወጣቶች ሕብረት ጉባኤ',
    place: 'Church Hall',
    placeAm: 'አዳራሽ 2',
  },
  {
    badgeMonth: 'OCT',
    badgeDay: '06',
    dayOfWeek: 'WED',
    title: 'Bible Study & Teaching',
    titleAm: 'የመጽሐፍ ቅዱስ ጥናትና ትምህርት',
    place: 'Church Hall',
    placeAm: 'አዳራሽ 1',
  },
  {
    badgeMonth: 'OCT',
    badgeDay: '05',
    dayOfWeek: 'FRI',
    title: 'Confession & Spiritual Guidance',
    titleAm: 'የንስሐና መንፈሳዊ ምክር አገልግሎት',
    place: 'Church Hall',
    placeAm: 'አዳራሽ 3',
  },
];

interface Props {
  events?: ChurchEvent[];
  event?: ChurchEvent | null;
  isLoading?: boolean;
}

export function EventWidget({ events, event, isLoading = false }: Props) {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  // Map real events if provided, else use fallback
  const source = events?.length ? events : event ? [event] : [];
  const rows: EventRow[] = source.length
    ? source.map((e) => {
        const d = new Date(e.startDate);
        return {
          badgeMonth: MON[d.getMonth()] ?? 'SEP',
          badgeDay: String(d.getDate()).padStart(2, '0'),
          dayOfWeek: DAYS[d.getDay()] ?? 'SUN',
          title: e.title,
          titleAm: e.title,
          place: e.location || 'Church Hall',
          placeAm: e.location || 'የቤተክርስቲያን አዳራሽ',
        };
      })
    : FALLBACK_EVENTS;

  const [featured, ...others] = rows.length > 0 ? rows : FALLBACK_EVENTS;

  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C99A3B] block mb-1">
            {isAm ? 'መርሐ ግብር' : 'MARK YOUR CALENDAR'}
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F1B3E]">
            {isAm ? 'የሚመጡ መርሐ ግብሮች' : 'Upcoming Events'}
          </h2>
        </div>
        <Link
          href="/events"
          className="text-xs font-semibold text-[#505E7B] hover:text-[#C99A3B] transition-colors"
        >
          {isAm ? 'ሁሉንም ይመልከቱ' : 'View All'} →
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(15,27,62,0.04)] p-4 sm:p-5 flex flex-col justify-between flex-1">
        {isLoading || !featured ? (
          <div className="space-y-3 py-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-[#F5F2EB]" />
            ))}
          </div>
        ) : (
          <>
            {/* 1. Highlighted First Event (Navy Date Badge + Read More button) */}
            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#EAE6DF] mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Deep Navy Date Badge */}
                <div className="w-12 h-12 rounded-xl bg-[#0F1B3E] text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-[9px] font-bold text-[#C99A3B] leading-none uppercase">
                    {featured.badgeMonth}
                  </span>
                  <span className="text-base font-extrabold text-white leading-none mt-0.5">
                    {featured.badgeDay}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-[13.5px] font-bold text-[#0F1B3E] truncate">
                    {isAm && featured.titleAm ? featured.titleAm : featured.title}
                  </h3>
                  <p className="text-[11px] text-[#7C88A8] truncate mt-0.5">
                    {isAm && featured.placeAm ? featured.placeAm : featured.place}
                  </p>
                </div>
              </div>

              <Link
                href="/events"
                className="px-3.5 py-1.5 rounded-lg bg-[#C99A3B] hover:bg-[#b08328] text-white text-xs font-bold transition shadow-xs shrink-0 cursor-pointer"
              >
                {isAm ? 'ዝርዝር' : 'Read More'}
              </Link>
            </div>

            {/* 2. Remaining Events (3 items) */}
            <div className="divide-y divide-[#F2EFE9]">
              {others.slice(0, 3).map((r, idx) => (
                <Link
                  key={idx}
                  href="/events"
                  className="flex items-center gap-3 py-2.5 sm:py-3 group hover:bg-[#FAF9F5] px-2 rounded-lg transition-colors"
                >
                  {/* Soft Badge */}
                  <div className="w-11 h-10 rounded-lg bg-[#FAF4E6] border border-[#E9D9B2] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-[#A27B2C] leading-none uppercase">
                      {r.dayOfWeek || r.badgeMonth}
                    </span>
                    <span className="text-xs font-bold text-[#0F1B3E] leading-none mt-0.5">
                      {r.badgeDay}
                    </span>
                  </div>

                  {/* Title & Place */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#0F1B3E] truncate group-hover:text-[#C99A3B] transition-colors">
                      {isAm && r.titleAm ? r.titleAm : r.title}
                    </h4>
                    <p className="text-[11px] text-[#7C88A8] truncate">
                      {isAm && r.placeAm ? r.placeAm : r.place}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span className="text-xs text-[#7C88A8] group-hover:text-[#C99A3B] group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
