import React from 'react';
import Link from 'next/link';
import { getDb, hashToken } from '@/lib/db';
import { Badge } from '@/components/common/Badge';
import { XCircle, ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';

interface InvitePageProps {
  params: {
    token: string;
  };
}

export default function InvitePage({ params }: InvitePageProps) {
  const { token } = params;
  const db = getDb();

  const inviteStmt = db.prepare('SELECT * FROM invites WHERE token = ?');
  const invite = inviteStmt.get(hashToken(token)) as {
    token: string;
    email: string;
    is_used: number;
    expires_at: string;
  } | undefined;

  let errorReason = '';

  if (!invite) {
    errorReason = 'Invite token not found in directory.';
  } else if (invite.is_used) {
    errorReason = 'This invite token has already been redeemed.';
  } else if (new Date(invite.expires_at) < new Date()) {
    errorReason = 'This invite token has expired.';
  } else {
    // Valid: Redirect to login pre-associated with token
    redirect(`/demo/login?inviteToken=${encodeURIComponent(token)}&email=${encodeURIComponent(invite.email)}`);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-bg text-text">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-border shadow-xl text-center space-y-4">
        <div className="flex justify-center">
          <Badge type="v1" />
        </div>

        <div className="w-12 h-12 rounded-full bg-coral/10 text-coral flex items-center justify-center mx-auto">
          <XCircle className="w-6 h-6" />
        </div>

        <div>
          <h1 className="font-heading font-bold text-xl text-text">Invalid or Expired Invite</h1>
          <p className="text-xs text-muted mt-1">{errorReason}</p>
        </div>

        <div className="space-y-2 pt-2">
          <Link
            href="/demo/login"
            className="w-full py-2.5 px-4 rounded-xl bg-teal text-bg text-xs font-heading font-semibold hover:shadow-glow-teal transition-all inline-flex items-center justify-center gap-2"
          >
            Go to Portal Login <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-xl border border-border text-muted hover:text-text hover:bg-surface-2 text-xs font-heading font-medium transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
