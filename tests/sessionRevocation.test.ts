import test from 'node:test';
import assert from 'node:assert/strict';
import { getDb } from '../src/lib/db';
import { revokeUserSessions } from '../src/lib/session';

test('revokeUserSessions increments session_version', () => {
  const db = getDb();
  const id = `user_test_${Date.now()}`;
  db.prepare("INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, 'x', 'Test', ?)").run(id, `${id}@test.local`, new Date().toISOString());
  const read = () => (db.prepare('SELECT session_version AS v FROM users WHERE id = ?').get(id) as { v: number }).v;
  const before = read();
  revokeUserSessions(id);
  assert.equal(read(), before + 1);
});
