/**
 * @file clients/portfolio/src/components/ui/LegalModal.tsx
 * @description Accessible dialog presenting Privacy Policy, Terms of Service, and DSAR rights.
 */

import React, { useRef } from 'react';
import { PROFILE_INFO } from '../../data/portfolioData.js';
import { IconClose, IconShield, IconMail } from './Icons.js';
import { useFocusTrapModal } from '../../hooks/useFocusTrapModal.js';

export interface LegalModalProps {
  readonly isOpen: boolean;
  readonly isLightMode?: boolean;
  readonly onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  isLightMode = false,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  useFocusTrapModal(isOpen, dialogRef, onClose);

  if (!isOpen) return null;

  const headingCls = `font-display font-bold text-base ${
    isLightMode ? 'text-[#252A2A]' : 'text-white'
  }`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
        isLightMode ? 'bg-[#252A2A]/55' : 'bg-[#0B1017]/85'
      }`}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl p-6 md:p-8 shadow-2xl font-body focus:outline-none border ${
          isLightMode
            ? 'bg-[#FFFFFF] border-[#E3DED3] text-[#252A2A]'
            : 'bg-[#101722] border-white/[0.1] text-[#F3F2ED]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b pb-4 ${
            isLightMode ? 'border-[#E8E4DC]' : 'border-white/[0.08]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <IconShield
              size={22}
              className={isLightMode ? 'text-[#4A685D]' : 'text-[#45D6E6]'}
            />
            <h2
              id="legal-modal-title"
              className={`text-lg sm:text-xl font-display font-bold ${
                isLightMode ? 'text-[#252A2A]' : 'text-[#F3F2ED]'
              }`}
            >
              Legal, Privacy &amp; Data Governance Policies
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border transition-colors duration-editorial ${
              isLightMode
                ? 'bg-[#F5F3EE] border-[#E3DED3] text-[#525955] hover:text-[#252A2A] hover:bg-[#EDEAE2]'
                : 'bg-[#141D29] border-white/[0.08] text-[#A7B2C0] hover:text-[#F3F2ED] hover:bg-[#1A2532]'
            }`}
            aria-label="Close legal modal"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Content */}
        <div
          className={`mt-6 space-y-6 text-sm leading-relaxed font-body ${
            isLightMode ? 'text-[#525955]' : 'text-[#A7B2C0]'
          }`}
        >
          <section>
            <h3 className={headingCls}>1. Data Controller Identification</h3>
            <p className="mt-1">
              This portfolio website is operated by{' '}
              <strong className={isLightMode ? 'text-[#252A2A]' : 'text-white'}>
                {PROFILE_INFO.name}
              </strong>
              , Full-Stack AI Engineer, based in Bengaluru, India. For all privacy, data rights, and engineering
              inquiries, contact directly at{' '}
              <a
                href={`mailto:${PROFILE_INFO.email}`}
                className={`underline rounded ${
                  isLightMode ? 'text-[#4A685D] hover:text-[#252A2A]' : 'text-[#45D6E6] hover:text-cyan-300'
                }`}
              >
                {PROFILE_INFO.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h3 className={headingCls}>2. Privacy by Design &amp; Data Minimization</h3>
            <p className="mt-1">
              In accordance with GDPR (Articles 5 &amp; 6) and CCPA/CPRA, this portfolio enforces strict Data
              Minimization. We do not harvest auxiliary telemetry, sell personal information, or employ third-party
              advertising beacons. Contact actions utilize standard <code>mailto:</code> protocols that execute
              entirely within your client&apos;s email application.
            </p>
          </section>

          <section>
            <h3 className={headingCls}>3. Data Subject Access Rights (DSAR) &amp; Erasure</h3>
            <p className="mt-1">
              You maintain the fundamental right to access, rectify, or request permanent deletion of any electronic
              communications transmitted to us. To submit a verifiable DSAR request or erasure inquiry, send an email
              titled{' '}
              <span className={`font-mono ${isLightMode ? 'text-[#4A685D]' : 'text-[#45D6E6]'}`}>
                &quot;DSAR Request - {PROFILE_INFO.name}&quot;
              </span>{' '}
              to <strong>{PROFILE_INFO.email}</strong>. Requests are processed within 30 days without fees.
            </p>
          </section>

          <section>
            <h3 className={headingCls}>4. Terms of Service &amp; Intellectual Property</h3>
            <p className="mt-1">
              The proprietary architectural designs, source code models, and creative presentations presented herein
              are authored by Naveen B on the Creative Web Engine (CWE) framework. Verified open-source projects are
              distributed under their respective repository licenses.
            </p>
          </section>

          <div
            className={`pt-5 border-t flex flex-wrap items-center justify-between gap-3 ${
              isLightMode ? 'border-[#E8E4DC]' : 'border-white/[0.07]'
            }`}
          >
            <span className={`font-mono text-xs ${isLightMode ? 'text-[#69716D]' : 'text-[#8B99AB]'}`}>
              Bengaluru, India · Last Updated: November 2026
            </span>
            <a
              href={`mailto:${PROFILE_INFO.email}?subject=Inquiry%20Regarding%20Portfolio`}
              className={isLightMode ? 'cwe-editorial-btn-primary text-xs' : 'cwe-btn-primary text-xs'}
            >
              <IconMail size={15} /> Contact Data Controller
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

