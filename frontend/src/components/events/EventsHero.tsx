'use client';

/**
 * EventsHero.tsx
 *
 * Abune Media Events Hero:
 * - Background image with referrerPolicy="no-referrer"
 * - Cream gradient overlay (#f5eee1, same shade as the About page)
 * - Gold Ethiopian Orthodox cross loaded from /public/images/cross.png
 * - Small gold corner ornament, bottom-left (/public/images/corner-ornament.png)
 * - Breadcrumb: Home › Events
 * - Heading in Playfair Display (58px, #0f2352)
 * - Gold accent bar (50px by 2px, #c8952f)
 * - Right scripture quote: “አግዚአብሔር ይባርከን” — መዝሙር 150:6
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EventIcon } from './EventIcons';

export function EventsHero() {
  return (
    <section className="relative h-[238px] max-md:h-auto max-md:min-h-[250px] overflow-hidden bg-[#e9eef6]">
      {/* Background Hero Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg"
        alt=""
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-[right_center] z-0"
      />

      {/* Gradient Mask Overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, #f5eee1 0%, #f5eee1 38%, rgba(245,238,225,0.55) 56%, rgba(245,238,225,0) 72%)',
        }}
      />

      {/* Bottom-left corner ornament (artwork is a top-right corner, so rotate 180°) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/corner-ornament.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="hidden sm:block absolute bottom-2 left-2 z-[2] w-[80px] lg:w-[100px] -scale-100 mix-blend-multiply select-none pointer-events-none"
      />

      {/* Hero Inner Container */}
      <div className="relative z-10 max-w-[1536px] h-full mx-auto px-4 sm:px-8 lg:px-[70px] max-md:py-6 flex flex-col justify-center">
        <div className="relative h-full flex flex-col justify-center">
          {/* Gold Ethiopian Orthodox Cross (file: public/images/cross.png) */}
          <Image
            src="/images/cross.png"
            alt="Ethiopian Orthodox cross"
            width={213}
            height={420}
            priority
            className="hidden md:block absolute left-0 top-[42px] h-[92px] w-auto drop-shadow-[0_2px_3px_rgba(120,80,10,0.25)] select-none pointer-events-none"
          />

          {/* Left Text Column: Breadcrumb, Title & Subtitle */}
          <div className="md:ml-[73px] flex flex-col justify-center">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[13px] text-[#1c2740] font-medium mb-1.5"
            >
              <Link href="/" className="hover:text-[#0f2352] flex items-center gap-1.5">
                <EventIcon name="home" className="w-3.5 h-3.5 text-[#0f2352]" />
                <span>Home</span>
              </Link>
              <span className="text-[#0f2352] font-semibold">›</span>
              <span className="text-[#0f2352] font-semibold">Events</span>
            </nav>

            {/* Main Title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-[#0f2352] leading-[1.1] mb-2 tracking-tight"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Events
            </h1>

            {/* Subtitle */}
            <p
              className="text-base sm:text-lg lg:text-[19px] text-[#3d4f77] leading-[1.45] max-w-[450px] font-normal"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Join our upcoming spiritual gatherings, feast celebrations and community events.
            </p>

            {/* Gold Accent Bar */}
            <div className="w-[50px] h-[2px] bg-[#c8952f] mt-3" />
          </div>

          {/* Verse on Right */}
          <div
            className="hidden md:block absolute right-4 lg:right-[66px] bottom-[36px] text-right text-white select-none pointer-events-none"
            style={{
              fontFamily: '"Noto Serif Ethiopic", serif',
              textShadow: '0 1px 8px rgba(0,0,0,0.45)',
            }}
          >
            <blockquote className="text-[19px] italic font-medium leading-normal m-0 p-0">
              “አግዚአብሔር ይባርከን”
            </blockquote>
            <cite className="block text-sm not-italic mt-2 text-amber-100 font-sans">
              — መዝሙር 150:6
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
}