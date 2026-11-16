/**
 * @file clients/portfolio/src/components/ui/RecruiterQuickView.tsx
 * @description Light Warm Editorial Candidate Dossier built for rapid hiring evaluation
 * and clean browser PDF printing. Strict section hierarchy:
 * Header -> 1. Professional Summary -> 2. Experience -> 3. Education ->
 * 4. Signature Projects -> 5. Technical Skills -> 6. Contact.
 */

import React, { useRef } from 'react';
import {
  PROFILE_INFO,
  EDUCATION_DATA,
  EXPERIENCE_DATA,
  PROJECTS_DATA,
  TECHNICAL_CATEGORIES,
} from '../../data/portfolioData.js';
import { getProjectLinkConfig } from '../../data/project-links.js';
import type { ProjectShowcase } from '../../types/portfolio.types.js';
import { ProjectStatusDot } from './ProjectStatusDot.js';
import { useFocusTrapModal } from '../../hooks/useFocusTrapModal.js';
import {
  IconClose,
  IconGithub,
  IconExternalLink,
  IconDownload,
  IconMail,
  IconFileText,
} from './Icons.js';

export interface RecruiterQuickViewProps {
  readonly isOpen: boolean;
  readonly returnFocusTarget?: HTMLElement | null;
  readonly onClose: () => void;
  readonly onSelectProject: (proj: ProjectShowcase) => void;
}

