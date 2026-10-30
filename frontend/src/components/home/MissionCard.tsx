'use client';

/** MissionCard.tsx — "Our Mission" band: cross + text, Faith/Knowledge/Service, St. Athanasius quote. */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Cross } from './Cross';
import { HomeIcon, type HomeIconName } from './HomeIcons';

const PF = { fontFamily: '"Playfair Display", serif' };
const VALUES: { icon: HomeIconName; solid?: boolean; t: string; d: string }[] = [
  { icon: 'book', solid: true, t: 'Faith', d: 'Guided by the teachings of the Church' },
  { icon: 'users', solid: true, t: 'Knowledge', d: 'Learning for a better tomorrow' },
  { icon: 'heart', solid: true, t: 'Service', d: 'Together for a stronger community' },
];

export function MissionCard() {
  const { locale } = useAppStore();

  return (
    <section className="mt-[26px] grid grid-cols-1 items-center gap-[18px] py-[22px] lg:grid-cols-[1.25fr_1.05fr_1fr]">
      <div className="relative pl-[62px]">
        <Cross className="absolute left-0 top-0.5 h-[66px]" />
        <h2 className="mb-1.5 text-[27px] font-bold text-[#0f2352]" style={PF}>{locale === 'am' ? 'ተልዕኳችን' : 'Our Mission'}</h2>
        <p className="mb-3.5 max-w-[280px] text-[10.5px] text-[#39445d]">
          {locale === 'am'
            ? 'አቡነ ሚዲያ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን እምነትን፣ መንፈሳዊ እሴቶችን እና ባህላዊ ቅርሶችን ለማስፋፋት የተፈጠረ ዲጂታል መድረክ ነው።'
            : 'Abune Media is a digital platform created to spread the teachings, spiritual values, and cultural heritage of the Ethiopian Orthodox Tewahedo Church. We aim to connect our community through faith, knowledge, and service.'}
        </p>
        <Link href="/about" className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-[#d3a03c] to-[#b9852a] px-[22px] py-2.5 text-[11px] font-semibold text-white">
          {locale === 'am' ? 'ተጨማሪ ያንብቡ' : 'Learn More'} <HomeIcon name="arrow" className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.t} className="rounded-[10px] bg-[#fffdf9]/70 px-1.5 py-2 text-center">
            <span className="mx-auto mb-1.5 grid h-[42px] w-[42px] place-items-center rounded-full border border-[#f1dcae] bg-gradient-to-b from-[#fcefd6] to-[#f6e3bf] text-[#bf7d17]">
              <HomeIcon name={v.icon} solid={v.solid} className="h-[21px] w-[21px]" />
            </span>
            <b className="block text-[11.5px] font-semibold text-[#0f2352]" style={PF}>{v.t}</b>
            <span className="mt-[3px] block text-[8px] leading-[1.4] text-[#5a6479]">{v.d}</span>
          </div>
        ))}
      </div>

      <div className="relative min-h-[150px] rounded-[10px] bg-[linear-gradient(90deg,rgba(245,238,225,.97)_35%,rgba(245,238,225,.15)),url('https://i.pinimg.com/236x/54/60/fa/5460fadba1fc15124905df442994a08a.jpg')] bg-cover bg-[right_bottom] px-6 py-5 text-[13px] font-semibold italic leading-[1.7] text-[#33466d]" style={PF}>
        “The Church is the mother of us all.”
        <small className="mt-2 block text-[10px] text-[#5a6479]" style={{ fontFamily: 'Inter, sans-serif' }}>— St. Athanasius</small>
        <div className="mt-[22px] flex w-[130px] items-center gap-2" aria-hidden>
          <span className="h-px flex-1 bg-[#c8952f]" /><Cross className="h-[22px]" /><span className="h-px flex-1 bg-[#c8952f]" />
        </div>
      </div>
    </section>
  );
}