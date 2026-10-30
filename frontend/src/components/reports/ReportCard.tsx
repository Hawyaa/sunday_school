'use client';

/**
 * ReportCard.tsx
 *
 * One report row: gold icon tile, title, date + size meta, description and
 * a "Download PDF" pill. Restricted reports show a gold "Restricted Access"
 * pill that sends the user to sign in.
 *
 * Optional field on ChurchReport:  iconKey?: 'doc' | 'book' | 'music' | 'chart' | 'lock'
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import type { ChurchReport } from '@/types/report';
import {
  BookIcon,
  CalendarIcon,
  ChartIcon,
  ChevronRight,
  DocIcon,
  DownloadIcon,
  FileIcon,
  LockIcon,
  MusicIcon,
} from '@/components/reports/icons';

interface Props {
  report: ChurchReport;
}

type IconKey = 'doc' | 'book' | 'music' | 'chart' | 'lock';

const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  doc: DocIcon,
  book: BookIcon,
  music: MusicIcon,
  chart: ChartIcon,
  lock: LockIcon,
};

export function ReportCard({ report }: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const title = am && report.titleAm ? report.titleAm : report.title;
  const description = am && report.descriptionAm ? report.descriptionAm : report.description;
  const key = ((report as { iconKey?: IconKey }).iconKey ?? (report.isRestricted ? 'lock' : 'doc')) as IconKey;
  const Icon = ICONS[key] ?? DocIcon;

  return (
    <article className="mb-[9px] grid grid-cols-1 items-center gap-4 rounded-xl border border-[#ece5d8] bg-[#fffdf9] px-5 py-[9px] shadow-[0_2px_10px_rgba(15,35,82,0.05)] transition hover:border-[#c8952f] sm:grid-cols-[64px_1fr_auto] sm:gap-[30px] sm:pl-[22px]">
      {/* Icon tile */}
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[linear-gradient(#fdf7ea,#f6ead2)] text-[#b9852a] shadow-[0_4px_10px_rgba(185,133,42,0.18)]">
        <Icon className="h-[34px] w-[34px]" />
      </div>

      {/* Details */}
      <div className="min-w-0">
        <h3 className="font-['Crimson_Text',serif] text-[19px] font-semibold leading-[1.2] text-[#0f2352]">
          {title}
        </h3>

        <div className="my-[3px] flex flex-wrap items-center gap-3 font-['Crimson_Text',serif] text-[13.5px] text-[#6b7690]">
          <span className="flex items-center gap-[7px]">
            <CalendarIcon className="h-3.5 w-3.5 text-[#b9852a]" />
            {report.dateStr}
          </span>
          {report.fileSize && (
            <>
              <u className="h-3.5 w-px bg-[#e3dccb] no-underline" />
              <span className="flex items-center gap-[7px]">
                <FileIcon className="h-3.5 w-3.5 text-[#b9852a]" />
                {report.fileSize}
              </span>
            </>
          )}
        </div>

        <p className="text-[14.5px] leading-[1.25] text-[#35609a]">
          {report.isRestricted
            ? am
              ? 'ይህ ሪፖርት ለተፈቀደላቸው አባላት ብቻ ክፍት ነው።'
              : 'This report is restricted to authorized members only.'
            : description}
        </p>
      </div>

      {/* Action */}
      {report.isRestricted ? (
        <Link
          href="/admin"
          className="mr-1.5 flex items-center justify-center gap-3 justify-self-start rounded-full bg-[linear-gradient(#d3a03c,#b9852a)] px-5 py-2.5 font-[Inter,sans-serif] text-xs font-medium text-white sm:justify-self-auto"
        >
          <LockIcon className="h-[15px] w-[15px]" />
          {am ? 'የተገደበ መዳረሻ' : 'Restricted Access'}
          <ChevronRight className="h-[11px] w-[11px]" />
        </Link>
      ) : (
        <a
          href={report.fileUrl || '#'}
          download
          className="flex w-full items-center gap-3.5 justify-self-start rounded-full border-[1.5px] border-[#e4c88a] bg-[#fffbf1] py-1.5 pl-[22px] pr-[18px] text-[#b9852a] transition hover:bg-[#fff4d9] sm:w-[184px] sm:justify-self-auto"
        >
          <DownloadIcon className="h-[19px] w-[19px]" />
          <div className="font-[Inter,sans-serif] text-[11.5px] font-medium leading-[1.25] text-[#7a5a1e]">
            {am ? 'ፒዲኤፍ አውርድ' : 'Download PDF'}
            {report.fileSize && <small className="block text-[10px] text-[#8a7a5a]">{report.fileSize}</small>}
          </div>
          <ChevronRight className="ml-auto h-[13px] w-[13px]" />
        </a>
      )}
    </article>
  );
}