'use client';

/**
 * EventModal.tsx
 *
 * Interactive popup modal for viewing full event details and RSVP info.
 */

import React from 'react';
import { EventItem } from './EventCard';
import { EventIcon } from './EventIcons';

interface Props {
  event: EventItem | null;
  onClose: () => void;
}

export function EventModal({ event, onClose }: Props) {
  if (!event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#fffdf9] rounded-2xl overflow-hidden shadow-2xl border border-[#ece5d8] text-[#1c2740] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Image */}
        <div
          className="relative h-44 bg-cover bg-center"
          style={{ backgroundImage: `url("${event.img}")` }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#0f2352]/90 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition cursor-pointer"
          >
            ✕
          </button>
          <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#c8952f] text-white text-xs font-semibold shadow-xs">
            <EventIcon name={event.icon} className="w-3.5 h-3.5 text-white" />
            {event.cat}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <h2
            className="text-2xl font-bold text-[#0f2352] mb-3 leading-snug"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {event.title}
          </h2>

          <div className="space-y-2 mb-4 text-sm text-[#4d5870]">
            <div className="flex items-center gap-2.5">
              <EventIcon name="cal" className="w-4 h-4 text-[#c8952f] shrink-0" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <EventIcon name="clock" className="w-4 h-4 text-[#c8952f] shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <EventIcon name="pin" className="w-4 h-4 text-[#c8952f] shrink-0" />
              <span>{event.place}</span>
            </div>
          </div>

          <p className="text-sm text-[#5a6479] leading-relaxed mb-6">
            {event.description ||
              'Join us for this special gathering with hymns, liturgical prayers, and community fellowship at Abune Media and Sunday School.'}
          </p>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#ece5d8]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-[#ece5d8] text-sm font-semibold text-[#0f2352] hover:bg-[#f6f1e8] transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                alert(`Reminder set for: ${event.title}`);
                onClose();
              }}
              className="px-6 py-2.5 rounded-lg bg-[#c8952f] hover:bg-[#d9a84a] text-white text-sm font-bold transition shadow-xs cursor-pointer flex items-center gap-2"
            >
              <EventIcon name="cal" className="w-4 h-4 text-white" />
              <span>Add to Calendar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
