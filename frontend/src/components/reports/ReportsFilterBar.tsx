'use client';

/**
 * ReportsFilterBar.tsx
 *
 * Search box + "Sort by" dropdown + filter button.
 * The filter button toggles a small panel with the year / category selects
 * (same state as before, so your existing filtering logic still works).
 */

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ChevronDown, SearchIcon, SlidersIcon } from '@/components/reports/icons';

export type ReportSort = 'newest' | 'oldest';

interface Props {
  year: string;
  onYearChange: (y: string) => void;
  category: string;
  onCategoryChange: (c: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
  sort: ReportSort;
  onSortChange: (s: ReportSort) => void;
}

const box =
  'bg-[#fffdf9] border border-[#ece5d8] rounded-[10px] h-9 flex items-center shadow-[0_2px_8px_rgba(15,35,82,0.05)] font-[Inter,sans-serif] text-xs';

export function ReportsFilterBar({
  year,
  onYearChange,
  category,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
}: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[1fr_183px_62px]">
        {/* Search */}
        <label className={`${box} gap-3.5 px-3 focus-within:border-[#c8952f]`}>
          <SearchIcon className="h-[19px] w-[19px] shrink-0 text-[#35609a]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={am ? 'ሪፖርቶችን በርዕስ ወይም በቁልፍ ቃል ይፈልጉ...' : 'Search reports by title or keyword...'}
            aria-label={am ? 'ሪፖርቶችን ይፈልጉ' : 'Search reports'}
            className="w-full bg-transparent text-[#1c2740] outline-hidden placeholder:text-[#9aa3b5]"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="cursor-pointer text-[#5a6479] hover:text-[#0f2352]"
            >
              ✕
            </button>
          )}
        </label>

        {/* Sort */}
        <label className={`${box} relative justify-between px-3`}>
          <span className="pointer-events-none text-[#1c2740]">
            {am ? 'ደርድር፦ ' : 'Sort by: '}
            {sort === 'newest' ? (am ? 'አዲስ' : 'Newest') : am ? 'የቆየ' : 'Oldest'}
          </span>
          <ChevronDown className="pointer-events-none h-3.5 w-3.5 text-[#35609a]" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ReportSort)}
            aria-label={am ? 'ደርድር' : 'Sort reports'}
            className="absolute inset-0 w-full cursor-pointer opacity-0"
          >
            <option value="newest">{am ? 'አዲስ' : 'Newest'}</option>
            <option value="oldest">{am ? 'የቆየ' : 'Oldest'}</option>
          </select>
        </label>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={am ? 'ማጣሪያ' : 'Filters'}
          className={`${box} cursor-pointer justify-center text-[#35609a] transition hover:border-[#c8952f] ${
            open ? 'border-[#c8952f]' : ''
          }`}
        >
          <SlidersIcon className="h-[18px] w-[18px]" />
        </button>
      </div>

      {open && (
        <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            aria-label={am ? 'ዓመት ይምረጡ' : 'Select year'}
            className={`${box} cursor-pointer px-3 text-[#0f2352] outline-hidden`}
          >
            <option value="All">{am ? 'ሁሉም ዓመታት' : 'All Years'}</option>
            <option value="2025">{am ? 'ዓመተ ምሕረት 2025' : 'Year 2025'}</option>
            <option value="2024">{am ? 'ዓመተ ምሕረት 2024' : 'Year 2024'}</option>
          </select>

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label={am ? 'ዓይነት ይምረጡ' : 'Select report type'}
            className={`${box} cursor-pointer px-3 text-[#0f2352] outline-hidden`}
          >
            <option value="All Types">{am ? 'ሁሉም ዓይነቶች' : 'All Types'}</option>
            <option value="Financial">{am ? 'ፋይናንስ' : 'Financial'}</option>
            <option value="Administrative">{am ? 'አስተዳደራዊ' : 'Administrative'}</option>
          </select>
        </div>
      )}
    </div>
  );
}