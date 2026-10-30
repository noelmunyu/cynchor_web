import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRateLimit } from '@/lib/session';
import { getDb, endMatch } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user === null) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const rl = checkRateLimit(`endmatch_${user.id}`, 10, 60);
    if (rl.allowed === false) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter || 60) } });
    }
    const body = await req.json().catch(() => ({}));
    const sessionId = String(body.sessionId ?? '');
    const member = getDb().prepare(`
      SELECT ms.id AS id FROM match_sessions ms
      JOIN team_members tm ON (tm.team_id = ms.red_team_id OR tm.team_id = ms.blue_team_id)
      WHERE ms.id = ? AND ms.status = 'ACTIVE' AND tm.user_id = ? LIMIT 1
    `).get(sessionId, user.id);
    if (member === undefined) {
      return NextResponse.json({ success: false, error: 'No active match found for this account.' }, { status: 404 });
    }
    endMatch(sessionId);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error.' }, { status: 500 });
  }
}
