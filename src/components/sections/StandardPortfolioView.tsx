/**
 * @file clients/portfolio/src/components/sections/StandardPortfolioView.tsx
 * @description Light Warm Editorial 2D Portfolio website for recruiters, mobile visitors,
 * assistive technologies, reduced-motion visitors, and WebGL-fallback environments.
 */

import React from 'react';
import type { ProjectShowcase } from '../../types/portfolio.types.js';
import { ProjectCardsGrid } from './Location04Projects.js';
import { SectionHeading } from '../ui/SectionHeading.js';
import { Hero2D } from './portfolio2d/Hero2D.js';
import { AboutAndSkills2D } from './portfolio2d/AboutAndSkills2D.js';
import { Career2D } from './portfolio2d/Career2D.js';
import { ContactFooter2D } from './portfolio2d/ContactFooter2D.js';

export interface StandardPortfolioViewProps {
  readonly onSelectProject: (project: ProjectShowcase, originEl?: HTMLElement | null) => void;
  readonly onOpenResume: () => void;
  readonly onOpenPrivacyModal: () => void;
  readonly onOpenCookieBanner: () => void;
}

export const StandardPortfolioView: React.FC<StandardPortfolioViewProps> = ({
  onSelectProject,
  onOpenResume,
  onOpenPrivacyModal,
  onOpenCookieBanner,
}) => {
  const scrollToSection = (id: string): void => {
    const el = document.getElementById(id);
    if (el) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative z-10 bg-[#F5F3EE] text-[#252A2A] focus:outline-none"
    >
      <Hero2D onScrollToSection={scrollToSection} onOpenResume={onOpenResume} />

      <AboutAndSkills2D />

      <Career2D />

      {/* 6. FEATURED PROJECTS */}
      <section
        id="section-projects"
        aria-labelledby="projects-heading"
        className="scroll-mt-20 py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E8E4DC] bg-[#F5F3EE]"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            index="06"
            eyebrow="Featured Projects"
            title="Production Systems & Live Deployments"
            headingId="projects-heading"
            subtitle="Curated engineering implementations linked directly to live production deployments, source repositories, architectural diagrams, and real-time runtime checks."
          />

          <div className="mt-9">
            <ProjectCardsGrid onSelectProject={onSelectProject} />
          </div>
        </div>
      </section>

      <ContactFooter2D
        onOpenPrivacyModal={onOpenPrivacyModal}
        onOpenCookieBanner={onOpenCookieBanner}
      />
    </main>
  );
};
