/**
 * @file clients/portfolio/src/components/ui/ProjectArchitectureDiagram.tsx
 * @description Warm editorial light SVG schematic depicting verified pipeline stages for each signature project.
 */

import React from 'react';
import type { ProjectArchitectureStage } from '../../types/portfolio.types.js';
import type { ProjectAccentPalette } from '../../data/project-links.js';

export interface ProjectArchitectureDiagramProps {
  readonly stages: readonly ProjectArchitectureStage[];
  readonly palette: ProjectAccentPalette;
}

export const ProjectArchitectureDiagram: React.FC<ProjectArchitectureDiagramProps> = ({
  stages,
  palette,
}) => {
  const safeStages = stages.slice(0, 4);

  return (
    <div
      className="rounded-xl bg-[#F5F3EE] border border-[#E3DED3] p-3.5 sm:p-4"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#525955]">
          Architecture Pipeline
        </span>
        <span
          className="h-1.5 w-8 rounded-full opacity-85"
          style={{
            background: `linear-gradient(90deg, ${palette.primaryHex}, ${palette.secondaryHex})`,
          }}
        />
      </div>

      <svg
        viewBox="0 0 640 124"
        className="w-full h-auto block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {safeStages.map((stage, idx) => {
          const x = 8 + idx * 160;
          const isHighlight = idx === 1 || idx === 2;
          return (
            <g key={stage.label}>
              <rect
                x={x}
                y={14}
                width={142}
                height={96}
                rx={10}
                fill={isHighlight ? '#FFFFFF' : '#EDEAE2'}
                stroke={isHighlight ? palette.primaryHex : '#D7D0C3'}
                strokeOpacity={isHighlight ? 0.65 : 1}
                strokeWidth={1.25}
              />
              <rect
                x={x + 12}
                y={26}
                width={26}
                height={3}
                rx={1.5}
                fill={idx % 2 === 0 ? palette.primaryHex : palette.secondaryHex}
              />
              <text
                x={x + 12}
                y={47}
                fill="#69716D"
                fontFamily="JetBrains Mono, monospace"
                fontSize={10}
                fontWeight={600}
              >
                0{idx + 1}
              </text>
              <text
                x={x + 12}
                y={69}
                fill="#252A2A"
                fontFamily="Manrope, Inter, sans-serif"
                fontSize={12.5}
                fontWeight={700}
              >
                {stage.label}
              </text>
              <text
                x={x + 12}
                y={90}
                fill="#525955"
                fontFamily="Inter, sans-serif"
                fontSize={10.5}
              >
                {stage.detail.length > 22 ? `${stage.detail.slice(0, 21)}…` : stage.detail}
              </text>

              {idx < safeStages.length - 1 && (
                <g>
                  <line
                    x1={x + 144}
                    y1={62}
                    x2={x + 157}
                    y2={62}
                    stroke={palette.primaryHex}
                    strokeOpacity={0.75}
                    strokeWidth={1.5}
                  />
                  <polyline
                    points={`${x + 153},58 ${x + 158},62 ${x + 153},66`}
                    stroke={palette.primaryHex}
                    strokeOpacity={0.85}
                    strokeWidth={1.5}
                    fill="none"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
