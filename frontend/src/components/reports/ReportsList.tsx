'use client';

/**
 * ReportsList.tsx
 */

import React from 'react';
import { ReportCard } from '@/components/reports/ReportCard';
import type { ChurchReport } from '@/types/report';

interface Props {
  reports: ChurchReport[];
  isLoading?: boolean;
  onView?: (report: ChurchReport) => void; // opens the PDF viewer
}

export function ReportsList({ reports, isLoading, onView }: Props) {
  if (isLoading) {
    return (
      <div aria-busy="true">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="mb-[9px] flex animate-pulse items-center justify-between rounded-xl border border-[#ece5d8] bg-[#fffdf9] px-5 py-[9px]"
          >
            <div className="flex items-center gap-[30px]">
              <div className="h-16 w-16 rounded-2xl bg-[#f6ead2]" />
              <div className="space-y-2">
                <div className="h-4 w-52 rounded bg-[#ece5d8]" />
                <div className="h-3 w-28 rounded bg-[#ece5d8]" />
                <div className="h-3 w-72 rounded bg-[#ece5d8]" />
              </div>
            </div>
            <div className="hidden h-10 w-[184px] rounded-full bg-[#ece5d8] sm:block" />
          </div>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="mb-[9px] rounded-xl border border-[#ece5d8] bg-[#fffdf9] p-8 text-center text-sm text-[#5a6479]">
        ምንም ሪፖርት አልተገኘም። (No reports found matching your criteria.)
      </div>
    );
  }

  return (
    <div>
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} onView={onView} />
      ))}
    </div>
  );
}