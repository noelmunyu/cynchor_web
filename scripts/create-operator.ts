import crypto from 'crypto';
import { getDb, hashPassword, recordAuditLog } from '../src/lib/db';

const email = String(process.env.OPERATOR_EMAIL ?? '').trim().toLowerCase();
const name = String(process.env.OPERATOR_NAME ?? 'Lead Operator').trim().slice(0, 100);
const password = String(process.env.OPERATOR_PASSWORD ?? '');

if (email.includes('@') === false || email.length > 254) {
  console.error('OPERATOR_EMAIL must be a valid email address.');
  process.exit(1);
}
if (password.length < 12 || password.length > 128) {
  console.error('OPERATOR_PASSWORD must be 12 to 128 characters.');
  process.exit(1);
}

const db = getDb();
const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
if (existing !== undefined) {
  console.error('A user with that email already exists. Nothing changed.');
  process.exit(1);
}

db.prepare(`
  INSERT INTO users (id, email, password_hash, name, role, experience_level, is_profile_completed, is_operator, created_at)
  VALUES (?, ?, ?, ?, 'NET_SEC', 'EXPERT', 1, 1, ?)
`).run(`user_${crypto.randomUUID()}`, email, hashPassword(password), name, new Date().toISOString());

recordAuditLog({ action: 'OPERATOR_BOOTSTRAPPED', details: `Operator account created for ${email}` });
console.log(`Operator created: ${email}`);
