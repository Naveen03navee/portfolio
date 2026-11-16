/**
 * @file clients/portfolio/src/canvas/BillboardTextures.ts
 * @description Dynamic high-resolution canvas texture generator for in-world 3D digital billboards.
 * Implements Stage G.10 chase-camera legibility hierarchy across all locations:
 * 64-76px primary headings, 40-46px secondary headings, 32-38px descriptions, 26-30px tags,
 * capped tag density (2-3 tags), generous padding, wrapped lines without compression, and mipmap anisotropy.
 */

import * as THREE from 'three';

export type BillboardMotif =
  | 'reactor'
  | 'biometric'
  | 'qr'
  | 'rag'
  | 'campus'
  | 'executive';

export interface BillboardTextConfig {
  readonly category: string;
  readonly headline: string;
  readonly subheadline: string;
  readonly description?: string;
  readonly tags: readonly string[];
  readonly accentColor?: string;
  readonly motif?: BillboardMotif;
}

export const BILLBOARD_CONFIGS: Record<string, BillboardTextConfig> = {
  Display_Gateway_Welcome: {
    category: 'IDENTITY · NAVEEN B',
    headline: 'NAVEEN B',
    subheadline: 'Full-Stack AI Engineer & Systems Developer',
    description: 'Autonomous LLM pipelines, containerized microservices, and real-time 3D web architecture.',
    tags: ['Bengaluru, India', 'AI & RAG Systems', 'Production WebGL'],
    accentColor: '#00f0ff',
  },
  Display_About_Naveen: {
    category: '02 · ABOUT NAVEEN B',
    headline: 'SYSTEMS RELIABILITY',
    subheadline: 'Full-Stack AI Engineer & MCA Candidate',
    description: 'Grounded retrieval workflows, strict schema validation, and cloud microservices.',
    tags: ['Grounded RAG', 'Microservices', 'AWS & Docker'],
    accentColor: '#38bdf8',
  },
  Display_Innovation_Boulevard_OLED: {
    category: 'INNOVATION BOULEVARD',
    headline: 'AI SYSTEMS ARCHITECT',
    subheadline: 'Autonomous LLM & Full-Stack Pipelines',
    description: 'Engineering deterministic backend services paired with accessible interfaces.',
    tags: ['MCA 2024–2026', 'Zero-Trust Cloud', 'Full-Stack AI'],
    accentColor: '#00f0ff',
  },
  Display_Education_MCA: {
    category: 'EDUCATION · POSTGRADUATE',
    headline: 'MASTER OF COMPUTER APPLICATIONS',
    subheadline: 'M S Ramaiah College of Arts, Science and Commerce',
    description: '2024 – 2026 · Artificial intelligence pipelines and distributed systems architecture.',
    tags: ['2024 – 2026', 'Bengaluru, India', 'AI & Systems'],
    accentColor: '#f5a623',
  },
  Display_Education_BCA: {
    category: 'EDUCATION · UNDERGRADUATE',
    headline: 'BACHELOR OF COMPUTER APPLICATIONS',
    subheadline: 'Dayananda Sagar University',
    description: '2021 – 2024 · Software engineering fundamentals, databases, and full-stack development.',
    tags: ['2021 – 2024', 'Bengaluru, India', 'CS Foundations'],
    accentColor: '#f5a623',
  },
  Display_Tech_AI_LLM: {
    category: 'TECHNOLOGY MATRIX 01',
    headline: 'AI & LLM ENGINEERING',
    subheadline: 'Grounded Agents & Retrieval Pipelines',
    description: 'Semantic vector indexing, tool calling, and structured JSON output enforcement.',
    tags: ['LangChain', 'RAG Pipelines', 'Gemini & OpenAI'],
    accentColor: '#00f0ff',
  },
  Display_Tech_Backend: {
    category: 'TECHNOLOGY MATRIX 02',
    headline: 'BACKEND DEVELOPMENT',
    subheadline: 'Async Microservices & Validation APIs',
    description: 'High-concurrency Python and Node.js services with deterministic schema checks.',
    tags: ['FastAPI', 'Node.js & Express', 'Pydantic'],
    accentColor: '#38bdf8',
  },
  Display_Tech_Frontend: {
    category: 'TECHNOLOGY MATRIX 03',
    headline: 'FRONTEND DEVELOPMENT',
    subheadline: 'Accessible Web & 3D Interfaces',
    description: 'Responsive React and TypeScript applications built for WCAG 2.1 AA usability.',
    tags: ['React & TypeScript', 'Three.js', 'Tailwind CSS'],
    accentColor: '#10b981',
  },
  Display_Tech_Database: {
    category: 'TECHNOLOGY MATRIX 04',
    headline: 'DATABASES & VECTOR STORES',
    subheadline: 'Relational Data & Semantic Search',
    description: 'Transactional storage combined with dense embedding indexes for retrieval.',
    tags: ['MongoDB & MySQL', 'ChromaDB', 'FAISS Index'],
    accentColor: '#f5a623',
  },
  Display_Tech_Cloud: {
    category: 'TECHNOLOGY MATRIX 05',
    headline: 'CLOUD & DEVOPS',
    subheadline: 'Container Isolation & Secure Ingress',
    description: 'Reproducible multi-stage containers hosted on AWS EC2 behind Cloudflare Tunnels.',
    tags: ['Docker Compose', 'AWS EC2 & S3', 'Cloudflare Tunnels'],
    accentColor: '#38bdf8',
  },
  Display_Tech_Automation: {
    category: 'TECHNOLOGY MATRIX 06',
    headline: 'AUTOMATION & TOOLING',
    subheadline: 'Verified Delivery & CI Discipline',
    description: 'Automated testing, shell tooling, and structured software architecture workflows.',
    tags: ['Git & GitHub', 'Vitest', 'Linux Admin'],
    accentColor: '#00f0ff',
  },
  Display_Project_Jarvis: {
    category: 'PROJECT 01 · AI COMMAND CENTRE',
    headline: 'J.A.R.V.I.S.',
    subheadline: 'Private Desktop Conversational AI Assistant',
    description: 'Local AI Routing · Voice Interaction · Persistent Memory',
    tags: ['Tauri & React', 'Ollama LLM', 'Click Board ↗'],
    motif: 'reactor',
    accentColor: '#00f0ff',
  },
  Display_Project_Biometric: {
    category: 'PROJECT 02 · BIOMETRIC EXPERIENCE PORTAL',
    headline: 'BIOMETRIC EVENT GALLERY',
    subheadline: 'Edge Computer Vision & Event Technology',
    description: 'Visual Recognition · Event Gallery · Edge Processing',
    tags: ['WebAssembly', 'Face-API.js', 'Click Board ↗'],
    motif: 'biometric',
    accentColor: '#d946ef',
  },
  Display_Project_SmartQR: {
    category: 'PROJECT 03 · IDENTITY & SPATIAL SECURITY GATE',
    headline: 'SMART QR ATTENDANCE',
    subheadline: 'QR-Based Attendance & Geo-Fenced Verification',
    description: 'Identity · Location Validation · Attendance Automation',
    tags: ['Node.js & Express', 'Haversine GPS', 'Click Board ↗'],
    motif: 'qr',
    accentColor: '#10b981',
  },
  Display_Project_DocIntel: {
    category: 'PROJECT 04 · DOCUMENT INTELLIGENCE ARCHIVE',
    headline: 'MULTI-ENGINE DOCUMENT INTELLIGENCE',
    subheadline: 'Document Processing & Grounded AI',
    description: 'Document Extraction · Retrieval · Structured Answers',
    tags: ['FastAPI & React', 'ChromaDB', 'Click Board ↗'],
    motif: 'rag',
    accentColor: '#f5a623',
  },
  Display_Project_PDFChatter: {
    category: 'PROJECT 01 · VOICE-FIRST AI ASSISTANT',
    headline: 'J.A.R.V.I.S. ASSISTANT',
    subheadline: 'Real-Time Desktop Voice & Local LLM',
    description: 'Full-duplex WebSocket voice pipeline with Silero VAD and quantized Ollama routing.',
    tags: ['Tauri & React', 'Ollama LLM', 'ChromaDB'],
    motif: 'reactor',
    accentColor: '#00f0ff',
  },
  Display_Project_Recipe: {
    category: 'PROJECT 04 · APPLIED GENAI',
    headline: 'MULTI-ENGINE DOC INTEL',
    subheadline: 'Grounded Multi-Document Q&A Engine',
    description: 'Semantic PDF chunking and local embeddings delivering source-cited answers.',
    tags: ['FastAPI & React', 'LangChain', 'ChromaDB'],
    motif: 'rag',
    accentColor: '#f5a623',
  },
  Display_Decembay_Timeline: {
    category: 'EXPERIENCE · 3-MONTH INTERNSHIP',
    headline: 'DECEMBAY TECHNOLOGIES',
    subheadline: 'AI + Full-Stack Developer Intern',
    description: 'Structured RAG APIs · React Modules · AWS EC2 & Docker',
    tags: ['Python & React', 'RAG Validation', 'Docker & AWS EC2'],
    motif: 'campus',
    accentColor: '#2dd4bf',
  },
  Display_Skyline_Final: {
    category: 'SKYLINE SUMMIT · COLLABORATE',
    headline: "LET'S BUILD INTELLIGENT SYSTEMS",
    subheadline: 'Naveen B · Full-Stack AI Engineer',
    description: 'Open to engineering roles in Bengaluru and remote teams. Click Resume or Recruiter View.',
    tags: ['naveenb.bnbn@gmail.com', 'github.com/Naveen03navee', 'Bengaluru'],
    motif: 'executive',
    accentColor: '#f5a623',
  },
};

