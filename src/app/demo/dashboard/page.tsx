import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { getDb } from '@/lib/db';
import { Badge } from '@/components/common/Badge';
import { 
  User, 
  Terminal, 
  Users2, 
  ArrowRight, 
  LogOut,
  Radio,
  Server
} from 'lucide-react';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/demo/login');
  }

  // Server-side check: "New?" decision
  if (!user.is_profile_completed) {
    redirect('/demo/profile');
  }

  const db = getDb();

  // Check current team status
  const teamMemberStmt = db.prepare(`
    SELECT t.* FROM teams t
    JOIN team_members tm ON tm.team_id = t.id
    WHERE tm.user_id = ?
    ORDER BY tm.joined_at DESC LIMIT 1
  `);
  const activeTeam = teamMemberStmt.get(user.id) as {
    id: string;
    name: string;
    side: 'RED' | 'BLUE';
    is_complete: number;
    status: string;
  } | undefined;

  // Recent session
  const sessionStmt = db.prepare(`
    SELECT * FROM match_sessions 
    WHERE user_id = ? OR red_team_id = ? OR blue_team_id = ?
    ORDER BY created_at DESC LIMIT 1
  `);
  const recentSession = sessionStmt.get(user.id, activeTeam?.id || '', activeTeam?.id || '') as {
    id: string;
    mode: string;
    side: string;
    status: string;
    created_at: string;
  } | undefined;

  return (
    <div className="min-h-[85vh] bg-bg text-text py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-teal">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-bold text-xl text-text">
                  {user.name}
                </h1>
                <Badge type="v1" size="sm" />
                {user.is_operator === 1 && <Badge type="operator" size="sm" />}
              </div>
              <p className="text-xs text-muted font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Profile tags & Logout */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs bg-surface-2 px-3 py-1.5 rounded-xl border border-border">
              <span className="text-muted">Role:</span>
              {user.role === 'RED_TEAM' && <Badge type="red" size="sm" />}
              {user.role === 'BLUE_TEAM' && <Badge type="blue" size="sm" />}
              {user.role === 'NET_SEC' && <Badge type="netsec" size="sm" />}
            </div>

            <div className="flex items-center gap-1.5 text-xs bg-surface-2 px-3 py-1.5 rounded-xl border border-border">
              <span className="text-muted">Level:</span>
              <strong className="text-text font-semibold">{user.experience_level || 'General'}</strong>
            </div>

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-xs text-muted hover:text-coral p-2 rounded-xl hover:bg-surface-2 transition-colors flex items-center gap-1 border border-border"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>

        {/* Current Team Status Banner (if user already belongs to a team) */}
        {activeTeam && (
          <div className="p-4 rounded-xl border border-border bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${activeTeam.side === 'RED' ? 'bg-coral' : 'bg-teal'}`} />
              <div>
                <span className="text-xs text-muted">Current Squad Assignment:</span>
                <div className="font-heading font-bold text-sm text-text flex items-center gap-2">
                  <span>{activeTeam.name}</span>
                  <span className="text-xs font-mono font-normal text-muted">
                    ({activeTeam.side === 'RED' ? 'Red Side' : 'Blue Side'} • Status: {activeTeam.status})
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/demo/team"
              className="text-xs font-heading font-semibold text-teal hover:underline underline-offset-4 flex items-center gap-1"
            >
              View Roster <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Section Heading */}
        <div className="text-left space-y-1">
          <h2 className="font-heading font-bold text-lg text-text">Select Exercise Mode</h2>
          <p className="text-xs text-muted">
            Launch straight into your single-user pod or assemble a squad for matchmaking.
          </p>
        </div>

        {/* DFD Outgoing Arrows: Exactly TWO Options / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: "Learn alone" -> System Architecture directly */}
          <div className="p-8 rounded-2xl border border-border bg-surface hover:border-teal hover:shadow-glow-teal transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Terminal className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-teal bg-teal/15 px-2.5 py-1 rounded-md border border-teal/30">
                  INSTANT LAB
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-xl text-text mb-1">Learn alone</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Self-paced solo session in an isolated virtualization sandbox. No squad requirement
                  and no matchmaking queue.
                </p>
              </div>

              {/* Single operator illustration */}
              <div className="p-4 rounded-xl bg-surface-2 border border-border text-xs text-muted space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px]">Pod Environment:</span>
                  <strong className="text-text font-mono">Single-User VM</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px]">Target Domain:</span>
                  <strong className="text-teal font-mono">fintechcorp.local</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px]">Matchmaking:</span>
                  <strong className="text-teal">Bypassed (Instant)</strong>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/demo/architecture?mode=solo"
                className="w-full py-3 px-4 rounded-xl bg-teal text-bg font-heading font-semibold text-xs hover:shadow-glow-teal transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-teal focus:outline-none"
              >
                Launch Solo Architecture <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: "Enter a team" -> Team -> Matchmaking -> System Architecture */}
          <div className="p-8 rounded-2xl border border-border bg-surface hover:border-coral/80 hover:shadow-glow-coral transition-all flex flex-col justify-between group relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-coral/10 text-coral flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-coral bg-coral/15 px-2.5 py-1 rounded-md border border-coral/30">
                  RED vs BLUE
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-xl text-text mb-1">Enter a team</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Adversarial squad session. Group with 3+ operatives, select your combat side,
                  and pair against an opposing squad.
                </p>
              </div>

              {/* Team lobby roster illustration */}
              <div className="p-4 rounded-xl bg-surface-2 border border-border text-xs text-muted space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px]">Squad Quorum:</span>
                  <strong className="text-text font-mono">3+ Operatives</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px]">Engagement:</span>
                  <strong className="text-coral">Red vs Blue 1v1</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px]">Flow:</span>
                  <strong className="font-mono text-text">Team ➔ Matchmaking ➔ Lab</strong>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/demo/team"
                className="w-full py-3 px-4 rounded-xl border border-border text-text font-heading font-semibold text-xs hover:border-coral hover:text-coral transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-coral focus:outline-none"
              >
                Enter Squad Roster <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Session Footer */}
        <div className="bg-surface p-4 rounded-xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-teal" />
            <span>
              Recent Session:{' '}
              {recentSession ? (
                <strong className="text-text">
                  {recentSession.mode} ({recentSession.side}) • Active
                </strong>
              ) : (
                'No recorded instances yet.'
              )}
            </span>
          </div>
          <span className="font-mono text-[11px] text-muted">
            HYPERVISOR: PROXMOX-VE-SDN-v1
          </span>
        </div>
      </div>
    </div>
  );
}
