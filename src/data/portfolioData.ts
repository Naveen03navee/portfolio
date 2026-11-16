/**
 * @file clients/portfolio/src/data/portfolioData.ts
 * @description Authoritative factual portfolio data for Naveen B.
 * Strictly verified against Naveen_B_Resume.pdf and actual repository implementations.
 * Zero fabricated stats or percentages.
 */

import type {
  WorldLocationMeta,
  EducationEntry,
  ExperienceEntry,
  TechCategory,
  ProjectShowcase,
} from '../types/portfolio.types.js';
import {
  GITHUB_PROFILE_URL,
  getProjectLinkConfig,
  type ProjectLinks,
} from './project-links.js';

export const WORLD_LOCATIONS: readonly WorldLocationMeta[] = [
  {
    id: 'gateway',
    index: 1,
    name: 'The Grand City Gateway',
    subtitle: 'Executive Arrival & Identity',
    progressRange: [0.0, 0.14],
    focusHeadline: 'NAVEEN B — FULL-STACK AI ENGINEER',
  },
  {
    id: 'innovation',
    index: 2,
    name: 'The Innovation Boulevard',
    subtitle: 'Academic Foundations & Background',
    progressRange: [0.15, 0.28],
    focusHeadline: 'EDUCATION & PROFESSIONAL ARCHITECTURE',
  },
  {
    id: 'technology',
    index: 3,
    name: 'The Technology District',
    subtitle: 'Technical Competency & Taxonomy',
    progressRange: [0.29, 0.43],
    focusHeadline: '6-TIER PRODUCTION SYSTEM ARCHITECTURE',
  },
  {
    id: 'projects',
    index: 4,
    name: 'The Project Exhibition District',
    subtitle: 'Verified Engineering Systems',
    progressRange: [0.44, 0.71],
    focusHeadline: 'PRODUCTION & OPEN-SOURCE DELIVERABLES',
  },
  {
    id: 'campus',
    index: 5,
    name: 'The Engineering Campus',
    subtitle: 'Industry Experience & Cloud Deployment',
    progressRange: [0.72, 0.84],
    focusHeadline: 'DECEMBAY TECHNOLOGIES INTERNSHIP',
  },
  {
    id: 'skyline',
    index: 6,
    name: 'The Skyline Destination',
    subtitle: 'Executive Summit & Collaboration',
    progressRange: [0.85, 1.00],
    focusHeadline: "LET'S BUILD SOMETHING INTELLIGENT.",
  },
];

export const PROFILE_INFO = {
  name: 'Naveen B',
  roleTitle: 'Full-Stack AI Engineer | AI Automation & Systems Developer',
  location: 'Bengaluru, India',
  email: 'naveenb.bnbn@gmail.com',
  githubUrl: GITHUB_PROFILE_URL,
  githubHandle: 'Naveen03navee',
  resumePdfPath: '/Naveen_B_Resume.pdf',
  summary:
    'Proactive Full-Stack AI Engineer and MCA candidate specializing in engineering autonomous LLM pipelines, containerized microservices, and high-performance web applications. Experienced in developing grounded Retrieval-Augmented Generation (RAG) systems, implementing deterministic validation gates, and orchestrating cloud deployments with Docker and AWS. Dedicated to shipping secure, production-grade agentic workflows that resolve real-world software bottlenecks.',
} as const;

export const EDUCATION_DATA: readonly EducationEntry[] = [
  {
    degree: 'Master of Computer Applications (MCA)',
    period: '2024 – 2026',
    institution: 'M S Ramaiah College of Arts, Science and Commerce',
    location: 'Bengaluru, India',
    focus: 'Advanced computing, artificial intelligence pipelines, systems architecture, and distributed services.',
    isVerified: true,
  },
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    period: '2021 – 2024',
    institution: 'Dayananda Sagar University',
    location: 'Bengaluru, India',
    focus: 'Computer science fundamentals, software engineering methodologies, database systems, and full-stack development.',
    isVerified: true,
  },
];

