/**
 * @file clients/portfolio/src/components/sections/portfolio2d/Hero2D.tsx
 * @description Light Warm Editorial two-column hero pairing Naveen B's verified engineering
 * identity with a matte-framed capture of the CWE 3D sports-car and skyline experience.
 */

import React from 'react';
import { PROFILE_INFO } from '../../../data/portfolioData.js';
import { IconArrowRight, IconFileText, IconMail } from '../../ui/Icons.js';

export interface Hero2DProps {
  readonly onScrollToSection: (id: string) => void;
  readonly onOpenResume: () => void;
}

export const Hero2D: React.FC<Hero2DProps> = ({ onScrollToSection, onOpenResume }) => {
  return (
    <section
      id="section-hero"
      aria-labelledby="hero-heading"
      className="scroll-mt-20 pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8 bg-[#F5F3EE] border-b border-[#E8E4DC]"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Editorial Identity & Primary Actions */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EDEAE2] border border-[#E3DED3] text-[#525955] font-body text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#2F855A]" aria-hidden="true" />
            <span>Open to Full-Stack AI &amp; Systems Engineering Roles</span>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-display font-extrabold tracking-[-0.03em] text-[#252A2A] leading-[1.04]"
          >
            NAVEEN B
          </h1>

          <p className="mt-3 text-xl sm:text-2xl font-display font-bold text-[#4A685D] tracking-[-0.015em]">
            FULL-STACK AI ENGINEER
          </p>
          <p className="mt-1.5 text-sm sm:text-base font-body font-medium text-[#69716D] tracking-wide">
            AI AUTOMATION &amp; SYSTEMS DEVELOPER · BENGALURU, INDIA
          </p>

          <p className="mt-6 text-base text-[#525955] leading-relaxed max-w-2xl font-body">
            {PROFILE_INFO.summary}
          </p>

          {/* Action Hierarchy: Sage Primary -> White Secondary -> Subtle Tertiary */}
          <div className="mt-8 pt-6 border-t border-[#E8E4DC] flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onScrollToSection('section-projects')}
              className="cwe-editorial-btn-primary"
            >
              <span>Explore My Work</span>
              <IconArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={onOpenResume}
              className="cwe-editorial-btn-secondary"
            >
              <IconFileText size={16} className="text-[#4A685D]" />
              <span>View Resume</span>
            </button>

            <button
              type="button"
              onClick={() => onScrollToSection('section-contact')}
              className="cwe-editorial-btn-tertiary"
            >
              <IconMail size={16} />
              <span>Contact Me</span>
            </button>
          </div>
        </div>

        {/* Right Column: Matte Gallery Frame of Genuine CWE 3D Portfolio Scene */}
        <div className="lg:col-span-5">
          <figure className="overflow-hidden rounded-xl bg-[#FFFFFF] border border-[#E3DED3] p-2.5 shadow-[0_12px_36px_rgba(37,42,42,0.08)]">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#181C20]">
              <img
                src="/assets/previews/hero-3d-city.png"
                alt="Creative Web Engine 3D interactive skyline featuring Naveen B architectural gantry and custom sports car"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <figcaption className="pt-4 px-2 pb-1.5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#785E37] font-semibold">
                  Creative Web Engine · 3D Edition
                </span>
                <span className="font-mono text-[11px] text-[#69716D]">Bengaluru, India</span>
              </div>
              <p className="font-body text-sm text-[#525955] leading-snug">
                Interactive WebGL portfolio world alongside structured editorial documentation and verified live deployments.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E8E4DC] font-mono text-[11px]">
                <div>
                  <span className="text-[#69716D] block">Focus</span>
                  <span className="text-[#252A2A] font-medium">AI &amp; RAG</span>
                </div>
                <div>
                  <span className="text-[#69716D] block">Systems</span>
                  <span className="text-[#252A2A] font-medium">4 Live Apps</span>
                </div>
                <div>
                  <span className="text-[#69716D] block">Degree</span>
                  <span className="text-[#252A2A] font-medium">MCA 2026</span>
                </div>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
