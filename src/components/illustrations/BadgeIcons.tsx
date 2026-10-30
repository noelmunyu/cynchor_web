import React from 'react';

export function XpIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" />
    </svg>
  );
}

export function LevelBadgeIcon({ level = 'BEGINNER', size = 22, className = '' }: { level?: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'; size?: number; className?: string }) {
  if (level === 'EXPERT') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#EA694B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <polygon points="12 6 15 11 20 11 16 14 18 19 12 16 6 19 8 14 4 11 9 11 12 6" fill="rgba(234,105,75,0.2)" />
      </svg>
    );
  }
  if (level === 'INTERMEDIATE') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#17ABA9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M 12 6 L 17 14 L 7 14 Z" fill="rgba(23,171,169,0.2)" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#E5E6E6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" fill="rgba(229,230,230,0.2)" />
    </svg>
  );
}

export function TrophyIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M 6 9 C 6 4, 18 4, 18 9 C 18 13, 14 15, 12 16 C 10 15, 6 13, 6 9 Z" />
      <path d="M 6 6 L 3 8 C 3 11, 5 12, 6 12" />
      <path d="M 18 6 L 21 8 C 21 11, 19 12, 18 12" />
      <line x1="12" y1="16" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  );
}

export function FlagIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M 4 22 L 4 3" />
      <path d="M 4 4 L 18 4 C 18 4, 15 7, 18 10 L 4 10" />
    </svg>
  );
}

export function StreakIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M 8.5 14.5 C 8.5 18, 12 21, 12 21 C 12 21, 15.5 18, 15.5 14.5 C 15.5 12, 13.5 10, 12 8 C 10.5 10, 8.5 12, 8.5 14.5 Z" />
      <path d="M 12 3 C 12 3, 17 7, 17 13 C 17 18, 12 21, 12 21 C 12 21, 7 18, 7 13 C 7 7, 12 3, 12 3 Z" />
    </svg>
  );
}

