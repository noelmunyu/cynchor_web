'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function EndMatchButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function endMatch() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/match/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        router.push('/demo/dashboard');
        router.refresh();
        return;
      }
      setError(data.error || 'Could not end the session.');
    } catch {
      setError('Network error. Please try again.');
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={endMatch}
        disabled={busy}
        className="px-3 py-1.5 rounded-xl border border-border text-xs font-heading font-medium text-muted hover:text-text hover:bg-surface-2 transition-colors disabled:opacity-50"
      >
        {busy ? 'Ending…' : 'End session'}
      </button>
      {error && <span className="text-[10px] text-coral">{error}</span>}
    </div>
  );
}
