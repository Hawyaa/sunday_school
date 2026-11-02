'use client';

/**
 * SundaySchoolSection.tsx
 * "Sunday School Journey"
 * Deep navy background with diamond lattice pattern, 3 stats,
 * and elegant scripture quote card on the right.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export function SundaySchoolSection() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <section className="about-school" aria-label="Sunday School">
      <svg className="pat" viewBox="0 0 560 560" aria-hidden="true">
        <rect width="560" height="560" fill="url(#lat)" />
      </svg>
      <div className="c">
        <div>
          <div className="eyebrow">
            <i />
            {am ? 'የሰንበት ትምህርት ቤት' : 'Sunday School'}
          </div>
          <h2>
            {am ? 'የሰንበት ትምህርት ቤት ጉዟችን' : 'Sunday School Journey'}
          </h2>
          <div className="sub">
            {am ? 'ቀጣዩን ትውልድ ማስተማር' : 'Teaching the next generation'}
          </div>
          <p className="t">
            {am
              ? 'የሰንበት ትምህርት ቤታችን ሕፃናትና ወጣቶች ቅዱሳት መጻሕፍትን፣ መዝሙራትንና የቤተክርስቲያኗን ትውፊት የሚማሩበትና ከቤተሰቦቻቸው ጋር በእምነት የሚያድጉበት ቅዱስ ስፍራ ነው።'
              : 'Our Sunday School gives children and young people a place to learn scripture, the hymns and the traditions of the Church, and to grow in faith alongside their families.'}
          </p>
          <div className="stats">
            <div>
              <b>200+</b>
              <span>{am ? 'ተማሪዎች' : 'Students'}</span>
            </div>
            <div>
              <b>20</b>
              <span>{am ? 'መምህራን' : 'Teachers'}</span>
            </div>
            <div>
              <b>15</b>
              <span>{am ? 'ዓመታት' : 'Years'}</span>
            </div>
          </div>
        </div>

        <div className="sq">
          <span className="qm">“</span>
          <q>
            {am
              ? 'ሕፃናትን ተዉአቸው፥ ወደ እኔም ይመጡ ዘንድ አትከልክሉአቸው፤'
              : 'Let the little children come to me, and do not hinder them.'}
          </q>
          <cite>{am ? 'ማርቆስ 10፡14' : 'Mark 10:14'}</cite>
        </div>
      </div>
    </section>
  );
}
