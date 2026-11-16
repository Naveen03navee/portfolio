/**
 * @file clients/portfolio/src/services/project-health-monitor.ts
 * @description Centralized bounded health monitoring and Render free-tier wake-up service.
 * Enforces strict CORS verification: NEVER treats an opaque `no-cors` response as proof of HTTP 200.
 * Distinguishes confirmed healthy (`active`), waking/CORS-unconfirmed (`waking` / `unconfirmed`),
 * and confirmed failure/timeout (`failed`) without aggressive keep-alive polling.
 */

import { useEffect, useState } from 'react';
import { projectLinks, type ProjectLinks } from '../data/project-links.js';

export type HealthState = 'waking' | 'unconfirmed' | 'active' | 'failed';

export interface ProjectHealthInfo {
  readonly id: string;
  readonly status: HealthState;
  readonly lastChecked: number | null;
  readonly httpStatus?: number;
  readonly healthConfirmed: boolean;
  readonly wakeInitiated: boolean;
  readonly attemptsCount: number;
}

export interface HealthMonitorOptions {
  readonly fetchImpl?: typeof fetch;
  readonly renderRetryDelaysMs?: readonly number[];
  readonly perAttemptTimeoutMs?: number;
  readonly maxRenderDurationMs?: number;
}

type HealthListener = (states: ReadonlyMap<string, ProjectHealthInfo>) => void;

interface HealthPayloadShape {
  readonly status?: unknown;
  readonly ok?: unknown;
}

function isHealthyJsonPayload(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false;
  const payload = data as HealthPayloadShape;
  if (typeof payload.status === 'string') {
    const normalized = payload.status.toLowerCase();
    if (normalized === 'healthy' || normalized === 'ok' || normalized === 'up') {
      return true;
    }
    if (normalized === 'unhealthy' || normalized === 'error' || normalized === 'down') {
      return false;
    }
  }
  return payload.ok === true;
}

function sleepWithAbort(ms: number, signal: AbortSignal): Promise<boolean> {
  if (ms <= 0) return Promise.resolve(!signal.aborted);
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve(false);
      return;
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve(true);
    }, ms);
    const onAbort = (): void => {
      clearTimeout(timer);
      resolve(false);
    };
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

export class ProjectHealthMonitorService {
  private readonly states = new Map<string, ProjectHealthInfo>();
  private readonly listeners = new Set<HealthListener>();
  private readonly abortControllers = new Map<string, AbortController>();
  private readonly initiatedProjectIds = new Set<string>();
  private readonly fetchImpl: typeof fetch;
  private readonly renderRetryDelaysMs: readonly number[];
  private readonly perAttemptTimeoutMs: number;
  private readonly maxRenderDurationMs: number;
  private isInitialized = false;

    constructor(options: HealthMonitorOptions = {}) {
      this.fetchImpl = options.fetchImpl ?? ((...args) => fetch(...args));
      this.renderRetryDelaysMs = options.renderRetryDelaysMs ?? [0, 15_000, 30_000];
      this.perAttemptTimeoutMs = options.perAttemptTimeoutMs ?? 12_000;
      this.maxRenderDurationMs = options.maxRenderDurationMs ?? 65_000;

      for (const project of projectLinks) {
        this.states.set(project.id, {
          id: project.id,
          status: 'waking',
          lastChecked: null,
          healthConfirmed: false,
          wakeInitiated: false,
          attemptsCount: 0,
        });
      }
    }