export const EXPERIENCE_DATA: readonly ExperienceEntry[] = [
  {
    role: 'AI + Full Stack Developer Intern',
    company: 'Decembay Technologies',
    location: 'Bengaluru, India',
    period: '3 Months (Completed)',
    isCompleted: true,
    description: [
      'Architected and delivered generative AI integrations and full-stack modules across client web applications, connecting modern React frontends to robust Node.js and Python microservices.',
      'Engineered automated RAG workflows and structured prompt pipelines with strict JSON schema validation, eliminating conversational hallucination and streamlining document analysis.',
      'Containerized internal multi-tier services using Docker and established remote deployments on AWS EC2 via Cloudflare Tunnels, ensuring environment consistency and zero downtime.',
    ],
    technologies: [
      'Python',
      'FastAPI',
      'React',
      'Node.js',
      'RAG Pipelines',
      'JSON Schema Validation',
      'Docker',
      'AWS EC2',
      'Cloudflare Tunnels',
    ],
  },
];

export const TECHNICAL_CATEGORIES: readonly TechCategory[] = [
  {
    domain: 'AI & LLM Engineering',
    description: 'Autonomous agents, grounded retrieval pipelines, schema enforcement, and model routing.',
    skills: [
      'RAG Architectures',
      'Vector Embeddings',
      'LangChain',
      'Prompt Engineering',
      'OpenAI API',
      'Claude API',
      'Google GenAI / Gemini',
      'Tool Calling',
      'Structured Outputs',
    ],
  },
  {
    domain: 'Backend Development',
    description: 'High-concurrency async services, RESTful APIs, and deterministic validation microservices.',
    skills: [
      'Python',
      'FastAPI',
      'Pydantic',
      'Node.js',
      'Express.js',
      'RESTful APIs',
      'Async Event Loops',
      'WebSockets',
    ],
  },
  {
    domain: 'Frontend Development',
    description: 'Responsive, accessible, production-grade web interfaces and 3D graphics presentation.',
    skills: [
      'React',
      'TypeScript',
      'JavaScript (ES6+)',
      'Three.js',
      'Tailwind CSS',
      'HTML5 Semantic Canvas',
      'Vite',
      'WCAG 2.1 AA Accessibility',
    ],
  },
  {
    domain: 'Databases & Vector Stores',
    description: 'Relational storage, document stores, and high-dimensional semantic search indexes.',
    skills: [
      'MongoDB',
      'MySQL',
      'ChromaDB',
      'Supabase',
      'FAISS Vector Store',
      'ACID Transactions',
    ],
  },
  {
    domain: 'Cloud & DevOps',
    description: 'Multi-stage containerization, cloud hosting, secure ingress tunnels, and orchestration.',
    skills: [
      'Docker',
      'Docker Compose',
      'Docker Hub',
      'AWS EC2',
      'AWS S3',
      'AWS IAM',
      'Cloudflare Tunnels',
      'Zero Trust Networking',
    ],
  },
  {
    domain: 'Automation & Infrastructure',
    description: 'Version control, developer tooling, reproducible environments, and CI verification.',
    skills: [
      'Git',
      'GitHub',
      'Bash / Shell Scripting',
      'Linux Server Administration',
      'Vitest / Unit Testing',
      'Creative Web Engine (CWE)',
    ],
  },
];

function buildProjectShowcase(
  id: string,
  meta: Omit<
    ProjectShowcase,
    | 'id'
    | 'projectNumber'
    | 'title'
    | 'displayTitle'
    | 'accentTheme'
    | 'githubUrl'
    | 'gitCloneUrl'
    | 'liveUrl'
    | 'screenshotPath'
    | 'previewAlt'
  > & { readonly displayTitle: string }
): ProjectShowcase {
  const link: ProjectLinks | undefined = getProjectLinkConfig(id);
  if (!link) {
    throw new Error(`Missing authoritative projectLinks configuration for id="${id}"`);
  }
  return {
    id: link.id,
    projectNumber: link.projectNumber,
    title: link.title,
    displayTitle: meta.displayTitle,
    tag: meta.tag,
    period: meta.period,
    status: meta.status,
    accentTheme: link.accentTheme,
    shortDescription: meta.shortDescription,
    technicalContribution: meta.technicalContribution,
    architectureOverview: meta.architectureOverview,
    architectureStages: meta.architectureStages,
    technologies: meta.technologies,
    keyHighlights: meta.keyHighlights,
    githubUrl: link.githubUrl,
    gitCloneUrl: link.gitCloneUrl,
    liveUrl: link.liveUrl,
    screenshotPath: link.previewImage,
    previewAlt: link.previewAlt,
    galleryImages: meta.galleryImages,
  };
}

