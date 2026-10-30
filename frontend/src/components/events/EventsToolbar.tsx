'use client';

/**
 * EventsToolbar.tsx
 *
 * Exact implementation of the Abune Media Events Toolbar:
 * - Category filter chips with active navy pill highlight
 * - Search input with search icon
 * - Sort dropdown with custom chevron icon
 */

import React from 'react';
import { EventIcon } from './EventIcons';

export interface CategoryChip {
  id: string;
  label: string;
  icon: 'cal' | 'cross' | 'users' | 'heart' | 'star';
}

const CATEGORIES: CategoryChip[] = [
  { id: 'all', label: 'All Events', icon: 'cal' },
  { id: 'Feast Celebration', label: 'Feast Celebrations', icon: 'cross' },
  { id: 'Church Program', label: 'Church Programs', icon: 'users' },
  { id: 'Community Service', label: 'Community Service', icon: 'heart' },
  { id: 'Special Event', label: 'Special Events', icon: 'star' },
];

interface Props {
  activeCat: string;
  onSelectCat: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'latest' | 'oldest' | 'name';
  onSortChange: (sort: 'latest' | 'oldest' | 'name') => void;
}

export function EventsToolbar({
  activeCat,
  onSelectCat,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: Props) {
  return (
    <div className="my-5 sm:mb-6 p-2.5 flex flex-wrap items-center gap-2 bg-[#f6f1e8] border border-[#ece5d8] rounded-[14px]">
      {/* Category Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCat === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCat(cat.id)}
              className={`flex items-center gap-2.5 px-5 h-[42px] rounded-xl border text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0f2352] border-[#0f2352] text-white shadow-xs'
                  : 'bg-[#fffdf9] border-[#ece5d8] text-[#0f2352] hover:border-[#c8952f]'
              }`}
            >
              <EventIcon
                name={cat.icon}
                className={`w-[19px] h-[19px] ${isActive ? 'text-white' : 'text-[#0f2352]'}`}
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="grow hidden xl:block" />

      {/* Search Input & Sort Dropdown Group */}
      <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto mt-2 xl:mt-0">
        {/* Search */}
        <label className="flex items-center gap-3.5 w-full sm:w-[294px] h-[42px] px-4 rounded-xl bg-[#fffdf9] border border-[#ece5d8] cursor-text">
          <EventIcon name="search" className="w-[18px] h-[18px] text-[#0f2352] shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events..."
            aria-label="Search events"
            className="w-full bg-transparent border-0 outline-hidden text-[13px] text-[#1c2740] placeholder-[#7b8499]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </label>

        {/* Sort Select */}
        <div className="relative w-full sm:w-[148px]">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'latest' | 'oldest' | 'name')}
            aria-label="Sort events"
            className="appearance-none w-full h-[42px] pl-3.5 pr-8 rounded-xl bg-[#fffdf9] border border-[#ece5d8] text-[13px] text-[#4b556b] cursor-pointer outline-hidden focus:border-[#c8952f]"
          >
            <option value="latest">Sort by: Latest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="name">Sort by: Name</option>
          </select>
          <EventIcon
            name="chev"
            className="w-4 h-4 text-[#0f2352] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
