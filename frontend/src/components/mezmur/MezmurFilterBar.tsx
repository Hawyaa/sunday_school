'use client';

/**
 * MezmurFilterBar.tsx — search | All Categories | Sort (Latest/Oldest)
 *
 * The two dropdowns used to be native <select>s, whose popup can't be animated.
 * They're now a small accessible listbox (keyboard + click-outside) with an
 * animated open/close. Props and behaviour are unchanged.
 */

import React, { useEffect, useId, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ChevronDown, MusicIcon, SearchIcon } from '@/components/reports/icons';
import { SortIcon } from '@/components/mezmur/icons';
import { MezmurCategory, CATEGORIES } from '@/components/mezmur/mezmurData';

export type MezmurSort = 'newest' | 'oldest';

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  sort: MezmurSort;
  onSortChange: (v: MezmurSort) => void;
  categories?: MezmurCategory[];
}

const box =
  'bg-[#fffdf9] border border-[#ece5d8] rounded-[10px] h-11 flex items-center shadow-[0_2px_8px_rgba(15,35,82,0.05)] font-[Inter,sans-serif] text-[13px] text-[#1c2740] transition-[border-color,box-shadow] duration-300 ease-out';
const goldFocus =
  'focus-within:border-[#c8952f] focus-within:shadow-[0_0_0_3px_rgba(200,149,47,0.14),0_2px_8px_rgba(15,35,82,0.05)]';

/* ------------------------------------------------------------------ */

interface Opt {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  options: Opt[];
  onChange: (v: string) => void;
  ariaLabel: string;
  icon: React.ReactNode;
  buttonLabel: string;
  className?: string;
  align?: 'left' | 'right';
}

function Dropdown({ value, options, onChange, ariaLabel, icon, buttonLabel, className = '', align = 'left' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const uid = useId();

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));

  const openMenu = () => {
    setActive(selectedIndex);
    setOpen(true);
  };
  const choose = (i: number) => {
    const o = options[i];
    if (o) onChange(o.value);
    setOpen(false);
  };

  // close on outside press
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // keep the active option visible inside the panel (without scrolling the page)
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const el = list?.children[active] as HTMLElement | undefined;
    if (!list || !el) return;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop - 6;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight + 6;
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) openMenu();
        else setActive((i) => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) openMenu();
        else setActive((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          setActive(options.length - 1);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open) choose(active);
        else openMenu();
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} data-open={open} className={`mz-dd relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        aria-activedescendant={open ? `${uid}-opt-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`${box} w-full cursor-pointer gap-2.5 px-3.5 text-left outline-hidden focus-visible:border-[#c8952f] focus-visible:shadow-[0_0_0_3px_rgba(200,149,47,0.14),0_2px_8px_rgba(15,35,82,0.05)] ${
          open ? 'border-[#c8952f]' : ''
        }`}
      >
        {icon}
        <span className="pointer-events-none min-w-0 flex-1 truncate font-medium">{buttonLabel}</span>
        <ChevronDown className="mz-dd-chevron pointer-events-none h-3.5 w-3.5 shrink-0 text-[#0f2352]" />
      </button>

      <ul
        ref={listRef}
        id={`${uid}-list`}
        role="listbox"
        aria-label={ariaLabel}
        data-align={align}
        className="mz-dd-panel font-[Inter,sans-serif] text-[13px]"
      >
        {options.map((o, i) => (
          <li
            key={o.value}
            id={`${uid}-opt-${i}`}
            role="option"
            aria-selected={o.value === value}
            data-active={i === active}
            onMouseDown={(e) => e.preventDefault()} // keep focus on the button
            onMouseEnter={() => setActive(i)}
            onClick={() => choose(i)}
            className="mz-dd-option"
          >
            {o.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function MezmurFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  categories = CATEGORIES,
}: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const catLabel =
    category === 'all'
      ? am
        ? 'ሁሉም ምድቦች'
        : 'All Categories'
      : (() => {
          const c = categories.find((x) => x.key === category);
          return c ? (am ? c.am : c.en) : category;
        })();

  const categoryOptions: Opt[] = [
    { value: 'all', label: am ? 'ሁሉም ምድቦች (All Categories)' : 'All Categories' },
    ...categories.map((c) => ({ value: c.key, label: `${c.en} ${c.am ? `(${c.am})` : ''}`.trim() })),
  ];

  const sortOptions: Opt[] = [
    { value: 'newest', label: am ? 'አዲስ (Latest)' : 'Latest' },
    { value: 'oldest', label: am ? 'የቆየ (Oldest)' : 'Oldest' },
  ];

  return (
    <div data-mz-reveal="section" className="mz-filter grid grid-cols-1 gap-3.5 sm:grid-cols-[1fr_210px_150px]">
      {/* Search */}
      <label className={`mz-search ${box} ${goldFocus} gap-3 px-4`}>
        <SearchIcon className="mz-search-icon h-5 w-5 shrink-0 text-[#0f2352]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={am ? 'በርዕስ፣ በዘማሪ ወይም በቁልፍ ቃል ይፈልጉ...' : 'Search by title, lyrics or keyword...'}
          aria-label={am ? 'መዝሙር ይፈልጉ' : 'Search mezmur'}
          className="w-full bg-transparent outline-hidden placeholder:text-[#9aa3b5]"
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

      {/* Category Dropdown */}
      <Dropdown
        className="mz-cat"
        value={category}
        options={categoryOptions}
        onChange={onCategoryChange}
        ariaLabel={am ? 'ምድብ ይምረጡ' : 'Select category'}
        icon={<MusicIcon className="h-5 w-5 shrink-0 text-[#b9852a]" />}
        buttonLabel={catLabel}
      />

      {/* Sort */}
      <Dropdown
        className="mz-sort"
        align="right"
        value={sort}
        options={sortOptions}
        onChange={(v) => onSortChange(v as MezmurSort)}
        ariaLabel={am ? 'ደርድር' : 'Sort'}
        icon={<SortIcon className="h-[18px] w-[18px] shrink-0 text-[#0f2352]" />}
        buttonLabel={sort === 'newest' ? (am ? 'አዲስ' : 'Latest') : am ? 'የቆየ' : 'Oldest'}
      />
    </div>
  );
}
