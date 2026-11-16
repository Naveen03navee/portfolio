/**
 * @file clients/portfolio/src/components/ui/Navbar.tsx
 * @description Compact single-row desktop navbar (~70px height) with zero station capsules in 3D mode,
 * full section links in 2D mode, and an accessible >= 44px touch-target mobile/tablet navigation drawer.
 */

import React, { useRef, useState } from 'react';
import { PROFILE_INFO } from '../../data/portfolioData.js';
import type { WorldLocationId, WorldLocationMeta } from '../../types/portfolio.types.js';
import { IconClose, IconCompass, IconFileText, IconGithub } from './Icons.js';
import { GITHUB_PROFILE_URL } from '../../data/project-links.js';
import { useFocusTrapModal } from '../../hooks/useFocusTrapModal.js';

export interface NavbarProps {
  readonly activeLocation: WorldLocationMeta;
  readonly active2DSectionId?: string;
  readonly onJumpToLocation: (id: WorldLocationId, domSectionId?: string) => void;
  readonly is3DEnabled: boolean;
  readonly isWebGLSupported: boolean;
  readonly onSet3DMode: (enable3D: boolean) => void;
  readonly onOpenResumeModal: () => void;
  readonly onOpenRecruiterView?: (originEl?: HTMLElement | null) => void;
}

