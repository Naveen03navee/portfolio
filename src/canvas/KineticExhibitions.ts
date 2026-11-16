/**
 * @file clients/portfolio/src/canvas/KineticExhibitions.ts
 * @description Stage G.11 Kinetic Architectural Project Exhibition Pods & Standalone Corporate Pavilion.
 * Replaces static roadside project/internship billboards with five purpose-built exhibition installations
 * positioned from the authoritative road spline (75–85m separation inside urban alcoves):
 *   1. J.A.R.V.I.S. — AI Command Centre (tPod = 0.486, Right)
 *   2. Biometric Event Gallery — Biometric Experience Portal (tPod = 0.556, Left)
 *   3. Smart QR Attendance — Identity & Spatial Security Gate (tPod = 0.625, Right)
 *   4. Multi-Engine Doc Intel — Document Intelligence Archive (tPod = 0.692, Left)
 *   5. Decembay Technologies — Corporate Engineering Pavilion (tPod = 0.766, Right)
 *
 * Each project pod deploys smoothly in five deterministic scroll-driven phases (approach, deploy,
 * presentation, retract) so only one exhibition commands foreground attention at a time, works
 * identically forward/reverse/direct-jump, and keeps roadway corridors & buildings completely clear.
 */

import * as THREE from 'three';
import type { SplineTrajectoryAdapter } from '../engine/SplineTrajectoryAdapter.js';
import { projectLinks } from '../data/project-links.js';

export type ExhibitionPhase = 'stowed' | 'approach' | 'deploy' | 'active' | 'retract';

export interface ExhibitionSpec {
  readonly id: string;
  readonly meshName: string;
  readonly structureName: string;
  readonly isProject: boolean;
  readonly projectId?: string;
  readonly side: 'left' | 'right';
  readonly tPod: number;
  readonly lateralOffsetM: number;
  readonly tWindowStart: number;
  readonly tDeployComplete: number;
  readonly tPeak: number;
  readonly tRetractStart: number;
  readonly tWindowEnd: number;
  readonly accentHex: number;
  readonly screenWidthM: number;
  readonly screenHeightM: number;
}

export interface ExhibitionRuntimeState {
  readonly id: string;
  readonly meshName: string;
  readonly phase: ExhibitionPhase;
  readonly deployFactor: number;
  readonly routeDistanceM: number;
  readonly lateralOffsetM: number;
}

/**
 * Authoritative Stage G.11 exhibition bay sequence along the 1,119.36m spline route.
 * Centre-to-centre distances cleanly sit inside the 75–85m exhibition rhythm within
 * cleared sidewalk plaza bays (zero roadway intrusion, zero pole/tree/building overlaps).
 */
export const EXHIBITION_SPECS: readonly ExhibitionSpec[] = [
  {
    id: 'jarvis',
    meshName: 'Display_Project_Jarvis',
    structureName: 'Pod_Jarvis_Command_Centre',
    isProject: true,
    projectId: 'jarvis',
    side: 'right',
    tPod: 0.486,
    lateralOffsetM: 12.6,
    tWindowStart: 0.446,
    tDeployComplete: 0.460,
    tPeak: 0.469,
    tRetractStart: 0.484,
    tWindowEnd: 0.500,
    accentHex: 0x00f0ff,
    screenWidthM: 11.2,
    screenHeightM: 6.2,
  },
  {
    id: 'biometric-event-gallery',
    meshName: 'Display_Project_Biometric',
    structureName: 'Pod_Biometric_Portal',
    isProject: true,
    projectId: 'biometric-event-gallery',
    side: 'left',
    tPod: 0.556,
    lateralOffsetM: -12.6,
    tWindowStart: 0.514,
    tDeployComplete: 0.529,
    tPeak: 0.539,
    tRetractStart: 0.554,
    tWindowEnd: 0.570,
    accentHex: 0xd946ef,
    screenWidthM: 11.2,
    screenHeightM: 6.2,
  },
  {
    id: 'smart-qr-attendance',
    meshName: 'Display_Project_SmartQR',
    structureName: 'Pod_SmartQR_Security_Gate',
    isProject: true,
    projectId: 'smart-qr-attendance',
    side: 'right',
    tPod: 0.625,
    lateralOffsetM: 12.6,
    tWindowStart: 0.583,
    tDeployComplete: 0.598,
    tPeak: 0.608,
    tRetractStart: 0.623,
    tWindowEnd: 0.639,
    accentHex: 0x10b981,
    screenWidthM: 11.2,
    screenHeightM: 6.2,
  },
  {
    id: 'multi-engine-doc-intel',
    meshName: 'Display_Project_DocIntel',
    structureName: 'Pod_DocIntel_Archive',
    isProject: true,
    projectId: 'multi-engine-doc-intel',
    side: 'left',
    tPod: 0.692,
    lateralOffsetM: -12.6,
    tWindowStart: 0.650,
    tDeployComplete: 0.665,
    tPeak: 0.675,
    tRetractStart: 0.690,
    tWindowEnd: 0.706,
    accentHex: 0xf5a623,
    screenWidthM: 11.2,
    screenHeightM: 6.2,
  },
  {
    id: 'decembay-internship',
    meshName: 'Display_Decembay_Timeline',
    structureName: 'Pavilion_Decembay_Corporate',
    isProject: false,
    side: 'right',
    tPod: 0.766,
    lateralOffsetM: 13.0,
    tWindowStart: 0.718,
    tDeployComplete: 0.734,
    tPeak: 0.747,
    tRetractStart: 0.768,
    tWindowEnd: 0.788,
    accentHex: 0x2dd4bf,
    screenWidthM: 11.4,
    screenHeightM: 6.3,
  },
];

