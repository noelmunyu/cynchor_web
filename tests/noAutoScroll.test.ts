import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function getTsxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getTsxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

test('noAutoScroll: no unapproved scrollIntoView in src/**/*.tsx', () => {
  const srcDir = path.resolve(process.cwd(), 'src');
  const tsxFiles = getTsxFiles(srcDir);
  assert.ok(tsxFiles.length > 0, 'Should find tsx files to scan');

  const violations: string[] = [];

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      if (line.includes('scrollIntoView(')) {
        const prevLine = idx > 0 ? lines[idx - 1] : '';
        const hasApproval = line.includes('cy-allow-scroll:') || prevLine.includes('cy-allow-scroll:');
        if (!hasApproval) {
          violations.push(
            `${path.relative(process.cwd(), file)}:${idx + 1} - Unapproved scrollIntoView call: "${line.trim()}"`
          );
        }
      }
    });
  }

  assert.equal(
    violations.length,
    0,
    `Found unapproved scrollIntoView calls:\n${violations.join('\n')}`
  );
});

test('noAutoScroll: all .focus() calls must use { preventScroll: true }', () => {
  const srcDir = path.resolve(process.cwd(), 'src');
  const tsxFiles = getTsxFiles(srcDir);
  assert.ok(tsxFiles.length > 0, 'Should find tsx files to scan');

  const violations: string[] = [];

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      // Look for .focus(
      if (line.includes('.focus(')) {
        // Multi-line or single-line check for preventScroll: true
        const windowText = [lines[idx - 1] || '', line, lines[idx + 1] || '', lines[idx + 2] || ''].join(' ');
        if (!windowText.includes('preventScroll: true') && !windowText.includes('preventScroll:true')) {
          violations.push(
            `${path.relative(process.cwd(), file)}:${idx + 1} - focus() called without preventScroll: "${line.trim()}"`
          );
        }
      }
    });
  }

  assert.equal(
    violations.length,
    0,
    `Found focus() calls without preventScroll:\n${violations.join('\n')}`
  );
});

