'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { RangeSimEngine } from './engine';
import { Scenario, SimState, SimEvent } from './types';
import redBreakthrough from '@/content/scenarios/red-breakthrough.json';
import blueLockdown from '@/content/scenarios/blue-lockdown.json';

export * from './types';
export * from './engine';

export const SCENARIOS: Record<string, Scenario> = {
  'red-breakthrough': redBreakthrough as Scenario,
  'blue-lockdown': blueLockdown as Scenario,
};

export function useRangeSim(initialScenarioId: string = 'red-breakthrough', autoPlay: boolean = false) {
  const [scenarioId, setScenarioId] = useState(initialScenarioId);
  const scenario = SCENARIOS[scenarioId] || SCENARIOS['red-breakthrough'];
  const engineRef = useRef<RangeSimEngine | null>(null);

  if (!engineRef.current) {
    engineRef.current = new RangeSimEngine(scenario);
  }

  const [state, setState] = useState<SimState>(engineRef.current.getState());

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (engine.getScenario().id !== scenarioId) {
      engine.loadScenario(SCENARIOS[scenarioId], autoPlay);
    }

    const unsubscribe = engine.subscribe((newState) => {
      setState({ ...newState });
    });

    if (autoPlay) {
      engine.play();
    }

    return () => {
      unsubscribe();
    };
  }, [scenarioId, autoPlay]);

  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  const play = useCallback(() => engineRef.current?.play(), []);
  const pause = useCallback(() => engineRef.current?.pause(), []);
  const step = useCallback((direction: 'forward' | 'backward' = 'forward') => engineRef.current?.step(direction), []);
  const seek = useCallback((t: number) => engineRef.current?.seek(t), []);
  const setSpeed = useCallback((spd: number) => engineRef.current?.setSpeed(spd), []);
  const switchScenario = useCallback((id: string) => {
    setScenarioId(id);
  }, []);
  const makeDecision = useCallback((optionId: string) => engineRef.current?.makeDecision(optionId), []);

  return {
    state,
    scenario,
    play,
    pause,
    step,
    seek,
    setSpeed,
    switchScenario,
    makeDecision,
  };
}

