/**
 * @file clients/portfolio/src/App.tsx
 * @description Root application component orchestrating Naveen B's three coherent experiences:
 * 1. 3D Cinematic Portfolio (with raycasted interactive project billboards)
 * 2. 2D Portfolio (complete accessible professional website)
 * 3. Recruiter Quick View (concise hiring dossier)
 */

import React, { useState, useCallback, useRef } from 'react';
import { useScrollJourney } from './hooks/useScrollJourney.js';
import { useWebGLProbe } from './hooks/useWebGLProbe.js';
import { useCookieConsent } from './hooks/useCookieConsent.js';
import { PROFILE_INFO, PROJECTS_DATA } from './data/portfolioData.js';
import type { ProjectShowcase } from './types/portfolio.types.js';

import { AccessibleSkipLink } from './components/ui/AccessibleSkipLink.js';
import { Navbar } from './components/ui/Navbar.js';
import { CinematicHUD } from './components/ui/CinematicHUD.js';
import { LocationDetailDrawer } from './components/ui/LocationDetailDrawer.js';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner.js';
import { LegalModal } from './components/ui/LegalModal.js';
import { ProjectDetailModal } from './components/ui/ProjectDetailModal.js';
import { RecruiterQuickView } from './components/ui/RecruiterQuickView.js';
import { CinematicScene } from './canvas/CinematicScene.js';
import { StandardPortfolioView } from './components/sections/StandardPortfolioView.js';

import { Location01Gateway } from './components/sections/Location01Gateway.js';
import { Location02Innovation } from './components/sections/Location02Innovation.js';
import { Location03Technology } from './components/sections/Location03Technology.js';
import { Location04Projects } from './components/sections/Location04Projects.js';
import { Location05Campus } from './components/sections/Location05Campus.js';
import { Location06Skyline } from './components/sections/Location06Skyline.js';

