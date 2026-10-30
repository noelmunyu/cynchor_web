import React from 'react';

export function SegmentedNetworkDiagram({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} role="img" aria-label="Segmented virtual network trust zones diagram">
      <svg
        viewBox="0 0 900 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-text select-none"
      >
        <defs>
          <linearGradient id="netGrad" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EA694B" />
            <stop offset="50%" stopColor="#17ABA9" />
            <stop offset="100%" stopColor="#17ABA9" />
          </linearGradient>

          <linearGradient id="flowRed" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#EA694B" />
            <stop offset="100%" stopColor="#EA694B" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="flowTeal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#17ABA9" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#17ABA9" />
          </linearGradient>
        </defs>

        {/* ZONE 1: ATTACKER ZONE (Coral-accented) */}
        <g id="zone-attacker">
          <rect
            x="20"
            y="40"
            width="200"
            height="270"
            rx="14"
            fill="#111114"
            stroke="#EA694B"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="35" y="68" fill="#EA694B" fontFamily="Lexend, sans-serif" fontSize="12" fontWeight="600" letterSpacing="0.04em">
            ATTACKER ZONE
          </text>
          <text x="35" y="85" fill="#A1A1AA" fontFamily="monospace" fontSize="9">
            VLAN 100 • 10.240.100.0/24
          </text>

          {/* Node: Kali / Recon */}
          <rect x="35" y="105" width="170" height="50" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1.5" />
          <circle cx="50" cy="130" r="5" fill="#EA694B" />
          <text x="65" y="126" fill="#E5E6E6" fontSize="11" fontFamily="Lexend, sans-serif" fontWeight="500">
            Recon Pod (Kali)
          </text>
          <text x="65" y="140" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            LDAP harvester
          </text>

          {/* Node: GoPhish */}
          <rect x="35" y="170" width="170" height="50" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1.5" />
          <circle cx="50" cy="195" r="5" fill="#EA694B" />
          <text x="65" y="191" fill="#E5E6E6" fontSize="11" fontFamily="Lexend, sans-serif" fontWeight="500">
            GoPhish Engine
          </text>
          <text x="65" y="205" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            Synthetic email dispatch
          </text>

          {/* Node: C2 Endpoint */}
          <rect x="35" y="235" width="170" height="50" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1.5" />
          <circle cx="50" cy="260" r="5" fill="#A1A1AA" />
          <text x="65" y="256" fill="#E5E6E6" fontSize="11" fontFamily="Lexend, sans-serif" fontWeight="500">
            Controlled C2 Listener
          </text>
          <text x="65" y="270" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            Isolated payload port
          </text>
        </g>

        {/* BOUNDARY ARROWS / FIREWALL 1 */}
        <g id="boundary-1">
          <line x1="225" y1="175" x2="255" y2="175" stroke="#EA694B" strokeWidth="2" strokeLinecap="round" />
          <polygon points="255,175 248,171 248,179" fill="#EA694B" />
          <text x="215" y="160" fill="#A1A1AA" fontSize="8" fontFamily="monospace">
            INGRESS
          </text>
        </g>

        {/* ZONE 2: PERIMETER DMZ (Neutral outline) */}
        <g id="zone-dmz">
          <rect
            x="260"
            y="40"
            width="170"
            height="270"
            rx="14"
            fill="#111114"
            stroke="#26262C"
            strokeWidth="1.5"
          />
          <text x="275" y="68" fill="#E5E6E6" fontFamily="Lexend, sans-serif" fontSize="12" fontWeight="600" letterSpacing="0.04em">
            PERIMETER DMZ
          </text>
          <text x="275" y="85" fill="#A1A1AA" fontFamily="monospace" fontSize="9">
            VLAN 10 • Gateway
          </text>

          {/* Node: Reverse Proxy */}
          <rect x="275" y="115" width="140" height="60" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1.5" />
          <circle cx="290" cy="145" r="5" fill="#17ABA9" />
          <text x="305" y="138" fill="#E5E6E6" fontSize="11" fontFamily="Lexend, sans-serif" fontWeight="500">
            Reverse Proxy
          </text>
          <text x="305" y="153" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            WAF &amp; TLS termination
          </text>

          {/* Node: Mail Gateway */}
          <rect x="275" y="195" width="140" height="60" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1.5" />
          <circle cx="290" cy="225" r="5" fill="#17ABA9" />
          <text x="305" y="218" fill="#E5E6E6" fontSize="11" fontFamily="Lexend, sans-serif" fontWeight="500">
            Mail Gateway
          </text>
          <text x="305" y="233" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            SPF/DKIM/DMARC
          </text>
        </g>

        {/* BOUNDARY ARROWS / FIREWALL 2 */}
        <g id="boundary-2">
          <line x1="435" y1="175" x2="465" y2="175" stroke="#17ABA9" strokeWidth="2" strokeLinecap="round" />
          <polygon points="465,175 458,171 458,179" fill="#17ABA9" />
          <text x="435" y="160" fill="#A1A1AA" fontSize="8" fontFamily="monospace">
            FILTERED
          </text>
        </g>

        {/* ZONE 3: INTERNAL CORE TARGETS */}
        <g id="zone-internal">
          <rect
            x="470"
            y="40"
            width="190"
            height="270"
            rx="14"
            fill="#111114"
            stroke="#26262C"
            strokeWidth="1.5"
          />
          <text x="485" y="68" fill="#E5E6E6" fontFamily="Lexend, sans-serif" fontSize="12" fontWeight="600" letterSpacing="0.04em">
            INTERNAL NETWORK
          </text>
          <text x="485" y="85" fill="#A1A1AA" fontFamily="monospace" fontSize="9">
            fintechcorp.local
          </text>

          {/* Node: Domain Controller */}
          <rect x="485" y="105" width="160" height="50" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1.5" />
          <circle cx="500" cy="130" r="5" fill="#E5E6E6" />
          <text x="515" y="126" fill="#E5E6E6" fontSize="11" fontFamily="Lexend, sans-serif" fontWeight="500">
            Active Directory
          </text>
          <text x="515" y="140" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            dc01.fintechcorp.local
          </text>

          {/* Node: Target Mailbox */}
          <rect x="485" y="170" width="160" height="50" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1.5" />
          <circle cx="500" cy="195" r="5" fill="#17ABA9" />
          <text x="515" y="191" fill="#E5E6E6" fontSize="11" fontFamily="Lexend, sans-serif" fontWeight="500">
            HR Target Inbox
          </text>
          <text x="515" y="205" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            hr@fintechcorp.local
          </text>

          {/* Node: Database / File Core */}
          <rect x="485" y="235" width="160" height="50" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1.5" />
          <circle cx="500" cy="260" r="5" fill="#A1A1AA" />
          <text x="515" y="256" fill="#E5E6E6" fontSize="11" fontFamily="Lexend, sans-serif" fontWeight="500">
            App &amp; File Server
          </text>
          <text x="515" y="270" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            Synthetic payroll data
          </text>
        </g>

        {/* TELEMETRY FEED ARROWS TO SOC */}
        <g id="boundary-3">
          <line x1="665" y1="175" x2="695" y2="175" stroke="#17ABA9" strokeWidth="2" strokeLinecap="round" />
          <polygon points="695,175 688,171 688,179" fill="#17ABA9" />
          <text x="665" y="160" fill="#17ABA9" fontSize="8" fontFamily="monospace">
            TELEMETRY
          </text>
        </g>

        {/* ZONE 4: BLUE DEFENSIVE / SOC MONITORING (Teal-accented) */}
        <g id="zone-soc">
          <rect
            x="700"
            y="40"
            width="180"
            height="270"
            rx="14"
            fill="#111114"
            stroke="#17ABA9"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="715" y="68" fill="#17ABA9" fontFamily="Lexend, sans-serif" fontSize="12" fontWeight="600" letterSpacing="0.04em">
            SOC / BLUE ZONE
          </text>
          <text x="715" y="85" fill="#A1A1AA" fontFamily="monospace" fontSize="9">
            VLAN 200 • 10.240.200.0/24
          </text>

          {/* Node: SIEM */}
          <rect x="715" y="105" width="150" height="50" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1.5" />
          <circle cx="730" cy="130" r="5" fill="#17ABA9" />
          <text x="745" y="126" fill="#E5E6E6" fontSize="11" fontFamily="Lexend, sans-serif" fontWeight="500">
            SIEM Collector
          </text>
          <text x="745" y="140" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            Real-time event index
          </text>

          {/* Node: Header Inspector */}
          <rect x="715" y="170" width="150" height="50" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1.5" />
          <circle cx="730" cy="195" r="5" fill="#17ABA9" />
          <text x="745" y="191" fill="#E5E6E6" fontSize="11" fontFamily="Lexend, sans-serif" fontWeight="500">
            Header Inspector
          </text>
          <text x="745" y="205" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            Mail envelope parsing
          </text>

          {/* Node: Incident Desk */}
          <rect x="715" y="235" width="150" height="50" rx="8" fill="#17171B" stroke="#26262C" strokeWidth="1.5" />
          <circle cx="730" cy="260" r="5" fill="#17ABA9" />
          <text x="745" y="256" fill="#E5E6E6" fontSize="11" fontFamily="Lexend, sans-serif" fontWeight="500">
            Containment Desk
          </text>
          <text x="745" y="270" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
            Automated host isolate
          </text>
        </g>

        {/* Bottom Hypervisor SDN Base Strip */}
        <rect x="20" y="325" width="860" height="24" rx="6" fill="#17171B" stroke="#26262C" strokeWidth="1" />
        <circle cx="35" cy="337" r="3" fill="#17ABA9" />
        <text x="45" y="341" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
          PROXMOX VE 8.x SDN • ISOLATED LINUX BRIDGES &amp; FIREWALL ACL POLICIES • ZERO PRODUCTION LEAKAGE
        </text>
      </svg>
    </div>
  );
}

export default SegmentedNetworkDiagram;

