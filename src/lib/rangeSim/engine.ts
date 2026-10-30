import { Scenario, SimEvent, SimState, NodeStatus, DecisionPoint } from './types';

export type SimSubscriber = (state: SimState) => void;

export class RangeSimEngine {
  private scenario: Scenario;
  private state: SimState;
  private subscribers: Set<SimSubscriber> = new Set();
  private timerId: any = null;
  private lastTickTimestamp: number = 0;

  constructor(scenario: Scenario) {
    this.scenario = scenario;
    this.state = this.getInitialState(scenario);
  }

  private getInitialState(scenario: Scenario): SimState {
    const nodeStates: Record<string, NodeStatus> = {
      'internet': 'clean',
      'mail-gw': 'clean',
      'ws-402': 'clean',
      'dc-01': 'clean',
      'srv-fin': 'clean',
    };

    return {
      currentTime: 0,
      duration: scenario.duration,
      isPlaying: false,
      speed: 1,
      scenarioId: scenario.id,
      currentEventIndex: -1,
      activeEvents: [],
      nodeStates,
      redXP: 0,
      blueXP: 0,
      activeDecision: null,
      decisionFeedback: null,
      isCompleted: false,
      mttdSeconds: 0,
    };
  }

  public subscribe(subscriber: SimSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.state);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notify() {
    this.subscribers.forEach((sub) => {
      sub(this.state);
    });
  }

  public getState(): SimState {
    return this.state;
  }

  public getScenario(): Scenario {
    return this.scenario;
  }

  public loadScenario(scenario: Scenario, autoPlay: boolean = false) {
    this.pause();
    this.scenario = scenario;
    this.state = this.getInitialState(scenario);
    this.computeStateAt(0);
    this.notify();
    if (autoPlay) {
      this.play();
    }
  }

  public play() {
    if (this.state.isPlaying) return;
    if (this.state.currentTime >= this.scenario.duration) {
      this.seek(0);
    }
    this.state.isPlaying = true;
    this.lastTickTimestamp = Date.now();
    this.startTicker();
    this.notify();
  }

  public pause() {
    if (!this.state.isPlaying) return;
    this.state.isPlaying = false;
    this.stopTicker();
    this.notify();
  }

  public setSpeed(speed: number) {
    this.state.speed = speed;
    this.notify();
  }

  public seek(t: number) {
    const clamped = Math.max(0, Math.min(this.scenario.duration, t));
    this.computeStateAt(clamped);
    this.notify();
  }

  public step(direction: 'forward' | 'backward' = 'forward') {
    this.pause();
    const sortedEvents = [...this.scenario.events].sort((a, b) => a.t - b.t);
    
    if (direction === 'forward') {
      const nextEvent = sortedEvents.find(e => e.t > this.state.currentTime + 0.1);
      if (nextEvent) {
        this.seek(nextEvent.t);
      } else {
        this.seek(this.scenario.duration);
      }
    } else {
      const pastEvents = sortedEvents.filter(e => e.t < this.state.currentTime - 0.1);
      if (pastEvents.length > 0) {
        const prevEvent = pastEvents[pastEvents.length - 1];
        this.seek(prevEvent.t);
      } else {
        this.seek(0);
      }
    }
  }

  public makeDecision(optionId: string) {
    if (!this.state.activeDecision) return;
    const option = this.state.activeDecision.options.find(o => o.id === optionId);
    if (!option) return;

    this.state.decisionFeedback = {
      optionId,
      correct: option.correct,
      feedback: option.feedback,
    };
    if (option.correct) {
      this.state.blueXP += option.xpDelta;
    } else {
      this.state.redXP += 50;
    }
    this.state.activeDecision = null;
    this.notify();

    // Auto resume after brief display
    setTimeout(() => {
      this.play();
    }, 2500);
  }

  private startTicker() {
    this.stopTicker();
    this.timerId = setInterval(() => {
      const now = Date.now();
      const deltaSec = ((now - this.lastTickTimestamp) / 1000) * this.state.speed;
      this.lastTickTimestamp = now;

      const nextTime = this.state.currentTime + deltaSec;
      
      // Check if hitting a decision point
      if (this.scenario.decisionPoints) {
        const dp = this.scenario.decisionPoints.find(
          d => this.state.currentTime < d.t && nextTime >= d.t
        );
        if (dp && !this.state.decisionFeedback) {
          this.computeStateAt(dp.t);
          this.state.activeDecision = dp;
          this.pause();
          this.notify();
          return;
        }
      }

      if (nextTime >= this.scenario.duration) {
        this.computeStateAt(this.scenario.duration);
        this.state.isCompleted = true;
        this.pause();
      } else {
        this.computeStateAt(nextTime);
      }
      this.notify();
    }, 50);
  }

  private stopTicker() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Deterministic state computation: computes exact state at time t
   */
  public computeStateAt(t: number) {
    this.state.currentTime = t;
    const pastEvents = this.scenario.events
      .filter(e => e.t <= t)
      .sort((a, b) => a.t - b.t);

    this.state.activeEvents = pastEvents;
    this.state.currentEventIndex = pastEvents.length - 1;
    this.state.isCompleted = t >= this.scenario.duration;

    // Reset nodes & scores
    const nodeStates: Record<string, NodeStatus> = {
      'internet': 'clean',
      'mail-gw': 'clean',
      'ws-402': 'clean',
      'dc-01': 'clean',
      'srv-fin': 'clean',
    };
    let redXP = 0;
    let blueXP = 0;
    let mttd = 0;

    for (const ev of pastEvents) {
      if (ev.side === 'red') {
        redXP += ev.xp;
      } else {
        blueXP += ev.xp;
      }

      if (ev.detail.mttd && ev.detail.mttd > 0) {
        mttd = ev.detail.mttd;
      }

      // Apply effects
      for (const effect of ev.effects) {
        const [action, ...args] = effect.split(':');
        const targetNode = args[args.length - 1];
        if (targetNode && nodeStates[targetNode] !== undefined) {
          if (action === 'probe') {
            if (nodeStates[targetNode] === 'clean') {
              nodeStates[targetNode] = 'probed';
            }
          } else if (action === 'compromise') {
            nodeStates[targetNode] = 'compromised';
          } else if (action === 'isolate' || action === 'shield' || action === 'quarantine') {
            nodeStates[targetNode] = 'isolated';
          }
        }
      }
    }

    this.state.nodeStates = nodeStates;
    this.state.redXP = redXP;
    this.state.blueXP = blueXP;
    this.state.mttdSeconds = mttd;
  }

  public destroy() {
    this.stopTicker();
    this.subscribers.clear();
  }
}