  /**
   * Starts non-blocking health/wake-up routines once per session.
   */
  public initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    for (const project of projectLinks) {
      if (!this.initiatedProjectIds.has(project.id)) {
        this.initiatedProjectIds.add(project.id);
        void this.startHealthCheckRoutine(project);
      }
    }
  }

  public subscribe(listener: HealthListener): () => void {
    this.listeners.add(listener);
    listener(new Map(this.states));
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getStatus(projectId: string): HealthState {
    const info = this.getInfo(projectId);
    return info?.status ?? 'waking';
  }

  public getInfo(projectId: string): ProjectHealthInfo | undefined {
    const norm = projectId.toLowerCase().replace(/[-_\s]/g, '');
    for (const [id, info] of this.states.entries()) {
        const normId = id.toLowerCase().replace(/[-_\s]/g, '');
        if (normId === norm || normId.includes(norm) || norm.includes(normId)) {
          return info;
        }
      }
      return undefined;
    }

  public recheckProject(projectId: string): void {
    const project = projectLinks.find((p) => {
      const pNorm = p.id.toLowerCase().replace(/[-_\s]/g, '');
      const qNorm = projectId.toLowerCase().replace(/[-_\s]/g, '');
      return pNorm === qNorm || pNorm.includes(qNorm) || qNorm.includes(pNorm);
    });
    if (!project) return;
    this.abortControllers.get(project.id)?.abort();
    this.updateState(project.id, {
      status: 'waking',
      healthConfirmed: false,
      wakeInitiated: false,
    });
    void this.startHealthCheckRoutine(project);
  }

  private updateState(
      projectId: string,
      patch: Partial<Omit<ProjectHealthInfo, 'id'>>
    ): void {
    const prev = this.states.get(projectId) ?? {
      id: projectId,
      status: 'waking' as HealthState,
      lastChecked: null,
      healthConfirmed: false,
      wakeInitiated: false,
      attemptsCount: 0,
    };

    this.states.set(projectId, {
      ...prev,
      ...patch,
      id: projectId,
      lastChecked: Date.now(),
    });

    const snapshot = new Map(this.states);
    for (const listener of this.listeners) {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('[ProjectHealthMonitor] Listener failure:', err);
      }
    }
  }

  private createAttemptSignal(instanceSignal: AbortSignal): AbortSignal {
    const timeoutSignal = AbortSignal.timeout(this.perAttemptTimeoutMs);
    return AbortSignal.any
      ? AbortSignal.any([instanceSignal, timeoutSignal])
      : timeoutSignal;
  }

  private async probeCorsHealth(
    project: ProjectLinks,
    signal: AbortSignal
  ): Promise<
    | { outcome: 'active'; httpStatus: number }
    | { outcome: 'retry-waking'; httpStatus?: number }
    | { outcome: 'failed'; httpStatus?: number }
    | { outcome: 'cors-or-network-error' }
  > {
    const targetUrl = project.healthUrl || project.liveUrl;
    const response = await this.fetchImpl(targetUrl, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'omit',
      mode: 'cors',
      signal,
    }).catch((err: unknown) => {
      if (signal.aborted) {
        return err instanceof DOMException && err.name === 'TimeoutError'
          ? ('timeout' as const)
          : ('aborted' as const);
      }
      return 'network-or-cors' as const;
    });

    if (response === 'aborted') {
      return { outcome: 'failed' };
    }
    if (response === 'timeout') {
      return project.requiresWakeup
        ? { outcome: 'retry-waking' }
        : { outcome: 'failed' };
    }
    if (response === 'network-or-cors') {
      return { outcome: 'cors-or-network-error' };
    }

    // Defensive check: never treat an opaque response as confirmed HTTP 200
    if (response.type === 'opaque') {
      return { outcome: 'cors-or-network-error' };
    }

    if (!response.ok) {
      const transientWarmup = response.status === 502 || response.status === 503 || response.status === 504;
      if (project.requiresWakeup && transientWarmup) {
        return { outcome: 'retry-waking', httpStatus: response.status };
      }
      return { outcome: 'failed', httpStatus: response.status };
    }

    if (project.healthCheckType === 'cors-json') {
      try {
        const payload: unknown = await response.json();
        return isHealthyJsonPayload(payload)
          ? { outcome: 'active', httpStatus: response.status }
          : { outcome: 'failed', httpStatus: response.status };
      } catch {
        return { outcome: 'failed', httpStatus: response.status };
      }
    }

    return { outcome: 'active', httpStatus: response.status || 200 };
  }

  private async probeSingleOpaqueReachability(
    project: ProjectLinks,
    instanceSignal: AbortSignal
  ): Promise<boolean> {
    const targetUrl = project.healthUrl || project.liveUrl;
    const signal = this.createAttemptSignal(instanceSignal);
    try {
      const res = await this.fetchImpl(targetUrl, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'omit',
        mode: 'no-cors',
        signal,
      });
      return res.type === 'opaque' || res.ok;
    } catch {
      return false;
    }
  }

  private async startHealthCheckRoutine(project: ProjectLinks): Promise<void> {
    const controller = new AbortController();
    this.abortControllers.set(project.id, controller);

      // Cloudflare deployments are edge-cached and require no cold-start retries.
      // Render free-tier deployments get one initial wake-up + at most 2 bounded backoff retries.
      const delays = project.requiresWakeup ? this.renderRetryDelaysMs : [0];
      const startTime = Date.now();
      let attempts = 0;

      for (let idx = 0; idx < delays.length; idx++) {
        if (controller.signal.aborted) return;

        const delay = delays[idx] ?? 0;
        if (delay > 0) {
          if (Date.now() - startTime >= this.maxRenderDurationMs) break;
          const slept = await sleepWithAbort(delay, controller.signal);
          if (!slept) return;
        }

          attempts += 1;
          this.updateState(project.id, {
            wakeInitiated: true,
            attemptsCount: attempts,
          });

            const result = await this.probeCorsHealth(
              project,
              this.createAttemptSignal(controller.signal)
            );

            if(controller.signal.aborted) return;

          if (result.outcome === 'active') {
            this.updateState(project.id, {
              status: 'active',
              httpStatus: result.httpStatus,
              healthConfirmed: true,
            });
            return;
          }

            if (result.outcome === 'failed') {
              this.updateState(project.id, {
                status: 'failed',
                httpStatus: result.httpStatus,
                healthConfirmed: false,
              });
              return;
            }

            if (result.outcome === 'cors-or-network-error') {
              // Distinguish unreachable host vs CORS-restricted readable response with ONE bounded probe.
              const reachable = await this.probeSingleOpaqueReachability(
                project,
                controller.signal
              );
              if (controller.signal.aborted) return;

              if (reachable) {
                // Server accepted connection (and Render wake-up succeeded), but CORS prevents reading HTTP status/body.
                // Stay strictly ORANGE ('unconfirmed') — NEVER falsely mark green ('active').
                this.updateState(project.id, {
                  status: 'unconfirmed',
                  healthConfirmed: false,
                });
                return;
              }

              // Network unreachable / cold-start socket reset: retry only if Render backoff remains
              const hasMoreRetries = project.requiresWakeup && idx < delays.length - 1;
              if (!hasMoreRetries) {
                this.updateState(project.id, {
                  status: 'failed',
                  healthConfirmed: false,
                });
                return;
              }
            }
            // For 'retry-waking' (timeout / 502 / 503 during Render cold start), loop continues cleanly.
          }

            if (!controller.signal.aborted) {
              this.updateState(project.id, {
                status: 'failed',
                healthConfirmed: false,
              });
            }
          }

  public dispose(): void {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }
    this.abortControllers.clear();
    this.listeners.clear();
    this.initiatedProjectIds.clear();
    this.isInitialized = false;
  }
}

export function createProjectHealthMonitor(
  options?: HealthMonitorOptions
): ProjectHealthMonitorService {
  return new ProjectHealthMonitorService(options);
}

export const projectHealthMonitor = createProjectHealthMonitor();

/**
 * Observe live health state for a single project id.
 */
export function useProjectHealth(projectId: string): HealthState {
  const [status, setStatus] = useState<HealthState>(() =>
    projectHealthMonitor.getStatus(projectId)
  );

  useEffect(() => {
    projectHealthMonitor.initialize();
    const unsubscribe = projectHealthMonitor.subscribe(() => {
      setStatus(projectHealthMonitor.getStatus(projectId));
    });
    return unsubscribe;
  }, [projectId]);

  return status;
}

export function useAllProjectsHealth(): ReadonlyMap<string, ProjectHealthInfo> {
  const [states, setStates] = useState<ReadonlyMap<string, ProjectHealthInfo>>(
      () => new Map()
  );

  useEffect(() => {
    projectHealthMonitor.initialize();
    const unsubscribe = projectHealthMonitor.subscribe((newStates) => {
      setStates(newStates);
    });
    return unsubscribe;
  }, []);

  return states;
}
