'use client';

/**
 * AboutHero.tsx — Editorial hero on deep forest navy with glance stats card.
 * Exact layout from Tewahedo HTML design.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export function AboutHero() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <>
      <section className="about-hero">
        <div className="c">
          <svg className="pat" viewBox="0 0 640 520" aria-hidden="true">
            <rect width="640" height="520" fill="url(#lat)" />
          </svg>
          <div className="hero-text">
            <nav aria-label="Breadcrumb" className="crumbs">
              <Link href="/" className="hover:underline">
                {am ? 'መነሻ' : 'Home'}
              </Link>
              <span>/</span>
              <b>{am ? 'ስለ እኛ' : 'About'}</b>
            </nav>
            <h1>
              {am ? (
                <>
                  ስለ <em>እኛ</em>
                </>
              ) : (
                <>
                  About <em>Us</em>
                </>
              )}
            </h1>
            <p>
              {am
                ? 'እምነታችን። ተልዕኳችን። ማኅበረሰባችን።'
                : 'Our Faith. Our Mission. Our Community.'}
            </p>
          </div>
          <div className="glance">
            <h4>{am ? 'በጨረፍታ' : 'At a glance'}</h4>
            <div className="row">
              <span>{am ? 'የተቋቋመው' : 'Serving since'}</span>
              <b>1998</b>
            </div>
            <div className="row">
              <span>{am ? 'የሰንበት ት/ቤት ተማሪዎች' : 'Sunday School students'}</span>
              <b>200+</b>
            </div>
            <div className="row">
              <span>{am ? 'ንቁ አገልግሎቶች' : 'Active ministries'}</span>
              <b>4</b>
            </div>
          </div>
        </div>
      </section>
      <div className="about-ribbon" aria-hidden="true" />
    </>
  );
}
