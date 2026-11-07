'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import { useRangeSim } from '@/lib/rangeSim';
import { NetworkMap } from '@/components/visuals/NetworkMap';
import { AlertQueue, SOCAlert } from '@/components/visuals/AlertQueue';
import { LogStream, LogLine } from '@/components/visuals/LogStream';
import { PlayModeSwitch } from '@/components/visuals/PlayModeSwitch';
import { ReadinessPlanner } from '@/components/visuals/ReadinessPlanner';
import { PilotRequestForm } from '@/components/visuals/PilotRequestForm';
import { PhishingArchitectureDiagram } from '@/components/illustrations/PhishingArchitectureDiagram';
import { PRODUCT_CONTENT } from '@/content/product';
import { LAB_TOOLS, LabToolItem } from '@/content/lab-tools';
import { SECURITY_CONTENT } from '@/content/security-controls';
import { PlayMode } from '@/content/modes';
import { PageEffects } from '@/components/motion/PageEffects';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { DecodeText } from '@/components/motion/DecodeText';
import {
  Shield,
  ArrowRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Terminal,
  Server,
  FileCode,
  ExternalLink,
  Users,
  Target,
} from 'lucide-react';

export default function ProductPage() {
  const [playMode, setPlayMode] = useState<PlayMode>('self-service');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeAudienceTab, setActiveAudienceTab] = useState<'learners' | 'instructors' | 'security-leads'>('learners');

  const {
    state,
    scenario,
    play,
    pause,
    step,
    seek,
  } = useRangeSim('red-breakthrough', false);

  const consoleContainerRef = useRef<HTMLDivElement>(null);

  // Read URL hash on mount if present (#facilitator-led / #self-service)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'facilitator-led' || hash === 'self-service') {
        setPlayMode(hash as PlayMode);
      }
    }
  }, []);

  // Escape key closes fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Pause simulation when off-screen or tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && state.isPlaying) {
        pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && state.isPlaying) {
          pause();
        }
      },
      { threshold: 0.1 }
    );

    if (consoleContainerRef.current) {
      observer.observe(consoleContainerRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, [state.isPlaying, pause]);

  // Derived alerts & logs for preview console
  const socAlerts: SOCAlert[] = state.activeEvents
    .filter((e) => e.side === 'blue' || e.action === 'phish' || e.action === 'pivot')
    .map((e, idx) => ({
      id: `prod-alert-${idx}`,
      source: e.node ? `${e.node}.fintechcorp.local` : 'perimeter-waf',
      title: e.detail.title,
      severity: e.action === 'isolate' || e.action === 'contain' ? 'LOW' : e.action === 'pivot' || e.action === 'objective' ? 'CRITICAL' : 'HIGH',
      age: `${Math.max(1, Math.round(state.currentTime - e.t))}s ago`,
      status: e.action === 'isolate' || e.action === 'contain' ? 'CONTAINED' : e.action === 'triage' ? 'TRIAGED' : 'DETECTED',
      mitre: e.detail.mitre,
    }));

  const logLines: LogLine[] = state.activeEvents.map((e, idx) => ({
    id: `prod-log-${idx}`,
    timestamp: `+00:${e.t.toString().padStart(2, '0')}`,
    source: e.node ? e.node : e.side === 'red' ? 'C2-STRIKE' : 'SOC-INGEST',
    message: e.detail.log || e.detail.cmd || e.detail.description,
    isAnomalous: e.side === 'red',
  }));

  const verifiedLabTools: LabToolItem[] = LAB_TOOLS.filter((t) => t.verified);
  const currentAudience = PRODUCT_CONTENT.audiences.find((a) => a.id === activeAudienceTab) || PRODUCT_CONTENT.audiences[0];

  return (
    <div className="relative bg-[#09090B] text-text min-h-screen py-10 sm:py-16 selection:bg-teal/30 selection:text-white overflow-hidden">
      <PageEffects />
      <div className="cy-grid-bg" aria-hidden="true" />
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-20 relative z-10">
        
        {/* 2.1 HERO SECTION */}
        <section className="text-center space-y-5 max-w-3xl mx-auto pt-4">
          <div className="flex flex-wrap justify-center items-center gap-2">
            <Badge type="v1" size="sm" />
            <Badge type="v2" size="sm" />
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-text tracking-tightest leading-[1.12]">
            <SplitText text="Practice the attack." />{' '}
            <span className="gradient-text font-black">Prove the defense.</span>
          </h1>

          <Reveal variant="fade-up" delay={120}>
            <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed font-sans">
              {PRODUCT_CONTENT.hero.subtitle}
            </p>
          </Reveal>

          <Reveal variant="fade-up" delay={200}>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={PRODUCT_CONTENT.hero.primaryHref}
                className="cy-btn-sheen px-6 py-3 rounded-xl bg-teal text-black font-heading font-bold text-sm hover:bg-teal/90 transition-all shadow-lg hover:shadow-teal/20 flex items-center gap-2"
              >
                <span>{PRODUCT_CONTENT.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={PRODUCT_CONTENT.hero.secondaryHref}
                className="px-6 py-3 rounded-xl bg-[#14141A] border border-[#26262C] hover:border-teal/50 text-text font-heading font-medium text-sm transition-all"
              >
                {PRODUCT_CONTENT.hero.secondaryCta}
              </a>
            </div>
          </Reveal>
        </section>

        {/* 2.2 LIVE CONSOLE PREVIEW & PLAY-MODE SWITCH */}
        <section
          ref={consoleContainerRef}
          className={`space-y-4 transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 z-50 bg-[#09090B] p-6 overflow-y-auto'
              : 'relative'
          }`}
        >
          {/* Framed Admin Header Bar */}
          <div className="cy-hud bg-[#121217] border border-[#26262C] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
              <div>
                <div className="font-mono text-xs font-bold text-text flex items-center gap-2">
                  <span>ENTERPRISE RANGE CONSOLE (CONCEPT PREVIEW)</span>
                  <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-teal/15 text-teal border border-teal/30">
                    Active Session
                  </span>
                </div>
                <div className="text-[11px] text-muted font-sans">
                  fintechcorp.local • Proxmox Isolated Bridge
                </div>
              </div>
            </div>

            {/* Sim Controls */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => (state.isPlaying ? pause() : play())}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                  state.isPlaying ? 'bg-amber-500/20 text-amber-400' : 'bg-teal text-black hover:bg-teal/90'
                }`}
              >
                {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{state.isPlaying ? 'Pause' : 'Simulate'}</span>
              </button>
              <button
                onClick={() => step('forward')}
                className="p-1.5 rounded-lg bg-[#181820] border border-[#26262C] hover:text-teal text-muted"
                title="Step Forward"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => seek(0)}
                className="p-1.5 rounded-lg bg-[#181820] border border-[#26262C] hover:text-teal text-muted"
                title="Reset Simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg bg-[#181820] border border-[#26262C] hover:text-teal text-muted ml-2"
                title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Play Mode Switch Bar */}
          <PlayModeSwitch
            mode={playMode}
            onModeChange={setPlayMode}
            showComparisonTable={true}
          />

          {/* Console 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 space-y-4">
              <AlertQueue alerts={socAlerts} mttdSeconds={state.mttdSeconds} />
              <LogStream logs={logLines} title="Telemetry Pipeline Stream" />
            </div>

            <div className="lg:col-span-8 space-y-4">
              <NetworkMap nodeStates={state.nodeStates} />
              
              {/* Scoreboard banner */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#0D0D12] border border-[#26262C] text-xs font-mono">
                <div>
                  <span className="text-muted block text-[10px]">Red Attack Progress</span>
                  <span className="text-xl font-bold text-coral">{state.redXP} XP</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">Blue Containment Score</span>
                  <span className="text-xl font-bold text-teal">{state.blueXP} XP</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">Simulation Clock</span>
                  <span className="text-xl font-bold text-text">{Math.round(state.currentTime)}s / {scenario.duration}s</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2.3 ATTACK TIMELINE: DETECT -> ISOLATE -> MITIGATE -> REVIEW */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
              <SplitText text="Scenario Execution Workflow" />
            </h2>
            <Reveal variant="fade-up" delay={100}>
              <p className="text-xs sm:text-sm text-muted">
                Step-by-step telemetry correlation across synthetic domain fintechcorp.local (.invalid external domain).
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-cy-stagger="true">
            <Reveal variant="fade-up" className="cy-hover-card p-5 rounded-2xl bg-[#0D0E12] border border-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-coral/20 text-coral font-bold">STEP 01</span>
                <span className="text-muted">T1566.001</span>
              </div>
              <h3 className="font-heading font-bold text-base text-text">Detect</h3>
              <p className="text-xs text-muted leading-relaxed">
                <strong className="text-coral block mb-1">Red Action:</strong> Spearphishing lure sent from synthetic relay spoofing payroll@fintechcorp-secure.invalid.
              </p>
              <p className="text-xs text-muted leading-relaxed pt-2 border-t border-[#26262C]">
                <strong className="text-teal block mb-1">Blue Signal:</strong> Mail filter logs cryptographic SPF/DKIM verification failure and unapproved RFC 822 sender domain.
              </p>
            </Reveal>

            <Reveal variant="fade-up" className="cy-hover-card p-5 rounded-2xl bg-[#0D0E12] border border-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 font-bold">STEP 02</span>
                <span className="text-muted">T1059.001</span>
              </div>
              <h3 className="font-heading font-bold text-base text-text">Isolate</h3>
              <p className="text-xs text-muted leading-relaxed">
                <strong className="text-coral block mb-1">Red Action:</strong> Target executes macro spreadsheet attempting synthetic powershell child process on ws-402.
              </p>
              <p className="text-xs text-muted leading-relaxed pt-2 border-t border-[#26262C]">
                <strong className="text-teal block mb-1">Blue Signal:</strong> EDR fires high-severity alert. Defender triggers instant SDN firewall host drop rule on ws-402 (10.0.2.42).
              </p>
            </Reveal>

            <Reveal variant="fade-up" className="cy-hover-card p-5 rounded-2xl bg-[#0D0E12] border border-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-teal/20 text-teal font-bold">STEP 03</span>
                <span className="text-muted">T1021.002</span>
              </div>
              <h3 className="font-heading font-bold text-base text-text">Mitigate</h3>
              <p className="text-xs text-muted leading-relaxed">
                <strong className="text-coral block mb-1">Red Action:</strong> Adversary attempts cached credential replay via SMB admin shares to reach dc-01.
              </p>
              <p className="text-xs text-muted leading-relaxed pt-2 border-t border-[#26262C]">
                <strong className="text-teal block mb-1">Blue Signal:</strong> Defender purges Kerberos TGT tickets for compromised service accounts and blocks lateral subnet routes.
              </p>
            </Reveal>

            <Reveal variant="fade-up" className="cy-hover-card p-5 rounded-2xl bg-[#0D0E12] border border-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">STEP 04</span>
                <span className="text-muted">POST-INCIDENT</span>
              </div>
              <h3 className="font-heading font-bold text-base text-text">Review</h3>
              <p className="text-xs text-muted leading-relaxed">
                <strong className="text-text block mb-1">Debrief &amp; Audit:</strong> Ingest timeline correlated with audit_logs records, calculating MTTD and missed sub-techniques.
              </p>
              <p className="text-xs text-muted leading-relaxed pt-2 border-t border-[#26262C]">
                <strong className="text-teal block mb-1">Outcome:</strong> Zero lateral penetration of finance database vault. Actionable remediation steps logged.
              </p>
            </Reveal>
          </div>

          {/* Phishing Architecture Diagram Embed */}
          <Reveal variant="scale" className="bg-[#0E0F14] p-6 sm:p-8 rounded-2xl border border-border shadow-md space-y-2 cy-hud">
            <div className="font-mono text-xs text-muted pb-2 border-b border-[#26262C] flex items-center justify-between">
              <span>CONCEPTUAL ARCHITECTURE DIAGRAM (FINTECHCORP.LOCAL)</span>
              <span className="text-[10px] text-teal">Step 1 Detail</span>
            </div>
            <PhishingArchitectureDiagram />
          </Reveal>
        </section>

        {/* 2.4 PLAIN-LANGUAGE METRICS */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-text tracking-tight">
              <SplitText text="Operational Telemetry Benchmarks" />
            </h2>
            <Reveal variant="fade-up" delay={80}>
              <p className="text-xs text-muted">Computed from the range simulation engine.</p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-cy-stagger="true">
            {PRODUCT_CONTENT.metrics.map((metric, idx) => (
              <Reveal key={idx} variant="fade-up" className="cy-hover-card p-5 rounded-2xl bg-[#0E0F14] border border-border space-y-2">
                <span className="text-xs font-mono text-muted uppercase block">{metric.label}</span>
                <div className="text-2xl font-black font-heading text-text">{metric.value}</div>
                <p className="text-xs text-muted font-sans leading-relaxed">{metric.explanation}</p>
                <span className="text-[10px] font-mono text-muted/60 block pt-1 border-t border-[#26262C]/60 italic">
                  {metric.caption}
                </span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 2.5 ARCHITECTURE & DEPLOYMENT */}
        <section className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-teal" />
              <h2 className="font-heading font-bold text-2xl text-text tracking-tight">
                <SplitText text="Architecture & Deployment Truth" />
              </h2>
            </div>
            <Reveal variant="fade-up" delay={80}>
              <p className="text-xs sm:text-sm text-muted">
                Clear distinction between what runs today and our planned cloud platform roadmap.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* V1 Live */}
            <div data-cy-reveal="slide-left" className="cy-hover-card p-6 rounded-xl bg-[#0D0D12] border border-teal/30 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-text">
                  {PRODUCT_CONTENT.architecture.v1.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-teal/20 text-teal border border-teal/30">
                  {PRODUCT_CONTENT.architecture.v1.badge}
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {PRODUCT_CONTENT.architecture.v1.description}
              </p>
              <ul className="space-y-2 text-xs text-muted font-sans pt-2 border-t border-[#26262C]">
                {PRODUCT_CONTENT.architecture.v1.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* V2 Planned */}
            <div data-cy-reveal="slide-right" className="cy-hover-card p-6 rounded-xl bg-[#0D0D12] border border-border/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-text">
                  {PRODUCT_CONTENT.architecture.v2.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1C1C24] text-muted border border-border">
                  {PRODUCT_CONTENT.architecture.v2.badge}
                </span>
              </div>
              
              {/* Mandatory exact note */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                {PRODUCT_CONTENT.architecture.v2.note}
              </div>

              <p className="text-xs text-muted leading-relaxed">
                {PRODUCT_CONTENT.architecture.v2.description}
              </p>
              <ul className="space-y-2 text-xs text-muted font-sans pt-2 border-t border-[#26262C]">
                {PRODUCT_CONTENT.architecture.v2.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted shrink-0 mt-1.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 2.6 LAB TOOLS (RENDER ONLY VERIFIED: TRUE) */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
              <SplitText text="Verified Range Lab Tools" />
            </h2>
            <Reveal variant="fade-up" delay={80}>
              <p className="text-xs sm:text-sm text-muted">
                Live components active in the Proxmox virtual environment. Text-only verified specifications.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-cy-stagger="true">
            {verifiedLabTools.map((tool) => (
              <Reveal key={tool.id} variant="fade-up" className="cy-hover-card p-5 rounded-2xl bg-[#0E0F14] border border-border hover:border-teal/50 transition-all space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-text">{tool.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase bg-teal/15 text-teal border border-teal/30">
                    Live V1
                  </span>
                </div>
                <p className="text-xs text-muted font-sans leading-relaxed">{tool.role}</p>
                <div className="text-[10px] font-mono text-teal pt-1 border-t border-[#26262C]/60 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Verified in codebase</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 2.7 AUDIENCE TABS */}
        <section className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="space-y-1">
              <h2 className="font-heading font-bold text-2xl text-text tracking-tight">Built for Your Mission</h2>
              <p className="text-xs sm:text-sm text-muted">Focused workflows for students, class instructors, and SOC leadership.</p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#09090B] p-1.5 rounded-xl border border-border font-mono text-xs">
              {(['learners', 'instructors', 'security-leads'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveAudienceTab(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeAudienceTab === tab
                      ? 'bg-teal text-black font-bold shadow-sm'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  {tab === 'learners' ? 'For learners' : tab === 'instructors' ? 'For instructors' : 'For security leads'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-text">{currentAudience.title}</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">{currentAudience.description}</p>
              
              <div className="space-y-2 pt-2 border-t border-border">
                <span className="font-mono text-xs uppercase tracking-wider text-teal font-semibold block">Key Operational Outcomes</span>
                <ul className="space-y-2 text-xs text-muted font-sans">
                  {currentAudience.outcomes.map((out, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0D0D12] border border-[#26262C] space-y-3 font-mono text-xs">
              <span className="text-muted uppercase text-[11px] block font-semibold">What you see in the product:</span>
              <div className="space-y-2">
                {currentAudience.productView.map((view, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#14141B] border border-border flex items-center gap-2 text-text">
                    <Terminal className="w-4 h-4 text-teal shrink-0" />
                    <span>{view}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2.8 TRUST WITHOUT BADGES */}
        <Reveal variant="fade-up" className="bg-[#101015] rounded-2xl border border-coral/30 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#26262C] pb-4">
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-text">
                What You Can Verify Today
              </h2>
              <p className="text-xs text-muted font-sans mt-0.5">
                Transparent security claims and verified operational facts without manufactured badges or fake certifications.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/security"
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-teal hover:border-teal transition-colors"
              >
                Security Page
              </Link>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-muted font-sans leading-relaxed">
            <span className="font-mono text-coral uppercase font-bold text-[11px] block">What we do not claim:</span>
            {SECURITY_CONTENT.honestyBlock.points.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-1.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* 2.9 ROADMAP (3 COLUMNS) */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
              <SplitText text="Platform Delivery Roadmap" />
            </h2>
            <Reveal variant="fade-up" delay={80}>
              <p className="text-xs sm:text-sm text-muted">
                Live V1 features vs. upcoming V2 cloud range capabilities.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-cy-stagger="true">
            {PRODUCT_CONTENT.roadmap.map((col, idx) => (
              <Reveal
                key={idx}
                variant="fade-up"
                className={`cy-hover-card p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  col.badgeType === 'teal'
                    ? 'bg-surface border-teal/30'
                    : col.badgeType === 'coral'
                    ? 'bg-surface border-coral/30'
                    : 'bg-[#0D0D12] border-border/50 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-base text-text">{col.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        col.badgeType === 'teal'
                          ? 'bg-teal/20 text-teal'
                          : col.badgeType === 'coral'
                          ? 'bg-coral/20 text-coral'
                          : 'bg-[#1C1C24] text-muted'
                      }`}
                    >
                      {col.badge}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-muted font-sans pt-2 border-t border-[#26262C]">
                    {col.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 2.10 READINESS PLANNER */}
        <Reveal variant="scale">
          <ReadinessPlanner />
        </Reveal>

        {/* 2.11 PILOT REQUEST FORM */}
        <Reveal variant="scale">
          <PilotRequestForm />
        </Reveal>

        {/* 2.12 RESOURCES & ARCHITECTURE LINKS */}
        <Reveal variant="fade-up" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            <span className="text-text font-bold block mb-1">Architecture &amp; Security Resources</span>
            <span className="text-muted">Zero gated downloads or fake whitepapers. Direct links to live technical manifests.</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/demo/architecture" className="px-3.5 py-2 rounded-xl bg-[#14141B] border border-border text-teal hover:border-teal flex items-center gap-1.5 transition-colors">
              <span>Proxmox Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/security" className="px-3.5 py-2 rounded-xl bg-[#14141B] border border-border text-teal hover:border-teal flex items-center gap-1.5 transition-colors">
              <span>Security Posture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
