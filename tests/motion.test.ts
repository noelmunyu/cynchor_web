import test from 'node:test';
import assert from 'node:assert/strict';
import { splitWords } from '../src/lib/motion/splitWords';

test('Motion: splitWords keeps word order, trims whitespace, and preserves punctuation', () => {
  const input = '   Live  cyber  range: defend, triage, and counter!   ';
  const words = splitWords(input);

  assert.deepEqual(words, [
    'Live',
    'cyber',
    'range:',
    'defend,',
    'triage,',
    'and',
    'counter!',
  ]);
});

test('Motion: splitWords caps at 12 words with remainder in last item', () => {
  const longSentence = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen';
  const words = splitWords(longSentence);

  assert.equal(words.length, 12, 'Must cap at 12 words');
  assert.equal(words[0], 'one');
  assert.equal(words[10], 'eleven');
  assert.equal(words[11], 'twelve thirteen fourteen fifteen');
});

test('Motion: splitWords is deterministic and handles empty or short inputs', () => {
  assert.deepEqual(splitWords(''), []);
  assert.deepEqual(splitWords('   \t\n  '), []);
  assert.deepEqual(splitWords('SingleWord'), ['SingleWord']);

  const text = 'Deterministic check across multiple calls 123.';
  assert.deepEqual(splitWords(text), splitWords(text));
});

