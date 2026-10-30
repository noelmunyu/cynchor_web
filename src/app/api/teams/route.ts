import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const db = getDb();

    // Fetch user's current team if any
    const myTeamStmt = db.prepare(`
      SELECT t.* FROM teams t
      JOIN team_members tm ON tm.team_id = t.id
      WHERE tm.user_id = ?
      LIMIT 1
    `);
    const myTeam = myTeamStmt.get(user.id) as {
      id: string;
      name: string;
      side: 'RED' | 'BLUE';
      leader_id: string;
      is_complete: number;
      status: string;
    } | undefined;

    let roster: Array<{ id: string; name: string; email: string; role: string; experience_level: string }> = [];
    if (myTeam) {
      const rosterStmt = db.prepare(`
        SELECT u.id, u.name, u.role, u.experience_level
        FROM team_members tm
        JOIN users u ON u.id = tm.user_id
        WHERE tm.team_id = ?
      `);
      roster = rosterStmt.all(myTeam.id) as typeof roster;
    }

    // List available teams recruiting
    const availableTeamsStmt = db.prepare(`
      SELECT t.*, COUNT(tm.id) as member_count
      FROM teams t
      LEFT JOIN team_members tm ON tm.team_id = t.id
      WHERE t.status = 'RECRUITING'
      GROUP BY t.id
    `);
    const availableTeams = availableTeamsStmt.all();

    return NextResponse.json({
      success: true,
      myTeam: myTeam ? { ...myTeam, roster } : null,
      availableTeams,
    });
  } catch (err: unknown) {
    console.error(err); const message = 'Internal error.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Validate that Network Security does not form combat teams in v1.1
    if (user.role === 'NET_SEC') {
      return NextResponse.json(
        { success: false, error: 'Network Security users are restricted to Learn Alone in v1.1.' },
        { status: 403 }
      );
    }

    const { action, teamName, side, teamId } = await req.json();
    const db = getDb();
    const now = new Date().toISOString();
    if (['CREATE', 'JOIN', 'AUTO_MATCH'].includes(action) === false) {
      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
    const currentTeam = db.prepare('SELECT t.status AS status FROM teams t JOIN team_members tm ON tm.team_id = t.id WHERE tm.user_id = ? LIMIT 1').get(user.id) as { status: string } | undefined;
    if (currentTeam && currentTeam.status === 'MATCHED') {
      return NextResponse.json({ success: false, error: 'You are in an active match.' }, { status: 409 });
    }
    if (action === 'JOIN') {
      const target = db.prepare('SELECT status FROM teams WHERE id = ?').get(String(teamId)) as { status: string } | undefined;
      const recruiting = target ? target.status === 'RECRUITING' : false;
      if (recruiting === false) {
        return NextResponse.json({ success: false, error: 'Team not found or not recruiting.' }, { status: 404 });
      }
      const others = (db.prepare('SELECT COUNT(*) AS c FROM team_members WHERE team_id = ? AND user_id <> ?').get(String(teamId), user.id) as { c: number }).c;
      if (others >= 6) {
        return NextResponse.json({ success: false, error: 'Team is full.' }, { status: 409 });
      }
    }

    // Clean up any existing team membership for this user before new join/create
    db.prepare('DELETE FROM team_members WHERE user_id = ?').run(user.id);
    db.prepare('DELETE FROM matchmaking_queue WHERE team_id NOT IN (SELECT DISTINCT team_id FROM team_members)').run();
    db.prepare("DELETE FROM teams WHERE id NOT IN (SELECT DISTINCT team_id FROM team_members) AND status <> 'MATCHED'").run();
    db.prepare('UPDATE teams SET is_complete = CASE WHEN (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = teams.id) >= 3 THEN 1 ELSE 0 END').run();
    db.prepare('DELETE FROM matchmaking_queue WHERE team_id IN (SELECT id FROM teams WHERE is_complete = 0)').run();
    db.prepare("UPDATE teams SET status = 'RECRUITING' WHERE is_complete = 0 AND status = 'QUEUED'").run();

    if (action === 'CREATE') {
      const newTeamId = `team_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      const chosenSide = side === 'BLUE' ? 'BLUE' : 'RED';
      const name = String(teamName ?? "").trim().slice(0, 40) || `${user.name}'s Squad`;

      db.prepare(`
        INSERT INTO teams (id, name, side, leader_id, is_complete, status, created_at)
        VALUES (?, ?, ?, ?, 0, 'RECRUITING', ?)
      `).run(newTeamId, name, chosenSide, user.id, now);

      db.prepare(`
        INSERT INTO team_members (id, team_id, user_id, joined_at)
        VALUES (?, ?, ?, ?)
      `).run(`tm_${Date.now()}_1`, newTeamId, user.id, now);

      return NextResponse.json({ success: true, teamId: newTeamId });
    }

    if (action === 'JOIN' && teamId) {
      db.prepare(`
        INSERT INTO team_members (id, team_id, user_id, joined_at)
        VALUES (?, ?, ?, ?)
      `).run(`tm_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`, teamId, user.id, now);

      // Check member count
      const countStmt = db.prepare('SELECT COUNT(*) as count FROM team_members WHERE team_id = ?');
      const { count } = countStmt.get(teamId) as { count: number };
      const isComplete = count >= 3 ? 1 : 0;

      db.prepare('UPDATE teams SET is_complete = ? WHERE id = ?').run(isComplete, teamId);

      return NextResponse.json({ success: true, teamId });
    }

    if (action === 'AUTO_MATCH') {
      // "Match me with others": individual queue groups queued users into Red/Blue teams of 3+
      const targetSide = side === 'BLUE' ? 'BLUE' : 'RED';
      
      // Look for an existing recruiting team of that side with < 3 members
      const findTeam = db.prepare(`
        SELECT t.id, COUNT(tm.id) as count
        FROM teams t
        LEFT JOIN team_members tm ON tm.team_id = t.id
        WHERE t.side = ? AND t.status = 'RECRUITING'
        GROUP BY t.id
        HAVING count < 3
        ORDER BY count DESC LIMIT 1
      `);
      const existing = findTeam.get(targetSide) as { id: string; count: number } | undefined;

      let targetTeamId = existing?.id;

      if (!targetTeamId) {
        // Create new squad
        targetTeamId = `team_${targetSide.toLowerCase()}_${Date.now().toString().slice(-4)}`;
        db.prepare(`
          INSERT INTO teams (id, name, side, leader_id, is_complete, status, created_at)
          VALUES (?, ?, ?, ?, 0, 'RECRUITING', ?)
        `).run(targetTeamId, `${targetSide === 'RED' ? 'Crimson' : 'Azure'} Syndicate`, targetSide, user.id, now);
      }

      // Add user to this squad
      db.prepare(`
        INSERT INTO team_members (id, team_id, user_id, joined_at)
        VALUES (?, ?, ?, ?)
      `).run(`tm_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`, targetTeamId, user.id, now);

      // Re-verify completion
      const finalCount = (db.prepare('SELECT COUNT(*) as count FROM team_members WHERE team_id = ?').get(targetTeamId) as { count: number }).count;
      const isComplete = finalCount >= 3 ? 1 : 0;
      db.prepare('UPDATE teams SET is_complete = ? WHERE id = ?').run(isComplete, targetTeamId);

      return NextResponse.json({ success: true, teamId: targetTeamId, isComplete: Boolean(isComplete) });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    console.error(err); const message = 'Internal error.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

