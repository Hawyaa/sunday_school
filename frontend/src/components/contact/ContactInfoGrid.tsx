'use client';

/**
 * ContactInfoGrid.tsx
 *
 * 4 cards displaying physical address, phone numbers, digital channels, and working hours.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export function ContactInfoGrid() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  const cards = [
    {
      icon: '📍',
      titleEn: 'Main Office',
      titleAm: 'ዋና ቢሮ',
      detail1: isAm ? 'አዲስ አበባ፣ ኢትዮጵያ' : 'Addis Ababa, Ethiopia',
      detail2: isAm ? 'ቅዱስ ዑራኤል ቤተክርስቲያን አካባቢ' : 'Around St. Urael Church Parish',
      subtext: isAm ? 'ማዕከላዊ የአስተዳደር ቢሮ' : 'Central Parish Administration',
    },
    {
      icon: '📞',
      titleEn: 'Phone Numbers',
      titleAm: 'ስልክ ቁጥሮች',
      detail1: '+251 911 123 456',
      detail2: '+251 115 555 777',
      subtext: isAm ? 'ከሰኞ - አርብ፡ 2:30 - 11:30' : 'Mon - Fri: 8:30 AM - 5:30 PM',
    },
    {
      icon: '✈️',
      titleEn: 'Digital Channels',
      titleAm: 'ዲጂታል አድራሻዎች',
      detail1: 't.me/abune_media',
      detail2: 'contact@abunemedia.org',
      subtext: isAm ? '24/7 ፈጣን መረጃና ማህበራዊ ሚዲያ' : '24/7 Channel & Direct Email',
    },
    {
      icon: '🕒',
      titleEn: 'Working Hours',
      titleAm: 'የሥራ ሰዓት',
      detail1: isAm ? 'ሰኞ - አርብ፡ 2:30 - 11:30' : 'Mon - Fri: 8:30 AM - 5:30 PM',
      detail2: isAm ? 'ቅዳሜ፡ 2:30 - 7:00' : 'Saturday: 8:30 AM - 1:00 PM',
      subtext: isAm ? 'እሑድ፡ የቅዳሴ አገልግሎት ብቻ' : 'Sunday: Liturgical Services Only',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-6 border border-[#E3EEF8] hover:border-[#C99A3B] transition-all shadow-[0_2px_8px_rgba(30,42,94,0.03)] hover:shadow-[0_8px_20px_rgba(30,42,94,0.08)] hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#E3EEF8] border border-[#C99A3B]/40 flex items-center justify-center text-2xl mb-4">
              {card.icon}
            </div>
            <h3 className="text-base font-extrabold text-[#1E2A5E] mb-2">
              {isAm ? card.titleAm : card.titleEn}
            </h3>
            <p className="text-sm font-semibold text-[#1E2A5E] leading-relaxed">
              {card.detail1}
            </p>
            <p className="text-sm text-[#44506B] leading-relaxed">
              {card.detail2}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E3EEF8]/80 text-xs font-medium text-[#8A6414]">
            {card.subtext}
          </div>
        </div>
      ))}
    </div>
  );
}
