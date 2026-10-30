'use client';

/**
 * EventCard.tsx
 *
 * Clean "magazine" event card:
 * - Big rounded photo (navy calendar badge on the photo, as before)
 * - Under the photo: category pill + date on one line
 * - Bold title
 * - Small uppercase location line with a pin
 * No box / border around the card, just the content.
 */

import React from 'react';
import { EventIcon } from './EventIcons';

export interface EventItem {
  id?: string | number;
  title: string;
  cat: string;
  icon: string;
  date: string;
  place: string;
  time: string;
  img?: string; // optional now: the card picks one of EVENT_IMAGES automatically
  description?: string;
}

/** The three images reused across the cards. Change/add links here only. */
export const EVENT_IMAGES = [
  'https://i.pinimg.com/736x/76/2f/81/762f8159fd690075012fe0396ed13ae8.jpg',
  'https://i.pinimg.com/1200x/aa/b6/55/aab655bda9ce179c5c34b95c20816317.jpg',
  'https://i.pinimg.com/736x/b1/a4/95/b1a495df356cc25ee55bbda406aa8c19.jpg',
];

/** Same event always gets the same image: numeric id cycles 1,2,3,1,2,3... otherwise title hash. */
export function getEventImage(event: EventItem): string {
  const n = Number(event.id);
  if (event.id !== undefined && !Number.isNaN(n)) {
    return EVENT_IMAGES[(((n - 1) % EVENT_IMAGES.length) + EVENT_IMAGES.length) % EVENT_IMAGES.length];
  }
  let hash = 0;
  for (const ch of event.title) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return EVENT_IMAGES[hash % EVENT_IMAGES.length];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Props {
  event: EventItem;
  onClick?: (event: EventItem) => void;
}

export function EventCard({ event, onClick }: Props) {
  // Parse date safely
  const dateObj = new Date(event.date + 'T00:00:00');
  const valid = !isNaN(dateObj.getTime());
  const monthStr = valid ? MONTHS[dateObj.getMonth()] : 'Jan';
  const dayStr = valid ? String(dateObj.getDate()).padStart(2, '0') : '01';
  const yearStr = valid ? String(dateObj.getFullYear()) : '2025';

  const imageSrc = getEventImage(event);

  return (
    <article
      onClick={() => onClick?.(event)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(event);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${event.title} – view details`}
      className="group flex cursor-pointer flex-col outline-hidden"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#d9d2c3] shadow-[0_6px_20px_rgba(15,35,82,0.10)] transition-shadow duration-300 group-hover:shadow-[0_14px_30px_rgba(15,35,82,0.22)] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[#c8952f]">
        {/* no-referrer avoids Pinterest hotlink blocking */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Date Badge (navy calendar card) */}
        <div className="absolute left-3.5 top-3.5 z-10 w-12 rounded-[7px] bg-[#0f2352] px-0 py-1.5 text-center leading-[1.1] text-white shadow-sm">
          <small className="block text-[11px] font-normal uppercase tracking-wider">{monthStr}</small>
          <b className="my-0.5 block text-xl font-semibold">{dayStr}</b>
          <span className="block text-[10.5px] opacity-80">{yearStr}</span>
        </div>
      </div>

      {/* Meta row: category pill + date */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c8952f] px-3 py-[5px] text-[10.5px] font-semibold uppercase tracking-[0.06em] text-white">
          <EventIcon name={event.icon} className="h-3 w-3 text-white" />
          {event.cat}
        </span>
        <span className="text-[12px] font-medium text-[#5a6479]">{event.date}</span>
      </div>

      {/* Title */}
      <h3
        className="mt-3 line-clamp-2 text-[22px] font-bold leading-[1.25] text-[#0f2352] transition-colors group-hover:text-[#b9852a]"
        style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
      >
        {event.title}
      </h3>

      {/* Location */}
      <div className="mt-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] text-[#b9852a]">
        <EventIcon name="pin" className="h-3.5 w-3.5 shrink-0 text-[#c8952f]" />
        <span className="truncate">{event.place}</span>
      </div>
    </article>
  );
}