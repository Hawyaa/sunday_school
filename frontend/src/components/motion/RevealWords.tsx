import React from 'react';

interface Props {
  text: string;
  className?: string;
  /** offset so a second RevealWords continues the stagger of the first */
  startIndex?: number;
  baseDelay?: number;
  stagger?: number;
}

export function RevealWords({
  text,
  className = '',
  startIndex = 0,
  baseDelay = 200,
  stagger = 90,
}: Props) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="inline-block overflow-hidden align-bottom py-[0.12em] -my-[0.12em] pr-[0.06em]">
            <span
              className="word-rise inline-block"
              style={{ animationDelay: `${baseDelay + (startIndex + i) * stagger}ms` }}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </span>
  );
}