export interface DroneBannerConfig {
  readonly badge: string;
  readonly headline: string;
  readonly subheadline: string;
  readonly accentColor: string;
}

export const DRONE_BANNER_STAGES: readonly DroneBannerConfig[] = [
  {
    badge: 'NAVEEN B',
    headline: 'AI SYSTEMS ENGINEER',
    subheadline: 'BENGALURU · INDIA',
    accentColor: '#00f0ff',
  },
];

function drawWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): number {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  lines.forEach((line, idx) => {
    ctx.fillText(line, x, startY + idx * lineHeight);
  });

  return startY + lines.length * lineHeight;
}

function configureTextureFiltering(
  texture: THREE.CanvasTexture,
  maxAnisotropy: number
): THREE.CanvasTexture {
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(8, Math.max(1, maxAnisotropy));
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, -1);
  texture.offset.set(0, 1);
  texture.needsUpdate = true;
  return texture;
}

export function createDroneBannerTexture(
  config: DroneBannerConfig,
  maxAnisotropy = 4
): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#070b15');
  grad.addColorStop(1, '#0e172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const accent = config.accentColor;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 18;
  ctx.strokeRect(16, 16, width - 32, height - 32);

  // Subtle top attachment brackets visual cues on banner header
  ctx.fillStyle = accent;
  ctx.fillRect(140, 16, 44, 18);
  ctx.fillRect(width - 184, 16, 44, 18);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 118px "Manrope", "Inter", sans-serif';
  ctx.fillText(config.badge.toUpperCase(), width / 2, 174, width - 92);

  ctx.fillStyle = accent;
  ctx.font = '800 66px "Inter", sans-serif';
  ctx.fillText(config.headline, width / 2, 294, width - 92);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = '700 50px "JetBrains Mono", monospace';
  ctx.fillText(config.subheadline, width / 2, 404, width - 92);
  ctx.textAlign = 'left';

  return configureTextureFiltering(new THREE.CanvasTexture(canvas), maxAnisotropy);
}

