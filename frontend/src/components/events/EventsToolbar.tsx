'use client';

/**
 * EventsToolbar.tsx
 *
 * One row: Search  |  Sort by  |  Category dropdown
 * The category chips are now a dropdown (with the same icons) that sits
 * right after the "Sort by" dropdown.
 */

import React, { useEffect, useRef, useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const active = CATEGORIES.find((c) => c.id === activeCat) ?? CATEGORIES[0];
  const isFiltered = active.id !== 'all';

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="my-5 sm:mb-6 p-2.5 flex flex-wrap items-center gap-2 bg-[#f6f1e8] border border-[#ece5d8] rounded-[14px]">
      {/* Search */}
      <label className="flex items-center gap-3.5 w-full sm:flex-1 sm:min-w-[220px] h-[42px] px-4 rounded-xl bg-[#fffdf9] border border-[#ece5d8] cursor-text focus-within:border-[#c8952f]">
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
            aria-label="Clear search"
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

      {/* Category dropdown (after Sort) */}
      <div ref={wrapRef} className="relative w-full sm:w-[200px]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Filter by category"
          className={`flex items-center gap-2.5 w-full h-[42px] pl-3.5 pr-9 rounded-xl border text-[13px] font-medium cursor-pointer transition-colors text-left ${
            isFiltered
              ? 'bg-[#0f2352] border-[#0f2352] text-white'
              : 'bg-[#fffdf9] border-[#ece5d8] text-[#0f2352] hover:border-[#c8952f]'
          } ${open ? 'border-[#c8952f]' : ''}`}
        >
          <EventIcon
            name={active.icon}
            className={`w-[18px] h-[18px] shrink-0 ${isFiltered ? 'text-white' : 'text-[#0f2352]'}`}
          />
          <span className="truncate">{active.label}</span>
          <EventIcon
            name="chev"
            className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${
              open ? 'rotate-180' : ''
            } ${isFiltered ? 'text-white' : 'text-[#0f2352]'}`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            aria-label="Event categories"
            className="absolute right-0 z-30 mt-1.5 w-full min-w-[220px] overflow-hidden rounded-xl border border-[#ece5d8] bg-[#fffdf9] py-1.5 shadow-[0_10px_28px_rgba(15,35,82,0.14)]"
          >
            {CATEGORIES.map((cat) => {
              const selected = cat.id === activeCat;
              return (
                <li key={cat.id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCat(cat.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] cursor-pointer transition-colors ${
                      selected
                        ? 'bg-[#0f2352] text-white'
                        : 'text-[#0f2352] hover:bg-[#f6f1e8]'
                    }`}
                  >
                    <EventIcon
                      name={cat.icon}
                      className={`w-[18px] h-[18px] shrink-0 ${selected ? 'text-white' : 'text-[#0f2352]'}`}
                    />
                    <span className="grow">{cat.label}</span>
                    {selected && <span aria-hidden="true">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}