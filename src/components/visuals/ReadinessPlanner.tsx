'use client';

import React, { useState } from 'react';
import { Calculator, Users, Clock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export function ReadinessPlanner() {
  const [learners, setLearners] = useState<number>(24);
  const [squadSize, setSquadSize] = useState<number>(4);
  const [sessionMinutes, setSessionMinutes] = useState<number>(90);

  // Pure client-side calculations:
  // Number of squads formed = ceil(learners / squadSize)
  const squadsFormed = Math.ceil(learners / squadSize);
  // Red/Blue pairings = squads / 2
  const redBluePairings = Math.max(1, Math.floor(squadsFormed / 2));
  // Sessions needed so every squad plays both sides = 2
  const sessionsNeeded = 2;
  // Total range-hours = (squads / 2) * (sessionMinutes / 60) * sessionsNeeded
  const totalRangeHours = Math.round((squadsFormed / 2) * (sessionMinutes / 60) * sessionsNeeded * 10) / 10;

  return (
    <div className="bg-[#0E0F14] rounded-2xl border border-border p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-teal" />
            <h3 className="font-heading font-bold text-lg text-text">Exercise Readiness Planner</h3>
          </div>
          <p className="text-xs text-muted font-sans mt-0.5">
            Model cohort squad sizing and range concurrency requirements before running live exercises.
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-[#181820] text-muted border border-border">
          Planning aid, not a quote
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Input 1: Learners */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <label htmlFor="learners-slider" className="text-muted">Total Learners</label>
            <span className="text-text font-bold text-sm">{learners}</span>
          </div>
          <input
            id="learners-slider"
            type="range"
            min={4}
            max={200}
            step={2}
            value={learners}
            onChange={(e) => setLearners(parseInt(e.target.value, 10))}
            className="w-full accent-teal cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted/60">
            <span>4 min</span>
            <span>200 max</span>
          </div>
        </div>

        {/* Input 2: Squad size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <label htmlFor="squad-slider" className="text-muted">Squad Size (3–6)</label>
            <span className="text-text font-bold text-sm">{squadSize} per squad</span>
          </div>
          <input
            id="squad-slider"
            type="range"
            min={3}
            max={6}
            step={1}
            value={squadSize}
            onChange={(e) => setSquadSize(parseInt(e.target.value, 10))}
            className="w-full accent-teal cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted/60">
            <span>3 players</span>
            <span>6 players</span>
          </div>
        </div>

        {/* Input 3: Session length */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <label htmlFor="session-slider" className="text-muted">Session Length</label>
            <span className="text-text font-bold text-sm">{sessionMinutes} min</span>
          </div>
          <input
            id="session-slider"
            type="range"
            min={30}
            max={180}
            step={15}
            value={sessionMinutes}
            onChange={(e) => setSessionMinutes(parseInt(e.target.value, 10))}
            className="w-full accent-teal cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted/60">
            <span>30m blitz</span>
            <span>180m drill</span>
          </div>
        </div>
      </div>

      {/* Calculated outputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#26262C]">
        <div className="p-3.5 rounded-xl bg-[#14141B] border border-border">
          <span className="text-[10.5px] font-mono text-muted uppercase block">Squads Formed</span>
          <span className="text-2xl font-black font-heading text-text mt-1 block">{squadsFormed}</span>
          <span className="text-[10px] text-muted">Balanced cohorts</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#14141B] border border-border">
          <span className="text-[10.5px] font-mono text-muted uppercase block">Red/Blue Pairings</span>
          <span className="text-2xl font-black font-heading text-coral mt-1 block">{redBluePairings} vs {redBluePairings}</span>
          <span className="text-[10px] text-muted">Simultaneous matches</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#14141B] border border-border">
          <span className="text-[10.5px] font-mono text-muted uppercase block">Sessions Needed</span>
          <span className="text-2xl font-black font-heading text-teal mt-1 block">{sessionsNeeded}</span>
          <span className="text-[10px] text-muted">Both sides exercised</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#14141B] border border-border">
          <span className="text-[10.5px] font-mono text-muted uppercase block">Total Range-Hours</span>
          <span className="text-2xl font-black font-heading text-text mt-1 block">{totalRangeHours} hrs</span>
          <span className="text-[10px] text-muted">Lab runtime</span>
        </div>
      </div>

      <div className="text-[11px] font-mono text-muted/70 italic text-center">
        Formula: Pure client-side arithmetic for curriculum planning. Zero pricing or commercial quote assumptions.
      </div>
    </div>
  );
}