function smoothstep(edge0: number, edge1: number, x: number): number {
  const denom = Math.max(1e-5, edge1 - edge0);
  const t = Math.max(0, Math.min(1, (x - edge0) / denom));
  return t * t * (3 - 2 * t);
}

export function evaluateExhibitionActivation(
  spec: ExhibitionSpec,
  t: number
): { phase: ExhibitionPhase; deployFactor: number } {
  if (t <= spec.tWindowStart || t >= spec.tWindowEnd) {
    return { phase: 'stowed', deployFactor: 0 };
  }
  if (t < spec.tDeployComplete) {
    const k = smoothstep(spec.tWindowStart, spec.tDeployComplete, t);
    return {
      phase: k < 0.25 ? 'approach' : 'deploy',
      deployFactor: k,
    };
  }
  if (t <= spec.tRetractStart) {
    return { phase: 'active', deployFactor: 1 };
  }
  const rem = 1 - smoothstep(spec.tRetractStart, spec.tWindowEnd, t);
  return { phase: 'retract', deployFactor: rem };
}

interface PodInstance {
  readonly spec: ExhibitionSpec;
  readonly rootGroup: THREE.Group;
  readonly liftRig: THREE.Group;
  readonly swivelRig: THREE.Group;
  readonly displayMesh: THREE.Mesh;
  readonly beaconMat: THREE.MeshStandardMaterial;
  readonly motifMeshes: THREE.Object3D[];
  readonly motifAnimators: Array<(deploy: number, clockSec: number) => void>;
  currentPhase: ExhibitionPhase;
  currentDeploy: number;
}

export interface KineticExhibitionSystem {
  readonly group: THREE.Group;
  readonly interactiveScreenMeshes: readonly THREE.Mesh[];
  readonly allDisplayMeshes: readonly THREE.Mesh[];
  update: (t: number, clockSec: number, isReducedMotion: boolean) => void;
  getStates: () => ExhibitionRuntimeState[];
  dispose: () => void;
}

