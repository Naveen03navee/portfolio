/**
 * @file clients/portfolio/src/hooks/useWebGLProbe.ts
 * @description Defensive WebGL capability probe with graceful 2D Portfolio fallback.
 * Respects prefers-reduced-motion and mobile coarse-pointer ergonomics while always
 * allowing explicit user toggling when WebGL is supported.
 */

import { useState, useEffect, useCallback } from 'react';
import { detectWebGLCapabilities } from '../engine/webglCapabilities.js';

export interface WebGLProbeResult {
  readonly isSupported: boolean;
  readonly isEnabled: boolean;
  readonly rendererName: string;
  readonly hasChecked: boolean;
  readonly toggle3DMode: () => void;
  readonly setMode: (enable3D: boolean) => void;
  readonly fallbackTo2D: () => void;
}

const STORAGE_KEY = 'cwe_portfolio_3d_mode';

export function useWebGLProbe(): WebGLProbeResult {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [rendererName, setRendererName] = useState<string>('Probing...');
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  useEffect(() => {
    try {
      const caps = detectWebGLCapabilities();
      if (!caps.isWebGL2 && caps.maxTextureSize < 2048) {
        setIsSupported(false);
        setIsEnabled(false);
        setRendererName('WebGL Unsupported');
      } else {
        setIsSupported(true);
        const savedPref = localStorage.getItem(STORAGE_KEY);
        if (savedPref === 'disabled') {
          setIsEnabled(false);
        } else if (savedPref === 'enabled') {
          setIsEnabled(true);
        } else {
          // Automatic ergonomic default: prefer 2D Portfolio for reduced-motion or narrow coarse-pointer phones
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const isMobileHandset = window.matchMedia('(max-width: 767px) and (pointer: coarse)').matches;
          setIsEnabled(!(prefersReduced || isMobileHandset));
        }
        setRendererName(caps.renderer || 'Standard WebGL');
      }
    } catch {
      setIsSupported(false);
      setIsEnabled(false);
      setRendererName('Hardware Acceleration Disabled');
    } finally {
      setHasChecked(true);
    }
  }, []);

  const setMode = useCallback(
    (enable3D: boolean) => {
      if (enable3D && !isSupported) return;
      setIsEnabled(enable3D);
      try {
        localStorage.setItem(STORAGE_KEY, enable3D ? 'enabled' : 'disabled');
      } catch {
        // Ignore restricted storage mode cleanly
      }
    },
    [isSupported]
  );

  const toggle3DMode = useCallback(() => {
    if (!isSupported) return;
    setIsEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'enabled' : 'disabled');
      } catch {
        // Ignore restricted storage mode cleanly
      }
      return next;
    });
  }, [isSupported]);

  const fallbackTo2D = useCallback(() => {
    setIsSupported(false);
    setIsEnabled(false);
    setRendererName('WebGL Fallback Active');
  }, []);

  return {
    isSupported,
    isEnabled,
    rendererName,
    hasChecked,
    toggle3DMode,
    setMode,
    fallbackTo2D,
  };
}
