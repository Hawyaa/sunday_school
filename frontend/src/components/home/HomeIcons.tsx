import React from 'react';

const P: Record<string, string> = {
  book: 'M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5zM12 6.5v13',
  music: 'M9 5v9.2a3 3 0 1 0 2 2.8V8.4l7-1.4v6.2a3 3 0 1 0 2 2.8V3.5z',
  cal: 'M5.5 4.5h13A2.5 2.5 0 0 1 21 7v11.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5V7a2.5 2.5 0 0 1 2.5-2.5zM3 9.5h18M8 3v3.5M16 3v3.5M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01',
  img: 'M5.5 5h13A2 2 0 0 1 20.5 7v10a2 2 0 0 1-2 2h-13A2 2 0 0 1 3.5 17V7A2 2 0 0 1 5.5 5zM4 16l5-5 4 4 2.5-2.5L20 17M9 9.5h.01',
  mega: 'M3 10v4h3l7 4V6L6 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
  users: 'M9 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM17 6.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8zM3 19c0-3 2.7-5 6-5s6 2 6 5M15 14.5c3 0 6 1 6 4.5',
  heart: 'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 7.7a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chr: 'm9 5 7 7-7 7',
  chl: 'm15 5-7 7 7 7',
};

export type HomeIconName = keyof typeof P;

export function HomeIcon({ name, className = 'h-4 w-4', solid = false }: { name: HomeIconName; className?: string; solid?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill={solid ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d={P[name]} />
    </svg>
  );
}