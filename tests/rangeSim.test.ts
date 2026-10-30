import test from 'node:test';
import assert from 'node:assert/strict';
import { RangeSimEngine } from '../src/lib/rangeSim/engine';
import redBreakthrough from '../src/content/scenarios/red-breakthrough.json';
import blueLockdown from '../src/content/scenarios/blue-lockdown.json';
import { Scenario } from '../src/lib/rangeSim/types';

test('RangeSimEngine: determinism across seek calls', () => {
  const engine = new RangeSimEngine(redBreakthrough as Scenario);

  // Seek to 15 seconds
  engine.seek(15);
  const state15a = { ...engine.getState() };

  // Seek to 30 seconds
  engine.seek(30);
  const state30 = { ...engine.getState() };

  // Seek back to 15 seconds
  engine.seek(15);
  const state15b = { ...engine.getState() };

  // Verify exact deterministic equality at t=15
  assert.equal(state15a.currentTime, 15);
  assert.equal(state15a.redXP, state15b.redXP);
  assert.equal(state15a.blueXP, state15b.blueXP);
  assert.deepEqual(state15a.nodeStates, state15b.nodeStates);
  assert.equal(state15a.activeEvents.length, state15b.activeEvents.length);

  // Verify that state at t=30 advanced past state at t=15
  assert.ok(state30.redXP > state15a.redXP);
  assert.ok(state30.activeEvents.length > state15a.activeEvents.length);
});

test('RangeSimEngine: scenario completion and review', () => {
  const engine = new RangeSimEngine(redBreakthrough as Scenario);

  // Seek to scenario duration
  engine.seek(redBreakthrough.duration);
  const state = engine.getState();

  assert.equal(state.currentTime, redBreakthrough.duration);
  assert.equal(state.isCompleted, true);
  assert.equal(state.nodeStates['ws-402'], 'isolated');
  assert.equal(state.nodeStates['srv-fin'], 'compromised');
  assert.equal(redBreakthrough.review.labeled, 'Illustrative');
});

test('RangeSimEngine: blue-lockdown defends perimeter', () => {
  const engine = new RangeSimEngine(blueLockdown as Scenario);

  engine.seek(blueLockdown.duration);
  const state = engine.getState();

  assert.equal(state.isCompleted, true);
  assert.equal(state.nodeStates['ws-402'], 'isolated');
  // DC and Finance remain clean
  assert.equal(state.nodeStates['dc-01'], 'clean');
  assert.equal(state.nodeStates['srv-fin'], 'clean');
  assert.ok(state.blueXP > state.redXP);
});

