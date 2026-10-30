'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/common/Badge';
import { Lock, Mail, ArrowRight, AlertCircle, Key } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const paramEmail = searchParams.get('email');
    const paramToken = searchParams.get('inviteToken');
    if (paramEmail) setEmail(paramEmail);
    if (paramToken) setInviteToken(paramToken);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, inviteToken }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      // Server-side decision evaluated:
      // If new (profile incomplete) -> /demo/profile
      // If profile completed -> /demo/dashboard
      router.push(data.redirectTo);
      router.refresh();
    } catch {
      setError('Authentication error. Try again.');
      setIsLoading(false);
    }
  };

  const loadTestAccount = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setError('');
  };

  return (
    <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-border shadow-2xl text-text">
      <div className="flex items-center justify-between mb-6">
        <Badge type="v1" />
        <span className="text-[10px] font-mono text-muted bg-surface-2 px-2.5 py-1 rounded border border-border">
          AUTH-GATE-v1.1
        </span>
      </div>

      <div className="mb-6 space-y-1">
        <h1 className="font-heading font-bold text-2xl text-text tracking-tightest">
          Portal Login
        </h1>
        <p className="text-xs text-muted leading-relaxed">
          Access the live Proxmox range. Operator-provisioned accounts only.
        </p>
      </div>

      {inviteToken && (
        <div className="mb-5 p-3 rounded-xl bg-teal/10 border border-teal/30 text-teal text-xs flex items-center gap-2 font-mono">
          <Key className="w-4 h-4 text-teal shrink-0" />
          <span>Invite: <strong>{inviteToken}</strong></span>
        </div>
      )}

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-coral shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-1.5">
            Operator Provisioned Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@cynchor.local"
              className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-teal text-bg text-xs font-heading font-semibold hover:shadow-glow-teal transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal mt-2"
        >
          {isLoading ? (
            'Authenticating...'
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Test Accounts Helper */}
      <div className="mt-8 pt-5 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel">
            Demo Accounts
          </span>
          <span className="text-[10px] text-teal font-mono">1-Click Fill</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => loadTestAccount('newuser@cynchor.local', 'NewUser123!')}
            className="p-2 text-left rounded-xl border border-border hover:border-coral/60 bg-surface-2 transition-colors"
          >
            <span className="font-heading font-semibold text-coral block text-xs">New Recruit</span>
            <span className="text-muted text-[10px]">Triggers Profile</span>
          </button>
          <button
            type="button"
            onClick={() => loadTestAccount('alex.red@cynchor.local', 'RedPass123!')}
            className="p-2 text-left rounded-xl border border-border hover:border-coral/60 bg-surface-2 transition-colors"
          >
            <span className="font-heading font-semibold text-text block text-xs">Alex (Red Team)</span>
            <span className="text-muted text-[10px]">Triggers Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => loadTestAccount('sarah.blue@cynchor.local', 'BluePass123!')}
            className="p-2 text-left rounded-xl border border-border hover:border-teal/60 bg-surface-2 transition-colors"
          >
            <span className="font-heading font-semibold text-text block text-xs">Sarah (Blue Team)</span>
            <span className="text-muted text-[10px]">Triggers Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => loadTestAccount('operator@cynchor.local', 'CynchorAdmin2026!')}
            className="p-2 text-left rounded-xl border border-border hover:border-purple-400/60 bg-surface-2 transition-colors"
          >
            <span className="font-heading font-semibold text-purple-400 block text-xs">Lead Operator</span>
            <span className="text-muted text-[10px]">Admin Console</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-bg">
      <Suspense fallback={<div className="text-xs text-muted">Loading gateway...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
