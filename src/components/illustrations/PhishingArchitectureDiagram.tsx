import React from 'react';

export function PhishingArchitectureDiagram({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} role="img" aria-label="Conceptual phishing training flow diagram">
      <svg
        viewBox="0 0 920 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-text select-none"
      >
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="920" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EA694B" />
            <stop offset="50%" stopColor="#EA694B" />
            <stop offset="50%" stopColor="#17ABA9" />
            <stop offset="100%" stopColor="#17ABA9" />
          </linearGradient>
        </defs>

        {/* STEP 1: RED OPERATOR (Sticky Card 1 - Coral) */}
        <g id="step-red-operator">
          <rect x="20" y="50" width="165" height="210" rx="12" fill="#111114" stroke="#EA694B" strokeWidth="1.5" />
          <rect x="35" y="42" width="60" height="16" rx="4" fill="#EA694B" />
          <text x="42" y="54" fill="#09090B" fontSize="9" fontFamily="Lexend, sans-serif" fontWeight="700">
            STEP 01
          </text>
          
          <text x="35" y="85" fill="#EA694B" fontFamily="Lexend, sans-serif" fontSize="13" fontWeight="600">
            Red Operator
          </text>
          <text x="35" y="105" fill="#A1A1AA" fontSize="10" fontFamily="sans-serif">
            Reconnaissance:
          </text>
          <text x="35" y="122" fill="#E5E6E6" fontSize="10" fontFamily="monospace">
            • Query LDAP tree
          </text>
          <text x="35" y="138" fill="#E5E6E6" fontSize="10" fontFamily="monospace">
            • Identify HR &amp; IT
          </text>
          <text x="35" y="154" fill="#E5E6E6" fontSize="10" fontFamily="monospace">
            • Craft lookalike lure
          </text>

          <rect x="35" y="175" width="135" height="65" rx="6" fill="#17171B" stroke="#26262C" strokeWidth="1" />
          <text x="45" y="195" fill="#EA694B" fontSize="9" fontFamily="monospace" fontWeight="600">
            TOOL: GoPhish
          </text>
          <text x="45" y="210" fill="#A1A1AA" fontSize="8" fontFamily="monospace">
            Template: IT Upgrade
          </text>
          <text x="45" y="224" fill="#A1A1AA" fontSize="8" fontFamily="monospace">
            Spoof: support.local
          </text>
        </g>

        {/* CONNECTOR 1 -> 2 */}
        <g id="arrow-1-2">
          <line x1="190" y1="155" x2="225" y2="155" stroke="#EA694B" strokeWidth="2" strokeLinecap="round" />
          <polygon points="225,155 217,151 217,159" fill="#EA694B" />
          <text x="195" y="145" fill="#EA694B" fontSize="8" fontFamily="monospace">
            DISPATCH
          </text>
        </g>

        {/* STEP 2: CRAFTED EMAIL LURE */}
        <g id="step-crafted-email">
          <rect x="230" y="50" width="165" height="210" rx="12" fill="#111114" stroke="#26262C" strokeWidth="1.5" />
          <rect x="245" y="42" width="60" height="16" rx="4" fill="#26262C" />
          <text x="252" y="54" fill="#E5E6E6" fontSize="9" fontFamily="Lexend, sans-serif" fontWeight="700">
            STEP 02
          </text>

          <text x="245" y="85" fill="#E5E6E6" fontFamily="Lexend, sans-serif" fontSize="13" fontWeight="600">
            Crafted Email
          </text>
          
          <rect x="245" y="100" width="135" height="140" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1" />
          <text x="255" y="120" fill="#A1A1AA" fontSize="8" fontFamily="monospace">
            From: it-desk@corp
          </text>
          <text x="255" y="135" fill="#A1A1AA" fontSize="8" fontFamily="monospace">
            Subj: Urgent Reset
          </text>
          <line x1="255" y1="145" x2="365" y2="145" stroke="#26262C" strokeWidth="1" />
          <text x="255" y="165" fill="#E5E6E6" fontSize="9" fontFamily="sans-serif">
            Synthetic payload lure:
          </text>
          <rect x="255" y="175" width="115" height="20" rx="4" fill="#26262C" />
          <text x="263" y="189" fill="#EA694B" fontSize="8" fontFamily="monospace">
            portal.fintechcorp.local
          </text>
          <text x="255" y="215" fill="#A1A1AA" fontSize="8" fontFamily="monospace">
            SPF: SoftFail / Align: No
          </text>
        </g>

        {/* CONNECTOR 2 -> 3 */}
        <g id="arrow-2-3">
          <line x1="400" y1="155" x2="435" y2="155" stroke="#26262C" strokeWidth="2" strokeLinecap="round" />
          <polygon points="435,155 427,151 427,159" fill="#A1A1AA" />
          <text x="403" y="145" fill="#A1A1AA" fontSize="8" fontFamily="monospace">
            INBOX
          </text>
        </g>

        {/* STEP 3: TARGET (hr@fintechcorp.local) */}
        <g id="step-target">
          <rect x="440" y="40" width="160" height="230" rx="12" fill="#111114" stroke="#17ABA9" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="455" y="32" width="70" height="16" rx="4" fill="#17ABA9" />
          <text x="462" y="44" fill="#09090B" fontSize="9" fontFamily="Lexend, sans-serif" fontWeight="700">
            TARGET BOX
          </text>

          <text x="455" y="75" fill="#17ABA9" fontFamily="Lexend, sans-serif" fontSize="13" fontWeight="600">
            hr@fintechcorp.local
          </text>
          <text x="455" y="92" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            Synthetic Target Endpoint
          </text>

          {/* Mailbox illustration */}
          <rect x="455" y="110" width="130" height="70" rx="6" fill="#17171B" stroke="#26262C" strokeWidth="1" />
          <circle cx="475" cy="130" r="6" fill="#17ABA9" />
          <text x="490" y="133" fill="#E5E6E6" fontSize="9" fontFamily="sans-serif" fontWeight="500">
            User Inbox
          </text>
          <text x="465" y="155" fill="#A1A1AA" fontSize="8" fontFamily="sans-serif">
            Simulated employee
          </text>
          <text x="465" y="168" fill="#17ABA9" fontSize="8" fontFamily="monospace">
            User Report Triggered
          </text>

          {/* Arrow down to report */}
          <rect x="455" y="195" width="130" height="55" rx="6" fill="#17171B" stroke="#17ABA9" strokeWidth="1" />
          <text x="465" y="215" fill="#17ABA9" fontSize="9" fontFamily="Lexend, sans-serif" fontWeight="600">
            REPORT BUTTON
          </text>
          <text x="465" y="232" fill="#A1A1AA" fontSize="8" fontFamily="monospace">
            Ingest to SOC Queue
          </text>
        </g>

        {/* CONNECTOR 3 -> 4 */}
        <g id="arrow-3-4">
          <line x1="605" y1="155" x2="640" y2="155" stroke="#17ABA9" strokeWidth="2" strokeLinecap="round" />
          <polygon points="640,155 632,151 632,159" fill="#17ABA9" />
          <text x="607" y="145" fill="#17ABA9" fontSize="8" fontFamily="monospace">
            TRIAGE
          </text>
        </g>

        {/* STEP 4: BLUE ANALYST INSPECTION */}
        <g id="step-blue-analyst">
          <rect x="645" y="50" width="165" height="210" rx="12" fill="#111114" stroke="#17ABA9" strokeWidth="1.5" />
          <rect x="660" y="42" width="60" height="16" rx="4" fill="#17ABA9" />
          <text x="667" y="54" fill="#09090B" fontSize="9" fontFamily="Lexend, sans-serif" fontWeight="700">
            STEP 04
          </text>

          <text x="660" y="85" fill="#17ABA9" fontFamily="Lexend, sans-serif" fontSize="13" fontWeight="600">
            Blue Analyst
          </text>
          
          <text x="660" y="105" fill="#A1A1AA" fontSize="10" fontFamily="sans-serif">
            Inspection Tasks:
          </text>
          <text x="660" y="122" fill="#E5E6E6" fontSize="10" fontFamily="monospace">
            • RFC822 mail headers
          </text>
          <text x="660" y="138" fill="#E5E6E6" fontSize="10" fontFamily="monospace">
            • Return-Path anomaly
          </text>
          <text x="660" y="154" fill="#E5E6E6" fontSize="10" fontFamily="monospace">
            • Domain reputation
          </text>

          <rect x="660" y="170" width="135" height="70" rx="6" fill="#17171B" stroke="#26262C" strokeWidth="1" />
          <text x="670" y="190" fill="#17ABA9" fontSize="9" fontFamily="monospace" fontWeight="600">
            SPF/DKIM/DMARC:
          </text>
          <text x="670" y="205" fill="#EA694B" fontSize="8" fontFamily="monospace">
            DKIM: Fail / No Sig
          </text>
          <text x="670" y="220" fill="#17ABA9" fontSize="8" fontFamily="monospace">
            Verdict: PHISHING
          </text>
        </g>

        {/* CONNECTOR 4 -> 5 */}
        <g id="arrow-4-5">
          <line x1="815" y1="155" x2="840" y2="155" stroke="#17ABA9" strokeWidth="2" strokeLinecap="round" />
          <polygon points="840,155 832,151 832,159" fill="#17ABA9" />
        </g>

        {/* STEP 5: SOC ALERTING & CONTAINMENT */}
        <g id="step-soc-containment">
          <rect x="845" y="70" width="60" height="170" rx="10" fill="#111114" stroke="#17ABA9" strokeWidth="1.5" />
          <text x="865" y="125" fill="#17ABA9" fontFamily="Lexend, sans-serif" fontSize="11" fontWeight="700" transform="rotate(90 865 125)">
            SOC ALERT
          </text>
          <circle cx="875" cy="95" r="4" fill="#17ABA9" />
          <circle cx="875" cy="215" r="4" fill="#17ABA9" />
        </g>

        {/* Label banner */}
        <rect x="20" y="295" width="885" height="26" rx="6" fill="#17171B" stroke="#26262C" strokeWidth="1" />
        <text x="35" y="312" fill="#A1A1AA" fontSize="10" fontFamily="monospace">
          ILLUSTRATIVE TRAINING ARCHITECTURE, NOT A LIVE CONNECTED SYSTEM • CLOSED SYNTHETIC DOMAIN
        </text>
      </svg>
    </div>
  );
}

export default PhishingArchitectureDiagram;

