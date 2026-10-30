import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loginSchema,
  accessRequestSchema,
  inviteTokenSchema,
  teamCreateSchema,
  sanitizeOutput,
} from '../src/lib/validators';

test('Validators: loginSchema validates credentials and rejects malformed inputs', () => {
  const valid = loginSchema.safeParse({
    email: 'operator@cynchor.local',
    password: 'ValidPassword123!',
  });
  assert.equal(valid.success, true);

  const invalidEmail = loginSchema.safeParse({
    email: 'not-an-email',
    password: 'ValidPassword123!',
  });
  assert.equal(invalidEmail.success, false);

  const shortPassword = loginSchema.safeParse({
    email: 'operator@cynchor.local',
    password: 'short',
  });
  assert.equal(shortPassword.success, false);
});

test('Validators: accessRequestSchema enforces sanitized names and valid emails', () => {
  const valid = accessRequestSchema.safeParse({
    name: 'Sarah Connor',
    email: 'sarah.connor@fintechcorp.local',
  });
  assert.equal(valid.success, true);

  // Reject malicious script injection in name field
  const xssAttempt = accessRequestSchema.safeParse({
    name: '<script>alert(1)</script>',
    email: 'sarah.connor@fintechcorp.local',
  });
  assert.equal(xssAttempt.success, false);
});

test('Validators: inviteTokenSchema verifies format and length', () => {
  const valid = inviteTokenSchema.safeParse({
    token: 'CYN-7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F',
  });
  assert.equal(valid.success, true);

  const tooShort = inviteTokenSchema.safeParse({
    token: 'abc',
  });
  assert.equal(tooShort.success, false);
});

test('Validators: sanitizeOutput escapes HTML special characters', () => {
  const raw = '<img src=x onerror=alert(1)> & "quotes"';
  const sanitized = sanitizeOutput(raw);
  assert.equal(sanitized.includes('<img'), false);
  assert.equal(sanitized.includes('&lt;img'), true);
  assert.equal(sanitized.includes('&amp;'), true);
});

