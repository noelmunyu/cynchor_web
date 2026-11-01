export interface BenefitCard {
  id: string;
  title: string;
  attackerSkill: string;
  defenderMirror: string;
  icon: string;
}

export interface RoleLane {
  id: string;
  title: string;
  badge: string;
  badgeType: 'coral' | 'teal' | 'neutral' | 'muted';
  description: string;
  skills: string[];
  isComingSoon?: boolean;
}

export const TEAMS_CONTENT = {
  hero: {
    badge: 'Upcoming (V2)',
    title: 'Two sides. One live range.',
    subtitle: 'Attack the network or defend it, together, in real time.',
  },
  matchmaking: {
    title: 'How Matchmaking Works',
    subtitle: 'Whether you bring a complete squad or drop into the queue, the range balances team sizes before launching the exercise.',
    chips: [
      '3+ players per squad',
      'Red vs Blue',
      'Role pre-selects your side, and you can switch',
    ],
    disclaimer: 'Experience level is saved to your profile. Illustrative client-side explainer only; platform does not claim automated skill-weighted matchmaking.',
    steps: [
      { step: 1, title: 'Join Queue', description: 'Enter via solo queue or squad lobby' },
      { step: 2, title: 'Form Squads', description: 'Minimum 3+ operators assembled per squad' },
      { step: 3, title: 'Assign Sides', description: 'Red (Attacker) and Blue (Defender) rosters locked' },
      { step: 4, title: 'Pair Match', description: 'Red squad matched against live Blue SOC squad' },
      { step: 5, title: 'Range Launch', description: 'Dedicated SDN-isolated network spun up' },
    ],
  },
  benefits: [
    {
      id: 'adversary-mindset',
      title: 'Think like the adversary',
      attackerSkill: 'Discover hidden attack surfaces and exploit chains across synthetic enterprise topology.',
      defenderMirror: 'Anticipate offensive maneuvers and close telemetry visibility gaps before pivots occur.',
      icon: 'radar',
    },
    {
      id: 'telemetry-visibility',
      title: 'See what defenders see',
      attackerSkill: 'Observe the forensic footprints, Sysmon events, and network traps left by offensive commands.',
      defenderMirror: 'Filter high-volume benign noise to isolate genuine adversary IOCs and living-off-the-land executions.',
      icon: 'shield',
    },
    {
      id: 'pressure-testing',
      title: 'Practice under pressure',
      attackerSkill: 'Execute coordinated objective timelines under active detection and host quarantine countermeasures.',
      defenderMirror: 'Coordinate rapid triage, host containment, and Kerberos ticket revocation within seconds of alerting.',
      icon: 'flame',
    },
    {
      id: 'squad-cohesion',
      title: 'Work as one squad',
      attackerSkill: 'Synchronize reconnaissance handoffs, payload delivery, and credential exploitation with teammates.',
      defenderMirror: 'Align Tier 1 triage, threat hunters, and firewall operators for unified breach containment.',
      icon: 'users',
    },
  ] as BenefitCard[],
  safetyStrip: 'Learn to attack and secure live-style systems in a safe, isolated range, with synthetic data only.',
  roleLanes: [
    {
      id: 'red-team',
      title: 'Red Team',
      badge: 'Offensive Track',
      badgeType: 'coral',
      description: 'Master offensive tactics, MITRE ATT&CK techniques, privilege escalation, and lateral movement in simulated enterprise domains.',
      skills: ['Network Reconnaissance', 'Phishing Payloads', 'Credential Harvesting', 'SMB Lateral Pivoting'],
    },
    {
      id: 'blue-team',
      title: 'Blue Team',
      badge: 'Defensive Track',
      badgeType: 'teal',
      description: 'Analyze telemetry, triage high-fidelity alerts, investigate endpoint memory, and execute SDN micro-segmentation in real time.',
      skills: ['SIEM / EDR Analysis', 'Indicator Extraction', 'Host Isolation', 'Incident Response Playbooks'],
    },
    {
      id: 'net-sec',
      title: 'Network Security',
      badge: 'Infrastructure',
      badgeType: 'neutral',
      description: 'Design defense-in-depth boundary controls, configure mail gateway threat policies, and inspect TLS handshakes across DMZ perimeters.',
      skills: ['Proxmox SDN Policies', 'Firewall Rule Tuning', 'DNS Sinkholing', 'VLAN Micro-segmentation'],
    },
    {
      id: 'grc',
      title: 'Governance, Risk & Compliance',
      badge: 'Coming soon',
      badgeType: 'muted',
      description: 'Audit log verification, compliance mapping against synthetic standard baselines, and post-exercise executive briefing reports.',
      skills: ['Audit Trail Verification', 'Risk Assessment', 'Executive Reporting', 'Evidence Collection'],
      isComingSoon: true,
    },
  ] as RoleLane[],
  cta: {
    headline: 'Experience live adversarial operations today',
    sub: 'V1 Proxmox-based cyber range is live for invite-only operator sessions.',
    buttonLabel: 'Test Our Product',
    href: '/demo/login',
  },
};

