'use client';

/**
 * EventsList.tsx
 *
 * Renders the grid/list of EventCards or skeleton placeholders.
 */

import React from 'react';
import { EventCard, EventItem } from '@/components/events/EventCard';

interface Props {
  events: EventItem[];
  isLoading?: boolean;
  onSelectEvent?: (event: EventItem) => void;
}

export function EventsList({ events, isLoading, onSelectEvent }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" aria-busy="true">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-[#fffdf9] rounded-lg border border-[#ece5d8] p-4 flex flex-col gap-3 animate-pulse"
          >
            <div className="w-full h-[134px] bg-[#f6f1e8] rounded-md" />
            <div className="h-4 bg-[#f6f1e8] rounded w-3/4" />
            <div className="h-3 bg-[#f6f1e8] rounded w-1/2" />
            <div className="h-3 bg-[#f6f1e8] rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {events.map((ev) => (
        <EventCard key={ev.id || ev.title} event={ev} onClick={onSelectEvent} />
      ))}
    </div>
  );
}
