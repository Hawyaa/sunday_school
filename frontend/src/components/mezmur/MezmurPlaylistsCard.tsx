'use client';

/**
 * MezmurPlaylistsCard.tsx
 *
 * Exact implementation of Recent Playlists / Albums card:
 * - Header: # | Recent Playlist / Album | Info | Open
 * - Scrollable body with custom gold scrollbar (max-height 170px)
 * - Row hover effect with sky tint
 * - Click triggers updating the featured lyric text
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export interface PlaylistItem {
  num: number;
  title: string;
  meta: string;
  lyricTitle: string;
  lyricHtml: string;
}

const PLAYLISTS: PlaylistItem[] = [
  {
    num: 1,
    title: 'Ephrem Alemu Top 20',
    meta: '20 Tracks',
    lyricTitle: 'Ephrem Alemu Top 20 (Playlist)',
    lyricHtml:
      '<b>Ephrem Alemu Top 20 Playlist Overview</b><br>1. አቡነ ዘበሰማያት<br>2. ቅዱስ እግዚአብሔር<br>3. እግዚአብሔር ይመስገን<br><i>Total Duration: 1.5 Hours | 20 Tracks</i>',
  },
  {
    num: 2,
    title: 'Sunday School Hymns',
    meta: '20 Tracks',
    lyricTitle: 'Sunday School Hymns (Season)',
    lyricHtml:
      '<b>Sunday School Hymns (Season) Overview</b><br>1. ሰላም ለኪ ማርያም<br>2. ንዒ ሠርግ ንዒ<br><i>Liturgical Chants Collection</i>',
  },
  {
    num: 3,
    title: 'Sunday School (Season)',
    meta: '10 Tracks',
    lyricTitle: 'Sunday School Hymns (Special Categories)',
    lyricHtml:
      '<b>Sunday School (Season Categories)</b><br>Special seasonal hymn arrangement and spiritual choir notes.',
  },
  {
    num: 4,
    title: 'St. Gabriel Church Event',
    meta: 'Ter 19, 2021',
    lyricTitle: 'St. Gabriel Church Event Album',
    lyricHtml:
      '<b>St. Gabriel Church Event Album</b><br>Recorded live on Ter 19, 2021.<br>Cross-linked with choir performance logs.',
  },
];

interface Props {
  onSelect: (title: string, html: string) => void;
}

export function MezmurPlaylistsCard({ onSelect }: Props) {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  return (
    <div className="bg-white rounded-[10px] border border-[#E2E8F0] overflow-hidden shadow-[0_2px_6px_rgba(30,42,94,0.04)]">
      {/* Header */}
      <div className="bg-[#1E2A5E] text-white px-3.5 py-2.5 text-[13px] font-bold grid grid-cols-[28px_1fr_75px_50px] items-center">
        <span>#</span>
        <span>{isAm ? 'የቅርብ ጊዜ አልበሞች' : 'Recent Playlist / Album'}</span>
        <span>{isAm ? 'መረጃ' : 'Info'}</span>
        <span className="text-right">{isAm ? 'ክፈት' : 'Open'}</span>
      </div>

      {/* Scrollable Body */}
      <div className="max-h-[170px] overflow-y-auto divide-y divide-[#F1F5F9]">
        {PLAYLISTS.map((item) => (
          <div
            key={item.num}
            onClick={() => onSelect(item.lyricTitle, item.lyricHtml)}
            className="grid grid-cols-[28px_1fr_75px_50px] items-center px-3.5 py-2 text-xs cursor-pointer hover:bg-[#E3EEF8] transition-colors"
          >
            <span className="font-semibold text-[#2F5D9E]">{item.num}</span>
            <span className="font-semibold text-[#1E2A5E] truncate pr-2">
              {item.title}
            </span>
            <span className="text-[#64748B] text-[11px] truncate">
              {item.meta}
            </span>
            <div className="flex items-center gap-1.5 justify-end text-[#2F5D9E] text-[13px]">
              <span title="Play" className="hover:text-[#1E2A5E]">▶</span>
              <span title="Info" className="hover:text-[#1E2A5E]">ⓘ</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