export function createBillboardCanvasTexture(
  config: BillboardTextConfig,
  maxAnisotropy = 4
): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const accent = config.accentColor ?? '#00f0ff';
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#080e1d');
  grad.addColorStop(1, '#040711');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width - 260, 290, 20, width - 260, 290, 560);
  glow.addColorStop(0, `${accent}26`);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Subtle architectural grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1.5;
  for (let gx = 128; gx < width; gx += 128) {
    ctx.beginPath();
    ctx.moveTo(gx, 32);
    ctx.lineTo(gx, height - 32);
    ctx.stroke();
  }
  for (let gy = 128; gy < height; gy += 128) {
    ctx.beginPath();
    ctx.moveTo(32, gy);
    ctx.lineTo(width - 32, gy);
    ctx.stroke();
  }

  // Right-hand subtle emblem motif (kept clear of left/center typography)
  if (config.motif) {
    ctx.save();
    const cx = width - 245;
    const cy = 430;
    ctx.strokeStyle = accent;
    ctx.fillStyle = accent;
    if (config.motif === 'reactor') {
      for (const r of [145, 108, 68, 32]) {
        ctx.globalAlpha = r === 68 ? 0.55 : 0.28;
        ctx.lineWidth = r === 108 ? 8 : 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (config.motif === 'biometric') {
      ctx.globalAlpha = 0.38;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, 128, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.8;
      const pts: Array<[number, number]> = [
        [0, -86],
        [-72, -18],
        [72, -18],
        [-45, 52],
        [45, 52],
        [0, 90],
      ];
      for (const pt of pts) {
        ctx.beginPath();
        ctx.arc(cx + pt[0], cy + pt[1], 8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (config.motif === 'qr') {
      ctx.globalAlpha = 0.45;
      const cell = 30;
      const ox = cx - 3.5 * cell;
      const oy = cy - 3.5 * cell;
      const pattern = [
        [1, 1, 1, 0, 1, 1, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 1, 1, 0, 1, 1, 1],
        [0, 1, 0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 0],
        [1, 1, 1, 0, 1, 0, 1],
      ];
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (pattern[r][c]) {
            ctx.fillRect(ox + c * cell, oy + r * cell, cell - 4, cell - 4);
          }
        }
      }
    } else if (config.motif === 'rag') {
      ctx.globalAlpha = 0.42;
      ctx.lineWidth = 4;
      for (let layer = 0; layer < 4; layer++) {
        const yOff = cy - 108 + layer * 64;
        ctx.beginPath();
        ctx.roundRect(cx - 120 + layer * 10, yOff, 240 - layer * 20, 42, 10);
        ctx.stroke();
      }
    } else if (config.motif === 'campus') {
      ctx.globalAlpha = 0.42;
      ctx.lineWidth = 4;
      for (let col = -1; col <= 1; col++) {
        const h = col === 0 ? 185 : 130;
        ctx.strokeRect(cx + col * 82 - 26, cy + 92 - h, 52, h);
      }
    } else {
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 5;
      for (const s of [125, 78]) {
        ctx.beginPath();
        ctx.moveTo(cx, cy - s);
        ctx.lineTo(cx + s, cy);
        ctx.lineTo(cx, cy + s);
        ctx.lineTo(cx - s, cy);
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Clean outer border with subtle corner ticks
  ctx.strokeStyle = accent;
  ctx.lineWidth = 10;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  const padX = 84;
  const textMaxWidth = config.motif ? width - 470 : width - padX * 2;

  // 1. Category / Supporting Eyebrow (68px bold -> ~22-26px on 1080p exhibition screen)
  ctx.font = '700 68px "JetBrains Mono", monospace';
  ctx.fillStyle = accent;
  ctx.fillText(config.category.toUpperCase(), padX, 132, width - padX * 2);

  // Subtle horizontal divider below category
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(padX, 164);
  ctx.lineTo(width - padX, 164);
  ctx.stroke();

  // 2. Main Heading (114px Manrope, auto-scales smoothly to 92px on long multi-word titles like Doc Intel)
  const headlineSize = config.headline.length > 25 ? 92 : 114;
  ctx.font = `800 ${headlineSize}px "Manrope", "Inter", sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  const afterHeadlineY = drawWrappedLines(
    ctx,
    config.headline,
    padX,
    278,
    textMaxWidth,
    headlineSize + 8,
    2
  );

  // 3. Secondary Heading (60px Inter semibold)
  ctx.font = '600 60px "Inter", sans-serif';
  ctx.fillStyle = '#F1F5F9';
  const afterSubY = drawWrappedLines(
    ctx,
    config.subheadline,
    padX,
    afterHeadlineY + 12,
    textMaxWidth,
    72,
    2
  );

  // 4. Readable Description (58px Inter regular -> ~18-22px on 1080p exhibition screen)
  if (config.description) {
    ctx.font = '400 58px "Inter", sans-serif';
    ctx.fillStyle = '#CBD5E1';
    drawWrappedLines(
      ctx,
      config.description,
      padX,
      afterSubY + 12,
      textMaxWidth,
      66,
      2
    );
  }

  // 5. Focused Technology / Metadata Tags (52px bold monospace -> ~16-18px, max 3 tags)
  const cappedTags = config.tags.slice(0, 3);
  let startX = padX;
  const pillY = height - 154;
  const pillHeight = 98;
  ctx.font = '600 52px "JetBrains Mono", monospace';

  for (const tag of cappedTags) {
    const textMetrics = ctx.measureText(tag);
    const pillWidth = textMetrics.width + 64;

    if (startX + pillWidth > width - padX) {
      break;
    }

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.beginPath();
    ctx.roundRect(startX, pillY, pillWidth, pillHeight, 14);
    ctx.fill();

    ctx.strokeStyle = `${accent}70`;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(tag, startX + 32, pillY + 62);

    startX += pillWidth + 24;
  }

  return configureTextureFiltering(new THREE.CanvasTexture(canvas), maxAnisotropy);
}
