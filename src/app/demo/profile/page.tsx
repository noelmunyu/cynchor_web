'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/common/Badge';
import { RedTeamIcon, BlueTeamIcon, NetSecIcon, GrcIcon } from '@/components/illustrations/RoleIcons';
import { LevelBadgeIcon } from '@/components/illustrations/BadgeIcons';
import { ArrowRight, AlertCircle, Check } from 'lucide-react';

export default function ProfileMakingPage() {
  const router = useRouter();

  const [role, setRole] = useState<'RED_TEAM' | 'BLUE_TEAM' | 'NET_SEC' | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'EXPERT' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError('Select an active operational role.');
      return;
    }
    if (!experienceLevel) {
      setError('Select your experience level.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, experienceLevel }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to update profile.');
        setIsSubmitting(false);
        return;
      }

      // ASSUMPTION (diagram gap): Profile Making has no outgoing arrow in the DFD.
      // On saving the profile, route the user to the Dashboard.
      router.push(data.redirectTo || '/demo/dashboard');
      router.refresh();
    } catch {
      setError('Network communication error. Try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-bg text-text">
      <div className="w-full max-w-2xl bg-surface p-8 rounded-2xl border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Badge type="v1" />
          <span className="text-[10px] font-mono text-muted bg-surface-2 px-2.5 py-1 rounded border border-border">
            NODE: PROFILE_MAKING
          </span>
        </div>

        <div className="mb-8 space-y-1">
          <h1 className="font-heading font-bold text-2xl text-text tracking-tightest">
            Profile Making
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            Configure your cyber range persona and skill baseline. All fields required.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-coral shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Role Selection */}
          <div>
            <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-2">
              1. Operational Role (Single Select)
            </label>
            <p className="text-xs text-muted mb-3">
              Squad combat requires Red or Blue assignment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Red Team */}
              <button
                type="button"
                onClick={() => setRole('RED_TEAM')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  role === 'RED_TEAM'
                    ? 'border-coral ring-2 ring-coral/20 bg-coral/10 shadow-glow-coral'
                    : 'border-border hover:border-coral/40 bg-surface-2'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <RedTeamIcon size={30} />
                  {role === 'RED_TEAM' && (
                    <span className="w-4 h-4 rounded-full bg-coral text-bg flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="font-heading font-bold text-sm text-coral">Red Team</div>
                <p className="text-xs text-muted mt-1 leading-snug">
                  Offensive attack vectors, weaponization, payload delivery, and stealth pivot.
                </p>
              </button>

              {/* Blue Team */}
              <button
                type="button"
                onClick={() => setRole('BLUE_TEAM')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  role === 'BLUE_TEAM'
                    ? 'border-teal ring-2 ring-teal/20 bg-teal/10 shadow-glow-teal'
                    : 'border-border hover:border-teal/40 bg-surface-2'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <BlueTeamIcon size={30} />
                  {role === 'BLUE_TEAM' && (
                    <span className="w-4 h-4 rounded-full bg-teal text-bg flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="font-heading font-bold text-sm text-teal">Blue Team</div>
                <p className="text-xs text-muted mt-1 leading-snug">
                  Defensive hardening, anomaly detection, SIEM triage, and threat containment.
                </p>
              </button>

              {/* Network Security */}
              <button
                type="button"
                onClick={() => setRole('NET_SEC')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  role === 'NET_SEC'
                    ? 'border-text ring-2 ring-text/20 bg-surface-2 shadow-sm'
                    : 'border-border hover:border-text/40 bg-surface-2'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <NetSecIcon size={30} />
                  {role === 'NET_SEC' && (
                    <span className="w-4 h-4 rounded-full bg-text text-bg flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="font-heading font-bold text-sm text-text">Network Security</div>
                <p className="text-xs text-muted mt-1 leading-snug">
                  Infrastructure topology, firewall zoning, and ACL policy audits (Solo track).
                </p>
              </button>

              {/* GRC (Visible but disabled/greyed, labeled "Coming soon") */}
              <div className="p-4 rounded-xl border border-border bg-surface-2/40 opacity-50 cursor-not-allowed text-left relative select-none">
                <div className="flex items-center justify-between mb-2">
                  <GrcIcon size={30} />
                  <Badge type="coming-soon" size="sm" />
                </div>
                <div className="font-heading font-bold text-sm text-muted">
                  Governance &amp; Risk (GRC)
                </div>
                <p className="text-xs text-muted/70 mt-1 leading-snug">
                  Audit frameworks, risk governance, and regulatory compliance simulator.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Experience Level */}
          <div>
            <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-2">
              2. Experience Level
            </label>
            <p className="text-xs text-muted mb-3">
              Displayed on profile (does not restrict matchmaking in v1.1).
            </p>

            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { level: 'BEGINNER', label: 'Beginner', desc: '0 - 1 years' },
                  { level: 'INTERMEDIATE', label: 'Intermediate', desc: '1 - 3 years' },
                  { level: 'EXPERT', label: 'Expert', desc: '3+ years' },
                ] as const
              ).map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setExperienceLevel(item.level)}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    experienceLevel === item.level
                      ? 'border-teal ring-2 ring-teal/20 bg-teal/10 font-semibold text-teal shadow-glow-teal'
                      : 'border-border hover:border-muted/40 bg-surface-2 text-text'
                  }`}
                >
                  <div className="flex justify-center mb-1.5">
                    <LevelBadgeIcon level={item.level} size={20} />
                  </div>
                  <div className="text-xs font-heading font-bold">{item.label}</div>
                  <div className="text-[10px] text-muted">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted">
              Profile required for range entry
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !role || !experienceLevel}
              className="py-2.5 px-6 rounded-xl bg-teal text-bg font-heading font-semibold text-xs hover:shadow-glow-teal disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  Save &amp; Enter Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
