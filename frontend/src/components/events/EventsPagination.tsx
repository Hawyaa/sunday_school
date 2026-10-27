'use client';

/**
 * EventsPagination.tsx
 *
 * Pagination control: prev / 1 2 3 … / next, navy active page, gold hover.
 * Same props as before, so nothing that uses it needs to change.
 */

import React from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** 1 … 4 5 6 … 10 style list */
function getPageList(current: number, total: number): (number | '…')[] {
  const out: (number | '…')[] = [];
  for (let n = 1; n <= total; n++) {
    if (n === 1 || n === total || Math.abs(n - current) <= 1) out.push(n);
    else if (out[out.length - 1] !== '…') out.push('…');
  }
  return out;
}

const base =
  'min-w-10 h-10 px-3 rounded-[10px] text-sm font-semibold flex items-center justify-center transition-colors';
const idle =
  'bg-[#fffdf9] text-[#0f2352] border border-[#ece5d8] cursor-pointer hover:border-[#c8952f]';
const active = 'bg-[#0f2352] text-white border border-[#0f2352]';

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${dir === 'left' ? 'rotate-90' : '-rotate-90'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function EventsPagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Events pagination" className="mt-7 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${base} ${idle} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#ece5d8]`}
        aria-label="Previous page"
      >
        <Chevron dir="left" />
      </button>

      {getPageList(currentPage, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`dots-${i}`} className="px-1 text-[#5a6479]">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`${base} ${p === currentPage ? active : idle}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${base} ${idle} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#ece5d8]`}
        aria-label="Next page"
      >
        <Chevron dir="right" />
      </button>
    </nav>
  );
}