import React from 'react';

/**
 * SplitWords: wraps every word in a masked span so a parent animation can slide
 * the words up from behind the mask. Works for Latin and Amharic (splits on spaces).
 *
 * Contract: each word's inner span carries `data-split-word`. Animate those.
 * Before the animation runs, the words sit below the mask (motion-safe only).
 */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span className="-mb-[0.14em] -mr-[0.06em] -mt-[0.08em] inline-block overflow-hidden pb-[0.14em] pr-[0.06em] pt-[0.08em] align-top">
            <span
              data-split-word
              className="inline-block will-change-transform motion-safe:[transform:translateY(110%)]"
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </>
  );
}