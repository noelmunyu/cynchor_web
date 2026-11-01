'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Shield, 
  Crosshair, 
  Terminal, 
  Users, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Radio, 
  AlertCircle,
  X,
  Zap,
  Info
} from 'lucide-react';

export type ScreenView = 'live-range' | 'detection-feed' | 'team-lobby';

// 5 Attack Steps
interface AttackStep {
  id: number;
  name: string;
  subtext: string;
  xp: number;
  triggerTime: number; // seconds into scenario when it activates
  doneTime: number;    // seconds into scenario when it completes
  detail: string;
}

const RED_STEPS: AttackStep[] = [
  { 
    id: 1, 
    name: 'Recon (Active Directory LDAP)', 
    subtext: 'Directory query enumeration', 
    xp: 150, 
    triggerTime: 1, 
    doneTime: 5,
    detail: 'Attacker enumerates users via LDAP; defender flags the unusual query volume.'
  },
  { 
    id: 2, 
    name: 'Phishing lure (Lookalike domain)', 
    subtext: 'Harvesting employee credentials', 
    xp: 280, 
    triggerTime: 8, 
    doneTime: 14,
    detail: 'Attacker deploys lookalike domain lure; gateway detects and quarantines malicious email.'
  },
  { 
    id: 3, 
    name: 'Initial foothold (Endpoint)', 
    subtext: 'Workstation shell execution', 
    xp: 180, 
    triggerTime: 17, 
    doneTime: 23,
    detail: 'Attacker attempts endpoint command execution; SOC flags anomalous process and isolates host.'
  },
  { 
    id: 4, 
    name: 'Lateral pivot (SMB sweep)', 
    subtext: 'Subnet traversal & kerberoasting', 
    xp: 250, 
    triggerTime: 26, 
    doneTime: 33,
    detail: 'Attacker initiates lateral SMB scan; SDN firewall rules contain traversal attempt.'
  },
  { 
    id: 5, 
    name: 'Objective: reach finance server', 
    subtext: 'Target database access & staging', 
    xp: 400, 
    triggerTime: 36, 
    doneTime: 44,
    detail: 'Attacker attempts core database query staging before defensive isolation drops the session.'
  },
];

// Blue Alerts reacting to Red steps
interface BlueAlert {
  id: number;
  stepId: number;
  timeStr: string;
  title: string;
  appearTime: number;
  containedTime: number;
  xp: number;
  detail: string;
}

const BLUE_ALERTS_SCENARIO_1: BlueAlert[] = [
  { id: 1, stepId: 1, timeStr: '24:12', title: 'Directory query anomaly flagged', appearTime: 6, containedTime: 9, xp: 140, detail: 'SIEM correlates 1,200 LDAP queries from unapproved workstation.' },
  { id: 2, stepId: 2, timeStr: '23:48', title: 'Phishing email quarantined', appearTime: 15, containedTime: 18, xp: 200, detail: 'Mail filter matches spoofed domain header and revokes inbox delivery.' },
  { id: 3, stepId: 3, timeStr: '23:18', title: 'Suspicious SSO login contained', appearTime: 24, containedTime: 28, xp: 160, detail: 'Impossible travel alert triggered; session token invalidated.' },
  { id: 4, stepId: 4, timeStr: '22:45', title: 'Lateral movement blocked at segment', appearTime: 34, containedTime: 39, xp: 220, detail: 'Proxmox SDN filter drops cross-VLAN SMB traffic to banking vault.' },
];

const BLUE_ALERTS_SCENARIO_2: BlueAlert[] = [
  { id: 1, stepId: 1, timeStr: '24:12', title: 'Directory query anomaly flagged', appearTime: 5, containedTime: 8, xp: 180, detail: 'Immediate automated threshold quarantine on domain controller.' },
  { id: 2, stepId: 2, timeStr: '23:50', title: 'Phishing email quarantined', appearTime: 13, containedTime: 16, xp: 240, detail: 'Sandbox detonation isolates lure within 90 seconds of receipt.' },
  { id: 3, stepId: 3, timeStr: '23:25', title: 'Suspicious SSO login contained', appearTime: 21, containedTime: 24, xp: 220, detail: 'MFA challenge rejected; account locked automatically.' },
  { id: 4, stepId: 4, timeStr: '22:58', title: 'Lateral movement intercepted & neutralized', appearTime: 29, containedTime: 32, xp: 350, detail: 'Blue SOC isolates pivoting host before credential dump succeeds.' },
];