export function createKineticExhibitionSystem(
  trajectory: SplineTrajectoryAdapter,
  texturesByMeshName: Readonly<Record<string, THREE.Texture>>
): KineticExhibitionSystem {
  const root = new THREE.Group();
  root.name = 'Kinetic_Project_Exhibitions_Group';

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const darkChassisMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0f1623,
      metalness: 0.72,
      roughness: 0.28,
    })
  );
  const concretePlinthMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1c2432,
      metalness: 0.22,
      roughness: 0.78,
    })
  );
  const gunmetalStrutMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x2a3444,
      metalness: 0.85,
      roughness: 0.22,
    })
  );

  const pods: PodInstance[] = [];
  const interactiveScreenMeshes: THREE.Mesh[] = [];
  const allDisplayMeshes: THREE.Mesh[] = [];

  for (const spec of EXHIBITION_SPECS) {
    const frame = trajectory.getFrameAt(spec.tPod);
    const rightVec = new THREE.Vector3(1, 0, 0).applyQuaternion(frame.quaternion).normalize();
    const basePos = frame.position.clone().addScaledVector(rightVec, spec.lateralOffsetM);

    const podRoot = new THREE.Group();
    podRoot.name = spec.structureName;
    podRoot.position.copy(basePos);
    podRoot.quaternion.copy(frame.quaternion);

    const beaconMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: spec.accentHex,
        emissive: new THREE.Color(spec.accentHex),
        emissiveIntensity: 0.35,
        metalness: 0.4,
        roughness: 0.2,
      })
    );

    // 1. Grounded Architectural Foundation Plaza (seats flush below & above sidewalk level)
    const plinth = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.6, 0.55, 5.2)), concretePlinthMat);
    plinth.position.set(0, 0.18, 0);
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    podRoot.add(plinth);

    const plinthTrim = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(4.72, 0.1, 5.32)),
      beaconMat
    );
    plinthTrim.position.set(0, 0.44, 0);
    podRoot.add(plinthTrim);

    // Central telescopic architectural pedestal anchored on concrete plinth (terminates cleanly into bottom gimbal under bezel)
    const liftRig = new THREE.Group();
    liftRig.name = `${spec.id}_LiftRig`;
    podRoot.add(liftRig);

    const outerColumn = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.42, 0.54, 0.95, 12)),
      gunmetalStrutMat
    );
    outerColumn.position.set(0, 0.85, 0);
    outerColumn.castShadow = true;
    podRoot.add(outerColumn);

    const innerPiston = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.28, 0.32, 1.05, 12)),
      gunmetalStrutMat
    );
    innerPiston.position.set(0, 0.95, 0);
    innerPiston.castShadow = true;
    liftRig.add(innerPiston);

    // Swivel Gimbal turning ~16° towards oncoming vehicle/camera on deployment
    const swivelRig = new THREE.Group();
    swivelRig.name = `${spec.id}_SwivelRig`;
    swivelRig.position.set(0, 4.65, 0);
    liftRig.add(swivelRig);

    const w = spec.screenWidthM;
    const h = spec.screenHeightM;
    const gimbalCollar = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(2.2, 0.38, 0.62)),
      gunmetalStrutMat
    );
    gimbalCollar.position.set(0, -h * 0.5 - 0.32, -0.06);
    swivelRig.add(gimbalCollar);

    // Screen Chassis Backing + Illuminated Frame Borders (keeps screen strictly enclosed within support)
    const frameBack = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(w + 0.42, h + 0.42, 0.26)),
      darkChassisMat
    );
    frameBack.position.set(0, 0, -0.14);
    frameBack.castShadow = true;
    frameBack.receiveShadow = true;
    swivelRig.add(frameBack);

    const topBezel = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(w + 0.5, 0.12, 0.34)),
      beaconMat
    );
    topBezel.position.set(0, h * 0.5 + 0.16, -0.08);
    swivelRig.add(topBezel);

    const botBezel = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(w + 0.5, 0.12, 0.34)),
      beaconMat
    );
    botBezel.position.set(0, -h * 0.5 - 0.16, -0.08);
    swivelRig.add(botBezel);

    // Clickable High-Resolution Exhibition Screen Mesh
    const tex = texturesByMeshName[spec.meshName];
    const displayMat = trackMat(
      new THREE.MeshBasicMaterial({
        map: tex ?? null,
        color: tex ? 0xffffff : 0x111a2b,
        side: THREE.FrontSide,
        toneMapped: false,
      })
    );
    // Flip PlaneGeometry V coordinate to match BillboardTextures GLTF upright orientation
    const displayPlaneGeo = trackGeo(new THREE.PlaneGeometry(w, h));
    const uvAttr = displayPlaneGeo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setY(i, 1 - uvAttr.getY(i));
    }
    uvAttr.needsUpdate = true;

    const displayMesh = new THREE.Mesh(displayPlaneGeo, displayMat);
    displayMesh.name = spec.meshName;
    displayMesh.position.set(0, 0, 0.02);

    if (spec.isProject && spec.projectId) {
      const linkCfg = projectLinks.find((p) => p.id === spec.projectId);
      displayMesh.userData.projectId = linkCfg?.id ?? spec.projectId;
      displayMesh.userData.interactiveBillboard = true;
      interactiveScreenMeshes.push(displayMesh);
    }
    allDisplayMeshes.push(displayMesh);
    swivelRig.add(displayMesh);

    const motifMeshes: THREE.Object3D[] = [];
    const motifAnimators: Array<(deploy: number, clockSec: number) => void> = [];

    // 2. Project-Specific Distinct Architectural & Kinetic Motifs (Section 5 & Section 10)
    if (spec.id === 'jarvis') {
      // J.A.R.V.I.S. — AI COMMAND CENTRE: Faceted glass pedestal collar + Arc-Reactor rings + 9-bar voice waveform
      const facetedGlass = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(2.1, 2.55, 0.72, 8)),
        trackMat(
          new THREE.MeshPhysicalMaterial({
            color: 0x0ea5e9,
            transparent: true,
            opacity: 0.34,
            roughness: 0.08,
            metalness: 0.15,
            transmission: 0.4,
          })
        )
      );
      facetedGlass.position.set(0, 0.78, 0);
      podRoot.add(facetedGlass);

      const reactorGroup = new THREE.Group();
      reactorGroup.position.set(-w * 0.5 - 1.05, 0.1, 0.15);
      swivelRig.add(reactorGroup);

      const outerRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.95, 0.06, 12, 36)),
        beaconMat
      );
      const innerRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.58, 0.045, 10, 28)),
        beaconMat
      );
      const coreOrb = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.26, 1)), beaconMat);
      reactorGroup.add(outerRing, innerRing, coreOrb);
      motifMeshes.push(outerRing, innerRing, coreOrb);

      const waveBars: THREE.Mesh[] = [];
      for (let b = 0; b < 9; b++) {
        const bar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.18, 0.85, 0.12)), beaconMat);
        bar.position.set(-w * 0.32 + b * 0.42, -h * 0.5 - 0.65, 0.05);
        swivelRig.add(bar);
        waveBars.push(bar);
      }

      motifAnimators.push((deploy, tSec) => {
        reactorGroup.scale.setScalar(0.35 + deploy * 0.65);
        outerRing.rotation.z = tSec * 1.1;
        innerRing.rotation.z = -tSec * 1.8;
        coreOrb.rotation.y = tSec * 2.2;
        waveBars.forEach((bar, i) => {
          const amp = deploy * (0.35 + 0.65 * Math.abs(Math.sin(tSec * 4.5 + i * 0.65)));
          bar.scale.y = Math.max(0.15, amp);
        });
      });
    } else if (spec.id === 'biometric-event-gallery') {
      // BIOMETRIC EVENT GALLERY — Sculptural chevron portal + 4 layered image tiles + sweeping laser scan line
      const leftArch = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.32, h + 1.1, 0.42)),
        gunmetalStrutMat
      );
      leftArch.position.set(-w * 0.5 - 0.45, 0.15, -0.05);
      swivelRig.add(leftArch);

      const tilesGroup = new THREE.Group();
      tilesGroup.position.set(w * 0.5 + 0.85, 0.1, 0.08);
      swivelRig.add(tilesGroup);

      const tiles: THREE.Mesh[] = [];
      for (let idx = 0; idx < 4; idx++) {
        const tileMat = trackMat(
          new THREE.MeshStandardMaterial({
            color: 0x261a38,
            emissive: new THREE.Color(spec.accentHex),
            emissiveIntensity: 0.45,
            roughness: 0.25,
            metalness: 0.5,
          })
        );
        const tile = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.15, 0.78, 0.08)), tileMat);
        tile.position.set(0, (1.5 - idx) * 1.05, idx * 0.12);
        tilesGroup.add(tile);
        tiles.push(tile);
      }

      const scanBar = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(w * 0.92, 0.07, 0.05)),
        beaconMat
      );
      scanBar.name = 'Decorative_Biometric_ScanBar';
      scanBar.raycast = () => undefined;
      scanBar.position.set(0, 0, 0.06);
      swivelRig.add(scanBar);

      motifAnimators.push((deploy, tSec) => {
        tilesGroup.scale.setScalar(0.35 + deploy * 0.65);
        tiles.forEach((tile, i) => {
          tile.position.x = Math.sin(tSec * 1.8 + i * 0.9) * 0.18 * deploy;
        });
        scanBar.visible = deploy > 0.2;
        scanBar.position.y = Math.sin(tSec * 2.2) * (h * 0.42);
      });
    } else if (spec.id === 'smart-qr-attendance') {
      // SMART QR ATTENDANCE — Architectural circular security ring + counter-rotating geofence radar + QR voxels
      const portalRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(2.35, 0.12, 14, 48)),
        beaconMat
      );
      portalRing.position.set(-w * 0.5 - 0.55, 0.1, -0.2);
      swivelRig.add(portalRing);

      const scanHalo = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(1.75, 0.055, 10, 40)),
        beaconMat
      );
      scanHalo.position.copy(portalRing.position);
      swivelRig.add(scanHalo);

      // Compact 3D geometric QR block cluster mounted neatly on plaza plinth in front-right bay corner
      const qrCluster = new THREE.Group();
      qrCluster.position.set(-1.35, 0.75, 1.55);
      podRoot.add(qrCluster);
      const pattern = [1, 0, 1, 1, 1, 0, 1, 1, 1];
      const qrVoxels: THREE.Mesh[] = [];
      pattern.forEach((on, idx) => {
        if (!on) return;
        const r = Math.floor(idx / 3);
        const c = idx % 3;
        const vox = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.36, 0.36, 0.36)), beaconMat);
        vox.position.set((c - 1) * 0.48, r * 0.48, 0);
        qrCluster.add(vox);
        qrVoxels.push(vox);
      });

      motifAnimators.push((deploy, tSec) => {
        portalRing.scale.setScalar(0.4 + deploy * 0.6);
        scanHalo.scale.setScalar(0.4 + deploy * 0.6);
        portalRing.rotation.z = tSec * 0.65;
        scanHalo.rotation.z = -tSec * 1.25;
        qrCluster.rotation.y = tSec * 0.85;
        qrVoxels.forEach((v, idx) => {
          v.scale.setScalar(0.6 + 0.4 * deploy + Math.sin(tSec * 3.0 + idx) * 0.08 * deploy);
        });
      });
    } else if (spec.id === 'multi-engine-doc-intel') {
      // MULTI-ENGINE DOCUMENT INTELLIGENCE — Stepped monolith archive + floating document slabs + amber extraction pulses
      const fanGroup = new THREE.Group();
      fanGroup.position.set(w * 0.5 + 0.85, 0.1, 0.12);
      swivelRig.add(fanGroup);

      const pages: THREE.Mesh[] = [];
      for (let i = 0; i < 4; i++) {
        const pageMat = trackMat(
          new THREE.MeshStandardMaterial({
            color: 0x292114,
            emissive: new THREE.Color(spec.accentHex),
            emissiveIntensity: 0.42,
            roughness: 0.35,
            metalness: 0.35,
          })
        );
        const slab = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.95, 1.25, 0.06)), pageMat);
        slab.position.set(0, (i - 1.5) * 1.15, i * 0.14);
        slab.rotation.y = -0.25 + i * 0.1;
        fanGroup.add(slab);
        pages.push(slab);
      }

      const conduitNodes: THREE.Mesh[] = [];
      for (let n = 0; n < 4; n++) {
        const node = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 0.24, 0.24)), beaconMat);
        node.position.set(-w * 0.5 - 0.55, -h * 0.35 + n * 0.9, 0.1);
        swivelRig.add(node);
        conduitNodes.push(node);
      }

      motifAnimators.push((deploy, tSec) => {
        fanGroup.scale.setScalar(0.38 + deploy * 0.62);
        pages.forEach((p, idx) => {
          p.position.y = (idx - 1.5) * 1.15 + Math.sin(tSec * 2.0 + idx * 0.8) * 0.18 * deploy;
        });
        conduitNodes.forEach((node, idx) => {
          const pulse = (Math.sin(tSec * 3.5 - idx * 1.1) * 0.5 + 0.5) * deploy;
          node.scale.setScalar(0.65 + pulse * 0.65);
        });
      });
    } else {
      // DECEMBAY TECHNOLOGIES — Dedicated Free-Standing Corporate Engineering Pavilion (Section 10)
      // Align twin rear structural steel buttresses with pavilion screen angle and ground onto plinth
      const rearSupportGroup = new THREE.Group();
      rearSupportGroup.rotation.y = spec.side === 'right' ? -0.74 : 0.74;
      podRoot.add(rearSupportGroup);

      const rearTieBeam = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(w * 0.76, 0.36, 0.55)),
        concretePlinthMat
      );
      rearTieBeam.position.set(0, 0.24, -1.65);
      rearTieBeam.castShadow = true;
      rearTieBeam.receiveShadow = true;
      rearSupportGroup.add(rearTieBeam);

      for (const xLeg of [-w * 0.32, w * 0.32]) {
        const buttress = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.42, 4.9, 0.42)),
          gunmetalStrutMat
        );
        buttress.position.set(xLeg, 2.55, -0.92);
        buttress.rotation.x = 0.31;
        buttress.castShadow = true;
        rearSupportGroup.add(buttress);
      }
      const headerCrown = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(w * 0.45, 0.18, 0.3)),
        beaconMat
      );
      headerCrown.position.set(0, h * 0.5 + 0.42, -0.05);
      swivelRig.add(headerCrown);
    }

    root.add(podRoot);
    pods.push({
      spec,
      rootGroup: podRoot,
      liftRig,
      swivelRig,
      displayMesh,
      beaconMat,
      motifMeshes,
      motifAnimators,
      currentPhase: 'stowed',
      currentDeploy: 0,
    });
  }

  const update = (t: number, clockSec: number, _isReducedMotion: boolean): void => {
    for (const pod of pods) {
      const { spec } = pod;
      const { phase, deployFactor } = evaluateExhibitionActivation(spec, t);
      pod.currentPhase = phase;
      pod.currentDeploy = deployFactor;

      // Decembay pavilion stays grounded & proudly upright cleanly throughout approach/departure;
      // the 4 Project Exhibition Pods deploy mechanically (vertical rise, unfold, 16 deg turn toward car)
      const isCorporate = !spec.isProject;
      const effDeploy = isCorporate ? 0.55 + 0.45 * deployFactor : deployFactor;

      // 1. Vertical Rise (stowed low in architectural cradle -> elevated presentation stage)
      pod.liftRig.position.y = isCorporate ? 0.25 : -1.55 + effDeploy * 1.95;

      // 2. Display Panel Unfold / Extension (retracted scale -> full architectural 9.8 x 4.9m exhibition screen)
      const scaleXY = isCorporate ? 0.94 + effDeploy * 0.06 : 0.66 + effDeploy * 0.34;
      pod.swivelRig.scale.set(scaleXY, scaleXY, 1);

      // 3. Controlled 16-degree swivel inward toward the approaching chase camera
      const sign = spec.side === 'right' ? -1 : 1;
      const stowedYaw = sign * 1.02; // ~58 deg off perpendicular (tucked alongside sidewalk)
      const activeYaw = sign * 0.74; // ~42 deg off perpendicular (turned 16 deg toward approaching camera)
      pod.swivelRig.rotation.y = THREE.MathUtils.lerp(stowedYaw, activeYaw, effDeploy);

      // 4. Beacon illumination response
      pod.beaconMat.emissiveIntensity = 0.25 + effDeploy * 1.35;

      // 5. Project-specific kinetic architectural motif updates
      for (const animFn of pod.motifAnimators) {
        animFn(effDeploy, clockSec);
      }
    }
  };

  // Initialize cleanly at t=0.01
  update(0.01, 0, false);

  const getStates = (): ExhibitionRuntimeState[] =>
    pods.map((p) => ({
      id: p.spec.id,
      meshName: p.spec.meshName,
      phase: p.currentPhase,
      deployFactor: +p.currentDeploy.toFixed(3),
      routeDistanceM: +(p.spec.tPod * trajectory.totalLength).toFixed(2),
      lateralOffsetM: p.spec.lateralOffsetM,
    }));

  const dispose = (): void => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
  };

  return {
    group: root,
    interactiveScreenMeshes,
    allDisplayMeshes,
    update,
    getStates,
    dispose,
  };
}
