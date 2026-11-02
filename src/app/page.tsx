'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import { DisclaimerModal } from '@/components/disclaimer/DisclaimerModal';
import { LaptopEventMockup } from '@/components/illustrations/LaptopEventMockup';
import { SegmentedNetworkDiagram } from '@/components/illustrations/SegmentedNetworkDiagram';
import { ConcentricWatermark } from '@/components/illustrations/ConcentricWatermark';
import { PageEffects } from '@/components/motion/PageEffects';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { DecodeText } from '@/components/motion/DecodeText';
import { 
  ShieldCheck, 
  ArrowRight, 
  Radio, 
  Users2, 
  Server, 
  Terminal, 
  Lock, 
  Crosshair, 
  Shield, 
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Layers,
  Award,
  ChevronDown
} from 'lucide-react';
import { StatRow } from '@/components/home/StatCountUp';

export default function HomePage() {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  return (
    <div className="bg-bg text-text relative overflow-hidden">
      <PageEffects />

      {/* SECTION 3.1: HERO WITH LAPTOP & GAMIFIED EVENT */}
      <section className="relative min-h-[calc(100vh-84px)] flex flex-col justify-center items-center py-8 sm:py-12 border-b border-border overflow-hidden">
        {/* Faint futuristic dot grid */}
        <div className="cy-grid-bg" aria-hidden="true" />

        {/* Background Concentric Arc Watermark (~4% opacity) - placed on far left so arcs never cut across laptop */}
        <ConcentricWatermark className="-top-32 -left-48 opacity-[0.035]" />
        <ConcentricWatermark className="-bottom-40 -left-20 opacity-[0.035]" />

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl w-full my-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
            {/* Left Column (45%) */}
            <div className="w-full lg:w-[45%] space-y-6 text-left">
              {/* Eyebrow & V1 Badge with pulsing teal dot */}
              <div className="flex items-center gap-3">
                <Badge type="v1" />
                <DecodeText
                  text="THE PRODUCT"
                  className="text-[11px] text-muted tracking-widest uppercase font-semibold"
                />
              </div>

              {/* Headline with Clean Left-to-Right Brand Gradient on "real attack." */}
              <h1 className="font-heading font-bold text-3xl sm:text-5xl text-text tracking-tightest leading-[1.15]">
                <SplitText text="Train like it's a" as="span" /> <br className="hidden sm:inline" />
                <span 
                  className="font-black"
                  style={{
                    background: 'linear-gradient(100deg, #17ABA9 0%, #17ABA9 48%, #EA694B 52%, #EA694B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  real attack.
                </span>
              </h1>

              {/* Confident, short voice */}
              <Reveal variant="fade-up" delay={120}>
                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  Cynchor puts red and blue teams in a live, gamified cyber range.
                  Attack, defend, and learn by doing.
                </p>
              </Reveal>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setIsDisclaimerOpen(true)}
                  className="cy-btn-sheen px-6 py-3 rounded-xl bg-teal text-bg font-heading font-semibold text-sm hover:shadow-glow-teal transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-teal focus:outline-none"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Test Our Product
                </button>

                <a
                  href="#how-it-works"
                  className="px-5 py-3 rounded-xl border border-border text-text font-heading font-medium text-sm hover:bg-surface-2 transition-colors flex items-center justify-center gap-1.5"
                >
                  See how it works
                  <ArrowRight className="w-3.5 h-3.5 text-muted" />
                </a>
              </div>

              {/* Compact Truthful Stat Row with Animated Count-Up */}
              <Reveal variant="fade-up" delay={180}>
                <StatRow />
              </Reveal>

              {/* Row of 3 trust-free facts in --muted with icons */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-teal" />
                  <span>Live red-vs-blue</span>
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <Users2 className="w-3.5 h-3.5 text-text" />
                  <span>Solo or team</span>
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-coral" />
                  <span>Segmented lab</span>
                </div>
              </div>
            </div>

            {/* Right Column (55%): LAPTOP MOCKUP & SHOWCASE - Untouched */}
            <div className="w-full lg:w-[55%] flex flex-col items-center justify-center">
              <LaptopEventMockup />
            </div>
          </div>
        </div>

        {/* Small "SCROLL" cue at hero bottom with subtle bobbing arrow */}
        <div className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 flex-col items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-[9px] font-mono text-muted tracking-widest uppercase font-semibold">
            SCROLL
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted animate-bounce" />
        </div>
      </section>

      {/* SECTION 3.2: HOW IT WORKS (3 steps connected by brand gradient line) */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-border bg-surface/40 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <DecodeText
              text="HOW IT WORKS"
              className="text-[11px] text-muted tracking-widest uppercase font-semibold block"
            />
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tightest">
              <SplitText text="How it works" as="span" />
            </h2>
            <Reveal variant="fade-up" delay={100}>
              <p className="text-xs sm:text-sm text-muted">
                Three clear stages from onboarding to live engagement.
              </p>
            </Reveal>
          </div>

          <div className="relative">
            {/* Connected line in brand gradient (horizontal on desktop) */}
            <div className="hidden md:block absolute top-12 left-16 right-16 z-0">
              <div className="cy-line" data-cy-reveal="line" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10" data-cy-stagger="true">
              {/* Step 1 */}
              <Reveal variant="fade-up" className="bg-surface p-6 rounded-2xl border border-border space-y-3 flex flex-col justify-between cy-hover-card">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17ABA9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M 6 20 C 6 16, 9 14, 12 14 C 15 14, 18 16, 18 20" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-mono text-teal font-semibold uppercase tracking-widestlabel mb-1">
                    STEP 01
                  </div>
                  <h3 className="font-heading font-semibold text-base text-text">
                    Build your profile
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mt-1">
                    Select your operational role and experience level. Lock in your track.
                  </p>
                </div>
              </Reveal>

              {/* Step 2 */}
              <Reveal variant="fade-up" className="bg-surface p-6 rounded-2xl border border-border space-y-3 flex flex-col justify-between cy-hover-card">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E5E6E6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="16" rx="3" />
                      <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="3 3" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-mono text-text font-semibold uppercase tracking-widestlabel mb-1">
                    STEP 02
                  </div>
                  <h3 className="font-heading font-semibold text-base text-text">
                    Learn alone or enter a team
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mt-1">
                    Practice solo at your own pace or queue into a 3-person combat squad.
                  </p>
                </div>
              </Reveal>

              {/* Step 3 */}
              <Reveal variant="fade-up" className="bg-surface p-6 rounded-2xl border border-border space-y-3 flex flex-col justify-between cy-hover-card">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA694B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15 8 21 9 17 14 18 20 12 17 6 20 7 14 3 9 9 8 12 2" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-mono text-coral font-semibold uppercase tracking-widestlabel mb-1">
                    STEP 03
                  </div>
                  <h3 className="font-heading font-semibold text-base text-text">
                    Play: attack, defend, review
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mt-1">
                    Launch attacks, parse headers, triage alerts, and examine post-match telemetry.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3.3: RED VS BLUE SPLIT SECTION */}
      <section className="py-16 sm:py-24 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <DecodeText
              text="COMBAT DISCIPLINES"
              className="text-[11px] text-muted tracking-widest uppercase font-semibold block"
            />
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tightest">
              <SplitText text="Two disciplines. Shared battlefield." as="span" />
            </h2>
            <Reveal variant="fade-up" delay={100}>
              <p className="text-xs sm:text-sm text-muted">
                Choose your side or master both across synchronized exercises.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl border border-border overflow-hidden relative shadow-lg">
            {/* Center seam using the brand gradient */}
            <div
              className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 z-20 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, #EA694B 0%, #17ABA9 100%)' }}
            />

            {/* Left Panel: Red Team (Coral-tinted) */}
            <div
              data-cy-reveal="slide-left"
              className="p-8 sm:p-10 bg-[#140e0c]/80 border-b md:border-b-0 md:border-r border-border/60 space-y-6 cy-hover-card"
            >
              <div className="flex items-center justify-between">
                <Badge type="red" />
                <span className="text-[11px] font-mono text-coral/80">OFFENSIVE</span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-2xl text-coral tracking-tight">
                  Red Team Operators
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Probe perimeter vulnerabilities, craft targeted lures, and maintain stealth.
                </p>
              </div>

              {/* 3 Short Bullets */}
              <ul className="space-y-2.5 text-xs text-text">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0" />
                  <span><strong>Reconnaissance:</strong> Map directory roles and department hierarchy.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0" />
                  <span><strong>Weaponization:</strong> Construct lookalike lures using GoPhish.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0" />
                  <span><strong>Lateral Movement:</strong> Establish footholds on synthetic targets.</span>
                </li>
              </ul>
            </div>

            {/* Right Panel: Blue Team (Teal-tinted) */}
            <div
              data-cy-reveal="slide-right"
              className="p-8 sm:p-10 bg-[#0b1414]/80 space-y-6 cy-hover-card"
            >
              <div className="flex items-center justify-between">
                <Badge type="blue" />
                <span className="text-[11px] font-mono text-teal/80">DEFENSIVE</span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-2xl text-teal tracking-tight">
                  Blue Team Defenders
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Monitor network feeds, parse anomalies, and isolate compromised hosts.
                </p>
              </div>

              {/* 3 Short Bullets */}
              <ul className="space-y-2.5 text-xs text-text">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                  <span><strong>Detection:</strong> Parse RFC822 headers and link destinations.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                  <span><strong>Validation:</strong> Evaluate SPF, DKIM, and DMARC alignment.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                  <span><strong>Containment:</strong> Trigger SOC alerts and purge malicious mailboxes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3.4: "LEARN ALONE OR ENTER A TEAM" (Mirroring Dashboard) */}
      <section className="py-16 sm:py-24 border-b border-border bg-surface/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <DecodeText
              text="OPERATIONAL MODES"
              className="text-[11px] text-muted tracking-widest uppercase font-semibold block"
            />
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tightest">
              <SplitText text="Learn alone or enter a team" as="span" />
            </h2>
            <Reveal variant="fade-up" delay={100}>
              <p className="text-xs sm:text-sm text-muted">
                Select your mode of operation. Both paths land in isolated range pods.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-cy-stagger="true">
            {/* Card 1: Learn Alone */}
            <Reveal variant="fade-up" className="bg-surface p-8 rounded-2xl border border-border hover:border-teal/50 hover:shadow-glow-teal transition-all flex flex-col justify-between cy-hover-card cy-hud">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-text">Learn alone</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Self-paced solo exercises. Zero team dependencies. Practice reconnaissance
                    and triage in dedicated sandboxes.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-2 border border-border text-xs text-muted space-y-1 font-mono">
                  <div>Pod: Single-User VM</div>
                  <div>Domain: fintechcorp.local</div>
                  <div className="text-teal">Matchmaking: Instant</div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setIsDisclaimerOpen(true)}
                  className="cy-btn-sheen w-full py-2.5 px-4 rounded-xl border border-border text-text font-heading font-semibold text-xs hover:border-teal hover:text-teal transition-colors flex items-center justify-center gap-2"
                >
                  Enter Solo Range <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Reveal>

            {/* Card 2: Enter a team */}
            <Reveal variant="fade-up" className="bg-surface p-8 rounded-2xl border border-border hover:border-coral/50 hover:shadow-glow-coral transition-all flex flex-col justify-between cy-hover-card cy-hud">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
                  <Users2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-text">Enter a team</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Live adversary squad sessions. Group with 3+ operatives, pick Red or Blue,
                    and match against opposing squads.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-2 border border-border text-xs text-muted space-y-1 font-mono">
                  <div>Quorum: 3+ Operatives</div>
                  <div>Battle: Red vs Blue 1v1</div>
                  <div className="text-coral">Matchmaking: Automated</div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setIsDisclaimerOpen(true)}
                  className="cy-btn-sheen w-full py-2.5 px-4 rounded-xl bg-teal text-bg font-heading font-semibold text-xs hover:shadow-glow-teal transition-all flex items-center justify-center gap-2"
                >
                  Enter Squad Lobby <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 3.5: "BUILT SECURE BY DESIGN" */}
      <section className="py-16 sm:py-24 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <DecodeText
              text="SECURITY POSTURE"
              className="text-[11px] text-muted tracking-widest uppercase font-semibold block"
            />
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tightest">
              <SplitText text="Built secure by design" as="span" />
            </h2>
            <Reveal variant="fade-up" delay={100}>
              <p className="text-xs sm:text-sm text-muted">
                Strict isolation ensures range activities never touch production systems.
              </p>
            </Reveal>
          </div>

          {/* Segmented Network Diagram */}
          <Reveal variant="scale" className="p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-md cy-hud">
            <SegmentedNetworkDiagram />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-muted" data-cy-stagger="true">
            <Reveal variant="fade-up" className="p-5 rounded-xl bg-surface border border-border space-y-2 cy-hover-card">
              <strong className="text-text block font-heading font-semibold text-sm">
                Network Segmentation
              </strong>
              <p className="leading-relaxed">
                Dedicated VLANs and Proxmox SDN firewall policies prevent lateral leakage across tenants.
              </p>
            </Reveal>
            <Reveal variant="fade-up" className="p-5 rounded-xl bg-surface border border-border space-y-2 cy-hover-card">
              <strong className="text-text block font-heading font-semibold text-sm">
                Least Privilege Access
              </strong>
              <p className="leading-relaxed">
                Operator-provisioned authentication with role constraints and zero self-registration.
              </p>
            </Reveal>
            <Reveal variant="fade-up" className="p-5 rounded-xl bg-surface border border-border space-y-2 cy-hover-card">
              <strong className="text-text block font-heading font-semibold text-sm">
                Monitored Environments
              </strong>
              <p className="leading-relaxed">
                Continuous telemetry captures scoring metrics while keeping corporate data 100% synthetic.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 3.6: CLOSING CTA BAND */}
      <section className="py-20 bg-surface/70 text-center relative">
        <ConcentricWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <Reveal variant="scale" className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-6 relative z-10 cy-glass p-8 sm:p-12 rounded-3xl">
          <div>
            <Badge type="v1" />
          </div>

          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-text tracking-tightest">
            <SplitText text="Ready to test your readiness?" as="span" />
          </h2>

          <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto">
            Access the live invite-only Proxmox cyber range today.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="cy-btn-sheen px-8 py-3.5 rounded-xl bg-teal text-bg font-heading font-semibold text-sm hover:shadow-glow-teal transition-all inline-flex items-center gap-2 focus:ring-2 focus:ring-teal focus:outline-none"
            >
              <ShieldCheck className="w-4 h-4" />
              Test Our Product
            </button>
          </div>
        </Reveal>
      </section>

      {/* Mandatory Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
