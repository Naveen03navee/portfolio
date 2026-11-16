/**
 * @file clients/portfolio/src/components/ui/ProjectDetailModal.tsx
 * @description Light Warm Editorial project case-study modal preserving full Stage G.9 interactions
 * (3D billboard selection, focus trap, Escape/backdrop close, scroll preservation, authoritative URLs).
 */

import React, { useEffect, useRef, useState } from 'react';
import type { ProjectShowcase } from '../../types/portfolio.types.js';
import { IconClose, IconGithub, IconExternalLink, IconCheck } from './Icons.js';
import {
  PROJECT_ACCENT_PALETTES,
  getProjectLinkConfig,
  hasActiveLink,
} from '../../data/project-links.js';
import { ProjectStatusDot } from './ProjectStatusDot.js';
import { ProjectArchitectureDiagram } from './ProjectArchitectureDiagram.js';
import { useFocusTrapModal } from '../../hooks/useFocusTrapModal.js';

export interface ProjectDetailModalProps {
  readonly project: ProjectShowcase | null;
  readonly returnFocusTarget?: HTMLElement | null;
  readonly onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  returnFocusTarget,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const isOpen = project !== null;

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [project?.id]);

  useFocusTrapModal(isOpen, modalRef, onClose, returnFocusTarget);

  if (!project) return null;

  const palette = PROJECT_ACCENT_PALETTES[project.accentTheme];
  const linkConfig = getProjectLinkConfig(project.id);
  const resolvedGithubUrl =
    linkConfig?.githubUrl ?? (hasActiveLink(project.githubUrl) ? project.githubUrl : null);
  const resolvedLiveUrl =
    linkConfig?.liveUrl ?? (hasActiveLink(project.liveUrl) ? project.liveUrl : null);

  const gallery = project.galleryImages?.length
    ? project.galleryImages
    : [
        {
          src: project.screenshotPath,
          alt: project.previewAlt,
          caption: 'Live Application Preview',
        },
      ];
  const activeMedia = gallery[activeMediaIndex] ?? gallery[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      aria-describedby="project-modal-desc"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#252A2A]/55 backdrop-blur-sm transition-opacity duration-editorial motion-reduce:transition-none"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden bg-[#FFFFFF] border border-[#E3DED3] shadow-[0_24px_64px_rgba(37,42,42,0.18)] rounded-xl sm:rounded-2xl text-[#252A2A] font-body focus:outline-none"
      >
        {/* Subtle Warm Editorial Header Rule */}
        <div
          className="h-[3px] w-full shrink-0"
          style={{
            background: `linear-gradient(90deg, ${palette.primaryHex}, ${palette.secondaryHex})`,
          }}
          aria-hidden="true"
        />

        {/* Pinned Case Study Header */}
        <div className="shrink-0 px-5 sm:px-8 pt-5 pb-4 border-b border-[#E8E4DC] bg-[#F5F3EE]/70 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`font-mono text-xs font-medium tracking-[0.08em] uppercase ${palette.textAccentClass}`}>
                Project {project.projectNumber} · {project.tag}
              </span>
              <span className="text-[#D2CBC0]" aria-hidden="true">
                /
              </span>
              <span className="font-mono text-xs text-[#69716D]">{project.period}</span>
            </div>

            <div className="flex items-center gap-3 mt-1.5">
              <h2
                id="project-modal-title"
                className="text-xl sm:text-2xl lg:text-[28px] font-display font-bold text-[#252A2A] tracking-[-0.02em] leading-tight"
              >
                {project.title}
              </h2>
              <ProjectStatusDot projectId={project.id} />
            </div>

            <p className="mt-1 font-body text-xs sm:text-sm text-[#69716D]">
              {project.displayTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-white border border-[#E3DED3] text-[#525955] hover:text-[#252A2A] hover:bg-[#EDEAE2] transition-colors duration-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D] shrink-0"
            aria-label={`Close ${project.title} modal`}
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Scrollable Two-Column Case Study Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: Overview, Approach & Key Highlights */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#69716D] mb-2">
                  Project Overview &amp; Approach
                </h3>
                <p id="project-modal-desc" className="font-body text-sm sm:text-[15px] text-[#252A2A] leading-relaxed">
                  {project.technicalContribution}
                </p>
                <p className="mt-2.5 font-body text-sm text-[#69716D] leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E4DC]">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#69716D] mb-2.5">
                  Key Implementation Highlights
                </h3>
                <ul className="space-y-2.5">
                  {project.keyHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#525955] leading-relaxed">
                      <IconCheck size={16} className="text-[#4A685D] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Deployment Details Accordion */}
              <details className="rounded-lg bg-[#EDEAE2]/75 border border-[#E3DED3] p-3.5 text-sm group">
                <summary className="cursor-pointer font-body font-medium text-[#252A2A] hover:text-[#4A685D] transition-colors select-none list-none flex items-center justify-between gap-2 focus-visible:outline-none">
                  <span>Architecture &amp; Deployment Metadata</span>
                  <span className="font-mono text-xs text-[#525955] group-open:hidden">+ Expand</span>
                  <span className="font-mono text-xs text-[#4A685D] hidden group-open:inline">− Collapse</span>
                </summary>
                <div className="mt-3 pt-3 border-t border-[#E3DED3] space-y-2 text-xs">
                  <p className="font-mono text-[#525955] leading-relaxed break-words">
                    {project.architectureOverview}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[#525955]">
                    <span>
                      Status: <strong className="text-[#252A2A] font-medium">{project.status}</strong>
                    </span>
                    <span>
                      Hosting:{' '}
                      <strong className="text-[#252A2A] font-medium">
                        {linkConfig?.hostingProvider === 'render' ? 'Render Cloud' : 'Cloudflare Pages'}
                      </strong>
                    </span>
                  </div>
                </div>
              </details>
            </div>

            {/* Right Column: Authentic Preview, System Diagram & Stack */}
            <div className="lg:col-span-6 space-y-4">
              <div className="overflow-hidden rounded-xl bg-[#F5F3EE] border border-[#E3DED3]">
                <div className="aspect-[16/9] w-full overflow-hidden bg-[#181C20]">
                  <img
                    src={activeMedia.src}
                    alt={activeMedia.alt}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                {gallery.length > 1 && (
                  <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 bg-[#EDEAE2] border-t border-[#E3DED3]">
                    {gallery.map((item, idx) => (
                      <button
                        key={item.src}
                        type="button"
                        onClick={() => setActiveMediaIndex(idx)}
                        aria-pressed={activeMediaIndex === idx}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D] ${
                          activeMediaIndex === idx
                            ? 'bg-[#4A685D] text-white'
                            : 'bg-white text-[#525955] hover:text-[#252A2A] border border-[#E3DED3]'
                        }`}
                      >
                        {item.caption}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ProjectArchitectureDiagram stages={project.architectureStages} palette={palette} />

              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#69716D] mb-2">
                  Technology Stack
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-[#EDEAE2] border border-[#E3DED3] text-xs font-mono text-[#252A2A]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Editorial Actions Footer */}
        <div className="shrink-0 px-5 sm:px-8 py-4 border-t border-[#E8E4DC] bg-[#F5F3EE] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {resolvedLiveUrl && hasActiveLink(resolvedLiveUrl) ? (
              <a
                href={resolvedLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cwe-editorial-btn-primary text-sm"
              >
                <IconExternalLink size={16} />
                <span>Open Live Demo</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#EDEAE2] text-[#69716D] font-body text-sm border border-[#E3DED3] cursor-not-allowed opacity-70"
              >
                <IconExternalLink size={16} />
                <span>Live Demo Unavailable</span>
              </button>
            )}

            {resolvedGithubUrl && hasActiveLink(resolvedGithubUrl) ? (
              <a
                href={resolvedGithubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cwe-editorial-btn-secondary text-sm"
              >
                <IconGithub size={16} />
                <span>View GitHub Repository</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#EDEAE2] text-[#69716D] font-body text-sm border border-[#E3DED3] cursor-not-allowed opacity-70"
              >
                <IconGithub size={16} />
                <span>Repository Unavailable</span>
              </button>
            )}
          </div>

          <span className="hidden sm:inline font-mono text-xs text-[#69716D]">
            Hosted on {linkConfig?.hostingProvider === 'render' ? 'Render' : 'Cloudflare Pages'}
          </span>
        </div>
      </div>
    </div>
  );
};
