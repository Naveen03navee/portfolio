/**
 * @file clients/portfolio/src/components/sections/Location01Gateway.tsx
 * @description Location 01 — The Grand City Gateway: Executive arrival and developer identity.
 */

import React from 'react';
import { PROFILE_INFO } from '../../data/portfolioData.js';
import { IconArrowRight, IconFileText, IconMail } from '../ui/Icons.js';

export interface Location01GatewayProps {
  readonly onExploreClick: () => void;
  readonly onContactClick: () => void;
  readonly onResumeClick: () => void;
}

export const Location01Gateway: React.FC<Location01GatewayProps> = ({
  onExploreClick,
  onContactClick,
  onResumeClick,
}) => {
  return (
    <section
      id="location-gateway"
      aria-label="Location 01: The Grand City Gateway"
      className="min-h-screen flex items-center justify-center relative px-4 md:px-8 py-24"
    >
      <div className="w-full max-w-4xl mx-auto z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-obsidian-950/80 backdrop-blur-xl border border-white/15 shadow-2xl">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AVAILABLE FOR FULL-STACK AI & SYSTEMS ENGINEERING ROLES</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <p className="font-mono text-xs tracking-widest text-accent-cyan uppercase">
              LOCATION 01 // THE GRAND CITY GATEWAY
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white uppercase leading-none">
              {PROFILE_INFO.name}
            </h1>
            <p className="text-lg md:text-2xl font-display font-bold text-accent-cyan tracking-wide">
              FULL-STACK AI ENGINEER
            </p>
            <p className="text-sm md:text-base font-mono text-titanium-300">
              AI AUTOMATION & SYSTEMS DEVELOPER // BENGALURU, INDIA
            </p>
          </div>

          {/* Narrative */}
          <p className="mt-6 text-sm md:text-base text-titanium-300 leading-relaxed max-w-2xl font-body">
            Building intelligent applications, AI-powered systems, automation workflows, and production-grade software.
            Specializing in grounded RAG architectures, deterministic validation gates, and containerized microservice deployments.
          </p>

          {/* Direct Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-cyan hover:bg-cyan-400 text-obsidian-950 font-mono text-xs font-bold tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan shadow-lg shadow-accent-cyan/20"
            >
              <span>EXPLORE MY WORK</span>
              <IconArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={onResumeClick}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-xs font-semibold tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              <IconFileText size={16} className="text-accent-cyan" />
              <span>VIEW RESUME</span>
            </button>

            <button
              type="button"
              onClick={onContactClick}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-obsidian-900/80 hover:bg-obsidian-800 border border-white/15 text-titanium-300 hover:text-white font-mono text-xs font-semibold tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              <IconMail size={16} />
              <span>CONTACT ME</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

