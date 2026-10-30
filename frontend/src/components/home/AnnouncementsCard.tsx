'use client';

/**
 * AnnouncementsCard.tsx — photo on the left, "Latest Announcements" list with date boxes on the right.
 * Props unchanged: items, isLoading. Falls back to static data.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import type { Announcement } from '@/types/announcement';
import { HomeIcon } from './HomeIcons';

const IMG = 'https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ET = { fontFamily: '"Noto Serif Ethiopic", Inter, sans-serif' };

const FALLBACK: Announcement[] = [
  { id: '1', title: 'የቀን አዲስ መልዕክት', summary: 'በአቡነ ሚዲያ መድረክ ላይ የተጨመሩ አዲስ መርጃዎች ...', content: '', category: '', isPinned: false, publishedAt: '2026-10-10T08:00:00.000Z', createdAt: '2026-10-10T08:00:00.000Z' },
  { id: '2', title: 'New Teaching Resources', summary: 'Our latest teachings and spiritual resources are now available on the platform.', content: '', category: '', isPinned: false, publishedAt: '2026-10-08T08:00:00.000Z', createdAt: '2026-10-08T08:00:00.000Z' },
  { id: '3', title: 'የማኅበር ቅዱሳን አስታወቂያ', summary: 'በአንድነት መገኘት ቅዱሳን ልዩ ዝግጅት መድረኩ ላይ ...', content: '', category: '', isPinned: false, publishedAt: '2026-10-05T08:00:00.000Z', createdAt: '2026-10-05T08:00:00.000Z' },
];

interface Props { items: Announcement[]; isLoading?: boolean }

export function AnnouncementsCard({ items, isLoading = false }: Props) {
  const { locale } = useAppStore();
  const list = (items.length > 0 ? items : FALLBACK).slice(0, 3);

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-[#ece5d8] bg-[#fffdf9] shadow-[0_3px_14px_rgba(15,35,82,.06)] md:grid-cols-[238px_1fr]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={IMG} alt="" referrerPolicy="no-referrer" className="h-[200px] w-full object-cover md:h-full" />
      <div className="px-5 py-[18px]">
        <div className="mb-3 flex items-center gap-2.5">
          <HomeIcon name="mega" solid className="h-5 w-5 text-[#c8952f]" />
          <h3 className="text-[17px] font-semibold text-[#0f2352]" style={{ fontFamily: '"Playfair Display", serif' }}>
            {locale === 'am' ? 'የቅርብ ጊዜ ማስታወቂያዎች' : 'Latest Announcements'}
          </h3>
          <Link href="/announcements" className="ml-auto flex items-center gap-1 text-[9.5px] font-medium text-[#2c5a8f]">
            {locale === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'} <HomeIcon name="arrow" className="h-3 w-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3" aria-busy="true">
            {[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-[#f1ece0]" />)}
          </div>
        ) : (
          list.map((a) => {
            const d = a.publishedAt ? new Date(a.publishedAt) : null;
            return (
              <Link key={a.id} href={`/announcements/${a.id}`} className="grid grid-cols-[44px_1fr_14px] items-center gap-3.5 border-t border-[#ece5d8] py-3">
                <div className="rounded-lg bg-[#e8eef7] py-[5px] text-center text-[9.5px] text-[#2c5a8f]">
                  {d ? MONTHS[d.getMonth()] : '—'}
                  <b className="block text-[17px] font-semibold leading-[1.1] text-[#0f2352]" style={{ fontFamily: '"Playfair Display", serif' }}>{d ? d.getDate() : ''}</b>
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-xs font-semibold text-[#0f2352]" style={ET}>{a.title}</h4>
                  <p className="truncate text-[10.5px] text-[#5a6479]" style={ET}>{a.summary ?? a.content}</p>
                </div>
                <HomeIcon name="chr" className="h-3.5 w-3.5 text-[#0f2352]" />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}