'use client';

import React from 'react';
import { NodeStatus } from '@/lib/rangeSim/types';
import { Shield, AlertTriangle, Skull, CheckCircle, Globe, Server, Laptop, Database, Lock } from 'lucide-react';

interface NetworkMapProps {
  nodeStates: Record<string, NodeStatus>;
  selectedNode?: string | null;
  onSelectNode?: (nodeId: string) => void;
  activePath?: string[];
  className?: string;
}

export function NetworkMap({
  nodeStates,
  selectedNode,
  onSelectNode,
  activePath = [],
  className = '',
}: NetworkMapProps) {
  const nodes = [
    {
      id: 'internet',
      label: 'Internet',
      zone: 'External Zone',
      ip: '198.51.100.0/24',
      x: 60,
      y: 130,
      icon: Globe,
    },
    {
      id: 'mail-gw',
      label: 'mail-gw.fintechcorp.local',
      zone: 'DMZ Perimeter',
      ip: '10.0.1.10',
      x: 210,
      y: 130,
      icon: Server,
    },
    {
      id: 'ws-402',
      label: 'ws-402.fintechcorp.local',
      zone: 'Workstation LAN',
      ip: '10.0.2.42',
      x: 380,
      y: 70,
      icon: Laptop,
    },
    {
      id: 'dc-01',
      label: 'dc-01.fintechcorp.local',
      zone: 'Core Identity',
      ip: '10.0.3.5',
      x: 380,
      y: 190,
      icon: Lock,
    },
    {
      id: 'srv-fin',
      label: 'srv-fin01.fintechcorp.local',
      zone: 'Finance Vault',
      ip: '10.0.4.100',
      x: 540,
      y: 130,
      icon: Database,
    },
  ];

  const edges = [
    { from: 'internet', to: 'mail-gw', label: 'SMTP / 25' },
    { from: 'mail-gw', to: 'ws-402', label: 'IMAP / 993' },
    { from: 'ws-402', to: 'dc-01', label: 'Kerberos / 88' },
    { from: 'dc-01', to: 'srv-fin', label: 'TDS / 1433' },
    { from: 'ws-402', to: 'srv-fin', label: 'Direct (Blocked)', dashed: true },
  ];

  const getNodeColor = (status: NodeStatus) => {
    switch (status) {
      case 'compromised':
        return { border: '#EA694B', fill: 'rgba(234, 105, 75, 0.15)', glow: 'rgba(234, 105, 75, 0.4)', text: '#EA694B' };
      case 'isolated':
        return { border: '#17ABA9', fill: 'rgba(23, 171, 169, 0.15)', glow: 'rgba(23, 171, 169, 0.4)', text: '#17ABA9' };
      case 'probed':
        return { border: '#FBBF24', fill: 'rgba(251, 191, 36, 0.1)', glow: 'rgba(251, 191, 36, 0.3)', text: '#FBBF24' };
      default:
        return { border: '#26262C', fill: '#111114', glow: 'transparent', text: '#A1A1AA' };
    }
  };

  return (
    <div className={`relative bg-[#0E0E12] rounded-xl border border-border p-4 overflow-hidden select-none ${className}`}>
      {/* Zone background overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#26262C" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#26262C]/60 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span className="text-text font-medium">BATTLE MAP: fintechcorp.local</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-coral inline-block" /> Compromised</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal inline-block" /> Isolated</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#52525B] inline-block" /> Clean</span>
        </div>
      </div>

      {/* SVG Network Topology */}
      <div className="relative w-full aspect-[600/260]">
        <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible" role="img" aria-label="Battle network topology map of fintechcorp.local">
          <title>Network Topology Map fintechcorp.local</title>
          {/* Edges */}
          {edges.map((edge, idx) => {
            const start = nodes.find(n => n.id === edge.from)!;
            const end = nodes.find(n => n.id === edge.to)!;
            const isRedPath = (nodeStates[edge.from] === 'compromised' || nodeStates[edge.from] === 'probed') &&
                             (nodeStates[edge.to] === 'compromised' || nodeStates[edge.to] === 'probed');
            const isIsolated = nodeStates[edge.to] === 'isolated';

            return (
              <g key={idx}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={isIsolated ? '#17ABA9' : isRedPath ? '#EA694B' : '#26262C'}
                  strokeWidth={isRedPath || isIsolated ? 2.5 : 1.5}
                  strokeDasharray={edge.dashed ? '4,4' : undefined}
                  className="transition-colors duration-500"
                />
                {/* Flow pulse */}
                {isRedPath && !isIsolated && (
                  <circle r="3" fill="#EA694B">
                    <animateMotion
                      path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                {isIsolated && (
                  <circle r="3" fill="#17ABA9">
                    <animateMotion
                      path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                      dur="2.2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const status = nodeStates[node.id] || 'clean';
            const colors = getNodeColor(status);
            const isSelected = selectedNode === node.id;
            const Icon = node.icon;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelectNode?.(node.id)}
                className="cursor-pointer group"
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    r="28"
                    fill="none"
                    stroke="#17ABA9"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    className="animate-spin-slow"
                  />
                )}

                {/* Status Glow */}
                <circle
                  r="24"
                  fill={colors.fill}
                  stroke={colors.border}
                  strokeWidth="2"
                  filter={status !== 'clean' ? 'drop-shadow(0 0 8px ' + colors.glow + ')' : undefined}
                  className="transition-all duration-300 group-hover:scale-105"
                />

                {/* Node Center Icon / Indicator */}
                <foreignObject x="-12" y="-12" width="24" height="24">
                  <div className="w-full h-full flex items-center justify-center">
                    {status === 'isolated' ? (
                      <Shield className="w-4 h-4 text-teal animate-pulse" />
                    ) : status === 'compromised' ? (
                      <Skull className="w-4 h-4 text-coral animate-bounce" />
                    ) : status === 'probed' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Icon className="w-3.5 h-3.5 text-muted group-hover:text-text transition-colors" />
                    )}
                  </div>
                </foreignObject>

                {/* Node labels */}
                <text
                  y="36"
                  textAnchor="middle"
                  fill={isSelected ? '#17ABA9' : '#E5E6E6'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                  className="select-none pointer-events-none"
                >
                  {node.label.replace('.fintechcorp.local', '')}
                </text>
                <text
                  y="47"
                  textAnchor="middle"
                  fill="#71717A"
                  fontSize="8.5"
                  fontFamily="monospace"
                  className="select-none pointer-events-none"
                >
                  {node.ip}
                </text>

                {/* Status pill tag */}
                <g transform="translate(0, -28)">
                  <rect
                    x="-24"
                    y="-8"
                    width="48"
                    height="14"
                    rx="7"
                    fill="#18181B"
                    stroke={colors.border}
                    strokeWidth="1"
                  />
                  <text
                    y="2"
                    textAnchor="middle"
                    fill={colors.text}
                    fontSize="7.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="select-none uppercase pointer-events-none"
                  >
                    {status}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Subnet Legend Footer */}
      <div className="mt-2 pt-2 border-t border-[#26262C]/40 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-muted">
        <span>DMZ: 10.0.1.0/24</span>
        <span>LAN: 10.0.2.0/24</span>
        <span>DOMAIN: 10.0.3.0/24</span>
        <span>VAULT: 10.0.4.0/24</span>
        <span className="text-teal">Micro-segmentation: SDN Active</span>
      </div>
    </div>
  );
}

