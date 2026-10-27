'use client';

/**
 * DailyPrayerTimes.tsx
 *
 * 4 prayer time cards: Morning, Midday, Evening, Night.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

interface PrayerTime {
  icon: string;
  nameEn: string;
  nameAm: string;
  time: string;
  frequencyEn: string;
  frequencyAm: string;
}

const PRAYERS: PrayerTime[] = [
  { icon: '🌅', nameEn: 'Morning Prayer', nameAm: 'የጠዋት ጸሎት', time: '7:00 – 10:00 AM', frequencyEn: '(Every Day)', frequencyAm: '(በየዕለቱ)' },
  { icon: '📖', nameEn: 'Midday Prayer', nameAm: 'የቀትር ጸሎት', time: '10:00 – 12:00 PM', frequencyEn: '(Every Day)', frequencyAm: '(በየዕለቱ)' },
  { icon: '🎵', nameEn: 'Evening Prayer', nameAm: 'የምሽት ጸሎት', time: '5:00 – 7:00 PM', frequencyEn: '(Every Day)', frequencyAm: '(በየዕለቱ)' },
  { icon: '🕯️', nameEn: 'Night Prayer', nameAm: 'የሌሊት ጸሎት', time: '8:00 – 9:00 PM', frequencyEn: '(Every Day)', frequencyAm: '(በየዕለቱ)' },
];

export function DailyPrayerTimes() {
  const { locale } = useAppStore();

  return (
    <section className="bg-white rounded-xl p-7 border border-[#E3EEF8] shadow-[0_4px_12px_rgba(30,42,94,0.02)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-[38px] h-[38px] bg-[#E3EEF8] rounded-lg flex items-center justify-center text-lg text-[#1E2A5E]">
          🕒
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-[#1E2A5E] leading-tight">
            {locale === 'am' ? 'ዕለታዊ የጸሎት ሰዓታት' : 'Daily Prayer Times'}
          </h3>
          <p className="text-xs text-[#44506B]">
            {locale === 'am'
              ? 'ዕለታዊ የጸሎት መርሐ ግብርን ይከተሉ፤ መንፈሳዊ ጉዟችሁን ይቀጥሉ።'
              : 'Follow the daily prayer schedule and keep your spiritual journey.'}
          </p>
        </div>
      </div>

      {/* 4-card grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PRAYERS.map((p) => (
          <div
            key={p.nameEn}
            className="bg-white border border-[#E3EEF8] rounded-xl p-6 text-center flex flex-col items-center justify-center shadow-[0_4px_10px_rgba(30,42,94,0.02)] hover:-translate-y-0.5 transition-transform"
          >
            {/* Icon Circle */}
            <div className="w-14 h-14 bg-[#1E2A5E] border-2 border-[#C99A3B] rounded-full flex items-center justify-center text-[#C99A3B] text-2xl mb-3.5">
              {p.icon}
            </div>
            <h5 className="text-[15px] font-bold text-[#1E2A5E] mb-1">
              {locale === 'am' ? p.nameAm : p.nameEn}
            </h5>
            <div className="text-[13px] font-bold text-[#C99A3B] mb-1.5">{p.time}</div>
            <div className="text-[11px] text-[#44506B] italic">
              {locale === 'am' ? p.frequencyAm : p.frequencyEn}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
