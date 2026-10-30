import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getDb, verifyPassword, recordAuditLog } from './db';
import { User } from '@/types';

function getSessionSecret(): string { const s = process.env.SESSION_SECRET; if (!s || s.length < 32) throw new Error("SESSION_SECRET (min 32 chars) must be set"); return s; }
const COOKIE_NAME = 'cynchor_session';

// In-memory sliding window rate limiter with exponential lockout backoff
interface RateLimitEntry {
  attempts: number;
  resetAt: number;
  lockoutUntil?: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string, maxAttempts = 5, windowSeconds = 60): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const current = rateLimitMap.get(key);

  if (!current) {
    rateLimitMap.set(key, { attempts: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true };
  }

  // Check active lockout
  if (current.lockoutUntil && now < current.lockoutUntil) {
    const retryAfter = Math.ceil((current.lockoutUntil - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Reset window if expired
  if (now > current.resetAt) {
    rateLimitMap.set(key, { attempts: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true };
  }

  current.attempts++;
  if (current.attempts > maxAttempts) {
    // 5-minute lockout backoff
    const lockoutSeconds = 300;
    current.lockoutUntil = now + lockoutSeconds * 1000;
    recordAuditLog({
      action: 'RATE_LIMIT_LOCKOUT',
      details: `Lockout triggered for ${key} after ${current.attempts} attempts (${lockoutSeconds}s lockout)`,
    });
    return { allowed: false, retryAfter: lockoutSeconds };
  }

  return { allowed: true };
}

export function resetRateLimit(key: string) {
  rateLimitMap.delete(key);
}

export function createSignedSessionToken(userId: string, version = 0): string {
  // Rotate session entropy: include random session nonce
  const sessionNonce = crypto.randomBytes(16).toString('hex');
  const payload = JSON.stringify({
    userId,
    ver: version,
    nonce: sessionNonce,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac("sha256", getSessionSecret()).update(b64Payload).digest('base64url');
  return `${b64Payload}.${signature}`;
}

export function verifySessionToken(token: string): string | null {
  try {
    const [b64Payload, signature] = token.split('.');
    if (!b64Payload || !signature) return null;

    const expectedSig = crypto.createHmac("sha256", getSessionSecret()).update(b64Payload).digest('base64url');
    // Constant time comparison for token signature
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf-8'));
    if (payload.exp < Date.now()) return null;

    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  const userId = verifySessionToken(sessionCookie);
  if (!userId) return null;

  const db = getDb();
  const stmt = db.prepare('SELECT id, email, name, role, experience_level, is_profile_completed, is_operator, created_at, session_version FROM users WHERE id = ?');
  const row = stmt.get(userId) as (User & { session_version: number }) | undefined;
  if (row === undefined) return null;
  const sameVersion = Number(row.session_version ?? 0) === readTokenVersion(sessionCookie);
  if (sameVersion === false) return null;
  const { session_version, ...user } = row;
  void session_version;
  return user as User;
}

export function setSessionCookie(userId: string) {
  const verRow = getDb().prepare('SELECT session_version AS v FROM users WHERE id = ?').get(userId) as { v: number } | undefined;
  const token = createSignedSessionToken(userId, Number(verRow?.v ?? 0));
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

function readTokenVersion(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString('utf-8'));
    return Number(payload.ver ?? 0);
  } catch {
    return 0;
  }
}

export function revokeUserSessions(userId: string) {
  getDb().prepare('UPDATE users SET session_version = session_version + 1 WHERE id = ?').run(userId);
}
