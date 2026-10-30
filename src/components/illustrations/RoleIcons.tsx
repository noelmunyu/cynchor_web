import React from 'react';

export function RedTeamIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="20" cy="20" r="16" stroke="#EA694B" strokeWidth="1.75" />
      <circle cx="20" cy="20" r="8" stroke="#EA694B" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="20" y1="4" x2="20" y2="10" stroke="#EA694B" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="30" x2="20" y2="36" stroke="#EA694B" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="20" x2="10" y2="20" stroke="#EA694B" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="20" x2="36" y2="20" stroke="#EA694B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2.5" fill="#EA694B" />
    </svg>
  );
}

export function BlueTeamIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M 20 6 L 33 11 C 33 24, 20 34, 20 34 C 20 34, 7 24, 7 11 Z"
        stroke="#17ABA9"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="18" r="4.5" stroke="#17ABA9" strokeWidth="1.5" />
      <line x1="20" y1="22.5" x2="20" y2="27" stroke="#17ABA9" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function NetSecIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="7" y="7" width="10" height="10" rx="2" stroke="#E5E6E6" strokeWidth="1.5" />
      <rect x="23" y="7" width="10" height="10" rx="2" stroke="#E5E6E6" strokeWidth="1.5" />
      <rect x="15" y="23" width="10" height="10" rx="2" stroke="#E5E6E6" strokeWidth="1.5" />
      <line x1="12" y1="17" x2="12" y2="20" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="17" x2="28" y2="20" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="20" x2="28" y2="20" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="20" x2="20" y2="23" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function GrcIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="8" y="6" width="24" height="28" rx="3" stroke="#A1A1AA" strokeWidth="1.5" opacity="0.6" />
      <line x1="14" y1="13" x2="26" y2="13" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="14" y1="19" x2="26" y2="19" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="14" y1="25" x2="21" y2="25" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

