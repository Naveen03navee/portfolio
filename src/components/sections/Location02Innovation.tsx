/**
 * @file clients/portfolio/src/components/sections/Location02Innovation.tsx
 * @description Location 02 — The Innovation Boulevard: About narrative and verified academic chronology.
 */

import React from 'react';
import { EDUCATION_DATA, PROFILE_INFO } from '../../data/portfolioData.js';
import { IconCheck, IconChevronRight } from '../ui/Icons.js';

export interface Location02InnovationProps {
  readonly onNextLocationClick: () => void;
}

export const Location02Innovation: React.FC<Location02InnovationProps> = ({ onNextLocationClick }) => {
  return (
    <section
      id="location-innovation"
      aria-label="Location 02: The Innovation Boulevard"
      className="min-h-screen flex items-center justify-center relative px-4 md:px-8 py-24"
    >
      <div className="w-full max-w-5xl mx-auto z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-obsidian-950/85 backdrop-blur-xl border border-white/15 shadow-2xl">
          {/* Header */}
          <div className="space-y-2 border-b border-white/10 pb-6">
            <p className="font-mono text-xs tracking-widest text-accent-cyan uppercase">
              LOCATION 02 // THE INNOVATION BOULEVARD
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              About, Education & Architectural Foundations
            </h2>
            <p className="text-xs md:text-sm font-mono text-titanium-400">
              Verified credentials from primary factual authority
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: About Summary */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-accent-cyan">
                Professional Overview
              </h3>
              <p className="text-sm text-titanium-200 leading-relaxed font-body">
                {PROFILE_INFO.summary}
              </p>

              <div className="p-4 rounded-xl bg-obsidian-900/90 border border-white/10 space-y-2 text-xs font-mono text-titanium-300">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <IconCheck size={16} className="text-accent-cyan" />
                  <span>Engineering Pillars</span>
                </div>
                <p className="text-[11px] text-titanium-400">
                  • Grounded RAG with ChromaDB & FAISS
                  <br />• Deterministic Pydantic & JSON validation
                  <br />• Containerized multi-tier cloud microservices
                </p>
              </div>
            </div>

            {/* Right: Verified Education Chronology */}
            <div className="lg:col-span-7 space-y-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-accent-cyan">
                Verified Academic Chronology
              </h3>

              <div className="space-y-4">
                {EDUCATION_DATA.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 hover:border-accent-cyan/30 transition-all space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display font-bold text-white text-base">
                        {edu.degree}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-accent-amber/15 text-accent-amber border border-accent-amber/30">
                        {edu.period}
                      </span>
                    </div>

                    <p className="font-mono text-xs text-accent-cyan font-medium">
                      {edu.institution}
                    </p>

                    <p className="text-xs text-titanium-300 font-body">
                      {edu.focus}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 pt-1">
                      <IconCheck size={12} />
                      <span>{edu.location} • Verified Credential</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Trigger */}
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={onNextLocationClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              <span>PROCEED TO TECHNOLOGY DISTRICT</span>
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

