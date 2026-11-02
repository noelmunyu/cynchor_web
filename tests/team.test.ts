import test from 'node:test';
import assert from 'node:assert/strict';
import { TEAM_CONTENT } from '../src/content/team';

test('Team: TEAM_CONTENT has exactly 3 members with unique valid ids and photoSlugs', () => {
  assert.equal(TEAM_CONTENT.members.length, 3, 'Expected exactly 3 co-founders');

  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const member of TEAM_CONTENT.members) {
    assert.ok(member.id, 'Member id must not be empty');
    assert.ok(!ids.has(member.id), `Duplicate member id: ${member.id}`);
    ids.add(member.id);

    assert.ok(member.photoSlug, 'photoSlug must not be empty');
    assert.ok(
      slugRegex.test(member.photoSlug),
      `photoSlug "${member.photoSlug}" does not match kebab-case regex`
    );
    assert.ok(!slugs.has(member.photoSlug), `Duplicate photoSlug: ${member.photoSlug}`);
    slugs.add(member.photoSlug);
  }
});

test('Team: each member has valid required fields, role Co-founder, and shortBio <= 220 chars', () => {
  for (const member of TEAM_CONTENT.members) {
    assert.ok(member.name && member.name.trim().length > 0, `Member name missing for ${member.id}`);
    assert.equal(member.role, 'Co-founder', `Member role must strictly be 'Co-founder' for ${member.id}`);
    assert.ok(member.tagline && member.tagline.trim().length > 0, `Tagline missing for ${member.id}`);
    assert.ok(member.shortBio && member.shortBio.trim().length > 0, `Short bio missing for ${member.id}`);
    assert.ok(
      member.shortBio.length <= 220,
      `shortBio for ${member.id} exceeds 220 chars (${member.shortBio.length} chars)`
    );
    assert.ok(
      Array.isArray(member.fullBio) && member.fullBio.length >= 1,
      `fullBio must have at least one paragraph for ${member.id}`
    );
    assert.ok(
      Array.isArray(member.focusAreas) && member.focusAreas.length >= 1,
      `focusAreas must not be empty for ${member.id}`
    );

    if (member.links && member.links.length > 0) {
      for (const link of member.links) {
        assert.ok(
          link.href.startsWith('https://'),
          `Link href must start with https:// for ${member.id}: ${link.href}`
        );
      }
    }
  }
});

test('Team: forbidden-phrase check fails on invented executive titles', () => {
  const FORBIDDEN_TITLES = ['CEO', 'CTO', 'COO', 'founder and CEO'];
  const jsonContent = JSON.stringify(TEAM_CONTENT);

  for (const phrase of FORBIDDEN_TITLES) {
    // Check with word boundary or exact phrase to prevent false positives while strictly blocking invented titles
    const regex = new RegExp(`\\b${phrase}\\b`, 'i');
    assert.ok(
      !regex.test(jsonContent),
      `Forbidden executive title or phrase "${phrase}" found in team content`
    );
  }
});
