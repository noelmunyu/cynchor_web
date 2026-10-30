'use client';

import React, { useState } from 'react';
import { Shield, ShieldAlert, ArrowRight, Play, CheckCircle2, XCircle } from 'lucide-react';

export interface TrustZone {
  id: string;
  name: string;
  subnet: string;
  role: string;
  controls: string[];
  blocks: string[];
}

interface ZoneDiagramProps {
  className?: string;
}

export function ZoneDiagram({ className = '' }: ZoneDiagramProps) {
  const [activeZone, setActiveZone] = useState<string>('range');
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [probeStage, setProbeStage] = useState<'idle' | 'in-flight' | 'blocked' | 'contained'>('idle');

  const zones: TrustZone[] = [
    {
      id: 'public',
      name: 'Public Website',
      subnet: 'Internet / Edge CDN',
      role: 'Marketing pages, static documentation, and access request form.',
      controls: ['CSP and HSTS headers', 'Cross-origin write blocking', 'RFC 9116 security.txt'],
      blocks: ['Direct DB access', 'Internal RPC calls', 'Arbitrary file upload'],
    },
    {
      id: 'auth',
      name: 'Auth Gateway',
      subnet: 'DMZ Auth Proxy',
      role: 'Operator authentication, single-use invite verification, and session token issuance.',
      controls: ['CSPRNG 256-bit hashed tokens', 'Rate-limiting & lockout backoff', 'HttpOnly SameSite cookies'],
      blocks: ['Unauthenticated access', 'Brute-force password guessing', 'User enumeration'],
    },
    {
      id: 'app',
      name: 'Application Tier',
      subnet: '10.0.10.0/24',
      role: 'Core business logic, team rosters, and queue dispatching.',
      controls: ['Zod schema validation', 'Parameterized queries', 'RBAC permission checks'],
      blocks: ['SQL injection', 'Payload tampering', 'Malformed and oversized payloads'],
    },
    {
      id: 'range',
      name: 'Isolated Training Range',
      subnet: '10.0.0.0/16 (SDN)',
      role: 'Ephemeral Proxmox SDN virtual environments running synthetic targets (fintechcorp.local).',
      controls: ['Per-student VLAN isolation', 'Zero production routing', '100% synthetic mock datasets'],
      blocks: ['Internet egress leakage', 'Cross-exercise snooping', 'Real customer data ingestion'],
    },
    {
      id: 'monitoring',
      name: 'Monitoring / SOC Tap',
      subnet: '10.0.99.0/24',
      role: 'One-way mirrored telemetry collection, audit logging, and SIEM ingestion.',
      controls: ['Append-only SQLite audit log', 'SHA-256 IP hashing', 'Read-only administrative tap'],
      blocks: ['Application-level log edits', 'Application-level log deletion', 'Raw IP leakage'],
    },
  ];

  const currentZoneData = zones.find((z) => z.id === activeZone) || zones[3];

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
            Strict directional boundaries. Training range is completely isolated from app and public tiers.
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
        <svg viewBox="0 0 780 160" className="w-full h-full">
          {/* Arrow markers */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#17ABA9" />
            </marker>
            <marker id="arrow-coral" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#EA694B" />
            </marker>
          </defs>

          {/* Connectors between zones */}
          <g stroke="#26262C" strokeWidth="1.5">
            <line x1="135" y1="75" x2="165" y2="75" markerEnd="url(#arrow)" />
            <line x1="285" y1="75" x2="315" y2="75" markerEnd="url(#arrow)" />
            <line x1="435" y1="75" x2="465" y2="75" markerEnd="url(#arrow)" />
            <line x1="585" y1="75" x2="615" y2="75" markerEnd="url(#arrow)" />
          </g>

          {/* Animated probe travelling */}
          {probeStage === 'in-flight' && (
            <circle cx="20" cy="75" r="4.5" fill="#EA694B">
              <animate attributeName="cx" from="50" to="465" dur="1.3s" fill="freeze" />
            </circle>
          )}

          {/* Blocked pulse at boundary */}
          {probeStage === 'blocked' && (
            <g transform="translate(465, 75)">
              <circle r="14" fill="none" stroke="#EA694B" strokeWidth="2" className="animate-ping" />
              <circle r="8" fill="#EA694B" />
            </g>
          )}

          {/* Contained return pulse */}
          {probeStage === 'contained' && (
            <circle cx="465" cy="75" r="5" fill="#17ABA9">
              <animate attributeName="cx" from="465" to="690" dur="1.1s" fill="freeze" />
            </circle>
          )}

          {/* Interactive Zone Containers */}
          {zones.map((zone, idx) => {
            const isSelected = activeZone === zone.id;
            const x = 15 + idx * 150;

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
                  width="120"
                  height="110"
                  rx="10"
                  fill={isSelected ? '#14141A' : '#0F0F13'}
                  stroke={isSelected ? '#17ABA9' : '#26262C'}
                  strokeWidth={isSelected ? 1.8 : 1}
                  className="transition-all duration-200 group-hover:border-teal/60"
                />

                {/* Subnet label */}
                <text
                  x="60"
                  y="20"
                  textAnchor="middle"
                  fill="#71717A"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  {zone.subnet}
                </text>

                {/* Zone name */}
                <text
                  x="60"
                  y="46"
                  textAnchor="middle"
                  fill={isSelected ? '#E5E6E6' : '#A1A1AA'}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {zone.name.split(' ')[0]}
                </text>
                <text
                  x="60"
                  y="58"
                  textAnchor="middle"
                  fill={isSelected ? '#E5E6E6' : '#A1A1AA'}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {zone.name.split(' ').slice(1).join(' ')}
                </text>

                {/* Status indicator */}
                <rect
                  x="30"
                  y="78"
                  width="60"
                  height="18"
                  rx="9"
                  fill={isSelected ? '#17ABA9' : '#1A1A22'}
                />
                <text
                  x="60"
                  y="90"
                  textAnchor="middle"
                  fill={isSelected ? '#09090B' : '#71717A'}
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {isSelected ? 'ACTIVE' : 'ISOLATED'}
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
              {probeStage === 'in-flight' && 'Probe traversing external perimeter -> blocked at range boundary.'}
              {probeStage === 'blocked' && 'Boundary SDN firewall dropped unauthenticated egress frame.'}
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

