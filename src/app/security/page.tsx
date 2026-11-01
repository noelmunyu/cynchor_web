import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Badge } from '@/components/common/Badge';
import { ZoneDiagram } from '@/components/visuals/ZoneDiagram';
import { SECURITY_CONTENT, SecurityControl } from '@/content/security-controls';
import { TRUST_CENTER_CONTENT } from '@/content/trust-center';
import {
  TrustCenterTOC,
  PrintButton,
  QuickAnswersAccordion,
} from '@/components/visuals/TrustCenterInteractive';
import {
  Shield,
  Lock,
  Database,
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  FileCode,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Server,
  Terminal,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: TRUST_CENTER_CONTENT.meta.title,
  description: TRUST_CENTER_CONTENT.meta.description,
};

export default function SecurityPage() {
  const claimedControls = SECURITY_CONTENT.controls.filter(
    (c: SecurityControl) => c.visibility === 'claimed'
  );
  const roadmapControls = SECURITY_CONTENT.controls.filter(
    (c: SecurityControl) => c.visibility === 'roadmap'
  );

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
    <div className="bg-[#09090B] text-text min-h-screen py-8 sm:py-12 selection:bg-teal/30 selection:text-white">
      {/* Print Stylesheet */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body { background: #ffffff !important; color: #000000 !important; }
              nav, footer, .no-print { display: none !important; }
              .bg-\\[\\#09090B\\], .bg-surface, .bg-\\[\\#0E0F14\\], .bg-\\[\\#101015\\], .bg-\\[\\#121217\\] {
                background: #ffffff !important;
                color: #000000 !important;
                border-color: #d1d5db !important;
                box-shadow: none !important;
              }
              .text-text, .text-muted { color: #111827 !important; }
              .text-teal { color: #0f766e !important; }
              .text-coral { color: #b91c1c !important; }
              .border, .border-border { border-color: #e5e7eb !important; }
              a { text-decoration: underline !important; color: #000000 !important; }
            }
          `,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-8 sm:space-y-12">
        {/* HEADER STRIP */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-surface border border-border">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#16161E] border border-border text-teal">
              Trust Center
            </span>
            <span className="text-muted">
              Last reviewed:{' '}
              <strong className="text-text">{TRUST_CENTER_CONTENT.meta.lastReviewed}</strong>
            </span>
            <span className="text-border hidden sm:inline">|</span>
            <span className="text-muted">
              Reviewed by:{' '}
              <strong className="text-text">{TRUST_CENTER_CONTENT.meta.reviewedBy}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-teal/15 text-teal border border-teal/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>{claimedControls.length} In place</span>
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#181820] text-muted border border-border">
                <Clock className="w-3 h-3" />
                <span>{roadmapControls.length} On roadmap</span>
              </span>
            </div>
            <PrintButton />
          </div>
        </div>

        {/* HERO TITLE BLOCK */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2 pb-6">
          <div className="inline-flex items-center gap-2">
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

        {/* MAIN LAYOUT: Sticky Left TOC + Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          {/* Table of Contents (Client Interactive: Desktop Sticky & Mobile Collapsible) */}
          <TrustCenterTOC />

          {/* CONTENT COLUMN */}
          <div className="min-w-0 flex-1 space-y-16">
            {/* ════════════════════════════════════════════════════════════
                2.1 OVERVIEW + OUR POSTURE IN PLAIN LANGUAGE
               ════════════════════════════════════════════════════════════ */}
            <section id="overview" className="space-y-6 scroll-mt-24">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                  Section 2.1
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
                  {TRUST_CENTER_CONTENT.posture.title}
                </h2>
              </div>

              {/* 3 Honest Sentences */}
              <div className="p-6 rounded-2xl bg-[#0E0F14] border border-border space-y-3 font-sans text-sm sm:text-base text-muted leading-relaxed">
                {TRUST_CENTER_CONTENT.posture.sentences.map((sentence, idx) => (
                  <p key={idx} className="text-text/90">
                    {sentence}
                  </p>
                ))}
              </div>

              {/* Verified Controls (In Place) */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-lg text-text flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal" />
                    <span>In-Place Controls (Verified with Evidence)</span>
                  </h3>
                  <span className="text-xs font-mono text-teal">
                    {claimedControls.length} active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {claimedControls.map((ctrl) => (
                    <div
                      key={ctrl.id}
                      id={ctrl.id}
                      className="p-5 rounded-2xl bg-[#0E0F14] border border-border hover:border-teal/40 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-heading font-semibold text-sm text-text">
                            {ctrl.title}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 bg-teal/15 text-teal border border-teal/30">
                            In place
                          </span>
                        </div>
                        <p className="text-xs text-muted leading-relaxed font-sans">
                          {ctrl.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#1C1C24] space-y-1.5 text-[11px] font-mono text-teal/90">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal" />
                          <span>
                            <strong className="text-text font-medium">How we verify:</strong>{' '}
                            {ctrl.howWeVerify}
                          </span>
                        </div>
                        {ctrl.evidence && ctrl.evidence.length > 0 && (
                          <div className="text-[10px] text-muted space-y-0.5 pl-5">
                            {ctrl.evidence.map((ev, i) => (
                              <div key={i} className="truncate">
                                Source: <code className="text-teal">{ev.file}</code>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roadmap Controls (Not Yet In Place) */}
              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-lg text-text flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted" />
                    <span>On Our Roadmap (Not Yet In Place)</span>
                  </h3>
                  <span className="text-xs font-mono text-muted">
                    {roadmapControls.length} planned
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roadmapControls.map((ctrl) => (
                    <div
                      key={ctrl.id}
                      id={ctrl.id}
                      className="p-5 rounded-2xl bg-[#0A0A0E] border border-border/80 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-heading font-semibold text-sm text-text/80">
                            {ctrl.title}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 bg-[#181820] text-muted border border-border">
                            Not yet in place
                          </span>
                        </div>
                        <p className="text-xs text-muted/80 leading-relaxed font-sans">
                          {ctrl.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#1C1C24] text-[11px] font-mono text-muted flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted/60" />
                        <span>
                          <strong className="text-text font-medium">Target:</strong>{' '}
                          {ctrl.howWeVerify}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
                2.2 COMPLIANCE STATUS
               ════════════════════════════════════════════════════════════ */}
            <section id="compliance" className="space-y-6 scroll-mt-24">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                  Section 2.2
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
                  {TRUST_CENTER_CONTENT.compliance.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  {TRUST_CENTER_CONTENT.compliance.subtitle}
                </p>
              </div>

              {/* Compliance Table */}
              <div className="overflow-x-auto rounded-2xl border border-border bg-[#0E0F14]">
                <table className="w-full text-left text-xs sm:text-sm font-sans">
                  <caption className="sr-only">Regulatory and Third-Party Compliance Status</caption>
                  <thead>
                    <tr className="border-b border-border bg-[#14141B] font-mono text-xs uppercase tracking-wider text-muted">
                      <th scope="col" className="p-4 sm:px-6 sm:py-3.5 font-semibold">
                        Framework
                      </th>
                      <th scope="col" className="p-4 sm:px-6 sm:py-3.5 font-semibold">
                        Status
                      </th>
                      <th scope="col" className="p-4 sm:px-6 sm:py-3.5 font-semibold">
                        Evidence / Current Reality
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {TRUST_CENTER_CONTENT.compliance.rows.map((row) => {
                      // Only allow 'in-progress' or 'certified' if owner supplies evidenceUrl
                      const isCertified = row.status === 'certified' && !!row.evidenceUrl;
                      const isInProgress = row.status === 'in-progress' && !!row.evidenceUrl;
                      const label = isCertified
                        ? 'Certified'
                        : isInProgress
                        ? 'In progress'
                        : row.statusLabel;

                      return (
                        <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                          <th scope="row" className="p-4 sm:px-6 font-heading font-semibold text-text whitespace-nowrap">
                            {row.framework}
                            <div className="font-sans font-normal text-xs text-muted mt-0.5">
                              {row.description}
                            </div>
                          </th>
                          <td className="p-4 sm:px-6 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold ${
                                isCertified
                                  ? 'bg-teal/15 text-teal border border-teal/30'
                                  : isInProgress
                                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                  : 'bg-[#15151A] text-muted border border-border/80'
                              }`}
                            >
                              {label}
                            </span>
                          </td>
                          <td className="p-4 sm:px-6 text-xs text-muted leading-relaxed">
                            {row.notes}
                            {row.evidenceUrl && (
                              <div className="mt-1">
                                <a
                                  href={row.evidenceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal hover:underline font-mono text-[11px]"
                                >
                                  View Auditor Attestation →
                                </a>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-xs font-mono text-muted/80 italic">
                {TRUST_CENTER_CONTENT.compliance.disclaimer}
              </p>
            </section>

            {/* ════════════════════════════════════════════════════════════
                2.3 APPLICATION SECURITY
               ════════════════════════════════════════════════════════════ */}
            <section id="app-sec" className="space-y-6 scroll-mt-24">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                  Section 2.3
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
                  {TRUST_CENTER_CONTENT.applicationSecurity.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  {TRUST_CENTER_CONTENT.applicationSecurity.subtitle}
                </p>
              </div>

              {/* SDLC Practices */}
              <div className="space-y-3">
                <h3 className="font-heading font-semibold text-base text-text flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-teal" />
                  <span>Enforced SDLC Practices (Live Codebase)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TRUST_CENTER_CONTENT.applicationSecurity.sdlcPractices.map((sdlc, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-[#0E0F14] border border-border space-y-2"
                    >
                      <div className="font-heading font-semibold text-sm text-text flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal shrink-0" />
                        <span>{sdlc.title}</span>
                      </div>
                      <p className="text-xs text-muted font-sans leading-relaxed">
                        {sdlc.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* App Sec Roadmap */}
              <div className="p-5 rounded-2xl bg-[#0E0F14] border border-border space-y-3">
                <div className="font-heading font-semibold text-sm text-text flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted" />
                  <span>Application Security Roadmap</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans text-muted">
                  {TRUST_CENTER_CONTENT.applicationSecurity.roadmap.map((rd, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#14141B] border border-border/60 space-y-1">
                      <div className="font-semibold text-text">{rd.title}</div>
                      <p className="text-[11.5px] leading-relaxed">{rd.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
                2.4 INFRASTRUCTURE BASELINE
               ════════════════════════════════════════════════════════════ */}
            <section id="infrastructure" className="space-y-6 scroll-mt-24">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                  Section 2.4
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
                  {TRUST_CENTER_CONTENT.infrastructure.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  {TRUST_CENTER_CONTENT.infrastructure.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRUST_CENTER_CONTENT.infrastructure.baseline.map((base, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[#0E0F14] border border-border space-y-1.5"
                  >
                    <div className="font-mono text-xs text-teal font-semibold">
                      {base.category}
                    </div>
                    <p className="text-xs text-muted font-sans leading-relaxed">
                      {base.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Encryption at Rest Honest Note */}
              <div className="p-4 rounded-xl bg-[#14141B] border border-border flex items-start gap-3 text-xs font-sans text-muted">
                <Clock className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text font-semibold">Encryption at rest:</strong>{' '}
                  {TRUST_CENTER_CONTENT.infrastructure.encryptionAtRestNote}
                </div>
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
                2.5 DATA WE COLLECT
               ════════════════════════════════════════════════════════════ */}
            <section id="data-collected" className="space-y-6 scroll-mt-24">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                  Section 2.5
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
                  {TRUST_CENTER_CONTENT.dataCollected.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  {TRUST_CENTER_CONTENT.dataCollected.subtitle}
                </p>
              </div>

              {/* Schema Table */}
              <div className="overflow-x-auto rounded-2xl border border-border bg-[#0E0F14]">
                <table className="w-full text-left text-xs sm:text-sm font-sans">
                  <caption className="sr-only">Persistent Database Inventory and Privacy Controls</caption>
                  <thead>
                    <tr className="border-b border-border bg-[#14141B] font-mono text-xs uppercase tracking-wider text-muted">
                      <th scope="col" className="p-4 sm:px-6 sm:py-3.5 font-semibold">
                        Table / Entity
                      </th>
                      <th scope="col" className="p-4 sm:px-6 sm:py-3.5 font-semibold">
                        Fields Stored
                      </th>
                      <th scope="col" className="p-4 sm:px-6 sm:py-3.5 font-semibold">
                        Purpose
                      </th>
                      <th scope="col" className="p-4 sm:px-6 sm:py-3.5 font-semibold">
                        Hashing / Protection
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {TRUST_CENTER_CONTENT.dataCollected.items.map((item, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <th scope="row" className="p-4 sm:px-6 font-mono font-semibold text-text whitespace-nowrap">
                          {item.table}
                        </th>
                        <td className="p-4 sm:px-6 font-mono text-xs text-teal/90">
                          {item.fields}
                        </td>
                        <td className="p-4 sm:px-6 text-xs text-muted leading-relaxed">
                          {item.purpose}
                        </td>
                        <td className="p-4 sm:px-6 text-xs text-muted leading-relaxed">
                          {item.isHashed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary and Statements */}
              <div className="space-y-3 font-sans text-xs sm:text-sm text-muted">
                <p className="text-text font-medium leading-relaxed">
                  {TRUST_CENTER_CONTENT.dataCollected.plainSummary}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                  <span className="text-muted">
                    {TRUST_CENTER_CONTENT.dataCollected.retentionNote}
                  </span>
                  {TRUST_CENTER_CONTENT.dataCollected.hostingRegion && (
                    <span className="text-text">
                      Hosting region: {TRUST_CENTER_CONTENT.dataCollected.hostingRegion}
                    </span>
                  )}
                </div>

                {/* AI / ML Exact Statement */}
                <div className="p-4 rounded-xl bg-[#14141B] border border-teal/30 text-xs font-sans text-text leading-relaxed">
                  <div className="font-mono text-[11px] text-teal uppercase tracking-wider font-semibold mb-1">
                    Artificial Intelligence Disclosure
                  </div>
                  {TRUST_CENTER_CONTENT.dataCollected.aiDisclosure}
                </div>
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
                2.6 THIRD PARTIES & SUBPROCESSORS
               ════════════════════════════════════════════════════════════ */}
            <section id="third-parties" className="space-y-6 scroll-mt-24">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                  Section 2.6
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
                  {TRUST_CENTER_CONTENT.subprocessors.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  {TRUST_CENTER_CONTENT.subprocessors.subtitle}
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-border bg-[#0E0F14]">
                <table className="w-full text-left text-xs sm:text-sm font-sans">
                  <caption className="sr-only">Third Party Subprocessors and External Network Endpoints</caption>
                  <thead>
                    <tr className="border-b border-border bg-[#14141B] font-mono text-xs uppercase tracking-wider text-muted">
                      <th scope="col" className="p-4 sm:px-6 sm:py-3.5 font-semibold">
                        Provider / Service
                      </th>
                      <th scope="col" className="p-4 sm:px-6 sm:py-3.5 font-semibold">
                        Purpose
                      </th>
                      <th scope="col" className="p-4 sm:px-6 sm:py-3.5 font-semibold">
                        Data Shared
                      </th>
                      <th scope="col" className="p-4 sm:px-6 sm:py-3.5 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {TRUST_CENTER_CONTENT.subprocessors.roster
                      .filter((sp) => sp.isVisible)
                      .map((sp) => (
                        <tr key={sp.id} className="hover:bg-white/[0.02] transition-colors">
                          <th scope="row" className="p-4 sm:px-6 font-heading font-semibold text-text whitespace-nowrap">
                            {sp.name}
                          </th>
                          <td className="p-4 sm:px-6 text-xs text-muted leading-relaxed">
                            {sp.purpose}
                          </td>
                          <td className="p-4 sm:px-6 text-xs text-muted leading-relaxed">
                            {sp.dataShared}
                          </td>
                          <td className="p-4 sm:px-6 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono text-muted bg-[#181820] border border-border">
                              {sp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14141B] border border-border text-xs font-mono text-text flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
                <span>{TRUST_CENTER_CONTENT.subprocessors.noVendorsStatement}</span>
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
                2.7 ACCESS CONTROL & IDENTITY
               ════════════════════════════════════════════════════════════ */}
            <section id="access-control" className="space-y-6 scroll-mt-24">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                  Section 2.7
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
                  {TRUST_CENTER_CONTENT.accessControl.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  {TRUST_CENTER_CONTENT.accessControl.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRUST_CENTER_CONTENT.accessControl.principles.map((principle, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-[#0E0F14] border border-border space-y-2"
                  >
                    <div className="font-heading font-semibold text-sm text-text flex items-center gap-2">
                      <Lock className="w-4 h-4 text-teal" />
                      <span>{principle.title}</span>
                    </div>
                    <p className="text-xs text-muted font-sans leading-relaxed">
                      {principle.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
                2.8 INCIDENT RESPONSE & COORDINATED DISCLOSURE
               ════════════════════════════════════════════════════════════ */}
            <section id="incident-response" className="space-y-6 scroll-mt-24">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                  Section 2.8
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
                  {TRUST_CENTER_CONTENT.incidentResponse.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  {TRUST_CENTER_CONTENT.incidentResponse.subtitle}
                </p>
              </div>

              {/* OWNER TODO: Ensure security@cynchor.com mailbox is active before public release */}
              <div className="p-6 rounded-2xl bg-[#0E0F14] border border-border space-y-5 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <div className="font-heading font-bold text-base text-text flex items-center gap-2">
                      <Mail className="w-4 h-4 text-teal" />
                      <span>Coordinated Vulnerability Disclosure (VDP)</span>
                    </div>
                    <div className="text-xs text-muted mt-1">
                      Report vulnerabilities directly to our engineering team at{' '}
                      <a
                        href={`mailto:${TRUST_CENTER_CONTENT.incidentResponse.contactEmail}`}
                        className="text-teal hover:underline font-mono"
                      >
                        {TRUST_CENTER_CONTENT.incidentResponse.contactEmail}
                      </a>
                    </div>
                  </div>

                  <Link
                    href={TRUST_CENTER_CONTENT.incidentResponse.securityTxtUrl}
                    className="px-3 py-1.5 rounded-lg bg-[#14141B] border border-border text-xs font-mono text-teal hover:border-teal flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>RFC 9116 security.txt</span>
                    <ExternalLink className="w-3 h-3 text-muted" />
                  </Link>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-mono text-[11px] text-muted uppercase tracking-wider font-semibold">
                    Researcher Guidelines
                  </div>
                  <ul className="space-y-1.5 text-muted leading-relaxed">
                    {TRUST_CENTER_CONTENT.incidentResponse.guidelines.map((guide, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0 mt-1.5" />
                        <span>{guide}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Response Targets */}
                <div className="p-3.5 rounded-xl bg-[#14141B] border border-border/80 text-xs font-mono text-muted flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                  <div>
                    {TRUST_CENTER_CONTENT.incidentResponse.acknowledgementTarget ? (
                      <span>
                        Acknowledgement: {TRUST_CENTER_CONTENT.incidentResponse.acknowledgementTarget}
                      </span>
                    ) : (
                      <span>{TRUST_CENTER_CONTENT.incidentResponse.responseTargetsNote}</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
                2.9 ARCHITECTURE & TRUST ZONES
               ════════════════════════════════════════════════════════════ */}
            <section id="architecture" className="space-y-6 scroll-mt-24">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                  Section 2.9
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
                  Architecture & Trust Boundaries
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  Config-driven zone isolation model rendering only verified system layers.
                </p>
              </div>

              <ZoneDiagram />

              <div className="p-4 rounded-xl bg-[#14141B] border border-border text-xs font-mono text-muted text-center">
                System Architecture: Coming soon — we&apos;re still building and not yet integrated with AWS.
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
                2.10 QUESTIONNAIRE QUICK ANSWERS
               ════════════════════════════════════════════════════════════ */}
            <section id="faq" className="space-y-6 scroll-mt-24">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                  Section 2.10
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
                  {TRUST_CENTER_CONTENT.quickAnswers.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  {TRUST_CENTER_CONTENT.quickAnswers.subtitle}
                </p>
              </div>

              <QuickAnswersAccordion questions={TRUST_CENTER_CONTENT.quickAnswers.questions} />
            </section>

            {/* ════════════════════════════════════════════════════════════
                2.11 DOCUMENTS & REQUESTS
               ════════════════════════════════════════════════════════════ */}
            <section id="documents" className="space-y-6 scroll-mt-24">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                  Section 2.11
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
                  {TRUST_CENTER_CONTENT.documents.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  {TRUST_CENTER_CONTENT.documents.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TRUST_CENTER_CONTENT.documents.items.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#0E0F14] border border-border flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-surface border border-border text-muted">
                        {doc.type}
                      </span>
                      <h4 className="font-heading font-semibold text-sm text-text mt-3">
                        {doc.title}
                      </h4>
                    </div>

                    {doc.action === 'print' ? (
                      <PrintButton />
                    ) : (
                      <Link
                        href={doc.href}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-teal hover:underline"
                      >
                        <span>Access Document</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mailto Questionnaire Link */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111116] via-[#16161D] to-[#111116] border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-semibold text-base text-text">
                    Need a custom security review or vendor assessment?
                  </h4>
                  <p className="text-xs text-muted mt-1">
                    Direct your vendor evaluation questionnaire to our security team.
                  </p>
                </div>

                <a
                  href={`mailto:${TRUST_CENTER_CONTENT.documents.contactEmail}?subject=Security%20Questionnaire%20Request`}
                  className="px-4 py-2.5 rounded-xl bg-surface border border-border text-xs font-mono text-teal hover:border-teal flex items-center gap-2 transition-colors shrink-0 self-start sm:self-auto"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Request our security questionnaire answers</span>
                </a>
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
                2.12 HONESTY BLOCK: WHAT WE DON'T CLAIM
               ════════════════════════════════════════════════════════════ */}
            <section
              id="honesty"
              className="bg-[#101015] rounded-2xl border border-coral/30 p-6 sm:p-8 space-y-4 scroll-mt-24"
            >
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
          </div>
        </div>
      </div>
    </div>
  );
}
