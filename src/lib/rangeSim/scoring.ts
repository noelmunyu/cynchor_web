import { SimState, RetrospectiveReport } from './types';

/**
 * pure hint cost calculator:
 * tier 1: 5% of challengeXp
 * tier 2: 10% of challengeXp
 * tier 3: 20% of challengeXp
 * total penalty capped at 50% of challengeXp
 */
export function hintCost(tier: 1 | 2 | 3, challengeXp: number): number {
  const percentages = { 1: 0.05, 2: 0.1, 3: 0.2 };
  return Math.round(challengeXp * percentages[tier]);
}

export function totalHintPenalty(tiersUsed: (1 | 2 | 3)[], challengeXp: number): number {
  const rawTotal = tiersUsed.reduce((sum, tier) => sum + hintCost(tier, challengeXp), 0);
  const cap = Math.round(challengeXp * 0.5);
  return Math.min(rawTotal, cap);
}

/**
 * Evaluates a simulation state and extracts a deterministic retrospective report
 */
export function retrospective(state: SimState): RetrospectiveReport {
  let firstDetectionSec: number | null = null;
  let containmentSec: number | null = null;
  const executedRedTechniques = new Set<string>();
  const detectedTechniques = new Set<string>();

  for (const ev of state.activeEvents) {
    if (ev.side === 'red' && ev.detail.mitre) {
      executedRedTechniques.add(ev.detail.mitre);
    }
    if (ev.side === 'blue') {
      if (firstDetectionSec === null && ev.t > 0) {
        firstDetectionSec = ev.t;
      }
      if (ev.detail.mitre) {
        detectedTechniques.add(ev.detail.mitre);
      }
      if (ev.action === 'isolate' || ev.action === 'contain') {
        containmentSec = ev.t;
      }
    }
  }

  const missedTechniques: string[] = [];
  executedRedTechniques.forEach((tech) => {
    if (!detectedTechniques.has(tech)) {
      missedTechniques.push(tech);
    }
  });

  // Calculate synthetic telemetry pipeline ingest latency (avg 1.2s - 2.4s)
  const pipelineLatencySec = firstDetectionSec !== null ? 1.8 : 0;

  const remediation: string[] = [];
  if (missedTechniques.includes('T1087') || missedTechniques.includes('T1087.002')) {
    remediation.push('Deploy edge LDAP/directory query rate alerting and honeypot service accounts.');
  }
  if (missedTechniques.includes('T1566') || missedTechniques.includes('T1566.001')) {
    remediation.push('Enforce strict inbound SPF/DKIM/DMARC rejection and macro script child-process blocking.');
  }
  if (missedTechniques.includes('T1078') || missedTechniques.includes('T1078.002')) {
    remediation.push('Enable LSASS credential guard and restrict local administrative privileges.');
  }
  if (missedTechniques.includes('T1021.002')) {
    remediation.push('Block lateral SMB administrative share access between workstation subnets.');
  }
  if (remediation.length === 0) {
    remediation.push('Maintain active EDR behavioral rules and sub-minute host isolation playbooks.');
  }

  return {
    mttdSec: state.mttdSeconds > 0 ? state.mttdSeconds : firstDetectionSec,
    containmentSec,
    missedTechniques,
    pipelineLatencySec,
    remediation,
  };
}

