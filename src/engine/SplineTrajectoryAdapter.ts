/**
 * @file src/engine/SplineTrajectoryAdapter.ts
 * @description Numerically stable Bishop Parallel Transport Frame (PTF) and quaternion orientation
 * adapter for Three.js spline journeys, camera tracking, and aerodynamic/automotive banking.
 */

import * as THREE from 'three';

export interface SplineTrajectoryOptions {
  readonly divisions?: number;
  readonly reverseZ?: boolean; // True when craft model faces -Z (Three.js standard)
  readonly worldUp?: THREE.Vector3;
}

export interface VehicleOrientationOptions {
  readonly bankFactor?: number;
  readonly maxBankAngle?: number; // In radians
  readonly mouseX?: number; // Normalized mouse X [-1..1]
}

export interface FollowCameraOptions {
  readonly trailDistance?: number;
  readonly heightOffset?: number;
  readonly lookAheadDistance?: number;
  readonly lateralBias?: number;
  readonly elevationBias?: number;
  readonly mouseX?: number;
  readonly lerpFactor?: number;
}

export class MotionEngineError extends Error {
  public readonly code: string;
  public constructor(code: string, message: string) {
    super(`[${code}] ${message}`);
    this.name = 'MotionEngineError';
    this.code = code;
  }
}

export class SplineTrajectoryAdapter {
  public readonly curve: THREE.Curve<THREE.Vector3>;
  public readonly divisions: number;
  public readonly reverseZ: boolean;
  public readonly points: THREE.Vector3[] = [];
  public readonly tangents: THREE.Vector3[] = [];
  public readonly normals: THREE.Vector3[] = []; // Frame Right (R)
  public readonly binormals: THREE.Vector3[] = []; // Frame Up (U)
  public readonly quaternions: THREE.Quaternion[] = [];
  public readonly cumulativeLengths: number[] = [];
  public readonly totalLength: number;

  private readonly rollAxis = new THREE.Vector3(0, 0, -1);
  private readonly tempRollQuat = new THREE.Quaternion();
  private readonly tempCamOffset = new THREE.Vector3();
  private readonly tempLookAt = new THREE.Vector3();
  private readonly tempUp = new THREE.Vector3();

  public constructor(
    curve: THREE.Curve<THREE.Vector3>,
    options: SplineTrajectoryOptions = {}
  ) {
    if (!curve) {
      throw new MotionEngineError(
        'ADAPTER_ERROR',
        'SplineTrajectoryAdapter requires a valid THREE.Curve instance'
      );
    }

    this.curve = curve;
    this.divisions = options.divisions ?? 1000;
    this.reverseZ = options.reverseZ ?? true;

    // 1. Sample points and cumulative chord arc-lengths
    this.cumulativeLengths.push(0);
    for (let i = 0; i <= this.divisions; i++) {
      const u = i / this.divisions;
      const pt = this.curve.getPoint(u);
      this.points.push(pt);
      if (i > 0) {
        const segDist = pt.distanceTo(this.points[i - 1]!);
        this.cumulativeLengths.push(this.cumulativeLengths[i - 1]! + segDist);
      }
    }
    this.totalLength = this.cumulativeLengths[this.cumulativeLengths.length - 1]!;

    // 2. Sample tangents
    for (let i = 0; i <= this.divisions; i++) {
      const u = i / this.divisions;
      const tan = this.curve.getTangent(u).normalize();
      this.tangents.push(tan);
    }

    // 3. Establish initial reference frame at node 0
    const t0 = this.tangents[0]!;
    let initialUp = options.worldUp ? options.worldUp.clone().normalize() : new THREE.Vector3(0, 1, 0);

    // If initial tangent is parallel to initialUp, choose alternate axis
    if (Math.abs(t0.dot(initialUp)) > 0.9) {
      initialUp = new THREE.Vector3(0, 0, 1);
    }

    // Right R0 = normalize(T0 x Up)
    const r0 = new THREE.Vector3().crossVectors(t0, initialUp).normalize();
    // Up U0 = normalize(R0 x (-T0))
    const negT0 = t0.clone().negate();
    const u0 = new THREE.Vector3().crossVectors(negT0, r0).normalize();

    this.normals.push(r0.clone());
    this.binormals.push(u0.clone());

    // Basis matrix col0=R, col1=U, col2=-T (if model faces -Z) or +T
    const forwardCol = this.reverseZ ? negT0 : t0;
    const rightCol0 = this.reverseZ ? r0 : r0.clone().negate();
    const m0 = new THREE.Matrix4().makeBasis(rightCol0, u0, forwardCol);
    const q0 = new THREE.Quaternion().setFromRotationMatrix(m0);
    this.quaternions.push(q0);

    // 4. Step-by-step parallel transport propagation
    let curR = r0.clone();
    let curU = u0.clone();

    for (let i = 0; i < this.divisions; i++) {
      const tA = this.tangents[i]!;
      const tB = this.tangents[i + 1]!;

      // Rotation axis between consecutive tangents
      const axis = new THREE.Vector3().crossVectors(tA, tB);
      const axisLen = axis.length();

      if (axisLen > 1e-7) {
        axis.divideScalar(axisLen);
        const dot = THREE.MathUtils.clamp(tA.dot(tB), -1, 1);
        const angle = Math.acos(dot);
        const qDelta = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        curR.applyQuaternion(qDelta).normalize();
        curU.applyQuaternion(qDelta).normalize();
      }

      this.normals.push(curR.clone());
      this.binormals.push(curU.clone());

      const forwardVec = this.reverseZ ? tB.clone().negate() : tB;
      const rightCol = this.reverseZ ? curR : curR.clone().negate();
      const m = new THREE.Matrix4().makeBasis(rightCol, curU, forwardVec);
      const q = new THREE.Quaternion().setFromRotationMatrix(m);
      this.quaternions.push(q);
    }
  }

