/**
 * @file clients/portfolio/src/components/ui/CinematicHUD.tsx
 * @description Minimal, keyboard-accessible floating HUD for the 3D cinematic world.
 * Preserves left-side active station info & accessible project/next controls while removing
 * lower-right telemetry & scroll-instruction boxes for an unobstructed cinematic viewport.
 */

import React from 'react';
import type { WorldLocationMeta } from '../../types/portfolio.types.js';
import { getProjectLinkConfig, projectLinks } from '../../data/project-links.js';
import { IconChevronRight, IconFileText, IconMail } from './Icons.js';

export interface CinematicHUDProps {
  readonly activeLocation: WorldLocationMeta;
  readonly progress?: number;
  readonly hoveredProjectId?: string | null;
  readonly onInspectDetails: (originEl?: HTMLElement | null) => void;
  readonly onSelectProject?: (projectId: string, originEl?: HTMLElement | null) => void;
  readonly onOpenResume: () => void;
  readonly onContactClick: () => void;
  readonly onNextLocation: () => void;
}

export const CinematicHUD: React.FC<CinematicHUDProps> = ({
  activeLocation,
  hoveredProjectId = null,
  onInspectDetails,
  onSelectProject,
  onOpenResume,
  onContactClick,
  onNextLocation,
}) => {
  const hoveredProject = hoveredProjectId ? getProjectLinkConfig(hoveredProjectId) : undefined;

  return (
    <div
      data-no-print="true"
      className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 md:p-8"
    >
      {/* Top spacer below compact navbar + hover affordance prompt */}
      <div className="pt-16 flex justify-center">
        {hoveredProject && (
          <div
            role="status"
            className="px-4 py-1.5 rounded-full bg-[#0B1017]/90 border border-[#45D6E6]/45 text-[#45D6E6] font-mono text-xs shadow-lg"
          >
            CLICK BILLBOARD · OPEN {hoveredProject.shortTitle.toUpperCase()}
          </div>
        )}
      </div>

      {/* Left-aligned Active Station Panel (lower-right overlays intentionally removed) */}
      <div className="flex items-end justify-start">
        <div className="pointer-events-auto max-w-md rounded-2xl bg-[#0B1017]/94 backdrop-blur-md border border-white/[0.16] p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.68)]">
          <div className="flex items-center gap-2 mb-2 font-mono text-[11px] font-semibold text-[#67E8F9] tracking-wider">
            <span
              className="w-2 h-2 rounded-full bg-[#45D6E6] animate-pulse motion-reduce:hidden"
              aria-hidden="true"
            />
            <span>
              STATION 0{activeLocation.index} // {activeLocation.name.toUpperCase()}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-display font-bold text-[#F8FAFC] tracking-tight">
            {activeLocation.focusHeadline}
          </h2>
          <p className="text-xs font-body font-medium text-[#CBD5E1] mt-1 line-clamp-2">
            {activeLocation.subtitle}
          </p>

          {/* Keyboard-accessible Project Modal Controls during Station 04 */}
          {activeLocation.id === 'projects' && onSelectProject && (
            <div
              className="mt-3 pt-2.5 border-t border-white/[0.14]"
              role="group"
              aria-label="Open Project Modals"
            >
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                Interactive Exhibitions (Click 3D Board or Select):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {projectLinks.map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={(e) => onSelectProject(proj.id, e.currentTarget)}
                    className="px-2.5 py-1 rounded-md bg-white/[0.08] hover:bg-[#45D6E6]/25 border border-white/[0.18] hover:border-[#45D6E6]/50 text-[11px] font-mono text-[#F8FAFC] hover:text-[#67E8F9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45D6E6]"
                  >
                    {proj.projectNumber} {proj.shortTitle}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary Journey Controls */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.14]">
            <button
              type="button"
              onClick={(e) => onInspectDetails(e.currentTarget)}
              className="px-3 py-1.5 rounded-lg bg-[#45D6E6]/15 hover:bg-[#45D6E6]/25 border border-[#45D6E6]/40 text-[#45D6E6] font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45D6E6]"
            >
              <span>INSPECT DETAILS</span>
            </button>

            {activeLocation.id === 'gateway' && (
              <button
                type="button"
                onClick={onOpenResume}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.14] text-[#F3F2ED] font-mono text-xs flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45D6E6]"
              >
                <IconFileText size={13} className="text-[#D5B477]" />
                <span>RESUME</span>
              </button>
            )}

            {activeLocation.id === 'skyline' && (
              <button
                type="button"
                onClick={onContactClick}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <IconMail size={13} />
                <span>CONTACT NAVEEN</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNextLocation}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.09] hover:bg-white/[0.16] border border-white/[0.16] text-[#E2E8F0] hover:text-white font-mono text-xs flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45D6E6]"
              aria-label="Skip to next location"
            >
              <span>NEXT</span>
              <IconChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
