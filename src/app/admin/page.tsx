'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import { 
  Lock, 
  Key, 
  UserCheck, 
  UserPlus, 
  CheckCircle2, 
  Copy, 
  RefreshCw,
  ExternalLink,
  Users
} from 'lucide-react';

interface RequestItem {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  generated_invite_token?: string;
}

interface InviteItem {
  id: string;
  token: string;
  email: string;
  is_used: number;
  expires_at: string;
  created_at: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  experience_level: string;
  is_profile_completed: number;
  is_operator: number;
  created_at: string;
}

export default function AdminPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [invites, setInvites] = useState<InviteItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [inviteEmail, setInviteEmail] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const [provName, setProvName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provPass, setProvPass] = useState('CombatPass2026!');
  const [provRole, setProvRole] = useState('RED_TEAM');
  const [provOperator, setProvOperator] = useState(false);
  const [provSuccess, setProvSuccess] = useState('');

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
        setInvites(data.invites || []);
        setUsers(data.users || []);
      }
    } catch {
      // Catch error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (requestId: string, email: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE_REQUEST', requestId, email }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedToken(data.token);
        fetchData();
      }
    } catch {
      alert('Approval failed.');
    }
  };

  const handleGenerateManualInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'GENERATE_INVITE', email: inviteEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedToken(data.token);
        setInviteEmail('');
        fetchData();
      }
    } catch {
      alert('Failed to generate invite token.');
    }
  };

  const handleProvisionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PROVISION_USER',
          name: provName,
          email: provEmail,
          password: provPass,
          role: provRole,
          isOperator: provOperator,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProvSuccess(`Account for ${provEmail} provisioned.`);
        setProvName('');
        setProvEmail('');
        fetchData();
      }
    } catch {
      alert('User provisioning failed.');
    }
  };

  const copyToClipboard = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <div className="min-h-[90vh] bg-bg text-text py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                <Lock className="w-3.5 h-3.5" /> Operator Console
              </span>
              <span className="text-[10px] font-mono text-muted bg-surface-2 px-2 py-0.5 rounded border border-border">
                ADMIN-PORTAL-v1.1
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-text tracking-tightest">
              Operator Access Governance
            </h1>
            <p className="text-xs text-muted mt-0.5">
              Review access requests, generate single-use invite tokens, and provision user accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="py-1.5 px-3 text-xs font-heading font-medium border border-border rounded-xl bg-surface-2 hover:bg-surface text-text flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              href="/demo/login"
              className="py-1.5 px-3 text-xs font-heading font-semibold rounded-xl bg-teal text-bg hover:shadow-glow-teal transition-all"
            >
              Test Login
            </Link>
          </div>
        </div>

        {/* Highlight Banner if Token was created */}
        {generatedToken && (
          <div className="p-4 rounded-xl bg-teal/10 border border-teal/30 text-teal flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-teal shrink-0" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal">
                  New Single-Use Token Generated:
                </span>
                <div className="font-mono font-black text-lg text-text">
                  {generatedToken}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(generatedToken)}
                className="py-1 px-3 rounded-lg bg-surface border border-teal/40 text-teal text-xs font-medium hover:bg-surface-2 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedToken === generatedToken ? 'Copied' : 'Copy'}
              </button>
              <Link
                href={`/demo/invite/${generatedToken}`}
                target="_blank"
                className="py-1 px-3 rounded-lg bg-teal text-bg text-xs font-heading font-semibold hover:shadow-glow-teal flex items-center gap-1"
              >
                Open <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Action Panels */}
          <div className="space-y-6">
            {/* Panel A: Generate Single-Use Token */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-teal" />
                <h3 className="font-heading font-bold text-sm text-text">
                  Generate Single-Use Token
                </h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Creates an expiring token (7 days) for invite path (/demo/invite/&#123;token&#125;).
              </p>

              <form onSubmit={handleGenerateManualInvite} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-1">
                    Candidate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="trainee@organization.com"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-teal text-bg text-xs font-heading font-semibold hover:shadow-glow-teal transition-all flex items-center justify-center gap-1.5"
                >
                  Generate Token
                </button>
              </form>
            </div>

            {/* Panel B: Provision Account Manually */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" />
                <h3 className="font-heading font-bold text-sm text-text">
                  Provision User (No Self-Registration)
                </h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Directly seeds an authorized account with pre-hashed credentials.
              </p>

              {provSuccess && (
                <div className="p-2.5 rounded-xl bg-teal/10 border border-teal/30 text-teal text-xs">
                  {provSuccess}
                </div>
              )}

              <form onSubmit={handleProvisionUser} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={provName}
                    onChange={(e) => setProvName(e.target.value)}
                    placeholder="David King"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={provEmail}
                    onChange={(e) => setProvEmail(e.target.value)}
                    placeholder="david.king@cynchor.local"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-1">
                    Temporary Password
                  </label>
                  <input
                    type="text"
                    required
                    value={provPass}
                    onChange={(e) => setProvPass(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-heading font-semibold text-muted uppercase tracking-widestlabel mb-1">
                    Default Role
                  </label>
                  <select
                    value={provRole}
                    onChange={(e) => setProvRole(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="RED_TEAM">Red Team</option>
                    <option value="BLUE_TEAM">Blue Team</option>
                    <option value="NET_SEC">Network Security</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl border border-border text-text hover:bg-surface-2 text-xs font-heading font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  Provision User Now
                </button>
              </form>
            </div>
          </div>

          {/* Column 2 & 3: Pending Requests, Invites, Users */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Access Requests */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal" />
                  <h3 className="font-heading font-bold text-sm text-text">
                    Pending Access Requests (Path B)
                  </h3>
                </div>
                <span className="text-xs font-mono text-muted">
                  {requests.filter((r) => r.status === 'PENDING').length} Pending
                </span>
              </div>

              {requests.length === 0 ? (
                <p className="text-xs text-muted py-4 text-center">
                  No requests submitted yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-xl border border-border bg-surface-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-heading font-semibold text-text">{req.name}</div>
                        <div className="font-mono text-muted text-[11px]">{req.email}</div>
                      </div>

                      <div>
                        {req.status === 'PENDING' ? (
                          <button
                            type="button"
                            onClick={() => handleApprove(req.id, req.email)}
                            className="py-1 px-3 rounded-lg bg-teal text-bg font-heading font-semibold text-xs hover:shadow-glow-teal flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve &amp; Token
                          </button>
                        ) : (
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-teal/15 text-teal border border-teal/30">
                              Approved
                            </span>
                            {req.generated_invite_token && (
                              <div className="font-mono text-[10px] text-muted mt-0.5">
                                {req.generated_invite_token}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Generated Invites */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-teal" />
                  <h3 className="font-heading font-bold text-sm text-text">
                    Generated Invite Tokens (Path A)
                  </h3>
                </div>
                <span className="text-xs font-mono text-muted">{invites.length} Total</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {invites.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-xl border border-border bg-surface-2 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-text">{inv.id.slice(0, 12)}…</span>
                        {inv.is_used ? (
                          <span className="text-[9px] text-muted bg-surface px-1.5 py-0.2 rounded border border-border">
                            Redeemed
                          </span>
                        ) : (
                          <span className="text-[9px] text-teal bg-teal/15 px-1.5 py-0.2 rounded border border-teal/30">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted font-mono">{inv.email}</span>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Provisioned Users Directory */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-text" />
                  <h3 className="font-heading font-bold text-sm text-text">
                    Directory Users
                  </h3>
                </div>
                <span className="text-xs font-mono text-muted">{users.length} Users</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-xl border border-border bg-surface-2 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-heading font-semibold text-text flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.is_operator === 1 && <Badge type="operator" size="sm" />}
                      </div>
                      <div className="text-[10px] font-mono text-muted">{u.email}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {u.role === 'RED_TEAM' && <Badge type="red" size="sm" />}
                      {u.role === 'BLUE_TEAM' && <Badge type="blue" size="sm" />}
                      {u.role === 'NET_SEC' && <Badge type="netsec" size="sm" />}
                      {!u.role && (
                        <span className="text-[10px] text-muted font-mono bg-surface px-1.5 py-0.5 rounded border border-border">
                          New (Profile Pending)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
