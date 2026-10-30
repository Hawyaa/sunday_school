'use client';

/**
 * JourneyTimeline.tsx — "A Path of Faith and Service"
 * Features clean white container, header with outline button, and 5 milestone nodes with gold dashed line.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export function JourneyTimeline() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <section className="about-journey" aria-label="Our Journey">
      <div className="c">
        <div className="jbox">
          <div className="jhead">
            <div>
              <div className="eyebrow">
                <i aria-hidden="true" />
                {am ? 'ጉዟችን' : 'Our journey'}
              </div>
              <h2>
                {am ? 'የእምነትና የአገልግሎት መንገድ' : 'A Path of Faith and Service'}
              </h2>
              <p>
                {am
                  ? 'ከቀላል ጅማሬ ወደ ሚያድግ ማኅበረሰብ፤ ጉዟችን የክርስቶስን ብርሃን በሚዲያ፣ በትምህርትና በአገልግሎት ማስፋቱን ቀጥሏል።'
                  : 'Every milestone grew from one aim: keeping the faith alive and within reach of every member of the community.'}
              </p>
            </div>
            <Link href="/about/timeline" className="btn line">
              {am ? 'ታሪካችንን ይመልከቱ →' : 'View Our Timeline →'}
            </Link>
          </div>

          <div className="tl">
            {/* 1998 */}
            <Link href="/about/timeline#y1998" className="group">
              <span className="d">
                <svg width="26" height="26" aria-hidden="true">
                  <use href="#x" />
                </svg>
              </span>
              <b>1998</b>
              <h3>{am ? 'ጅማሬው' : 'The Beginning'}</h3>
              <p>
                {am
                  ? 'የመጀመሪያው መንፈሳዊ ትምህርት ምዕመናንን በጸሎት ሰበሰበ።'
                  : 'First teachings gathered the faithful in prayer and study.'}
              </p>
            </Link>

            {/* 2006 */}
            <Link href="/about/timeline#y2006" className="group">
              <span className="d">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <path d="M8 20h8M12 16v4" />
                </svg>
              </span>
              <b>2006</b>
              <h3>{am ? 'ዲጂታል መድረክ' : 'Digital Platform'}</h3>
              <p>
                {am
                  ? 'ትምህርቶችና ዜናዎች በዓለም ዙሪያ ላሉ ምዕመናን ደረሱ።'
                  : 'Teachings and news reached members everywhere.'}
              </p>
            </Link>

            {/* 2012 */}
            <Link href="/about/timeline#y2012" className="group">
              <span className="d">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
                  <path d="M4 21V5" />
                </svg>
              </span>
              <b>2012</b>
              <h3>{am ? 'ይዘት ማስፋፋት' : 'Content Expansion'}</h3>
              <p>
                {am
                  ? 'ዝማሬዎች፣ የመጽሐፍ ቅዱስ ጥናትና የቤተ መጻሕፍት ሀብቶች ታከሉ።'
                  : 'Hymns, scripture study and library resources added.'}
              </p>
            </Link>

            {/* 2020 */}
            <Link href="/about/timeline#y2020" className="group">
              <span className="d">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
                </svg>
              </span>
              <b>2020</b>
              <h3>{am ? 'ዘመናዊ መድረክ' : 'Modern Platform'}</h3>
              <p>
                {am
                  ? 'ለአገልግሎቶች፣ ዝግጅቶችና ወጣቶች አዲስ መንፈሳዊ ቤት።'
                  : 'A new home for services, events and youth programs.'}
              </p>
            </Link>

            {/* 2024 */}
            <Link href="/about/timeline#y2024" className="group">
              <span className="d">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="8" r="3" />
                  <circle cx="17" cy="9" r="2.4" />
                  <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 1.6 6 5.5" />
                </svg>
              </span>
              <b>2024</b>
              <h3>{am ? 'አብሮ ማደግ' : 'Growing Together'}</h3>
              <p>
                {am
                  ? 'ተጨማሪ ቤተሰቦች፣ በርካታ አገልግሎቶች፣ አንድ ማኅበረሰብ።'
                  : 'More families, more ministries, one community.'}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
