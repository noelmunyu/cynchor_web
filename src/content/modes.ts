import { Inject } from '@/lib/rangeSim/types';

export type PlayMode = 'facilitator-led' | 'self-service';

export interface ComparisonRow {
  dimension: string;
  facilitator: string;
  selfService: string;
}

export const PLAY_MODE_COMPARISON: ComparisonRow[] = [
  {
    dimension: 'Control Authority',
    facilitator: 'Session facilitator/instructor controls timeline, speed (0.5x–4x), pausing, and vector injection.',
    selfService: 'Learner controls their own shift pace, pauses locally, and navigates step-by-step at individual speed.',
  },
  {
    dimension: 'Adversary Behavior',
    facilitator: 'Orchestrated red timeline with Game Master overrides, speed adjustments, and scripted synthetic injects.',
    selfService: 'Deterministic automated bot: advances on learner detection or escalates when detection timer elapses.',
  },
  {
    dimension: 'Support Delivery',
    facilitator: 'Live instructor guidance, custom hints on demand, and cohort-wide discussion review.',
    selfService: 'Deterministic 3-tier hint ladder (concept → approach → syntax) with transparent XP deductions.',
  },
  {
    dimension: 'Post-Scenario Flow',
    facilitator: 'Facilitated group debrief with scrubbable event markers, cohort leaderboard, and class telemetry comparisons.',
    selfService: 'Automated end-of-run retrospective report card with pipeline latency, missed techniques, and printable PDF/summary.',
  },
];

export const SYNTHETIC_INJECTS: Inject[] = [
  {
    id: 'inject-alert-storm',
    label: 'Credential-Reset Alert Storm',
    t: 14,
    effects: ['alert:high:mail-gw', 'alert:high:ws-402'],
    description: 'Adversary generates high-volume spoofed password reset notifications to flood defender triage queue.',
  },
  {
    id: 'inject-chat-outage',
    label: 'Chat Outage: Out-of-Band Sync',
    t: 19,
    effects: ['probe:dc-01'],
    description: 'Internal communications bridge severed. Squad must coordinate containment actions via synthetic emergency channel.',
  },
  {
    id: 'inject-scan-decoy',
    label: 'Noisy Scan Decoy',
    t: 24,
    effects: ['probe:mail-gw'],
    description: 'Adversary launches uncoordinated noisy port sweeps from 198.51.100.200 to mask quiet SMB lateral movement on 10.0.3.5.',
  },
];

