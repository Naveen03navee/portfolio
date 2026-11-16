/**
 * @file clients/portfolio/src/components/sections/Location05Campus.tsx
 * @description Location 05 — The Engineering Campus: Verified Decembay Technologies internship experience.
 */

import React from 'react';
import { EXPERIENCE_DATA } from '../../data/portfolioData.js';
import { IconCheck, IconChevronRight, IconShield } from '../ui/Icons.js';

export interface Location05CampusProps {
  readonly onNextLocationClick: () => void;
}

export const Location05Campus: React.FC<Location05CampusProps> = ({ onNextLocationClick }) => {
  const exp = EXPERIENCE_DATA[0];

  return (
    <section
      id="location-campus"
      aria-label="Location 05: The Engineering Campus"
      className="min-h-screen flex items-center justify-center relative px-4 md:px-8 py-24"
    >
      <div className="w-full max-w-5xl mx-auto z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-obsidian-950/85 backdrop-blur-xl border border-white/15 shadow-2xl">
          {/* Header */}
          <div className="space-y-2 border-b border-white/10 pb-6">
            <p className="font-mono text-xs tracking-widest text-accent-cyan uppercase">
              LOCATION 05 // THE ENGINEERING CAMPUS
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              Professional Industry Experience
            </h2>
            <p className="text-xs md:text-sm font-mono text-titanium-400">
              Verified tenure and production contributions at Decembay Technologies
            </p>
          </div>

          {/* Timeline Card */}
          <div className="mt-8 p-6 md:p-8 rounded-2xl bg-obsidian-900/80 border border-white/10 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
                  VERIFIED INDUSTRY INTERNSHIP
                </span>
                <h3 className="font-display font-bold text-white text-xl md:text-2xl mt-2">
                  {exp.role}
                </h3>
                <p className="font-mono text-sm text-accent-amber font-medium">
                  {exp.company} • {exp.location}
                </p>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {exp.period}
                </span>
                <p className="text-[11px] font-mono text-titanium-400 mt-1">Status: Completed</p>
              </div>
            </div>

            {/* Deliverables List */}
            <div className="space-y-3.5 pt-2">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent-cyan">
                Engineering Deliverables & Production Impact
              </h4>
              <ul className="space-y-3">
                {exp.description.map((desc, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-titanium-200 font-body leading-relaxed">
                    <IconCheck size={18} className="text-accent-cyan shrink-0 mt-1" />
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Chips */}
            <div className="pt-4 border-t border-white/10">
              <span className="text-xs font-mono text-titanium-400 block mb-2 font-semibold">
                Core Stack Applied:
              </span>
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-titanium-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Verification Note */}
            <div className="p-3.5 rounded-xl bg-obsidian-950/70 border border-white/5 flex items-center gap-2.5 text-xs font-mono text-titanium-400">
              <IconShield size={16} className="text-accent-cyan shrink-0" />
              <span>Factual record verified against primary candidate credentials • Bengaluru, India</span>
            </div>
          </div>

          {/* Footer Trigger */}
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={onNextLocationClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              <span>PROCEED TO SKYLINE DESTINATION</span>
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

