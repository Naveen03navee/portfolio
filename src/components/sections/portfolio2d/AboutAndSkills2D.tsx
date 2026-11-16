/**
 * @file clients/portfolio/src/components/sections/portfolio2d/AboutAndSkills2D.tsx
 * @description Light Warm Editorial About section and filterable 6-domain Technical Skills matrix.
 */

import React, { useState } from 'react';
import { PROFILE_INFO, TECHNICAL_CATEGORIES } from '../../../data/portfolioData.js';
import type { TechCategoryDomain } from '../../../types/portfolio.types.js';
import { SectionHeading } from '../../ui/SectionHeading.js';
import { IconCheck } from '../../ui/Icons.js';

export const AboutAndSkills2D: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<TechCategoryDomain | 'ALL'>('ALL');

  const filteredCategories =
    selectedDomain === 'ALL'
      ? TECHNICAL_CATEGORIES
      : TECHNICAL_CATEGORIES.filter((cat) => cat.domain === selectedDomain);

  return (
    <>
      {/* 2. ABOUT / ENGINEERING FOCUS */}
      <section
        id="section-about"
        aria-labelledby="about-heading"
        className="scroll-mt-20 py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E8E4DC] bg-[#FFFFFF]"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5">
            <SectionHeading
              index="02"
              eyebrow="About"
              title="Engineering Focus & System Reliability"
              headingId="about-heading"
            />
            <p className="text-base text-[#525955] leading-relaxed font-body">
              {PROFILE_INFO.summary}
            </p>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-7 rounded-xl bg-[#F5F3EE] border border-[#E3DED3] space-y-4">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#785E37]">
              Core Engineering Pillars
            </h3>
            <ul className="space-y-3 text-sm text-[#252A2A] font-body leading-relaxed">
              <li className="flex items-start gap-2.5">
                <IconCheck size={16} className="text-[#4A685D] shrink-0 mt-0.5" />
                <span>Grounded RAG pipelines backed by ChromaDB &amp; FAISS vector stores</span>
              </li>
              <li className="flex items-start gap-2.5">
                <IconCheck size={16} className="text-[#4A685D] shrink-0 mt-0.5" />
                <span>Deterministic schema validation across Python &amp; TypeScript backends</span>
              </li>
              <li className="flex items-start gap-2.5">
                <IconCheck size={16} className="text-[#4A685D] shrink-0 mt-0.5" />
                <span>Containerized Docker deployments orchestrated on AWS EC2 &amp; edge CDNs</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. TECHNICAL SKILLS */}
      <section
        id="section-skills"
        aria-labelledby="skills-heading"
        className="scroll-mt-20 py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E8E4DC] bg-[#F5F3EE]"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            index="03"
            eyebrow="Technical Skills"
            title="Production Capabilities & Stack Taxonomy"
            headingId="skills-heading"
          />

          <div
            className="mt-7 mb-8 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter technical skills by domain"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedDomain === 'ALL'}
              onClick={() => setSelectedDomain('ALL')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-body font-medium transition-colors duration-editorial min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D] ${
                selectedDomain === 'ALL'
                  ? 'bg-[#4A685D] text-white font-semibold'
                  : 'bg-[#FFFFFF] text-[#525955] hover:text-[#252A2A] border border-[#E3DED3]'
              }`}
            >
              All Domains ({TECHNICAL_CATEGORIES.length})
            </button>
            {TECHNICAL_CATEGORIES.map((cat) => (
              <button
                key={cat.domain}
                type="button"
                role="tab"
                aria-selected={selectedDomain === cat.domain}
                onClick={() => setSelectedDomain(cat.domain)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-body font-medium transition-colors duration-editorial min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D] ${
                  selectedDomain === cat.domain
                    ? 'bg-[#4A685D] text-white font-semibold'
                    : 'bg-[#FFFFFF] text-[#525955] hover:text-[#252A2A] border border-[#E3DED3]'
                }`}
              >
                {cat.domain}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat.domain}
                className="p-6 rounded-xl bg-[#FFFFFF] border border-[#E3DED3] flex flex-col justify-between shadow-[0_4px_16px_rgba(37,42,42,0.04)]"
              >
                <div>
                  <h3 className="font-display font-bold text-[#252A2A] text-lg tracking-[-0.01em]">
                    {cat.domain}
                  </h3>
                  <p className="text-sm text-[#69716D] mt-1.5 leading-relaxed font-body">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E8E4DC] flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md bg-[#F5F3EE] border border-[#E3DED3] text-[11px] font-mono text-[#525955]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
