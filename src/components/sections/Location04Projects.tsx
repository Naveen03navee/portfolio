/**
 * @file clients/portfolio/src/components/sections/Location04Projects.tsx
 * @description Light Warm Editorial project showcase grid powered by authoritative `projectLinks`.
 * Features consistent 16:9 genuine previews, restrained champagne/sage accents,
 * muted sage Live Demo primary actions, neutral GitHub Repository secondary actions, and honest status dots.
 */

import React from 'react';
import { PROJECTS_DATA } from '../../data/portfolioData.js';
import {
  PROJECT_ACCENT_PALETTES,
  getProjectLinkConfig,
  hasActiveLink,
} from '../../data/project-links.js';
import type { ProjectShowcase } from '../../types/portfolio.types.js';
import { IconChevronRight, IconGithub, IconExternalLink } from '../ui/Icons.js';
import { ProjectStatusDot } from '../ui/ProjectStatusDot.js';

export interface ProjectCardsGridProps {
  readonly onSelectProject: (project: ProjectShowcase, originEl?: HTMLElement | null) => void;
}

export const ProjectCardsGrid: React.FC<ProjectCardsGridProps> = ({ onSelectProject }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      {PROJECTS_DATA.map((proj) => {
        const linkCfg = getProjectLinkConfig(proj.id);
        const palette = PROJECT_ACCENT_PALETTES[proj.accentTheme];
        const liveUrl = linkCfg?.liveUrl ?? proj.liveUrl;
        const githubUrl = linkCfg?.githubUrl ?? proj.githubUrl;

        return (
          <article
            key={proj.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-[#FFFFFF] border border-[#E3DED3] hover:border-[#CFC8BA] transition-all duration-editorial ease-editorial hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 shadow-[0_6px_24px_rgba(37,42,42,0.05)]"
          >
            {/* Subtle project-specific hairline accent */}
            <div
              className="h-[2.5px] w-full opacity-90"
              style={{
                background: `linear-gradient(90deg, ${palette.primaryHex}, ${palette.secondaryHex})`,
              }}
              aria-hidden="true"
            />

            <div>
              {/* Framed 16:9 Genuine Live Application Preview */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#181C20] border-b border-[#E8E4DC]">
                <img
                  src={proj.screenshotPath}
                  alt={proj.previewAlt}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 ease-editorial group-hover:scale-[1.015] motion-reduce:group-hover:scale-100"
                />
              </div>

              <div className="p-6 sm:p-7 pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`font-mono text-[11px] font-medium tracking-[0.08em] uppercase ${palette.textAccentClass}`}>
                    {proj.projectNumber} · {proj.tag}
                  </span>
                  <span className="font-mono text-[11px] text-[#69716D]">
                    {proj.period}
                  </span>
                </div>

                {/* Project Name + Honest Runtime Status Dot */}
                <div className="flex items-center gap-2.5 mt-2.5">
                  <h3 className="font-display font-bold text-[#252A2A] text-xl sm:text-[22px] tracking-[-0.015em] leading-snug">
                    {proj.title}
                  </h3>
                  <ProjectStatusDot projectId={proj.id} />
                </div>

                <p className="mt-2.5 font-body text-[15px] text-[#525955] leading-relaxed">
                  {proj.shortDescription}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-7 pt-5 mt-5 border-t border-[#E8E4DC] space-y-5">
              {/* Concise stack summary (capped at 4 core technologies) */}
              <div className="flex flex-wrap items-center gap-1.5">
                {proj.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md bg-[#F5F3EE] border border-[#E3DED3] text-[11px] font-mono text-[#525955]"
                  >
                    {tech}
                  </span>
                ))}
                {proj.technologies.length > 4 && (
                  <span className="px-2 py-1 text-[11px] font-mono text-[#69716D]">
                    +{proj.technologies.length - 4} more
                  </span>
                )}
              </div>

              {/* Restrained Editorial Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  {hasActiveLink(liveUrl) && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cwe-editorial-btn-primary text-xs px-4 py-2 min-h-[40px]"
                    >
                      <IconExternalLink size={14} />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {hasActiveLink(githubUrl) && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cwe-editorial-btn-secondary text-xs px-3.5 py-2 min-h-[40px]"
                    >
                      <IconGithub size={14} />
                      <span>GitHub Repository</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  data-testid="project-details-btn"
                  onClick={(e) => onSelectProject(proj, e.currentTarget)}
                  className="cwe-editorial-btn-tertiary text-xs px-2.5 py-1.5 min-h-[40px]"
                >
                  <span>Details</span>
                  <IconChevronRight size={14} />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export interface Location04ProjectsProps {
  readonly onSelectProject: (project: ProjectShowcase, originEl?: HTMLElement | null) => void;
  readonly onNextLocationClick: () => void;
}

export const Location04Projects: React.FC<Location04ProjectsProps> = ({
  onSelectProject,
  onNextLocationClick,
}) => {
  return (
    <section
      id="location-projects"
      aria-label="Location 04: The Project Exhibition District"
      className="flex items-center justify-center relative px-2 sm:px-4 py-6"
    >
      <div className="w-full max-w-6xl mx-auto z-10">
        <div className="p-6 md:p-10 rounded-2xl bg-[#F5F3EE] border border-[#E3DED3] text-[#252A2A] shadow-2xl">
          <div className="space-y-2 border-b border-[#E8E4DC] pb-5 mb-7">
            <p className="font-mono text-xs tracking-[0.12em] text-[#4A685D] font-semibold uppercase">
              Station 04 // The Project Exhibition District
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-[#252A2A] tracking-[-0.02em]">
              Production Systems &amp; Engineering Deliverables
            </h2>
            <p className="text-sm font-body text-[#69716D]">
              Verified deployment URLs, GitHub repositories, and architectural case studies.
            </p>
          </div>

          <ProjectCardsGrid onSelectProject={onSelectProject} />

          <div className="mt-7 pt-5 border-t border-[#E8E4DC] flex justify-end">
            <button
              type="button"
              onClick={onNextLocationClick}
              className="cwe-editorial-btn-secondary text-xs"
            >
              <span>Proceed to Engineering Campus</span>
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
