import React from 'react';

/**
 * SplitWords.tsx — splits a heading into words, each inside a mask, so GSAP can slide them up.
 *
 * Visible by default: the words are NOT hidden by CSS, so the heading always shows (server render,
 * no JS, reduced motion). GSAP hides them (yPercent 110) only when the entrance animation actually starts.
 *
 * Every word is a  <span data-split-word>  (the hero hooks animate these).
 * The mask has a little padding so descenders and italic letters are never clipped.
 */

export function SplitWords({ text }: { text: string }) {
  const words = text.split(' ').filter(Boolean);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <React.Fragment key={`${word}-${i}`}>
            <span
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'bottom',
                padding: '0.12em 0.08em',
                margin: '-0.12em -0.08em',
              }}
            >
              <span data-split-word style={{ display: 'inline-block', willChange: 'transform' }}>
                {word}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </span>
    </>
  );
}