import React from 'react';

interface BadgeProps {
  type: 'v1' | 'v2' | 'coming-soon' | 'red' | 'blue' | 'netsec' | 'operator' | 'neutral';
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ type, className = '', size = 'md' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (type) {
    case 'v1':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-teal/10 border border-teal/30 text-teal ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          Live demo (V1)
        </span>
      );

    case 'v2':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-surface-2 border border-border text-muted ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-muted/60" />
          Upcoming (V2)
        </span>
      );

    case 'coming-soon':
      // CRITICAL: Used ONLY for AWS architecture note and GRC role
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-surface-2 border border-border text-muted/80 ${sizeClasses} ${className}`}
        >
          Coming soon
        </span>
      );

    case 'red':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-lg bg-coral/10 border border-coral/40 text-coral ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-coral" />
          Red Team
        </span>
      );

    case 'blue':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-lg bg-teal/10 border border-teal/40 text-teal ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal" />
          Blue Team
        </span>
      );

    case 'netsec':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-lg bg-surface-2 border border-border text-text ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-text/70" />
          Network Security
        </span>
      );

    case 'operator':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          Operator
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-lg bg-surface-2 border border-border text-muted ${sizeClasses} ${className}`}
        >
          Active
        </span>
      );
  }
}
