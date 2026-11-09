'use client';

/**
 * SundaySchoolSection.tsx
 * "Sunday School Journey"
 * Deep navy background with diamond lattice pattern, 3 stats,
 * and elegant scripture quote card on the right.
 */

import React, { useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { useSchoolMotion } from './useAboutMotion';

export function SundaySchoolSection() {
  const { locale } = useAppStore();
  const am = locale === 'am';
  const root = useRef<HTMLElement>(null);
  useSchoolMotion(root);

  return (
    <section ref={root} className="about-school" aria-label="Sunday School">
      <svg className="pat" data-parallax viewBox="0 0 560 560" aria-hidden="true">
        <rect width="560" height="560" fill="url(#lat)" />
      </svg>
      <div className="c">
        <div>
          <div className="eyebrow" data-a="eyebrow">
            <i />
            {am ? 'የሰንበት ትምህርት ቤት' : 'Sunday School'}
          </div>
          <h2 data-a="title">
            {am ? 'የሰንበት ትምህርት ቤት ጉዟችን' : 'Sunday School Journey'}
          </h2>
          <div className="sub" data-a="sub">
            {am ? 'ቀጣዩን ትውልድ ማስተማር' : 'Teaching the next generation'}
          </div>
          <p className="t" data-a="desc">
            {am
              ? 'የሰንበት ትምህርት ቤታችን ሕፃናትና ወጣቶች ቅዱሳት መጻሕፍትን፣ መዝሙራትንና የቤተክርስቲያኗን ትውፊት የሚማሩበትና ከቤተሰቦቻቸው ጋር በእምነት የሚያድጉበት ቅዱስ ስፍራ ነው።'
              : 'Our Sunday School gives children and young people a place to learn scripture, the hymns and the traditions of the Church, and to grow in faith alongside their families.'}
          </p>
          <div className="stats">
            <div data-a="stat">
              <b data-count="200" data-suffix="+">200+</b>
              <span>{am ? 'ተማሪዎች' : 'Students'}</span>
            </div>
            <div data-a="stat">
              <b data-count="20">20</b>
              <span>{am ? 'መምህራን' : 'Teachers'}</span>
            </div>
            <div data-a="stat">
              <b data-count="15">15</b>
              <span>{am ? 'ዓመታት' : 'Years'}</span>
            </div>
          </div>
        </div>

        <div className="sq" data-a="quote">
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
