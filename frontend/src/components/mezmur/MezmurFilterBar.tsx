'use client';

/**
 * MezmurFilterBar.tsx — search | All Categories | Sort (Latest/Oldest)
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ChevronDown, MusicIcon, SearchIcon } from '@/components/reports/icons';
import { SortIcon } from '@/components/mezmur/icons';
import { CATEGORIES } from '@/components/mezmur/mezmurData';

export type MezmurSort = 'newest' | 'oldest';

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  sort: MezmurSort;
  onSortChange: (v: MezmurSort) => void;
}

const box =
  'bg-[#fffdf9] border border-[#ece5d8] rounded-[10px] h-11 flex items-center shadow-[0_2px_8px_rgba(15,35,82,0.05)] font-[Inter,sans-serif] text-[13px] text-[#1c2740]';

export function MezmurFilterBar({ search, onSearchChange, category, onCategoryChange, sort, onSortChange }: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const catLabel =
    category === 'all'
      ? am ? 'ሁሉም ምድቦች' : 'All Categories'
      : (() => {
          const c = CATEGORIES.find((x) => x.key === category);
          return c ? (am ? c.am : c.en) : '';
        })();

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[1fr_190px_150px]">
      {/* Search */}
      <label className={`${box} gap-3 px-4 focus-within:border-[#c8952f]`}>
        <SearchIcon className="h-5 w-5 shrink-0 text-[#0f2352]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={am ? 'በርዕስ፣ በዘማሪ ወይም በቁልፍ ቃል ይፈልጉ...' : 'Search by title, artist or keyword...'}
          aria-label={am ? 'መዝሙር ይፈልጉ' : 'Search mezmur'}
          className="w-full bg-transparent outline-hidden placeholder:text-[#9aa3b5]"
        />
        {search && (
          <button type="button" onClick={() => onSearchChange('')} aria-label="Clear search" className="cursor-pointer text-[#5a6479] hover:text-[#0f2352]">
            ✕
          </button>
        )}
      </label>

      {/* Category */}
      <label className={`${box} relative gap-2.5 px-3.5`}>
        <MusicIcon className="h-5 w-5 shrink-0 text-[#b9852a]" />
        <span className="pointer-events-none min-w-0 flex-1 truncate">{catLabel}</span>
        <ChevronDown className="pointer-events-none h-3.5 w-3.5 text-[#0f2352]" />
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label={am ? 'ምድብ ይምረጡ' : 'Select category'}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        >
          <option value="all">{am ? 'ሁሉም ምድቦች' : 'All Categories'}</option>
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {am ? c.am : c.en}
            </option>
          ))}
        </select>
      </label>

      {/* Sort */}
      <label className={`${box} relative gap-2.5 px-3.5`}>
        <SortIcon className="h-[18px] w-[18px] shrink-0 text-[#0f2352]" />
        <span className="pointer-events-none flex-1">
          {sort === 'newest' ? (am ? 'አዲስ' : 'Latest') : am ? 'የቆየ' : 'Oldest'}
        </span>
        <ChevronDown className="pointer-events-none h-3.5 w-3.5 text-[#0f2352]" />
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as MezmurSort)}
          aria-label={am ? 'ደርድር' : 'Sort'}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        >
          <option value="newest">{am ? 'አዲስ' : 'Latest'}</option>
          <option value="oldest">{am ? 'የቆየ' : 'Oldest'}</option>
        </select>
      </label>
    </div>
  );
}