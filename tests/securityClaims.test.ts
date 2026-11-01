import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { SECURITY_CONTENT, SecurityControl } from '../src/content/security-controls';

test('Security Claims: every claimed control has evidence that exists and matches repo code', () => {
  const claimed = SECURITY_CONTENT.controls.filter((c: SecurityControl) => c.visibility === 'claimed');
  assert.ok(claimed.length >= 10, 'Expected at least 10 claimed controls');

  for (const control of claimed) {
    assert.ok(control.evidence && control.evidence.length > 0, `Control ${control.id} has no evidence`);
    for (const ev of control.evidence) {
      const fullPath = path.resolve(process.cwd(), ev.file);
      assert.ok(fs.existsSync(fullPath), `Evidence file missing for ${control.id}: ${ev.file}`);
      const content = fs.readFileSync(fullPath, 'utf-8');
      assert.ok(
        content.includes(ev.contains),
        `Control ${control.id} stale evidence: file "${ev.file}" does not contain "${ev.contains}"`
      );
    }
  }
});

test('Security Claims: verification flags strictly match visibility tiers', () => {
  for (const control of SECURITY_CONTENT.controls) {
    if (control.visibility === 'claimed') {
      assert.equal(
        control.verified,
        true,
        `Claimed control ${control.id} must have verified: true`
      );
    }
    if (control.visibility === 'roadmap') {
      assert.equal(
        control.verified,
        false,
        `Roadmap control ${control.id} must have verified: false`
      );
    }
  }
});

test('Security Claims: forbidden phrase scan over content and security page', () => {
  const FORBIDDEN = [
    'zero-trust',
    'zero trust',
    'aes-256',
    'soc 2 certified',
    'iso 27001 certified',
    'military-grade',
    'bank-grade',
    'enterprise-grade',
  ];

  const contentDir = path.resolve(process.cwd(), 'src/content');
  const filesToScan: string[] = [];

  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir);
    for (const f of files) {
      if (f.endsWith('.ts')) {
        filesToScan.push(path.join(contentDir, f));
      }
    }
  }

  const securityPage = path.resolve(process.cwd(), 'src/app/security/page.tsx');
  if (fs.existsSync(securityPage)) {
    filesToScan.push(securityPage);
  }

  assert.ok(filesToScan.length > 0, 'No files found to scan');

  for (const file of filesToScan) {
    const content = fs.readFileSync(file, 'utf-8').toLowerCase();
    for (const phrase of FORBIDDEN) {
      assert.ok(
        !content.includes(phrase),
        `Forbidden marketing phrase "${phrase}" found in ${path.relative(process.cwd(), file)}`
      );
    }
  }
});

test('Security Claims: RFC 9116 security.txt contains mandatory fields and future expiry', () => {
  const secTxtPath = path.resolve(process.cwd(), 'public/.well-known/security.txt');
  assert.ok(fs.existsSync(secTxtPath), 'security.txt missing');

  const content = fs.readFileSync(secTxtPath, 'utf-8');
  assert.ok(content.includes('Contact:'), 'security.txt missing Contact');
  assert.ok(content.includes('Expires:'), 'security.txt missing Expires');
  assert.ok(content.includes('Preferred-Languages:'), 'security.txt missing Preferred-Languages');
  assert.ok(content.includes('Canonical:'), 'security.txt missing Canonical');

  const expiresLine = content.split('\n').find((line) => line.startsWith('Expires:'));
  assert.ok(expiresLine, 'Expires line not found');
  const expiresValue = expiresLine.replace('Expires:', '').trim();
  const parsedDate = new Date(expiresValue).getTime();
  assert.ok(!isNaN(parsedDate), `Expires value is invalid date: ${expiresValue}`);
  assert.ok(parsedDate > Date.now(), `Expires date must be in the future: ${expiresValue}`);
});
