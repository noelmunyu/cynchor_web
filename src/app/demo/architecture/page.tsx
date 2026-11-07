import React from 'react';
import Link from 'next/link';
import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { requireUser } from '@/lib/guards';
import { launchLab } from '@/lib/lab/adapter';
import { Badge } from '@/components/common/Badge';
import { EndMatchButton } from '@/components/demo/EndMatchButton';
import { SegmentedNetworkDiagram } from '@/components/illustrations/SegmentedNetworkDiagram';
import { 
  Server, 
  CloudOff, 
  Terminal, 
  Cpu
} from 'lucide-react';

interface ArchitecturePageProps {
  searchParams: {
    sessionId?: string;
    mode?: string;
    side?: string;
  };
}

export default async function ArchitecturePage({ searchParams }: ArchitecturePageProps) {
  const user = await requireUser({ profile: true });
  let mode: 'TEAM' | 'SOLO' = 'SOLO';
  let side: 'RED' | 'BLUE' | 'SOLO' = 'SOLO';
  let sessionId = `ses_${crypto.randomUUID()}`;

  if (searchParams.mode === 'team') {
    // Team sessions come from the database: the caller must belong to a team in an ACTIVE match.
    const row = getDb().prepare(`
      SELECT ms.id AS id,
             CASE WHEN rtm.user_id IS NOT NULL THEN 'RED' ELSE 'BLUE' END AS side
      FROM match_sessions ms
      LEFT JOIN team_members rtm ON rtm.team_id = ms.red_team_id AND rtm.user_id = ?
      LEFT JOIN team_members btm ON btm.team_id = ms.blue_team_id AND btm.user_id = ?
      WHERE ms.status = 'ACTIVE' AND (rtm.user_id IS NOT NULL OR btm.user_id IS NOT NULL)
      ORDER BY (ms.id = ?) DESC, ms.created_at DESC
      LIMIT 1
    `).get(user.id, user.id, String(searchParams.sessionId ?? '')) as { id: string; side: 'RED' | 'BLUE' } | undefined;
    if (row === undefined) redirect('/demo/team');
    mode = 'TEAM';
    side = row.side;
    sessionId = row.id;
  }

  // Invoke clean Proxmox lab adapter
  const labResult = await launchLab({
    sessionId,
    mode,
    side,
    userId: user.id,
  });

  return (
    <div className="min-h-[90vh] bg-bg text-text py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Top Breadcrumb & Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge type="v1" />
              <span className="text-[10px] font-mono text-muted bg-surface-2 px-2 py-0.5 rounded border border-border">
                NODE: SYSTEM_ARCHITECTURE
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-text tracking-tightest">
              System Architecture &amp; Virtual Lab
            </h1>
            <p className="text-xs text-muted mt-0.5">
              Live V1 Proxmox-based cyber training topology with strict network trust-zone segmentation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Session:</span>
            <span className="font-mono text-xs font-bold text-text bg-surface-2 px-3 py-1.5 rounded-xl border border-border">
              {mode} {mode === 'TEAM' && `(${side} SQUAD)`}
            </span>
            {mode === 'TEAM' && <EndMatchButton sessionId={sessionId} />}
            <Link
              href="/demo/dashboard"
              className="text-xs font-heading font-medium text-muted hover:text-text px-3 py-1.5 rounded-xl border border-border bg-surface-2 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* CLOUD-HOSTED ROADMAP NOTE (Clearly separated card with dashed gradient border) */}
        <div
          className="p-5 rounded-2xl border-2 border-dashed border-border bg-surface relative overflow-hidden"
          style={{
            borderImage: 'linear-gradient(90deg, #17ABA9 0%, #EA694B 100%) 1',
            borderStyle: 'dashed',
          }}
        >
          <div className="flex items-start gap-3">
            <CloudOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <strong className="font-heading font-bold text-sm text-text">
                  System Architecture: Coming soon — we&apos;re still building our cloud platform integration.
                </strong>
                <Badge type="coming-soon" size="sm" />
              </div>
              <p className="text-muted leading-relaxed">
                This preview displays our active, on-premise Proxmox VE hypervisor architecture.
                The cloud-native multi-region infrastructure is an upcoming (V2) milestone under development.
                This does not block entry to your live V1 simulation below.
              </p>
            </div>
          </div>
        </div>

        {/* Proxmox Hypervisor Adapter Banner (Clean boundary, honest stub) */}
        <div className="p-5 rounded-2xl border border-teal/30 bg-surface text-text flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal/10 text-teal flex items-center justify-center shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <div className="font-heading font-bold text-sm text-text flex items-center gap-2">
                <span>Proxmox VE Hypervisor Adapter Status:</span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-teal/15 text-teal border border-teal/30">
                  {labResult.status} (SIMULATED ADAPTER STUB)
                </span>
              </div>
              <p className="text-muted text-[11px]">
                {labResult.adapterMessage}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-muted">
                <span>Subnet: <strong className="text-text">{labResult.allocatedSubnet}</strong></span>
                <span>•</span>
                <span>Gateway: <strong className="text-text">{labResult.gatewayIp}</strong></span>
                <span>•</span>
                <span>Domain: <strong className="text-teal">{labResult.targetDomain}</strong></span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-teal bg-teal/10 px-2.5 py-1 rounded-lg border border-teal/30 block">
              Cluster Connector Active (Stub Mode)
            </span>
          </div>
        </div>

        {/* V1 ENVIRONMENT ARCHITECTURE DIAGRAM (Inline SVG Illustration) */}
        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h2 className="font-heading font-bold text-lg text-text">
                V1 Laboratory Network Segmentation
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Isolated virtual VLANs enforced by Proxmox SDN firewall rules. Zero cross-tenant leakage.
              </p>
            </div>
            <span className="text-[10px] font-mono text-muted bg-surface-2 px-2.5 py-1 rounded border border-border">
              SYNTHETIC ENVIRONMENT
            </span>
          </div>

          {/* Segmented Network Diagram (Section 4b) */}
          <SegmentedNetworkDiagram />

          {/* SDN Telemetry Strip */}
          <div className="p-4 rounded-xl border border-border bg-surface-2 text-xs text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-teal shrink-0" />
              <span>Hypervisor Management Plane (Proxmox VE 8.x): OVS Linux bridge isolation active.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-[10px] text-teal font-semibold">SDN POLICY ENFORCED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
