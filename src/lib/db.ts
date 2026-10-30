import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Path to SQLite db file
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = process.env.CYNCHOR_DB_PATH || path.join(dbDir, 'cynchor.sqlite');

let database: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!database) {
    database = new DatabaseSync(dbPath);
    initSchema(database);
  }
  return database;
}

export function hashPassword(password: string, salt?: string): string {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return `${actualSalt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, originalHash] = stored.split(':');
    if (!salt || !originalHash) return false;
    const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

export function hashIpAddress(ip: string = '127.0.0.1'): string {
  const salt = process.env.IP_HASH_SALT || 'cynchor-default-ip-hash-salt-2026';
  return crypto.createHmac('sha256', salt).update(ip).digest('hex').slice(0, 16);
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function recordAuditLog({
  userId,
  action,
  details,
  ip = '127.0.0.1',
}: {
  userId?: string;
  action: string;
  details?: string;
  ip?: string;
}) {
  try {
    const db = getDb();
    const id = `audit_${crypto.randomUUID()}`;
    const ipHash = hashIpAddress(ip);
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, details, ip_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId || 'ANONYMOUS', action, details || null, ipHash, now);
  } catch (err) {
    // Non-blocking log failure
    console.error('Audit log recording error:', err);
  }
}

export function getAuditLogs(limit: number = 50) {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, user_id, action, details, ip_hash, created_at
    FROM audit_logs
    ORDER BY created_at DESC
    LIMIT ?
  `);
  return stmt.all(limit);
}

export function createSecureInvite(email: string, expiresInDays: number = 7): { plainToken: string; expiresAt: string } {
  const db = getDb();
  // 256-bit random entropy = 32 bytes
  const plainToken = `CYN-${crypto.randomBytes(32).toString('hex').toUpperCase()}`;
  const hashed = hashToken(plainToken);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
  const id = `inv_${crypto.randomUUID()}`;

  const stmt = db.prepare(`
    INSERT INTO invites (id, token, email, is_used, expires_at, created_at)
    VALUES (?, ?, ?, 0, ?, ?)
  `);
  stmt.run(id, hashed, email.toLowerCase().trim(), expiresAt, now.toISOString());

  recordAuditLog({
    action: 'INVITE_CREATED',
    details: `Invite generated for ${email} (256-bit token stored hashed)`,
  });

  return { plainToken, expiresAt };
}

