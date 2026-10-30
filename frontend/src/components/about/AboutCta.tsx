'use client';

/**
 * AboutCta.tsx
 * "Be Part of Our Mission"
 * Elegant call-to-action banner with forest gradient, diamond lattice pattern,
 * and a gold "Get Involved →" button linking to /contact.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export function AboutCta() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <section className="about-cta-section" aria-label="Call to Action">
      <div className="c">
        <div className="box">
          <svg className="pat" viewBox="0 0 360 360" aria-hidden="true">
            <rect width="360" height="360" fill="url(#lat)" />
          </svg>
          <div>
            <h2>{am ? 'የተልዕኳችን አካል ይሁኑ' : 'Be Part of Our Mission'}</h2>
            <p>
              {am
                ? 'በእምነት፣ በትምህርትና በማኅበረሰብ መርሐ ግብሮቻችን ላይ ድጋፍ ያድርጉ። በአንድነት ዘላቂ ተጽዕኖ ማምጣት እንችላለን።'
                : 'Support our work in faith, education and community programs. Together we can make a lasting impact.'}
            </p>
          </div>
          <Link href="/contact" className="btn">
            {am ? 'ይሳተፉ →' : 'Get Involved →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
