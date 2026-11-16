/**
 * @file clients/portfolio/src/components/sections/Location03Technology.tsx
 * @description Location 03 — The Technology District: 6 technical categories with zero fake percentages.
 */

import React, { useState } from 'react';
import { TECHNICAL_CATEGORIES } from '../../data/portfolioData.js';
import type { TechCategoryDomain } from '../../types/portfolio.types.js';
import { IconChevronRight } from '../ui/Icons.js';

export interface Location03TechnologyProps {
  readonly onNextLocationClick: () => void;
}

export const Location03Technology: React.FC<Location03TechnologyProps> = ({ onNextLocationClick }) => {
  const [selectedDomain, setSelectedDomain] = useState<TechCategoryDomain | 'ALL'>('ALL');

  const filteredCategories = selectedDomain === 'ALL'
    ? TECHNICAL_CATEGORIES
    : TECHNICAL_CATEGORIES.filter((c) => c.domain === selectedDomain);

  return (
    <section
      id="location-technology"
      aria-label="Location 03: The Technology District"
      className="min-h-screen flex items-center justify-center relative px-4 md:px-8 py-24"
    >
      <div className="w-full max-w-6xl mx-auto z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-obsidian-950/85 backdrop-blur-xl border border-white/15 shadow-2xl">
          {/* Header */}
          <div className="space-y-2 border-b border-white/10 pb-6">
            <p className="font-mono text-xs tracking-widest text-accent-cyan uppercase">
              LOCATION 03 // THE TECHNOLOGY DISTRICT
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              Production Capabilities & Technology Taxonomy
            </h2>
            <p className="text-xs md:text-sm font-mono text-titanium-400">
              Verified tech stack supported by codebases and production implementations
            </p>
          </div>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Technology Domain Filters">
            <button
              type="button"
              role="tab"
              aria-selected={selectedDomain === 'ALL'}
              onClick={() => setSelectedDomain('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                selectedDomain === 'ALL'
                  ? 'bg-accent-cyan text-obsidian-950 font-bold'
                  : 'bg-obsidian-900/90 text-titanium-400 hover:text-white border border-white/10'
              }`}
            >
              ALL DOMAINS ({TECHNICAL_CATEGORIES.length})
            </button>
            {TECHNICAL_CATEGORIES.map((cat) => (
              <button
                key={cat.domain}
                type="button"
                role="tab"
                aria-selected={selectedDomain === cat.domain}
                onClick={() => setSelectedDomain(cat.domain)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                  selectedDomain === cat.domain
                    ? 'bg-accent-cyan text-obsidian-950 font-bold'
                    : 'bg-obsidian-900/90 text-titanium-400 hover:text-white border border-white/10'
                }`}
              >
                {cat.domain}
              </button>
            ))}
          </div>

          {/* 6 Category Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat, idx) => (
              <div
                key={cat.domain}
                className="p-6 rounded-2xl bg-obsidian-900/80 border border-white/10 hover:border-accent-cyan/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-accent-cyan font-semibold tracking-wider">
                      MODULE 0{idx + 1}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-accent-cyan/60" />
                  </div>
                  <h3 className="font-display font-bold text-white text-base mt-2">
                    {cat.domain}
                  </h3>
                  <p className="text-xs text-titanium-300 mt-1 font-body leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-titanium-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Trigger */}
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={onNextLocationClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              <span>PROCEED TO PROJECT EXHIBITION DISTRICT</span>
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

