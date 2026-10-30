'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, CheckCircle2, KeyRound, UserPlus, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { Badge } from '../common/Badge';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  const router = useRouter();
  const [hasAccepted, setHasAccepted] = useState(false);
  const [acceptedTimestamp, setAcceptedTimestamp] = useState<string | null>(null);
  const [isSubmittingAcceptance, setIsSubmittingAcceptance] = useState(false);

  // Path A state
  const [inviteToken, setInviteToken] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Path B state
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  if (!isOpen) return null;

  const handleAccept = async () => {
    setIsSubmittingAcceptance(true);
    try {
      const res = await fetch('/api/disclaimer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setHasAccepted(true);
        setAcceptedTimestamp(data.acceptedAt);
      }
    } catch {
      setHasAccepted(true);
      setAcceptedTimestamp(new Date().toISOString());
    } finally {
      setIsSubmittingAcceptance(false);
    }
  };

  const handlePathA = (e: React.FormEvent) => {
    e.preventDefault();
    const token = inviteToken.trim();
    if (!token) {
      setTokenError('Enter your invite token.');
      return;
    }
    router.push(`/demo/invite/${encodeURIComponent(token)}`);
  };

  const handlePathB = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim() || !reqEmail.trim()) return;

    setIsRequesting(true);
    try {
      const res = await fetch('/api/access-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: reqName, email: reqEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setRequestSubmitted(true);
        setRequestMessage(data.message || "We'll email you a login once approved.");
      } else {
        setRequestMessage(data.error || 'Request failed. Try again.');
      }
    } catch {
      setRequestMessage('Network error. Try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden text-text"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-2/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="disclaimer-title" className="font-heading font-bold text-base text-text">
                  Simulation Agreement
                </h3>
                <Badge type="v1" size="sm" />
              </div>
              <p className="text-[11px] text-muted">
                Mandatory acknowledgment prior to range access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-text p-1.5 rounded-lg hover:bg-surface-2 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {!hasAccepted ? (
            /* STEP 1: Mandatory Legal Disclaimer */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-500/40 text-amber-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-heading font-semibold block mb-1 text-amber-300">
                    Non-Production Simulation Warning:
                  </strong>
                  Notice: Cynchor is a non-production security training simulation platform.
                  All scenarios, targets, virtual machine topologies, networks, credentials,
                  and business entities are entirely synthetic. No real transactions,
                  financial accounts, or production client infrastructure are hosted or manipulated.
                  This platform and lab instances are provided strictly &quot;as-is&quot; with no warranty of any
                  kind, express or implied. Under no circumstances should users enter real personal,
                  confidential, proprietary, or financial information into any interactive session.
                </div>
              </div>

              <div className="bg-surface-2 p-4 rounded-xl border border-border text-xs text-muted space-y-2">
                <div className="font-heading font-semibold text-text uppercase tracking-widestlabel text-[10px]">
                  Access Governance
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Zero self-registration: operators provision all accounts manually.</li>
                  <li>Every offensive command and defense alert is audited.</li>
                  <li>Acceptance is recorded with an authoritative server timestamp.</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border text-text font-heading text-xs font-medium hover:bg-surface-2 transition-colors"
                >
                  Decline &amp; Exit
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isSubmittingAcceptance}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal text-bg font-heading font-semibold text-xs hover:shadow-glow-teal transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-teal focus:outline-none"
                >
                  {isSubmittingAcceptance ? (
                    'Recording...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Accept &amp; Continue
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Post-Acceptance Dual Entry Paths */
            <div className="space-y-6 animate-fadeIn">
              <div className="p-3 rounded-xl bg-teal/10 border border-teal/30 text-teal text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
                  <span>
                    Accepted: <strong>{acceptedTimestamp ? new Date(acceptedTimestamp).toUTCString() : 'Verified'}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-teal bg-teal/20 px-2 py-0.5 rounded border border-teal/40">
                  LOGGED
                </span>
              </div>

              <div>
                <h4 className="font-heading font-bold text-text text-base">Select Entry Path</h4>
                <p className="text-xs text-muted mt-0.5">
                  Accounts are operator-provisioned only.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Path A: Invite Token */}
                <div className="p-5 rounded-xl border border-border bg-surface-2/60 hover:border-teal/50 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center mb-2.5">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <h5 className="font-heading font-bold text-xs text-text">Path A: Invite Token</h5>
                      <span className="text-[9px] font-mono text-teal bg-teal/15 px-1.5 py-0.5 rounded">
                        Fast-Track
                      </span>
                    </div>
                    <p className="text-[11px] text-muted mt-1 mb-3">
                      Redeem a single-use token from an operator.
                    </p>

                    <form onSubmit={handlePathA} className="space-y-2.5">
                      <div>
                        <input
                          type="text"
                          value={inviteToken}
                          onChange={(e) => {
                            setInviteToken(e.target.value);
                            setTokenError('');
                          }}
                          placeholder="DEMO-INVITE-2026"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-teal font-mono uppercase"
                        />
                        {tokenError && <p className="text-[10px] text-coral mt-1">{tokenError}</p>}
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 px-3 rounded-xl bg-teal text-bg text-xs font-heading font-semibold hover:shadow-glow-teal transition-all flex items-center justify-center gap-1.5"
                      >
                        Validate Token <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                  <p className="text-[10px] text-muted/70 mt-3 pt-3 border-t border-border">
                    Test code: <code className="text-text font-mono">DEMO-INVITE-2026</code>
                  </p>
                </div>

                {/* Path B: Request Access */}
                <div className="p-5 rounded-xl border border-border bg-surface-2/60 hover:border-coral/50 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center mb-2.5">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <h5 className="font-heading font-bold text-xs text-text">Path B: Request Access</h5>
                      <span className="text-[9px] font-mono text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
                        Approval
                      </span>
                    </div>
                    <p className="text-[11px] text-muted mt-1 mb-3">
                      Submit details for manual operator review.
                    </p>

                    {requestSubmitted ? (
                      <div className="p-3 bg-teal/10 border border-teal/30 rounded-xl text-teal text-xs space-y-1">
                        <div className="font-semibold flex items-center gap-1 text-teal">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Request Submitted
                        </div>
                        <p className="text-[11px]">{requestMessage}</p>
                      </div>
                    ) : (
                      <form onSubmit={handlePathB} className="space-y-2">
                        <input
                          type="text"
                          required
                          value={reqName}
                          onChange={(e) => setReqName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-teal"
                        />
                        <input
                          type="email"
                          required
                          value={reqEmail}
                          onChange={(e) => setReqEmail(e.target.value)}
                          placeholder="name@organization.com"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-teal"
                        />
                        <button
                          type="submit"
                          disabled={isRequesting}
                          className="w-full py-2 px-3 rounded-xl border border-border text-text hover:bg-surface-2 text-xs font-heading font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          {isRequesting ? 'Submitting...' : 'Request Invitation'}
                        </button>
                      </form>
                    )}
                  </div>

                  <p className="text-[10px] text-muted/70 mt-3 pt-3 border-t border-border">
                    Manual provisioning only.
                  </p>
                </div>
              </div>

              {/* Direct Login Link */}
              <div className="pt-2 text-center border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted">Already provisioned?</span>
                <button
                  type="button"
                  onClick={() => router.push('/demo/login')}
                  className="text-xs font-heading font-semibold text-teal hover:underline underline-offset-4 flex items-center gap-1"
                >
                  Go to Login <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisclaimerModal;
