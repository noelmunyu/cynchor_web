import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser, checkRateLimit } from '@/lib/session';
import { getDb } from '@/lib/db';
import { launchLab } from '@/lib/lab/adapter';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user === null) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // DFD: Profile Making must be completed before anything else
    const profileDone = Number(user.is_profile_completed) === 1;
    if (profileDone === false) {
      return NextResponse.json({ success: false, error: 'Complete your profile first.' }, { status: 403 });
    }

    const rl = checkRateLimit(`lab_${user.id}`, 10, 60);
    if (rl.allowed === false) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter || 60) } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const mode = body.mode === 'TEAM' ? 'TEAM' : 'SOLO';

    if (mode === 'SOLO') {
      // Solo sessions: the server generates the session id; the client cannot choose one
      const sessionId = `ses_${crypto.randomUUID()}`;
      const lab = await launchLab({ sessionId, mode: 'SOLO', side: 'SOLO', userId: user.id });
      return NextResponse.json({ success: true, lab });
    }

    // Team sessions: caller must be a member of one of the two teams in an ACTIVE match.
    // The side comes from the database, never from the request.
    const sessionId = String(body.sessionId ?? '');
    const row = getDb().prepare(`
      SELECT ms.id AS id,
             CASE WHEN rtm.user_id IS NOT NULL THEN 'RED' ELSE 'BLUE' END AS side
      FROM match_sessions ms
      LEFT JOIN team_members rtm ON rtm.team_id = ms.red_team_id AND rtm.user_id = ?
      LEFT JOIN team_members btm ON btm.team_id = ms.blue_team_id AND btm.user_id = ?
      WHERE ms.id = ? AND ms.status = 'ACTIVE'
        AND (rtm.user_id IS NOT NULL OR btm.user_id IS NOT NULL)
    `).get(user.id, user.id, sessionId) as { id: string; side: 'RED' | 'BLUE' } | undefined;

    if (row === undefined) {
      return NextResponse.json({ success: false, error: 'Forbidden: no active match for this account.' }, { status: 403 });
    }

    const lab = await launchLab({ sessionId: row.id, mode: 'TEAM', side: row.side, userId: user.id });
    return NextResponse.json({ success: true, lab });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error.' }, { status: 500 });
  }
}
