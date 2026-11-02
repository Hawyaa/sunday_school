'use client';

/** TeachingsList.tsx — the lesson rows. Shows skeletons while loading and a reset button when nothing matches. */

import React from 'react';
import { TeachingsLessonCard, type TeachingLesson } from './TeachingsLessonCard';

interface Props {
  lessons?: TeachingLesson[];
  isLoading?: boolean;
  onReset?: () => void;
}

export function TeachingsList({ lessons = [], isLoading = false, onReset }: Props) {
  if (isLoading) {
    return <div aria-busy="true">{[0, 1, 2, 3].map((i) => <div key={i} className="mb-2.5 h-[115px] animate-pulse rounded-xl bg-[#f1ece0]" />)}</div>;
  }

  if (lessons.length === 0) {
    return (
      <div className="py-14 text-center font-['Crimson_Text',serif]">
        <p className="text-lg text-[#5a6479]">No teachings match your search.</p>
        {onReset && (
          <button type="button" onClick={onReset} className="mt-3 rounded-full border-[1.5px] border-[#dcc08a] bg-[#fffbf1] px-6 py-2 text-sm text-[#b9852a] transition hover:bg-[#f6e9cd]">
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return <div>{lessons.map((l) => <TeachingsLessonCard key={l.id} item={l} />)}</div>;
}