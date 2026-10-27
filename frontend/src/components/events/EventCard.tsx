'use client';

/**
 * EventCard.tsx
 *
 * Abune Media Event Card:
 * - Image thumbnail with calendar date badge and category chip
 * - Playfair Display heading
 * - Location pin and clock metadata rows
 * - Navy circular action arrow button
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
  const monthStr = !isNaN(dateObj.getTime()) ? MONTHS[dateObj.getMonth()] : 'Jan';
  const dayStr = !isNaN(dateObj.getTime()) ? String(dateObj.getDate()).padStart(2, '0') : '01';
  const yearStr = !isNaN(dateObj.getTime()) ? String(dateObj.getFullYear()) : '2025';

  const imageSrc = getEventImage(event);

  return (
    <article
      onClick={() => onClick && onClick(event)}
      className="bg-[#fffdf9] rounded-lg overflow-hidden shadow-[0_3px_14px_rgba(15,35,82,0.08)] flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_22px_rgba(15,35,82,0.14)] cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative h-[134px] overflow-hidden bg-[#d9d2c3]">
        {/* no-referrer avoids Pinterest hotlink blocking */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={event.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Date Badge */}
        <div className="absolute z-10 left-3 top-3 w-12 py-1.5 px-0 rounded-[7px] bg-[#0f2352] text-white text-center leading-[1.1] shadow-sm">
          <small className="block text-[11px] font-normal uppercase tracking-wider">{monthStr}</small>
          <b className="block text-xl font-semibold my-0.5">{dayStr}</b>
          <span className="block text-[10.5px] opacity-80">{yearStr}</span>
        </div>

        {/* Category Tag */}
        <span className="absolute z-10 right-2.5 top-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(200,149,47,0.95)] text-white text-[11px] font-medium shadow-sm backdrop-blur-xs">
          <EventIcon name={event.icon} className="w-[13px] h-[13px] text-white" />
          <span>{event.cat}</span>
        </span>
      </div>

      {/* Body */}
      <div className="relative p-3.5 pb-4 flex-1 flex flex-col">
        <h3
          className="text-[16.5px] font-semibold text-[#0f2352] mb-3 leading-snug group-hover:text-[#c8952f] transition-colors line-clamp-1"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          {event.title}
        </h3>

        {/* Location Meta */}
        <div className="flex items-center gap-2 text-[11.5px] text-[#4d5870] mb-2">
          <EventIcon name="pin" className="w-3.5 h-3.5 text-[#c8952f] shrink-0" />
          <span className="truncate">{event.place}</span>
        </div>

        {/* Time Meta */}
        <div className="flex items-center gap-2 text-[11.5px] text-[#4d5870] mb-2">
          <EventIcon name="clock" className="w-3.5 h-3.5 text-[#c8952f] shrink-0" />
          <span>{event.time}</span>
        </div>

        {/* Circular Arrow Button */}
        <div className="absolute right-3 bottom-3.5 w-[25px] h-[25px] rounded-full bg-[#0f2352] text-white flex items-center justify-center text-[13px] group-hover:bg-[#c8952f] transition-colors">
          <EventIcon name="arrow" className="w-3 h-3 text-white" />
        </div>
      </div>
    </article>
  );
}