  /**
   * Evaluates and returns the complete trajectory frame at progress t.
   */
  public getFrameAt(progress: number): {
    position: THREE.Vector3;
    tangent: THREE.Vector3;
    normal: THREE.Vector3;
    binormal: THREE.Vector3;
    quaternion: THREE.Quaternion;
  } {
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const tan = new THREE.Vector3();
    const up = new THREE.Vector3();
    const right = new THREE.Vector3();
    this.evaluate(progress, pos, quat, tan, up, right);
    return {
      position: pos,
      tangent: tan,
      normal: right,
      binormal: up,
      quaternion: quat,
    };
  }

  /**
   * Evaluates the trajectory frame at normalized progress t in [0, 1].
   * Uses spherical linear interpolation (SLERP) on precomputed Bishop quaternions.
   */
  public evaluate(
    progress: number,
    outPosition: THREE.Vector3,
    outQuaternion: THREE.Quaternion,
    outTangent: THREE.Vector3,
    outUp?: THREE.Vector3,
    outRight?: THREE.Vector3
  ): void {
    const clampedT = THREE.MathUtils.clamp(progress, 0, 1);
    const floatIdx = clampedT * this.divisions;
    const idx = Math.min(Math.floor(floatIdx), this.divisions - 1);
    const alpha = floatIdx - idx;

    outPosition.lerpVectors(this.points[idx]!, this.points[idx + 1]!, alpha);
    outTangent.lerpVectors(this.tangents[idx]!, this.tangents[idx + 1]!, alpha).normalize();
    outQuaternion.copy(this.quaternions[idx]!).slerp(this.quaternions[idx + 1]!, alpha);

    if (outUp) {
      outUp.set(0, 1, 0).applyQuaternion(outQuaternion);
    }
    if (outRight) {
      outRight.set(1, 0, 0).applyQuaternion(outQuaternion);
    }
  }

  /**
   * Calculates lateral turning curvature to derive natural vehicle banking angle.
   */
  public getCurvature(progress: number): number {
    const clampedT = THREE.MathUtils.clamp(progress, 0, 1);
    const floatIdx = clampedT * this.divisions;
    const idx = Math.min(Math.floor(floatIdx), this.divisions - 1);
    const tA = this.tangents[idx]!;
    const tB = this.tangents[Math.min(idx + 1, this.divisions)]!;
    const cross = new THREE.Vector3().crossVectors(tA, tB);
    const dist = this.points[idx]!.distanceTo(this.points[Math.min(idx + 1, this.divisions)]!) || 1e-4;
    return cross.y / dist;
  }

  /**
   * Updates an Object3D's world position and orientation along the trajectory,
   * applying lateral banking into turns.
   */
  public updateObject(
    object: THREE.Object3D,
    progress: number,
    options: VehicleOrientationOptions = {}
  ): void {
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const tan = new THREE.Vector3();

    this.evaluate(progress, pos, quat, tan);
    object.position.copy(pos);

    const bankFactor = options.bankFactor ?? 4.0;
    const maxBank = options.maxBankAngle ?? 0.65;
    const mouseX = options.mouseX ?? 0;

    const curvature = this.getCurvature(progress);
    const bankAngle = THREE.MathUtils.clamp(
      -curvature * bankFactor - mouseX * 0.2,
      -maxBank,
      maxBank
    );

    this.tempRollQuat.setFromAxisAngle(this.rollAxis, bankAngle);
    object.quaternion.copy(quat).multiply(this.tempRollQuat);
  }

  /**
   * Alias for updateObject adhering to vehicle orientation semantics.
   */
  public applyVehicleOrientation(
    object: THREE.Object3D,
    progress: number,
    options: VehicleOrientationOptions = {}
  ): void {
    this.updateObject(object, progress, options);
  }

  /**
   * Updates a camera rig to follow a craft along the trajectory using local offset vectors.
   */
  public updateCamera(
    camera: THREE.Camera,
    craftPosition: THREE.Vector3,
    craftQuaternion: THREE.Quaternion,
    options: FollowCameraOptions = {}
  ): void {
    const trailDist = options.trailDistance ?? 3.8;
    const heightOffset = options.heightOffset ?? 1.6;
    const lookAhead = options.lookAheadDistance ?? 7.5;
    const mouseX = options.mouseX ?? 0;
    const lateralBias = options.lateralBias ?? 0;
    const elevationBias = options.elevationBias ?? 0;
    const lerpFactor = options.lerpFactor ?? 0.14;

    // Target Camera Position in local craft coordinates
    this.tempCamOffset.set(mouseX * 0.35, heightOffset, trailDist);
    this.tempCamOffset.applyQuaternion(craftQuaternion);
    const targetCamPos = craftPosition.clone().add(this.tempCamOffset);

    if (lerpFactor >= 1.0) {
      camera.position.copy(targetCamPos);
    } else {
      camera.position.lerp(targetCamPos, lerpFactor);
    }

    // Target LookAt in local craft coordinates
    this.tempLookAt.set(lateralBias, 0.35 + elevationBias, -lookAhead);
    this.tempLookAt.applyQuaternion(craftQuaternion);
    const targetLookAt = craftPosition.clone().add(this.tempLookAt);

    this.tempUp.set(0, 1, 0).applyQuaternion(craftQuaternion);
    camera.up.copy(this.tempUp);
    camera.lookAt(targetLookAt);
  }
}
