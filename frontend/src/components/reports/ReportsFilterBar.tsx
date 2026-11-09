'use client';

/**
 * ReportsFilterBar.tsx
 *
 * Search box + "Sort by" dropdown + filter button (toggles year / category selects).
 * Animation: search fades up, sort slides in from the right, filter button scales in.
 */

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ChevronDown, SearchIcon, SlidersIcon } from '@/components/reports/icons';
import { RmGroup, rmDelay } from '@/components/reports/motion';

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
  'bg-[#fffdf9] border border-[#ece5d8] rounded-[10px] h-9 flex items-center shadow-[0_2px_8px_rgba(15,35,82,0.05)] font-[Inter,sans-serif] text-xs transition-[border-color,box-shadow] duration-300';

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
    <RmGroup className="mb-3">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[1fr_183px_62px]">
        {/* Search — fade up */}
        <div data-rm="up">
          <label className={`${box} gap-3.5 px-3 focus-within:border-[#c8952f] focus-within:shadow-[0_0_0_3px_rgba(200,149,47,0.18)]`}>
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
                className="cursor-pointer text-[#5a6479] transition-colors hover:text-[#0f2352]"
              >
                ✕
              </button>
            )}
          </label>
        </div>

        {/* Sort — slide in from the right */}
        <div data-rm="right" style={rmDelay(110)}>
          <label className={`${box} relative justify-between px-3 hover:border-[#c8952f]/60 focus-within:border-[#c8952f] focus-within:shadow-[0_0_0_3px_rgba(200,149,47,0.18)]`}>
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
        </div>

        {/* Filter toggle — scale in */}
        <div data-rm="scale" style={rmDelay(220)}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={am ? 'ማጣሪያ' : 'Filters'}
            className={`${box} w-full cursor-pointer justify-center text-[#35609a] hover:scale-[1.04] hover:border-[#c8952f] focus-visible:border-[#c8952f] focus-visible:shadow-[0_0_0_3px_rgba(200,149,47,0.18)] ${
              open ? 'border-[#c8952f]' : ''
            }`}
          >
            <SlidersIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            aria-label={am ? 'ዓመት ይምረጡ' : 'Select year'}
            className={`${box} cursor-pointer px-3 text-[#0f2352] outline-hidden focus:border-[#c8952f]`}
          >
            <option value="All">{am ? 'ሁሉም ዓመታት' : 'All Years'}</option>
            <option value="2025">{am ? 'ዓመተ ምሕረት 2025' : 'Year 2025'}</option>
            <option value="2024">{am ? 'ዓመተ ምሕረት 2024' : 'Year 2024'}</option>
          </select>

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label={am ? 'ዓይነት ይምረጡ' : 'Select report type'}
            className={`${box} cursor-pointer px-3 text-[#0f2352] outline-hidden focus:border-[#c8952f]`}
          >
            <option value="All Types">{am ? 'ሁሉም ዓይነቶች' : 'All Types'}</option>
            <option value="Financial">{am ? 'ፋይናንስ' : 'Financial'}</option>
            <option value="Administrative">{am ? 'አስተዳደራዊ' : 'Administrative'}</option>
          </select>
        </div>
      )}
    </RmGroup>
  );
}