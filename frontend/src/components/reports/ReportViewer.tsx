'use client';

/**
 * ReportViewer.tsx  (components/reports/ReportViewer.tsx)
 *
 * Opens a report PDF inside the website (pop-up with the PDF in it).
 * Closes with the ✕ button, the Esc key, or a click on the dark area.
 * Supports: http(s) links, backend-relative links (/uploads/...), and data: / blob: links
 * (data: PDFs are converted to a blob URL so the viewer, "Open in new tab" and "Download" all work).
 */

import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { DownloadIcon } from '@/components/reports/icons';
import type { ChurchReport } from '@/types/report';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

/** Relative paths like /uploads/reports/a.pdf are served by the backend. */
export function reportFileUrl(url?: string | null): string | null {
  if (!url || url === '#') return null;
  if (/^(https?:|data:|blob:)/i.test(url)) return url; // already absolute / inline
  return `${API}${url.startsWith('/') ? '' : '/'}${url}`;
}

interface Props {
  report: ChurchReport | null;
  onClose: () => void;
}

export function ReportViewer({ report, onClose }: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';
  const closeBtn = useRef<HTMLButtonElement>(null);

  const raw = report ? reportFileUrl(report.fileUrl) : null;
  const [url, setUrl] = useState<string | null>(null);

  // data: PDFs -> blob URL (browsers block data: links in new tabs and large iframes)
  useEffect(() => {
    if (!raw) {
      setUrl(null);
      return;
    }
    if (!raw.startsWith('data:')) {
      setUrl(raw);
      return;
    }
    let cancelled = false;
    let objectUrl: string | null = null;
    fetch(raw)
      .then((r) => r.blob())
      .then((b) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(new Blob([b], { type: 'application/pdf' }));
        setUrl(objectUrl);
      })
      .catch(() => !cancelled && setUrl(null));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [raw]);

  // Esc to close, lock page scroll, focus the close button, return focus afterwards
  useEffect(() => {
    if (!report) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [report, onClose]);

  if (!report) return null;

  const title = am && report.titleAm ? report.titleAm : report.title;
  const converting = !!raw && !url;
  const link =
    'inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-[#e4c88a] bg-[#fffbf1] px-4 font-[Inter,sans-serif] text-xs font-medium text-[#7a5200] transition hover:bg-[#fff4d9]';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1a3f]/70 p-3 sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-viewer-title"
        className="flex h-[92vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl border border-[#ecdcb8] bg-[#fffdf9] shadow-[0_20px_60px_rgba(0,0,0,.4)]"
      >
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#ece5d8] px-4 py-3">
          <h2 id="report-viewer-title" className="min-w-0 flex-1 truncate font-['Crimson_Text',serif] text-[19px] font-semibold text-[#0f2352]">
            {title}
          </h2>

          {url && (
            <>
              <a href={url} target="_blank" rel="noopener noreferrer" className={link}>
                {am ? 'በአዲስ ትር ክፈት' : 'Open in new tab'}
              </a>
              <a href={url} download={`${title}.pdf`} className={link}>
                <DownloadIcon className="h-4 w-4" />
                {am ? 'አውርድ' : 'Download'}
              </a>
            </>
          )}

          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label={am ? 'ዝጋ' : 'Close'}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#0f2352] text-lg text-white transition hover:bg-[#35609a]"
          >
            ✕
          </button>
        </div>

        {/* PDF */}
        <div className="min-h-0 flex-1 bg-[#eef1f6]">
          {url ? (
            <iframe src={`${url}#view=FitH`} title={title} className="h-full w-full border-0" />
          ) : (
            <p className="grid h-full place-items-center p-8 text-center font-['Crimson_Text',serif] text-lg text-[#5a6479]">
              {converting
                ? am ? 'በመጫን ላይ…' : 'Loading PDF…'
                : am ? 'ፋይሉ ገና አልተጫነም።' : 'The PDF file has not been uploaded yet.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}