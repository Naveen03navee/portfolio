/**
 * @file clients/portfolio/src/components/sections/portfolio2d/Career2D.tsx
 * @description Structured Professional Experience and Academic Credentials on Warm Light Editorial surfaces.
 */

import React from 'react';
import { EDUCATION_DATA, EXPERIENCE_DATA } from '../../../data/portfolioData.js';
import { SectionHeading } from '../../ui/SectionHeading.js';
import { IconCheck } from '../../ui/Icons.js';

export const Career2D: React.FC = () => {
  return (
    <>
      {/* 4. PROFESSIONAL EXPERIENCE */}
      <section
        id="section-experience"
        aria-labelledby="experience-heading"
        className="scroll-mt-20 py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E8E4DC] bg-[#FFFFFF]"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            index="04"
            eyebrow="Professional Experience"
            title="Industry Engineering Experience"
            headingId="experience-heading"
          />

          <div className="mt-8 space-y-6">
            {EXPERIENCE_DATA.map((exp, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-xl bg-[#F5F3EE]/60 border border-[#E3DED3] space-y-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E3DED3] pb-5">
                  <div>
                    <h3 className="font-display font-bold text-[#252A2A] text-xl sm:text-2xl tracking-[-0.015em]">
                      {exp.role}
                    </h3>
                    <p className="font-body text-sm sm:text-base text-[#785E37] font-medium mt-1">
                      {exp.company} · {exp.location}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#525955] px-3 py-1.5 rounded-md bg-white border border-[#E3DED3]">
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-3 text-sm sm:text-[15px] text-[#525955] leading-relaxed font-body">
                  {exp.description.map((item, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3">
                      <IconCheck size={16} className="text-[#4A685D] shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-[#E3DED3] flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-white border border-[#E3DED3] text-xs font-mono text-[#525955]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EDUCATION */}
      <section
        id="section-education"
        aria-labelledby="education-heading"
        className="scroll-mt-20 py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E8E4DC] bg-[#EDEAE2]/65"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            index="05"
            eyebrow="Education"
            title="Academic Credentials"
            headingId="education-heading"
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {EDUCATION_DATA.map((edu, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-xl bg-[#FFFFFF] border border-[#E3DED3] space-y-3 shadow-[0_4px_16px_rgba(37,42,42,0.04)]"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-xs text-[#785E37] font-semibold">
                    {edu.period}
                  </span>
                  <span className="font-mono text-xs text-[#69716D]">{edu.location}</span>
                </div>
                <h3 className="font-display font-bold text-[#252A2A] text-lg sm:text-xl leading-snug">
                  {edu.degree}
                </h3>
                <p className="font-body text-sm font-semibold text-[#4A685D]">{edu.institution}</p>
                <p className="font-body text-sm text-[#69716D] leading-relaxed">{edu.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
