'use client';

import React from 'react';
import { Target, Mail, Key, Network, Database, ChevronRight } from 'lucide-react';

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
      mitre: 'T1078',
      xp: 200,
      icon: Database,
      status: currentAction === 'objective' ? 'active' : 'pending',
    },
  ];

  return (
    <div className={`space-y-2 select-none ${className}`}>
      <div className="flex items-center justify-between text-xs font-mono text-muted mb-1">
        <span className="uppercase tracking-wider font-semibold text-coral">ATTACK CHAIN (MITRE ATT&CK)</span>
        <span className="text-[11px]">Click tile to inspect technique</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = step.status === 'active';
          const isCompleted = step.status === 'completed';

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep?.(step.mitre)}
              className={`p-2.5 rounded-lg border text-left transition-all relative overflow-hidden group focus:outline-none focus:ring-1 focus:ring-coral ${
                isActive
                  ? 'bg-coral/10 border-coral text-text shadow-[0_0_12px_rgba(234,105,75,0.25)] ring-1 ring-coral/50'
                  : isCompleted
                  ? 'bg-[#151212] border-coral/40 text-text/90'
                  : 'bg-[#111114] border-[#26262C] text-muted opacity-60'
              }`}
            >
              {/* Header: MITRE & XP */}
              <div className="flex items-center justify-between font-mono text-[10px] mb-1.5">
                <span className={`px-1.5 py-0.5 rounded font-bold ${
                  isActive ? 'bg-coral text-white' : isCompleted ? 'bg-coral/20 text-coral' : 'bg-[#1A1A1E] text-muted'
                }`}>
                  {step.mitre}
                </span>
                <span className="text-[9.5px] text-muted font-semibold">+{step.xp} XP</span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-center gap-1.5 mt-1">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${
                  isActive ? 'text-coral animate-pulse' : isCompleted ? 'text-coral/80' : 'text-muted'
                }`} />
                <span className="text-[11px] font-heading font-medium leading-tight truncate">
                  {step.name}
                </span>
              </div>

              {/* Step indicator footer */}
              <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-muted/80">
                <span className="uppercase">{step.status}</span>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-muted/40 group-hover:text-coral transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

