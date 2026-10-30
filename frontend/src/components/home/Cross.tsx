import React from 'react';
import Image from 'next/image';

/** Gold Ethiopian Orthodox cross. File: public/images/cross.png. Size it with className (height). */
export function Cross({ className = 'h-[42px]' }: { className?: string }) {
  return (
    <Image src="/images/cross.png" alt="" aria-hidden="true" width={213} height={420}
      className={`w-auto select-none pointer-events-none ${className}`} />
  );
}