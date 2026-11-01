'use client';

import React from 'react';

export interface RadarSkills {
  recon: number;
  detection: number;
  forensics: number;
  networkDefense: number;
  incidentResponse: number;
  reporting: number;
}

interface SkillRadarProps {
  skills: RadarSkills;
  size?: number;
  className?: string;
}

export function SkillRadar({
  skills,
  size = 240,
  className = '',
}: SkillRadarProps) {
  const categories = [
    { key: 'recon', label: 'Recon' },
    { key: 'detection', label: 'Detection' },
    { key: 'forensics', label: 'Forensics' },
    { key: 'networkDefense', label: 'Net Defense' },
    { key: 'incidentResponse', label: 'Inc. Response' },
    { key: 'reporting', label: 'Reporting' },
  ] as const;

  const center = size / 2;
  const radius = size * 0.36;
  const numAxes = categories.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Grid rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1];

  // Helper to compute coordinate for a given axis and value (0-100)
  const getCoordinates = (axisIndex: number, value: number) => {
    const angle = axisIndex * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Compute points string for the data polygon
  const dataPoints = categories
    .map((cat, idx) => {
      const val = Math.min(100, Math.max(0, skills[cat.key] || 10));
      const pt = getCoordinates(idx, val);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div className={`relative flex flex-col items-center justify-center font-mono select-none ${className}`}>
      <svg width={size} height={size} className="overflow-visible" role="img" aria-label="Analyst 6-axis operational skill radar">
        <title>Analyst Skill Radar</title>
        {/* Background rings */}
        {rings.map((ringFactor, rIdx) => {
          const ringPoints = categories
            .map((_, idx) => {
              const pt = getCoordinates(idx, ringFactor * 100);
              return `${pt.x},${pt.y}`;
            })
            .join(' ');
          return (
            <polygon
              key={rIdx}
              points={ringPoints}
              fill="none"
              stroke="#26262C"
              strokeWidth="1"
              strokeDasharray={rIdx === rings.length - 1 ? undefined : '2,2'}
            />
          );
        })}

        {/* Axis Spokes */}
        {categories.map((_, idx) => {
          const endPt = getCoordinates(idx, 100);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={endPt.x}
              y2={endPt.y}
              stroke="#26262C"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon with brand gradient fill */}
        <defs>
          <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#17ABA9" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#EA694B" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <polygon
          points={dataPoints}
          fill="url(#radarGrad)"
          stroke="#17ABA9"
          strokeWidth="2"
          className="transition-all duration-700 ease-out"
        />

        {/* Vertex points & Outer Labels */}
        {categories.map((cat, idx) => {
          const val = Math.min(100, Math.max(0, skills[cat.key] || 10));
          const pt = getCoordinates(idx, val);
          const labelPt = getCoordinates(idx, 122);

          return (
            <g key={cat.key}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#17ABA9"
                stroke="#09090B"
                strokeWidth="1.5"
                className="transition-all duration-700"
              />
              <text
                x={labelPt.x}
                y={labelPt.y + (idx === 0 ? -4 : idx === 3 ? 10 : 3)}
                textAnchor="middle"
                fontSize="9"
                fill="#A1A1AA"
                fontWeight="500"
                className="select-none"
              >
                {cat.label} ({val})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

