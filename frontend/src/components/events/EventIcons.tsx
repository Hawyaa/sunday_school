'use client';

import React from 'react';

export type EventIconName =
  | 'cal'
  | 'cross'
  | 'users'
  | 'heart'
  | 'star'
  | 'search'
  | 'chev'
  | 'pin'
  | 'clock'
  | 'arrow'
  | 'home'
  | 'book'
  | 'church';

interface Props {
  name: EventIconName | string;
  className?: string;
  style?: React.CSSProperties;
}

export function EventIcon({ name, className = 'w-4 h-4', style }: Props) {
  const commonProps = {
    className: `inline-block shrink-0 fill-none stroke-current ${className}`,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    style,
  };

  switch (name) {
    case 'cal':
      return (
        <svg {...commonProps}>
          <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
          <path d="M3 9.5h18M8 3v3.5M16 3v3.5M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01" />
        </svg>
      );
    case 'cross':
      return (
        <svg {...commonProps}>
          <path d="M12 3v18M7 8h10" />
        </svg>
      );
    case 'users':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="7.5" r="3.2" />
          <path d="M5.5 20v-1.5a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5V20M3 20h18" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...commonProps}>
          <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />
        </svg>
      );
    case 'star':
      return (
        <svg {...commonProps}>
          <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" />
        </svg>
      );
    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-4.2-4.2" />
        </svg>
      );
    case 'chev':
      return (
        <svg {...commonProps}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...commonProps}>
          <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
          <circle cx="12" cy="10" r="2.3" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...commonProps}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case 'home':
      return (
        <svg {...commonProps}>
          <path d="M4 11 12 4l8 7M6 10v10h12V10" />
        </svg>
      );
    case 'book':
      return (
        <svg {...commonProps}>
          <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5zM12 6.5v13" />
        </svg>
      );
    case 'church':
      return (
        <svg {...commonProps}>
          <path d="M12 2v4M10.5 3.5h3M12 6c-3 0-5 2.4-5 5v9h10v-9c0-2.6-2-5-5-5zM10 20v-4a2 2 0 0 1 4 0v4M2 20h20" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
