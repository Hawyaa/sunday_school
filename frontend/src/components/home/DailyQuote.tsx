'use client';

/**
 * DailyQuote.tsx
 *
 * Pure presentational sidebar widget — scripture quote.
 * Initializes with default quote for static prerender, rotates client-side.
 */

import React, { useState, useEffect } from 'react';

interface Quote {
  text: string;
  reference: string;
}

const QUOTES: Quote[] = [
  { text: '"በልቤ ሁሌ አምላኬን በቸርነቱ ደስ እላለሁ፤ እኛም በእርሱ እንንቀሳቀሳለን..."', reference: '— መጽሐፍ ቅዱስ መዝሙር 18:20' },
  { text: '"እግዚአብሔር ብርሃኔና መድኃኒቴ ነው፤ ከማን እፈራለሁ?"', reference: '— መዝሙር 27:1' },
  { text: '"ጥበብ ትጀምር ዘንድ እግዚአብሔርን መፍራት ነው።"', reference: '— ምሳሌ 9:10' },
  { text: '"ቅን ሰው ፍቅር ይወዳሉ፤ ፊቱም ቅኖቹን ያያሉ።"', reference: '— መዝሙር 11:7' },
  { text: '"ወደ እኔ ኑ ደካሞችና ሸካሞች ሆይ፤ እኔ አሳርፋችኋለሁ።"', reference: '— ማቴዎስ 11:28' },
  { text: '"እግዚአብሔርን ወዱ፤ ሁሉ ነገር ለበጎ ይሆናል።"', reference: '— ሮሜ 8:28' },
  { text: '"እምነት ተስፋ ለምናደርጋቸው ነገሮች ማረጋጫ ነው።"', reference: '— ዕብራውያን 11:1' },
];

export function DailyQuote() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    setQuoteIndex(new Date().getDay() % QUOTES.length);
  }, []);

  const quote = QUOTES[quoteIndex] || QUOTES[0]!;

  return (
    <div className="bg-[#1E2A5E] border-l-4 border-[#C99A3B] rounded-xl p-5 text-white">
      <p className="text-[13px] leading-relaxed mb-3 italic">{quote.text}</p>
      <span className="text-xs text-[#C99A3B] block text-right font-semibold">
        {quote.reference}
      </span>
    </div>
  );
}
