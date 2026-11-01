'use client';

import React, { useState } from 'react';
import { Shield, ShieldAlert, Play, CheckCircle2, XCircle } from 'lucide-react';
import { ZONES_CONTENT, ZoneItem } from '@/content/zones';

interface ZoneDiagramProps {
  className?: string;
}

export function ZoneDiagram({ className = '' }: ZoneDiagramProps) {
  // Render ONLY verified zones
  const verifiedZones: ZoneItem[] = ZONES_CONTENT.filter((z) => z.verified);
  const [activeZone, setActiveZone] = useState<string>('range');
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [probeStage, setProbeStage] = useState<'idle' | 'in-flight' | 'blocked' | 'contained'>('idle');

  const currentZoneData = verifiedZones.find((z) => z.id === activeZone) || verifiedZones[0];

  const triggerAttackProbe = () => {
    if (isProbing) return;
    setIsProbing(true);
    setProbeStage('in-flight');

    setTimeout(() => {
      setProbeStage('blocked');
      setTimeout(() => {
        setProbeStage('contained');
        setTimeout(() => {
          setIsProbing(false);
          setProbeStage('idle');
        }, 1800);
      }, 1200);
    }, 1400);
  };

  return (
    <div className={`bg-[#0D0E12] rounded-2xl border border-border p-5 md:p-6 select-none ${className}`}>
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#26262C]">
        <div>
          <h3 className="font-heading font-semibold text-text text-sm sm:text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal" />
            <span>Layered Defense-in-Depth Trust Zones</span>
          </h3>
          <p className="text-xs text-muted font-sans mt-0.5">
            Strict directional boundaries. Training range is isolated from application logic with verified controls only.
          </p>
        </div>

        <button
          onClick={triggerAttackProbe}
          disabled={isProbing}
          className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 transition-all self-start sm:self-auto ${
            isProbing
              ? 'bg-coral/20 border-coral text-coral cursor-wait'
              : 'bg-[#18181D] border-[#26262C] text-text hover:border-teal hover:text-teal'
          }`}
        >
          <Play className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : ''}`} />
          <span>{isProbing ? 'Simulating Intrusion Probe...' : 'Replay an attack probe'}</span>
        </button>
      </div>

      {/* SVG Flow / Diagram */}
      <div className="relative w-full aspect-[780/160] overflow-hidden rounded-xl bg-[#08080A] border border-[#26262C]/60 p-2">
        <svg viewBox="0 0 780 160" className="w-full h-full" role="img" aria-label="Defense-in-depth architecture zones diagram">
          <title>Defense in Depth Trust Boundaries</title>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#17ABA9" />
            </marker>
          </defs>

          {/* Connectors between verified zones */}
          <g stroke="#26262C" strokeWidth="1.5">
            <line x1="165" y1="75" x2="215" y2="75" markerEnd="url(#arrow)" />
            <line x1="365" y1="75" x2="415" y2="75" markerEnd="url(#arrow)" />
            <line x1="565" y1="75" x2="615" y2="75" markerEnd="url(#arrow)" />
          </g>

          {/* Animated probe travelling */}
          {probeStage === 'in-flight' && (
            <circle cx="20" cy="75" r="4.5" fill="#EA694B">
              <animate attributeName="cx" from="40" to="415" dur="1.3s" fill="freeze" />
            </circle>
          )}

          {/* Blocked pulse at boundary */}
          {probeStage === 'blocked' && (
            <g transform="translate(415, 75)">
              <circle r="14" fill="none" stroke="#EA694B" strokeWidth="2" className="animate-ping" />
              <circle r="8" fill="#EA694B" />
            </g>
          )}

          {/* Contained return pulse */}
          {probeStage === 'contained' && (
            <circle cx="415" cy="75" r="5" fill="#17ABA9">
              <animate attributeName="cx" from="415" to="690" dur="1.1s" fill="freeze" />
            </circle>
          )}

          {/* Interactive Zone Containers (4 verified zones) */}
          {verifiedZones.map((zone, idx) => {
            const isSelected = activeZone === zone.id;
            const x = 20 + idx * 195;

            return (
              <g
                key={zone.id}
                transform={`translate(${x}, 20)`}
                onClick={() => setActiveZone(zone.id)}
                className="cursor-pointer group"
              >
                {/* Boundary box */}
                <rect
                  x="0"
                  y="0"
                  width="150"
                  height="110"
                  rx="10"
                  fill={isSelected ? '#14141A' : '#0F0F13'}
                  stroke={isSelected ? '#17ABA9' : '#26262C'}
                  strokeWidth={isSelected ? 1.8 : 1}
                  className="transition-all duration-200 group-hover:border-teal/60"
                />

                {/* Subnet label */}
                <text
                  x="75"
                  y="20"
                  textAnchor="middle"
                  fill="#71717A"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {zone.subnet.length > 24 ? zone.subnet.slice(0, 22) + '…' : zone.subnet}
                </text>

                {/* Zone name */}
                <text
                  x="75"
                  y="48"
                  textAnchor="middle"
                  fill={isSelected ? '#E5E6E6' : '#A1A1AA'}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {zone.name}
                </text>

                {/* Status indicator */}
                <rect
                  x="42"
                  y="74"
                  width="66"
                  height="18"
                  rx="9"
                  fill={isSelected ? '#17ABA9' : '#1A1A22'}
                />
                <text
                  x="75"
                  y="86"
                  textAnchor="middle"
                  fill={isSelected ? '#09090B' : '#71717A'}
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {isSelected ? 'ACTIVE' : 'VERIFIED'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Attack Probe Status Banner */}
      {isProbing && (
        <div className="mt-3 p-2.5 rounded-lg bg-coral/10 border border-coral/30 flex items-center justify-between text-xs font-mono text-coral animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>
              {probeStage === 'in-flight' && 'Probe traversing external perimeter -> blocked at boundary.'}
              {probeStage === 'blocked' && 'Application boundary firewall dropped unauthenticated frame.'}
              {probeStage === 'contained' && 'Telemetry alert dispatched to Monitoring/SOC tap. Zero lateral leak.'}
            </span>
          </div>
          <span className="font-bold">STATUS: INTERCEPTED</span>
        </div>
      )}

      {/* Selected Zone Controls & Enforcements Drawer */}
      <div className="mt-4 p-4 rounded-xl bg-[#121217] border border-[#26262C] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-teal font-semibold mb-1">
            {currentZoneData.name} ({currentZoneData.subnet})
          </div>
          <p className="text-muted leading-relaxed text-[12px]">
            {currentZoneData.role}
          </p>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-text font-semibold mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
            <span>Active Controls</span>
          </div>
          <ul className="space-y-1 text-muted text-[11.5px]">
            {currentZoneData.controls.map((ctrl, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-teal" />
                <span>{ctrl}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-text font-semibold mb-1.5 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-coral" />
            <span>What It Blocks</span>
          </div>
          <ul className="space-y-1 text-muted text-[11.5px]">
            {currentZoneData.blocks.map((blk, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-coral" />
                <span>{blk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
