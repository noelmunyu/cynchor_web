'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import { ZoneDiagram } from '@/components/visuals/ZoneDiagram';
import { SECURITY_CONTENT, SecurityControl, SecurityPrinciple } from '@/content/security-controls';
import {
  Shield,
  Layers,
  Lock,
  Database,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Mail,
  FileCode,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function SecurityPage() {
  // Config-driven controls: RENDER ONLY items with verified === true
  const verifiedControls = SECURITY_CONTENT.controls.filter((c) => c.verified === true);

  const getPrincipleIcon = (iconName: string) => {
    switch (iconName) {
      case 'layers':
        return <Layers className="w-5 h-5 text-teal" />;
      case 'shield-check':
        return <ShieldCheck className="w-5 h-5 text-teal" />;
      case 'database':
        return <Database className="w-5 h-5 text-teal" />;
      case 'file-text':
        return <FileText className="w-5 h-5 text-teal" />;
      case 'key':
        return <Lock className="w-5 h-5 text-teal" />;
      case 'user-check':
        return <UserCheck className="w-5 h-5 text-teal" />;
      default:
        return <Shield className="w-5 h-5 text-teal" />;
    }
  };

  return (
    <div className="bg-[#09090B] text-text min-h-screen py-10 sm:py-16 selection:bg-teal/30 selection:text-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-surface border border-border text-muted">
              {SECURITY_CONTENT.hero.badge}
            </span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-text tracking-tightest">
            Security is the architecture,{' '}
            <span className="gradient-text font-black">not an add-on.</span>
          </h1>

          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed font-sans">
            {SECURITY_CONTENT.hero.subtitle}
          </p>
        </div>

        {/* 4.1 DEFENSE-IN-DEPTH DIAGRAM */}
        <section className="space-y-4">
          <ZoneDiagram />
        </section>

        {/* 4.2 PRINCIPLE CARDS (6) */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
              Architectural Principles
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Foundational isolation guarantees enforced across every layer of the training platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECURITY_CONTENT.principles.map((principle: SecurityPrinciple) => (
              <div
                key={principle.id}
                className="bg-surface p-6 rounded-2xl border border-border hover:border-teal/40 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#14141B] border border-[#26262C] flex items-center justify-center">
                    {getPrincipleIcon(principle.icon)}
                  </div>
                  <h3 className="font-heading font-bold text-base text-text">
                    {principle.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed font-sans">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4.3 CONTROLS GRID: RENDER ONLY VERIFIED CONTROLS */}
        <section className="space-y-6">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
              Verified Security Controls
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Live, tested controls implemented and continuously verified in our codebase and test harness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedControls.map((ctrl: SecurityControl) => (
              <div
                key={ctrl.id}
                className="p-5 rounded-2xl bg-[#0E0F14] border border-border hover:border-teal/50 transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading font-semibold text-sm text-text">
                    {ctrl.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                      ctrl.status === 'live-v1'
                        ? 'bg-teal/15 text-teal border border-teal/30'
                        : 'bg-[#181820] text-muted border border-border'
                    }`}
                  >
                    {ctrl.status === 'live-v1' ? 'Live in V1' : 'Designed for V2'}
                  </span>
                </div>

                <p className="text-xs text-muted leading-relaxed font-sans">
                  {ctrl.description}
                </p>

                <div className="pt-2 border-t border-[#26262C]/60 flex items-start gap-1.5 text-[11px] font-mono text-teal">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text">How we verify:</strong> {ctrl.howWeVerify}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4.4 HONESTY BLOCK: WHAT WE DON'T CLAIM */}
        <section className="bg-[#101015] rounded-2xl border border-coral/30 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-coral">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <h3 className="font-heading font-bold text-lg text-text">
              {SECURITY_CONTENT.honestyBlock.title}
            </h3>
          </div>

          <div className="space-y-2.5 text-xs text-muted font-sans leading-relaxed">
            {SECURITY_CONTENT.honestyBlock.points.map((point: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-1.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4.5 RESPONSIBLE DISCLOSURE & SECURITY.TXT */}
        <section className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-text flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal" />
                <span>{SECURITY_CONTENT.responsibleDisclosure.title}</span>
              </h3>
              <p className="text-xs text-muted font-sans mt-1">
                {SECURITY_CONTENT.responsibleDisclosure.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/.well-known/security.txt"
                className="px-3 py-1.5 rounded-lg bg-[#14141B] border border-border text-xs font-mono text-teal hover:border-teal flex items-center gap-1.5 transition-colors"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>RFC 9116 security.txt</span>
                <ExternalLink className="w-3 h-3 text-muted" />
              </Link>
            </div>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <div className="font-mono text-muted text-[11px] uppercase tracking-wider font-semibold">
              Reporting Guidelines
            </div>
            <ul className="space-y-1.5 text-muted leading-relaxed">
              {SECURITY_CONTENT.responsibleDisclosure.guidelines.map((guide: string, gIdx: number) => (
                <li key={gIdx} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-teal" />
                  <span>{guide}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 font-mono text-xs text-text">
              Contact Email: <a href="mailto:security@cynchor.com" className="text-teal hover:underline">security@cynchor.com</a>
            </div>
          </div>
        </section>

        {/* CTA BAND */}
        <section className="bg-gradient-to-r from-[#111116] via-[#16161D] to-[#111116] border border-border rounded-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2">
            <Badge type="v1" size="md" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text">
              Inspect the Live V1 Architecture
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Explore our active Proxmox VE hypervisor setup, SDN bridge maps, and invitation authentication.
            </p>
          </div>

          <div>
            <Link
              href="/demo/architecture"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal text-black font-heading font-bold text-sm hover:bg-teal/90 transition-all shadow-lg hover:shadow-teal/20"
            >
              <span>Test Our Product</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
