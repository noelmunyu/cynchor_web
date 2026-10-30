'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Badge } from '@/components/common/Badge';
import { ConcentricWatermark } from '@/components/illustrations/ConcentricWatermark';
import { Target, Shield, Compass, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-bg text-text py-12 sm:py-16 relative overflow-hidden">
      <ConcentricWatermark className="top-12 -right-48" />

      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-12 relative z-10">
        {/* Header with Logo */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Badge type="v2" />
          </div>

          <div className="flex justify-center py-2">
            <Logo size="xl" href={null} />
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text tracking-tightest">
            The story behind <span className="gradient-text font-black">Cynchor.</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Bridging theoretical cybersecurity education with adversarial realism.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-surface p-8 sm:p-10 rounded-3xl border border-border space-y-6 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-text">
              Anchoring cyber defense in practical reality
            </h2>
            <p className="text-muted leading-relaxed">
              [Owner Story Placeholder: Traditional cyber training relies on multiple-choice quizzes
              or disconnected CTF puzzles that fail to simulate operational pressure. Cynchor was built
              to provide authentic environments where operators face real adversarial tactics.]
            </p>
            <p className="text-muted leading-relaxed">
              From our live Proxmox-based on-premise lab (V1) to our upcoming AWS cloud platform (V2),
              every component replicates authentic network topologies without risking production assets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-1">
              <div className="font-heading font-bold text-xs text-text flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-coral" />
                <span>Adversarial</span>
              </div>
              <p className="text-[11px] text-muted">
                Offensive simulation mirroring real threat actors.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-1">
              <div className="font-heading font-bold text-xs text-text flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal" />
                <span>Defensive</span>
              </div>
              <p className="text-[11px] text-muted">
                Triage, SIEM monitoring, and containment protocols.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-1">
              <div className="font-heading font-bold text-xs text-text flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-text" />
                <span>Grounded</span>
              </div>
              <p className="text-[11px] text-muted">
                100% synthetic data isolated from real production.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Language Note */}
        <div className="p-6 rounded-2xl border border-border bg-surface space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-text uppercase tracking-widestlabel">
              Brand Visual System
            </h3>
            <span className="text-[10px] font-mono text-muted bg-surface-2 px-2 py-0.5 rounded border border-border">
              DESIGN SYSTEM v1.1
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            The circular anchor mark represents containment and stability. Its vertical gradient flows from
            brand teal (<code className="text-teal font-mono">#17ABA9</code>) down to brand coral (<code className="text-coral font-mono">#EA694B</code>),
            embodying the dynamic balance between Blue Team defenders and Red Team adversaries.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link
            href="/demo/login"
            className="py-2.5 px-5 rounded-xl bg-teal text-bg font-heading font-semibold text-xs hover:shadow-glow-teal transition-all inline-flex items-center gap-1.5"
          >
            Access Live Demo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
