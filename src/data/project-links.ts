/**
 * @file clients/portfolio/src/data/project-links.ts
 * @description Single authoritative configuration for Naveen B's 4 signature projects.
 * Maps exact live deployments, repository-page URLs, git clone origins, Render health endpoints,
 * 3D billboard mesh identifiers, and accent palettes without duplicating URLs across components.
 */

export type HostingProvider = 'cloudflare-pages' | 'render';
export type DevelopmentStatus = 'production' | 'active-development';
export type ProjectAccentTheme = 'cyan' | 'violet' | 'emerald' | 'amber';

export interface ProjectAccentPalette {
  readonly theme: ProjectAccentTheme;
  readonly primaryHex: string;
  readonly secondaryHex: string;
  readonly borderClass: string;
  readonly glowClass: string;
  readonly badgeClass: string;
  readonly primaryBtnClass: string;
  readonly textAccentClass: string;
}

export const PROJECT_ACCENT_PALETTES: Record<ProjectAccentTheme, ProjectAccentPalette> = {
  cyan: {
    theme: 'cyan',
    primaryHex: '#4A685D',
    secondaryHex: '#66877B',
    borderClass: 'border-[#E3DED3] hover:border-[#66877B]',
    glowClass: 'shadow-[0_12px_36px_rgba(37,42,42,0.08)]',
    badgeClass: 'bg-[#E4ECE8] text-[#3D574E] border-[#CBD8D1]',
    primaryBtnClass: 'cwe-editorial-btn-primary',
    textAccentClass: 'text-[#4A685D]',
  },
  violet: {
    theme: 'violet',
    primaryHex: '#6D5A88',
    secondaryHex: '#B99B70',
    borderClass: 'border-[#E3DED3] hover:border-[#B99B70]',
    glowClass: 'shadow-[0_12px_36px_rgba(37,42,42,0.08)]',
    badgeClass: 'bg-[#F0ECF5] text-[#564571] border-[#DDD5E8]',
    primaryBtnClass: 'cwe-editorial-btn-primary',
    textAccentClass: 'text-[#5A4875]',
  },
  emerald: {
    theme: 'emerald',
    primaryHex: '#4A685D',
    secondaryHex: '#84A095',
    borderClass: 'border-[#E3DED3] hover:border-[#66877B]',
    glowClass: 'shadow-[0_12px_36px_rgba(37,42,42,0.08)]',
    badgeClass: 'bg-[#E4ECE8] text-[#3D574E] border-[#CBD8D1]',
    primaryBtnClass: 'cwe-editorial-btn-primary',
    textAccentClass: 'text-[#3D574E]',
  },
  amber: {
    theme: 'amber',
    primaryHex: '#8A6B3F',
    secondaryHex: '#B99B70',
    borderClass: 'border-[#E3DED3] hover:border-[#B99B70]',
    glowClass: 'shadow-[0_12px_36px_rgba(37,42,42,0.08)]',
    badgeClass: 'bg-[#F4EEE4] text-[#785E37] border-[#E3D6BF]',
    primaryBtnClass: 'cwe-editorial-btn-primary',
    textAccentClass: 'text-[#785E37]',
  },
};

export interface ProjectLinks {
  readonly id: string;
  readonly projectNumber: string;
  readonly billboardMeshName: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly category: string;
  readonly hostingProvider: HostingProvider;
  readonly healthUrl: string;
  readonly healthCheckType: 'cors-http' | 'cors-json';
  readonly requiresWakeup: boolean;
  readonly developmentStatus: DevelopmentStatus;
  readonly accentTheme: ProjectAccentTheme;
  readonly liveUrl: string;
  /** Clean visitor-facing GitHub repository page URL (HTTP 200 OK). */
  readonly githubUrl: string;
  /** Exact upstream Git remote origin URL with .git suffix preserved verbatim. */
  readonly gitCloneUrl: string;
  readonly previewImage: string;
  readonly previewAlt: string;
  readonly description: string;
  /** Backward-compatible status key for callers checking legacy shape. */
  readonly status: 'production' | 'active-development' | 'archived';
}