export function verifyAndConsumeInvite(plainToken: string, expectedEmail?: string): { valid: boolean; email?: string; error?: string } {
  const db = getDb();
  const hashed = hashToken(plainToken);

  const stmt = db.prepare(`
    SELECT id, email, is_used, expires_at
    FROM invites
    WHERE token = ?
  `);
  const row = stmt.get(hashed) as { id: string; email: string; is_used: number; expires_at: string } | undefined;

  if (!row) {
    return { valid: false, error: 'Invite token is invalid or does not exist.' };
  }

  if (row.is_used === 1) {
    return { valid: false, error: 'This invite token has already been consumed.' };
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { valid: false, error: 'This invite token has expired.' };
  }

  if (expectedEmail && row.email !== expectedEmail.toLowerCase().trim()) { return { valid: false, error: "This invite token does not belong to this account." }; }
  // Consume token
  const consumeStmt = db.prepare(`
    UPDATE invites
    SET is_used = 1, used_at = ?
    WHERE id = ?
  `);
  consumeStmt.run(new Date().toISOString(), row.id);

  recordAuditLog({
    action: 'INVITE_CONSUMED',
    details: `Token consumed for user ${row.email}`,
  });

  return { valid: true, email: row.email };
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT, -- 'RED_TEAM', 'BLUE_TEAM', 'NET_SEC', 'GRC'
      experience_level TEXT, -- 'BEGINNER', 'INTERMEDIATE', 'EXPERT'
      is_profile_completed INTEGER DEFAULT 0,
      is_operator INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS disclaimers (
      id TEXT PRIMARY KEY,
      accepted_at TEXT NOT NULL,
      user_identifier TEXT NOT NULL,
      ip_address TEXT,
      version TEXT DEFAULT 'v1.1'
    );

    CREATE TABLE IF NOT EXISTS access_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      created_at TEXT NOT NULL,
      approved_at TEXT,
      generated_invite_token TEXT
    );

    CREATE TABLE IF NOT EXISTS invites (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      is_used INTEGER DEFAULT 0,
      used_at TEXT,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      side TEXT NOT NULL,
      leader_id TEXT NOT NULL,
      is_complete INTEGER DEFAULT 0,
      status TEXT DEFAULT 'RECRUITING',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      team_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      joined_at TEXT NOT NULL,
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(team_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS matchmaking_queue (
      id TEXT PRIMARY KEY,
      team_id TEXT UNIQUE,
      side TEXT NOT NULL,
      status TEXT DEFAULT 'WAITING',
      joined_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS match_sessions (
      id TEXT PRIMARY KEY,
      red_team_id TEXT,
      blue_team_id TEXT,
      mode TEXT NOT NULL,
      side TEXT,
      user_id TEXT,
      lab_id TEXT,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      details TEXT,
      ip_hash TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Try migrating audit_logs columns if table was created in older schema
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS audit_logs_no_update BEFORE UPDATE ON audit_logs BEGIN SELECT RAISE(ABORT, 'audit_logs is append-only'); END;
    CREATE TRIGGER IF NOT EXISTS audit_logs_no_delete BEFORE DELETE ON audit_logs BEGIN SELECT RAISE(ABORT, 'audit_logs is append-only'); END;
  `);
  try {
    db.exec(`ALTER TABLE audit_logs ADD COLUMN user_id TEXT;`);
  } catch {}
  try {
    db.exec(`ALTER TABLE audit_logs ADD COLUMN ip_hash TEXT;`);
  } catch {}

  try {
    db.exec(`ALTER TABLE users ADD COLUMN session_version INTEGER NOT NULL DEFAULT 0;`);
  } catch {}

  // Seed default operator and seed accounts if empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const countResult = countStmt.get() as { count: number };
  
  if (countResult.count === 0 && process.env.NODE_ENV !== "production") {
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, experience_level, is_profile_completed, is_operator, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    // 1. Operator / Admin
    insertUser.run(
      'user_op_001',
      'operator@cynchor.local',
      hashPassword('CynchorAdmin2026!'),
      'Lead Operator',
      'RED_TEAM',
      'EXPERT',
      1,
      1,
      now
    );

    // 2. Existing Red Team member (Profile completed)
    insertUser.run(
      'user_red_001',
      'alex.red@cynchor.local',
      hashPassword('RedPass123!'),
      'Alex Vance',
      'RED_TEAM',
      'INTERMEDIATE',
      1,
      0,
      now
    );

    // 3. Existing Blue Team member (Profile completed)
    insertUser.run(
      'user_blue_001',
      'sarah.blue@cynchor.local',
      hashPassword('BluePass123!'),
      'Sarah Connor',
      'BLUE_TEAM',
      'EXPERT',
      1,
      0,
      now
    );

    // 4. Network Security user (Profile completed)
    insertUser.run(
      'user_netsec_001',
      'jordan.netsec@cynchor.local',
      hashPassword('NetSec123!'),
      'Jordan Miller',
      'NET_SEC',
      'BEGINNER',
      1,
      0,
      now
    );

    // 5. New user
    insertUser.run(
      'user_new_001',
      'newuser@cynchor.local',
      hashPassword('NewUser123!'),
      'New Recruit',
      null,
      null,
      0,
      0,
      now
    );

    // Seed dummy invite token for testing Path A
    const insertInvite = db.prepare(`
      INSERT INTO invites (id, token, email, is_used, expires_at, created_at)
      VALUES (?, ?, ?, 0, ?, ?)
    `);
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    insertInvite.run('inv_demo_1', hashToken('DEMO-INVITE-2026'), 'newuser@cynchor.local', futureDate, now);

    // Seed mock team for active matchmaking test
    const insertTeam = db.prepare(`
      INSERT INTO teams (id, name, side, leader_id, is_complete, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const insertMember = db.prepare(`
      INSERT INTO team_members (id, team_id, user_id, joined_at)
      VALUES (?, ?, ?, ?)
    `);

    // A complete Blue team (3 members)
    insertTeam.run('team_blue_alpha', 'Cobalt Guard', 'BLUE', 'user_blue_001', 1, 'QUEUED', now);
    insertMember.run('m_1', 'team_blue_alpha', 'user_blue_001', now);
    insertMember.run('m_2', 'team_blue_alpha', 'user_op_001', now);
    insertMember.run('m_3', 'team_blue_alpha', 'user_netsec_001', now);

    const insertQueue = db.prepare(`
      INSERT INTO matchmaking_queue (id, team_id, side, status, joined_at)
      VALUES (?, ?, ?, 'WAITING', ?)
    `);
    insertQueue.run('q_blue_001', 'team_blue_alpha', 'BLUE', now);
  }
}

export function endMatch(sessionId: string): boolean {
  const db = getDb();
  const row = db.prepare("SELECT red_team_id, blue_team_id FROM match_sessions WHERE id = ? AND status = 'ACTIVE'").get(sessionId) as { red_team_id: string; blue_team_id: string } | undefined;
  if (row === undefined) return false;
  db.exec('BEGIN IMMEDIATE');
  try {
    db.prepare("UPDATE match_sessions SET status = 'ENDED' WHERE id = ?").run(sessionId);
    db.prepare('DELETE FROM matchmaking_queue WHERE team_id IN (?, ?)').run(row.red_team_id, row.blue_team_id);
    db.prepare("UPDATE teams SET status = 'RECRUITING' WHERE id IN (?, ?) AND status = 'MATCHED'").run(row.red_team_id, row.blue_team_id);
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  recordAuditLog({ action: 'MATCH_ENDED', details: `Match ${sessionId} ended` });
  return true;
}

export function endStaleMatches(maxHours: number = 4): number {
  const db = getDb();
  const cutoff = new Date(Date.now() - maxHours * 3600 * 1000).toISOString();
  const stale = db.prepare("SELECT id FROM match_sessions WHERE status = 'ACTIVE' AND created_at < ?").all(cutoff) as Array<{ id: string }>;
  for (const s of stale) endMatch(s.id);
  return stale.length;
}
