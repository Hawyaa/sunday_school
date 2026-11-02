import React from 'react';

/** Playfair Display stack (load the font in app/layout.tsx or via <link>) */
export const PF = "font-['Playfair_Display',Georgia,serif]";

const PATHS: Record<string, string> = {
  church: 'M12 2v3M10.5 3.5h3M12 5 7.5 8.5V20h9V8.5zM10 20v-4a2 2 0 0 1 4 0v4M7.5 11 4 13.5V20M16.5 11 20 13.5V20M2 20h20',
  team: 'M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM7.5 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20.5 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 20c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5M2 19c0-2 1.3-3.3 3.5-3.3M22 19c0-2-1.3-3.3-3.5-3.3',
  laptop: 'M5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 14.5v-8A1.5 1.5 0 0 1 5.5 5zM2 20h20',
  book: 'M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5zM12 6.5v13',
  mobile: 'M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM11 18h2',
  users: 'M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM19.4 9a2.4 2.4 0 1 1-4.8 0 2.4 2.4 0 0 1 4.8 0zM3 19c0-3 2.7-5 6-5s6 2 6 5M15 14.5c3 0 6 1 6 4.5',
  heart: 'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  music: 'M9 5v9.2a3 3 0 1 0 2 2.8V8.4l7-1.4v6.2a3 3 0 1 0 2 2.8V3.5z',
  bank: 'M3 9l9-5 9 5M5 9v9M10 9v9M14 9v9M19 9v9M3 20h18',
  cal: 'M5.5 4.5h13A2.5 2.5 0 0 1 21 7v11.5A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5V7a2.5 2.5 0 0 1 2.5-2.5zM3 9.5h18M8 3v3.5M16 3v3.5M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  home: 'M4 11 12 4l8 7M6 10v10h12V10',
};

export function Icon({ name, className = 'size-[1em]', strokeWidth = 1.8, solid = false }: { name: keyof typeof PATHS | string; className?: string; strokeWidth?: number; solid?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill={solid && name !== 'cal' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

/** Round gold-tint icon badge (use dark=true for the navy timeline version) */
export function IconBadge({ name, dark = false, solid = false }: { name: string; dark?: boolean; solid?: boolean }) {
  return (
    <span
      className={`grid ${dark ? '' : 'size-11'} place-items-center rounded-full ${
        dark
          ? 'size-12 bg-[#0f2352] text-white shadow-[0_0_0_4px_#f8ecd3,0_0_0_5.5px_#e6bd6c]'
          : 'border border-[#f1dcae] bg-gradient-to-b from-[#fcefd6] to-[#f6e3bf] text-[#bf7d17] shadow-[0_0_0_3px_rgba(246,233,207,.6)]'
      }`}
    >
      <Icon name={name} className="size-6" solid={solid} strokeWidth={dark ? 2.3 : solid ? 1.8 : 2.5} />
    </span>
  );
}

/** Small uppercase label with gold accent line */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-2 flex items-center gap-2.5 text-[10px] uppercase tracking-[.12em] ${className ?? 'text-[#5a6479]'}`}>
      <span className="h-[1.5px] w-[26px] bg-[#c8952f]" />
      {children}
    </div>
  );
}

/** Outline gold pill button (link) */
export function GoldButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-[#c8952f] px-6 py-[9px] text-[13px] font-medium text-[#0f2352] transition hover:bg-[#c8952f] hover:text-white">
      {children}
      <Icon name="arrow" />
    </a>
  );
}

export const panel = 'mt-6 rounded-2xl border border-[#ece5d8] bg-[#faf6ec] px-8 py-7';
export const card = 'rounded-xl border border-[#ece5d8] bg-[#fffdf9] shadow-[0_3px_14px_rgba(15,35,82,.06)]';
