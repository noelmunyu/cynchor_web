import { NextResponse } from 'next/server';
import { clearSessionCookie, getCurrentUser, revokeUserSessions } from '@/lib/session';
import { recordAuditLog } from '@/lib/db';

export async function POST() {
  const user = await getCurrentUser();
  if (user !== null) {
    revokeUserSessions(user.id);
    recordAuditLog({ userId: user.id, action: 'LOGOUT', details: 'Session revoked server-side' });
  }
  clearSessionCookie();
  return NextResponse.json({ success: true, redirectTo: '/' });
}