export const RecruiterQuickView: React.FC<RecruiterQuickViewProps> = ({
  isOpen,
  returnFocusTarget,
  onClose,
  onSelectProject,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useFocusTrapModal(isOpen, modalRef, onClose, returnFocusTarget);

  if (!isOpen) return null;

  const handlePrintDossier = (): void => {
    document.body.classList.add('cwe-printing-dossier');
    window.print();
    window.setTimeout(() => {
      document.body.classList.remove('cwe-printing-dossier');
    }, 300);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recruiter-quick-view-title"
      aria-describedby="recruiter-quick-view-summary"
      data-printable-dossier="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#252A2A]/55 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        data-printable-dossier-card="true"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[94vh] sm:max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl bg-[#FFFFFF] border border-[#E3DED3] p-5 sm:p-10 shadow-[0_24px_64px_rgba(37,42,42,0.18)] text-[#252A2A] font-body focus:outline-none"
      >
        {/* Header */}
        <header className="border-b border-[#E8E4DC] pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#4A685D] font-semibold block">
                Candidate Dossier
              </span>
              <h2
                id="recruiter-quick-view-title"
                className="text-2xl sm:text-4xl font-display font-bold tracking-[-0.025em] text-[#252A2A] mt-1"
              >
                {PROFILE_INFO.name}
              </h2>
              <p className="mt-1 text-sm sm:text-base text-[#69716D] font-body">
                Full-Stack AI Engineer · {PROFILE_INFO.location}
              </p>
            </div>

            <button
              type="button"
              data-no-print="true"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-[#F5F3EE] hover:bg-[#EDEAE2] border border-[#E3DED3] text-[#525955] hover:text-[#252A2A] transition-colors duration-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D] shrink-0"
              aria-label="Close recruiter quick view"
            >
              <IconClose size={20} />
            </button>
          </div>

          <div
            data-no-print="true"
            className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8E4DC]"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`mailto:${PROFILE_INFO.email}`}
                className="cwe-editorial-btn-secondary text-xs sm:text-sm py-2 px-3.5"
              >
                <IconMail size={15} className="text-[#4A685D] shrink-0" />
                <span className="break-all">{PROFILE_INFO.email}</span>
              </a>
              <a
                href={PROFILE_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cwe-editorial-btn-secondary text-xs sm:text-sm py-2 px-3.5"
              >
                <IconGithub size={15} className="text-[#525955] shrink-0" />
                <span>GitHub</span>
              </a>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handlePrintDossier}
                  aria-describedby="recruiter-print-help"
                  className="cwe-editorial-btn-secondary text-xs sm:text-sm py-2 px-3.5"
                >
                  <IconFileText size={15} className="text-[#525955]" />
                  <span>Print / Save Profile as PDF</span>
                </button>
                <a
                  href={PROFILE_INFO.resumePdfPath}
                  download="Naveen_B_Resume.pdf"
                  className="cwe-editorial-btn-primary text-xs sm:text-sm py-2 px-4"
                >
                  <IconDownload size={15} />
                  <span>Download Resume</span>
                </a>
              </div>
              <p
                id="recruiter-print-help"
                className="text-[11px] font-body text-[#525955]"
              >
                Print this candidate profile or save it as a PDF.
              </p>
            </div>
          </div>
        </header>

        {/* 1. Professional Summary */}
        <section className="py-6 border-b border-[#E8E4DC]" aria-labelledby="recruiter-summary-heading">
          <h3
            id="recruiter-summary-heading"
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A685D] mb-2.5"
          >
            Professional Summary
          </h3>
          <p
            id="recruiter-quick-view-summary"
            className="text-[15px] text-[#252A2A] leading-relaxed max-w-4xl"
          >
            {PROFILE_INFO.summary}
          </p>
        </section>

        {/* 2 & 3. Professional Experience + Education */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 border-b border-[#E8E4DC]">
          <section className="lg:col-span-7" aria-labelledby="recruiter-exp-heading">
            <h3
              id="recruiter-exp-heading"
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A685D] mb-4"
            >
              Professional Experience
            </h3>
            {EXPERIENCE_DATA.map((exp, idx) => (
              <div key={idx} className="pl-4 border-l-2 border-[#B99B70] space-y-2.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h4 className="font-display font-semibold text-base sm:text-lg text-[#252A2A]">
                      {exp.role}
                    </h4>
                    <p className="text-sm font-medium text-[#785E37] mt-0.5">
                      {exp.company} · {exp.location}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#69716D]">{exp.period}</span>
                </div>

                <ul className="space-y-1.5 text-sm text-[#525955] leading-relaxed list-disc pl-4 marker:text-[#66877B]">
                  {exp.description.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>

                <p className="font-mono text-xs text-[#69716D] pt-1">
                  Stack: <span className="text-[#252A2A]">{exp.technologies.join(' · ')}</span>
                </p>
              </div>
            ))}
          </section>

          <section className="lg:col-span-5" aria-labelledby="recruiter-edu-heading">
            <h3
              id="recruiter-edu-heading"
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A685D] mb-4"
            >
              Education
            </h3>
            <div className="space-y-4">
              {EDUCATION_DATA.map((edu, idx) => (
                <div
                  key={idx}
                  className="pb-4 last:pb-0 border-b last:border-b-0 border-[#E8E4DC]"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-display font-semibold text-[#252A2A] text-sm sm:text-base">
                      {edu.degree}
                    </h4>
                    <span className="font-mono text-xs text-[#785E37] shrink-0">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#4A685D] mt-0.5">{edu.institution}</p>
                  <p className="text-xs text-[#69716D] mt-1 leading-relaxed">{edu.focus}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 4. Signature Projects */}
        <section className="py-6 border-b border-[#E8E4DC]" aria-labelledby="recruiter-projects-heading">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3
              id="recruiter-projects-heading"
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A685D]"
            >
              Signature Projects
            </h3>
            <span className="font-mono text-[11px] text-[#69716D]">
              Runtime verified via status dot
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROJECTS_DATA.map((proj) => {
              const linkCfg = getProjectLinkConfig(proj.id);
              const liveHref = linkCfg?.liveUrl ?? proj.liveUrl;
              const githubHref = linkCfg?.githubUrl ?? proj.githubUrl;
              return (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-[#F5F3EE]/60 border border-[#E3DED3] flex flex-col justify-between gap-3 break-inside-avoid print:bg-white print:border-[#CBD5E1]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <h4 className="font-display font-semibold text-[#252A2A] text-base truncate">
                          {proj.title}
                        </h4>
                        <ProjectStatusDot projectId={proj.id} />
                      </div>
                      <span className="font-mono text-[11px] text-[#69716D] shrink-0">
                        {proj.period}
                      </span>
                    </div>

                    <p className="text-sm text-[#525955] mt-1.5 leading-snug">
                      {proj.shortDescription}
                    </p>

                    <p className="font-mono text-[11px] text-[#69716D] mt-2">
                      {proj.technologies.slice(0, 4).join(' · ')}
                    </p>
                  </div>

                  <div
                    data-no-print="true"
                    className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#E8E4DC]"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={liveHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cwe-editorial-btn-primary text-xs px-3 py-1.5 min-h-[36px]"
                      >
                        <IconExternalLink size={13} />
                        <span>Live Demo</span>
                      </a>
                      <a
                        href={githubHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cwe-editorial-btn-secondary text-xs px-3 py-1.5 min-h-[36px]"
                      >
                        <IconGithub size={13} />
                        <span>GitHub Repository</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectProject(proj);
                      }}
                      className="cwe-editorial-btn-tertiary text-xs px-2.5 py-1.5 min-h-[36px]"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Technical Skills */}
        <section className="py-6 border-b border-[#E8E4DC]" aria-labelledby="recruiter-skills-heading">
          <h3
            id="recruiter-skills-heading"
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A685D] mb-4"
          >
            Technical Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {TECHNICAL_CATEGORIES.map((cat) => (
              <div
                key={cat.domain}
                className="pb-3.5 border-b border-[#E8E4DC] md:last:border-b-0"
              >
                <h4 className="font-display font-semibold text-sm text-[#252A2A]">
                  {cat.domain}
                </h4>
                <p className="mt-1 font-body text-xs sm:text-sm text-[#69716D] leading-relaxed">
                  {cat.skills.join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Contact */}
        <section className="pt-6" aria-labelledby="recruiter-contact-heading">
          <h3
            id="recruiter-contact-heading"
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A685D] mb-3"
          >
            Contact
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#525955]">
            <p>
              <strong className="text-[#252A2A] font-medium">{PROFILE_INFO.name}</strong> ·{' '}
              {PROFILE_INFO.location} ·{' '}
              <a
                href={`mailto:${PROFILE_INFO.email}`}
                className="text-[#4A685D] underline underline-offset-4 hover:text-[#252A2A]"
              >
                {PROFILE_INFO.email}
              </a>
            </p>
            <p className="font-mono text-xs text-[#69716D]">
              github.com/{PROFILE_INFO.githubHandle}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
