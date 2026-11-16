/**
 * @file clients/portfolio/src/hooks/useCookieConsent.ts
 * @description Defensive Cookie Consent Management adhering strictly to GDPR/CCPA.
 * Enforces prior opt-in, equal prominence Reject/Accept, and unbundled categories.
 */

import { useState, useEffect, useCallback } from 'react';
import type { CookiePreferences } from '../types/portfolio.types.js';

const STORAGE_KEY = 'cwe_portfolio_cookie_consent_v1';

export interface CookieConsentHook {
  readonly preferences: CookiePreferences;
  readonly isBannerVisible: boolean;
  readonly acceptAll: () => void;
  readonly rejectAll: () => void;
  readonly saveCustom: (analytics: boolean) => void;
  readonly reopenBanner: () => void;
}

export function useCookieConsent(): CookieConsentHook {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    hasResponded: false,
  });
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { essential: boolean; analytics: boolean };
        setPreferences({
          essential: true,
          analytics: Boolean(parsed.analytics),
          hasResponded: true,
        });
        setIsBannerVisible(false);
      } else {
        // First visit: Show banner, prior opt-in (analytics false)
        setIsBannerVisible(true);
      }
    } catch {
      // In case localStorage is blocked or private browsing throws
      setIsBannerVisible(false);
    }
  }, []);

  const saveToStorage = (analytics: boolean): void => {
    const updated: CookiePreferences = {
      essential: true,
      analytics,
      hasResponded: true,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ essential: true, analytics }));
    } catch {
      // Safely ignore storage failure in strict sandbox
    }
    setPreferences(updated);
    setIsBannerVisible(false);
  };

  const acceptAll = useCallback(() => {
    saveToStorage(true);
  }, []);

  const rejectAll = useCallback(() => {
    saveToStorage(false);
  }, []);

  const saveCustom = useCallback((analytics: boolean) => {
    saveToStorage(analytics);
  }, []);

  const reopenBanner = useCallback(() => {
    setIsBannerVisible(true);
  }, []);

  return {
    preferences,
    isBannerVisible,
    acceptAll,
    rejectAll,
    saveCustom,
    reopenBanner,
  };
}

