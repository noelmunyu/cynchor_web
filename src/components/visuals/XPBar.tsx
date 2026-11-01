'use client';

import React from 'react';
import { Flame, Award, Zap } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  maxXP?: number;
  rank?: string;
  streak?: number;
  color?: 'teal' | 'coral' | 'gradient';
  showDetails?: boolean;
  className?: string;
}

export function XPBar({
  currentXP,
  maxXP = 1000,
  rank = 'Analyst I',
  streak = 4,
  color = 'gradient',
  showDetails = true,
  className = '',
}: XPBarProps) {
  const percentage = Math.min(100, Math.round((currentXP / maxXP) * 100));

  const getBarStyle = () => {
    if (color === 'teal') return 'bg-teal';
    if (color === 'coral') return 'bg-coral';
    return 'bg-gradient-to-r from-teal to-coral';
  };

  return (
    <div className={`space-y-1.5 select-none font-mono ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-xs whitespace-nowrap">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-teal font-semibold whitespace-nowrap">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>{rank}</span>
            </span>
            {streak > 0 && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-coral/10 text-coral text-[10px] font-bold shrink-0">
                <Flame className="w-3 h-3 fill-coral shrink-0" />
                <span>{streak}d streak</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-muted text-[11px] shrink-0 ml-2">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-text font-bold">{currentXP.toLocaleString()}</span>
            <span>/ {maxXP.toLocaleString()} XP</span>
          </div>
        </div>
      )}

      {/* Progress Track */}
      <div className="h-2.5 w-full bg-[#18181B] rounded-full overflow-hidden border border-[#26262C]/80 p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${getBarStyle()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

