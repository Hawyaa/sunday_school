'use client';

/**
 * AnnouncementsCard.tsx
 *
 * "Latest Announcements" card with a large warm candlelit image panel beside the list.
 * Date badges, title, short description, and arrow.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import type { Announcement } from '@/types/announcement';
import { Cross } from './Cross';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Feast of the Holy Cross Preparation',
    summary: 'Join our weekly preparation sessions and spiritual reflection.',
    content: '',
    category: 'Feasts',
    isPinned: false,
    publishedAt: '2026-10-10T08:00:00.000Z',
    createdAt: '2026-10-10T08:00:00.000Z',
  },
  {
    id: '2',
    title: 'New Sunday School Semester Registration',
    summary: 'Registration is now open for children and youth classes.',
    content: '',
    category: 'Sunday School',
    isPinned: false,
    publishedAt: '2026-10-08T08:00:00.000Z',
    createdAt: '2026-10-08T08:00:00.000Z',
  },
  {
    id: '3',
    title: 'Community Charity & Outreach Program',
    summary: 'Support our parish charity mission to assist families in need.',
    content: '',
    category: 'Charity',
    isPinned: false,
    publishedAt: '2026-10-07T08:00:00.000Z',
    createdAt: '2026-10-07T08:00:00.000Z',
  },
];

interface Props {
  items: Announcement[];
  isLoading?: boolean;
}

export function AnnouncementsCard({ items, isLoading = false }: Props) {
  const { locale } = useAppStore();
  const isAm = locale === 'am';
  const list = (items.length > 0 ? items : FALLBACK_ANNOUNCEMENTS).slice(0, 3);

  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C99A3B] block mb-1">
            {isAm ? 'ወቅታዊ መረጃ' : 'STAY INFORMED'}
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F1B3E]">
            {isAm ? 'የቅርብ ጊዜ ማስታወቂያዎች' : 'Latest Announcements'}
          </h2>
        </div>
        <Link
          href="/announcements"
          className="text-xs font-semibold text-[#505E7B] hover:text-[#C99A3B] transition-colors"
        >
          {isAm ? 'ሁሉንም ይመልከቱ' : 'View All'} →
        </Link>
      </div>

      {/* Main Card with Left Image Panel */}
      <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(15,27,62,0.04)] overflow-hidden grid grid-cols-1 sm:grid-cols-[160px_1fr] md:grid-cols-[180px_1fr] flex-1">
        {/* Left Glowing Cross Panel */}
        <div className="relative min-h-[160px] sm:min-h-full bg-[#180A03] overflow-hidden flex items-center justify-center p-6">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,140,30,0.55)_0%,rgba(160,80,10,0.25)_45%,transparent_75%)]"
          />
          <div className="relative z-10 text-[#FFD875] drop-shadow-[0_0_16px_rgba(255,200,60,0.6)]">
            <Cross className="w-16 h-28" />
          </div>
        </div>

        {/* Right Announcement Rows */}
        <div className="p-4 sm:p-5 flex flex-col justify-center divide-y divide-[#F2EFE9]">
          {isLoading ? (
            <div className="space-y-4 py-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-[#F5F2EB]" />
              ))}
            </div>
          ) : (
            list.map((a) => {
              const d = a.publishedAt ? new Date(a.publishedAt) : new Date();
              const monthStr = MONTHS[d.getMonth()]?.toUpperCase() ?? 'OCT';
              const dayStr = String(d.getDate()).padStart(2, '0');

              return (
                <Link
                  key={a.id}
                  href={`/announcements`}
                  className="flex items-center gap-3.5 py-3 sm:py-3.5 first:pt-1 last:pb-1 group hover:bg-[#FAF9F5] px-2 rounded-lg transition-colors"
                >
                  {/* Date Badge */}
                  <div className="w-11 h-11 rounded-xl bg-[#FAF4E6] border border-[#E9D9B2] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-[#A27B2C] leading-none uppercase">
                      {monthStr}
                    </span>
                    <span className="text-sm font-bold text-[#0F1B3E] leading-none mt-0.5">
                      {dayStr}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-[13px] font-bold text-[#0F1B3E] truncate group-hover:text-[#C99A3B] transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-[11px] text-[#7C88A8] truncate mt-0.5">
                      {a.summary || a.content || 'Click to view announcement details.'}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span className="text-xs text-[#7C88A8] group-hover:text-[#C99A3B] group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