const NAV_ITEMS_2D: ReadonlyArray<{
  readonly locId: WorldLocationId;
  readonly domId: string;
  readonly label: string;
}> = [
  { locId: 'innovation', domId: 'section-about', label: 'About' },
  { locId: 'technology', domId: 'section-skills', label: 'Skills' },
  { locId: 'campus', domId: 'section-experience', label: 'Experience' },
  { locId: 'innovation', domId: 'section-education', label: 'Education' },
  { locId: 'projects', domId: 'section-projects', label: 'Projects' },
  { locId: 'skyline', domId: 'section-contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  active2DSectionId = 'section-hero',
  onJumpToLocation,
  is3DEnabled,
  isWebGLSupported,
  onSet3DMode,
  onOpenResumeModal,
  onOpenRecruiterView,
}) => {
  const is3DActive = isWebGLSupported && is3DEnabled;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const mobileMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null);

  useFocusTrapModal(
    isMobileMenuOpen,
    mobileDrawerRef,
    () => setIsMobileMenuOpen(false),
    mobileMenuBtnRef.current
  );

  const handleMobileSectionJump = (locId: WorldLocationId, domId: string): void => {
    setIsMobileMenuOpen(false);
    onJumpToLocation(locId, domId);
  };

  const isLightMode = !is3DActive;

  return (
    <>
      <header
        data-no-print="true"
        className={`fixed top-0 left-0 right-0 z-40 h-[70px] px-4 sm:px-6 lg:px-8 flex items-center transition-colors duration-editorial ${
          isLightMode
            ? 'bg-[#F5F3EE]/95 backdrop-blur-md border-b border-[#E3DED3] text-[#252A2A]'
            : 'bg-[#0B1017]/95 backdrop-blur-md border-b border-white/[0.12] text-[#F3F2ED]'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Compact Candidate Identity */}
          <button
            type="button"
            onClick={() => onJumpToLocation('gateway', 'section-hero')}
            className={`flex items-center gap-3 text-left rounded-lg px-1 py-1 shrink-0 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 ${
              isLightMode ? 'focus-visible:ring-[#4A685D]' : 'focus-visible:ring-[#45D6E6]'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-xs tracking-tight shrink-0 border ${
                isLightMode
                  ? 'bg-[#EDEAE2] border-[#E3DED3] text-[#4A685D]'
                  : 'bg-[#141D29] border-white/[0.14] text-[#45D6E6]'
              }`}
              aria-hidden="true"
            >
              NB
            </div>
            <div className="leading-tight">
              <span
                className={`font-display font-bold text-sm block ${
                  isLightMode ? 'text-[#252A2A]' : 'text-[#F3F2ED]'
                }`}
              >
                {PROFILE_INFO.name}
              </span>
              <span
                className={`font-body text-[11px] font-medium block ${
                  isLightMode ? 'text-[#525955]' : 'text-[#CBD5E1]'
                }`}
              >
                Full-Stack AI Engineer
              </span>
            </div>
            <span className="sr-only"> — Return to top</span>
          </button>

          {/* Center: Clean 2D Section Links ONLY in 2D Portfolio mode (6-station 3D capsule completely removed) */}
          {!is3DActive && (
            <nav
              aria-label="Portfolio Sections"
              className="hidden xl:flex items-center gap-1"
            >
              {NAV_ITEMS_2D.map((item) => {
                const isActive = active2DSectionId === item.domId;
                return (
                  <button
                    key={item.domId}
                    type="button"
                    onClick={() => onJumpToLocation(item.locId, item.domId)}
                    className={`px-3 py-1.5 rounded-lg font-body text-sm transition-colors duration-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D] ${
                      isActive
                        ? 'text-[#3D574E] bg-[#EDEAE2] font-semibold'
                        : 'text-[#69716D] hover:text-[#252A2A] hover:bg-[#EDEAE2]/60'
                    }`}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Desktop Action Strip (Single compact row, consistent 40px button heights) */}
          <div
            className={`${
              is3DActive ? 'hidden md:flex' : 'hidden xl:flex'
            } items-center gap-2 shrink-0`}
          >
            {isWebGLSupported ? (
              <div
                role="group"
                aria-label="Portfolio presentation mode"
                className={`inline-flex items-center h-10 rounded-lg border p-0.5 ${
                  isLightMode
                    ? 'border-[#E3DED3] bg-[#EDEAE2]'
                    : 'border-white/[0.12] bg-[#101722]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSet3DMode(true)}
                  aria-pressed={is3DEnabled}
                  className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-body font-medium transition-colors duration-editorial focus-visible:outline-none focus-visible:ring-2 ${
                    is3DEnabled
                      ? 'bg-[#141D29] text-[#45D6E6] font-semibold focus-visible:ring-[#45D6E6]'
                      : isLightMode
                        ? 'text-[#525955] hover:text-[#252A2A] focus-visible:ring-[#4A685D]'
                        : 'text-[#A7B2C0] hover:text-[#F3F2ED] focus-visible:ring-[#45D6E6]'
                  }`}
                >
                  <IconCompass size={13} aria-hidden="true" />
                  <span>3D Cinematic</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSet3DMode(false)}
                  aria-pressed={!is3DEnabled}
                  className={`inline-flex items-center h-8 px-3 rounded-md text-xs font-body font-medium transition-colors duration-editorial focus-visible:outline-none focus-visible:ring-2 ${
                    !is3DEnabled
                      ? 'bg-white text-[#252A2A] font-semibold shadow-sm focus-visible:ring-[#4A685D]'
                      : 'text-[#A7B2C0] hover:text-[#F3F2ED] focus-visible:ring-[#45D6E6]'
                  }`}
                >
                  <span>2D Portfolio</span>
                </button>
              </div>
            ) : (
              <span
                className={`inline-flex items-center h-10 px-3 rounded-lg border text-xs font-body font-medium ${
                  isLightMode
                    ? 'border-[#E3DED3] bg-[#EDEAE2] text-[#252A2A]'
                    : 'border-white/[0.12] bg-[#101722] text-[#A7B2C0]'
                }`}
              >
                2D Portfolio
              </span>
            )}

            {onOpenRecruiterView && (
              <button
                type="button"
                data-testid="recruiter-view-btn"
                onClick={(e) => onOpenRecruiterView(e.currentTarget)}
                className={`inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg text-xs font-body font-semibold border transition-colors duration-editorial focus-visible:outline-none focus-visible:ring-2 ${
                  isLightMode
                    ? 'border-[#D5C9B4] bg-[#F4EEE4] hover:bg-[#EAE1D2] text-[#785E37] focus-visible:ring-[#4A685D]'
                    : 'border-[#D5B477]/35 bg-[#D5B477]/12 hover:bg-[#D5B477]/22 text-[#E5C98E] focus-visible:ring-[#D5B477]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLightMode ? 'bg-[#B99B70]' : 'bg-[#D5B477]'
                  }`}
                  aria-hidden="true"
                />
                <span>Recruiter View</span>
                <span className="sr-only"> — Open candidate executive dossier</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenResumeModal}
              className={`inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg text-xs font-body font-medium border transition-colors duration-editorial focus-visible:outline-none focus-visible:ring-2 ${
                isLightMode
                  ? 'border-[#E3DED3] bg-white hover:bg-[#EDEAE2] text-[#252A2A] focus-visible:ring-[#4A685D]'
                  : 'border-white/[0.12] bg-[#141D29] hover:bg-[#1A2532] text-[#F3F2ED] focus-visible:ring-[#45D6E6]'
              }`}
            >
              <IconFileText
                size={14}
                className={isLightMode ? 'text-[#4A685D]' : 'text-[#45D6E6]'}
              />
              <span>Resume</span>
              <span className="sr-only"> (View verified ATS PDF)</span>
            </button>

            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg text-xs font-body font-medium border transition-colors duration-editorial focus-visible:outline-none focus-visible:ring-2 ${
                isLightMode
                  ? 'border-[#E3DED3] bg-white hover:bg-[#EDEAE2] text-[#525955] hover:text-[#252A2A] focus-visible:ring-[#4A685D]'
                  : 'border-white/[0.12] bg-[#101722] hover:bg-white/[0.08] text-[#A7B2C0] hover:text-[#F3F2ED] focus-visible:ring-[#45D6E6]'
              }`}
            >
              <IconGithub size={14} />
              <span>GitHub</span>
              <span className="sr-only"> Naveen B profile (opens in new tab)</span>
            </a>
          </div>

          {/* Mobile & Tablet Menu Button (>= 44x44 CSS pixels) */}
          <button
            ref={mobileMenuBtnRef}
            type="button"
            data-testid="mobile-menu-btn"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setIsMobileMenuOpen(true)}
            className={`${
              is3DActive ? 'md:hidden' : 'xl:hidden'
            } inline-flex items-center justify-center gap-2 min-w-[44px] min-h-[44px] px-3 rounded-lg border text-sm font-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${
              isLightMode
                ? 'border-[#E3DED3] bg-white hover:bg-[#EDEAE2] text-[#252A2A] focus-visible:ring-[#4A685D]'
                : 'border-white/[0.14] bg-[#141D29] hover:bg-[#1A2532] text-[#F3F2ED] focus-visible:ring-[#45D6E6]'
            }`}
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            <span>Menu</span>
          </button>
        </div>
      </header>

      {/* Accessible Tablet & Mobile Navigation Drawer (>= 44x44px touch targets) */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio Navigation Menu"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMobileMenuOpen(false);
          }}
          className="fixed inset-0 z-50 flex justify-end bg-[#252A2A]/45 backdrop-blur-sm"
        >
          <div
            id="mobile-nav-drawer"
            ref={mobileDrawerRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs h-full overflow-y-auto bg-[#F5F3EE] text-[#252A2A] border-l border-[#E3DED3] p-5 flex flex-col justify-between shadow-2xl focus:outline-none"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
                <div>
                  <span className="font-display font-bold text-base text-[#252A2A] block">
                    {PROFILE_INFO.name}
                  </span>
                  <span className="font-body text-xs text-[#69716D]">
                    Full-Stack AI Engineer
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-white border border-[#E3DED3] text-[#252A2A] hover:bg-[#EDEAE2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D]"
                  aria-label="Close navigation menu"
                >
                  <IconClose size={20} />
                </button>
              </div>

              {/* Experience Mode Group */}
              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#69716D] block">
                  Experience Mode
                </span>
                {isWebGLSupported && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onSet3DMode(true);
                      }}
                      aria-pressed={is3DEnabled}
                      className={`min-h-[44px] px-3 rounded-lg border text-sm font-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D] ${
                        is3DEnabled
                          ? 'bg-[#4A685D] border-[#4A685D] text-white font-semibold'
                          : 'bg-white border-[#E3DED3] text-[#252A2A] hover:bg-[#EDEAE2]'
                      }`}
                    >
                      3D Cinematic
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onSet3DMode(false);
                      }}
                      aria-pressed={!is3DEnabled}
                      className={`min-h-[44px] px-3 rounded-lg border text-sm font-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D] ${
                        !is3DEnabled
                          ? 'bg-[#4A685D] border-[#4A685D] text-white font-semibold'
                          : 'bg-white border-[#E3DED3] text-[#252A2A] hover:bg-[#EDEAE2]'
                      }`}
                    >
                      2D Portfolio
                    </button>
                  </div>
                )}

                {onOpenRecruiterView && (
                  <button
                    type="button"
                    data-testid="recruiter-view-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenRecruiterView(mobileMenuBtnRef.current);
                    }}
                    className="w-full min-h-[44px] px-4 rounded-lg border border-[#D5C9B4] bg-[#F4EEE4] hover:bg-[#EAE1D2] text-[#785E37] font-body text-sm font-semibold flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D]"
                  >
                    <span>Recruiter View</span>
                    <span className="font-mono text-xs">Dossier</span>
                  </button>
                )}
              </div>

              {/* 2D Portfolio Sections */}
              {!is3DActive && (
                <nav aria-label="Mobile Portfolio Sections" className="space-y-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#69716D] block mb-2">
                    Sections
                  </span>
                  {NAV_ITEMS_2D.map((item) => {
                    const isActive = active2DSectionId === item.domId;
                    return (
                      <button
                        key={item.domId}
                        type="button"
                        onClick={() => handleMobileSectionJump(item.locId, item.domId)}
                        className={`w-full min-h-[44px] px-3.5 rounded-lg text-left font-body text-sm transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D] ${
                          isActive
                            ? 'bg-white border border-[#E3DED3] text-[#3D574E] font-semibold'
                            : 'text-[#252A2A] hover:bg-[#EDEAE2]'
                        }`}
                      >
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>

            <div className="pt-5 border-t border-[#E8E4DC] space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenResumeModal();
                }}
                className="w-full cwe-editorial-btn-primary"
              >
                <IconFileText size={16} />
                <span>Resume (PDF)</span>
              </button>
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full cwe-editorial-btn-secondary"
              >
                <IconGithub size={16} />
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
