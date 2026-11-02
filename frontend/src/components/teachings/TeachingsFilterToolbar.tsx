'use client';

/** TeachingsFilterToolbar.tsx — search + category + sort + "+ Add New". State lives in the page. */

import React from 'react';
import Link from 'next/link';
import { TeachingsSearchBar } from './TeachingsSearchBar';
import { TIcon } from './TeachingsIcons';

export type SortKey = 'latest' | 'oldest';

/** Used when the page doesn't pass `categories`, so the dropdown never crashes. */
const DEFAULT_CATEGORIES = ['Bible Teachings', 'Church Fathers', 'Spiritual Life', 'Faith & Practice', 'Youth Teachings'];

interface Props {
  query: string; onQuery: (v: string) => void;
  categories?: string[]; category?: string; onCategory: (v: string) => void; // category '' = all
  sort: SortKey; onSort: (v: SortKey) => void;
  addHref?: string | null; // pass null to hide the Add New button
}

const box = "relative flex h-9 items-center rounded-[10px] border border-[#ece5d8] bg-[#fffdf9] shadow-[0_2px_8px_rgba(15,35,82,.05)] font-['Crimson_Text',serif] text-sm text-[#34476b]";
const sel = 'h-full w-full cursor-pointer appearance-none bg-transparent pr-8 outline-none';

export function TeachingsFilterToolbar({ query, onQuery, categories = DEFAULT_CATEGORIES, category = '', onCategory, sort, onSort, addHref = '/teachings/new' }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_170px_160px_auto] lg:gap-[18px]">
      <div className="sm:col-span-2 lg:col-span-1"><TeachingsSearchBar value={query} onChange={onQuery} /></div>

      <div className={box}>
        <select aria-label="Category" value={category} onChange={(e) => onCategory(e.target.value)} className={`${sel} pl-3.5`}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <TIcon name="chd" className="pointer-events-none absolute right-3.5 h-3 w-3 text-[#35609a]" />
      </div>

      <div className={box}>
        <TIcon name="cal" className="pointer-events-none absolute left-3.5 h-[17px] w-[17px] text-[#35609a]" />
        <select aria-label="Sort" value={sort} onChange={(e) => onSort(e.target.value as SortKey)} className={`${sel} pl-10`}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
        <TIcon name="chd" className="pointer-events-none absolute right-3.5 h-3 w-3 text-[#35609a]" />
      </div>

      {addHref && (
        <Link href={addHref} className="flex h-9 items-center justify-center gap-2 rounded-[10px] border border-[#dcc08a] bg-[#fffbf1] px-6 font-['Crimson_Text',serif] text-sm text-[#b9852a]">
          <TIcon name="plus" className="h-[15px] w-[15px]" />Add New
        </Link>
      )}
    </div>
  );
}