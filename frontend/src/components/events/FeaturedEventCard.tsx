'use client';

/**
 * FeaturedEventCard.tsx
 *
 * Abune Media Featured Event Card:
 * - Church image backdrop with dark navy linear fade
 * - Gold Featured Event badge with star icon
 * - Playfair Display title, date + location rows, description, gold 'View Details' button
 */

import React from 'react';
import { EventIcon } from './EventIcons';
import { EVENT_IMAGES } from './EventCard';

interface Props {
  onViewDetails?: () => void;
}

// Uses the 2nd shared image (the 1200px one, sharper for the taller card).
const FEATURED_IMAGE = EVENT_IMAGES[1];

export function FeaturedEventCard({ onViewDetails }: Props) {
  return (
    <aside className="relative overflow-hidden rounded-[10px] text-white bg-[#0f2352] min-h-[470px] shadow-[0_6px_22px_rgba(15,35,82,0.25)] flex flex-col justify-end">
      {/* Top Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FEATURED_IMAGE}
        alt=""
        referrerPolicy="no-referrer"
        className="absolute left-0 top-0 z-0 h-[190px] w-full object-cover object-top"
      />

      {/* Dark Navy Fade Overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(15,35,82,0) 0%, rgba(15,35,82,0) 30px, rgba(15,35,82,0.82) 160px, #0f2352 215px)',
        }}
      />

      {/* Featured Star Badge */}
      <span className="absolute z-10 top-4 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c8952f] text-white text-[11px] font-medium shadow-md">
        <EventIcon name="star" className="w-[13px] h-[13px] text-white" />
        <span>Featured Event</span>
      </span>

      {/* Card Content Body */}
      <div className="relative z-10 px-6 sm:px-[27px] pb-[30px] pt-8 flex flex-col items-start">
        <h2
          className="text-2xl sm:text-[26px] font-bold leading-[1.25] mb-5 text-white"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Holy Week
          <br />
          Special Services
        </h2>

        <div className="flex items-center gap-3 text-[13px] mb-3 text-slate-100">
          <EventIcon name="cal" className="w-4 h-4 text-[#d9a84a] shrink-0" />
          <span>Apr 13 – Apr 20, 2025</span>
        </div>

        <div className="flex items-center gap-3 text-[13px] mb-3 text-slate-100">
          <EventIcon name="pin" className="w-4 h-4 text-[#d9a84a] shrink-0" />
          <span>St. Gabriel Church</span>
        </div>

        <p className="text-[12.5px] leading-[1.7] text-[#d6dcec] my-5 max-w-[260px]">
          Join us for the solemn and spiritually uplifting Holy Week services, as we remember the
          passion, death and resurrection of our Lord Jesus Christ.
        </p>

        <button
          type="button"
          onClick={onViewDetails}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[#c8952f] hover:bg-[#d9a84a] text-white text-[13.5px] font-medium transition cursor-pointer shadow-md"
        >
          <span>View Details</span>
          <EventIcon name="arrow" className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </aside>
  );
}