/**
 * @file clients/portfolio/src/components/sections/Location06Skyline.tsx
 * @description Location 06 — The Skyline Destination: Executive contact summit and direct communication.
 */

import React, { useState } from 'react';
import { PROFILE_INFO } from '../../data/portfolioData.js';
import { IconMail, IconGithub, IconFileText, IconCheck } from '../ui/Icons.js';

export interface Location06SkylineProps {
  readonly onResumeClick: () => void;
  readonly onOpenPrivacyModal: () => void;
  readonly onOpenCookieBanner: () => void;
}

export const Location06Skyline: React.FC<Location06SkylineProps> = ({
  onResumeClick,
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
      // Fallback
    }
  };

  return (
    <section
      id="location-skyline"
      aria-label="Location 06: The Skyline Destination"
      className="min-h-screen flex items-center justify-center relative px-4 md:px-8 py-24"
    >
      <div className="w-full max-w-4xl mx-auto z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-obsidian-950/85 backdrop-blur-xl border border-white/15 shadow-2xl space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <p className="font-mono text-xs tracking-widest text-accent-cyan uppercase">
              LOCATION 06 // THE SKYLINE DESTINATION
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white uppercase leading-tight">
              LET'S BUILD SOMETHING INTELLIGENT.
            </h2>
            <p className="text-sm md:text-base font-mono text-titanium-300">
              {PROFILE_INFO.name} • {PROFILE_INFO.roleTitle}
            </p>
          </div>

          <p className="text-sm md:text-base text-titanium-200 leading-relaxed font-body max-w-2xl">
            Currently open to discussions regarding Full-Stack AI engineering, autonomous agent pipelines,
            cloud microservice architectures, and systems engineering roles.
          </p>

          {/* Contact Direct Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Card */}
            <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 hover:border-accent-cyan/40 transition-all flex flex-col justify-between space-y-3">
              <div>
                <span className="font-mono text-[10px] text-accent-cyan font-bold uppercase tracking-wider">
                  DIRECT ELECTRONIC INQUIRY
                </span>
                <p className="font-mono text-sm text-white font-semibold mt-1 break-all">
                  {PROFILE_INFO.email}
                </p>
                <p className="text-xs text-titanium-400 mt-1">
                  Zero spam, direct inbox delivery via standard RFC mailto protocol.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <a
                  href={`mailto:${PROFILE_INFO.email}?subject=Engineering%20Collaboration%20Inquiry`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-accent-cyan text-obsidian-950 font-mono text-xs font-bold hover:bg-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                >
                  <IconMail size={16} /> SEND EMAIL
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                  aria-label="Copy email address to clipboard"
                >
                  {copiedEmail ? <IconCheck size={16} className="text-emerald-400" /> : 'COPY'}
                </button>
              </div>
            </div>

            {/* GitHub & Source Card */}
            <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 hover:border-accent-cyan/40 transition-all flex flex-col justify-between space-y-3">
              <div>
                <span className="font-mono text-[10px] text-accent-cyan font-bold uppercase tracking-wider">
                  SOURCE CODE & REPOSITORIES
                </span>
                <p className="font-mono text-sm text-white font-semibold mt-1">
                  github.com/{PROFILE_INFO.githubHandle}
                </p>
                <p className="text-xs text-titanium-400 mt-1">
                  Open-source implementations, RAG pipelines, and full-stack modules.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10">
                <a
                  href={PROFILE_INFO.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                >
                  <IconGithub size={16} /> VISIT GITHUB PROFILE
                </a>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onResumeClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-xs font-semibold tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              <IconFileText size={16} className="text-accent-cyan" />
              <span>DOWNLOAD ATS RESUME (PDF)</span>
            </button>

            <div className="flex items-center gap-4 text-xs font-mono text-titanium-400">
              <button
                type="button"
                onClick={onOpenPrivacyModal}
                className="hover:text-accent-cyan underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan rounded"
              >
                Privacy & Legal Policies
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={onOpenCookieBanner}
                className="hover:text-accent-cyan underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan rounded"
              >
                Cookie Preferences
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center font-mono text-[11px] text-titanium-400 pt-4">
            <p>NAVEEN B © 2026 // CREATIVE WEB ENGINE (CWE) CANONICAL PLATFORM</p>
            <p className="text-[10px] text-titanium-400 mt-1">
              $0 Infrastructure Spend • Zero Tracking Cookies by Default • Keyboard & Screen-Reader Accessible
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
