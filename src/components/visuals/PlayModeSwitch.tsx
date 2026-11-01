'use client';

import React from 'react';
import { PlayMode, PLAY_MODE_COMPARISON } from '@/content/modes';
import { Users, Bot, Sliders, FileText, CheckCircle2 } from 'lucide-react';

interface PlayModeSwitchProps {
  mode: PlayMode;
  onModeChange: (newMode: PlayMode) => void;
  showComparisonTable?: boolean;
  className?: string;
}

export function PlayModeSwitch({
  mode,
  onModeChange,
  showComparisonTable = true,
  className = '',
}: PlayModeSwitchProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      onModeChange('self-service');
      if (typeof window !== 'undefined') window.location.hash = 'self-service';
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      onModeChange('facilitator-led');
      if (typeof window !== 'undefined') window.location.hash = 'facilitator-led';
    }
  };

  const selectMode = (newMode: PlayMode) => {
    onModeChange(newMode);
    if (typeof window !== 'undefined') {
      window.location.hash = newMode;
    }
  };

  return (
    <div className={`space-y-6 select-none ${className}`}>
      {/* Segmented Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-[#0D0D12] border border-[#26262C]">
        <div className="flex items-center gap-2 px-3 text-xs font-mono text-muted">
          <Sliders className="w-4 h-4 text-teal" />
          <span className="font-semibold text-text uppercase tracking-wider">Play-Mode Architecture:</span>
        </div>

        <div
          role="tablist"
          aria-label="Simulation Play Mode"
          onKeyDown={handleKeyDown}
          className="inline-flex rounded-xl p-1 bg-[#14141A] border border-[#26262C]"
        >
          <button
            role="tab"
            id="tab-facilitator"
            aria-selected={mode === 'facilitator-led'}
            aria-controls="panel-facilitator"
            tabIndex={mode === 'facilitator-led' ? 0 : -1}
            onClick={() => selectMode('facilitator-led')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal ${
              mode === 'facilitator-led'
                ? 'bg-coral text-white shadow-md font-bold'
                : 'text-muted hover:text-text'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Facilitator-led</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 font-mono">Cohort</span>
          </button>

          <button
            role="tab"
            id="tab-self-service"
            aria-selected={mode === 'self-service'}
            aria-controls="panel-self-service"
            tabIndex={mode === 'self-service' ? 0 : -1}
            onClick={() => selectMode('self-service')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal ${
              mode === 'self-service'
                ? 'bg-teal text-black shadow-md font-bold'
                : 'text-muted hover:text-text'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Self-service</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 font-mono">Automated</span>
          </button>
        </div>
      </div>

      {/* Live Comparison Table */}
      {showComparisonTable && (
        <div className="rounded-xl border border-border overflow-hidden bg-[#0A0A0E] text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border bg-[#121217] text-muted font-mono text-[11px] uppercase tracking-wider font-semibold">
            <div className="p-3 md:col-span-3">Dimension</div>
            <div className={`p-3 md:col-span-4 transition-colors ${mode === 'facilitator-led' ? 'bg-coral/10 text-coral' : ''}`}>
              Facilitator-led (Instructor &amp; Team Cohort)
            </div>
            <div className={`p-3 md:col-span-5 transition-colors ${mode === 'self-service' ? 'bg-teal/10 text-teal' : ''}`}>
              Self-service (Automated Bot &amp; Coach)
            </div>
          </div>

          <div className="divide-y divide-[#26262C]/60 text-muted">
            {PLAY_MODE_COMPARISON.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#26262C]/60 text-xs">
                <div className="p-3 md:col-span-3 font-mono font-medium text-text bg-[#0E0E14]">
                  {row.dimension}
                </div>
                <div className={`p-3 md:col-span-4 leading-relaxed transition-colors ${mode === 'facilitator-led' ? 'bg-coral/5 text-text' : 'opacity-70'}`}>
                  {row.facilitator}
                </div>
                <div className={`p-3 md:col-span-5 leading-relaxed transition-colors ${mode === 'self-service' ? 'bg-teal/5 text-text' : 'opacity-70'}`}>
                  {row.selfService}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

