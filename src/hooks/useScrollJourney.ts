/**
 * @file clients/portfolio/src/hooks/useScrollJourney.ts
 * @description Scroll choreography tracker supporting both 3D spline progress and 2D DOM landmarks.
 */

import { useState, useEffect, useCallback } from 'react';
import { WORLD_LOCATIONS } from '../data/portfolioData.js';
import type { WorldLocationId, WorldLocationMeta } from '../types/portfolio.types.js';

export interface ScrollJourneyOptions {
  readonly is3DActive?: boolean;
}

export interface ScrollJourneyState {
  readonly progress: number; // 0.0 to 1.0
  readonly activeLocation: WorldLocationMeta;
  readonly active2DSectionId: string;
  readonly isReducedMotion: boolean;
  readonly jumpToLocation: (id: WorldLocationId, sectionElementId?: string) => void;
}

const LOCATION_DOM_IDS: Record<WorldLocationId, string> = {
  gateway: 'section-hero',
  innovation: 'section-about',
  technology: 'section-skills',
  projects: 'section-projects',
  campus: 'section-experience',
  skyline: 'section-contact',
};

const TWO_D_SECTION_ORDER: ReadonlyArray<{
  readonly domId: string;
  readonly locId: WorldLocationId;
}> = [
    { domId: 'section-hero', locId: 'gateway' },
    { domId: 'section-about', locId: 'innovation' },
    { domId: 'section-skills', locId: 'technology' },
    { domId: 'section-experience', locId: 'campus' },
    { domId: 'section-education', locId: 'innovation' },
    { domId: 'section-projects', locId: 'projects' },
    { domId: 'section-contact', locId: 'skyline' },
  ];

export function useScrollJourney(options: ScrollJourneyOptions = {}): ScrollJourneyState {
  const { is3DActive = true } = options;
  const [progress, setProgress] = useState<number>(0);
  const [activeLocation, setActiveLocation] = useState<WorldLocationMeta>(WORLD_LOCATIONS[0]);
  const [active2DSectionId, setActive2DSectionId] = useState<string>('section-hero');
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent): void => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = (): void => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const rawProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
        const clamped = Math.max(0, Math.min(1, rawProgress));
        setProgress(clamped);

        if (is3DActive) {
          const current =
            WORLD_LOCATIONS.find(
              (loc) => clamped >= loc.progressRange[0] && clamped <= loc.progressRange[1]
            ) ?? (clamped > 0.5 ? WORLD_LOCATIONS[WORLD_LOCATIONS.length - 1] : WORLD_LOCATIONS[0]);
          setActiveLocation(current);
        } else {
            // Determine active section in 2D Portfolio based on DOM section positions
            let matchedLoc: WorldLocationMeta = WORLD_LOCATIONS[0];
            let matchedDomId = 'section-hero';
            const threshold = Math.max(240, window.innerHeight * 0.4);
            for (const entry of TWO_D_SECTION_ORDER) {
              const el = document.getElementById(entry.domId);
              if (!el) continue;
              const rect = el.getBoundingClientRect();
              if (rect.top <= threshold) {
                matchedDomId = entry.domId;
                const loc = WORLD_LOCATIONS.find((l) => l.id === entry.locId);
                if (loc) matchedLoc = loc;
              }
            }
            setActive2DSectionId(matchedDomId);
            setActiveLocation(matchedLoc);
          }

          ticking = false;
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [is3DActive]);

  const jumpToLocation = useCallback(
    (id: WorldLocationId, sectionElementId?: string) => {
      if (!is3DActive) {
        const domId = sectionElementId ?? LOCATION_DOM_IDS[id];
        const targetEl = document.getElementById(domId);
        if (targetEl) {
          targetEl.scrollIntoView({
            behavior: isReducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
          return;
        }
      }

      const target = WORLD_LOCATIONS.find((l) => l.id === id);
      if (!target) return;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const midT = (target.progressRange[0] + target.progressRange[1]) / 2;
      const targetScrollY = midT * maxScroll;

      window.scrollTo({
        top: targetScrollY,
        behavior: isReducedMotion ? 'auto' : 'smooth',
      });
    },
    [is3DActive, isReducedMotion]
  );

  return {
    progress,
    activeLocation,
    active2DSectionId,
    isReducedMotion,
    jumpToLocation,
  };
}
