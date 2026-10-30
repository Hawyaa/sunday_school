'use client';

/**
 * SundaySchoolSection.tsx  (NEW)
 * "Sunday School Journey" special-focus panel. Add it after MissionVisionSection.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import { PF, Eyebrow, Icon, panel } from './shared';

export function SundaySchoolSection() {
  const { locale } = useAppStore();
  const am = locale === 'am';
  const stats = [
    { icon: 'music', n: '500+', en: 'Students', am: 'ተማሪዎች' },
    { icon: 'users', n: '50+', en: 'Teachers', am: 'መምህራን' },
    { icon: 'bank', n: '12', en: 'Branches', am: 'ቅርንጫፎች' },
  ];

  return (
    <section aria-label="Sunday School" className={`${panel} grid items-center gap-[26px] !p-4 md:grid-cols-[330px_1fr] lg:grid-cols-[330px_1fr_250px]`}>
      <img
        src="https://i.pinimg.com/736x/d5/e8/67/d5e86784cc782e8616d91447b16109fb.jpg"
        alt="Sunday school children reading"
        referrerPolicy="no-referrer"
        className="h-44 w-full rounded-[10px] object-cover"
      />

      <div>
        <Eyebrow>{am ? 'ልዩ ትኩረት' : 'Special Focus'}</Eyebrow>
        <h2 className={`${PF} text-[21px] font-bold text-[#0f2352]`}>{am ? 'የሰንበት ትምህርት ቤት ጉዟችን' : 'Sunday School Journey'}</h2>
        <h4 className={`${PF} mb-2 mt-0.5 text-[13px] font-medium italic text-[#c8952f]`}>{am ? 'የእምነት ዘር መዝራት' : 'Planting the Seeds of Faith'}</h4>
        <p className="mb-3 text-[11.5px] text-[#39445d]">
          {am
            ? 'የሰንበት ትምህርት ቤት መርሐ ግብራችን የተልዕኳችን ልብ ነው። በእምነት፣ በእውቀትና በፍቅር ቀጣዩን ትውልድ ያንጻል። በመስተጋብራዊ ትምህርት፣ በጸሎትና በኅብረት ሕጻናት በክርስቶስና በኢትዮጵያ ኦርቶዶክስ ትውፊት ትምህርት እንዲያድጉ እናግዛለን።'
            : 'Our Sunday School program is at the heart of our mission, nurturing the next generation in faith, knowledge, and love. Through interactive lessons, prayer, and community, we help children grow in the teachings of Christ and the Ethiopian Orthodox tradition.'}
        </p>
        <div className="flex flex-wrap items-center gap-[22px]">
          {stats.map((s) => (
            <div key={s.en} className="flex items-center gap-2.5 text-[11px] text-[#5a6479]">
              <Icon name={s.icon} className="size-[22px] text-[#c8952f]" />
              <span><b className="block text-[13px] text-[#1c2740]">{s.n}</b>{am ? s.am : s.en}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${PF} relative hidden rounded-[14px] bg-[#f2eee6] px-[30px] py-[26px] pb-12 text-[13.5px] italic leading-[1.7] text-[#27406e] lg:block`}>
        {am
          ? '“ሕጻናትን ተዉአቸው፣ ወደ እኔም ይመጡ ዘንድ አትከልክሉአቸው፤ መንግሥተ ሰማያት እንደነዚህ ላሉ ናትና።”'
          : '“Let the children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these.”'}
        <small className="mt-3.5 block font-sans text-[11.5px] not-italic text-[#5a6479]">— {am ? 'ማርቆስ 10፡14' : 'Mark 10:14'}</small>
        <img src="/images/cross.png" alt="" className="absolute bottom-3 right-4 h-[62px] w-[38px] object-contain" />
      </div>
    </section>
  );
}