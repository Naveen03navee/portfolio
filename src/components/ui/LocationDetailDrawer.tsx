/**
 * @file clients/portfolio/src/components/ui/LocationDetailDrawer.tsx
 * @description Accessible slide-over drawer providing comprehensive content deep-dive
 * for the active world location without disrupting the primary 3D viewport during travel.
 */

import React, { useRef } from 'react';
import type { WorldLocationMeta, ProjectShowcase } from '../../types/portfolio.types.js';
import { Location01Gateway } from '../sections/Location01Gateway.js';
import { Location02Innovation } from '../sections/Location02Innovation.js';
import { Location03Technology } from '../sections/Location03Technology.js';
import { Location04Projects } from '../sections/Location04Projects.js';
import { Location05Campus } from '../sections/Location05Campus.js';
import { Location06Skyline } from '../sections/Location06Skyline.js';
import { IconClose } from './Icons.js';
import { useFocusTrapModal } from '../../hooks/useFocusTrapModal.js';

export interface LocationDetailDrawerProps {
  readonly isOpen: boolean;
  readonly activeLocation: WorldLocationMeta;
  readonly onClose: () => void;
  readonly onSelectProject: (proj: ProjectShowcase) => void;
  readonly onOpenResume: () => void;
  readonly onOpenPrivacyModal: () => void;
  readonly onOpenCookieBanner: () => void;
}

export const LocationDetailDrawer: React.FC<LocationDetailDrawerProps> = ({
  isOpen,
  activeLocation,
  onClose,
  onSelectProject,
  onOpenResume,
  onOpenPrivacyModal,
  onOpenCookieBanner,
}) => {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  useFocusTrapModal(isOpen, drawerRef, onClose);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${activeLocation.name} Detailed Inspection`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-end bg-obsidian-950/80 backdrop-blur-md p-4 sm:p-6"
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-obsidian-900 border border-white/20 p-6 sm:p-8 shadow-2xl focus:outline-none"
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
            <span className="font-mono text-xs text-accent-cyan tracking-wider uppercase">
              LOCATION 0{activeLocation.index} // ARCHITECTURAL INSPECTION
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-titanium-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            aria-label="Close inspection drawer"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Section Content Rendering */}
        <div className="space-y-6">
          {activeLocation.id === 'gateway' && (
            <Location01Gateway
              onExploreClick={onClose}
              onContactClick={onClose}
              onResumeClick={onOpenResume}
            />
          )}

          {activeLocation.id === 'innovation' && (
            <Location02Innovation onNextLocationClick={onClose} />
          )}

          {activeLocation.id === 'technology' && (
            <Location03Technology onNextLocationClick={onClose} />
          )}

          {activeLocation.id === 'projects' && (
            <Location04Projects
              onSelectProject={onSelectProject}
              onNextLocationClick={onClose}
            />
          )}

          {activeLocation.id === 'campus' && (
            <Location05Campus onNextLocationClick={onClose} />
          )}

          {activeLocation.id === 'skyline' && (
            <Location06Skyline
              onResumeClick={onOpenResume}
              onOpenPrivacyModal={onOpenPrivacyModal}
              onOpenCookieBanner={onOpenCookieBanner}
            />
          )}
        </div>
      </div>
    </div>
  );
};

