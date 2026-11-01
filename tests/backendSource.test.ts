import test from 'node:test';
import assert from 'node:assert/strict';
import { accessRequestSchema } from '../src/lib/validators';
import { getDb } from '../src/lib/db';

test('Backend: accessRequestSchema accepts source pilot and demo, rejects others', () => {
  const pilotValid = accessRequestSchema.safeParse({
    name: 'Operator Beta',
    email: 'pilot@fintechcorp.local',
    source: 'pilot',
  });
  assert.equal(pilotValid.success, true);
  if (pilotValid.success) {
    assert.equal(pilotValid.data.source, 'pilot');
  }

  const demoValid = accessRequestSchema.safeParse({
    name: 'Operator Beta',
    email: 'demo@fintechcorp.local',
    source: 'demo',
  });
  assert.equal(demoValid.success, true);

  const defaultSource = accessRequestSchema.safeParse({
    name: 'Operator Beta',
    email: 'default@fintechcorp.local',
  });
  assert.equal(defaultSource.success, true);
  if (defaultSource.success) {
    assert.equal(defaultSource.data.source, 'demo');
  }

  const invalidSource = accessRequestSchema.safeParse({
    name: 'Operator Beta',
    email: 'invalid@fintechcorp.local',
    source: 'other_unknown_source',
  });
  assert.equal(invalidSource.success, false);
});

test('Backend: honeypot website field rejects non-empty values', () => {
  // Empty website passes
  const emptyHoneypot = accessRequestSchema.safeParse({
    name: 'Real Human',
    email: 'human@fintechcorp.local',
    website: '',
  });
  assert.equal(emptyHoneypot.success, true);

  // Filled website fails validation
  const spamBot = accessRequestSchema.safeParse({
    name: 'Spam Bot',
    email: 'bot@fintechcorp.local',
    website: 'https://spammy-site.invalid',
  });
  assert.equal(spamBot.success, false);
});

test('Backend: access_requests table has source column in database', () => {
  const db = getDb();
  const cols = db.prepare('PRAGMA table_info(access_requests)').all() as Array<{ name: string }>;
  const hasSource = cols.some((c) => c.name === 'source');
  assert.equal(hasSource, true);
});