export const PROJECTS_DATA: readonly ProjectShowcase[] = [
  buildProjectShowcase('jarvis', {
    displayTitle: 'J.A.R.V.I.S. – Real-Time Conversational AI Assistant',
    tag: 'Voice-First AI Assistant',
    period: 'In Active Development',
    status: 'Active Development',
    shortDescription:
      'Desktop conversational AI orchestrating full-duplex WebSocket audio pipelines and localized quantized model routing.',
    technicalContribution:
      'Developing a private desktop voice assistant using Tauri and React. Features local Ollama routing for confidential desktop actions, Silero Voice Activity Detection (VAD), ChromaDB persistent memory, and a synchronized WebGL Arc-Reactor visualizer shader loop.',
    architectureOverview:
      'Microphone Input ➔ Silero VAD (16kHz PCM) ➔ Streaming STT ➔ Dynamic Intent Router (Local Ollama / Cloud Fallback) ➔ ChromaDB Semantic Memory ➔ Streaming TTS ➔ Audio Output & WebGL Visualizer.',
    architectureStages: [
      { label: 'Voice Capture', detail: '16kHz PCM + Silero VAD' },
      { label: 'Intent Router', detail: 'Ollama / Cloud Failover' },
      { label: 'Memory Core', detail: 'ChromaDB Vector Store' },
      { label: 'UI & Audio', detail: 'Streaming TTS + WebGL Core' },
    ],
    technologies: ['Tauri', 'React', 'Node.js', 'WebSockets', 'Silero VAD', 'Ollama', 'ChromaDB', 'WebGL'],
    keyHighlights: [
      'Full-duplex voice pipeline combining Silero VAD, streaming speech synthesis, and WebSocket transport.',
      'Local LLM execution via quantized Ollama for private on-device desktop workflows.',
      'WebGL Arc-Reactor shader visualizer synchronized with live voice activity.',
    ],
    galleryImages: [
      {
        src: '/assets/previews/project-jarvis.png',
        alt: 'J.A.R.V.I.S. live showcase interface displaying the cyan voice core visualizer and local runtime specifications',
        caption: 'Live Showcase Interface',
      },
      {
        src: '/assets/screenshots/jarvis_visualizer_idle.png',
        alt: 'J.A.R.V.I.S. desktop Arc-Reactor visualizer overlay in standby state with local system health indicators',
        caption: 'Desktop Visualizer Overlay',
      },
      {
        src: '/assets/screenshots/jarvis_streaming_voice.png',
        alt: 'J.A.R.V.I.S. silent mode text and streaming conversational workspace console',
        caption: 'Conversational Console',
      },
      {
        src: '/assets/screenshots/jarvis_intent_routing.png',
        alt: 'J.A.R.V.I.S. multi-stage routing pipeline drawer showing local and cloud model controls',
        caption: 'Intent Routing Drawer',
      },
    ],
  }),
  buildProjectShowcase('biometric-event-gallery', {
    displayTitle: 'Biometric Event Gallery Platform',
    tag: 'Edge Computer Vision and Event Technology',
    period: 'Jan 2026',
    status: 'Completed',
    shortDescription:
      'Live event photography platform featuring client-side 128D facial descriptor extraction and zero-server biometric compute.',
    technicalContribution:
      'Engineered a privacy-first biometric event gallery where facial landmark detection and 128-dimensional embedding vectors are computed client-side using WebAssembly and Face-API, achieving zero-server biometric compute and local vector matching.',
    architectureOverview:
      'Event Photographer Upload ➔ WebAssembly Landmark Extraction ➔ 128D Client Descriptor Vector ➔ Local Cosine Similarity Matching ➔ Cloudflare Pages Edge CDN Delivery.',
    architectureStages: [
      { label: 'Media Ingest', detail: 'Photographer Gallery Upload' },
      { label: 'WASM Inference', detail: 'Browser Landmark Detection' },
      { label: '128D Matching', detail: 'Local Cosine Similarity' },
      { label: 'Edge Delivery', detail: 'Cloudflare Pages CDN' },
    ],
    technologies: ['WebAssembly', 'Face-API.js', 'Cloudflare Pages', 'Vector Embeddings', 'Tailwind CSS', 'TypeScript'],
    keyHighlights: [
      '128D client-side facial descriptor extraction executed directly in the browser via WebAssembly.',
      'Zero-server biometric storage and processing keeping face embeddings on the client.',
      'Local vector cosine similarity matching across event photo collections.',
    ],
  }),
  buildProjectShowcase('smart-qr-attendance', {
    displayTitle: 'Smart QR & Geo-Fenced Attendance Platform',
    tag: 'Identity Validation and Spatial Security',
    period: 'Jan 2026 – Mar 2026',
    status: 'Completed',
    shortDescription:
      'Location-aware attendance validation system combining rotating cryptographic QR tokens with spatial geofencing.',
    technicalContribution:
      'Engineered a verification engine utilizing dynamic nonces with 5-second TTL expiration, combined with HTML5 geolocation and 10-meter Haversine distance bounding to prevent proxy check-ins.',
    architectureOverview:
      'Client Browser (HTML5 Geolocation + Device Signature) ➔ Express.js Verification Pipeline ➔ Haversine Distance Bounding (< 10m) ➔ Dynamic HMAC Nonce Expiration Gate ➔ Atomic MongoDB Attendance Ledger.',
    architectureStages: [
      { label: 'Client Scan', detail: 'Geolocation + Device Hash' },
      { label: 'Geo Validation', detail: '10m Haversine Bounding' },
      { label: 'Nonce Gate', detail: '5s Rotating HMAC Token' },
      { label: 'Audit Record', detail: 'Atomic MongoDB Write' },
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Haversine Formula', 'Canvas Fingerprint'],
    keyHighlights: [
      'Dynamic 5-second time-decay QR tokens preventing screenshot sharing and proxy check-ins.',
      '10-meter Haversine spatial radius validation restricting check-ins to physical premises.',
      'Device signature binding combining canvas and WebGL identifiers to deter multi-device spoofing.',
    ],
  }),
  buildProjectShowcase('multi-engine-doc-intel', {
    displayTitle: 'Multi-Engine Document Intelligence Platform',
    tag: 'Document AI and Applied GenAI',
    period: 'Jan 2026',
    status: 'Completed',
    shortDescription:
      'Document-intelligence application allowing users to query multiple PDFs via retrieval-augmented generation.',
    technicalContribution:
      'Engineered an end-to-end multi-document RAG pipeline using semantic chunking, local sentence-transformers embeddings, and ChromaDB vector indexing with verifiable source citations and multi-stage Docker packaging.',
    architectureOverview:
      'React Frontend (Vite) ➔ FastAPI REST API ➔ LangChain RAG Orchestrator ➔ ChromaDB Vector Index ➔ LLM Response Synthesis with grounded citations.',
    architectureStages: [
      { label: 'PDF Ingest', detail: 'React UI + FastAPI Parse' },
      { label: 'Embeddings', detail: 'Local Vector Chunking' },
      { label: 'Semantic Search', detail: 'ChromaDB Similarity Index' },
      { label: 'Grounded Reply', detail: 'LLM Cited Synthesis' },
    ],
    technologies: ['FastAPI', 'React', 'LangChain', 'ChromaDB', 'Docker Multi-Stage', 'Python', 'Gemini API'],
    keyHighlights: [
      'Local vector embedding generation reducing reliance on external embedding API quotas.',
      'Multi-PDF ingestion and synchronized retrieval with grounded page/source citations.',
      'Multi-stage Docker containerization keeping deployment builds consistent across environments.',
    ],
  }),
];

