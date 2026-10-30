'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import { LobbyMatchmakingIllustration } from '@/components/illustrations/LobbyMatchmakingIllustration';
import { 
  Users, 
  Shield, 
  Crosshair, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Terminal
} from 'lucide-react';

interface RosterMember {
  id: string;
  name: string;
  email: string;
  role: string;
  experience_level: string;
}

interface TeamData {
  id: string;
  name: string;
  side: 'RED' | 'BLUE';
  is_complete: number;
  status: string;
  roster: RosterMember[];
}

export default function TeamPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);

  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [createName, setCreateName] = useState('');
  const [createSide, setCreateSide] = useState<'RED' | 'BLUE'>('RED');
  const [matchSide, setMatchSide] = useState<'RED' | 'BLUE'>('RED');

  const fetchTeamData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const u = await userRes.json();
        setCurrentUser(u.user);
        if (u.user?.role === 'BLUE_TEAM') {
          setCreateSide('BLUE');
          setMatchSide('BLUE');
        } else {
          setCreateSide('RED');
          setMatchSide('RED');
        }
      }

      const res = await fetch('/api/teams');
      const data = await res.json();
      if (data.success && data.myTeam) {
        setTeam(data.myTeam);
      }
    } catch {
      // Catch
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          teamName: createName,
          side: createSide,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchTeamData();
      } else {
        setError(data.error || 'Failed to create squad.');
      }
    } catch {
      setError('Communication failure.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMatchMeWithOthers = async () => {
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'AUTO_MATCH',
          side: matchSide,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchTeamData();
      } else {
        setError(data.error || 'Auto-matching squad failed.');
      }
    } catch {
      setError('Communication failure.');
    } finally {
      setSubmitting(false);
    }
  };

  // ASSUMPTION check: Network Security users see an observer message here and are pointed back to "Learn alone".
  if (!loading && currentUser?.role === 'NET_SEC') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-bg text-text">
        <div className="w-full max-w-lg bg-surface p-8 rounded-2xl border border-border shadow-xl text-center space-y-4">
          <div className="flex justify-center">
            <Badge type="v1" />
          </div>

          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h1 className="font-heading font-bold text-xl text-text">
              Observer Restriction: Network Security Track
            </h1>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              In Cynchor v1.1, live combat squads are restricted to <strong>Red Team</strong> and{' '}
              <strong>Blue Team</strong> operatives.
            </p>
            <p className="text-xs text-muted mt-2 bg-surface-2 p-3 rounded-xl border border-border">
              ASSUMPTION: Network Security specialists focus on infrastructure and firewall audits.
              Please proceed via the &quot;Learn alone&quot; track.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/demo/architecture?mode=solo"
              className="w-full py-2.5 px-4 rounded-xl bg-teal text-bg font-heading font-semibold text-xs hover:shadow-glow-teal transition-all inline-flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              Return to Learn Alone (Solo Lab)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const memberCount = team?.roster?.length || 0;
  const isTeamComplete = memberCount >= 3;

  return (
    <div className="min-h-[85vh] bg-bg text-text py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge type="v1" />
              <span className="text-[10px] font-mono text-muted bg-surface-2 px-2 py-0.5 rounded border border-border">
                NODE: TEAM_FORMATION
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-text tracking-tightest">
              Team Formation &amp; Roster
            </h1>
            <p className="text-xs text-muted mt-0.5">
              Assemble or join an active squad of at least 3 operatives before matchmaking.
            </p>
          </div>

          <Link
            href="/demo/dashboard"
            className="text-xs font-heading text-muted hover:text-text px-3 py-1.5 rounded-xl border border-border bg-surface-2 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-coral shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Team Formation Methods (Two ways) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Method 1: "Match me with others" */}
            <div className="bg-surface p-6 rounded-2xl border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading font-semibold text-teal uppercase tracking-widestlabel">
                  Method 1
                </span>
                <span className="text-[9px] bg-teal/15 text-teal px-2 py-0.5 rounded font-mono">
                  1-Click Squad
                </span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-text">Match me with others</h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Join individual queue. The system groups queued users into Red/Blue teams of 3+.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-1.5">
                  Side (Pre-selected from role, override allowed):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMatchSide('RED')}
                    className={`py-2 px-3 rounded-xl border text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      matchSide === 'RED'
                        ? 'bg-coral text-bg border-coral shadow-glow-coral'
                        : 'border-border text-muted hover:text-text hover:bg-surface-2'
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5" /> Red Team
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatchSide('BLUE')}
                    className={`py-2 px-3 rounded-xl border text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      matchSide === 'BLUE'
                        ? 'bg-teal text-bg border-teal shadow-glow-teal'
                        : 'border-border text-muted hover:text-text hover:bg-surface-2'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" /> Blue Team
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleMatchMeWithOthers}
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-teal text-bg text-xs font-heading font-semibold hover:shadow-glow-teal transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Grouping Squad...' : 'Auto-Match Squad (3+)'}
              </button>
            </div>

            {/* Method 2: "Join or create a group" */}
            <div className="bg-surface p-6 rounded-2xl border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading font-semibold text-coral uppercase tracking-widestlabel">
                  Method 2
                </span>
                <span className="text-[9px] bg-surface-2 text-muted px-2 py-0.5 rounded font-mono">
                  Custom Squad
                </span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-text">Join or create a group</h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Designate a custom squad name and choose your side together.
                </p>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-1">
                    Squad Name
                  </label>
                  <input
                    type="text"
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Ghost Vanguard"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-1">
                    Side
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCreateSide('RED')}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-heading font-semibold transition-colors ${
                        createSide === 'RED'
                          ? 'bg-coral text-bg border-coral'
                          : 'border-border text-muted hover:text-text'
                      }`}
                    >
                      Red Side
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateSide('BLUE')}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-heading font-semibold transition-colors ${
                        createSide === 'BLUE'
                          ? 'bg-teal text-bg border-teal'
                          : 'border-border text-muted hover:text-text'
                      }`}
                    >
                      Blue Side
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-xl border border-border text-text hover:bg-surface-2 text-xs font-heading font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Create Group
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Roster & Matchmaking Quorum Visual */}
          <div className="lg:col-span-2">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-md flex flex-col justify-between min-h-[460px]">
              <div className="space-y-6">
                {/* Roster Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        team?.side === 'RED' ? 'bg-coral/10 text-coral' : 'bg-teal/10 text-teal'
                      }`}
                    >
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-lg text-text">
                        {team ? team.name : 'No Squad Formed'}
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        {team?.side === 'RED' ? <Badge type="red" size="sm" /> : <Badge type="blue" size="sm" />}
                        <span className="text-xs text-muted font-mono">
                          {memberCount} / 3 Operatives Needed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isTeamComplete ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal/10 text-teal border border-teal/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Quorum Ready (3+)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Need {3 - memberCount} Operative(s)
                      </span>
                    )}
                  </div>
                </div>

                {/* Inline Lobby Illustration (Section 4e) */}
                <LobbyMatchmakingIllustration
                  slotsCount={memberCount}
                  maxSlots={3}
                  side={team?.side || 'RED'}
                  isMatched={false}
                />

                {/* Roster list */}
                <div className="space-y-2">
                  <div className="text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel">
                    Squad Operatives
                  </div>

                  {team?.roster && team.roster.length > 0 ? (
                    <div className="space-y-2">
                      {team.roster.map((member, idx) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-2"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] font-mono text-muted">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="font-heading font-semibold text-xs text-text flex items-center gap-1.5">
                                <span>{member.name}</span>
                                {member.id === currentUser?.id && (
                                  <span className="text-[9px] font-mono text-teal bg-teal/15 px-1 rounded">
                                    YOU
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono text-muted bg-surface px-2 py-0.5 rounded border border-border">
                            {member.experience_level || 'Intermediate'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-border rounded-xl text-xs text-muted">
                      Select &quot;Match me with others&quot; to populate your 3+ squad.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-6 border-t border-border mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-muted">
                  {isTeamComplete ? (
                    <span className="text-teal font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal" />
                      Ready for matchmaking pairing
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Requires at least 3 members to proceed to Matchmaking
                    </span>
                  )}
                </div>

                <Link
                  href={isTeamComplete && team ? `/demo/matchmaking?teamId=${team.id}` : '#'}
                  aria-disabled={!isTeamComplete}
                  className={`w-full sm:w-auto py-2.5 px-6 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                    isTeamComplete
                      ? 'bg-teal text-bg hover:shadow-glow-teal cursor-pointer'
                      : 'bg-surface-2 text-muted/50 border border-border cursor-not-allowed pointer-events-none'
                  }`}
                >
                  Proceed to Matchmaking <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
