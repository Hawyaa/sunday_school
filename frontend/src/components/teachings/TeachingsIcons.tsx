import React from 'react';

const P: Record<string, string> = {
  user: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 20c0-4 3-6 7-6s7 2 7 6z',
  cal: 'M5.5 4.5h13A2.5 2.5 0 0 1 21 7v11.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5V7a2.5 2.5 0 0 1 2.5-2.5zM3 9.5h18M8 3v3.5M16 3v3.5M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5V12l3 2',
  chr: 'm9 5 7 7-7 7',
  chd: 'm6 9 6 6 6-6',
  plus: 'M12 5v14M5 12h14',
  play: 'M7 4v16l13-8z',
  home: 'M3 11 12 3l9 8h-2.5v9h-5v-6h-3v6h-5v-9z',
  search: 'M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM20 20l-4.2-4.2',
  book: 'M12 6C10 4.6 7 4.3 3 4.8v13.5c4-.5 7 0 9 1.7 2-1.7 5-2.2 9-1.7V4.8c-4-.5-7-.2-9 1.2z',
  bible: 'M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z',
  father: 'M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM5 21c0-5 3-8 7-8s7 3 7 8z',
  flame: 'M12 3c2 3 5 4 5 8a5 5 0 0 1-10 0c0-4 3-5 5-8zM5 21c2-2 5-3 7-3s5 1 7 3z',
  faith: 'M3 6c3-.5 6 0 9 1.5 3-1.5 6-2 9-1.5v12c-3-.5-6 0-9 1.5-3-1.5-6-2-9-1.5z',
  youth: 'M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM17 6a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM2 20c0-4 2.5-6 6-6s6 2 6 6zM13.5 15c.8-.3 1.7-.5 2.5-.5 3 0 5 1.5 5 5.5h-7z',
};

export type TeachingsIconName = keyof typeof P;

export function TIcon({ name, solid = false, className = 'h-4 w-4' }: { name: TeachingsIconName; solid?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill={solid ? 'currentColor' : 'none'}
      stroke={solid ? 'none' : 'currentColor'} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d={P[name]} />
    </svg>
  );
}