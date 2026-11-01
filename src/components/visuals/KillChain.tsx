'use client';

import React from 'react';
import { Target, Mail, Key, Network, Database, ChevronRight, Check } from 'lucide-react';

export interface KillChainStep {
  id: string;
  name: string;
  mitre: string;
  xp: number;
  icon: any;
  status: 'pending' | 'active' | 'completed';
}

interface KillChainProps {
  currentAction?: string;
  activeMitre?: string;
  onSelectStep?: (mitreId: string) => void;
  className?: string;
}

export function KillChain({
  currentAction,
  activeMitre,
  onSelectStep,
  className = '',
}: KillChainProps) {
  // Verified distinct MITRE ATT&CK IDs:
  // T1087: Account Discovery
  // T1566: Phishing
  // T1078: Valid Accounts (Initial Access / Persistence)
  // T1021.002: Remote Services - SMB/Windows Admin Shares
  // T1567: Exfiltration Over Web Service / Staging to Data Repository
  const steps: KillChainStep[] = [
    {
      id: 'recon',
      name: 'Reconnaissance',
      mitre: 'T1087',
      xp: 50,
      icon: Target,
      status: currentAction === 'recon' ? 'active' : currentAction ? 'completed' : 'pending',
    },
    {
      id: 'phish',
      name: 'Phishing Lure',
      mitre: 'T1566',
      xp: 100,
      icon: Mail,
      status: currentAction === 'phish' ? 'active' : (currentAction === 'foothold' || currentAction === 'pivot' || currentAction === 'objective') ? 'completed' : 'pending',
    },
    {
      id: 'foothold',
      name: 'Initial Foothold',
      mitre: 'T1078',
      xp: 120,
      icon: Key,
      status: currentAction === 'foothold' ? 'active' : (currentAction === 'pivot' || currentAction === 'objective') ? 'completed' : 'pending',
    },
    {
      id: 'pivot',
      name: 'Lateral Pivot',
      mitre: 'T1021.002',
      xp: 150,
      icon: Network,
      status: currentAction === 'pivot' ? 'active' : currentAction === 'objective' ? 'completed' : 'pending',
    },
    {
      id: 'objective',
      name: 'Objective Reach',
      mitre: 'T1567',
      xp: 200,
      icon: Database,
      status: currentAction === 'objective' ? 'active' : 'pending',
    },
  ];

  return (
    <div className={`space-y-2 select-none ${className}`}>
      {/* Title and subtext separate to prevent overlap */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono text-muted mb-1.5 pb-1 border-b border-[#26262C]/60">
        <span className="uppercase tracking-wider font-semibold text-coral flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" />
          <span>ATTACK CHAIN (MITRE ATT&amp;CK)</span>
        </span>
        <span className="text-[10.5px] text-muted/80">Click step to pin technique</span>
      </div>

      {/* Rendered as vertical list to prevent horizontal truncation */}
      <div className="space-y-1.5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = step.status === 'active';
          const isCompleted = step.status === 'completed';

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep?.(step.mitre)}
              className={`w-full p-2.5 rounded-lg border text-left transition-all relative overflow-hidden group focus:outline-none focus:ring-1 focus:ring-coral flex items-center justify-between gap-3 ${
                isActive
                  ? 'bg-coral/10 border-coral text-text shadow-[0_0_12px_rgba(234,105,75,0.25)] ring-1 ring-coral/50'
                  : isCompleted
                  ? 'bg-[#151212] border-coral/40 text-text/90'
                  : 'bg-[#111114] border-[#26262C] text-muted opacity-75'
              }`}
            >
              {/* Left: Technique ID and Name with full label */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`px-2 py-0.5 rounded font-mono text-[10.5px] font-bold shrink-0 ${
                  isActive ? 'bg-coral text-white' : isCompleted ? 'bg-coral/20 text-coral' : 'bg-[#1A1A1E] text-muted'
                }`}>
                  {step.mitre}
                </span>

                <div className="flex items-center gap-2 truncate">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-coral animate-pulse' : isCompleted ? 'text-coral/80' : 'text-muted'
                  }`} />
                  <span className="text-xs font-heading font-medium truncate text-text">
                    {step.name}
                  </span>
                </div>
              </div>

              {/* Right: XP badge and Status */}
              <div className="flex items-center gap-2.5 shrink-0 font-mono text-[10px]">
                <span className="text-muted font-semibold">+{step.xp} XP</span>
                <span className={`px-1.5 py-0.2 rounded uppercase font-bold text-[9px] ${
                  isActive ? 'bg-coral/20 text-coral' : isCompleted ? 'bg-teal/20 text-teal' : 'bg-transparent text-muted/60'
                }`}>
                  {step.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