export function LaptopEventMockup() {
  const [activeView, setActiveView] = useState<ScreenView>('live-range');
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Boot sequence phases:
  // 0.00s: power-on (glow fades in)
  // 0.30s: wipe-reveal (top to bottom wipe over 1000ms)
  // 1.30s: sheen-pulse (diagonal sheen & anchor ring pulse)
  // 1.50s: lockup (mark eases left, Cynchor wordmark slides in)
  // 2.00s: tagline (Slogan "Simulating reality to secure the future" fades in)
  // 2.50s: fading-out (scales 0.94 and fades out over 300ms)
  // 2.80s: ready (simulation begins)
  const [bootPhase, setBootPhase] = useState<'power-on' | 'wipe-reveal' | 'sheen-pulse' | 'lockup' | 'tagline' | 'fading-out' | 'ready'>('power-on');
  const [bootSkipped, setBootSkipped] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);

  // Simulation state machine
  const [scenarioIndex, setScenarioIndex] = useState<0 | 1>(0); // 0 = Breakthrough, 1 = Lockdown
  const [simTime, setSimTime] = useState<number>(0); // 0 to 52 seconds
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [pinnedDetail, setPinnedDetail] = useState<{ title: string; text: string } | null>(null);
  const [hoveredStepId, setHoveredStepId] = useState<number | null>(null);

  // Pulse effect between red and blue
  const [pulseDirection, setPulseDirection] = useState<'red-to-blue' | 'blue-to-red' | null>(null);

  // 960x600 Scaler
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  // Reduced motion check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      if (mq.matches) {
        // Show static lockup for 1.2s, then cross-fade
        setBootPhase('tagline');
        const t = setTimeout(() => {
          setBootPhase('ready');
          setBootSkipped(true);
        }, 1200);
        return () => clearTimeout(t);
      }
    }
  }, []);

  // ResizeObserver for 960x600 scaling
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const update = () => {
      if (el.clientWidth > 0) {
        setScale(el.clientWidth / 960);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // BOOT SEQUENCE TIMELINE (2.8s total, runs once)
  useEffect(() => {
    if (bootSkipped || prefersReducedMotion) return;

    // Show skip button after 600ms
    const tSkip = setTimeout(() => setShowSkipButton(true), 600);

    // 0.30s: Vertical wipe reveal begins
    const t1 = setTimeout(() => setBootPhase('wipe-reveal'), 300);
    // 1.30s: Gradient sheen & ring pulse
    const t2 = setTimeout(() => setBootPhase('sheen-pulse'), 1300);
    // 1.50s: Lockup forms (mark eases left, wordmark appears)
    const t3 = setTimeout(() => setBootPhase('lockup'), 1500);
    // 2.00s: Tagline appears
    const t4 = setTimeout(() => setBootPhase('tagline'), 2000);
    // 2.50s: Lockup scales to 0.94 and fades out
    const t5 = setTimeout(() => setBootPhase('fading-out'), 2500);
    // 2.80s: Simulation begins
    const t6 = setTimeout(() => setBootPhase('ready'), 2800);

    return () => {
      clearTimeout(tSkip);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [bootSkipped, prefersReducedMotion]);

  const skipBoot = useCallback(() => {
    setBootPhase('ready');
    setBootSkipped(true);
  }, []);

  // Pause simulation when off-screen or tab is hidden
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && !document.hidden);
      },
      { threshold: 0.1 }
    );

    if (screenRef.current) {
      observer.observe(screenRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  // SIMULATION TICKER
  useEffect(() => {
    if (bootPhase !== 'ready' || !isPlaying || !isVisible || pinnedDetail !== null || activeView !== 'live-range') {
      return;
    }

    const interval = setInterval(() => {
      setSimTime((prev) => {
        if (prev >= 50) {
          // Switch to next scenario and loop
          setScenarioIndex((s) => (s === 0 ? 1 : 0));
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [bootPhase, isPlaying, pinnedDetail, activeView]);

  // Handle keyboard ESC to unpin detail
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && pinnedDetail !== null) {
        setPinnedDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pinnedDetail]);

  // Derived Simulation Data
  const activeAlerts = useMemo(() => {
    return scenarioIndex === 0 ? BLUE_ALERTS_SCENARIO_1 : BLUE_ALERTS_SCENARIO_2;
  }, [scenarioIndex]);

  // Calculate dynamic Red XP and flags
  const { currentRedXP, completedFlags, activeStepId } = useMemo(() => {
    let xp = 850;
    let flags = 0;
    let currentActive: number | null = null;

    RED_STEPS.forEach((step) => {
      const isBlocked = scenarioIndex === 1 && step.id >= 4;
      if (!isBlocked && simTime >= step.doneTime) {
        xp += step.xp;
        flags += 1;
      } else if (simTime >= step.triggerTime && (simTime < step.doneTime || isBlocked)) {
        currentActive = step.id;
      }
    });

    return { currentRedXP: xp, completedFlags: flags, activeStepId: currentActive };
  }, [simTime, scenarioIndex]);

  // Calculate dynamic Blue XP and contained count
  const { currentBlueXP, containedCount, visibleAlerts } = useMemo(() => {
    let xp = 950;
    let contained = 0;
    const visible: Array<BlueAlert & { status: 'DETECTED' | 'TRIAGED' | 'CONTAINED' }> = [];

    activeAlerts.forEach((alert) => {
      if (simTime >= alert.appearTime) {
        let status: 'DETECTED' | 'TRIAGED' | 'CONTAINED' = 'DETECTED';
        if (simTime >= alert.containedTime) {
          status = 'CONTAINED';
          xp += alert.xp;
          contained += 1;
        } else if (simTime >= alert.appearTime + 2) {
          status = 'TRIAGED';
        }
        visible.push({ ...alert, status });
      }
    });

    if (scenarioIndex === 1 && simTime >= 34) {
      xp += 350;
    }

    return { currentBlueXP: xp, containedCount: contained, visibleAlerts: visible };
  }, [simTime, activeAlerts, scenarioIndex]);

  // Tug of war percentage
  const totalXP = currentRedXP + currentBlueXP;
  const redPercent = Math.min(Math.max(Math.round((currentRedXP / totalXP) * 100), 20), 80);
  const bluePercent = 100 - redPercent;

  // Round timer countdown: from 24:00 (1440s) down by simTime
  const roundTimerSeconds = Math.max(1440 - simTime, 0);
  const formatTimer = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mean Time To Detect (MTTD) recalculation
  const currentMTTD = useMemo(() => {
    if (containedCount === 0) return '2m 14s';
    if (containedCount === 1) return '2m 02s';
    if (containedCount === 2) return '1m 48s';
    if (containedCount === 3) return '1m 42s';
    return scenarioIndex === 1 ? '1m 18s' : '1m 36s';
  }, [containedCount, scenarioIndex]);

  // Pulses
  useEffect(() => {
    if (simTime === 5 || simTime === 14 || simTime === 23 || simTime === 33 || simTime === 44) {
      setPulseDirection('red-to-blue');
      const t = setTimeout(() => setPulseDirection(null), 800);
      return () => clearTimeout(t);
    }
    if (simTime === 9 || simTime === 18 || simTime === 28 || simTime === 32 || simTime === 39) {
      setPulseDirection('blue-to-red');
      const t = setTimeout(() => setPulseDirection(null), 800);
      return () => clearTimeout(t);
    }
  }, [simTime]);

  const laptopTransform = prefersReducedMotion
    ? 'none'
    : isHovered
    ? 'rotateY(-2deg) rotateX(1deg)'
    : 'rotateY(-10deg) rotateX(3deg)';

  const isRoundComplete = simTime >= 45 && simTime <= 49;
  const isSimulationPaused = !isPlaying || pinnedDetail !== null;

  return (
    <div className="w-full flex flex-col items-center select-none" role="region" aria-label="Cynchor interactive cyber range simulation">
      {/* 3D LAPTOP CONTAINER */}
      <div 
        className="relative w-full"
        style={{ perspective: prefersReducedMotion ? 'none' : '1800px' }}
      >
        {/* Soft Ambient Glow beneath laptop: Coral on Left, Teal on Right */}
        <div
          className="absolute -inset-4 sm:-inset-6 rounded-3xl filter blur-[60px] pointer-events-none -z-10"
          style={{
            background:
              'radial-gradient(circle at 18% 70%, rgba(234,105,75,0.22) 0%, transparent 60%), radial-gradient(circle at 82% 70%, rgba(23,171,169,0.22) 0%, transparent 60%)',
          }}
        />

        {/* LAPTOP CHASSIS WITH GENTLE 3D TURN */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full transition-transform duration-500 ease-out transform-gpu"
          style={{
            transform: laptopTransform,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* UPRIGHT 16:10 SCREEN LID */}
          <div className="relative w-full rounded-[18px] sm:rounded-[22px] bg-[#141417] p-2 sm:p-2.5 border border-[#26262e] shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            {/* Faint brand-gradient rim light on the lid edge */}
            <div
              className="absolute inset-0 rounded-[18px] sm:rounded-[22px] pointer-events-none"
              style={{
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(23,171,169,0.45) 0%, rgba(234,105,75,0.4) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Thin Bezel (~2-3% of width) */}
            <div className="relative rounded-[14px] sm:rounded-[16px] bg-[#0c0c0f] p-1.5 sm:p-2 border border-[#1b1b22] overflow-hidden">
              {/* Centered Camera Dot */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center justify-center z-30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#050507] border border-[#282830] flex items-center justify-center">
                  <span className="w-0.5 h-0.5 rounded-full bg-teal/80" />
                </span>
              </div>

              {/* SCREEN DISPLAY CONTAINER (Aspect Ratio 16:10) */}
              <div
                ref={screenRef}
                className="relative mt-2 w-full rounded-[8px] bg-[#09090B] overflow-hidden border border-[#26262C] shadow-inner"
                style={{ aspectRatio: '16 / 10' }}
                role="img"
                aria-label="Cynchor live cyber range interactive simulation"
              >
                {/* FIXED 960x600 DESIGN CANVAS */}
                <div
                  className="absolute top-0 left-0 text-[#E5E6E6] font-sans overflow-hidden"
                  style={{
                    width: 960,
                    height: 600,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                  }}
                >
                  {/* ══════════════════════════════════════════════════════
                      1. BOOT SEQUENCE SCREEN OVERLAY (NEW OFFICIAL LOGO)
                      ══════════════════════════════════════════════════════ */}
                  {bootPhase !== 'ready' && (
                    <div 
                      className={`absolute inset-0 bg-[#09090B] z-50 flex flex-col items-center justify-center transition-all duration-300 ${
                        bootPhase === 'fading-out' ? 'opacity-0 scale-[0.94]' : 'opacity-100 scale-100'
                      }`}
                    >
                      {/* Power-on soft teal glow fading in from center */}
                      <div 
                        className={`absolute w-80 h-80 rounded-full filter blur-[80px] pointer-events-none transition-opacity duration-700 ${
                          bootPhase === 'power-on' ? 'opacity-30 bg-teal/20' : 'opacity-70 bg-teal/25'
                        }`}
                      />

                      {/* Main Logo & Lockup Group (Centered, ~40% of screen height = ~240px) */}
                      <div className="relative flex items-center justify-center z-10">
                        {/* Lockup wrapper that transitions when wordmark appears */}
                        <div 
                          className={`flex items-center gap-7 transition-all duration-500 ease-out ${
                            bootPhase === 'lockup' || bootPhase === 'tagline' || bootPhase === 'fading-out'
                              ? 'translate-x-0'
                              : 'translate-x-0'
                          }`}
                        >
                          {/* OFFICIAL CYNCHOR MARK (240px = 40% of screen height, 1:1 Aspect Ratio) */}
                          <div className="relative w-[240px] h-[240px] shrink-0 flex items-center justify-center overflow-hidden">
                            {/* The Official Mark Image with Vertical Wipe Reveal */}
                            <div
                              className="relative w-full h-full"
                              style={{
                                clipPath: bootPhase === 'power-on'
                                  ? 'inset(0% 0% 100% 0%)'
                                  : 'inset(0% 0% 0% 0%)',
                                transition: prefersReducedMotion
                                  ? 'none'
                                  : 'clip-path 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
                              }}
                            >
                              {/* Using the official transparent mark from Cynchor_for_Socials */}
                              <img
                                src="/brand/cynchor-mark-transparent.png"
                                alt="Cynchor Logo Mark"
                                className="w-full h-full object-contain select-none"
                              />

                              {/* 1.30s: Thin diagonal gradient sheen sweeping across mark (500ms) */}
                              <div
                                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                                  bootPhase === 'sheen-pulse' ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{
                                  background: 'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.45) 50%, transparent 65%)',
                                  transform: bootPhase === 'sheen-pulse' ? 'translateX(100%)' : 'translateX(-100%)',
                                  transition: 'transform 500ms ease-in-out',
                                }}
                              />
                            </div>

                            {/* 1.30s: Faint ring pulse expanding from top anchor ring */}
                            {bootPhase === 'sheen-pulse' && !prefersReducedMotion && (
                              <div 
                                className="absolute top-[36px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border border-teal/70 animate-ping pointer-events-none"
                              />
                            )}
                          </div>

                          {/* 1.50s: Wordmark "Cynchor" (Live text in Lexend 700, #E5E6E6, cap height ~45% of mark height) */}
                          <div 
                            className={`flex flex-col justify-center transition-all duration-500 transform ${
                              bootPhase === 'lockup' || bootPhase === 'tagline' || bootPhase === 'fading-out'
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-8 pointer-events-none'
                            }`}
                          >
                            <div 
                              className="font-heading font-bold text-[#E5E6E6] leading-none select-none"
                              style={{ 
                                fontSize: '84px',
                                letterSpacing: '-0.01em',
                              }}
                            >
                              Cynchor
                            </div>

                            {/* 2.00s: Slogan "SIMULATING REALITY TO SECURE THE FUTURE" with thin brand-gradient underline */}
                            <div 
                              className={`mt-3 transition-all duration-400 transform ${
                                bootPhase === 'tagline' || bootPhase === 'fading-out'
                                  ? 'opacity-100 translate-y-0'
                                  : 'opacity-0 translate-y-2'
                              }`}
                            >
                              <div className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#A1A1AA] font-semibold whitespace-nowrap">
                                SIMULATING REALITY TO SECURE THE FUTURE
                              </div>
                              <div 
                                className="mt-1 h-[2px] w-full rounded-full"
                                style={{ background: 'linear-gradient(90deg, #17ABA9 0%, #EA694B 100%)' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Small "Skip intro" button at bottom right (visible after 600ms, 11px) */}
                      {showSkipButton && (
                        <button
                          type="button"
                          onClick={skipBoot}
                          className="absolute bottom-5 right-6 text-[11px] font-mono text-[#A1A1AA] hover:text-[#17ABA9] px-3 py-1 rounded bg-[#17171B] border border-[#26262C] transition-colors focus:ring-1 focus:ring-teal focus:outline-none"
                        >
                          Skip intro →
                        </button>
                      )}
                    </div>
                  )}

                  {/* ══════════════════════════════════════════════════════
                      PAUSED STATE FAINT MARK WATERMARK (96px at 8% opacity)
                      ══════════════════════════════════════════════════════ */}
                  {isSimulationPaused && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                      aria-hidden="true"
                    >
                      <img
                        src="/brand/cynchor-mark-transparent.png"
                        alt=""
                        className="w-24 h-24 object-contain opacity-[0.08]"
                      />
                    </div>
                  )}

                  {/* ══════════════════════════════════════════════════════
                      2. VIEW 1: LIVE RANGE (SIMULATION RUNNING ON GRID)
                      ══════════════════════════════════════════════════════ */}
                  <div
                    className={`absolute inset-0 p-5 grid grid-rows-[auto_auto_1fr_auto] gap-4 transition-opacity duration-400 ${
                      activeView === 'live-range' ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {/* ROW 1: HEADER (Mark at 28px in place of status dot) */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#26262C]">
                      <div className="flex items-center gap-3">
                        {/* Official Cynchor Mark at exactly 28px */}
                        <img 
                          src="/brand/cynchor-mark-transparent.png"
                          alt="Cynchor Mark"
                          className="w-7 h-7 object-contain shrink-0"
                        />
                        <h2 className="font-heading font-bold text-2xl text-[#E5E6E6] tracking-tight">
                          Operation Fintech Range
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-coral/20 text-coral border border-coral/30">
                          LIVE
                        </span>
                        <span className="text-xs font-mono text-muted bg-[#17171B] px-2.5 py-1 rounded border border-[#26262C]">
                          {scenarioIndex === 0 ? 'Scenario: Red Breakthrough' : 'Scenario: Blue Lockdown'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider font-semibold">
                          ROUND TIMER
                        </span>
                        <div className="font-mono font-black text-2xl text-[#E5E6E6] bg-[#17171B] px-4 py-1 rounded-lg border border-[#26262C] shadow-inner">
                          {formatTimer(roundTimerSeconds)}
                        </div>
                      </div>
                    </div>

                    {/* ROW 2: SCOREBOARD (XP Numbers 36-44px, Tug-of-War Bar 14px track) */}
                    <div className="py-3 px-5 rounded-xl bg-[#111114] border border-[#26262C] space-y-2 relative">
                      <div className="flex items-center justify-between font-mono">
                        {/* Red XP */}
                        <div className="flex items-baseline gap-3">
                          <span className="w-3.5 h-3.5 rounded-sm bg-coral" />
                          <span className="font-heading font-black text-4xl text-coral tracking-tight">
                            {currentRedXP}
                          </span>
                          <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                            RED SQUAD ({completedFlags}/5 FLAGS)
                          </span>
                        </div>

                        {/* Center Tug of War Label */}
                        <div className="text-center">
                          <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-widest font-bold">
                            TUG-OF-WAR DOMINANCE
                          </span>
                        </div>

                        {/* Blue XP */}
                        <div className="flex items-baseline gap-3">
                          <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                            BLUE SQUAD ({containedCount} CONTAINED)
                          </span>
                          <span className="font-heading font-black text-4xl text-teal tracking-tight">
                            {currentBlueXP}
                          </span>
                          <span className="w-3.5 h-3.5 rounded-sm bg-teal" />
                        </div>
                      </div>

                      {/* 14px Score Track with leading glow */}
                      <div className="h-3.5 rounded-full bg-[#17171B] overflow-hidden flex p-0.5 border border-[#26262C] relative">
                        <div
                          className="h-full bg-coral rounded-l-full transition-all duration-500 shadow-[0_0_12px_rgba(234,105,75,0.6)]"
                          style={{ width: `${redPercent}%` }}
                        />
                        <div
                          className="h-full bg-teal rounded-r-full transition-all duration-500 shadow-[0_0_12px_rgba(23,171,169,0.6)]"
                          style={{ width: `${bluePercent}%` }}
                        />
                      </div>

                      {/* Cause-and-Effect Pulse travelling between Red and Blue */}
                      {pulseDirection && (
                        <div 
                          className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full filter blur-md pointer-events-none transition-all duration-700 ${
                            pulseDirection === 'red-to-blue'
                              ? 'bg-coral left-1/4 animate-[ping_0.8s_ease-out]'
                              : 'bg-teal right-1/4 animate-[ping_0.8s_ease-out]'
                          }`}
                        />
                      )}
                    </div>

                    {/* ROW 3: TWO PANELS (RED ATTACK CHAIN vs BLUE DETECTION FEED) */}
                    <div className="grid grid-cols-2 gap-5 min-h-0 relative">
                      {/* LEFT: RED ATTACK CHAIN */}
                      <div className="p-4 rounded-xl bg-[#111114] border border-coral/30 flex flex-col justify-between overflow-hidden">
                        <div className="flex items-center justify-between pb-2.5 border-b border-[#26262C]">
                          <div className="flex items-center gap-2">
                            <Crosshair className="w-5 h-5 text-coral" />
                            <h3 className="font-heading font-bold text-lg text-coral">
                              Red Attack Chain
                            </h3>
                          </div>
                          <span className="text-xs font-mono font-bold text-coral bg-coral/15 px-2.5 py-0.5 rounded border border-coral/30">
                            {completedFlags}/5 Flags Captured
                          </span>
                        </div>

                        {/* 5 Ordered Attack Steps */}
                        <div className="space-y-2 my-auto">
                          {RED_STEPS.map((step) => {
                            const isDone = (scenarioIndex === 0 || step.id <= 3) && simTime >= step.doneTime;
                            const isActive = !isDone && simTime >= step.triggerTime;
                            const isHoveredOrMatched = hoveredStepId === step.id;

                            return (
                              <div
                                key={step.id}
                                onClick={() => setPinnedDetail({ title: `Red Step ${step.id}: ${step.name}`, text: step.detail })}
                                onMouseEnter={() => setHoveredStepId(step.id)}
                                onMouseLeave={() => setHoveredStepId(null)}
                                className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 border ${
                                  isActive
                                    ? 'bg-coral/10 border-coral shadow-[0_0_10px_rgba(234,105,75,0.25)]'
                                    : isDone
                                    ? 'bg-[#17171B] border-coral/25 text-[#E5E6E6]'
                                    : 'bg-[#141418]/60 border-transparent text-[#A1A1AA]/60'
                                } ${isHoveredOrMatched ? 'ring-1 ring-coral/70 bg-coral/15' : ''}`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                                    isDone
                                      ? 'bg-coral text-[#09090B]'
                                      : isActive
                                      ? 'border border-coral text-coral animate-pulse'
                                      : 'border border-[#26262C] text-[#A1A1AA]'
                                  }`}>
                                    {isDone ? '✓' : step.id}
                                  </span>
                                  <div>
                                    <span className="font-semibold text-[17px] leading-tight block text-[#E5E6E6]">
                                      {step.name}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                                  {isDone && (
                                    <span className="font-bold text-coral">+{step.xp} XP</span>
                                  )}
                                  {isActive && (
                                    <span className="px-2 py-0.5 rounded bg-coral/20 text-coral font-bold uppercase tracking-wider animate-pulse">
                                      ACTIVE
                                    </span>
                                  )}
                                  {!isDone && !isActive && (
                                    <span className="text-[#A1A1AA]/50">QUEUED</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* RIGHT: BLUE DETECTION FEED */}
                      <div className="p-4 rounded-xl bg-[#111114] border border-teal/30 flex flex-col justify-between overflow-hidden">
                        <div className="flex items-center justify-between pb-2.5 border-b border-[#26262C]">
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-teal" />
                            <h3 className="font-heading font-bold text-lg text-teal">
                              Blue Detection Feed
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-[#A1A1AA]">MTTD:</span>
                            <span className="text-xs font-mono font-bold text-teal bg-teal/15 px-2 py-0.5 rounded border border-teal/30">
                              {currentMTTD}
                            </span>
                          </div>
                        </div>

                        {/* Alerts List reacting to Red Steps */}
                        <div className="space-y-2 my-auto">
                          {visibleAlerts.length === 0 ? (
                            <div className="p-8 text-center text-[#A1A1AA] font-mono text-sm">
                              <Radio className="w-6 h-6 mx-auto mb-2 text-teal animate-pulse" />
                              Listening for anomalous network traffic on fintechcorp.local...
                            </div>
                          ) : (
                            visibleAlerts.slice(-4).map((alert) => {
                              const isHoveredOrMatched = hoveredStepId === alert.stepId;
                              return (
                                <div
                                  key={alert.id}
                                  onClick={() => setPinnedDetail({ title: `Blue SOC Alert: ${alert.title}`, text: alert.detail })}
                                  onMouseEnter={() => setHoveredStepId(alert.stepId)}
                                  onMouseLeave={() => setHoveredStepId(null)}
                                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-300 border ${
                                    alert.status === 'CONTAINED'
                                      ? 'bg-teal/10 border-teal/40 text-[#E5E6E6]'
                                      : 'bg-[#17171B] border-[#26262C] text-[#E5E6E6]'
                                  } ${isHoveredOrMatched ? 'ring-1 ring-teal/70 bg-teal/20' : ''}`}
                                >
                                  <div className="flex items-center gap-2.5 truncate mr-2">
                                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                      alert.status === 'CONTAINED' ? 'bg-teal' : 'bg-coral animate-ping'
                                    }`} />
                                    <span className="font-mono text-xs text-[#A1A1AA] shrink-0">{alert.timeStr}</span>
                                    <span className="font-semibold text-[17px] truncate text-[#E5E6E6]">
                                      {alert.title}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                                      alert.status === 'CONTAINED'
                                        ? 'bg-teal/20 text-teal border border-teal/40'
                                        : alert.status === 'TRIAGED'
                                        ? 'bg-surface-2 text-[#E5E6E6] border border-[#26262C]'
                                        : 'bg-coral/20 text-coral border border-coral/30 animate-pulse'
                                    }`}>
                                      {alert.status}
                                    </span>
                                    {alert.status === 'CONTAINED' && (
                                      <span className="font-mono text-xs text-teal font-bold">+{alert.xp} XP</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Blue Metric Footer */}
                        <div className="pt-2 border-t border-[#26262C] flex items-center justify-between text-xs font-mono text-[#A1A1AA]">
                          <span className="flex items-center gap-1.5 text-teal font-semibold">
                            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                            {containedCount} Interceptions Contained
                          </span>
                          <span>Proxmox SDN Tap: ACTIVE</span>
                        </div>
                      </div>

                      {/* PINNED DETAIL CARD (Auto-pauses simulation, Esc or click to unpin) */}
                      {pinnedDetail && (
                        <div className="absolute inset-x-2 bottom-2 bg-[#17171B] border-2 border-teal p-3.5 rounded-xl shadow-2xl z-30 flex items-start justify-between animate-in fade-in zoom-in-95">
                          <div className="space-y-1 pr-3">
                            <div className="flex items-center gap-2 text-teal font-heading font-bold text-sm">
                              <Info className="w-4 h-4" />
                              <span>{pinnedDetail.title}</span>
                              <span className="text-[10px] font-mono text-[#A1A1AA]">(Simulation Paused)</span>
                            </div>
                            <p className="text-sm text-[#E5E6E6] leading-snug">
                              {pinnedDetail.text}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPinnedDetail(null)}
                            className="p-1 rounded bg-[#26262C] text-[#A1A1AA] hover:text-[#E5E6E6]"
                            aria-label="Close detail"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* ROUND COMPLETE BANNER (Mark at 56px above result text) */}
                      {isRoundComplete && (
                        <div className="absolute inset-0 bg-[#09090B]/90 backdrop-blur-sm z-40 rounded-xl border-2 border-teal flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
                          {/* Official Cynchor Mark at exactly 56px */}
                          <img
                            src="/brand/cynchor-mark-transparent.png"
                            alt="Cynchor Mark"
                            className="w-14 h-14 object-contain mx-auto mb-3"
                          />
                          <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal mb-2">
                            ROUND COMPLETE
                          </span>
                          <h3 className="font-heading font-black text-3xl text-[#E5E6E6] mb-3">
                            {scenarioIndex === 0
                              ? 'Red Breaches the Perimeter'
                              : 'Blue Holds the Line — Defensive Lockdown'}
                          </h3>
                          <p className="text-sm text-[#A1A1AA] max-w-lg mb-4">
                            {scenarioIndex === 0
                              ? 'Red team captured 5/5 flags and accessed the banking server before full SOC isolation.'
                              : 'Blue team contained lateral movement at step 4, preventing database compromise.'}
                          </p>
                          <div className="flex items-center gap-6 font-mono text-base font-bold bg-[#17171B] px-6 py-2 rounded-lg border border-[#26262C]">
                            <span className="text-coral">Red: {currentRedXP} XP</span>
                            <span className="text-[#A1A1AA]">vs</span>
                            <span className="text-teal">Blue: {currentBlueXP} XP</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ROW 4: BOTTOM BAR (Controls) */}
                    <div className="pt-2 border-t border-[#26262C] flex items-center justify-between text-xs font-mono text-[#A1A1AA]">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="px-3 py-1 rounded bg-[#17171B] border border-[#26262C] text-[#E5E6E6] hover:border-teal flex items-center gap-1.5 transition-colors font-semibold"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5 text-teal" /> : <Play className="w-3.5 h-3.5 text-teal" />}
                          {isPlaying ? 'Pause' : 'Play'}
                        </button>

                        <button
                          type="button"
                          onClick={() => { setSimTime(0); setIsPlaying(true); }}
                          className="px-3 py-1 rounded bg-[#17171B] border border-[#26262C] text-[#E5E6E6] hover:border-teal flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Replay
                        </button>

                        <button
                          type="button"
                          onClick={() => { setScenarioIndex((s) => (s === 0 ? 1 : 0)); setSimTime(0); }}
                          className="px-3 py-1 rounded bg-[#17171B] border border-[#26262C] text-teal hover:border-teal transition-colors"
                        >
                          Toggle Scenario ({scenarioIndex === 0 ? '1 → 2' : '2 → 1'})
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-[#A1A1AA] hidden sm:inline">
                          Tip: Click any step or alert to pause & inspect telemetry
                        </span>
                        <span className="text-teal font-semibold">Live Range Loop: 50s</span>
                      </div>
                    </div>
                  </div>

                  {/* ══════════════════════════════════════════════════════
                      3. VIEW 2: DETECTION FEED (UPGRADED LARGE TYPOGRAPHY)
                      ══════════════════════════════════════════════════════ */}
                  <div
                    className={`absolute inset-0 p-6 flex flex-col justify-between transition-opacity duration-400 ${
                      activeView === 'detection-feed' ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#26262C]">
                      <div className="flex items-center gap-3">
                        <Terminal className="w-6 h-6 text-teal" />
                        <div>
                          <h2 className="font-heading font-bold text-2xl text-[#E5E6E6]">
                            Blue SOC Telemetry Stream
                          </h2>
                          <span className="text-xs font-mono text-[#A1A1AA]">Target: fintechcorp.local</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-[#111114] p-3 rounded-xl border border-teal/40">
                        <div className="text-right">
                          <span className="text-xs text-[#A1A1AA] block font-mono">Mean Time to Detect</span>
                          <span className="text-xs text-teal font-semibold">Top 5% Benchmark</span>
                        </div>
                        <div className="font-heading font-black text-3xl text-teal pl-3 border-l border-[#26262C]">
                          1m 42s
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 my-auto">
                      {BLUE_ALERTS_SCENARIO_1.map((alert) => (
                        <div key={alert.id} className="p-3.5 rounded-xl bg-[#111114] border border-[#26262C] flex items-center justify-between text-base">
                          <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-teal shrink-0" />
                            <span className="font-mono text-xs text-[#A1A1AA] shrink-0">{alert.timeStr}</span>
                            <span className="font-semibold text-lg text-[#E5E6E6]">{alert.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-md text-xs font-bold font-mono bg-teal/20 text-teal border border-teal/40">
                              CONTAINED
                            </span>
                            <span className="font-mono text-xs text-teal font-bold">+{alert.xp} XP</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#26262C] flex items-center justify-between text-xs font-mono text-[#A1A1AA]">
                      <span className="text-teal font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                        12/12 Proxmox Virtual Taps Synchronized
                      </span>
                      <span>Zero False Positives • Scope: fintechcorp.local</span>
                    </div>
                  </div>

                  {/* ══════════════════════════════════════════════════════
                      4. VIEW 3: TEAM LOBBY (MATCHMAKING)
                      ══════════════════════════════════════════════════════ */}
                  <div
                    className={`absolute inset-0 p-6 flex flex-col justify-between transition-opacity duration-400 ${
                      activeView === 'team-lobby' ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="p-4 rounded-xl bg-teal/15 border border-teal/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-teal animate-pulse" />
                        <div>
                          <h2 className="font-heading font-black text-2xl text-teal tracking-tight block">
                            MATCH FOUND — SQUAD ROSTER READY
                          </h2>
                          <span className="text-xs font-mono text-[#A1A1AA]">Mode: 3v3 Synchronized Range • Banking Enclave</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-sm text-[#E5E6E6] bg-[#17171B] px-4 py-2 rounded-lg border border-[#26262C]">
                        Deploying in 00:04...
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="py-3 px-4 rounded-xl bg-coral/20 border border-coral text-coral font-heading font-bold text-base flex items-center justify-center gap-2">
                        <Crosshair className="w-5 h-5 text-coral" /> Red Squad (Offense) [SELECTED]
                      </div>
                      <div className="py-3 px-4 rounded-xl bg-[#111114] border border-[#26262C] text-[#A1A1AA] font-heading font-semibold text-base flex items-center justify-center gap-2">
                        <Shield className="w-5 h-5" /> Blue Squad (Defense)
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-[#17171B] border border-coral/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-coral/20 border border-coral flex items-center justify-center text-sm font-bold text-coral">
                            ▲
                          </span>
                          <div>
                            <div className="font-heading font-bold text-lg text-[#E5E6E6]">
                              ghost_operative <span className="text-xs text-coral font-normal font-mono">(You)</span>
                            </div>
                            <div className="text-xs text-[#A1A1AA]">Role: Lead Penetrator • Tier 2</div>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-md text-xs font-bold font-mono bg-teal/20 text-teal border border-teal/40">
                          READY ✓
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#111114] border border-[#26262C] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-coral/20 border border-coral flex items-center justify-center text-sm font-bold text-coral">
                            ▲
                          </span>
                          <div>
                            <div className="font-heading font-bold text-lg text-[#E5E6E6]">byte_sentinel</div>
                            <div className="text-xs text-[#A1A1AA]">Role: Exploit Developer • Tier 1</div>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-md text-xs font-bold font-mono bg-teal/20 text-teal border border-teal/40">
                          READY ✓
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#111114] border border-[#26262C] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-coral/20 border border-coral flex items-center justify-center text-sm font-bold text-coral">
                            ▲
                          </span>
                          <div>
                            <div className="font-heading font-bold text-lg text-[#E5E6E6]">packet_witch</div>
                            <div className="text-xs text-[#A1A1AA]">Role: Network Infiltrator • Tier 1</div>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-md text-xs font-bold font-mono bg-teal/20 text-teal border border-teal/40">
                          READY ✓
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* THIN BASE WEDGE (About 4-5% of Width in Height) */}
          <div className="relative mx-auto w-[99%] h-[20px] sm:h-[24px] bg-gradient-to-b from-[#18181d] via-[#141417] to-[#0d0d10] rounded-b-[10px] border-x border-b border-[#282832] shadow-[0_15px_30px_rgba(0,0,0,0.9)] flex items-center justify-center">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#0c0c0e]" />
            <div className="w-28 sm:w-36 h-[2px] rounded-full bg-[#0a0a0d] border border-[#202028] opacity-60" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-[3px] rounded-t-sm bg-[#09090b] border-t border-x border-[#2c2c36]" />
          </div>

          {/* Soft Realistic Contact Shadow directly beneath base */}
          <div className="mx-auto w-[92%] h-3.5 rounded-full bg-black/90 filter blur-md -mt-1 -z-10" />
        </div>
      </div>

      {/* CAPTIONED THUMBNAIL STRIP ALIGNED DIRECTLY BELOW LAPTOP */}
      <div className="mt-5 w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Card 1: Live Range */}
        <button
          type="button"
          onClick={() => setActiveView('live-range')}
          aria-label="Switch to Live Range view"
          className={`relative p-3 rounded-xl text-left transition-all duration-200 border ${
            activeView === 'live-range'
              ? 'bg-[#17171B] border-teal/40 shadow-[0_0_20px_rgba(23,171,169,0.15)]'
              : 'bg-[#111114]/80 border-[#26262C] hover:border-[#26262C]/80 hover:bg-[#17171B]/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-heading font-semibold text-xs text-[#E5E6E6] flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${activeView === 'live-range' ? 'bg-teal animate-pulse' : 'bg-[#A1A1AA]'}`} />
              Live Range
            </span>
            <span className="text-[10px] font-mono text-[#A1A1AA]">01</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA] leading-tight">
            Scoreboard & real-time tug-of-war.
          </p>
          {activeView === 'live-range' && (
            <div
              className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
              style={{ background: 'linear-gradient(90deg, #17ABA9 0%, #EA694B 100%)' }}
            />
          )}
        </button>

        {/* Card 2: Detection Feed */}
        <button
          type="button"
          onClick={() => setActiveView('detection-feed')}
          aria-label="Switch to Detection Feed view"
          className={`relative p-3 rounded-xl text-left transition-all duration-200 border ${
            activeView === 'detection-feed'
              ? 'bg-[#17171B] border-teal/40 shadow-[0_0_20px_rgba(23,171,169,0.15)]'
              : 'bg-[#111114]/80 border-[#26262C] hover:border-[#26262C]/80 hover:bg-[#17171B]/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-heading font-semibold text-xs text-[#E5E6E6] flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${activeView === 'detection-feed' ? 'bg-teal animate-pulse' : 'bg-[#A1A1AA]'}`} />
              Detection Feed
            </span>
            <span className="text-[10px] font-mono text-[#A1A1AA]">02</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA] leading-tight">
            SOC telemetry & MTTD benchmarks.
          </p>
          {activeView === 'detection-feed' && (
            <div
              className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
              style={{ background: 'linear-gradient(90deg, #17ABA9 0%, #EA694B 100%)' }}
            />
          )}
        </button>

        {/* Card 3: Team Lobby */}
        <button
          type="button"
          onClick={() => setActiveView('team-lobby')}
          aria-label="Switch to Team Lobby view"
          className={`relative p-3 rounded-xl text-left transition-all duration-200 border ${
            activeView === 'team-lobby'
              ? 'bg-[#17171B] border-teal/40 shadow-[0_0_20px_rgba(23,171,169,0.15)]'
              : 'bg-[#111114]/80 border-[#26262C] hover:border-[#26262C]/80 hover:bg-[#17171B]/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-heading font-semibold text-xs text-[#E5E6E6] flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${activeView === 'team-lobby' ? 'bg-coral animate-pulse' : 'bg-[#A1A1AA]'}`} />
              Team Lobby
            </span>
            <span className="text-[10px] font-mono text-[#A1A1AA]">03</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA] leading-tight">
            3-player squad matchmaking & roles.
          </p>
          {activeView === 'team-lobby' && (
            <div
              className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
              style={{ background: 'linear-gradient(90deg, #17ABA9 0%, #EA694B 100%)' }}
            />
          )}
        </button>
      </div>

      {/* Caption beneath laptop: exactly 12px font */}
      <div className="mt-3 text-center text-xs font-mono text-[#A1A1AA]/80">
        ILLUSTRATIVE · Synthetic training data on closed range (fintechcorp.local)
      </div>
    </div>
  );
}

export default LaptopEventMockup;
