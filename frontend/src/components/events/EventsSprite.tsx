import React from 'react';

/**
 * EventsSprite: the SVG icons used on the Events page (<use href="#i-...">).
 * Render it once near the top of the page.
 */
export function EventsSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="i-cross" viewBox="0 0 64 64">
        <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
          <path d="M26 6h12v14h14v12H38v26H26V32H12V20h14z" />
          <circle cx="32" cy="26" r="5" />
          <circle cx="32" cy="6" r="2" fill="currentColor" />
          <circle cx="12" cy="26" r="2" fill="currentColor" />
          <circle cx="52" cy="26" r="2" fill="currentColor" />
          <circle cx="32" cy="58" r="2" fill="currentColor" />
        </g>
      </symbol>
      <symbol id="i-clock" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </g>
      </symbol>
      <symbol id="i-pin" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </g>
      </symbol>
      <symbol id="i-cal" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </g>
      </symbol>
      <symbol id="i-search" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </g>
      </symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24">
        <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="i-prev" viewBox="0 0 24 24">
        <path d="m15 6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="i-next" viewBox="0 0 24 24">
        <path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
    </svg>
  );
}
