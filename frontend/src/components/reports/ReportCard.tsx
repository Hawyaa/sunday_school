'use client';

/**
 * ReportCard.tsx
 *
 * One report row: gold icon tile, title, date + size meta, description and a "View PDF" pill
 * (opens the PDF inside the website through `onView`).
 *
 * Animation (plays when the card scrolls into view, staggered by `index`):
 *   card fade up · icon scale in · title fade · meta staggered fade · button slides in from the right
 * Hover: slight lift, deeper shadow, icon scales.
 *
 * Optional field on ChurchReport:  iconKey?: 'doc' | 'book' | 'music' | 'chart'
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import type { ChurchReport } from '@/types/report';
import { RmGroup, rmDelay } from '@/components/reports/motion';
import {
  BookIcon,
  CalendarIcon,
  ChartIcon,
  ChevronRight,
  DocIcon,
  FileIcon,
  MusicIcon,
} from '@/components/reports/icons';

interface Props {
  report: ChurchReport;
  onView?: (report: ChurchReport) => void; // opens the PDF viewer
  index?: number; // position in the list → stagger delay
}

type IconKey = 'doc' | 'book' | 'music' | 'chart';

const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  doc: DocIcon,
  book: BookIcon,
  music: MusicIcon,
  chart: ChartIcon,
};

export function ReportCard({ report, onView, index = 0 }: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const title = am && report.titleAm ? report.titleAm : report.title;
  const description = am && report.descriptionAm ? report.descriptionAm : report.description;
  const key = (report as { iconKey?: string }).iconKey as IconKey | undefined;
  const Icon = (key && ICONS[key]) || DocIcon;

  const d = Math.min(index, 5) * 110; // stagger, capped so long lists don't wait

  return (
    <RmGroup rm="up" delay={d}>
      <article className="group mb-[9px] grid grid-cols-1 items-center gap-4 rounded-xl border border-[#ece5d8] bg-[#fffdf9] px-5 py-[9px] shadow-[0_2px_10px_rgba(15,35,82,0.05)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-[3px] hover:border-[#c8952f] hover:shadow-[0_12px_26px_rgba(15,35,82,0.12)] sm:grid-cols-[64px_1fr_auto] sm:gap-[30px] sm:pl-[22px]">
        {/* Icon tile — scale in */}
        <div data-rm="scale" style={rmDelay(d + 120)}>
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[linear-gradient(#fdf7ea,#f6ead2)] text-[#b9852a] shadow-[0_4px_10px_rgba(185,133,42,0.18)]">
            <Icon className="h-[34px] w-[34px] transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>

        {/* Details */}
        <div className="min-w-0">
          <h3
            data-rm="fade"
            style={rmDelay(d + 220)}
            className="font-['Crimson_Text',serif] text-[19px] font-semibold leading-[1.2] text-[#0f2352]"
          >
            {title}
          </h3>

          <div className="my-[3px] flex flex-wrap items-center gap-3 font-['Crimson_Text',serif] text-[13.5px] text-[#6b7690]">
            <span data-rm="fade" style={rmDelay(d + 320)} className="flex items-center gap-[7px]">
              <CalendarIcon className="h-3.5 w-3.5 text-[#b9852a]" />
              {report.dateStr}
            </span>
            {report.fileSize && (
              <>
                <u data-rm="fade" style={rmDelay(d + 380)} className="h-3.5 w-px bg-[#e3dccb] no-underline" />
                <span data-rm="fade" style={rmDelay(d + 440)} className="flex items-center gap-[7px]">
                  <FileIcon className="h-3.5 w-3.5 text-[#b9852a]" />
                  {report.fileSize}
                </span>
              </>
            )}
          </div>

          {description && (
            <p data-rm="fade" style={rmDelay(d + 500)} className="text-[14.5px] leading-[1.25] text-[#35609a]">
              {description}
            </p>
          )}
        </div>

        {/* Action — slide in from the right */}
        <div data-rm="right" style={rmDelay(d + 350)} className="w-full justify-self-start sm:w-[184px] sm:justify-self-auto">
          <button
            type="button"
            onClick={() => onView?.(report)}
            aria-label={`${am ? 'ፒዲኤፍ ክፈት' : 'View PDF'}: ${title}`}
            className="flex min-h-11 w-full cursor-pointer items-center gap-3.5 rounded-full border-[1.5px] border-[#e4c88a] bg-[#fffbf1] py-1.5 pl-[22px] pr-[18px] text-left text-[#b9852a] transition duration-300 hover:scale-[1.03] hover:bg-[#fff4d9] hover:shadow-[0_6px_16px_rgba(185,133,42,0.18)]"
          >
            <FileIcon className="h-[19px] w-[19px]" />
            <div className="font-[Inter,sans-serif] text-[11.5px] font-medium leading-[1.25] text-[#7a5a1e]">
              {am ? 'ፒዲኤፍ ክፈት' : 'View PDF'}
              {report.fileSize && <small className="block text-[10px] text-[#8a7a5a]">{report.fileSize}</small>}
            </div>
            <ChevronRight className="ml-auto h-[13px] w-[13px] transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </article>
    </RmGroup>
  );
}