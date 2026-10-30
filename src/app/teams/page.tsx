'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import { useRangeSim } from '@/lib/rangeSim';
import { NetworkMap } from '@/components/visuals/NetworkMap';
import { KillChain } from '@/components/visuals/KillChain';
import { AlertQueue, SOCAlert } from '@/components/visuals/AlertQueue';
import { LogStream, LogLine } from '@/components/visuals/LogStream';
import { TerminalPane } from '@/components/visuals/TerminalPane';
import { TEAMS_CONTENT } from '@/content/teams';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  SlidersHorizontal,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Shield,
  Users,
  Target,
  Zap,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function TeamsPage() {
  const {
    state,
    scenario,
    play,
    pause,
    step,
    seek,
    setSpeed,
    switchScenario,
    makeDecision,
  } = useRangeSim('red-breakthrough', false);

  // UI View States
  const [activeMobileTab, setActiveMobileTab] = useState<'red' | 'battle' | 'blue'>('battle');
  const [viewMode, setViewMode] = useState<'split' | 'red' | 'blue'>('split');
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'node' | 'alert' | 'technique' | 'event';
    id: string;
    title: string;
    attackerMove: string;
    defenderDetect: string;
    attackerAdapt: string;
  } | null>(null);

  // Matchmaking Explainer State
  const [matchmakingMode, setMatchmakingMode] = useState<'group' | 'solo'>('group');
  const [matchStep, setMatchStep] = useState<number>(3);

  // Current active event
  const currentEvent = state.activeEvents[state.activeEvents.length - 1];

  // Derive SOC alerts from past events
  const socAlerts: SOCAlert[] = state.activeEvents
    .filter((e) => e.side === 'blue' || e.action === 'phish' || e.action === 'pivot')
    .map((e, idx) => ({
      id: `alert-${idx}`,
      source: e.node ? `${e.node}.fintechcorp.local` : 'perimeter-waf',
      title: e.detail.title,
      severity: e.action === 'isolate' || e.action === 'contain' ? 'LOW' : e.action === 'pivot' || e.action === 'objective' ? 'CRITICAL' : 'HIGH',
      age: `${Math.max(1, Math.round(state.currentTime - e.t))}s ago`,
      status: e.action === 'isolate' || e.action === 'contain' ? 'CONTAINED' : e.action === 'triage' ? 'TRIAGED' : 'DETECTED',
      mitre: e.detail.mitre,
    }));

  // Derive log lines
  const logLines: LogLine[] = state.activeEvents.map((e, idx) => ({
    id: `log-${idx}`,
    timestamp: `+00:${e.t.toString().padStart(2, '0')}`,
    source: e.node ? e.node : e.side === 'red' ? 'C2-STRIKE' : 'SOC-INGEST',
    message: e.detail.log || e.detail.cmd || e.detail.description,
    isAnomalous: e.side === 'red',
  }));

  // Terminal commands history
  const terminalHistory = state.activeEvents
    .filter((e) => e.side === 'red' && e.detail.cmd)
    .map((e) => e.detail.cmd!);

  const handleSelectNode = (nodeId: string) => {
    setSelectedEntity({
      type: 'node',
      id: nodeId,
      title: `Node Inspection: ${nodeId}.fintechcorp.local`,
      attackerMove: `Adversary targets ${nodeId} using synthetic MITRE technique to expand access footprint.`,
      defenderDetect: `Sysmon and network flow logs correlate anomalous connection handles from ${nodeId}.`,
      attackerAdapt: `Rotate communication intervals or camouflage payload within scheduled OS tasks.`,
    });
  };

  const handleSelectStep = (mitreId: string) => {
    setSelectedEntity({
      type: 'technique',
      id: mitreId,
      title: `MITRE ATT&CK: ${mitreId}`,
      attackerMove: `Offensive operator executes ${mitreId} technique across RFC 1918 segment.`,
      defenderDetect: `Sigma rule evaluation triggers high-priority alert in blue SOC queue.`,
      attackerAdapt: `Obfuscate script invocations and execute strictly via in-memory reflections.`,
    });
  };

  return (
    <div className="bg-[#09090B] text-text min-h-screen py-10 sm:py-16 selection:bg-teal/30 selection:text-white">
      {/* Background Arc Watermark */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-10 overflow-hidden">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <circle cx="400" cy="400" r="320" fill="none" stroke="#17ABA9" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="400" cy="400" r="240" fill="none" stroke="#EA694B" strokeWidth="2" />
          <circle cx="400" cy="400" r="160" fill="none" stroke="#17ABA9" strokeWidth="2" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-surface border border-border text-muted">
              {TEAMS_CONTENT.hero.badge}
            </span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-text tracking-tightest">
            Two sides. <span className="bg-gradient-to-r from-coral via-[#D88A6E] to-teal bg-clip-text text-transparent">One live range.</span>
          </h1>

          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed font-sans">
            {TEAMS_CONTENT.hero.subtitle}
          </p>

          {/* Split Red/Blue Seam */}
          <div className="pt-2 flex items-center justify-center">
            <div className="h-1 w-64 rounded-full bg-gradient-to-r from-coral via-transparent to-teal" />
          </div>
        </div>

        {/* 2.1 LIVE BATTLE ARENA */}
        <section className="space-y-4">
          {/* Arena Control Bar */}
          <div className="bg-[#111114] border border-[#26262C] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            {/* Left: Scenario Switcher */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-muted hidden sm:inline">Scenario:</span>
              <button
                onClick={() => switchScenario('red-breakthrough')}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  scenario.id === 'red-breakthrough'
                    ? 'bg-coral/15 border-coral text-coral font-bold shadow-[0_0_8px_rgba(234,105,75,0.2)]'
                    : 'bg-[#18181D] border-[#26262C] text-muted hover:text-text'
                }`}
              >
                Red Breakthrough
              </button>
              <button
                onClick={() => switchScenario('blue-lockdown')}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  scenario.id === 'blue-lockdown'
                    ? 'bg-teal/15 border-teal text-teal font-bold shadow-[0_0_8px_rgba(23,171,169,0.2)]'
                    : 'bg-[#18181D] border-[#26262C] text-muted hover:text-text'
                }`}
              >
                Blue Holds the Line
              </button>
            </div>

            {/* Center: Play / Pause / Step / Replay Controls */}
            <div className="flex items-center gap-1.5 font-mono text-xs bg-[#09090B] p-1.5 rounded-xl border border-[#26262C]">
              <button
                onClick={() => step('backward')}
                aria-label="Step backward"
                className="p-1.5 rounded hover:bg-[#1C1C22] text-muted hover:text-text transition-colors"
                title="Step backward"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => (state.isPlaying ? pause() : play())}
                className={`px-3 py-1 rounded font-bold flex items-center gap-1.5 transition-colors ${
                  state.isPlaying ? 'bg-amber-500/20 text-amber-400' : 'bg-teal text-black hover:bg-teal/90'
                }`}
              >
                {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{state.isPlaying ? 'Pause' : 'Watch'}</span>
              </button>
              <button
                onClick={() => step('forward')}
                aria-label="Step forward"
                className="p-1.5 rounded hover:bg-[#1C1C22] text-muted hover:text-text transition-colors"
                title="Step forward"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => seek(0)}
                aria-label="Replay simulation"
                className="p-1.5 rounded hover:bg-[#1C1C22] text-muted hover:text-text transition-colors"
                title="Replay from start"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-[#26262C] mx-1" />

              {/* Speed toggle */}
              <button
                onClick={() => setSpeed(state.speed === 1 ? 2 : 1)}
                className="px-2 py-0.5 rounded text-[11px] font-bold text-muted hover:text-teal"
              >
                {state.speed}x
              </button>

              <div className="h-4 w-px bg-[#26262C] mx-1" />

              <span className="text-[11px] text-muted px-1.5">
                {Math.round(state.currentTime)}s / {scenario.duration}s
              </span>
            </div>

            {/* Right: View mode switcher (Split / Attacker only / Defender only) */}
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-muted text-[11px] mr-1 hidden lg:inline">View:</span>
              {(['split', 'red', 'blue'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-2.5 py-1 rounded text-[11px] capitalize border transition-all ${
                    viewMode === mode
                      ? mode === 'red'
                        ? 'bg-coral/20 border-coral text-coral font-bold'
                        : mode === 'blue'
                        ? 'bg-teal/20 border-teal text-teal font-bold'
                        : 'bg-[#22222A] border-text/40 text-text font-bold'
                      : 'bg-[#18181D] border-transparent text-muted hover:text-text'
                  }`}
                >
                  {mode === 'split' ? 'Split' : mode === 'red' ? 'Attacker only' : 'Defender only'}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Tab Selector */}
          <div className="flex sm:hidden border border-[#26262C] rounded-xl overflow-hidden font-mono text-xs">
            <button
              onClick={() => setActiveMobileTab('red')}
              className={`flex-1 py-2 text-center ${activeMobileTab === 'red' ? 'bg-coral text-white font-bold' : 'bg-[#111114] text-muted'}`}
            >
              Red Console
            </button>
            <button
              onClick={() => setActiveMobileTab('battle')}
              className={`flex-1 py-2 text-center ${activeMobileTab === 'battle' ? 'bg-[#22222A] text-white font-bold' : 'bg-[#111114] text-muted'}`}
            >
              Battle Map
            </button>
            <button
              onClick={() => setActiveMobileTab('blue')}
              className={`flex-1 py-2 text-center ${activeMobileTab === 'blue' ? 'bg-teal text-white font-bold' : 'bg-[#111114] text-muted'}`}
            >
              Blue SOC
            </button>
          </div>

          {/* Arena 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Column 1: RED OPERATOR CONSOLE */}
            <div
              className={`space-y-3 ${
                viewMode === 'blue' ? 'hidden' : viewMode === 'red' ? 'lg:col-span-6' : 'lg:col-span-3'
              } ${activeMobileTab !== 'red' ? 'hidden sm:block' : 'block'}`}
            >
              <div className="flex items-center justify-between text-xs font-mono px-1">
                <span className="text-coral font-bold flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> RED SQUAD OPERATOR
                </span>
                <span className="text-muted">XP: <strong className="text-coral">{state.redXP}</strong></span>
              </div>

              <TerminalPane
                currentCommand={currentEvent?.side === 'red' ? currentEvent.detail.cmd : undefined}
                history={terminalHistory}
                title="ATTACK STRIKE CLI"
              />

              <KillChain
                currentAction={currentEvent?.action}
                activeMitre={currentEvent?.detail.mitre}
                onSelectStep={handleSelectStep}
              />
            </div>

            {/* Column 2: BATTLE MAP */}
            <div
              className={`space-y-3 ${
                viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-6'
              } ${activeMobileTab !== 'battle' ? 'hidden sm:block' : 'block'}`}
            >
              <NetworkMap
                nodeStates={state.nodeStates}
                selectedNode={selectedEntity?.id}
                onSelectNode={handleSelectNode}
              />

              {/* "What just happened" Drawer */}
              <div className="p-4 rounded-xl bg-[#101014] border border-[#26262C] space-y-2.5 font-sans">
                <div className="flex items-center justify-between border-b border-[#26262C]/60 pb-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-text font-semibold">
                    <Info className="w-4 h-4 text-teal" />
                    <span>WHAT JUST HAPPENED</span>
                  </div>
                  {selectedEntity && (
                    <button
                      onClick={() => setSelectedEntity(null)}
                      className="text-[10px] font-mono text-muted hover:text-teal underline"
                    >
                      Clear Pin
                    </button>
                  )}
                </div>

                {selectedEntity ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="font-mono text-teal font-semibold">{selectedEntity.title}</div>
                    <p className="text-muted"><strong className="text-coral font-mono">Adversary:</strong> {selectedEntity.attackerMove}</p>
                    <p className="text-muted"><strong className="text-teal font-mono">Detection:</strong> {selectedEntity.defenderDetect}</p>
                    <p className="text-muted"><strong className="text-[#A1A1AA] font-mono">Adaptation:</strong> {selectedEntity.attackerAdapt}</p>
                  </div>
                ) : currentEvent ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="font-mono text-text font-semibold">
                      [{currentEvent.detail.mitre || currentEvent.action.toUpperCase()}] {currentEvent.detail.title}
                    </div>
                    <p className="text-muted leading-relaxed">
                      <strong className="text-coral font-mono">1. Attacker's move:</strong> {currentEvent.detail.attackerMove || currentEvent.detail.description}
                    </p>
                    <p className="text-muted leading-relaxed">
                      <strong className="text-teal font-mono">2. Defender detection:</strong> {currentEvent.detail.defenderDetect || 'Telemetry correlated via Sysmon and audit logs.'}
                    </p>
                    <p className="text-muted leading-relaxed">
                      <strong className="text-[#A1A1AA] font-mono">3. Attacker adaptation:</strong> {currentEvent.detail.attackerAdapt || 'Adversary shifts timing or switches protocols.'}
                    </p>
                  </div>
                ) : (
                  <div className="text-xs text-muted/60 font-mono py-2">
                    Click Watch or Step to initiate the live scenario simulation.
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: BLUE SOC CONSOLE */}
            <div
              className={`space-y-3 ${
                viewMode === 'red' ? 'hidden' : viewMode === 'blue' ? 'lg:col-span-6' : 'lg:col-span-3'
              } ${activeMobileTab !== 'blue' ? 'hidden sm:block' : 'block'}`}
            >
              <div className="flex items-center justify-between text-xs font-mono px-1">
                <span className="text-teal font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> BLUE SOC ANALYST
                </span>
                <span className="text-muted">XP: <strong className="text-teal">{state.blueXP}</strong></span>
              </div>

              <AlertQueue
                alerts={socAlerts}
                mttdSeconds={state.mttdSeconds}
                onSelectAlert={(a) => handleSelectNode(a.source.split('.')[0])}
                onContain={(id) => handleSelectNode('ws-402')}
              />

              <LogStream logs={logLines} />
            </div>
          </div>

          {/* "Be the defender" Decision Interactive Modal */}
          {state.activeDecision && (
            <div className="p-5 rounded-2xl bg-[#14141B] border-2 border-teal shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal font-mono text-sm font-bold">
                  <Shield className="w-4 h-4 animate-pulse" />
                  <span>BE THE DEFENDER: TACTICAL DECISION POINT</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-teal/20 text-teal text-[11px] font-mono">Simulation Paused</span>
              </div>

              <p className="text-sm text-text font-medium leading-relaxed">
                {state.activeDecision.prompt}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {state.activeDecision.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => makeDecision(opt.id)}
                    className="p-3.5 rounded-xl bg-[#0D0D10] border border-[#26262C] hover:border-teal hover:bg-teal/5 text-left transition-all text-xs space-y-1.5 group focus:outline-none focus:ring-1 focus:ring-teal"
                  >
                    <div className="font-heading font-semibold text-text group-hover:text-teal transition-colors">
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-muted font-mono">+{opt.xpDelta} XP (Blue)</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Decision Feedback Display */}
          {state.decisionFeedback && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${
                state.decisionFeedback.correct
                  ? 'bg-teal/15 border-teal text-teal'
                  : 'bg-coral/15 border-coral text-coral'
              }`}
            >
              <div className="flex items-center gap-2">
                {state.decisionFeedback.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span><strong>Verdict:</strong> {state.decisionFeedback.feedback}</span>
              </div>
              <span className="text-[10px] text-muted">Resuming simulation...</span>
            </div>
          )}

          {/* Round Review End Card */}
          {state.isCompleted && (
            <div className="p-6 rounded-2xl bg-[#111116] border border-border space-y-4 select-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal" />
                  <h3 className="font-heading font-bold text-lg text-text">ROUND REVIEW</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-muted">
                  {scenario.review.labeled}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#16161D] border border-coral/30">
                  <span className="text-muted text-[11px]">Red Attack Score</span>
                  <div className="text-2xl font-black text-coral mt-1">{scenario.review.redScore} XP</div>
                </div>
                <div className="p-3 rounded-xl bg-[#16161D] border border-teal/30">
                  <span className="text-muted text-[11px]">Blue Defense Score</span>
                  <div className="text-2xl font-black text-teal mt-1">{scenario.review.blueScore} XP</div>
                </div>
                <div className="p-3 rounded-xl bg-[#16161D] border border-border">
                  <span className="text-muted text-[11px]">Mean Time to Detect (MTTD)</span>
                  <div className="text-2xl font-black text-text mt-1">{scenario.review.mttd}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#26262C] text-xs font-sans text-muted">
                <strong className="text-text font-mono mr-1">Key Tactical Takeaway:</strong>
                {scenario.review.lesson}
              </div>

              <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={() => seek(0)}
                  className="px-4 py-2 rounded-lg bg-[#18181D] hover:bg-[#22222A] text-text border border-[#26262C]"
                >
                  Replay Scenario
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 2.2 HOW MATCHMAKING WORKS */}
        <section className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal" />
              <h2 className="font-heading font-bold text-2xl text-text tracking-tight">
                {TEAMS_CONTENT.matchmaking.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted max-w-2xl">
              {TEAMS_CONTENT.matchmaking.subtitle}
            </p>
          </div>

          {/* Toggle switcher: Bringing group vs Match me */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="inline-flex rounded-xl p-1 bg-[#09090B] border border-border font-mono text-xs">
              <button
                onClick={() => setMatchmakingMode('group')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  matchmakingMode === 'group'
                    ? 'bg-teal text-black font-bold shadow-sm'
                    : 'text-muted hover:text-text'
                }`}
              >
                I'm bringing a group of 3+
              </button>
              <button
                onClick={() => setMatchmakingMode('solo')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  matchmakingMode === 'solo'
                    ? 'bg-teal text-black font-bold shadow-sm'
                    : 'text-muted hover:text-text'
                }`}
              >
                Match me with others
              </button>
            </div>

            {/* Rule Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {TEAMS_CONTENT.matchmaking.chips.map((chip, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#141419] border border-border text-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Animated Matchmaking Lanes */}
          <div className="p-6 rounded-xl bg-[#0B0C0E] border border-border space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {TEAMS_CONTENT.matchmaking.steps.map((st, idx) => {
                const isCurrent = matchStep === st.step;
                const isPassed = matchStep > st.step;

                return (
                  <div
                    key={st.step}
                    onClick={() => setMatchStep(st.step)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[#181820] border-teal shadow-[0_0_12px_rgba(23,171,169,0.25)]'
                        : isPassed
                        ? 'bg-[#121217] border-teal/40 opacity-90'
                        : 'bg-[#0E0E12] border-[#26262C] opacity-50'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">
                      Step 0{st.step}
                    </div>
                    <div className="font-heading font-semibold text-xs text-text mb-1">
                      {st.title}
                    </div>
                    <p className="text-[11px] text-muted leading-snug">
                      {st.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Visual simulation lane depending on mode */}
            <div className="p-4 rounded-xl bg-[#121217] border border-[#26262C] font-mono text-xs">
              {matchmakingMode === 'group' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-muted text-[11px]">
                    <span>SQUAD LOBBY: <strong className="text-text">Alpha-Cohort</strong></span>
                    <span className="text-teal font-semibold">Ready for deployment (3/3 Operators)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-[#181820] border border-teal/40 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal" />
                      <div>
                        <div className="font-bold text-text text-xs">Operator_01 (Host)</div>
                        <div className="text-[10px] text-muted">Role: Blue SOC Lead</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#181820] border border-teal/40 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal" />
                      <div>
                        <div className="font-bold text-text text-xs">Operator_02</div>
                        <div className="text-[10px] text-muted">Role: Threat Hunter</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#181820] border border-teal/40 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal" />
                      <div>
                        <div className="font-bold text-text text-xs">Operator_03</div>
                        <div className="text-[10px] text-muted">Role: SDN Firewall Ops</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-muted text-[11px]">
                    <span>GLOBAL QUEUE: <strong className="text-teal">6 Operators Waiting</strong></span>
                    <span>Pairing: Red Squad (3) vs Blue Squad (3)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {['#R-401 (Red)', '#R-402 (Red)', '#R-403 (Red)', '#B-101 (Blue)', '#B-102 (Blue)', '#B-103 (Blue)'].map((token, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-md text-[11px] font-mono border ${
                          token.includes('Red')
                            ? 'bg-coral/10 border-coral text-coral'
                            : 'bg-teal/10 border-teal text-teal'
                        }`}
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Matchmaking Disclaimer */}
            <div className="text-[11px] text-muted/70 font-mono italic">
              {TEAMS_CONTENT.matchmaking.disclaimer}
            </div>
          </div>
        </section>

        {/* 2.3 WHAT YOU LEARN: 4 Benefit Cards */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
              What You Learn
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Every offensive technique paired directly with its defensive mirror.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAMS_CONTENT.benefits.map((card) => (
              <div
                key={card.id}
                className="bg-surface p-6 rounded-2xl border border-border hover:border-teal/50 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg text-text">
                    {card.title}
                  </h3>
                  <div className="w-8 h-8 rounded-lg bg-[#181820] border border-[#26262C] flex items-center justify-center text-teal">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-border/80">
                  <div className="space-y-1">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-coral font-semibold">
                      Attacker Perspective
                    </div>
                    <p className="text-muted leading-relaxed">
                      {card.attackerSkill}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-teal font-semibold">
                      Defender Mirror
                    </div>
                    <p className="text-muted leading-relaxed">
                      {card.defenderMirror}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety Strip */}
          <div className="p-4 rounded-xl bg-[#0D0D10] border border-[#26262C] text-center font-mono text-xs text-muted">
            <span className="text-teal font-bold mr-2">STRICT ISOLATION GUARANTEE:</span>
            {TEAMS_CONTENT.safetyStrip}
          </div>
        </section>

        {/* 2.4 ROLE LANES */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
              Specialized Role Lanes
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Deepen operational craft across offensive, defensive, infrastructure, and governance disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAMS_CONTENT.roleLanes.map((role) => (
              <div
                key={role.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                  role.badgeType === 'coral'
                    ? 'bg-surface border-coral/30 hover:border-coral'
                    : role.badgeType === 'teal'
                    ? 'bg-surface border-teal/30 hover:border-teal'
                    : role.isComingSoon
                    ? 'bg-[#0E0E12] border-border/40 opacity-70'
                    : 'bg-surface border-border hover:border-text/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        role.badgeType === 'coral'
                          ? 'bg-coral/20 text-coral'
                          : role.badgeType === 'teal'
                          ? 'bg-teal/20 text-teal'
                          : role.isComingSoon
                          ? 'bg-[#1C1C22] text-muted'
                          : 'bg-[#22222A] text-text'
                      }`}
                    >
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-text">
                    {role.title}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-border/60">
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                    Core Disciplines
                  </span>
                  <ul className="space-y-1 text-xs text-text/80">
                    {role.skills.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-teal" />
                        <span className="text-[11.5px] truncate">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2.5 CTA BAND */}
        <section className="bg-gradient-to-r from-[#111116] via-[#16161D] to-[#111116] border border-border rounded-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2">
            <Badge type="v1" size="md" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text">
              {TEAMS_CONTENT.cta.headline}
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              {TEAMS_CONTENT.cta.sub}
            </p>
          </div>

          <div>
            <Link
              href={TEAMS_CONTENT.cta.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal text-black font-heading font-bold text-sm hover:bg-teal/90 transition-all shadow-lg hover:shadow-teal/20"
            >
              <span>{TEAMS_CONTENT.cta.buttonLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
