import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser, checkRateLimit } from '@/lib/session';
import { getDb, endStaleMatches, recordAuditLog } from '@/lib/db';

type TeamRow = { id: string; name: string; side: 'RED' | 'BLUE'; is_complete: number; status: string };

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user === null) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (Number(user.is_profile_completed) !== 1) {
      return NextResponse.json({ success: false, error: 'Complete your profile first.' }, { status: 403 });
    }
    const rl = checkRateLimit(`mm_${user.id}`, 60, 60);
    if (rl.allowed === false) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter || 60) } });
    }

    const body = await req.json().catch(() => ({}));
    const teamId = String(body.teamId ?? '');
    if (teamId === '') {
      return NextResponse.json({ success: false, error: 'Missing team ID' }, { status: 400 });
    }

    const db = getDb();
    endStaleMatches();

    const isMember = db.prepare('SELECT 1 AS ok FROM team_members WHERE team_id = ? AND user_id = ?').get(teamId, user.id);
    if (isMember === undefined) {
      return NextResponse.json({ success: false, error: 'Forbidden: you are not a member of this team.' }, { status: 403 });
    }

    const myTeam = db.prepare('SELECT id, name, side, is_complete, status FROM teams WHERE id = ?').get(teamId) as TeamRow | undefined;
    if (myTeam === undefined) {
      return NextResponse.json({ success: false, error: 'Team not found.' }, { status: 404 });
    }
    const memberCount = (db.prepare('SELECT COUNT(*) AS count FROM team_members WHERE team_id = ?').get(teamId) as { count: number }).count;
    if (memberCount < 3) {
      return NextResponse.json({ success: false, error: 'Team must have at least 3 members to enter matchmaking.' }, { status: 400 });
    }

    const opposingSide = myTeam.side === 'RED' ? 'BLUE' : 'RED';
    const now = new Date().toISOString();

    const matchedResponse = (sessionId: string, oppTeamId: string) => {
      const opp = db.prepare('SELECT id, name, side FROM teams WHERE id = ?').get(oppTeamId) as { id: string; name: string; side: string } | undefined;
      const oppSize = (db.prepare('SELECT COUNT(*) AS count FROM team_members WHERE team_id = ?').get(oppTeamId) as { count: number }).count;
      return NextResponse.json({
        success: true,
        matched: true,
        sessionId,
        myTeam: { id: myTeam.id, name: myTeam.name, side: myTeam.side, is_complete: myTeam.is_complete, status: myTeam.status, size: memberCount },
        opposingTeam: { id: oppTeamId, name: opp?.name ?? 'Opposing squad', side: opp?.side ?? opposingSide, size: oppSize },
      });
    };

    // Already in an active match? Return it.
    const existing = db.prepare("SELECT id, red_team_id, blue_team_id FROM match_sessions WHERE (red_team_id = ? OR blue_team_id = ?) AND status = 'ACTIVE' ORDER BY created_at DESC LIMIT 1").get(teamId, teamId) as { id: string; red_team_id: string; blue_team_id: string } | undefined;
    if (existing !== undefined) {
      return matchedResponse(existing.id, myTeam.side === 'RED' ? existing.blue_team_id : existing.red_team_id);
    }

    // Atomic pairing: one writer at a time, so two squads can never claim the same opponent
    let sessionId: string | null = null;
    let oppId: string | null = null;
    db.exec('BEGIN IMMEDIATE');
    try {
      const opp = db.prepare(`
        SELECT q.team_id AS team_id
        FROM matchmaking_queue q
        JOIN teams t ON t.id = q.team_id
        WHERE q.side = ? AND q.status = 'WAITING' AND q.team_id <> ?
          AND (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id) >= 3
        ORDER BY q.joined_at ASC LIMIT 1
      `).get(opposingSide, teamId) as { team_id: string } | undefined;

      if (opp !== undefined) {
        sessionId = `match_${crypto.randomUUID()}`;
        oppId = opp.team_id;
        const redId = myTeam.side === 'RED' ? myTeam.id : opp.team_id;
        const blueId = myTeam.side === 'BLUE' ? myTeam.id : opp.team_id;
        db.prepare("INSERT INTO match_sessions (id, red_team_id, blue_team_id, mode, status, created_at) VALUES (?, ?, ?, 'TEAM', 'ACTIVE', ?)").run(sessionId, redId, blueId, now);
        db.prepare("UPDATE matchmaking_queue SET status = 'MATCHED' WHERE team_id IN (?, ?)").run(myTeam.id, opp.team_id);
        db.prepare("UPDATE teams SET status = 'MATCHED' WHERE id IN (?, ?)").run(myTeam.id, opp.team_id);
      } else {
        const queued = db.prepare("SELECT 1 AS ok FROM matchmaking_queue WHERE team_id = ? AND status = 'WAITING'").get(teamId);
        if (queued === undefined) {
          db.prepare('DELETE FROM matchmaking_queue WHERE team_id = ?').run(teamId);
          db.prepare("INSERT INTO matchmaking_queue (id, team_id, side, status, joined_at) VALUES (?, ?, ?, 'WAITING', ?)").run(`q_${crypto.randomUUID()}`, teamId, myTeam.side, now);
          db.prepare("UPDATE teams SET status = 'QUEUED' WHERE id = ?").run(teamId);
        }
      }
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }

    if (sessionId !== null && oppId !== null) {
      recordAuditLog({ userId: user.id, action: 'MATCH_CREATED', details: `Match ${sessionId}: ${myTeam.id} vs ${oppId}` });
      return matchedResponse(sessionId, oppId);
    }

    return NextResponse.json({
      success: true,
      matched: false,
      myTeam: { id: myTeam.id, name: myTeam.name, side: myTeam.side, is_complete: myTeam.is_complete, status: 'QUEUED', size: memberCount },
      message: `Squad queued. Searching for opposing ${opposingSide === 'RED' ? 'Red' : 'Blue'} team...`,
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal error.' }, { status: 500 });
  }
}
