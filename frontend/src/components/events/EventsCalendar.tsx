'use client';

/**
 * EventsCalendar.tsx: self-contained month calendar with event markers.
 *
 * It owns its own state (visible month, slide direction, selected day), so the
 * page only passes data in and gets a callback out:
 *
 *   <EventsCalendar
 *     eventDates={['2026-11-05', ...]}   // days that get a gold dot
 *     featuredDate="2026-11-22"          // day that gets the navy circle
 *     initialMonth={new Date(2026, 10, 1)}
 *     am={false}
 *     onSelectDate={(iso) => ...}        // called when an event day is clicked
 *   />
 *
 * Styles: .ev-panel / .ev-cal__* in events.css, animations in events.motion.css.
 */

import React, { useMemo, useState } from 'react';

interface Props {
  eventDates: readonly string[];
  featuredDate?: string;
  initialMonth?: Date;
  am?: boolean;
  onSelectDate: (isoDate: string) => void;
}

type Direction = 'next' | 'prev' | null;

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const pad = (n: number) => String(n).padStart(2, '0');
const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

interface Cell {
  day: number;
  iso: string;
  hasEvent: boolean;
  isFeatured: boolean;
}

export function EventsCalendar({ eventDates, featuredDate, initialMonth, am = false, onSelectDate }: Props) {
  const [month, setMonth] = useState(() => firstOfMonth(initialMonth ?? new Date()));
  const [direction, setDirection] = useState<Direction>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const label = month.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const { leadingBlanks, cells } = useMemo(() => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const withEvents = new Set(eventDates);
    const total = new Date(y, m + 1, 0).getDate();

    const days: Cell[] = Array.from({ length: total }, (_, i) => {
      const day = i + 1;
      const iso = `${y}-${pad(m + 1)}-${pad(day)}`;
      return { day, iso, hasEvent: withEvents.has(iso), isFeatured: iso === featuredDate };
    });
    return { leadingBlanks: new Date(y, m, 1).getDay(), cells: days };
  }, [month, eventDates, featuredDate]);

  const shift = (delta: 1 | -1) => {
    setDirection(delta === 1 ? 'next' : 'prev');
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const pick = (cell: Cell) => {
    if (!cell.hasEvent && !cell.isFeatured) return;
    setSelected(cell.iso);
    onSelectDate(cell.iso);
  };

  return (
    <section className="ev-panel" aria-labelledby="cal-title" data-reveal="side">
      <div className="ev-cal__head">
        <h2 id="cal-title">{am ? 'ቀን መቁጠሪያ' : 'Calendar'}</h2>
        <div className="ev-cal__nav">
          <button type="button" onClick={() => shift(-1)} aria-label={am ? 'ያለፈው ወር' : 'Previous month'}>
            <svg width="16" height="16" aria-hidden="true">
              <use href="#i-prev" />
            </svg>
          </button>
          <button type="button" onClick={() => shift(1)} aria-label={am ? 'የሚቀጥለው ወር' : 'Next month'}>
            <svg width="16" height="16" aria-hidden="true">
              <use href="#i-next" />
            </svg>
          </button>
        </div>
      </div>

      <p
  key={`label-${label}`}
        aria-live="polite"
        className={direction ? `ev-cal__month--${direction}` : undefined}
        style={{ fontWeight: 700, margin: '-6px 0 12px', color: 'var(--muted)' }}
      >
        {label}
      </p>

      <div key={`grid-${label}`} className={`ev-cal__grid${direction ? ` ev-cal__grid--${direction}` : ''}`}>
        {DAYS_OF_WEEK.map((d) => (
          <span key={d} className="dow">
            {d}
          </span>
        ))}

        {Array.from({ length: leadingBlanks }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}

        {cells.map((cell) => {
          const clickable = cell.hasEvent || cell.isFeatured;
          let cls = 'day';
          if (cell.isFeatured) cls += ' feat';
          else if (cell.hasEvent) cls += ' has';
          if (cell.iso === selected) cls += ' sel';

          return (
            <span
              key={cell.iso}
              className={cls}
              style={{ cursor: clickable ? 'pointer' : 'default' }}
              {...(clickable && {
                role: 'button',
                tabIndex: 0,
                onClick: () => pick(cell),
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    pick(cell);
                  }
                },
              })}
            >
              {cell.day}
            </span>
          );
        })}
      </div>

      <div className="ev-cal__key">
        <span>
          <i />
          {am ? 'የሁነት ቀን' : 'Event day'}
        </span>
        <span>
          <i />
          {am ? 'ዋና ሁነት' : 'Featured'}
        </span>
      </div>
    </section>
  );
}
