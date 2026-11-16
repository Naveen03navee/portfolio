/**
 * @file clients/portfolio/src/components/ui/CookieConsentBanner.tsx
 * @description Granular GDPR/CCPA cookie banner with prior opt-in and equal prominence Reject All / Accept All.
 */

import React, { useState } from 'react';
import { IconShield, IconCheck } from './Icons.js';

export interface CookieConsentBannerProps {
  readonly isVisible: boolean;
  readonly isLightMode?: boolean;
  readonly onAcceptAll: () => void;
  readonly onRejectAll: () => void;
  readonly onSaveCustom: (analytics: boolean) => void;
  readonly onOpenPrivacyModal: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  isVisible,
  isLightMode = false,
  onAcceptAll,
  onRejectAll,
  onSaveCustom,
  onOpenPrivacyModal,
}) => {
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(false);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      role="region"
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-[35] backdrop-blur-xl rounded-2xl p-5 shadow-2xl font-body border ${
        isLightMode
          ? 'bg-[#FFFFFF]/96 border-[#E3DED3] text-[#252A2A]'
          : 'bg-[#101722]/95 border-white/[0.1] text-[#F3F2ED]'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`p-2 rounded-lg mt-0.5 shrink-0 ${
            isLightMode ? 'bg-[#E4ECE8] text-[#4A685D]' : 'bg-[#45D6E6]/10 text-[#45D6E6]'
          }`}
        >
          <IconShield size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h2
            className={`text-sm font-display font-bold ${
              isLightMode ? 'text-[#252A2A]' : 'text-[#F3F2ED]'
            }`}
          >
            Privacy &amp; Transparency Preferences
          </h2>
          <p
            className={`text-xs sm:text-[13px] mt-1 leading-relaxed ${
              isLightMode ? 'text-[#525955]' : 'text-[#A7B2C0]'
            }`}
          >
            We use strictly essential local storage for accessibility, mode selection, and session state. No third-party
            tracking or selling of personal data occurs. You may independently choose optional client analytics.
          </p>

          {showPreferences && (
            <div
              className={`mt-3 p-3 rounded-xl border space-y-2.5 text-xs ${
                isLightMode ? 'bg-[#F5F3EE] border-[#E3DED3]' : 'bg-[#0B1017] border-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span
                    className={`font-medium block ${
                      isLightMode ? 'text-[#252A2A]' : 'text-[#F3F2ED]'
                    }`}
                  >
                    Essential Storage
                  </span>
                  <span className={`text-[11px] ${isLightMode ? 'text-[#69716D]' : 'text-[#8B99AB]'}`}>
                    Required for 3D state &amp; accessibility navigation
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                    isLightMode ? 'bg-[#EDEAE2] text-[#525955]' : 'bg-white/[0.07] text-[#A7B2C0]'
                  }`}
                >
                  ALWAYS ACTIVE
                </span>
              </div>
              <div
                className={`flex items-center justify-between gap-3 border-t pt-2 ${
                  isLightMode ? 'border-[#E3DED3]' : 'border-white/[0.07]'
                }`}
              >
                <div>
                  <span
                    className={`font-medium block ${
                      isLightMode ? 'text-[#252A2A]' : 'text-[#F3F2ED]'
                    }`}
                  >
                    Performance Analytics
                  </span>
                  <span className={`text-[11px] ${isLightMode ? 'text-[#69716D]' : 'text-[#8B99AB]'}`}>
                    Anonymous 3D framerate &amp; WebGL capability telemetry
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Toggle anonymous performance analytics"
                  />
                  <div
                    className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                      isLightMode
                        ? 'bg-[#D6D0C4] peer-checked:bg-[#4A685D]'
                        : 'bg-white/20 peer-checked:bg-[#45D6E6]'
                    }`}
                  />
                </label>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {!showPreferences ? (
              <>
                <button
                  type="button"
                  onClick={onRejectAll}
                  className={`flex-1 min-w-[120px] text-xs py-2 text-center ${
                    isLightMode ? 'cwe-editorial-btn-secondary min-h-[38px]' : 'cwe-btn-secondary'
                  }`}
                >
                  Reject All
                </button>
                <button
                  type="button"
                  onClick={onAcceptAll}
                  className={`flex-1 min-w-[120px] text-xs py-2 text-center ${
                    isLightMode ? 'cwe-editorial-btn-primary min-h-[38px]' : 'cwe-btn-primary'
                  }`}
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className={`px-3 py-2 text-xs underline underline-offset-4 rounded ${
                    isLightMode
                      ? 'text-[#525955] hover:text-[#252A2A]'
                      : 'text-[#A7B2C0] hover:text-[#F3F2ED]'
                  }`}
                >
                  Customize
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onSaveCustom(analyticsEnabled)}
                  className={`flex-1 text-xs py-2 ${
                    isLightMode ? 'cwe-editorial-btn-primary min-h-[38px]' : 'cwe-btn-primary'
                  }`}
                >
                  <IconCheck size={14} /> Save Preferences
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className={`text-xs py-2 ${
                    isLightMode ? 'cwe-editorial-btn-secondary min-h-[38px]' : 'cwe-btn-secondary'
                  }`}
                >
                  Back
                </button>
              </>
            )}
          </div>

          <div
            className={`mt-3 flex items-center gap-2.5 text-[11px] ${
              isLightMode ? 'text-[#69716D]' : 'text-[#8B99AB]'
            }`}
          >
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className={`underline underline-offset-2 rounded ${
                isLightMode ? 'hover:text-[#252A2A]' : 'hover:text-[#F3F2ED]'
              }`}
            >
              Privacy Policy &amp; DSAR Deletion
            </button>
            <span aria-hidden="true">·</span>
            <span>Zero Dark Patterns Guarantee</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
