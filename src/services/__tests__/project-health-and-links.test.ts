/**
 * @file clients/portfolio/src/services/__tests__/project-health-and-links.test.ts
 * @description Automated Vitest suite verifying Stage G.9 authoritative URL mapping,
 * interactive 3D billboard mesh allowlisting, and honest CORS-verified Render/Cloudflare health monitoring.
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  GITHUB_PROFILE_URL,
  getProjectByBillboardMesh,
  projectLinks,
} from '../../data/project-links.js';
import { PROJECTS_DATA } from '../../data/portfolioData.js';
import { createProjectHealthMonitor } from '../project-health-monitor.js';

describe('Stage G.9 Authoritative Project Configuration', () => {
  it('maintains exact verified deployments and separate GitHub owner spellings without silent overwrite', () => {
    expect(GITHUB_PROFILE_URL).toBe('https://github.com/Naveen03navee');
    expect(projectLinks).toHaveLength(4);

    const jarvis = projectLinks.find((p) => p.id === 'jarvis');
    const biometric = projectLinks.find((p) => p.id === 'biometric-event-gallery');
    const smartQr = projectLinks.find((p) => p.id === 'smart-qr-attendance');
    const docIntel = projectLinks.find((p) => p.id === 'multi-engine-doc-intel');

    expect(jarvis?.liveUrl).toBe('https://j-a-r-v-i-s-3c3.pages.dev/');
    expect(jarvis?.gitCloneUrl).toBe('https://github.com/Naveenbnnavee/J.A.R.V.I.S.git');
    expect(jarvis?.githubUrl).toBe('https://github.com/Naveenbnnavee/J.A.R.V.I.S');
    expect(jarvis?.requiresWakeup).toBe(false);

    expect(biometric?.liveUrl).toBe('https://biometric-event-gallery.pages.dev/');
    expect(biometric?.gitCloneUrl).toBe(
      'https://github.com/Naveenbnnavee/biometric-event-gallery.git'
    );
    expect(biometric?.requiresWakeup).toBe(false);

    expect(smartQr?.liveUrl).toBe('https://smart-qr-attendance-f0xh.onrender.com/');
    expect(smartQr?.healthUrl).toBe('https://smart-qr-attendance-f0xh.onrender.com/health');
    expect(smartQr?.gitCloneUrl).toBe('https://github.com/Naveenbnnavee/Smart-QR-Attendance.git');
    expect(smartQr?.requiresWakeup).toBe(true);

    expect(docIntel?.liveUrl).toBe('https://multi-engine-doc-intel.onrender.com/');
    expect(docIntel?.healthUrl).toBe('https://multi-engine-doc-intel.onrender.com/health');
    expect(docIntel?.gitCloneUrl).toBe(
      'https://github.com/Naveenbnnavee/Multi-Engine-Doc-Intel.git'
    );
    expect(docIntel?.requiresWakeup).toBe(true);
  });

  it('derives PROJECTS_DATA directly from projectLinks with zero URL drift', () => {
    expect(PROJECTS_DATA).toHaveLength(projectLinks.length);
    for (const showcase of PROJECTS_DATA) {
      const link = projectLinks.find((l) => l.id === showcase.id);
      expect(link).toBeDefined();
      expect(showcase.liveUrl).toBe(link?.liveUrl);
      expect(showcase.githubUrl).toBe(link?.githubUrl);
    }
  });

  it('maps only the 4 interactive display face quads and excludes rear *_Structure meshes', () => {
    expect(getProjectByBillboardMesh('Display_Project_Jarvis')?.id).toBe('jarvis');
    expect(getProjectByBillboardMesh('Display_Project_Biometric')?.id).toBe(
      'biometric-event-gallery'
    );
    expect(getProjectByBillboardMesh('Display_Project_SmartQR')?.id).toBe('smart-qr-attendance');
    expect(getProjectByBillboardMesh('Display_Project_DocIntel')?.id).toBe(
      'multi-engine-doc-intel'
    );

    expect(getProjectByBillboardMesh('Display_Project_Jarvis_Structure')).toBeUndefined();
    expect(getProjectByBillboardMesh('Display_Project_SmartQR_Structure')).toBeUndefined();
    expect(getProjectByBillboardMesh('Display_Gateway_Welcome')).toBeUndefined();
    expect(getProjectByBillboardMesh('Display_Skyline_Final')).toBeUndefined();
  });
});

describe('Stage G.9 ProjectHealthMonitor Honest Telemetry & Bounded Wake-up', () => {
  const activeMonitors: Array<ReturnType<typeof createProjectHealthMonitor>> = [];

  afterEach(() => {
    while (activeMonitors.length > 0) {
      activeMonitors.pop()?.dispose();
    }
  });

  it('marks CORS-verified HTTP 200 endpoints active (GREEN) and CORS-unreadable opaque endpoints unconfirmed (ORANGE, never false green)', async () => {
    const fetchCalls: Array<{ url: string; mode: RequestMode | undefined }> = [];

    const mockFetch: typeof fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input.toString();
      const mode = init?.mode;
      fetchCalls.push({ url, mode });

      // J.A.R.V.I.S. returns readable CORS HTTP 200 HTML
      if (url.includes('j-a-r-v-i-s')) {
        return new Response('<html></html>', { status: 200 });
      }
      // Smart QR /health returns readable CORS JSON healthy payload
      if (url.includes('smart-qr-attendance') && url.endsWith('/health')) {
        return new Response(JSON.stringify({ status: 'healthy', service: 'smart-qr-attendance' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }
      // Biometric & Doc Intel block CORS on origin, while server responds cleanly via single no-cors reachability probe
      if (mode === 'cors') {
        throw new TypeError('Failed to fetch due to CORS');
      }
      return {
        type: 'opaque',
        ok: false,
        status: 0,
      } as unknown as Response;
    };

    const monitor = createProjectHealthMonitor({
      fetchImpl: mockFetch,
      renderRetryDelaysMs: [0, 5, 5],
      perAttemptTimeoutMs: 500,
      maxRenderDurationMs: 2000,
    });
    activeMonitors.push(monitor);

    monitor.initialize();
    // Duplicate initialize call must NOT issue duplicate probes
    monitor.initialize();

    await new Promise((resolve) => setTimeout(resolve, 60));

    expect(monitor.getStatus('jarvis')).toBe('active');
    expect(monitor.getInfo('jarvis')?.healthConfirmed).toBe(true);
    expect(monitor.getInfo('jarvis')?.attemptsCount).toBe(1);

    expect(monitor.getStatus('smart-qr-attendance')).toBe('active');
    expect(monitor.getInfo('smart-qr-attendance')?.healthConfirmed).toBe(true);

    // Crucial: opaque CORS-blocked endpoints must NEVER falsely report 'active' (green)
    expect(monitor.getStatus('biometric-event-gallery')).toBe('unconfirmed');
    expect(monitor.getInfo('biometric-event-gallery')?.healthConfirmed).toBe(false);
    expect(monitor.getInfo('biometric-event-gallery')?.attemptsCount).toBe(1);

    expect(monitor.getStatus('multi-engine-doc-intel')).toBe('unconfirmed');
    expect(monitor.getInfo('multi-engine-doc-intel')?.healthConfirmed).toBe(false);
    expect(monitor.getInfo('multi-engine-doc-intel')?.attemptsCount).toBe(1);

    // Total session initialize should not duplicate per-project routines
    const jarvisCalls = fetchCalls.filter((c) => c.url.includes('j-a-r-v-i-s'));
    expect(jarvisCalls).toHaveLength(1);
  });

  it('recovers from Render cold-start 503 during bounded retry backoff and turns failed (RED) when retries exhaust', async () => {
    let smartQrHits = 0;

    const mockFetch: typeof fetch = async (input) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (url.includes('smart-qr-attendance')) {
        smartQrHits += 1;
        if (smartQrHits === 1) {
          // Cold start 503 waking
          return new Response('Waking', { status: 503 });
        }
        return new Response(JSON.stringify({ status: 'healthy' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }

      if (url.includes('multi-engine-doc-intel')) {
        // Definitive timeout/down (reject both cors and no-cors)
        throw new DOMException('Timed out', 'TimeoutError');
      }

      return new Response('<html></html>', { status: 200 });
    };

    const monitor = createProjectHealthMonitor({
      fetchImpl: mockFetch,
      renderRetryDelaysMs: [0, 15, 15],
      perAttemptTimeoutMs: 200,
      maxRenderDurationMs: 2000,
    });
    activeMonitors.push(monitor);

    monitor.initialize();
    await new Promise((resolve) => setTimeout(resolve, 120));

    expect(monitor.getStatus('smart-qr-attendance')).toBe('active');
    expect(monitor.getInfo('smart-qr-attendance')?.attemptsCount).toBe(2);

    expect(monitor.getStatus('multi-engine-doc-intel')).toBe('failed');
    expect(monitor.getInfo('multi-engine-doc-intel')?.healthConfirmed).toBe(false);
    expect(monitor.getInfo('multi-engine-doc-intel')?.attemptsCount).toBe(3);
  });
});

