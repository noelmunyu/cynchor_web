import React from 'react';

interface LobbyProps {
  slotsCount?: number;
  maxSlots?: number;
  side?: 'RED' | 'BLUE';
  isMatched?: boolean;
}

export function LobbyMatchmakingIllustration({
  slotsCount = 3,
  maxSlots = 3,
  side = 'RED',
  isMatched = false,
}: LobbyProps) {
  const accentColor = side === 'RED' ? '#EA694B' : '#17ABA9';

  return (
    <div className="relative w-full py-4 select-none" role="img" aria-label="Squad lobby slots and matchmaking radar">
      <svg viewBox="0 0 540 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
          <linearGradient id="lobbyGrad" x1="0" y1="0" x2="540" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EA694B" />
            <stop offset="100%" stopColor="#17ABA9" />
          </linearGradient>
        </defs>

        {/* Outer container */}
        <rect x="10" y="10" width="520" height="160" rx="14" fill="#111114" stroke="#26262C" strokeWidth="1.5" />

        {/* 3 Squad Roster Slots */}
        {[0, 1, 2].map((idx) => {
          const filled = idx < slotsCount;
          const slotX = 30 + idx * 115;
          return (
            <g key={idx} id={`slot-${idx}`}>
              <rect
                x={slotX}
                y="30"
                width="100"
                height="120"
                rx="10"
                fill="#17171B"
                stroke={filled ? accentColor : '#26262C'}
                strokeWidth={filled ? 1.75 : 1}
                strokeDasharray={filled ? undefined : '4 4'}
              />
              {filled ? (
                <>
                  <circle cx={slotX + 50} cy="65" r="18" fill={`${accentColor}20`} stroke={accentColor} strokeWidth="1.5" />
                  <text x={slotX + 50} y="70" fill={accentColor} fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="Lexend, sans-serif">
                    OP-{idx + 1}
                  </text>
                  <text x={slotX + 50} y="105" fill="#E5E6E6" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="Lexend, sans-serif">
                    READY
                  </text>
                  <text x={slotX + 50} y="122" fill="#A1A1AA" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    {side} SQUAD
                  </text>
                </>
              ) : (
                <>
                  <circle cx={slotX + 50} cy="65" r="18" fill="none" stroke="#26262C" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x={slotX + 50} y="70" fill="#A1A1AA" fontSize="12" textAnchor="middle" fontFamily="monospace">
                    +
                  </text>
                  <text x={slotX + 50} y="110" fill="#A1A1AA" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
                    Waiting...
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Divider / Match Status Section */}
        <line x1="390" y1="25" x2="390" y2="155" stroke="#26262C" strokeWidth="1.5" />

        {/* Radar / Match Found Visualization */}
        <g id="radar-section">
          {isMatched ? (
            <>
              <circle cx="455" cy="75" r="32" fill="#17ABA915" stroke="#17ABA9" strokeWidth="2" />
              <polygon points="455,55 465,75 445,75" fill="#EA694B" />
              <circle cx="455" cy="85" r="6" fill="#17ABA9" />
              <text x="455" y="125" fill="#17ABA9" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="Lexend, sans-serif">
                MATCH PAIRED
              </text>
              <text x="455" y="140" fill="#A1A1AA" fontSize="9" textAnchor="middle" fontFamily="monospace">
                Red vs Blue 1v1
              </text>
            </>
          ) : (
            <>
              <circle cx="455" cy="75" r="32" fill="none" stroke="#26262C" strokeWidth="1.5" />
              <circle cx="455" cy="75" r="20" fill="none" stroke="#26262C" strokeWidth="1.5" strokeDasharray="2 2" />
              <line x1="455" y1="75" x2="475" y2="60" stroke={accentColor} strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="455" cy="75" r="3" fill={accentColor} />
              <text x="455" y="125" fill="#E5E6E6" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="Lexend, sans-serif">
                Searching Queue
              </text>
              <text x="455" y="140" fill="#A1A1AA" fontSize="8" textAnchor="middle" fontFamily="monospace">
                Quorum: 3+ Operatives
              </text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}

export default LobbyMatchmakingIllustration;

