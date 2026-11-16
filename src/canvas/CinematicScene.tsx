  /**
 * @file clients/portfolio/src/canvas/CinematicScene.tsx
 * @description Premium Three.js cinematic canvas with continuous spline trajectory navigation,
 * autonomous companion drone with suspended physical banner, and art-directed architectural cinematography.
 * Integrates @cwe/motion-engine's Bishop Parallel Transport Frames and DRACO compressed GLTF loading.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SplineTrajectoryAdapter } from '../engine/SplineTrajectoryAdapter.js';
import { createAuthoritativeRouteCurve } from '../data/splineRoute.js';
import {
  BILLBOARD_CONFIGS,
  createBillboardCanvasTexture,
  DRONE_BANNER_STAGES,
  createDroneBannerTexture,
} from './BillboardTextures.js';
import { applyCyberpunkCityTextures } from './CityProceduralTextures.js';
import { getProjectByBillboardMesh } from '../data/project-links.js';
import {
  EXHIBITION_SPECS,
  createKineticExhibitionSystem,
} from './KineticExhibitions.js';

// --- CINEMATIC ATTENTION CONTROLLER FOR STAGE G.11 ROUTE ---
interface AttentionTarget {
  readonly tStart: number;
  readonly tPeak: number;
  readonly tEnd: number;
  readonly gazePanX: number; // local X offset for lookAt (+ = pan right, - = pan left)
  readonly camShiftX: number; // local X camera position shift opposite to gaze
  readonly elevationShift: number; // local Y camera position shift
  readonly trailShift: number; // local Z camera trail adjustment
}

const ATTENTION_TARGETS: readonly AttentionTarget[] = [
  // 1. Gateway Welcome Arch (kept cleanly below sticky 70px header)
  { tStart: 0.042, tPeak: 0.086, tEnd: 0.120, gazePanX: 0.0, camShiftX: 0.0, elevationShift: 0.05, trailShift: 1.5 },
  // 2. About Naveen (Right)
  { tStart: 0.145, tPeak: 0.170, tEnd: 0.194, gazePanX: 2.0, camShiftX: -0.50, elevationShift: 0.15, trailShift: -0.2 },
  // 3. Innovation Blvd OLED (Right)
  { tStart: 0.180, tPeak: 0.200, tEnd: 0.223, gazePanX: 2.0, camShiftX: -0.55, elevationShift: 0.15, trailShift: -0.2 },
  // 4. Education MCA (Left - balanced pan/trail prevents left-edge crop at 0.228)
  { tStart: 0.212, tPeak: 0.228, tEnd: 0.248, gazePanX: -1.75, camShiftX: 0.45, elevationShift: 0.15, trailShift: 0.65 },
  // 5. Education BCA (Right)
  { tStart: 0.242, tPeak: 0.258, tEnd: 0.280, gazePanX: 1.85, camShiftX: -0.45, elevationShift: 0.15, trailShift: 0.4 },
  // 6. Tech AI/LLM (Left)
  { tStart: 0.278, tPeak: 0.296, tEnd: 0.316, gazePanX: -2.0, camShiftX: 0.50, elevationShift: 0.18, trailShift: -0.2 },
  // 7. Tech DB & 92m Tower (Right - generous right clearance keeps board inside 5% margin)
  { tStart: 0.340, tPeak: 0.368, tEnd: 0.398, gazePanX: 2.85, camShiftX: -0.60, elevationShift: 0.25, trailShift: 0.45 },
  // 8. Tech Automation (Right)
  { tStart: 0.402, tPeak: 0.425, tEnd: 0.442, gazePanX: 1.85, camShiftX: -0.45, elevationShift: 0.18, trailShift: -0.2 },
  // 9. Kinetic Project Pod 01: J.A.R.V.I.S. AI Command Centre (tPod=0.486, RIGHT -> tPeak=0.469)
  { tStart: 0.446, tPeak: 0.469, tEnd: 0.500, gazePanX: 4.35, camShiftX: -1.35, elevationShift: 0.35, trailShift: -1.25 },
  // 10. Kinetic Project Pod 02: Biometric Experience Portal (tPod=0.556, LEFT -> tPeak=0.539)
  { tStart: 0.514, tPeak: 0.539, tEnd: 0.570, gazePanX: -3.25, camShiftX: 1.15, elevationShift: 0.35, trailShift: -1.75 },
  // 11. Kinetic Project Pod 03: Smart QR Security Gate (tPod=0.625, RIGHT -> tPeak=0.608)
  { tStart: 0.583, tPeak: 0.608, tEnd: 0.639, gazePanX: 5.45, camShiftX: -1.55, elevationShift: 0.35, trailShift: -0.95 },
  // 12. Kinetic Project Pod 04: Multi-Engine Doc Intel Archive (tPod=0.692, LEFT -> tPeak=0.675)
  { tStart: 0.650, tPeak: 0.675, tEnd: 0.706, gazePanX: -3.15, camShiftX: 1.15, elevationShift: 0.35, trailShift: -1.95 },
  // 13. Standalone Decembay Corporate Pavilion (tPod=0.766, RIGHT -> tPeak=0.747; full board + buttresses inside 5% margin)
  { tStart: 0.718, tPeak: 0.747, tEnd: 0.788, gazePanX: 2.55, camShiftX: -0.95, elevationShift: 0.25, trailShift: 0.45 },
  // 14. Concours Executive Courtyard & Sky-Portal (Y=1025m parked -> Y=1062m Portal)
  { tStart: 0.875, tPeak: 0.919, tEnd: 1.550, gazePanX: 0.35, camShiftX: -1.70, elevationShift: 0.45, trailShift: 2.2 },
];

const VEHICLE_PARK_T = 0.919;

function getCameraRigTargetsForT(t: number): {
  trail: number;
  height: number;
  lookAhead: number;
  lateral: number;
  elevation: number;
} {
  if (t <= 0.14) {
    // Location 01: Grand Gateway - frame monumental portal arch below fixed navbar + visible companion drone
    return { trail: 8.6, height: 2.40, lookAhead: 28.0, lateral: 0.0, elevation: 1.05 };
  }
  if (t <= 0.28) {
    // Location 02: Innovation Blvd
    return { trail: 8.0, height: 2.35, lookAhead: 26.0, lateral: -0.25, elevation: 0.60 };
  }
  if (t <= 0.442) {
    // Location 03: Technology District
    return { trail: 8.0, height: 2.42, lookAhead: 27.0, lateral: 0.25, elevation: 0.85 };
  }
  if (t <= 0.712) {
    // Location 04: Kinetic Project Exhibition District
    return { trail: 8.0, height: 2.42, lookAhead: 23.5, lateral: 0.0, elevation: 0.72 };
  }
  if (t <= 0.825) {
    // Location 05: Engineering Campus - Decembay Corporate Pavilion
    return { trail: 8.2, height: 2.40, lookAhead: 24.5, lateral: 0.15, elevation: 0.68 };
  }
  // Location 06: Concours Arrival Courtyard
  return { trail: 9.0, height: 2.60, lookAhead: 25.0, lateral: 0.0, elevation: 1.35 };
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function calculateCinematicAttention(t: number): {
  gazePanX: number;
  camShiftX: number;
  elevationShift: number;
  trailShift: number;
} {
  let gazePanX = 0;
  let camShiftX = 0;
  let elevationShift = 0;
  let trailShift = 0;

  for (let i = 0; i < ATTENTION_TARGETS.length; i++) {
    const target = ATTENTION_TARGETS[i];
    if (t >= target.tStart && t <= target.tEnd) {
      const weight = t <= target.tPeak
        ? smoothstep(target.tStart, target.tPeak, t)
        : 1 - smoothstep(target.tPeak, target.tEnd, t);

      gazePanX += target.gazePanX * weight;
      camShiftX += target.camShiftX * weight;
      elevationShift += target.elevationShift * weight;
      trailShift += target.trailShift * weight;
    }
  }

  return { gazePanX, camShiftX, elevationShift, trailShift };
}

export interface CinematicSceneProps {
  readonly scrollProgress: number; // 0.0 to 1.0
  readonly isReducedMotion: boolean;
  readonly isPaused?: boolean;
  readonly onSceneReady?: () => void;
  readonly onWebGLFallback?: () => void;
  readonly onSelectProject?: (projectId: string, originElement?: HTMLElement | null) => void;
  readonly onHoverBillboard?: (projectId: string | null) => void;
}

export const CinematicScene: React.FC<CinematicSceneProps> = ({
  scrollProgress,
  isReducedMotion,
  isPaused = false,
  onSceneReady,
  onWebGLFallback,
  onSelectProject,
  onHoverBillboard,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Keep latest props in refs so modal pauses or callback updates never tear down the WebGL context
  const targetProgressRef = useRef<number>(scrollProgress);
  useEffect(() => {
    targetProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  const isPausedRef = useRef<boolean>(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const onSelectProjectRef = useRef(onSelectProject);
  useEffect(() => {
    onSelectProjectRef.current = onSelectProject;
  }, [onSelectProject]);

  const onHoverBillboardRef = useRef(onHoverBillboard);
  useEffect(() => {
    onHoverBillboardRef.current = onHoverBillboard;
  }, [onHoverBillboard]);

  const onWebGLFallbackRef = useRef(onWebGLFallback);
  useEffect(() => {
    onWebGLFallbackRef.current = onWebGLFallback;
  }, [onWebGLFallback]);

  const onSceneReadyRef = useRef(onSceneReady);
  useEffect(() => {
    onSceneReadyRef.current = onSceneReady;
  }, [onSceneReady]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;
    let animationFrameId = 0;

    // 1. Scene, Camera, Renderer (guarded with fallback to 2D Portfolio if WebGL fails)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8cbcdb); // Sunny, clear Cyberpunk 2077 light blue daytime sky
    scene.fog = new THREE.Fog(0x8cbcdb, 120, 650); // Soft atmospheric depth haze

    const getResponsiveFov = (width: number, height: number): number => {
      const aspect = width / Math.max(1, height);
      if (aspect < 0.85) return 54;
      if (aspect < 1.15) return 47;
      return 42;
    };

    const isCompactViewport = window.innerWidth < 768;
    const isLowConcurrency =
      typeof navigator !== 'undefined' &&
      typeof navigator.hardwareConcurrency === 'number' &&
      navigator.hardwareConcurrency <= 4;
    const isConstrainedDevice = isCompactViewport || isLowConcurrency;

    const camera = new THREE.PerspectiveCamera(
      getResponsiveFov(window.innerWidth, window.innerHeight),
      window.innerWidth / window.innerHeight,
      0.1,
      1400
    );

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isCompactViewport,
        alpha: false,
        powerPreference: isConstrainedDevice ? 'default' : 'high-performance',
        stencil: false,
      });
    } catch {
      onWebGLFallbackRef.current?.();
      return undefined;
    }

    const applyDevicePixelRatio = (): void => {
      const compactNow = window.innerWidth < 768 || isLowConcurrency;
      const cap = compactNow ? 1.25 : 1.75;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    };
    applyDevicePixelRatio();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.98;
    renderer.shadowMap.enabled = !isCompactViewport;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    renderer.domElement.tabIndex = -1;
    renderer.domElement.style.touchAction = 'pan-y';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event): void => {
      e.preventDefault();
      if (!isDisposed) {
        onWebGLFallbackRef.current?.();
      }
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    // 1b. PBR Environment Map for realistic metallic clearcoat reflections without washing out asphalt
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(envScene, 0.04).texture;
    scene.environmentIntensity = 0.55;
    pmremGenerator.dispose();

    // 2. Atmospheric Sky Dome & Ground Plane
    const generatedTextures: THREE.Texture[] = [];
    const droneBannerTextures: THREE.CanvasTexture[] = [];

    function createSkyCanvasTexture(): THREE.CanvasTexture {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      const grad = ctx.createLinearGradient(0, 0, 0, 1024);
      grad.addColorStop(0.0, '#123058'); // Deep azure zenith
      grad.addColorStop(0.35, '#2563eb'); // Clear Cyberpunk sky
      grad.addColorStop(0.65, '#60a5fa'); // Atmospheric cyan glow
      grad.addColorStop(0.85, '#93c5fd'); // Soft light blue daytime horizon
      grad.addColorStop(1.0, '#8cbcdb'); // Matching fog horizon
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 1024);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    }

    const skyGeo = new THREE.SphereGeometry(1200, 32, 16);
    const skyTex = createSkyCanvasTexture();
    generatedTextures.push(skyTex);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      fog: false,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    skyDome.position.set(0, 0, -540);
    scene.add(skyDome);

    // Ground foundation plane
    const groundGeo = new THREE.PlaneGeometry(2400, 2400);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x161c24,
      roughness: 0.88,
      metalness: 0.05,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(0, -0.05, -540);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // 2b. Lighting Rig - High-Contrast Cyberpunk 2077 Afternoon Automotive Art Direction
    const ambientLight = new THREE.AmbientLight(0xd6e2f0, 0.28);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff0d4, 2.35); // Warm golden sun casting dark crisp shadows
    sunLight.position.set(35, 60, 45);
    sunLight.castShadow = !isCompactViewport;
    sunLight.shadow.mapSize.width = isConstrainedDevice ? 1024 : 2048;
    sunLight.shadow.mapSize.height = isConstrainedDevice ? 1024 : 2048;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -32;
    sunLight.shadow.camera.right = 32;
    sunLight.shadow.camera.top = 32;
    sunLight.shadow.camera.bottom = -32;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    scene.add(sunLight.target);

    // Warm ground bounce
    const groundBounce = new THREE.HemisphereLight(0x8cbcdb, 0x26211c, 0.42);
    scene.add(groundBounce);

    // Cool cyan/neon architectural rim light
    const rimLight = new THREE.DirectionalLight(0x00d2ff, 0.65);
    rimLight.position.set(-75, 45, -120);
    scene.add(rimLight);

    // 3. Mathematical Spline Trajectory via @cwe/motion-engine
    const curve = createAuthoritativeRouteCurve();
    const trajectory = new SplineTrajectoryAdapter(curve, {
      divisions: 600,
      reverseZ: true, // GLTF / Three.js standard: vehicle forward is -Z, rear is +Z
    });

    // 4. Asset Loaders with DRACO Support
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/gltf/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    let vehicleGroup: THREE.Group | null = null;
    let cityGroup: THREE.Group | null = null;
    let droneGroup: THREE.Group | null = null;
    const droneRotors: THREE.Mesh[] = [];
    let droneBannerMesh: THREE.Mesh | null = null;
    const vehicleWheels: THREE.Object3D[] = [];
    let wheelFL: THREE.Object3D | null = null;
    let wheelFR: THREE.Object3D | null = null;
    let wheelRL: THREE.Object3D | null = null;
    let wheelRR: THREE.Object3D | null = null;

    let currentBannerStage = 0;

    // Pre-generate the Drone Banner stage textures with anisotropic filtering
    for (const stage of DRONE_BANNER_STAGES) {
      const tex = createDroneBannerTexture(stage, maxAnisotropy);
      droneBannerTextures.push(tex);
      generatedTextures.push(tex);
    }

    const billboardMeshes: THREE.Mesh[] = [];
    const interactiveBillboards: THREE.Mesh[] = [];

    // 4.1 Mount Stage G.11 Kinetic Project Exhibition Pods & Standalone Decembay Pavilion
    const kineticTextures: Record<string, THREE.Texture> = {};
    for (const spec of EXHIBITION_SPECS) {
      const cfg = BILLBOARD_CONFIGS[spec.meshName];
      if (cfg) {
        const tex = createBillboardCanvasTexture(cfg, maxAnisotropy);
        generatedTextures.push(tex);
        kineticTextures[spec.meshName] = tex;
      }
    }
    const kineticExhibitions = createKineticExhibitionSystem(trajectory, kineticTextures);
    scene.add(kineticExhibitions.group);
    interactiveBillboards.push(...kineticExhibitions.interactiveScreenMeshes);
    billboardMeshes.push(...kineticExhibitions.allDisplayMeshes);

    const REPLACED_STATIC_BOARDS = new Set<string>([
      'Display_Project_Jarvis',
      'Display_Project_Biometric',
      'Display_Project_SmartQR',
      'Display_Project_DocIntel',
      'Display_Project_PDFChatter',
      'Display_Project_Recipe',
      'Display_Decembay_Timeline',
    ]);

    // 4a. Load Full Cyberpunk City World
    gltfLoader.load(
      '/assets/models/city_world.glb',
      (gltf) => {
        if (isDisposed) return;
        cityGroup = gltf.scene;
        // Native coordinates: Y=Up, -Z=Forward (100% mathematical alignment with Catmull-Rom spline)
        cityGroup.rotation.set(0, 0, 0);

        // Apply procedural Night City asphalt, concrete, curtain-wall, storefront & ring ad textures
        const cityTextures = applyCyberpunkCityTextures(cityGroup);
        generatedTextures.push(...cityTextures);

        // Eliminate opening-road coplanar z-fighting ground slab & fix inverted road winding/normals
        cityGroup.traverse((child) => {
          if (!(child instanceof THREE.Mesh) || !child.geometry) return;
          const geom = child.geometry;

          // 1. Lower the massive 2400x2400m Y=0 basalt ground slab inside City_Buildings_Master_Mesh
          // by 3.5cm so it remains cleanly beneath all Road_Infrastructure_Master_Mesh triangles (Y >= 0)
          // and above the outer scene groundMesh (Y = -0.05) without coplanar grey apron override.
          if (child.name === 'City_Buildings_Master_Mesh') {
            const pos = geom.attributes.position as THREE.BufferAttribute | undefined;
            const idx = geom.index;
            if (pos) {
              const triCount = idx ? Math.floor(idx.count / 3) : Math.floor(pos.count / 3);
              const loweredVerts = new Set<number>();
              for (let t = 0; t < triCount; t++) {
                const i0 = idx ? idx.getX(t * 3) : t * 3;
                const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
                const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
                const y0 = pos.getY(i0);
                const y1 = pos.getY(i1);
                const y2 = pos.getY(i2);
                if (Math.abs(y0) < 0.01 && Math.abs(y1) < 0.01 && Math.abs(y2) < 0.01) {
                  const spanX =
                    Math.max(pos.getX(i0), pos.getX(i1), pos.getX(i2)) -
                    Math.min(pos.getX(i0), pos.getX(i1), pos.getX(i2));
                  const spanZ =
                    Math.max(pos.getZ(i0), pos.getZ(i1), pos.getZ(i2)) -
                    Math.min(pos.getZ(i0), pos.getZ(i1), pos.getZ(i2));
                  if (spanX > 100 && spanZ > 100) {
                    loweredVerts.add(i0);
                    loweredVerts.add(i1);
                    loweredVerts.add(i2);
                  }
                }
              }
              if (loweredVerts.size > 0) {
                for (const vi of loweredVerts) {
                  pos.setY(vi, -0.035);
                }
                pos.needsUpdate = true;
                geom.computeBoundingBox();
                geom.computeBoundingSphere();
              }
            }
          }

          // 2. Unify Road_Infrastructure_Master_Mesh triangle winding and upward vertex normals
          // so double-sided shader flips never alter shading across the opening Z = +28..-10m stretch.
          if (child.name === 'Road_Infrastructure_Master_Mesh') {
            const pos = geom.attributes.position as THREE.BufferAttribute | undefined;
            const norm = geom.attributes.normal as THREE.BufferAttribute | undefined;
            const idx = geom.index;
            if (pos && idx) {
              const triCount = Math.floor(idx.count / 3);
              let rewound = false;
              for (let t = 0; t < triCount; t++) {
                const i0 = idx.getX(t * 3);
                const i1 = idx.getX(t * 3 + 1);
                const i2 = idx.getX(t * 3 + 2);
                const y0 = pos.getY(i0);
                const y1 = pos.getY(i1);
                const y2 = pos.getY(i2);
                if (Math.abs(y1 - y0) < 0.35 && Math.abs(y2 - y0) < 0.35) {
                  const ax = pos.getX(i1) - pos.getX(i0);
                  const az = pos.getZ(i1) - pos.getZ(i0);
                  const bx = pos.getX(i2) - pos.getX(i0);
                  const bz = pos.getZ(i2) - pos.getZ(i0);
                  const crossY = az * bx - ax * bz;
                  if (crossY < -0.1) {
                    idx.setX(t * 3 + 1, i2);
                    idx.setX(t * 3 + 2, i1);
                    rewound = true;
                  }
                }
              }
              if (rewound) {
                idx.needsUpdate = true;
              }
            }
            if (norm) {
              for (let i = 0; i < norm.count; i++) {
                const ny = norm.getY(i);
                if (ny < -0.5) {
                  norm.setY(i, Math.abs(ny));
                  norm.setZ(i, Math.abs(norm.getZ(i)));
                }
              }
              norm.needsUpdate = true;
            }
          }
        });

        // Apply dynamic canvas textures to non-project billboards while suppressing old static project/Decembay displays
        cityGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const baseName = child.name.replace(/_Structure$/, '');
            if (REPLACED_STATIC_BOARDS.has(child.name) || REPLACED_STATIC_BOARDS.has(baseName)) {
              child.visible = false;
              return;
            }

            child.castShadow = true;
            child.receiveShadow = true;

            const config = BILLBOARD_CONFIGS[child.name];
            if (config) {
              const tex = createBillboardCanvasTexture(config, maxAnisotropy);
              generatedTextures.push(tex);
              child.material = new THREE.MeshBasicMaterial({
                map: tex,
                side: THREE.DoubleSide,
                toneMapped: false,
              });
              billboardMeshes.push(child);

              const linkedProject = getProjectByBillboardMesh(child.name);
              if (linkedProject) {
                child.userData.projectId = linkedProject.id;
                child.userData.interactiveBillboard = true;
                interactiveBillboards.push(child);
              }
            }
          }
        });

        scene.add(cityGroup);
        onSceneReadyRef.current?.();
      },
      undefined,
      (err) => {
        console.warn('City world loading issue:', err);
        setLoadError('Architectural models initializing in progressive mode...');
      }
    );

    // 4b. Load Sports Car with Cyberpunk 2077 Quadra Turbo-R PBR Shaders
    gltfLoader.load(
      '/assets/models/sports_car.glb',
      (gltf) => {
        if (isDisposed) return;
        vehicleGroup = gltf.scene;

        vehicleGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const mat = child.material as THREE.MeshStandardMaterial;
            if (mat && mat.color) {
              const matName = mat.name || '';
              const childName = child.name || '';

              if (matName.includes('Bumper_Yellow')) {
                // Cyberpunk two-tone warm gold/yellow accent panel
                mat.color.set(0xf59e0b);
                mat.metalness = 0.25;
                mat.roughness = 0.28;
              } else if (matName.includes('Gloss_Trim_Black')) {
                // Architectural satin obsidian chassis pillars, fascia housing & vents
                mat.color.set(0x0a0d14);
                mat.metalness = 0.42;
                mat.roughness = 0.24;
              } else if (matName.includes('License_Plate')) {
                // Illuminated cyan Cyberpunk license plate
                mat.color.set(0x00e5ff);
                mat.emissive = new THREE.Color(0x00e5ff);
                mat.emissiveIntensity = 3.2;
              } else if (
                matName.includes('Carbon') ||
                childName.includes('Louvers') ||
                childName.includes('Splitter') ||
                childName.includes('Diffuser')
              ) {
                // Satin matte carbon fiber aerodynamic blades & louvered engine deck
                mat.color.set(0x0b0d11);
                mat.metalness = 0.35;
                mat.roughness = 0.36;
              } else if (matName.includes('CarPaint') || childName.includes('Twin_Winglets')) {
                // Automotive clearcoated metallic electric-cyan paint lacquer
                mat.dispose();
                child.material = new THREE.MeshPhysicalMaterial({
                  name: matName || 'M_CarPaint_Metallic',
                  color: 0x0077b6,
                  metalness: 0.86,
                  roughness: 0.18,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.08,
                });
              } else if (matName.includes('Glass') || childName.includes('Canopy')) {
                // Smoked dark tinted cockpit glass
                mat.color.set(0x02060d);
                mat.metalness = 0.25;
                mat.roughness = 0.06;
                mat.transparent = true;
                mat.opacity = 0.88;
              } else if (
                matName.includes('Neon_Pink') ||
                (childName.includes('Neon') && !childName.endsWith('_1'))
              ) {
                // Radiant hot-pink outer rim lip (saturated magenta under ACESFilmic)
                mat.color.set(0xd9006b);
                mat.emissive = new THREE.Color(0xff007f);
                mat.emissiveIntensity = 2.4;
              } else if (
                matName.includes('Neon_Cyan') ||
                (childName.includes('Neon') && childName.endsWith('_1'))
              ) {
                // Radiant electric-cyan inner aero ring
                mat.color.set(0x00b4d8);
                mat.emissive = new THREE.Color(0x00e5ff);
                mat.emissiveIntensity = 2.4;
              } else if (matName.includes('Taillight') || childName.includes('Taillight')) {
                // Full-width rich glowing crimson red LED taillight bar
                mat.color.set(0x990012);
                mat.emissive = new THREE.Color(0xff0019);
                mat.emissiveIntensity = 2.1;
              } else if (matName.includes('Headlight') || childName.includes('Headlight')) {
                // Recessed LED headlights
                mat.color.set(0xffffff);
                mat.emissive = new THREE.Color(0xdff4ff);
                mat.emissiveIntensity = 4.5;
              } else if (matName.includes('Chrome') || childName.startsWith('Rim_')) {
                // Gunmetal titanium rim alloy
                mat.color.set(0x181c22);
                mat.metalness = 0.95;
                mat.roughness = 0.15;
              } else if (matName.includes('Rubber') || childName.includes('Tire_')) {
                // High-traction vulcanized black rubber
                mat.color.set(0x0d0e11);
                mat.metalness = 0.02;
                mat.roughness = 0.88;
              } else if (matName.includes('Caliper') || childName.includes('Caliper')) {
                // Gloss performance red caliper
                mat.color.set(0xd90429);
                mat.metalness = 0.80;
                mat.roughness = 0.20;
              } else if (matName.includes('Rotor') || childName.includes('Rotor')) {
                // Steel slotted rotor
                mat.color.set(0x94a3b8);
                mat.metalness = 0.95;
                mat.roughness = 0.25;
              }
            }
          }

          // Collect the 4 primary wheel empties for rotation
          if (
            child.name === 'Wheel_FL' ||
            child.name === 'Wheel_FR' ||
            child.name === 'Wheel_RL' ||
            child.name === 'Wheel_RR'
          ) {
            vehicleWheels.push(child);
          }
        });

        // Store direct references to wheels for Ackermann steering & rolling
        wheelFL = vehicleGroup.getObjectByName('Wheel_FL') ?? null;
        wheelFR = vehicleGroup.getObjectByName('Wheel_FR') ?? null;
        wheelRL = vehicleGroup.getObjectByName('Wheel_RL') ?? null;
        wheelRR = vehicleGroup.getObjectByName('Wheel_RR') ?? null;

        // Initialize car at route start with authoritative frame
        const startFrame = trajectory.getFrameAt(0.01);
        vehicleGroup.position.copy(startFrame.position);
        vehicleGroup.position.y += 0.04; // Precise road crown contact
        vehicleGroup.quaternion.copy(startFrame.quaternion);

        scene.add(vehicleGroup);
      },
      undefined,
      (err) => {
        console.warn('Vehicle loading issue:', err);
      }
    );

    // 4c. Load Autonomous Companion Drone with Aerospace Titanium Silhouette, Rotor Discs & Twin-Cable Rig
    const droneExtraMats: THREE.Material[] = [];
    const droneExtraGeos: THREE.BufferGeometry[] = [];
    const droneAircraftMeshes: THREE.Object3D[] = [];
    let droneBannerObj: THREE.Object3D | null = null;
    gltfLoader.load(
      '/assets/models/drone_with_banner.glb',
      (gltf) => {
        if (isDisposed) return;
        droneGroup = gltf.scene;

        // Upgrade chassis, arms, landing skids & rotor contrast so quadcopter silhouette reads clearly
        droneGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.name.startsWith('Rotor_')) {
              droneRotors.push(child);
              droneAircraftMeshes.push(child);
              const rotorMat = new THREE.MeshStandardMaterial({
                color: 0xf8fafc,
                metalness: 0.82,
                roughness: 0.16,
                emissive: new THREE.Color(0x38bdf8),
                emissiveIntensity: 0.35,
              });
              droneExtraMats.push(rotorMat);
              child.material = rotorMat;
            } else if (child.name === 'Drone_Body') {
              droneAircraftMeshes.push(child);
              // Two-tone aerospace titanium fuselage with crisp sunlit contrast over dark sky/asphalt
              const bodyMat = new THREE.MeshStandardMaterial({
                color: 0x94a3b8,
                metalness: 0.72,
                roughness: 0.24,
                emissive: new THREE.Color(0x0c4a6e),
                emissiveIntensity: 0.22,
              });
              droneExtraMats.push(bodyMat);
              child.material = bodyMat;
            } else if (child.name === 'Drone_Landing_Gear') {
              droneAircraftMeshes.push(child);
              const gearMat = new THREE.MeshStandardMaterial({
                color: 0x1e293b,
                metalness: 0.65,
                roughness: 0.30,
              });
              droneExtraMats.push(gearMat);
              child.material = gearMat;
            }

            if (child.name === 'Drone_Suspension_Cables') {
              // Hide legacy wide GLB cable spread; replaced below with two aligned steel rigging cables
              child.visible = false;
            }

            // Compact high-legibility banner suspended underneath twin landing skids (narrower than rotor envelope)
            if (child.name === 'Drone_Physical_Banner') {
              droneBannerMesh = child;
              droneBannerObj = child;
              child.scale.set(0.53, 0.82, 0.70);
              child.position.set(0, -1.34, 0);
              const banMat = new THREE.MeshBasicMaterial({
                map: droneBannerTextures[0],
                side: THREE.DoubleSide,
                toneMapped: false,
              });
              droneExtraMats.push(banMat);
              child.material = banMat;
            }
          }
        });

        // Two distinct vertical suspension cables connecting landing skids (y=-0.38) to banner top (y=-0.72)
        const cableGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.42, 8);
        const cableMat = new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          metalness: 0.85,
          roughness: 0.22,
          emissive: new THREE.Color(0x0ea5e9),
          emissiveIntensity: 0.18,
        });
        droneExtraGeos.push(cableGeo);
        droneExtraMats.push(cableMat);
        for (const cableX of [-0.54, 0.54]) {
          const cableMesh = new THREE.Mesh(cableGeo, cableMat);
          cableMesh.name = cableX < 0 ? 'Drone_Rig_Cable_Left' : 'Drone_Rig_Cable_Right';
          cableMesh.position.set(cableX, -0.54, 0);
          droneGroup.add(cableMesh);
        }

        // Translucent high-speed rotor blur discs + refined aviation nav micro-LEDs on all 4 quadcopter arms
        const rotorDiscGeo = new THREE.RingGeometry(0.16, 0.62, 24);
        rotorDiscGeo.rotateX(-Math.PI / 2);
        const rotorDiscMat = new THREE.MeshBasicMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.30,
          side: THREE.DoubleSide,
          depthWrite: false,
          toneMapped: false,
        });
        const ledGeo = new THREE.SphereGeometry(0.065, 10, 10);
        droneExtraGeos.push(rotorDiscGeo, ledGeo);
        droneExtraMats.push(rotorDiscMat);

        const beaconSpecs: Array<{ pos: [number, number, number]; hex: number; isRotor?: boolean }> = [
          { pos: [-0.99, 0.21, -0.99], hex: 0xef4444, isRotor: true }, // Port Front Red
          { pos: [0.99, 0.21, -0.99], hex: 0x10b981, isRotor: true }, // Starboard Front Green
          { pos: [-0.99, 0.21, 0.99], hex: 0x00f0ff, isRotor: true }, // Rear Port Cyan Strobe
          { pos: [0.99, 0.21, 0.99], hex: 0x00f0ff, isRotor: true }, // Rear Starboard Cyan Strobe
          { pos: [0.0, -0.10, 0.96], hex: 0xf59e0b }, // Aft Telemetry Amber Micro-LED
        ];
        for (const spec of beaconSpecs) {
          if (spec.isRotor) {
            const disc = new THREE.Mesh(rotorDiscGeo, rotorDiscMat);
            disc.position.set(spec.pos[0], 0.18, spec.pos[2]);
            droneGroup.add(disc);
            droneAircraftMeshes.push(disc);
          }
          const ledMat = new THREE.MeshBasicMaterial({ color: spec.hex, toneMapped: false });
          droneExtraMats.push(ledMat);
          const led = new THREE.Mesh(ledGeo, ledMat);
          led.position.set(...spec.pos);
          droneGroup.add(led);
          droneAircraftMeshes.push(led);
        }

        // Size aircraft so body+rotor envelope reads 120-160px and banner reads 135-180px at 2.35m lead
        droneGroup.scale.set(0.46, 0.46, 0.46);
        const startVehFrame = trajectory.getFrameAt(0.01);
        const initTangent = new THREE.Vector3(0, 0, -1).applyQuaternion(startVehFrame.quaternion);
        const initNormal = new THREE.Vector3(1, 0, 0).applyQuaternion(startVehFrame.quaternion);
        const initUp = new THREE.Vector3(0, 1, 0).applyQuaternion(startVehFrame.quaternion);
        droneGroup.position
          .copy(startVehFrame.position)
          .addScaledVector(initTangent, 2.35)
          .addScaledVector(initNormal, 1.18)
          .addScaledVector(initUp, 2.88);
        droneGroup.quaternion.copy(startVehFrame.quaternion);
        scene.add(droneGroup);
      },
      undefined,
      (err) => {
        console.warn('Drone loading issue:', err);
      }
    );

    // 5. Animation & Camera Choreography Loop
    let currentT = 0.01;
    let prevT = 0.01;
    let clock = 0;

    // Smoothed camera tracking variables - Cyberpunk 2077 Third-Person Driving Rig
    let currentTrail = 7.9;
    let currentHeight = 2.45;
    let currentLookAhead = 26.0;
    let currentLateral = 0.0;
    let currentElevation = 0.55;

    let debugHoldT: number | null = null;
    let customCameraPose: {
      position: THREE.Vector3;
      lookAt: THREE.Vector3;
    } | null = null;

    // Local spatial basis vectors and scratch quaternions allocated outside render loop
    const localXAxis = new THREE.Vector3(1, 0, 0);
    const localZAxis = new THREE.Vector3(0, 0, 1);
    const tempRollQuat = new THREE.Quaternion();
    const tempPitchQuat = new THREE.Quaternion();
    const tempCamOffset = new THREE.Vector3();
    const tempLookAtOffset = new THREE.Vector3();
    const tempCamUp = new THREE.Vector3();

    // Kinematic companion drone state (vehicle-relative leading formation flight)
    let smoothedDroneLeadM = 2.35;
    let smoothedDroneLateralX = 1.18;
    let smoothedDroneHoverY = 2.94;
    let smoothedDroneBank = 0.0;
    let smoothedDronePitch = 0.0;
    let prevDroneInputT = 0.01;
    const droneVecTangent = new THREE.Vector3();
    const droneVecNormal = new THREE.Vector3();
    const droneVecUp = new THREE.Vector3();

    // Deterministic Stage G.11.1 Close-Proximity Companion Drone Controller (2.0-2.8m lead, 0.9-1.4m lateral, 2.6-3.0m height)
    const updateDroneForProgress = (t: number, timeSec: number): void => {
      if (!droneGroup) return;

      const isDirectJump =
        timeSec === 0 || debugHoldT !== null || isReducedMotion || Math.abs(t - prevDroneInputT) > 0.06;

      // Opposite-flank road-relative lane (+/- 1.05..1.25m keeps drone close to car without blocking signage or car body)
      const getFlankTarget = (u: number): number => {
        if (u < 0.145) return 1.18; // Gateway approach/pass
        if (u < 0.212) return -1.12; // About/Innovation on Right -> lead Left
        if (u < 0.244) return 1.12; // MCA on Left -> lead Right
        if (u < 0.282) return -1.12; // BCA on Right -> lead Left
        if (u < 0.320) return 1.12; // Tech AI on Left -> lead Right
        if (u < 0.352) return -1.12; // Tech Backend on Right -> lead Left
        if (u < 0.376) return 1.12; // Tech Frontend on Left -> lead Right
        if (u < 0.444) return -1.12; // Tech DB/Automation on Right -> lead Left
        if (u < 0.508) return -1.18; // J.A.R.V.I.S. (Right Pod) -> flank Left
        if (u < 0.576) return 1.18; // Biometric (Left Pod) -> flank Right
        if (u < 0.644) return -1.18; // Smart QR (Right Pod) -> flank Left
        if (u < 0.712) return 1.18; // Doc Intel (Left Pod) -> flank Right
        if (u < 0.850) return -1.20; // Decembay (Right Pavilion) -> flank Left
        return 1.25; // Skyline Concours hover slightly right-ahead of parked sports car
      };

      const rawFlank =
        (getFlankTarget(t - 0.008) + getFlankTarget(t) * 2.0 + getFlankTarget(t + 0.008)) * 0.25;
      const targetLateralX =
        Math.sign(rawFlank || 1) * THREE.MathUtils.clamp(Math.abs(rawFlank), 0.92, 1.38);

      // Lead vehicle strictly within 2.0-2.8m along local tangent
      const targetLeadM = t >= VEHICLE_PARK_T ? 2.55 : 2.35;

      // Plausible 2.6-3.0m road-relative altitude (ensures ~0.9m clearance above car & clearly exposes 4 rotor arms in forward flight pitch)
      let targetHoverY = 2.88;
      if (t >= 0.88) {
        const settleFactor = smoothstep(0.88, 0.96, t);
        targetHoverY = THREE.MathUtils.lerp(2.88, 2.76, settleFactor);
      }

      const progressRate = (t - prevDroneInputT) * 60.0;
      const forwardCruisingPitch = t >= VEHICLE_PARK_T ? -0.14 : -0.22;
      const targetPitch =
        forwardCruisingPitch +
        (t >= VEHICLE_PARK_T ? 0.0 : THREE.MathUtils.clamp(-progressRate * 0.16, -0.10, 0.10));

      const dampFactor = isDirectJump ? 1.0 : 0.10;
      const prevLat = smoothedDroneLateralX;
      smoothedDroneLeadM += (targetLeadM - smoothedDroneLeadM) * (isDirectJump ? 1.0 : 0.18);
      smoothedDroneLateralX += (targetLateralX - smoothedDroneLateralX) * dampFactor;
      smoothedDroneHoverY += (targetHoverY - smoothedDroneHoverY) * dampFactor;

      const vehicleT = Math.min(VEHICLE_PARK_T, t);
      const vehFrame = trajectory.getFrameAt(vehicleT);
      const droneCurvature = t >= VEHICLE_PARK_T ? 0.0 : trajectory.getCurvature(vehicleT);
      const lateralVelocity = (smoothedDroneLateralX - prevLat) * 60.0;
      const targetBank = THREE.MathUtils.clamp(
        -lateralVelocity * 0.028 + droneCurvature * 1.45,
        -0.24,
        0.24
      );

      smoothedDroneBank += (targetBank - smoothedDroneBank) * (isDirectJump ? 1.0 : 0.14);
      smoothedDronePitch += (targetPitch - smoothedDronePitch) * (isDirectJump ? 1.0 : 0.14);
      prevDroneInputT = t;

      // Subtle stabilized hover oscillation
      const hoverStabilizationY =
        Math.sin(timeSec * 1.95) * 0.045 + Math.cos(timeSec * 3.2) * 0.018;

      // Authoritative relative composition: vehicle position + tangent * lead + normal * lateral + up * altitude
      droneVecTangent.set(0, 0, -1).applyQuaternion(vehFrame.quaternion);
      droneVecNormal.set(1, 0, 0).applyQuaternion(vehFrame.quaternion);
      droneVecUp.set(0, 1, 0).applyQuaternion(vehFrame.quaternion);

      droneGroup.position
        .copy(vehFrame.position)
        .addScaledVector(droneVecTangent, smoothedDroneLeadM)
        .addScaledVector(droneVecNormal, smoothedDroneLateralX)
        .addScaledVector(droneVecUp, smoothedDroneHoverY + hoverStabilizationY);
      droneGroup.quaternion.copy(vehFrame.quaternion);

      const yawQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        THREE.MathUtils.clamp(droneCurvature * 12.0, -0.12, 0.12)
      );
      const bankQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 0, 1),
        smoothedDroneBank + Math.sin(timeSec * 1.4) * 0.02
      );
      const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        smoothedDronePitch + Math.cos(timeSec * 1.2) * 0.018
      );
      droneGroup.quaternion.multiply(yawQuat).multiply(bankQuat).multiply(pitchQuat);

      if (droneBannerMesh) {
        droneBannerMesh.visible = true;
        // Gravity-aligned suspension compensation so banner hangs plumb vertical while aircraft tilts forward in thrust
        droneBannerMesh.rotation.z = -smoothedDroneBank * 0.72 + Math.sin(timeSec * 1.6) * 0.025;
        droneBannerMesh.rotation.x = -smoothedDronePitch * 0.92 + Math.cos(timeSec * 1.3) * 0.015;

        if (currentBannerStage !== 0) {
          currentBannerStage = 0;
          const bannerMat = droneBannerMesh.material as THREE.MeshBasicMaterial;
          bannerMat.map = droneBannerTextures[0];
          bannerMat.needsUpdate = true;
        }
      }
    };

    const evalRaycaster = new THREE.Raycaster();
    const evalNdc = new THREE.Vector3();
    const evalDir = new THREE.Vector3();
    const evalOrigin = new THREE.Vector3();

    // Expose debug hook for inspection and automated visual QA
    const debugInterface = {
      scene,
      camera,
      getVehicle: () => vehicleGroup,
      getCity: () => cityGroup,
      getVerticalSlice: () => cityGroup,
      getDrone: () => droneGroup,
      getWheels: () => ({ wheelFL, wheelFR, wheelRL, wheelRR }),
      getSteering: () => ({
        wheelFL: wheelFL?.rotation.y ?? 0,
        wheelFR: wheelFR?.rotation.y ?? 0,
        curvature: trajectory.getCurvature(currentT),
      }),
      getDroneMetrics: () => {
        if (!droneGroup) return null;
        droneGroup.updateMatrixWorld(true);
        const bannerBox = droneBannerMesh
          ? new THREE.Box3().setFromObject(droneBannerMesh)
          : null;
        return {
          bannerVisible: droneBannerMesh?.visible ?? false,
          bannerStage: currentBannerStage,
          dronePos: {
            x: droneGroup.position.x,
            y: droneGroup.position.y,
            z: droneGroup.position.z,
          },
          bannerWorldMinY: bannerBox ? bannerBox.min.y : null,
          bannerWorldMaxY: bannerBox ? bannerBox.max.y : null,
        };
      },
      evaluateDisplayVisibility: (displayName: string) => {
        const meshObj = scene.getObjectByName(displayName);
        if (!(meshObj instanceof THREE.Mesh) || !meshObj.geometry) {
          return {
            found: false,
            totalSamples: 0,
            inViewportSamples: 0,
            unoccludedSamples: 0,
            visibleRatio: 0,
            occludedBy: [] as string[],
            bounds: null as { minY: number; maxY: number } | null,
          };
        }
        scene.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        const posAttr = meshObj.geometry.attributes.position;
        const worldPts: THREE.Vector3[] = [];
        for (let i = 0; i < posAttr.count; i++) {
          const wp = new THREE.Vector3(
            posAttr.getX(i),
            posAttr.getY(i),
            posAttr.getZ(i)
          ).applyMatrix4(meshObj.matrixWorld);
          worldPts.push(wp);
        }
        let minY = Infinity;
        let maxY = -Infinity;
        for (const wp of worldPts) {
          if (wp.y < minY) minY = wp.y;
          if (wp.y > maxY) maxY = wp.y;
        }
        // Find max-distance pair in XZ plane to reconstruct horizontal span accurately regardless of yaw
        let endA = worldPts[0] ?? new THREE.Vector3();
        let endB = worldPts[0] ?? new THREE.Vector3();
        let maxXZSq = -1;
        for (let a = 0; a < worldPts.length; a++) {
          for (let b = a + 1; b < worldPts.length; b++) {
            const dx = worldPts[b].x - worldPts[a].x;
            const dz = worldPts[b].z - worldPts[a].z;
            const dSq = dx * dx + dz * dz;
            if (dSq > maxXZSq) {
              maxXZSq = dSq;
              endA = worldPts[a];
              endB = worldPts[b];
            }
          }
        }
        const totalSamples = 15; // 5x3 grid
        let inViewportSamples = 0;
        let unoccludedSamples = 0;
        const blockers = new Set<string>();
        const uVals = [0.06, 0.28, 0.5, 0.72, 0.94];
        const vVals = [0.1, 0.5, 0.9];
        for (const u of uVals) {
          const hx = THREE.MathUtils.lerp(endA.x, endB.x, u);
          const hz = THREE.MathUtils.lerp(endA.z, endB.z, u);
          for (const v of vVals) {
            const hy = THREE.MathUtils.lerp(minY, maxY, v);
            const ptWorld = new THREE.Vector3(hx, hy, hz);
            evalNdc.copy(ptWorld).project(camera);
            const inView =
              evalNdc.z >= -1 &&
              evalNdc.z <= 1 &&
              evalNdc.x >= -0.96 &&
              evalNdc.x <= 0.96 &&
              evalNdc.y >= -0.96 &&
              evalNdc.y <= 0.96;
            if (inView) {
              inViewportSamples++;
            }
            evalOrigin.copy(camera.position);
            evalDir.copy(ptWorld).sub(evalOrigin);
            const distToBoard = evalDir.length();
            evalRaycaster.set(evalOrigin, evalDir.normalize());
            evalRaycaster.far = distToBoard + 2.0;
            const hits = evalRaycaster.intersectObjects(scene.children, true);
            const firstBlocking = hits.find(
              (h) =>
                h.object.visible &&
                h.object !== meshObj &&
                h.distance < distToBoard - 0.35
            );
            if (firstBlocking) {
              blockers.add(firstBlocking.object.name || firstBlocking.object.type);
            } else if (inView) {
              unoccludedSamples++;
            }
          }
        }
        return {
          found: true,
          totalSamples,
          inViewportSamples,
          unoccludedSamples,
          visibleRatio: unoccludedSamples / totalSamples,
          occludedBy: Array.from(blockers),
          bounds: { minY, maxY },
        };
      },
      trajectory,
      getCurrentT: () => currentT,
      getTargetT: () => targetProgressRef.current,
      jumpToT: (t: number) => {
        debugHoldT = t;
        targetProgressRef.current = t;
        currentT = t;
        prevT = t;
        if (vehicleGroup) {
          const vehicleT = Math.min(VEHICLE_PARK_T, t);
          const frame = trajectory.getFrameAt(vehicleT);
          const curvature = t >= VEHICLE_PARK_T ? 0.0 : trajectory.getCurvature(vehicleT);

          vehicleGroup.position.copy(frame.position);
          vehicleGroup.position.y += 0.04;

          // Follow vehicle with directional sunlight shadow frustum for crisp contact shadows
          sunLight.position.set(
            vehicleGroup.position.x + 35,
            vehicleGroup.position.y + 60,
            vehicleGroup.position.z + 45
          );
          sunLight.target.position.copy(vehicleGroup.position);
          sunLight.target.updateMatrixWorld();

          const rollFactor = 1.8;
          const bodyRoll = THREE.MathUtils.clamp(-curvature * rollFactor, -0.09, 0.09);
          tempRollQuat.setFromAxisAngle(localZAxis, bodyRoll);
          vehicleGroup.quaternion.copy(frame.quaternion).multiply(tempRollQuat);

          // Physical Ackermann steering geometry on jump with visual steering gain (x32)
          const STEER_GAIN = 32.0;
          const effectiveCurvature = curvature * STEER_GAIN;
          const absKappa = Math.abs(effectiveCurvature);
          const wheelbase = 2.76;
          const trackWidth = 1.92;
          let steerFL = 0;
          let steerFR = 0;
          if (absKappa > 1e-4 && t < VEHICLE_PARK_T) {
            const inner = Math.atan((wheelbase * effectiveCurvature) / (1 - 0.5 * trackWidth * Math.min(absKappa, 0.4)));
            const outer = Math.atan((wheelbase * effectiveCurvature) / (1 + 0.5 * trackWidth * Math.min(absKappa, 0.4)));
            if (curvature > 0) {
              steerFL = inner;
              steerFR = outer;
            } else {
              steerFL = outer;
              steerFR = inner;
            }
          }
          steerFL = THREE.MathUtils.clamp(steerFL, -0.55, 0.55);
          steerFR = THREE.MathUtils.clamp(steerFR, -0.55, 0.55);
          if (wheelFL) wheelFL.rotation.y = steerFL;
          if (wheelFR) wheelFR.rotation.y = steerFR;
          if (wheelRL) wheelRL.rotation.y = 0;
          if (wheelRR) wheelRR.rotation.y = 0;

          // Deterministic wheel roll (stops once parked)
          const rollAngle = -(vehicleT * trajectory.totalLength) / 0.35;
          for (const w of [wheelFL, wheelFR, wheelRL, wheelRR]) {
            if (!w) continue;
            for (const p of w.children) {
              if (!p.name.includes('Caliper')) p.rotation.x = rollAngle;
            }
          }

          // Camera immediate sync in vehicle local coordinate system with authoritative station targets
          const rig = getCameraRigTargetsForT(t);
          currentTrail = rig.trail;
          currentHeight = rig.height;
          currentLookAhead = rig.lookAhead;
          currentLateral = rig.lateral;
          currentElevation = rig.elevation;

          const attention = calculateCinematicAttention(t);
          tempCamOffset.set(
            attention.camShiftX,
            currentHeight + attention.elevationShift,
            currentTrail + attention.trailShift
          );
          tempCamOffset.applyQuaternion(vehicleGroup.quaternion);
          camera.position.copy(vehicleGroup.position).add(tempCamOffset);

          const curveLookAhead = currentLookAhead + Math.abs(curvature) * 35.0;
          const apexGazeX = currentLateral + curvature * 4.5 + attention.gazePanX;
          tempLookAtOffset.set(
            apexGazeX,
            0.55 + currentElevation + attention.elevationShift * 0.5,
            -curveLookAhead
          );
          tempLookAtOffset.applyQuaternion(vehicleGroup.quaternion);
          tempCamUp.set(0, 1, 0).applyQuaternion(vehicleGroup.quaternion);
          camera.up.copy(tempCamUp);
          camera.lookAt(vehicleGroup.position.clone().add(tempLookAtOffset));

          kineticExhibitions.update(t, 0, isReducedMotion);
          updateDroneForProgress(t, 0);
        }
      },
      getExhibitionStates: () => kineticExhibitions.getStates(),
      evaluateScreenSpaceMetrics: (displayName: string) => {
        const meshObj = scene.getObjectByName(displayName);
        if (!(meshObj instanceof THREE.Mesh) || !meshObj.geometry) return null;
        scene.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        const posAttr = meshObj.geometry.attributes.position;
        const corners: THREE.Vector3[] = [];
        let minYWorld = Infinity;
        let maxYWorld = -Infinity;
        for (let i = 0; i < posAttr.count; i++) {
          const wp = new THREE.Vector3(
            posAttr.getX(i),
            posAttr.getY(i),
            posAttr.getZ(i)
          ).applyMatrix4(meshObj.matrixWorld);
          corners.push(wp);
          if (wp.y < minYWorld) minYWorld = wp.y;
          if (wp.y > maxYWorld) maxYWorld = wp.y;
        }
        const rect = renderer.domElement.getBoundingClientRect();
        let minSX = Infinity;
        let maxSX = -Infinity;
        let minSY = Infinity;
        let maxSY = -Infinity;
        let allInFront = true;
        for (const wp of corners) {
          const ndc = wp.clone().project(camera);
          if (ndc.z < -1 || ndc.z > 1) allInFront = false;
          const sx = (ndc.x * 0.5 + 0.5) * rect.width;
          const sy = (-ndc.y * 0.5 + 0.5) * rect.height;
          if (sx < minSX) minSX = sx;
          if (sx > maxSX) maxSX = sx;
          if (sy < minSY) minSY = sy;
          if (sy > maxSY) maxSY = sy;
        }
        const projHeightPx = maxSY - minSY;
        const projWidthPx = maxSX - minSX;
        // Map exact canvas font ratios from BillboardTextures.ts (2048x1024):
        // Title = 114/1024, Category = 68/1024, Description = 58/1024, Tech = 52/1024
        return {
          name: displayName,
          screenBoxPx: {
            minX: +minSX.toFixed(1),
            minY: +minSY.toFixed(1),
            maxX: +maxSX.toFixed(1),
            maxY: +maxSY.toFixed(1),
            width: +projWidthPx.toFixed(1),
            height: +projHeightPx.toFixed(1),
          },
          projectedTextPx: {
            titlePx: +((114 / 1024) * projHeightPx).toFixed(1),
            categoryPx: +((68 / 1024) * projHeightPx).toFixed(1),
            descriptionPx: +((58 / 1024) * projHeightPx).toFixed(1),
            techTagsPx: +((52 / 1024) * projHeightPx).toFixed(1),
          },
          allInFront,
          withinViewport5Pct:
            allInFront &&
            minSX >= rect.width * 0.03 &&
            maxSX <= rect.width * 0.97 &&
            minSY >= 68 &&
            maxSY <= rect.height * 0.96,
        };
      },
      getDroneScreenMetrics: () => {
        if (!droneGroup || !vehicleGroup) return null;
        droneGroup.updateMatrixWorld(true);
        vehicleGroup.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        const combinedBox = new THREE.Box3().setFromObject(droneGroup);
        const chassisBox = new THREE.Box3();
        for (const obj of droneAircraftMeshes) {
          chassisBox.expandByObject(obj);
        }
        const bannerBox = droneBannerObj ? new THREE.Box3().setFromObject(droneBannerObj) : new THREE.Box3();
        const carBox = new THREE.Box3().setFromObject(vehicleGroup);
        const rect = renderer.domElement.getBoundingClientRect();
        const projectBox = (box: THREE.Box3): { w: number; h: number } => {
          if (box.isEmpty()) return { w: 0, h: 0 };
          const minC = box.min;
          const maxC = box.max;
          const pts = [
            new THREE.Vector3(minC.x, minC.y, minC.z),
            new THREE.Vector3(maxC.x, minC.y, minC.z),
            new THREE.Vector3(minC.x, maxC.y, minC.z),
            new THREE.Vector3(maxC.x, maxC.y, minC.z),
            new THREE.Vector3(minC.x, minC.y, maxC.z),
            new THREE.Vector3(maxC.x, minC.y, maxC.z),
            new THREE.Vector3(minC.x, maxC.y, maxC.z),
            new THREE.Vector3(maxC.x, maxC.y, maxC.z),
          ];
          let minSX = Infinity;
          let maxSX = -Infinity;
          let minSY = Infinity;
          let maxSY = -Infinity;
          for (const p of pts) {
            const ndc = p.project(camera);
            const sx = (ndc.x * 0.5 + 0.5) * rect.width;
            const sy = (-ndc.y * 0.5 + 0.5) * rect.height;
            if (sx < minSX) minSX = sx;
            if (sx > maxSX) maxSX = sx;
            if (sy < minSY) minSY = sy;
            if (sy > maxSY) maxSY = sy;
          }
          return { w: +(maxSX - minSX).toFixed(1), h: +(maxSY - minSY).toFixed(1) };
        };
        const comb = projectBox(combinedBox);
        const chas = projectBox(chassisBox);
        const ban = projectBox(bannerBox);
        const clearanceAboveCarM =
          !bannerBox.isEmpty() && !carBox.isEmpty()
            ? +(bannerBox.min.y - carBox.max.y).toFixed(2)
            : +(droneGroup.position.y - carBox.max.y).toFixed(2);
        return {
          chassisScreenWidthPx: chas.w,
          chassisScreenHeightPx: chas.h,
          bannerScreenWidthPx: ban.w,
          bannerScreenHeightPx: ban.h,
          screenWidthPx: comb.w,
          screenHeightPx: comb.h,
          leadDistM: +smoothedDroneLeadM.toFixed(2),
          lateralM: +smoothedDroneLateralX.toFixed(2),
          altitudeAboveRoadM: +(droneGroup.position.y - vehicleGroup.position.y + 0.04).toFixed(2),
          verticalClearanceAboveCarM: clearanceAboveCarM,
        };
      },
      releaseHold: () => {
        debugHoldT = null;
      },
      setCameraPose: (pos: [number, number, number], target: [number, number, number]) => {
        customCameraPose = {
          position: new THREE.Vector3(...pos),
          lookAt: new THREE.Vector3(...target),
        };
      },
      clearCameraPose: () => {
        customCameraPose = null;
      },
      getInteractiveBillboards: () =>
        interactiveBillboards.map((mesh) => ({
          name: mesh.name,
          projectId: String(mesh.userData.projectId ?? ''),
        })),
      getBillboardScreenCenter: (query: string) => {
        const qNorm = query.toLowerCase().replace(/[-_\s]/g, '');
        const match =
          interactiveBillboards.find(
            (m) =>
              m.name.toLowerCase() === query.toLowerCase() ||
              String(m.userData.projectId ?? '').toLowerCase().replace(/[-_\s]/g, '') === qNorm
          ) ?? null;
        if (!match || !match.geometry) return null;
        scene.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        match.geometry.computeBoundingBox();
        const centerLocal = new THREE.Vector3();
        match.geometry.boundingBox?.getCenter(centerLocal);
        const centerWorld = centerLocal.applyMatrix4(match.matrixWorld);
        const ndc = centerWorld.clone().project(camera);
        const rect = renderer.domElement.getBoundingClientRect();
        const x = rect.left + (ndc.x * 0.5 + 0.5) * rect.width;
        const y = rect.top + (-ndc.y * 0.5 + 0.5) * rect.height;
        return {
          name: match.name,
          projectId: String(match.userData.projectId ?? ''),
          x,
          y,
          inView: ndc.z >= -1 && ndc.z <= 1 && Math.abs(ndc.x) <= 0.96 && Math.abs(ndc.y) <= 0.96,
        };
      },
    };
    (window as unknown as { __DEBUG_SCENE__?: unknown; __cwe_debug?: unknown }).__DEBUG_SCENE__ = debugInterface;
    (window as unknown as { __DEBUG_SCENE__?: unknown; __cwe_debug?: unknown }).__cwe_debug = debugInterface;

    const pickRaycaster = new THREE.Raycaster();
    const pickNdc = new THREE.Vector2();
    let activePointer: { id: number; x: number; y: number; downTime: number } | null = null;
    let activationLocked = false;
    let lockResetTimer: ReturnType<typeof setTimeout> | null = null;
    let lastHoveredProjectId: string | null = null;

    const getCanvasNdc = (clientX: number, clientY: number): THREE.Vector2 | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      pickNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pickNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      return pickNdc;
    };

    const pickInteractiveProject = (clientX: number, clientY: number): string | null => {
      if (interactiveBillboards.length === 0) return null;
      const ndc = getCanvasNdc(clientX, clientY);
      if (!ndc) return null;

      camera.updateMatrixWorld(true);
      pickRaycaster.setFromCamera(ndc, camera);
      pickRaycaster.far = 220;

      const boardHits = pickRaycaster.intersectObjects(interactiveBillboards, false);
      if (boardHits.length === 0) return null;

      const nearestBoard = boardHits[0];
      // Verify no opaque foreground geometry obscures the clicked spot on the board
      const sceneHits = pickRaycaster.intersectObjects(scene.children, true);
      const blocker = sceneHits.find(
        (h) =>
          h.object.visible &&
          h.object !== nearestBoard.object &&
          h.distance < nearestBoard.distance - 0.5
      );
      if (blocker) return null;

      const projId = nearestBoard.object.userData?.projectId;
      return typeof projId === 'string' ? projId : null;
    };

    const setHoveredProject = (projectId: string | null): void => {
      renderer.domElement.style.cursor = projectId ? 'pointer' : '';
      if (projectId !== lastHoveredProjectId) {
        lastHoveredProjectId = projectId;
        onHoverBillboardRef.current?.(projectId);
      }
    };

    const handlePointerMove = (e: PointerEvent): void => {
      if (isPausedRef.current || e.target !== renderer.domElement) {
        setHoveredProject(null);
        return;
      }
      if (e.pointerType === 'touch') return;
      const hoveredId = pickInteractiveProject(e.clientX, e.clientY);
      setHoveredProject(hoveredId);
    };

    const handlePointerDown = (e: PointerEvent): void => {
      if (isPausedRef.current || e.target !== renderer.domElement) {
        activePointer = null;
        return;
      }
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      activePointer = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        downTime: performance.now(),
      };
    };

    const handlePointerUp = (e: PointerEvent): void => {
      const pointerSnapshot = activePointer;
      activePointer = null;

      if (
        !pointerSnapshot ||
        pointerSnapshot.id !== e.pointerId ||
        isPausedRef.current ||
        e.target !== renderer.domElement ||
        activationLocked
      ) {
        return;
      }

      // Ignore scroll or swipe gestures (> 8px pointer movement or > 600ms press)
      const dragDist = Math.hypot(e.clientX - pointerSnapshot.x, e.clientY - pointerSnapshot.y);
      const elapsed = performance.now() - pointerSnapshot.downTime;
      if (dragDist > 8 || elapsed > 600) {
        return;
      }

      const projectId = pickInteractiveProject(e.clientX, e.clientY);
      if (!projectId) return;

      activationLocked = true;
      if (lockResetTimer) clearTimeout(lockResetTimer);
      lockResetTimer = setTimeout(() => {
        activationLocked = false;
      }, 250);

      setHoveredProject(null);
      onSelectProjectRef.current?.(projectId, renderer.domElement);
    };

    const handlePointerCancel = (): void => {
      activePointer = null;
      setHoveredProject(null);
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointercancel', handlePointerCancel);
    renderer.domElement.addEventListener('pointerleave', handlePointerCancel);

    let isDocumentHidden = typeof document !== 'undefined' ? document.hidden : false;

    const animate = (): void => {
      if (isDisposed || isDocumentHidden) return;
      animationFrameId = requestAnimationFrame(animate);

      // Pause dynamic vehicle/camera drift cleanly behind open modal while preserving scenic city & scroll progress
      if (isPausedRef.current) {
        if (renderer.domElement.style.cursor) {
          setHoveredProject(null);
        }
        renderer.render(scene, camera);
        return;
      }

      clock += 0.016;

      // Lerp parameter towards scroll progress or hold deterministic position
      const rawTarget = debugHoldT !== null ? debugHoldT : targetProgressRef.current;
      const targetT = Math.max(0.005, Math.min(0.995, rawTarget));
      if (debugHoldT !== null) {
        currentT = targetT;
      } else {
        const lerpFactor = isReducedMotion ? 1.0 : 0.06;
        currentT += (targetT - currentT) * lerpFactor;
      }

      // Evaluate vehicle frame along Catmull-Rom spline (parks at t = VEHICLE_PARK_T)
      const vehicleT = Math.min(VEHICLE_PARK_T, currentT);
      const frame = trajectory.getFrameAt(vehicleT);
      const curvature = currentT >= VEHICLE_PARK_T ? 0.0 : trajectory.getCurvature(vehicleT);
      const absKappa = Math.abs(curvature);

      // Update vehicle position, physical orientation, chassis dynamics, and steering
      if (vehicleGroup) {
        // Precise lane center and road crown contact (+0.04m above road deck)
        vehicleGroup.position.copy(frame.position);
        vehicleGroup.position.y += 0.04;

        // Dynamic sun shadow frustum follow for continuous road contact shadows
        sunLight.position.set(
          vehicleGroup.position.x + 35,
          vehicleGroup.position.y + 60,
          vehicleGroup.position.z + 45
        );
        sunLight.target.position.copy(vehicleGroup.position);
        sunLight.target.updateMatrixWorld();

        // Centrifugal chassis roll into turns: subtle outward tilt against curvature
        const rollFactor = 1.8;
        const bodyRoll = THREE.MathUtils.clamp(-curvature * rollFactor, -0.09, 0.09);

        // Dynamic suspension pitch: nose dive under deceleration/reversing, squat under forward acceleration
        const progressRate = (currentT - prevT) * 60.0;
        const bodyPitch = THREE.MathUtils.clamp(progressRate * 0.12, -0.04, 0.04);

        tempRollQuat.setFromAxisAngle(localZAxis, bodyRoll);
        tempPitchQuat.setFromAxisAngle(localXAxis, bodyPitch);

        // Authoritative trajectory heading transformed by chassis dynamics
        vehicleGroup.quaternion
          .copy(frame.quaternion)
          .multiply(tempRollQuat)
          .multiply(tempPitchQuat);

        // Physical Ackermann Front-Wheel Steering Geometry with visual steering gain (x32):
        // Wheelbase L = 2.76m, Track Width W = 1.92m
        const STEER_GAIN = 32.0;
        const effectiveCurvature = curvature * STEER_GAIN;
        const absEffKappa = Math.abs(effectiveCurvature);
        const wheelbase = 2.76;
        const trackWidth = 1.92;
        let steeringFL = 0;
        let steeringFR = 0;

        if (absEffKappa > 1e-4 && currentT < VEHICLE_PARK_T) {
          const innerAngle = Math.atan((wheelbase * effectiveCurvature) / (1 - 0.5 * trackWidth * Math.min(absEffKappa, 0.4)));
          const outerAngle = Math.atan((wheelbase * effectiveCurvature) / (1 + 0.5 * trackWidth * Math.min(absEffKappa, 0.4)));

          if (curvature > 0) {
            // Road curves left: FL is inner (turns sharper), FR is outer
            steeringFL = innerAngle;
            steeringFR = outerAngle;
          } else {
            // Road curves right: FR is inner, FL is outer
            steeringFL = outerAngle;
            steeringFR = innerAngle;
          }
        }

        // Clamp to physical steering rack limits +/- 0.55 rad (~31.5 degrees)
        steeringFL = THREE.MathUtils.clamp(steeringFL, -0.55, 0.55);
        steeringFR = THREE.MathUtils.clamp(steeringFR, -0.55, 0.55);

        if (wheelFL) wheelFL.rotation.y = steeringFL;
        if (wheelFR) wheelFR.rotation.y = steeringFR;
        if (wheelRL) wheelRL.rotation.y = 0;
        if (wheelRR) wheelRR.rotation.y = 0;

        // Deterministic Arc-Length Wheel Rolling Rotation (stops once parked)
        const totalSplineLength = trajectory.totalLength;
        const effectiveRollT = Math.min(VEHICLE_PARK_T, currentT);
        const traveledDist = effectiveRollT * totalSplineLength;
        const wheelRadius = 0.35;
        const rollAngle = -traveledDist / wheelRadius;

        // Rotate tire, rim, and rotor meshes around wheel pitch axis (X) while keeping brake calipers stationary
        const wheelAssemblies = [wheelFL, wheelFR, wheelRL, wheelRR];
        for (const w of wheelAssemblies) {
          if (!w) continue;
          for (const part of w.children) {
            if (!part.name.includes('Caliper')) {
              part.rotation.x = rollAngle;
            }
          }
        }
      }
      prevT = currentT;

      // Update Stage G.11 Kinetic Architectural Project Pods & Standalone Pavilion
      kineticExhibitions.update(currentT, clock, isReducedMotion);

      // Animate Autonomous Companion Drone with Leading Road-Relative Choreography
      if (droneGroup) {
        for (const rotor of droneRotors) {
          rotor.rotation.y += 0.58;
        }
        updateDroneForProgress(currentT, clock);
      }

      // 6. Adaptive Cinematic Chase Camera Rig (Cyberpunk 2077 Automotive Driving Cam)
      const camTargets = getCameraRigTargetsForT(currentT);

      // Smooth camera parameter interpolation (instant snap when reduced motion or debug hold)
      const camParamLerp = isReducedMotion || debugHoldT !== null ? 1.0 : 0.10;
      currentTrail += (camTargets.trail - currentTrail) * camParamLerp;
      currentHeight += (camTargets.height - currentHeight) * camParamLerp;
      currentLookAhead += (camTargets.lookAhead - currentLookAhead) * camParamLerp;
      currentLateral += (camTargets.lateral - currentLateral) * camParamLerp;
      currentElevation += (camTargets.elevation - currentElevation) * camParamLerp;

      // Update Follow Camera or Custom Inspection Pose
      if (customCameraPose) {
        camera.position.copy(customCameraPose.position);
        camera.lookAt(customCameraPose.lookAt);
      } else if (vehicleGroup) {
        // Attention focus calculation towards approaching roadside displays
        const attention = calculateCinematicAttention(currentT);

        // Dynamic look-ahead extension on curves: look deeper into the bend
        const curveLookAhead = currentLookAhead + absKappa * 35.0;
        // Apex lead + Attention gaze: shifts towards inner apex and focuses on roadside architectural displays
        const apexGazeX = currentLateral + curvature * 3.6 + attention.gazePanX;

        // Camera target position in vehicle local coordinate system with subtle attention shift
        tempCamOffset.set(
          attention.camShiftX,
          currentHeight + attention.elevationShift,
          currentTrail + attention.trailShift
        );
        tempCamOffset.applyQuaternion(vehicleGroup.quaternion);
        const targetCamPos = vehicleGroup.position.clone().add(tempCamOffset);

        // Camera target lookAt in vehicle local coordinate system
        tempLookAtOffset.set(
          apexGazeX,
          0.45 + currentElevation + attention.elevationShift * 0.5,
          -curveLookAhead
        );
        tempLookAtOffset.applyQuaternion(vehicleGroup.quaternion);
        const targetLookAt = vehicleGroup.position.clone().add(tempLookAtOffset);

        if (isReducedMotion || debugHoldT !== null) {
          camera.position.copy(targetCamPos);
        } else {
          camera.position.lerp(targetCamPos, 0.28);
        }

        tempCamUp.set(0, 1, 0).applyQuaternion(vehicleGroup.quaternion);
        camera.up.copy(tempCamUp);
        camera.lookAt(targetLookAt);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resize & Inactive-Tab Suspension Handlers
    const handleResize = (): void => {
      camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
      camera.fov = getResponsiveFov(window.innerWidth, window.innerHeight);
      camera.updateProjectionMatrix();
      applyDevicePixelRatio();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleVisibilityChange = (): void => {
      isDocumentHidden = document.hidden;
      if (isDocumentHidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!isDisposed) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 8. Defensive Cleanup on Unmount (Zero Memory Leaks)
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      if (lockResetTimer) clearTimeout(lockResetTimer);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointercancel', handlePointerCancel);
      renderer.domElement.removeEventListener('pointerleave', handlePointerCancel);

      // Dispose textures & environment
      if (scene.environment) {
        scene.environment.dispose();
      }
      for (const tex of generatedTextures) {
        tex.dispose();
      }

      // Dispose loaders & kinetic exhibition allocations
      kineticExhibitions.dispose();
      droneExtraMats.forEach((m) => m.dispose());
      droneExtraGeos.forEach((g) => g.dispose());
      dracoLoader.dispose();

      // Dispose meshes and materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isReducedMotion]);

  if (loadError) {
    return (
      <div className="fixed top-20 right-4 z-30 p-3 rounded-lg bg-obsidian-900/90 border border-white/10 text-xs font-mono text-titanium-400">
        <p>{loadError}</p>
      </div>
    );
  }

  return <div ref={containerRef} className="fixed inset-0 z-0" />;
};
