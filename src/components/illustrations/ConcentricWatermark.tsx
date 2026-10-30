import React from 'react';

export function ConcentricWatermark({ className = '' }: { className?: string }) {
  // Faint concentric-arc motif echoing the logo's anchor/arc geometry (~4% opacity)
  return (
    <div
      className={`pointer-events-none absolute select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        width="800"
        height="800"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-[0.035] text-text"
      >
        <defs>
          <linearGradient id="wmGrad" x1="400" y1="100" x2="400" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#17ABA9" />
            <stop offset="100%" stopColor="#EA694B" />
          </linearGradient>
        </defs>

        {/* Outer concentric circles and arcs */}
        <circle cx="400" cy="400" r="360" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="400" cy="400" r="280" stroke="url(#wmGrad)" strokeWidth="2" />
        <circle cx="400" cy="400" r="200" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="400" cy="400" r="120" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Central anchor-inspired vertical axis and horizontal crossbar */}
        <line x1="400" y1="80" x2="400" y2="720" stroke="url(#wmGrad)" strokeWidth="2" strokeLinecap="round" />
        <line x1="260" y1="320" x2="540" y2="320" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* Top ring */}
        <circle cx="400" cy="220" r="45" stroke="currentColor" strokeWidth="2" />

        {/* Sweeping anchor flukes */}
        <path
          d="M 220 460 C 220 620, 580 620, 580 460"
          stroke="url(#wmGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M 220 460 L 190 490" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M 580 460 L 610 490" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default ConcentricWatermark;

