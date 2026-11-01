import test from 'node:test';
import assert from 'node:assert/strict';
import { hintCost, totalHintPenalty, retrospective } from '../src/lib/rangeSim/scoring';
import { withBlueDelay } from '../src/lib/rangeSim/variants';
import { AdversaryBotRunner } from '../src/lib/rangeSim/bot';
import redBreakthrough from '../src/content/scenarios/red-breakthrough.json';
import { Scenario, SimState, BotStep } from '../src/lib/rangeSim/types';

test('Scoring: hintCost calculates correct percentages (5%, 10%, 20%)', () => {
  const challengeXp = 200;
  assert.equal(hintCost(1, challengeXp), 10);
  assert.equal(hintCost(2, challengeXp), 20);
  assert.equal(hintCost(3, challengeXp), 40);
});

test('Scoring: totalHintPenalty caps total penalty at 50% of challengeXp', () => {
  const challengeXp = 100;
  // Tier 1 (5) + Tier 2 (10) + Tier 3 (20) = 35 <= 50
  assert.equal(totalHintPenalty([1, 2, 3], challengeXp), 35);

  // If multiple penalties exceed 50%, capped at 50
  assert.equal(totalHintPenalty([3, 3, 3], challengeXp), 50);
});

test('Variants: withBlueDelay derives alternative runs deterministically without randomness', () => {
  const base = redBreakthrough as Scenario;
  const delayed10a = withBlueDelay(base, 10, 'team-1', 'Team Cobalt');
  const delayed10b = withBlueDelay(base, 10, 'team-1', 'Team Cobalt');

  // Exact deterministic deep equality
  assert.deepEqual(delayed10a, delayed10b);

  // Blue events shifted by 10s
  const originalFirstBlue = base.events.find((e) => e.side === 'blue')!;
  const delayedFirstBlue = delayed10a.events.find((e) => e.side === 'blue')!;
  assert.equal(delayedFirstBlue.t, originalFirstBlue.t + 10);

  // Red events preserved
  const originalFirstRed = base.events.find((e) => e.side === 'red')!;
  const delayedFirstRed = delayed10a.events.find((e) => e.side === 'red')!;
  assert.equal(delayedFirstRed.t, originalFirstRed.t);
});

test('Bot: AdversaryBotRunner advances on detection and on timeout', () => {
  const steps: BotStep[] = [
    { id: 's1', technique: 'T1566', advanceOn: 'detected', timeoutSec: 10 },
    { id: 's2', technique: 'T1087', advanceOn: 'detected', timeoutSec: 15 },
  ];

  const runner = new AdversaryBotRunner(steps);
  assert.equal(runner.getCurrentStep()?.id, 's1');

  // Blue detects step 1 at t=4
  const detected = runner.onBlueDetected('T1566', 4);
  assert.equal(detected, true);
  assert.equal(runner.getCurrentStep()?.id, 's2');
  assert.equal(runner.getState().history[0].advanceReason, 'detected');

  // Step 2 is not detected, ticks from t=4 to t=20 (elapsed 16s >= timeout 15s)
  const advancedOnTimeout = runner.evaluateTick(20);
  assert.equal(advancedOnTimeout, true);
  assert.equal(runner.getCurrentStep(), null);
  assert.equal(runner.getState().isFinished, true);
  assert.equal(runner.getState().history[1].advanceReason, 'timeout');
});

test('Scoring: retrospective lists missed techniques and compute containment', () => {
  const mockState: SimState = {
    currentTime: 30,
    duration: 36,
    isPlaying: false,
    speed: 1,
    scenarioId: 'mock-sim',
    currentEventIndex: 2,
    activeEvents: [
      {
        t: 2,
        side: 'red',
        action: 'recon',
        xp: 50,
        effects: [],
        detail: { title: 'Probe', description: 'Recon', mitre: 'T1087' },
      },
      {
        t: 5,
        side: 'red',
        action: 'phish',
        xp: 100,
        effects: [],
        detail: { title: 'Phish', description: 'Phish', mitre: 'T1566' },
      },
      {
        t: 12,
        side: 'blue',
        action: 'alert',
        xp: 50,
        effects: [],
        detail: { title: 'EDR Alert', description: 'Alert', mitre: 'T1566', mttd: 12 },
      },
    ],
    nodeStates: { internet: 'clean' },
    redXP: 150,
    blueXP: 50,
    activeDecision: null,
    decisionFeedback: null,
    isCompleted: true,
    mttdSeconds: 12,
  };

  const retro = retrospective(mockState);
  assert.equal(retro.mttdSec, 12);
  // Red executed T1087 and T1566, Blue only detected T1566 -> T1087 is missed
  assert.deepEqual(retro.missedTechniques, ['T1087']);
  assert.ok(retro.remediation.length > 0);
});

