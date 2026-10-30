'use client';

/**
 * MezmurTopTracksCard.tsx
 *
 * Exact implementation of Scrollable Mezmur Top Tracks:
 * - Header: # | Track Title | Duration | Play
 * - Scrollable body with custom scrollbar
 * - Click triggers updating the featured lyric text
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export interface TrackRow {
  num: number;
  title: string;
  duration: string;
  lyricTitle: string;
  lyricHtml: string;
}

const TOP_TRACKS: TrackRow[] = [
  {
    num: 1,
    title: 'Ephrem Alemu - አቡነ ዘበሰማያት',
    duration: '2:59',
    lyricTitle: 'አቡነ ዘበሰማያት (Our Father)',
    lyricHtml:
      '<p>አቡነ ዘበሰማያት፡ ይትቀደስ ስምከ።</p><p>ትምጻእ መንግሥትከ። ወይኩን ፈቃድከ</p><p>በሰማይ መሬትኒ። ሲዖል አትረፍርፍ...</p><p>ሲዖል አትረፍርፍ ወአድኅነን ከመ ጽድቅነ።</p>',
  },
  {
    num: 2,
    title: 'St. Gabriel Sunday - ሰላም ለኪ ማርያም',
    duration: '4:59',
    lyricTitle: 'St. Gabriel Sunday - ሰላም ለኪ ማርያም',
    lyricHtml:
      '<p>ሰላም ለኪ ማርያም እግዚአብሔር ምስሌኪ።</p><p>ቡርክት አንቲ እምአንስት</p><p>ወቡሩክ ፍሬ ከርሥኪ...</p>',
  },
  {
    num: 3,
    title: 'Sunday School - እግዚአብሔር ይመስገን',
    duration: '4:26',
    lyricTitle: 'Sunday School - እግዚአብሔር ይመስገን',
    lyricHtml:
      '<p>እግዚአብሔር ይመስገን በሰማያት</p><p>መንግሥቱ ኑላዊ ናሁ ለአለም</p><p>አዘምር ወእሰብክ ስምከ...</p>',
  },
  {
    num: 4,
    title: 'Ephrem Alemu - ቅዱስ እግዚአብሔር',
    duration: '3:40',
    lyricTitle: 'Ephrem Alemu - ቅዱስ እግዚአብሔር',
    lyricHtml:
      '<p>ቅዱስ እግዚአብሔር ቅዱስ ኃያል</p><p>ቅዱስ ሕያው ዘኢይመውት</p><p>ዘተወልደ እምቅድስት ድንግል...</p>',
  },
  {
    num: 5,
    title: 'St. Gabriel Choir - ንዒ ሠርግ ንዒ',
    duration: '5:12',
    lyricTitle: 'St. Gabriel Choir - ንዒ ሠርግ ንዒ',
    lyricHtml:
      '<p>ንዒ ሠርግ ንዒ እም መርዓዊኪ</p><p>ክርስቶስ ማኅደረ መለኮት</p><p>ንዒ ኃቤነ ንዒ በሰላም...</p>',
  },
];

interface Props {
  onSelect: (title: string, html: string) => void;
}

export function MezmurTopTracksCard({ onSelect }: Props) {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  return (
    <div className="bg-white rounded-[10px] border border-[#E2E8F0] overflow-hidden shadow-[0_2px_6px_rgba(30,42,94,0.04)]">
      {/* Header */}
      <div className="bg-[#1E2A5E] text-white px-3.5 py-2.5 text-[13px] font-bold grid grid-cols-[28px_1fr_65px_45px] items-center">
        <span>#</span>
        <span>{isAm ? 'የመዝሙር ርዕስ' : 'Track Title'}</span>
        <span>{isAm ? 'ርዝመት' : 'Duration'}</span>
        <span className="text-right">{isAm ? 'አጫውት' : 'Play'}</span>
      </div>

      {/* Scrollable Body */}
      <div className="max-h-[170px] overflow-y-auto divide-y divide-[#F1F5F9]">
        {TOP_TRACKS.map((track) => (
          <div
            key={track.num}
            onClick={() => onSelect(track.lyricTitle, track.lyricHtml)}
            className="grid grid-cols-[28px_1fr_65px_45px] items-center px-3.5 py-2 text-xs cursor-pointer hover:bg-[#E3EEF8] transition-colors"
          >
            <span className="font-semibold text-[#2F5D9E]">{track.num}</span>
            <span className="font-semibold text-[#1E2A5E] truncate pr-2">
              {track.title}
            </span>
            <span className="text-[#64748B] text-[11px]">
              {track.duration}
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
