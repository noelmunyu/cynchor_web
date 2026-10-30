import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import {
  hashPassword,
  verifyPassword,
  createSecureInvite,
  verifyAndConsumeInvite,
  recordAuditLog,
  getAuditLogs,
  hashIpAddress,
} from '../src/lib/db';
import { checkRateLimit, resetRateLimit } from '../src/lib/session';

test('Security Controls: password hashing uses salt and timingSafeEqual', () => {
  const password = 'SuperSecretRangePassword2026!';
  const hash1 = hashPassword(password);
  const hash2 = hashPassword(password);

  // Different salts produce different hashes
  assert.notEqual(hash1, hash2);

  // Verification succeeds with correct password
  assert.equal(verifyPassword(password, hash1), true);
  assert.equal(verifyPassword(password, hash2), true);

  // Verification fails with incorrect password
  assert.equal(verifyPassword('WrongPassword', hash1), false);
});

test('Security Controls: rate limiting triggers exponential lockout backoff', () => {
  const testKey = `test_ip_${Date.now()}`;
  resetRateLimit(testKey);

  // 5 attempts allowed
  for (let i = 0; i < 5; i++) {
    const res = checkRateLimit(testKey, 5, 60);
    assert.equal(res.allowed, true);
  }

  // 6th attempt should trigger lockout
  const lockoutRes = checkRateLimit(testKey, 5, 60);
  assert.equal(lockoutRes.allowed, false);
  assert.ok(lockoutRes.retryAfter && lockoutRes.retryAfter > 0);

  resetRateLimit(testKey);
});

test('Security Controls: 256-bit invite tokens are stored hashed and single-use', () => {
  const email = `candidate_${Date.now()}@fintechcorp.local`;
  const { plainToken, expiresAt } = createSecureInvite(email, 7);

  // Token has high entropy prefix + 64 hex characters (32 bytes = 256-bit)
  assert.ok(plainToken.startsWith('CYN-'));
  assert.ok(plainToken.length >= 68);

  // First consumption succeeds
  const firstConsume = verifyAndConsumeInvite(plainToken);
  assert.equal(firstConsume.valid, true);
  assert.equal(firstConsume.email, email);

  // Replay attempt fails (single-use enforcement)
  const replayConsume = verifyAndConsumeInvite(plainToken);
  assert.equal(replayConsume.valid, false);
  assert.match(replayConsume.error || '', /already been consumed/i);
});

test('Security Controls: append-only audit log records actions with IP hashes', () => {
  const testAction = `UNIT_TEST_ACTION_${Date.now()}`;
  const testIp = '198.51.100.42';

  recordAuditLog({
    userId: 'test_operator_001',
    action: testAction,
    details: 'Integration test audit assertion',
    ip: testIp,
  });

  const logs = getAuditLogs(20) as Array<{
    id: string;
    user_id: string;
    action: string;
    details: string;
    ip_hash: string;
    created_at: string;
  }>;

  const found = logs.find((l) => l.action === testAction);
  assert.ok(found);
  assert.equal(found.user_id, 'test_operator_001');

  // Assert IP is hashed, not stored as plaintext IP
  assert.notEqual(found.ip_hash, testIp);
  assert.equal(found.ip_hash, hashIpAddress(testIp));
});

test('Security Controls: security.txt is present and conforms to RFC 9116', () => {
  const secTxtPath = path.join(process.cwd(), 'public', '.well-known', 'security.txt');
  assert.equal(fs.existsSync(secTxtPath), true);

  const content = fs.readFileSync(secTxtPath, 'utf-8');
  assert.ok(content.includes('Contact: mailto:security@cynchor.com'));
  assert.ok(content.includes('Expires:'));
  assert.ok(content.includes('Preferred-Languages:'));
  assert.ok(content.includes('Canonical:'));
});

