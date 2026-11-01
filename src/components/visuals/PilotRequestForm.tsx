'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export function PilotRequestForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot field
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/access-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          source: 'pilot',
          website: website.trim(), // honeypot
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to submit pilot request. Please check inputs.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network connection error. Please try again.');
    }
  };

  return (
    <div id="pilot-form" className="bg-[#0E0F14] rounded-2xl border border-border p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal" />
            <h3 className="font-heading font-bold text-lg text-text">Request an Academic / Team Pilot</h3>
          </div>
          <p className="text-xs text-muted font-sans mt-0.5">
            Partner with us to pilot live red-vs-blue exercises for your university cohort, bootcamp, or security operations team.
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-teal/10 text-teal border border-teal/20">
          V1 Pilot Access
        </span>
      </div>

      {status === 'success' ? (
        <div className="p-6 rounded-xl bg-teal/10 border border-teal/30 text-teal space-y-2 text-center animate-in fade-in">
          <CheckCircle2 className="w-8 h-8 mx-auto" />
          <h4 className="font-heading font-bold text-base text-text">Thanks, we'll email you.</h4>
          <p className="text-xs text-muted max-w-md mx-auto">
            Your pilot request has been registered in the operator dispatch queue. We'll send an invite token to {email}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
          {status === 'error' && (
            <div className="p-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Rate-limit advisory */}
          <div className="text-[11px] font-mono text-muted/70 bg-[#14141B] p-2.5 rounded-lg border border-[#26262C]">
            Notice: Requests are rate-limited to 10 submissions per minute per IP to prevent automated queue abuse.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pilot-name" className="block text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                id="pilot-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jordan Miller"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border bg-[#14141A] text-text focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>

            <div>
              <label htmlFor="pilot-email" className="block text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
                Institutional / Work Email *
              </label>
              <input
                id="pilot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jmiller@university.edu"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border bg-[#14141A] text-text focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
          </div>

          {/* Hidden Honeypot Field */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website-hp">Website</label>
            <input
              id="website-hp"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[11px] text-muted font-mono">
              Data minimization: Collects name &amp; email only. Zero advertising trackers.
            </span>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal text-black font-heading font-bold text-xs hover:bg-teal/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{status === 'submitting' ? 'Submitting...' : 'Submit Pilot Request'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

