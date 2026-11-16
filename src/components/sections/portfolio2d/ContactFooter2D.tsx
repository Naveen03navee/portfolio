/**
 * @file clients/portfolio/src/components/sections/portfolio2d/ContactFooter2D.tsx
 * @description Light Warm Editorial contact collaboration section and legal/privacy footer.
 */

import React, { useState } from 'react';
import { PROFILE_INFO } from '../../../data/portfolioData.js';
import { SectionHeading } from '../../ui/SectionHeading.js';
import { IconFileText, IconGithub, IconMail, IconShield } from '../../ui/Icons.js';

export interface ContactFooter2DProps {
  readonly onOpenPrivacyModal: () => void;
  readonly onOpenCookieBanner: () => void;
}

export const ContactFooter2D: React.FC<ContactFooter2DProps> = ({
  onOpenPrivacyModal,
  onOpenCookieBanner,
}) => {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const handleCopyEmail = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(PROFILE_INFO.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    } catch {
      // Clipboard API unavailable in restricted context
    }
  };

  return (
    <section
      id="section-contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-20 py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF]"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <SectionHeading
          index="07"
          eyebrow="Contact"
          title="Let's Build Something Intelligent"
          headingId="contact-heading"
          subtitle="Open to discussions regarding Full-Stack AI engineering, RAG automation pipelines, and backend systems engineering roles in Bengaluru or remote teams."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-7 rounded-xl bg-[#F5F3EE] border border-[#E3DED3] flex flex-col justify-between space-y-5">
            <div>
              <span className="font-mono text-[11px] text-[#69716D] uppercase tracking-[0.12em]">
                Direct Email
              </span>
              <p className="font-display text-lg text-[#252A2A] font-semibold mt-1.5 break-all">
                {PROFILE_INFO.email}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`mailto:${PROFILE_INFO.email}?subject=Engineering%20Opportunity`}
                className="cwe-editorial-btn-primary flex-1 text-xs sm:text-sm"
              >
                <IconMail size={15} />
                <span>Send Email</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="cwe-editorial-btn-secondary text-xs sm:text-sm"
              >
                {copiedEmail ? 'Copied to Clipboard' : 'Copy Email'}
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-xl bg-[#F5F3EE] border border-[#E3DED3] flex flex-col justify-between space-y-5">
            <div>
              <span className="font-mono text-[11px] text-[#69716D] uppercase tracking-[0.12em]">
                Repositories &amp; Resume
              </span>
              <p className="font-display text-lg text-[#252A2A] font-semibold mt-1.5">
                github.com/{PROFILE_INFO.githubHandle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={PROFILE_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cwe-editorial-btn-secondary flex-1 text-xs sm:text-sm"
              >
                <IconGithub size={15} />
                <span>GitHub Profile</span>
              </a>
              <a
                href={PROFILE_INFO.resumePdfPath}
                download="Naveen_B_Resume.pdf"
                className="cwe-editorial-btn-secondary flex-1 text-xs sm:text-sm text-[#4A685D]"
              >
                <IconFileText size={15} />
                <span>ATS Resume (PDF)</span>
              </a>
            </div>
          </div>
        </div>

        <footer className="pt-7 border-t border-[#E8E4DC] flex flex-wrap items-center justify-between gap-4 text-xs font-body text-[#69716D]">
          <div className="flex items-center gap-2">
            <IconShield size={15} className="text-[#4A685D]" />
            <span>{PROFILE_INFO.name} © 2026 · Bengaluru, India</span>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className="hover:text-[#252A2A] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D] rounded"
            >
              Privacy &amp; Legal Policies
            </button>
            <button
              type="button"
              onClick={onOpenCookieBanner}
              className="hover:text-[#252A2A] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A685D] rounded"
            >
              Cookie Preferences
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
};
