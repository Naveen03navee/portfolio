# Naveen B — Full-Stack AI Engineer Portfolio

[![Production Website](https://img.shields.io/badge/Production%20Website-portfolio--8ac.pages.dev-00F0FF?style=flat&logo=cloudflarepages)](https://portfolio-8ac.pages.dev/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r187-black?logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Live Production URL:** [https://portfolio-8ac.pages.dev/](https://portfolio-8ac.pages.dev/)

A software engineering portfolio featuring an interactive **3D WebGL Simulation**, a **2D Technical Portfolio**, and an executive **Recruiter Quick View** dossier with PDF export and live microservice health telemetry.

---

## 1. Architecture & Source Structure

The application enforces separation of concerns across presentation, state, simulation, and data access layers:

```
portfolio/
├── public/                       # Static public assets
│   ├── assets/
│   │   ├── models/               # DRACO-compressed 3D models
│   │   │   ├── city_world.glb    # Urban boulevard 3D mesh
│   │   │   ├── sports_car.glb    # Sports vehicle 3D model
│   │   │   └── drone_with_banner.glb # Companion quadcopter 3D model
│   │   └── previews/             # Project interface preview images
│   ├── draco/                    # WebAssembly DRACO decoders
│   ├── 404.html                  # Single-Page Application (SPA) fallback
│   └── Naveen_B_Resume.pdf       # Candidate resume PDF
├── src/
│   ├── canvas/                   # Three.js 3D WebGL rendering pipeline
│   │   ├── CinematicScene.tsx    # Scene graph, animation loop, and camera tracking
│   │   ├── KineticExhibitions.ts # Procedural kinetic project pods
│   │   ├── BillboardTextures.ts  # Canvas-based procedural billboard textures
│   │   └── CityProceduralTextures.ts # Procedural shaders and materials
│   ├── components/
│   │   ├── sections/             # 2D Editorial mode sections
│   │   └── ui/                   # UI components (Navbar, HUD, RecruiterQuickView, Modals)
│   ├── engine/                   # Motion Mathematics & Capability Probing
│   │   ├── SplineTrajectoryAdapter.ts # Bishop Parallel Transport Frame algorithm
│   │   └── webglCapabilities.ts  # WebGL hardware feature detection
│   ├── data/                     # Single source of truth for candidate data
│   │   ├── portfolioData.ts      # Resume data, education, and internship details
│   │   ├── project-links.ts      # Live microservice endpoints and metadata
│   │   └── splineRoute.ts        # 3D spline curve control points
│   ├── hooks/                    # Custom React hooks
│   └── services/                 # Live microservice synthetic health checkers
├── index.html                    # Entry HTML
├── vite.config.ts                # Vite bundler configuration
├── tailwind.config.js            # Design tokens and styling rules
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 2. 3D WebGL Simulation & Mathematics

### Bishop Parallel Transport Frames (PTF)
Trajectory orientation along the 1,119m Catmull-Rom spline uses **Bishop Parallel Transport Frames** in [`SplineTrajectoryAdapter.ts`](src/engine/SplineTrajectoryAdapter.ts) to eliminate gimbal lock:
- Tangent vectors $T(u)$ are evaluated continuously.
- Normal ($R$) and Binormal ($U$) coordinate frames propagate via minimal-rotation quaternions:
  $$\Delta q = \text{Rot}\left(\frac{T_A \times T_B}{\|T_A \times T_B\|}, \arccos(T_A \cdot T_B)\right)$$
- Curvature $\kappa(u)$ drives dynamic body roll and vehicle banking into turns.

### Kinetic Architectural Pods
Projects deploy dynamically along the spline as the camera approaches:
1. **Pod 01 — Conversational Voice AI Assistant:** Desktop voice AI system with dual rotating core rings and 9-bar audio waveform visualizer.
2. **Pod 02 — Biometric Event Gallery:** Edge computer vision portal with layered image tiles and scanning beam.
3. **Pod 03 — Smart QR Attendance:** Spatial verification gate with counter-rotating geofence rings and 3D voxel QR matrix.
4. **Pod 04 — Multi-Engine Document Intelligence:** Document intelligence archive with glowing document slabs and data conduits.
5. **Decembay Technologies Pavilion:** Free-standing corporate pavilion with twin rear structural buttresses.

---

## 3. Signature Projects

The portfolio showcases four engineering projects with integrated CORS health checks:

| Project | Live Demo | Repository | Architecture |
| :--- | :--- | :--- | :--- |
| **Conversational Voice AI Assistant** | [Live App](https://j-a-r-v-i-s-3c3.pages.dev/) | [GitHub](https://github.com/Naveenbnnavee/J.A.R.V.I.S) | Voice-first desktop assistant with 16kHz PCM audio, Silero VAD, local Ollama routing, ChromaDB semantic memory, and WebGL shader visualizer. |
| **Biometric Event Gallery** | [Live App](https://biometric-event-gallery.pages.dev/) | [GitHub](https://github.com/Naveenbnnavee/biometric-event-gallery) | Edge computer vision platform computing 128-dimensional facial embeddings client-side via WebAssembly for cosine similarity vector search. |
| **Smart QR Attendance** | [Live App](https://smart-qr-attendance-f0xh.onrender.com/) | [GitHub](https://github.com/Naveenbnnavee/smart-qr-attendance) | Attendance verification system with cryptographically signed rolling QR codes and Haversine geofencing. |
| **Multi-Engine Document Intelligence** | [Live App](https://multi-engine-doc-intel.onrender.com/) | [GitHub](https://github.com/Naveenbnnavee/multi-engine-doc-intel) | Containerized document intelligence microservice comparing OCR extraction models and LLM summarization. |

---

## 4. Getting Started

### Prerequisites
- **Node.js:** `>= 20.0.0`
- **Package Manager:** `pnpm` (recommended), `npm`, or `yarn`

### Installation
```bash
git clone https://github.com/Naveen03navee/portfolio.git
cd portfolio
pnpm install
```

### Development
```bash
pnpm dev
```
Open `http://127.0.0.1:5173/` in your browser.

### Quality Verification
```bash
pnpm typecheck
pnpm test
```

### Production Build
```bash
pnpm build
pnpm preview
```

---

## 5. Deployment

Deploy the `dist/` directory to Cloudflare Pages:

```bash
npx wrangler pages deploy dist --project-name portfolio --branch main
```

---

## 6. License

Distributed under the MIT License.

**Author:** Naveen B  
**Contact:** [naveenb.bnbn@gmail.com](mailto:naveenb.bnbn@gmail.com)  
**Portfolio:** [https://portfolio-8ac.pages.dev/](https://portfolio-8ac.pages.dev/)
