import test from 'node:test';
import assert from 'node:assert/strict';
import { getDb, endMatch, endStaleMatches } from '../src/lib/db';

function seedMatch(tag: string, createdAt: string) {
  const db = getDb();
  const red = `t_red_${tag}`;
  const blue = `t_blue_${tag}`;
  const ses = `m_${tag}`;
  for (const [id, side] of [[red, 'RED'], [blue, 'BLUE']]) {
    db.prepare("INSERT INTO teams (id, name, side, leader_id, is_complete, status, created_at) VALUES (?, ?, ?, 'x', 1, 'MATCHED', ?)").run(id, id, side, createdAt);
    db.prepare("INSERT INTO matchmaking_queue (id, team_id, side, status, joined_at) VALUES (?, ?, ?, 'MATCHED', ?)").run(`q_${id}`, id, side, createdAt);
  }
  db.prepare("INSERT INTO match_sessions (id, red_team_id, blue_team_id, mode, status, created_at) VALUES (?, ?, ?, 'TEAM', 'ACTIVE', ?)").run(ses, red, blue, createdAt);
  return { red, blue, ses };
}

test('endMatch frees both teams and clears their queue rows', () => {
  const db = getDb();
  const { red, blue, ses } = seedMatch(`a${Date.now()}`, new Date().toISOString());
  assert.equal(endMatch(ses), true);
  assert.equal(endMatch(ses), false);
  assert.equal((db.prepare('SELECT status AS s FROM match_sessions WHERE id = ?').get(ses) as { s: string }).s, 'ENDED');
  assert.equal((db.prepare('SELECT status AS s FROM teams WHERE id = ?').get(red) as { s: string }).s, 'RECRUITING');
  assert.equal((db.prepare('SELECT COUNT(*) AS c FROM matchmaking_queue WHERE team_id IN (?, ?)').get(red, blue) as { c: number }).c, 0);
});

test('endStaleMatches ends matches older than the cutoff', () => {
  const db = getDb();
  const old = new Date(Date.now() - 5 * 3600 * 1000).toISOString();
  const { ses } = seedMatch(`b${Date.now()}`, old);
  assert.ok(endStaleMatches(4) >= 1);
  assert.equal((db.prepare('SELECT status AS s FROM match_sessions WHERE id = ?').get(ses) as { s: string }).s, 'ENDED');
});
