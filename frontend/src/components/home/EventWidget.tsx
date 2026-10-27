'use client';

/**
 * EventWidget.tsx — "Upcoming Events" panel: 1 featured event + up to 3 smaller rows.
 * Props: events (list, preferred) or event (single, still supported), isLoading.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import type { ChurchEvent } from '@/types/event';
import { HomeIcon } from './HomeIcons';

const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const IMG = 'https://i.pinimg.com/736x/d5/e8/67/d5e86784cc782e8616d91447b16109fb.jpg';
const PF = { fontFamily: '"Playfair Display", serif' };

interface Row { month: string; day: string; year: string; title: string; place: string }

const FALLBACK: Row[] = [
  { month: 'NOV', day: '15', year: '2026', title: 'Meskel Celebration', place: 'Church Grounds, Addis Ababa' },
  { month: 'NOV', day: '22', year: '2026', title: 'Youth Fellowship', place: 'Church Hall 2' },
  { month: 'NOV', day: '28', year: '2026', title: 'Bible Study & Teaching', place: 'Church Hall 1' },
  { month: 'DEC', day: '5', year: '2026', title: 'Confession & Spiritual Guidance', place: 'Church Hall 3' },
];

function toRow(e: ChurchEvent): Row {
  const d = new Date(e.startDate);
  return { month: MON[d.getMonth()] ?? 'NOV', day: String(d.getDate()), year: String(d.getFullYear()), title: e.title, place: e.location ?? 'Church Grounds, Addis Ababa' };
}

interface Props { events?: ChurchEvent[]; event?: ChurchEvent | null; isLoading?: boolean }

export function EventWidget({ events, event, isLoading = false }: Props) {
  const { locale } = useAppStore();
  const source = events?.length ? events : event ? [event] : [];
  const rows = source.length ? source.map(toRow) : FALLBACK;
  const [first, ...rest] = rows;

  return (
    <div className="rounded-xl border border-[#ece5d8] bg-[#fffdf9] px-5 py-[18px] shadow-[0_3px_14px_rgba(15,35,82,.06)]">
      <div className="mb-3 flex items-center gap-2.5">
        <HomeIcon name="cal" className="h-5 w-5 text-[#c8952f]" />
        <h3 className="text-[17px] font-semibold text-[#0f2352]" style={PF}>{locale === 'am' ? 'የሚመጡ መርሐ ግብሮች' : 'Upcoming Events'}</h3>
        <Link href="/events" className="ml-auto flex items-center gap-1 text-[9.5px] font-medium text-[#2c5a8f]">
          {locale === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'} <HomeIcon name="arrow" className="h-3 w-3" />
        </Link>
      </div>

      {isLoading || !first ? (
        <div className="h-40 animate-pulse rounded-lg bg-[#f1ece0]" aria-busy="true" />
      ) : (
        <>
          <div className="mb-3 grid grid-cols-[46px_1fr_96px] items-center gap-3">
            <div className="rounded-[7px] bg-[#0f2352] py-1.5 text-center text-[8.5px] tracking-[.06em] text-white">
              {first.month}<b className="block text-[19px] font-semibold leading-[1.1]" style={PF}>{first.day}</b>{first.year}
            </div>
            <div className="min-w-0">
              <h4 className="mb-[5px] text-sm font-semibold text-[#0f2352]" style={PF}>{first.title}</h4>
              <p className="mb-[3px] flex items-center gap-1.5 text-[9.5px] text-[#5a6479]"><HomeIcon name="clock" className="h-3 w-3 text-[#c8952f]" />8:00 AM – 12:00 PM</p>
              <p className="mb-[3px] flex items-center gap-1.5 truncate text-[9.5px] text-[#5a6479]"><HomeIcon name="pin" className="h-3 w-3 shrink-0 text-[#c8952f]" />{first.place}</p>
              <Link href="/events" className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#d3a03c] to-[#b9852a] px-3.5 py-1.5 text-[9px] font-semibold text-white">
                View Event Details <HomeIcon name="arrow" className="h-3 w-3" />
              </Link>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG} alt="" referrerPolicy="no-referrer" className="h-[70px] w-24 rounded-md object-cover" />
          </div>

          {rest.slice(0, 3).map((r) => (
            <Link key={r.title + r.day} href="/events" className="grid grid-cols-[36px_1fr_14px] items-center gap-3.5 border-t border-[#ece5d8] py-[9px]">
              <div className="rounded-lg bg-[#e8eef7] py-[3px] text-center text-[8px] text-[#2c5a8f]">
                {r.month}<b className="block text-sm font-semibold leading-[1.1] text-[#0f2352]" style={PF}>{r.day}</b>
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-[11px] font-semibold text-[#0f2352]">{r.title}</h4>
                <p className="truncate text-[10.5px] text-[#5a6479]">{r.place}</p>
              </div>
              <HomeIcon name="chr" className="h-3.5 w-3.5 text-[#0f2352]" />
            </Link>
          ))}
        </>
      )}
    </div>
  );
}