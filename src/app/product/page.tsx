'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import { PhishingArchitectureDiagram } from '@/components/illustrations/PhishingArchitectureDiagram';
import { ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ProductPage() {
  return (
    <div className="bg-bg text-text py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="flex justify-center">
            <Badge type="v2" />
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text tracking-tightest">
            Phishing <span className="gradient-text font-black">architecture</span> model.
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Conceptual architecture of the enterprise phishing training scenario.
          </p>
        </div>

        {/* MANDATORY EXPLICIT DISCLAIMER NOTICE */}
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 text-amber-200 text-xs sm:text-sm space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-heading font-bold text-amber-300 uppercase tracking-widestlabel text-[11px]">
              Illustrative training architecture, not a live connected system
            </span>
          </div>
          <p className="text-amber-200/80 leading-relaxed text-[11px] sm:text-xs">
            <strong>Operational Isolation Notice:</strong> The simulated training laboratory is not connected to this
            website. This illustration demonstrates our training methodology. No interactive phishing or email dispatch
            functions exist on this site. All targets use synthetic training domains in closed environments.
          </p>
        </div>

        {/* CONCEPTUAL PHISHING ARCHITECTURE DIAGRAM (Section 4c) */}
        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-md">
          <PhishingArchitectureDiagram />
        </div>

        {/* Key Technical Highlights (Short, active, sentence case) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
            <strong className="text-text block font-heading font-semibold text-sm">
              Directory Reconnaissance
            </strong>
            <p className="text-xs text-muted leading-relaxed">
              Operators map department roles from synthetic LDAP directories to design convincing spear-phishing templates.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
            <strong className="text-text block font-heading font-semibold text-sm">
              Protocol Validation
            </strong>
            <p className="text-xs text-muted leading-relaxed">
              Defenders evaluate SPF, DKIM signature verification, and DMARC alignment failures in raw RFC822 headers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
            <strong className="text-text block font-heading font-semibold text-sm">
              SOC Triage Workflow
            </strong>
            <p className="text-xs text-muted leading-relaxed">
              Simulated employee reports feed directly into SIEM collectors for incident response and automated quarantine.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 rounded-2xl bg-surface border border-border text-center space-y-4">
          <h3 className="font-heading font-bold text-lg text-text">
            Experience this scenario in the live range
          </h3>
          <p className="text-xs text-muted max-w-md mx-auto">
            Test both offensive email campaigns and defensive header analysis on Proxmox VMs.
          </p>
          <div>
            <Link
              href="/demo/login"
              className="py-2.5 px-5 rounded-xl bg-teal text-bg font-heading font-semibold text-xs hover:shadow-glow-teal transition-all inline-flex items-center gap-1.5"
            >
              Enter Live Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
