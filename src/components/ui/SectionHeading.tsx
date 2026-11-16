/**
 * @file clients/portfolio/src/components/ui/SectionHeading.tsx
 * @description Warm editorial light section heading pairing restrained monospace indices
 * with Manrope display headlines and Inter secondary copy.
 */

import React from 'react';

export interface SectionHeadingProps {
  readonly index: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly headingId: string;
  readonly subtitle?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  eyebrow,
  title,
  headingId,
  subtitle,
}) => {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2.5 font-mono text-xs tracking-[0.12em] uppercase">
        <span className="text-[#4A685D] font-semibold">{index}</span>
        <span className="h-px w-5 bg-[#E3DED3]" aria-hidden="true" />
        <span className="text-[#525955]">{eyebrow}</span>
      </div>
      <h2
        id={headingId}
        className="mt-2.5 font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#252A2A] leading-tight"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 font-body text-base text-[#525955] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
