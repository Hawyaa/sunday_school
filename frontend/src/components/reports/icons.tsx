/**
 * icons.tsx  (components/reports/icons.tsx)
 *
 * Small inline SVG set + decorative pieces used by the Reports page.
 * Everything uses currentColor so Tailwind text-* classes control colour.
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
      className={className ?? 'w-4 h-4'}
    >
      {children}
    </svg>
  );
}

export const DocIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M6 2.5h8l5 5V21.5H6z" fill="currentColor" stroke="none" />
    <path d="M9.5 13h7M9.5 16.5h7M9.5 9.5h3" stroke="#fbf0da" strokeWidth={1.6} />
  </Svg>
);

export const BookIcon = ({ className }: P) => (
  <Svg className={className}>
    <path
      d="M12 6C10 4.6 7 4.3 3 4.8v13.5c4-.5 7 0 9 1.7 2-1.7 5-2.2 9-1.7V4.8c-4-.5-7-.2-9 1.2z"
      fill="currentColor"
      stroke="none"
    />
    <path d="M12 6.5v13" stroke="#fbf0da" strokeWidth={1.1} />
  </Svg>
);

export const MusicIcon = ({ className }: P) => (
  <Svg className={className}>
    <path
      d="M9 5v9.2a3 3 0 1 0 2 2.8V8.4l7-1.4v6.2a3 3 0 1 0 2 2.8V3.5z"
      fill="currentColor"
      stroke="none"
    />
  </Svg>
);

export const ChartIcon = ({ className }: P) => (
  <Svg className={className}>
    <g fill="currentColor" stroke="none">
      <rect x="4" y="13" width="3.5" height="7" rx=".6" />
      <rect x="9" y="10" width="3.5" height="10" rx=".6" />
      <rect x="14" y="7" width="3.5" height="13" rx=".6" />
    </g>
    <path d="M4 9 9 5.5l3 2L19 3M15.5 3H19v3.5" strokeWidth={1.7} />
  </Svg>
);

export const LockIcon = ({ className }: P) => (
  <Svg className={className}>
    <rect x="5" y="10" width="14" height="11" rx="2.5" fill="currentColor" stroke="none" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" strokeWidth={2.2} />
    <circle cx="12" cy="15" r="1.5" fill="#f6ead2" stroke="none" />
  </Svg>
);

export const CalendarIcon = ({ className }: P) => (
  <Svg className={className}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" strokeWidth={1.7} />
  </Svg>
);

export const FileIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 15.5h5" />
  </Svg>
);

export const DownloadIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M12 4v11M7 11l5 5 5-5M5 20h14" strokeWidth={2.2} />
  </Svg>
);

export const ChevronRight = ({ className }: P) => (
  <Svg className={className}>
    <path d="m9 5 7 7-7 7" strokeWidth={2.6} />
  </Svg>
);

export const ChevronDown = ({ className }: P) => (
  <Svg className={className}>
    <path d="m6 9 6 6 6-6" strokeWidth={2.2} />
  </Svg>
);

export const SearchIcon = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="11" cy="11" r="6.5" strokeWidth={2.2} />
    <path d="m20 20-4.2-4.2" strokeWidth={2.2} />
  </Svg>
);

export const SlidersIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M3 7h6M15 7h6M3 12h12M19 12h2M3 17h3M12 17h9" strokeWidth={2.3} />
    <circle cx="12" cy="7" r="2" fill="currentColor" />
    <circle cx="17" cy="12" r="2" fill="currentColor" />
    <circle cx="9" cy="17" r="2" fill="currentColor" />
  </Svg>
);

export const UserIcon = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="12" cy="8" r="3.5" fill="currentColor" />
    <path d="M5 20c0-4 3-6 7-6s7 2 7 6z" fill="currentColor" />
  </Svg>
);

export const ShieldIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M12 2.5 20 5.5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6z" fill="currentColor" stroke="none" />
    <path d="M12 4.5v15c3.5-1.3 6-4 6-7.5V7z" fill="#5d7fb0" stroke="none" />
    <rect x="9" y="10" width="6" height="5" rx="1" fill="#fff" stroke="none" />
    <path d="M10 10V8.8a2 2 0 0 1 4 0V10" stroke="#fff" strokeWidth={1.3} />
  </Svg>
);

export const MailIcon = ({ className }: P) => (
  <Svg className={className}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" fill="currentColor" stroke="none" />
    <path d="m3 7 9 6.5L21 7" stroke="#fffbf1" strokeWidth={1.6} />
  </Svg>
);

/** Simple gold Ethiopian-style cross (replaces the base64 PNG from the HTML). */
export function CrossIcon({ className }: P) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/images/cross.png"
        alt="Ethiopian Orthodox cross"
        draggable={false}
        className={className ?? 'h-14 w-auto'}
      />
    );
  }
/** Gold line – diamond – gold line divider. */
export function Divider({ className }: P) {
  return (
    <div className={`flex items-center gap-1.5 text-[#c8952f] ${className ?? ''}`} aria-hidden="true">
      <span className="h-[1.5px] flex-1 bg-[#c8952f]" />
      <i className="block h-[7px] w-[7px] rotate-45 bg-[#c8952f]" />
      <span className="h-[1.5px] flex-1 bg-[#c8952f]" />
    </div>
  );
}

/**
 * Decorative card corner (uses /public/images/corner-ornament.png).
 * The artwork is a TOP-RIGHT corner. Flip with Tailwind classes:
 *   top-right: none | top-left: -scale-x-100 | bottom-right: -scale-y-100 | bottom-left: -scale-100
 */
export function CornerOrnament({ className }: P) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/corner-ornament.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none absolute h-auto w-[54px] select-none ${className ?? ''}`}
    />
  );
}