import { Scenario, SimEvent } from './types';

/**
 * withBlueDelay: deterministically derives an alternative team run from one base scenario.
 * Shifts blue events forward by `delaySeconds` to model a slower or distracted SOC response.
 * No randomness involved.
 */
export function withBlueDelay(baseScenario: Scenario, delaySeconds: number, variantId?: string, variantName?: string): Scenario {
  const delayedEvents: SimEvent[] = baseScenario.events.map((ev) => {
    if (ev.side === 'blue') {
      const newT = Math.min(baseScenario.duration, ev.t + delaySeconds);
      return {
        ...ev,
        t: newT,
        detail: {
          ...ev.detail,
          mttd: ev.detail.mttd ? ev.detail.mttd + delaySeconds : delaySeconds,
        },
      };
    }
    return { ...ev };
  });

  // Re-sort events by deterministic timestamp
  delayedEvents.sort((a, b) => a.t - b.t);

  const delayedDecisionPoints = baseScenario.decisionPoints?.map((dp) => ({
    ...dp,
    t: Math.min(baseScenario.duration - 2, dp.t + delaySeconds),
  }));

  const redScore = baseScenario.review.redScore + delaySeconds * 15;
  const blueScore = Math.max(50, baseScenario.review.blueScore - delaySeconds * 20);

  return {
    ...baseScenario,
    id: variantId || `${baseScenario.id}-delay-${delaySeconds}s`,
    title: variantName ? `${variantName} (${delaySeconds}s delay)` : `${baseScenario.title} (+${delaySeconds}s delay)`,
    events: delayedEvents,
    decisionPoints: delayedDecisionPoints,
    review: {
      ...baseScenario.review,
      redScore,
      blueScore,
      mttd: `${(parseInt(baseScenario.review.mttd, 10) || 12) + delaySeconds} seconds`,
    },
  };
}

