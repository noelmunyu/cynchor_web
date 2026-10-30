'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import { XPBar } from '@/components/visuals/XPBar';
import { SkillRadar, RadarSkills } from '@/components/visuals/SkillRadar';
import { INDIVIDUALS_CONTENT, TriageCase } from '@/content/individuals';
import {
  Clock,
  User,
  Shield,
  ShieldAlert,
  Flame,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Terminal,
  Send,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function IndividualsPage() {
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);
  const [selectedIndicators, setSelectedIndicators] = useState<Record<string, boolean>>({});
  const [verdictSubmitted, setVerdictSubmitted] = useState<boolean>(false);
  const [userVerdict, setUserVerdict] = useState<string | null>(null);
  const [reportFiled, setReportFiled] = useState<boolean>(false);

  // User Stats State
  const [userXP, setUserXP] = useState<number>(INDIVIDUALS_CONTENT.workstation.initialXP);
  const [callsignIndex, setCallsignIndex] = useState<number>(0);
  const [selectedTrack, setSelectedTrack] = useState<'blue' | 'red' | 'netsec' | 'grc'>('blue');
  const [skills, setSkills] = useState<RadarSkills>({
    recon: 45,
    detection: 60,
    forensics: 50,
    networkDefense: 40,
    incidentResponse: 55,
    reporting: 35,
  });

  const activeCase: TriageCase = INDIVIDUALS_CONTENT.cases[currentCaseIndex];

  const handleToggleIndicator = (indicatorId: string) => {
    if (verdictSubmitted) return;
    setSelectedIndicators((prev) => ({
      ...prev,
      [indicatorId]: !prev[indicatorId],
    }));
  };

  const handleSelectVerdict = (verdict: 'phishing' | 'legitimate' | 'escalate') => {
    if (verdictSubmitted) return;
    setUserVerdict(verdict);
    setVerdictSubmitted(true);

    const isCorrect = verdict === activeCase.correctVerdict;
    if (isCorrect) {
      setUserXP((prev) => prev + 150);
      setSkills((prev) => ({
        recon: Math.min(100, prev.recon + activeCase.radarImpact.recon),
        detection: Math.min(100, prev.detection + activeCase.radarImpact.detection),
        forensics: Math.min(100, prev.forensics + activeCase.radarImpact.forensics),
        networkDefense: Math.min(100, prev.networkDefense + activeCase.radarImpact.networkDefense),
        incidentResponse: Math.min(100, prev.incidentResponse + activeCase.radarImpact.incidentResponse),
        reporting: Math.min(100, prev.reporting + activeCase.radarImpact.reporting),
      }));
    } else {
      setUserXP((prev) => prev + 25);
    }
  };

  const handleFileReport = () => {
    setReportFiled(true);
    setUserXP((prev) => prev + 50);
  };

  const handleNextCase = () => {
    if (currentCaseIndex < INDIVIDUALS_CONTENT.cases.length - 1) {
      setCurrentCaseIndex((prev) => prev + 1);
      setSelectedIndicators({});
      setVerdictSubmitted(false);
      setUserVerdict(null);
      setReportFiled(false);
    }
  };

  const isCaseCorrect = userVerdict === activeCase.correctVerdict;

  return (
    <div className="bg-[#09090B] text-text min-h-screen py-10 sm:py-16 selection:bg-teal/30 selection:text-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-surface border border-border text-muted">
              {INDIVIDUALS_CONTENT.hero.badge}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-teal/10 text-teal border border-teal/20">
              {INDIVIDUALS_CONTENT.hero.conceptLabel}
            </span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-text tracking-tightest">
            Your shift <span className="gradient-text font-black">starts now.</span>
          </h1>

          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
            {INDIVIDUALS_CONTENT.hero.subtitle}
          </p>
        </div>

        {/* 3.1 & 3.2 ANALYST WORKSTATION & MINI-GAME */}
        <section className="bg-[#0D0E12] rounded-2xl border border-border overflow-hidden shadow-2xl space-y-0">
          {/* Workstation Top Bar */}
          <div className="bg-[#121217] px-4 sm:px-6 py-3 border-b border-[#26262C] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-4">
              {/* Shift Clock */}
              <div className="flex items-center gap-1.5 text-muted">
                <Clock className="w-3.5 h-3.5 text-teal" />
                <span>{INDIVIDUALS_CONTENT.workstation.shift}</span>
              </div>

              <div className="h-4 w-px bg-[#26262C] hidden sm:block" />

              {/* Callsign Chip */}
              <button
                onClick={() => setCallsignIndex((prev) => (prev + 1) % INDIVIDUALS_CONTENT.workstation.callsigns.length)}
                className="flex items-center gap-1.5 text-text hover:text-teal transition-colors"
                title="Click to randomize callsign"
              >
                <User className="w-3.5 h-3.5 text-coral" />
                <span className="font-bold">{INDIVIDUALS_CONTENT.workstation.callsigns[callsignIndex]}</span>
                <span className="text-[10px] text-muted">(change)</span>
              </button>

              <div className="h-4 w-px bg-[#26262C] hidden sm:block" />

              {/* Rank Chip */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface border border-border text-[11px] text-teal">
                <Shield className="w-3 h-3" />
                <span>{INDIVIDUALS_CONTENT.workstation.initialRank}</span>
              </div>
            </div>

            {/* Right: XP Bar & Streak */}
            <div className="w-full sm:w-72">
              <XPBar
                currentXP={userXP}
                maxXP={1000}
                rank={INDIVIDUALS_CONTENT.workstation.initialRank}
                streak={4}
                showDetails={true}
              />
            </div>
          </div>

          {/* Main 3-Pane Workstation Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#26262C]">
            {/* Left Rail: Case Queue (3 cols) */}
            <div className="lg:col-span-3 p-4 bg-[#0A0A0D] space-y-3 font-mono text-xs select-none">
              <div className="flex items-center justify-between pb-2 border-b border-[#26262C]">
                <span className="font-bold text-text uppercase tracking-wider text-[11px]">ACTIVE CASE QUEUE</span>
                <span className="text-[10px] text-teal">2 Open Tickets</span>
              </div>

              <div className="space-y-2">
                {INDIVIDUALS_CONTENT.cases.map((cs, idx) => {
                  const isSelected = idx === currentCaseIndex;
                  return (
                    <div
                      key={cs.id}
                      onClick={() => {
                        setCurrentCaseIndex(idx);
                        setSelectedIndicators({});
                        setVerdictSubmitted(false);
                        setUserVerdict(null);
                        setReportFiled(false);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#15151E] border-teal shadow-sm ring-1 ring-teal/30'
                          : 'bg-[#101014] border-[#26262C] hover:border-[#383842] opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-text text-[11px]">{cs.caseNumber}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            cs.severity === 'HIGH'
                              ? 'bg-coral/20 text-coral'
                              : 'bg-blue-400/20 text-blue-400'
                          }`}
                        >
                          {cs.severity}
                        </span>
                      </div>

                      <div className="font-sans text-[12px] text-[#E5E6E6] font-medium truncate mb-2">
                        {cs.title}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-muted pt-1 border-t border-[#26262C]/60">
                        <span>SLA: {cs.slaMinutes}m remaining</span>
                        <span>{cs.syntheticTimestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Triage Guidance */}
              <div className="p-3 rounded-xl bg-[#121217] border border-[#26262C] text-[11px] font-sans text-muted space-y-1">
                <span className="font-mono text-text font-semibold block text-[11px]">Operator Instructions:</span>
                <p className="leading-snug">
                  Inspect the email headers and execution telemetry in the center pane. Tag all anomalous indicators, then file your verdict.
                </p>
              </div>
            </div>

            {/* Center Pane: Case Investigation & Triage Mini-Game (6 cols) */}
            <div className="lg:col-span-6 p-4 sm:p-6 bg-[#0E0E12] space-y-5">
              {/* Ticket Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#26262C]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal">{activeCase.caseNumber}</span>
                    <span className="text-muted text-xs font-mono">/</span>
                    <h2 className="font-heading font-bold text-base text-text">{activeCase.title}</h2>
                  </div>
                  <span className="text-[11px] font-mono text-muted">Synthetic enterprise feed (fintechcorp.local)</span>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-coral/10 text-coral border border-coral/30">
                  SLA: {activeCase.slaMinutes} MIN
                </span>
              </div>

              {/* Synthetic Email Header Viewer */}
              <div className="rounded-xl bg-[#14141B] border border-border p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#26262C] pb-2 text-[11px]">
                  <span className="text-muted uppercase tracking-wider font-semibold">EMAIL HEADER INSPECTOR</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${activeCase.email.spf === 'PASS' ? 'bg-teal/20 text-teal' : 'bg-coral/20 text-coral'}`}>
                      SPF: {activeCase.email.spf}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${activeCase.email.dkim === 'PASS' ? 'bg-teal/20 text-teal' : 'bg-coral/20 text-coral'}`}>
                      DKIM: {activeCase.email.dkim}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-muted">
                  <div><strong className="text-text">From:</strong> {activeCase.email.from}</div>
                  <div><strong className="text-text">To:</strong> {activeCase.email.to}</div>
                  <div><strong className="text-text">Return-Path:</strong> <code className="text-[#38BDF8]">{activeCase.email.returnPath}</code></div>
                  <div><strong className="text-text">Subject:</strong> {activeCase.email.subject}</div>
                  <div><strong className="text-text">Timestamp:</strong> {activeCase.email.date}</div>
                </div>

                {/* Email Body */}
                <div className="p-3 rounded-lg bg-[#0A0A0D] border border-[#26262C] font-sans text-xs text-[#D1D5DB] whitespace-pre-line leading-relaxed">
                  {activeCase.email.body}
                </div>

                {activeCase.email.attachment && (
                  <div className="p-2 rounded bg-coral/10 border border-coral/30 flex items-center justify-between text-xs text-coral font-mono">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{activeCase.email.attachment}</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold">Unsanitized Attachment</span>
                  </div>
                )}
              </div>

              {/* Terminal Trace Output */}
              <div className="rounded-xl bg-[#08080A] border border-[#26262C] p-3 font-mono text-xs space-y-1">
                <div className="text-[10px] text-muted mb-1 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-teal" />
                  <span>SOC DISPATCH CLI ANALYSIS</span>
                </div>
                {activeCase.terminalOutput.map((line, idx) => (
                  <div key={idx} className="text-[#A1A1AA] text-[11px] leading-relaxed">
                    {line}
                  </div>
                ))}
              </div>

              {/* Indicator Checklist */}
              <div className="p-4 rounded-xl bg-[#121217] border border-[#26262C] space-y-3 font-sans">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold text-xs text-text uppercase tracking-wider">
                    Indicator Checklist (Tag Anomalies)
                  </span>
                  <span className="text-[10px] font-mono text-muted">Select all suspicious indicators</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeCase.indicators.map((ind) => {
                    const isChecked = !!selectedIndicators[ind.id];
                    return (
                      <button
                        key={ind.id}
                        onClick={() => handleToggleIndicator(ind.id)}
                        disabled={verdictSubmitted}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2 ${
                          isChecked
                            ? 'bg-teal/10 border-teal text-text'
                            : 'bg-[#18181E] border-[#26262C] text-muted hover:border-[#383842]'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
                            isChecked ? 'bg-teal border-teal text-black' : 'border-muted'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-[11.5px] leading-snug">{ind.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verdict Selection & Action */}
              {!verdictSubmitted ? (
                <div className="space-y-2 pt-2">
                  <div className="font-mono text-xs text-muted uppercase tracking-wider">
                    Choose Security Verdict:
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleSelectVerdict('phishing')}
                      className="py-2.5 px-3 rounded-xl bg-coral/15 border border-coral text-coral font-heading font-bold text-xs hover:bg-coral hover:text-white transition-all shadow-sm"
                    >
                      Malicious Phish
                    </button>
                    <button
                      onClick={() => handleSelectVerdict('legitimate')}
                      className="py-2.5 px-3 rounded-xl bg-teal/15 border border-teal text-teal font-heading font-bold text-xs hover:bg-teal hover:text-black transition-all shadow-sm"
                    >
                      Legitimate
                    </button>
                    <button
                      onClick={() => handleSelectVerdict('escalate')}
                      className="py-2.5 px-3 rounded-xl bg-[#22222A] border border-[#383842] text-text font-heading font-bold text-xs hover:bg-[#2A2A34] transition-all"
                    >
                      Escalate to Tier 2
                    </button>
                  </div>
                </div>
              ) : (
                /* Post-Verdict Feedback & Report Filing Card */
                <div className="space-y-4 pt-2">
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                      isCaseCorrect ? 'bg-teal/10 border-teal text-teal' : 'bg-coral/10 border-coral text-coral'
                    }`}
                  >
                    {isCaseCorrect ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-sm font-heading mb-1">
                        {isCaseCorrect ? 'Verdict Confirmed (+150 XP)' : 'Verdict Inconclusive (+25 XP)'}
                      </div>
                      <p className="text-text font-sans">
                        {isCaseCorrect ? activeCase.feedback.correct : activeCase.feedback.incorrect}
                      </p>
                    </div>
                  </div>

                  {/* Auto-Generated Incident Report Card */}
                  <div className="p-4 rounded-xl bg-[#121218] border border-border space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-[#26262C] pb-2">
                      <div className="flex items-center gap-2 text-text font-semibold">
                        <FileText className="w-4 h-4 text-teal" />
                        <span>INCIDENT REPORT CARD: {activeCase.caseNumber}</span>
                      </div>
                      <span className="text-[10px] text-muted">Auto-drafted</span>
                    </div>

                    <div className="space-y-2 text-[11px] font-sans text-muted">
                      <p><strong className="text-text font-mono">Summary:</strong> {activeCase.incidentReportTemplate.summary}</p>
                      <p><strong className="text-text font-mono">Action:</strong> {activeCase.incidentReportTemplate.recommendedAction}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#26262C]">
                      <span className="text-[10px] text-teal">
                        {reportFiled ? '✓ Report recorded into range audit ledger' : 'Pending analyst sign-off'}
                      </span>
                      {!reportFiled ? (
                        <button
                          onClick={handleFileReport}
                          className="px-3 py-1.5 rounded-lg bg-teal text-black font-bold font-mono text-xs hover:bg-teal/90 transition-colors flex items-center gap-1.5"
                        >
                          <Send className="w-3 h-3" /> File Incident Report (+50 XP)
                        </button>
                      ) : currentCaseIndex < INDIVIDUALS_CONTENT.cases.length - 1 ? (
                        <button
                          onClick={handleNextCase}
                          className="px-4 py-1.5 rounded-lg bg-surface border border-teal text-teal font-bold font-mono text-xs hover:bg-teal hover:text-black transition-colors"
                        >
                          Proceed to Case 2 →
                        </button>
                      ) : (
                        <Link
                          href="/demo/login"
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-teal to-coral text-white font-bold font-mono text-xs hover:opacity-95 transition-opacity"
                        >
                          Shift Complete → Enter Live V1 Demo
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Rail: SkillRadar & Career Track (3 cols) */}
            <div className="lg:col-span-3 p-4 bg-[#0A0A0D] space-y-6 select-none font-mono text-xs">
              {/* Radar Chart */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#26262C]">
                  <span className="font-bold text-text uppercase tracking-wider text-[11px]">SKILL RADAR</span>
                  <span className="text-[10px] text-teal">Live Evolution</span>
                </div>
                <div className="py-2 flex justify-center">
                  <SkillRadar skills={skills} size={210} />
                </div>
              </div>

              {/* Role-Track Switcher */}
              <div className="space-y-2 pt-2 border-t border-[#26262C]">
                <span className="font-bold text-text uppercase tracking-wider text-[11px] block">
                  PRACTICE TRACK
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setSelectedTrack('blue')}
                    className={`p-2 rounded-lg text-left border text-[11px] transition-all ${
                      selectedTrack === 'blue' ? 'bg-teal/15 border-teal text-teal font-bold' : 'bg-[#121217] border-[#26262C] text-muted'
                    }`}
                  >
                    Blue Team
                  </button>
                  <button
                    onClick={() => setSelectedTrack('red')}
                    className={`p-2 rounded-lg text-left border text-[11px] transition-all ${
                      selectedTrack === 'red' ? 'bg-coral/15 border-coral text-coral font-bold' : 'bg-[#121217] border-[#26262C] text-muted'
                    }`}
                  >
                    Red Team
                  </button>
                  <button
                    onClick={() => setSelectedTrack('netsec')}
                    className={`p-2 rounded-lg text-left border text-[11px] transition-all ${
                      selectedTrack === 'netsec' ? 'bg-surface border-text/40 text-text font-bold' : 'bg-[#121217] border-[#26262C] text-muted'
                    }`}
                  >
                    Net Security
                  </button>
                  <button
                    disabled
                    className="p-2 rounded-lg text-left border text-[11px] bg-[#121217] border-[#26262C]/40 text-muted/50 cursor-not-allowed"
                  >
                    GRC <span className="text-[9px] block">Coming soon</span>
                  </button>
                </div>
              </div>

              {/* Recent Badges */}
              <div className="space-y-2 pt-2 border-t border-[#26262C]">
                <span className="font-bold text-text uppercase tracking-wider text-[11px] block">
                  SESSION BADGES
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 rounded-lg bg-[#14141B] border border-border flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-teal" />
                    <span>Header Sentry (SPF / DKIM)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#14141B] border border-border flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-coral" />
                    <span>Rapid Triage (&lt; 2 min)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3.3 CAREER LADDER */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight">
              Solo Progression Track
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Unlock complex multi-stage attack scenarios as your operational craft expands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INDIVIDUALS_CONTENT.careerLadder.map((tier, idx) => (
              <div
                key={tier.level}
                className="bg-surface p-6 rounded-2xl border border-border hover:border-teal/40 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal/10 text-teal border border-teal/20 font-bold uppercase">
                    {tier.badge}
                  </span>
                  <span className="font-mono text-xs text-muted">{tier.xpRequired}</span>
                </div>

                <div>
                  <div className="font-mono text-xs text-muted uppercase">{tier.level}</div>
                  <h3 className="font-heading font-bold text-xl text-text mt-0.5">
                    {tier.rank}
                  </h3>
                </div>

                <div className="pt-3 border-t border-border/60 text-xs text-muted leading-relaxed">
                  <strong className="text-text block font-mono text-[11px] mb-1">Capabilities Unlocked:</strong>
                  {tier.unlocks}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center font-mono text-[11px] text-muted italic">
            {INDIVIDUALS_CONTENT.ladderDisclaimer}
          </div>
        </section>

        {/* 3.4 A DAY ON THE RANGE */}
        <section className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-text tracking-tight">
              A Day on the Range
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              What an individual training session looks like from dispatch to debrief.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-4">
            {INDIVIDUALS_CONTENT.dayOnTheRange.map((st, idx) => (
              <div
                key={st.step}
                className="p-4 rounded-xl bg-[#0F0F14] border border-[#26262C] space-y-2 text-left"
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-muted">
                  <span>STEP 0{st.step}</span>
                  <span className="text-teal font-semibold">{st.time}</span>
                </div>
                <div className="font-heading font-bold text-sm text-text">
                  {st.title}
                </div>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3.5 CTA BAND */}
        <section className="bg-gradient-to-r from-[#111116] via-[#16161D] to-[#111116] border border-border rounded-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2">
            <Badge type="v1" size="md" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text">
              {INDIVIDUALS_CONTENT.cta.headline}
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              {INDIVIDUALS_CONTENT.cta.sub}
            </p>
          </div>

          <div>
            <Link
              href={INDIVIDUALS_CONTENT.cta.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal text-black font-heading font-bold text-sm hover:bg-teal/90 transition-all shadow-lg hover:shadow-teal/20"
            >
              <span>{INDIVIDUALS_CONTENT.cta.buttonLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
