'use client';

/**
 * WeeklyScheduleTable.tsx
 *
 * Clean table of weekly church services with day badges and scripture quote.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

interface ScheduleRow {
  day: string;
  dayAm: string;
  time: string;
  service: string;
  serviceAm: string;
  location: string;
  type: 'weekly' | 'special';
}

const SCHEDULE_DATA: ScheduleRow[] = [
  { day: 'Sunday', dayAm: 'እሑድ', time: '8:00 – 9:00 AM', service: 'Morning Prayer', serviceAm: 'የጠዋት ጸሎት', location: 'Church Grounds, Addis Ababa', type: 'weekly' },
  { day: 'Sunday', dayAm: 'እሑድ', time: '9:00 – 10:00 AM', service: 'Holy Liturgy (Mass)', serviceAm: 'ቅዳሴ (ቅድስት ቁርባን)', location: 'Church Grounds, Addis Ababa', type: 'weekly' },
  { day: 'Tuesday', dayAm: 'ማክሰኞ', time: '3:00 – 4:00 PM', service: 'Bible Study & Teaching', serviceAm: 'መጽሐፍ ቅዱስ ጥናትና ትምህርት', location: 'Church Hall 1', type: 'weekly' },
  { day: 'Wednesday', dayAm: 'ረቡዕ', time: '3:00 – 4:00 PM', service: 'Vespers (Evening Prayer)', serviceAm: 'ማህሌት (የምሽት ጸሎት)', location: 'Church Hall 1', type: 'weekly' },
  { day: 'Thursday', dayAm: 'ሐሙስ', time: '3:00 – 4:00 PM', service: 'Youth Fellowship', serviceAm: 'የወጣቶች ኅብረት', location: 'Church Hall 2', type: 'weekly' },
  { day: 'Friday', dayAm: 'ዓርብ', time: '3:00 – 4:00 PM', service: 'Confession & Spiritual Guidance', serviceAm: 'ኑዛዜና መንፈሳዊ ምክር', location: 'Church Hall 2', type: 'weekly' },
  { day: 'Saturday', dayAm: 'ቅዳሜ', time: '3:00 – 4:00 PM', service: 'Choir Practice', serviceAm: 'የዝማሬ ልምምድ', location: 'Church Hall 3', type: 'weekly' },
  { day: 'Saturday', dayAm: 'ቅዳሜ', time: '8:00 – 10:00 AM', service: 'Special Prayer Service', serviceAm: 'ልዩ የጸሎት አገልግሎት', location: 'Church Grounds, Addis Ababa', type: 'special' },
];

interface Props {
  filter?: string;
}

export function WeeklyScheduleTable({ filter = 'all' }: Props) {
  const { locale } = useAppStore();

  const filteredData = filter === 'all'
    ? SCHEDULE_DATA
    : filter === 'weekly'
      ? SCHEDULE_DATA.filter((r) => r.type === 'weekly')
      : filter === 'special'
        ? SCHEDULE_DATA.filter((r) => r.type === 'special')
        : SCHEDULE_DATA;

  return (
    <section className="bg-white rounded-xl p-7 border border-[#E3EEF8] shadow-[0_4px_12px_rgba(30,42,94,0.03)]">
      {/* Header Row */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] bg-[#E3EEF8] rounded-lg flex items-center justify-center text-lg text-[#1E2A5E]">
            📅
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#1E2A5E] leading-tight">
              {locale === 'am' ? 'ሳምንታዊ የአገልግሎት መርሐ ግብር' : 'Weekly Service Schedule'}
            </h3>
            <p className="text-xs text-[#44506B]">
              {locale === 'am'
                ? 'በሳምንቱ ውስጥ ለሚደረጉ መደበኛ አገልግሎቶቻችን ይምጡ።'
                : 'Join us for our regular services throughout the week.'}
            </p>
          </div>
        </div>
        <p className="italic text-xs text-[#8A6414] text-right max-w-[320px]">
          {locale === 'am'
            ? '"ሁለት ወይም ሦስት በስሜ በሚሰበሰቡበት እኔ በመካከላቸው እገኛለሁ።" — ማቴዎስ 18:20'
            : '"For where two or three are gathered in my name, there am I among them." — Matthew 18:20'}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#F4F8FC]">
              <th className="text-[#1E2A5E] text-[13px] font-bold py-3 px-4 border-b-2 border-[#E3EEF8]">
                {locale === 'am' ? 'ቀን' : 'Day'}
              </th>
              <th className="text-[#1E2A5E] text-[13px] font-bold py-3 px-4 border-b-2 border-[#E3EEF8]">
                {locale === 'am' ? 'ሰዓት' : 'Time'}
              </th>
              <th className="text-[#1E2A5E] text-[13px] font-bold py-3 px-4 border-b-2 border-[#E3EEF8]">
                {locale === 'am' ? 'አገልግሎት' : 'Service'}
              </th>
              <th className="text-[#1E2A5E] text-[13px] font-bold py-3 px-4 border-b-2 border-[#E3EEF8]">
                {locale === 'am' ? 'ቦታ' : 'Location'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr key={`${row.day}-${row.time}-${i}`} className="hover:bg-[#E3EEF8]/30 transition">
                <td className="py-3.5 px-4 border-b border-[#EDF2F7] text-[13px]">
                  <span className="bg-[#E3EEF8] text-[#1E2A5E] px-2.5 py-1 rounded-md text-xs font-bold inline-block">
                    {locale === 'am' ? row.dayAm : row.day}
                  </span>
                </td>
                <td className="py-3.5 px-4 border-b border-[#EDF2F7] text-[13px] text-[#44506B]">
                  {row.time}
                </td>
                <td className="py-3.5 px-4 border-b border-[#EDF2F7] text-[13px] font-bold text-[#1E2A5E]">
                  {locale === 'am' ? row.serviceAm : row.service}
                </td>
                <td className="py-3.5 px-4 border-b border-[#EDF2F7] text-[13px] text-[#44506B]">
                  📍 {row.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
