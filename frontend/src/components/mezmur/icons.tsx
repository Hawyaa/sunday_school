/* eslint-disable @next/next/no-img-element */
/**
 * icons.tsx (components/mezmur/icons.tsx)
 * Extra icons + the gold Corners ornament used by the Mezmur page.
 * Search / Chevron / Music / Book / Divider come from components/reports/icons.
 */

import React from 'react';

type P = { className?: string };

function Svg({ className, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? 'h-4 w-4'}
    >
      {children}
    </svg>
  );
}

export const PlayIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />
  </Svg>
);

export const ShareIcon = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="6" cy="12" r="2.6" fill="currentColor" stroke="none" />
    <circle cx="18" cy="6" r="2.6" fill="currentColor" stroke="none" />
    <circle cx="18" cy="18" r="2.6" fill="currentColor" stroke="none" />
    <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
  </Svg>
);

export const SortIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4" strokeWidth={2} />
  </Svg>
);

export const UsersIcon = ({ className }: P) => (
  <Svg className={className}>
    <g fill="currentColor" stroke="none">
      <circle cx="12" cy="7.5" r="3" />
      <circle cx="5.5" cy="9.5" r="2.2" />
      <circle cx="18.5" cy="9.5" r="2.2" />
      <path d="M6.5 19c0-3.5 2.4-5.5 5.5-5.5s5.5 2 5.5 5.5z" />
      <path d="M1.5 18c0-2.6 1.6-4 4-4 .8 0 1.5.2 2.1.5-1.2 1-1.9 2.2-2.1 3.5z" />
      <path d="M22.5 18c0-2.6-1.6-4-4-4-.8 0-1.5.2-2.1.5 1.2 1 1.9 2.2 2.1 3.5z" />
    </g>
  </Svg>
);

export const StarIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="m12 2.8 2.7 5.9 6.3.7-4.7 4.3 1.3 6.3L12 16.8l-5.6 3.2 1.3-6.3L3 9.4l6.3-.7z" fill="currentColor" stroke="none" />
  </Svg>
);

export const BuildingIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="m3 9 9-5.5L21 9z" fill="currentColor" stroke="none" />
    <path d="M5.5 11.5v6.5M10 11.5v6.5M14 11.5v6.5M18.5 11.5v6.5M3.5 20.5h17" strokeWidth={2.2} />
  </Svg>
);

export const PrayIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M12 3c-3.2 3-4.2 7-3.6 11L12 21l3.6-7c.6-4-.4-8-3.6-11z" fill="currentColor" stroke="none" />
    <path d="M12 8v9" stroke="#fffbf1" strokeWidth={1.2} />
  </Svg>
);

export const FlameIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M12.5 2.5c.6 3.2 4.5 5.2 4.5 10.2a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.8.1 1.8.9 2.8 1.9 3.2-.4-3.2.2-5.7 1.4-8.6z" fill="currentColor" stroke="none" />
  </Svg>
);

/**
 * Four gold corner ornaments for a `relative` card.
 * The artwork (public/images/corner-ornament.png) is a TOP-RIGHT corner, so the others are flipped.
 */
export function Corners({ size = 34, inset = 5 }: { size?: number; inset?: number }) {
  const base = 'pointer-events-none absolute h-auto select-none mix-blend-multiply';
  const src = '/images/corner-ornament.png';
  return (
    <>
      <img src={src} alt="" aria-hidden="true" draggable={false} className={`${base} -scale-x-100`} style={{ top: inset, left: inset, width: size }} />
      <img src={src} alt="" aria-hidden="true" draggable={false} className={base} style={{ top: inset, right: inset, width: size }} />
      <img src={src} alt="" aria-hidden="true" draggable={false} className={`${base} -scale-100`} style={{ bottom: inset, left: inset, width: size }} />
      <img src={src} alt="" aria-hidden="true" draggable={false} className={`${base} -scale-y-100`} style={{ bottom: inset, right: inset, width: size }} />
    </>
  );
}

export const ClockIcon = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.5l3.5 2" strokeWidth={2.1} />
  </Svg>
);