export const App: React.FC = () => {
  const {
    isSupported: isWebGLSupported,
    isEnabled: is3DEnabled,
    setMode: set3DMode,
    fallbackTo2D,
  } = useWebGLProbe();

  const is3DActive = isWebGLSupported && is3DEnabled;
  const { progress, activeLocation, active2DSectionId, isReducedMotion, jumpToLocation } =
    useScrollJourney({
      is3DActive,
    });
  const { isBannerVisible, acceptAll, rejectAll, saveCustom, reopenBanner } = useCookieConsent();

  // Modal & drawer state plus focus-return tracking
  const [selectedProject, setSelectedProject] = useState<ProjectShowcase | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState<boolean>(false);
  const [isRecruiterViewOpen, setIsRecruiterViewOpen] = useState<boolean>(false);
  const projectOriginElRef = useRef<HTMLElement | null>(null);
  const recruiterOriginElRef = useRef<HTMLElement | null>(null);

  const handleOpenResume = useCallback((): void => {
    window.open(PROFILE_INFO.resumePdfPath, '_blank', 'noopener,noreferrer');
  }, []);

  const handleSelectProject = useCallback(
    (proj: ProjectShowcase, originEl?: HTMLElement | null): void => {
      projectOriginElRef.current =
        originEl ??
        (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      setSelectedProject(proj);
    },
    []
  );

  const handleSelectProjectById = useCallback(
    (projectId: string, originEl?: HTMLElement | null): void => {
      const norm = projectId.toLowerCase().replace(/[-_\s]/g, '');
      const matched = PROJECTS_DATA.find((p) => {
        const pNorm = p.id.toLowerCase().replace(/[-_\s]/g, '');
        return pNorm === norm || norm.includes(pNorm) || pNorm.includes(norm);
      });
      if (matched) {
        handleSelectProject(matched, originEl);
      }
    },
    [handleSelectProject]
  );

  const handleCloseProjectModal = useCallback((): void => {
    setSelectedProject(null);
  }, []);

  const handleOpenRecruiterView = useCallback((originEl?: HTMLElement | null): void => {
    recruiterOriginElRef.current =
      originEl ??
      (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setIsRecruiterViewOpen(true);
  }, []);

  const handleSet3DMode = useCallback(
    (enable3D: boolean): void => {
      set3DMode(enable3D);
      if (!enable3D) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'instant' });
        });
      }
    },
    [set3DMode]
  );

  const isAnyModalOpen =
    selectedProject !== null ||
    isLegalModalOpen ||
    isDetailDrawerOpen ||
    isRecruiterViewOpen;

  return (
    <div
      className={`min-h-screen relative font-body transition-colors duration-editorial ${
        is3DActive
          ? 'bg-[#0B1017] text-[#F3F2ED] selection:bg-[#45D6E6]/20 selection:text-[#45D6E6]'
          : 'bg-[#F5F3EE] text-[#252A2A] selection:bg-[#66877B]/20 selection:text-[#252A2A]'
      }`}
    >
      <AccessibleSkipLink />

      {/* 3D WebGL Canvas (Primary Viewport Surface when enabled) */}
      {is3DActive && (
        <CinematicScene
          scrollProgress={progress}
          isReducedMotion={isReducedMotion}
          isPaused={isAnyModalOpen}
          onWebGLFallback={fallbackTo2D}
          onSelectProject={handleSelectProjectById}
          onHoverBillboard={setHoveredProjectId}
        />
      )}

      {/* Accessible Fixed Header */}
      <Navbar
        activeLocation={activeLocation}
        active2DSectionId={active2DSectionId}
        onJumpToLocation={jumpToLocation}
        is3DEnabled={is3DEnabled}
        isWebGLSupported={isWebGLSupported}
        onSet3DMode={handleSet3DMode}
        onOpenResumeModal={handleOpenResume}
        onOpenRecruiterView={handleOpenRecruiterView}
      />

      {is3DActive ? (
        <>
          {/* Unobtrusive Floating Cinematic HUD */}
          <CinematicHUD
            activeLocation={activeLocation}
            progress={progress}
            hoveredProjectId={hoveredProjectId}
            onInspectDetails={() => setIsDetailDrawerOpen(true)}
            onSelectProject={handleSelectProjectById}
            onOpenResume={handleOpenResume}
            onContactClick={() => jumpToLocation('skyline')}
            onNextLocation={() => {
              const nextIdx = (activeLocation.index % 6) + 1;
              const nextIds = [
                'gateway',
                'innovation',
                'technology',
                'projects',
                'campus',
                'skyline',
              ] as const;
              jumpToLocation(nextIds[nextIdx - 1] ?? 'gateway');
            }}
          />

          {/* Continuous Scroll Spine driving useScrollJourney (extended for unhurried exhibition pacing) */}
          <div
            data-no-print="true"
            className="relative pointer-events-none w-full"
            style={{ height: '1200vh' }}
            aria-hidden="true"
          />

          {/* Accessible Screen-Reader Landmark Fallback during 3D Mode */}
          <main id="main-content" tabIndex={-1} className="sr-only focus:not-sr-only">
            <Location01Gateway
              onExploreClick={() => jumpToLocation('innovation')}
              onContactClick={() => jumpToLocation('skyline')}
              onResumeClick={handleOpenResume}
            />
            <Location02Innovation
              onNextLocationClick={() => jumpToLocation('technology')}
            />
            <Location03Technology
              onNextLocationClick={() => jumpToLocation('projects')}
            />
            <Location04Projects
              onSelectProject={handleSelectProject}
              onNextLocationClick={() => jumpToLocation('campus')}
            />
            <Location05Campus
              onNextLocationClick={() => jumpToLocation('skyline')}
            />
            <Location06Skyline
              onResumeClick={handleOpenResume}
              onOpenPrivacyModal={() => setIsLegalModalOpen(true)}
              onOpenCookieBanner={reopenBanner}
            />
          </main>
        </>
      ) : (
        /* Distinct, Complete 2D Portfolio Experience */
        <StandardPortfolioView
          onSelectProject={handleSelectProject}
          onOpenResume={handleOpenResume}
          onOpenPrivacyModal={() => setIsLegalModalOpen(true)}
          onOpenCookieBanner={reopenBanner}
        />
      )}

      {/* Accessible Detail Inspection Drawer */}
      <LocationDetailDrawer
        isOpen={isDetailDrawerOpen}
        activeLocation={activeLocation}
        onClose={() => setIsDetailDrawerOpen(false)}
        onSelectProject={handleSelectProject}
        onOpenResume={handleOpenResume}
        onOpenPrivacyModal={() => setIsLegalModalOpen(true)}
        onOpenCookieBanner={reopenBanner}
      />

      {/* Recruiter Quick View Dossier */}
      <RecruiterQuickView
        isOpen={isRecruiterViewOpen}
        returnFocusTarget={recruiterOriginElRef.current}
        onClose={() => setIsRecruiterViewOpen(false)}
        onSelectProject={handleSelectProject}
      />

      {/* Reusable Interactive Project Modal */}
      <ProjectDetailModal
        project={selectedProject}
        returnFocusTarget={projectOriginElRef.current}
        onClose={handleCloseProjectModal}
      />

      {/* Legal & Privacy Policy Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        isLightMode={!is3DActive}
        onClose={() => setIsLegalModalOpen(false)}
      />

      {/* Granular Cookie Consent Banner */}
      <CookieConsentBanner
        isVisible={isBannerVisible}
        isLightMode={!is3DActive}
        onAcceptAll={acceptAll}
        onRejectAll={rejectAll}
        onSaveCustom={saveCustom}
        onOpenPrivacyModal={() => setIsLegalModalOpen(true)}
      />
    </div>
  );
};
