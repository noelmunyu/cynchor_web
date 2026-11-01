export type Side = 'red' | 'blue';

export interface SimDetail {
  title: string;
  description: string;
  mitre?: string;
  cmd?: string;
  log?: string;
  mttd?: number;
  attackerMove?: string;
  defenderDetect?: string;
  attackerAdapt?: string;
}

export interface SimEvent {
  t: number; // time in seconds from scenario start
  side: Side;
  action: string;
  node?: string;
  xp: number;
  effects: string[];
  detail: SimDetail;
}

export interface DecisionOption {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
  xpDelta: number;
}

export interface DecisionPoint {
  t: number;
  prompt: string;
  options: DecisionOption[];
}

export interface RoundReview {
  redScore: number;
  blueScore: number;
  mttd: string;
  lesson: string;
  labeled: 'Illustrative';
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  duration: number;
  events: SimEvent[];
  decisionPoints?: DecisionPoint[];
  review: RoundReview;
}

export type NodeStatus = 'clean' | 'probed' | 'compromised' | 'isolated';

export interface SimState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  speed: number;
  scenarioId: string;
  currentEventIndex: number;
  activeEvents: SimEvent[];
  nodeStates: Record<string, NodeStatus>;
  redXP: number;
  blueXP: number;
  activeDecision: DecisionPoint | null;
  decisionFeedback: { optionId: string; correct: boolean; feedback: string } | null;
  isCompleted: boolean;
  mttdSeconds: number;
}

// v1.3 Engine extensions
export interface Hint {
  tier: 1 | 2 | 3;
  text: string;
}

export interface Checkpoint {
  id: string;
  requires: string[];
  passMsg: string;
  failMsg: string;
}

export interface Inject {
  id: string;
  label: string;
  t: number;
  effects: string[];
  description?: string;
}

export interface BotStep {
  id: string;
  technique: string;
  advanceOn: 'detected' | 'timeout';
  timeoutSec: number;
  detail?: string;
}

export interface TeamVariant {
  id: string;
  name: string;
  blueDelaySec: number;
  missedTechniques: string[];
}

export interface RetrospectiveReport {
  mttdSec: number | null;
  containmentSec: number | null;
  missedTechniques: string[];
  pipelineLatencySec: number;
  remediation: string[];
}