export const projectLinks: readonly ProjectLinks[] = [
  {
    id: 'jarvis',
    projectNumber: '01',
    billboardMeshName: 'Display_Project_Jarvis',
    title: 'J.A.R.V.I.S.',
    shortTitle: 'J.A.R.V.I.S.',
    category: 'Voice-First AI Assistant',
    hostingProvider: 'cloudflare-pages',
    healthUrl: 'https://j-a-r-v-i-s-3c3.pages.dev/',
    healthCheckType: 'cors-http',
    requiresWakeup: false,
    developmentStatus: 'active-development',
    status: 'active-development',
    accentTheme: 'cyan',
    liveUrl: 'https://j-a-r-v-i-s-3c3.pages.dev/',
    githubUrl: 'https://github.com/Naveenbnnavee/J.A.R.V.I.S',
    gitCloneUrl: 'https://github.com/Naveenbnnavee/J.A.R.V.I.S.git',
    previewImage: '/assets/previews/project-jarvis.png',
    previewAlt:
      'J.A.R.V.I.S. live showcase interface displaying the cyan voice core visualizer and local Ollama LLM runtime specifications',
    description:
      'Desktop conversational AI orchestrating full-duplex WebSocket audio pipelines, Silero VAD, ChromaDB persistent memory, localized quantized Ollama model routing, and a 60 FPS WebGL Arc-Reactor visualizer shader loop.',
  },
  {
    id: 'biometric-event-gallery',
    projectNumber: '02',
    billboardMeshName: 'Display_Project_Biometric',
    title: 'Biometric Event Gallery',
    shortTitle: 'Biometric Event Gallery',
    category: 'Edge Computer Vision and Event Technology',
    hostingProvider: 'cloudflare-pages',
    healthUrl: 'https://biometric-event-gallery.pages.dev/',
    healthCheckType: 'cors-http',
    requiresWakeup: false,
    developmentStatus: 'production',
    status: 'production',
    accentTheme: 'violet',
    liveUrl: 'https://biometric-event-gallery.pages.dev/',
    githubUrl: 'https://github.com/Naveenbnnavee/biometric-event-gallery',
    gitCloneUrl: 'https://github.com/Naveenbnnavee/biometric-event-gallery.git',
    previewImage: '/assets/previews/project-biometric.png',
    previewAlt:
      'Live Event Biometric Gallery interface displaying the 128-dimensional client-side optical aperture module and zero-server edge stack',
    description:
      'Privacy-first live event photography platform computing 128-dimensional facial descriptor embeddings client-side via WebAssembly and Face-API, achieving zero-server biometric compute and instant cosine similarity vector matching.',
  },
  {
    id: 'smart-qr-attendance',
    projectNumber: '03',
    billboardMeshName: 'Display_Project_SmartQR',
    title: 'Smart QR Attendance',
    shortTitle: 'Smart QR Attendance',
    category: 'Identity Validation and Spatial Security',
    hostingProvider: 'render',
    healthUrl: 'https://smart-qr-attendance-f0xh.onrender.com/health',
    healthCheckType: 'cors-json',
    requiresWakeup: true,
    developmentStatus: 'production',
    status: 'production',
    accentTheme: 'emerald',
    liveUrl: 'https://smart-qr-attendance-f0xh.onrender.com/',
    githubUrl: 'https://github.com/Naveenbnnavee/Smart-QR-Attendance',
    gitCloneUrl: 'https://github.com/Naveenbnnavee/Smart-QR-Attendance.git',
    previewImage: '/assets/previews/project-smartqr.png',
    previewAlt:
      'Smart QR Attendance portal interface featuring the QR verification scanner reticle, Haversine geofencing controls, and login access',
    description:
      'Tamper-resistant attendance validation platform combining rotating cryptographic tokens (5-second TTL), HTML5 high-accuracy geolocation with 10-meter Haversine radius enforcement, and device fingerprint binding.',
  },
  {
    id: 'multi-engine-doc-intel',
    projectNumber: '04',
    billboardMeshName: 'Display_Project_DocIntel',
    title: 'Multi-Engine Document Intelligence',
    shortTitle: 'Multi-Engine Doc Intel',
    category: 'Document AI and Applied GenAI',
    hostingProvider: 'render',
    healthUrl: 'https://multi-engine-doc-intel.onrender.com/health',
    healthCheckType: 'cors-json',
    requiresWakeup: true,
    developmentStatus: 'production',
    status: 'production',
    accentTheme: 'amber',
    liveUrl: 'https://multi-engine-doc-intel.onrender.com/',
    githubUrl: 'https://github.com/Naveenbnnavee/Multi-Engine-Doc-Intel',
    gitCloneUrl: 'https://github.com/Naveenbnnavee/Multi-Engine-Doc-Intel.git',
    previewImage: '/assets/previews/project-docintel.png',
    previewAlt:
      'Enterprise Document Intelligence Engine web interface highlighting in-memory PyPDF parsing, local vector embeddings, ChromaDB indexing, and Gemini synthesis',
    description:
      'Containerized multi-document Retrieval-Augmented Generation (RAG) system featuring semantic PDF chunking, local sentence-transformer embeddings, ChromaDB indexing, verifiable citations, and multi-stage Docker deployment.',
  },
];

export const GITHUB_PROFILE_URL = 'https://github.com/Naveen03navee';

/**
 * Authoritative 3D billboard mesh name -> project id map (Display_* surface quads only).
 */
export const BILLBOARD_MESH_TO_PROJECT_ID: Readonly<Record<string, string>> = Object.freeze(
  projectLinks.reduce<Record<string, string>>((acc, project) => {
    acc[project.billboardMeshName] = project.id;
    return acc;
  }, {})
);

/**
 * Validates whether an external URL is well-formed HTTP/HTTPS.
 */
export function hasActiveLink(url: string | null | undefined): boolean {
  return typeof url === 'string' && url.trim().length > 0 && /^https?:\/\//i.test(url);
}

/**
 * Retrieves authoritative project configuration by project id.
 */
export function getProjectLinkConfig(projectId: string): ProjectLinks | undefined {
  const norm = projectId.toLowerCase().replace(/[-_\s]/g, '');
  return projectLinks.find((p) => {
    const pNorm = p.id.toLowerCase().replace(/[-_\s]/g, '');
    return pNorm === norm || norm.includes(pNorm) || pNorm.includes(norm);
  });
}

/**
 * Resolves a project entry specifically from a 3D billboard display mesh name.
 * Explicitly excludes rear `_Structure` meshes so only display faces activate modals.
 */
export function getProjectByBillboardMesh(meshName: string): ProjectLinks | undefined {
  if (!meshName || meshName.endsWith('_Structure')) return undefined;
  const projectId = BILLBOARD_MESH_TO_PROJECT_ID[meshName];
  if (!projectId) return undefined;
  return getProjectLinkConfig(projectId);
}
