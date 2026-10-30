'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import { LobbyMatchmakingIllustration } from '@/components/illustrations/LobbyMatchmakingIllustration';
import { 
  Radio, 
  Users, 
  Clock, 
  ArrowRight, 
  Zap, 
  Server
} from 'lucide-react';

function MatchmakingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamId = searchParams.get('teamId');

  const [queueState, setQueueState] = useState<'SEARCHING' | 'MATCHED'>('SEARCHING');
  const [elapsed, setElapsed] = useState(0);
  const [matchedData, setMatchedData] = useState<{
    sessionId: string;
    myTeam: { name: string; side: 'RED' | 'BLUE'; size: number };
    opposingTeam: { name: string; side: 'RED' | 'BLUE'; size: number };
  } | null>(null);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!teamId) return;

    let pollInterval: NodeJS.Timeout;
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    const checkMatch = async () => {
      try {
        const res = await fetch('/api/matchmaking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId }),
        });
        const data = await res.json();
        if (data.success && data.matched) {
          setMatchedData(data);
          setQueueState('MATCHED');
          clearInterval(pollInterval);
        }
      } catch {
        // Retry
      }
    };

    checkMatch();
    pollInterval = setInterval(checkMatch, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
    };
  }, [teamId]);

  useEffect(() => {
    if (queueState === 'MATCHED' && matchedData) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        router.push(
          `/demo/architecture?sessionId=${matchedData.sessionId}&mode=team&side=${matchedData.myTeam.side}`
        );
      }
    }
  }, [queueState, countdown, matchedData, router]);

  if (!teamId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-bg text-text">
        <div className="p-8 bg-surface border border-border rounded-2xl max-w-md text-center space-y-4">
          <Badge type="v1" />
          <h2 className="font-heading font-bold text-lg text-text">No Squad ID Provided</h2>
          <p className="text-xs text-muted">
            Matchmaking requires an active squad of at least 3 operatives.
          </p>
          <Link
            href="/demo/team"
            className="py-2.5 px-4 rounded-xl bg-teal text-bg text-xs font-heading font-semibold inline-block hover:shadow-glow-teal"
          >
            Go to Team Formation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-bg text-text py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-surface p-8 rounded-2xl border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-bold text-xl text-text">
                  Matchmaking Engine
                </h1>
                <Badge type="v1" size="sm" />
              </div>
              <p className="text-xs text-muted">Red vs Blue squad pairing</p>
            </div>
          </div>
          <span className="font-mono text-xs text-muted bg-surface-2 px-2.5 py-1 rounded border border-border">
            QUEUE_1v1
          </span>
        </div>

        {queueState === 'SEARCHING' ? (
          /* STATE 1: Searching */
          <div className="py-6 space-y-6 text-center">
            {/* Inline Radar Illustration */}
            <LobbyMatchmakingIllustration
              slotsCount={3}
              maxSlots={3}
              side="RED"
              isMatched={false}
            />

            <div>
              <h2 className="font-heading font-bold text-lg text-text">
                Pairing Opposing Squad...
              </h2>
              <p className="text-xs text-muted mt-1 max-w-md mx-auto leading-relaxed">
                Searching app database for 1 complete Red team vs 1 complete Blue team.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-surface-2 px-4 py-1.5 rounded-full border border-border text-xs text-text font-mono">
              <Clock className="w-3.5 h-3.5 text-teal" />
              <span>Queue Elapsed: {elapsed}s</span>
            </div>
          </div>
        ) : (
          /* STATE 2: MATCH FOUND */
          <div className="py-4 space-y-6 animate-fadeIn">
            {/* Inline Matched Illustration */}
            <LobbyMatchmakingIllustration
              slotsCount={3}
              maxSlots={3}
              side={matchedData?.myTeam.side || 'RED'}
              isMatched={true}
            />

            <div className="p-4 rounded-xl bg-teal/10 border border-teal/30 text-center space-y-1">
              <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-teal">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Match Confirmed
              </div>
              <h2 className="font-heading font-bold text-xl text-text">
                Opposing Squad Identified
              </h2>
              <p className="text-xs text-muted">
                Initializing Proxmox virtual environment...
              </p>
            </div>

            {/* Versus Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* My Team */}
              <div
                className={`p-4 rounded-xl border ${
                  matchedData?.myTeam.side === 'RED'
                    ? 'border-coral/50 bg-coral/10'
                    : 'border-teal/50 bg-teal/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-muted font-bold">
                    YOUR SQUAD
                  </span>
                  {matchedData?.myTeam.side === 'RED' ? (
                    <Badge type="red" size="sm" />
                  ) : (
                    <Badge type="blue" size="sm" />
                  )}
                </div>
                <h3 className="font-heading font-bold text-base text-text">
                  {matchedData?.myTeam.name}
                </h3>
                <div className="text-[11px] text-muted mt-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Roster: {matchedData?.myTeam.size} Operatives</span>
                </div>
              </div>

              {/* Opposing Team */}
              <div
                className={`p-4 rounded-xl border ${
                  matchedData?.opposingTeam.side === 'RED'
                    ? 'border-coral/50 bg-coral/10'
                    : 'border-teal/50 bg-teal/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-muted font-bold">
                    OPPOSING SQUAD
                  </span>
                  {matchedData?.opposingTeam.side === 'RED' ? (
                    <Badge type="red" size="sm" />
                  ) : (
                    <Badge type="blue" size="sm" />
                  )}
                </div>
                <h3 className="font-heading font-bold text-base text-text">
                  {matchedData?.opposingTeam.name}
                </h3>
                <div className="text-[11px] text-muted mt-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Opposing Size: {matchedData?.opposingTeam.size} Operatives</span>
                </div>
              </div>
            </div>

            {/* Countdown bar */}
            <div className="bg-surface-2 p-4 rounded-xl border border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-text font-mono">
                <Server className="w-4 h-4 text-teal" />
                <span>Redirecting to System Architecture in {countdown}s...</span>
              </div>

              <Link
                href={`/demo/architecture?sessionId=${matchedData?.sessionId}&mode=team&side=${matchedData?.myTeam.side}`}
                className="py-1.5 px-4 rounded-xl bg-teal text-bg font-heading font-semibold text-xs hover:shadow-glow-teal flex items-center gap-1 transition-all"
              >
                Enter Lab <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MatchmakingPage() {
  return (
    <Suspense fallback={<div className="text-xs text-muted p-12 text-center bg-bg">Loading Matchmaker...</div>}>
      <MatchmakingContent />
    </Suspense>
  );
}
