/**
 * @file clients/portfolio/src/types/portfolio.types.ts
 * @description Strongly-typed domain contracts for Naveen B's Cinematic 3D Portfolio.
 * Adheres strictly to Zero any tolerance and Defensive Systems Architecture.
 */

export type WorldLocationId = 'gateway' | 'innovation' | 'technology' | 'projects' | 'campus' | 'skyline';

export interface WorldLocationMeta {
  readonly id: WorldLocationId;
  readonly index: number;
  readonly name: string;
  readonly subtitle: string;
  readonly progressRange: readonly [number, number];
  readonly focusHeadline: string;
}

export interface EducationEntry {
  readonly degree: string;
  readonly period: string;
  readonly institution: string;
  readonly location: string;
  readonly focus: string;
  readonly isVerified: boolean;
}

export interface ExperienceEntry {
  readonly role: string;
  readonly company: string;
  readonly location: string;
  readonly period: string;
  readonly isCompleted: boolean;
  readonly description: readonly string[];
  readonly technologies: readonly string[];
}

export type TechCategoryDomain =
  | 'AI & LLM Engineering'
  | 'Backend Development'
  | 'Frontend Development'
  | 'Databases & Vector Stores'
  | 'Cloud & DevOps'
  | 'Automation & Infrastructure';

export interface TechCategory {
  readonly domain: TechCategoryDomain;
  readonly description: string;
  readonly skills: readonly string[];
}

export type ProjectDevelopmentStatus = 'Completed' | 'Active Development' | 'Production Microservice';

export type ProjectAccentKey = 'cyan' | 'violet' | 'emerald' | 'amber';

export interface ProjectArchitectureStage {
  readonly label: string;
  readonly detail: string;
}

export interface ProjectGalleryMedia {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
}

export interface ProjectShowcase {
  readonly id: string;
  readonly projectNumber: string;
  readonly title: string;
  readonly displayTitle: string;
  readonly tag: string;
  readonly period: string;
  readonly status: ProjectDevelopmentStatus;
  readonly accentTheme: ProjectAccentKey;
  readonly shortDescription: string;
  readonly technicalContribution: string;
  readonly architectureOverview: string;
  readonly architectureStages: readonly ProjectArchitectureStage[];
  readonly technologies: readonly string[];
  readonly keyHighlights: readonly string[];
  readonly githubUrl: string;
  readonly gitCloneUrl?: string;
  readonly liveUrl: string;
  readonly screenshotPath: string;
  readonly previewAlt: string;
  readonly galleryImages?: readonly ProjectGalleryMedia[];
}

export interface CookiePreferences {
  readonly essential: boolean; // Always true
  readonly analytics: boolean;
  readonly hasResponded: boolean;
}

export type UILifecycleStatus = 'idle' | 'loading' | 'success' | 'error';

