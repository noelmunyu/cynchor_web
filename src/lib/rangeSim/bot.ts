import { BotStep } from './types';

export interface BotRunnerState {
  currentStepIndex: number;
  stepStartTimeSec: number;
  isFinished: boolean;
  history: Array<{
    step: BotStep;
    advanceReason: 'detected' | 'timeout';
    advancedAtSec: number;
  }>;
}

export class AdversaryBotRunner {
  private steps: BotStep[];
  private state: BotRunnerState;

  constructor(steps: BotStep[]) {
    this.steps = steps;
    this.state = {
      currentStepIndex: 0,
      stepStartTimeSec: 0,
      isFinished: steps.length === 0,
      history: [],
    };
  }

  public getCurrentStep(): BotStep | null {
    if (this.state.isFinished || this.state.currentStepIndex >= this.steps.length) {
      return null;
    }
    return this.steps[this.state.currentStepIndex];
  }

  public getState(): BotRunnerState {
    return { ...this.state };
  }

  /**
   * Tick evaluation: call periodically or at each simulation time update.
   * If currentTimeSec - stepStartTimeSec >= timeoutSec, advance on timeout.
   */
  public evaluateTick(currentTimeSec: number): boolean {
    const current = this.getCurrentStep();
    if (!current) return false;

    const elapsed = currentTimeSec - this.state.stepStartTimeSec;
    if (elapsed >= current.timeoutSec) {
      this.advance('timeout', currentTimeSec);
      return true;
    }
    return false;
  }

  /**
   * Called when defender detects the indicator or executes detection against the current technique.
   */
  public onBlueDetected(technique: string, currentTimeSec: number): boolean {
    const current = this.getCurrentStep();
    if (!current) return false;

    if (current.technique === technique || current.technique.split('.')[0] === technique.split('.')[0]) {
      this.advance('detected', currentTimeSec);
      return true;
    }
    return false;
  }

  private advance(reason: 'detected' | 'timeout', currentTimeSec: number) {
    const current = this.getCurrentStep();
    if (!current) return;

    this.state.history.push({
      step: current,
      advanceReason: reason,
      advancedAtSec: currentTimeSec,
    });

    this.state.currentStepIndex += 1;
    this.state.stepStartTimeSec = currentTimeSec;

    if (this.state.currentStepIndex >= this.steps.length) {
      this.state.isFinished = true;
    }
  }

  public reset(startTimeSec: number = 0) {
    this.state = {
      currentStepIndex: 0,
      stepStartTimeSec: startTimeSec,
      isFinished: this.steps.length === 0,
      history: [],
    };
  }
}

