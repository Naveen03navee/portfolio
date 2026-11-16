/**
 * @file clients/portfolio/src/components/ui/ProjectStatusDot.tsx
 * @description Restrained circular runtime status dot displayed beside project titles.
 * Uses clean semantic health colors:
 * - GREEN (`active`): Positively verified CORS-readable HTTP 200 healthy response
 * - ORANGE (`waking` / `unconfirmed`): Service waking up, pending, or CORS-unconfirmed
 * - RED (`failed`): Bounded health check failed or timed out without healthy response
 */

import React from 'react';
import { useProjectHealth, type HealthState } from '../../services/project-health-monitor.js';

interface ProjectStatusDotProps {
  readonly projectId: string;
  readonly className?: string;
  readonly showTooltip?: boolean;
}

const STATUS_CONFIG: Record<
  HealthState,
  {
    readonly colorBg: string;
    readonly colorRing: string;
    readonly pulse: boolean;
    readonly label: string;
    readonly tooltip: string;
  }
> = {
  active: {
    colorBg: 'bg-[#2F855A]',
    colorRing: 'ring-[#2F855A]/25',
    pulse: false,
    label: 'Runtime status: Confirmed healthy online deployment',
    tooltip: 'Online • Verified Healthy',
  },
  waking: {
    colorBg: 'bg-[#D97706]',
    colorRing: 'ring-[#D97706]/30',
    pulse: true,
    label: 'Runtime status: Service wake-up request in progress',
    tooltip: 'Waking • Pending Confirmation',
  },
  unconfirmed: {
    colorBg: 'bg-[#D97706]',
    colorRing: 'ring-[#D97706]/25',
    pulse: false,
    label: 'Runtime status: Reachable; health unconfirmed across browser CORS policy',
    tooltip: 'Pending • CORS Unconfirmed',
  },
  failed: {
    colorBg: 'bg-[#DC2626]',
    colorRing: 'ring-[#DC2626]/30',
    pulse: false,
    label: 'Runtime status: Health check failed or timed out',
    tooltip: 'Unavailable • Timed Out',
  },
};

export const ProjectStatusDot: React.FC<ProjectStatusDotProps> = ({
  projectId,
  className = '',
  showTooltip = true,
}) => {
  const status: HealthState = useProjectHealth(projectId);
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}
      role="status"
      aria-label={config.label}
      data-health-state={status}
      data-project-id={projectId}
    >
      {config.pulse && (
        <span
          className="absolute -inset-1 rounded-full bg-[#D97706]/30 animate-ping opacity-70 pointer-events-none motion-reduce:hidden"
          aria-hidden="true"
        />
      )}

      <span
        className={`relative inline-block w-2.5 h-2.5 rounded-full ring-2 ${config.colorBg} ${config.colorRing} transition-colors duration-editorial`}
        aria-hidden="true"
      />

      <span className="sr-only">{config.label}</span>

      {showTooltip && (
        <span
          role="tooltip"
          className="hidden group-hover:inline-block group-focus-within:inline-block pointer-events-none absolute bottom-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mb-2 px-2.5 py-1 rounded-md text-[11px] font-body font-medium text-[#F5F3EE] bg-[#252A2A] border border-[#3B4242] shadow-lg whitespace-nowrap z-50"
        >
          {config.tooltip}
        </span>
      )}
    </span>
  );
};
