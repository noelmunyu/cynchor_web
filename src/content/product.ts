export interface AudienceItem {
  id: string;
  tabLabel: string;
  title: string;
  description: string;
  outcomes: string[];
  productView: string[];
}

export interface RoadmapItem {
  stage: 'live-v1' | 'planned-v2' | 'later';
  title: string;
  badge: string;
  badgeType: 'teal' | 'coral' | 'muted';
  items: string[];
}

export const PRODUCT_CONTENT = {
  hero: {
    headline: 'Practice the attack. Prove the defense.',
    subtitle: 'Live, adversarial red-vs-blue cyber range training engineered for real-time skill development in safe synthetic environments.',
    primaryCta: 'Test Our Product',
    primaryHref: '/demo/login',
    secondaryCta: 'Request a pilot',
    secondaryHref: '#pilot-form',
  },
  metrics: [
    {
      label: 'Time to Detect (MTTD)',
      value: '12s',
      explanation: 'Average elapsed seconds from synthetic adversary payload execution to defender SOC alert generation.',
      caption: 'Illustrative (synthetic data)',
    },
    {
      label: 'Time to Contain (MTTC)',
      value: '32s',
      explanation: 'Duration from first anomalous indicator detection to host network isolation and ticket revocation.',
      caption: 'Illustrative (synthetic data)',
    },
    {
      label: 'Techniques Exercised',
      value: '4 MITRE Techniques',
      explanation: 'Verified ATT&CK techniques actively stimulated during the live simulation scenario.',
      caption: 'Illustrative (synthetic data)',
    },
    {
      label: 'Techniques Missed',
      value: '1 Technique (T1087)',
      explanation: 'Adversary steps that bypassed perimeter telemetry without generating a high-confidence triage alert.',
      caption: 'Illustrative (synthetic data)',
    },
  ],
  audiences: [
    {
      id: 'learners',
      tabLabel: 'For Learners',
      title: 'Real adversary telemetry without the textbook abstraction',
      description: 'Step into a working SOC environment where every command generates observable forensic artifacts.',
      outcomes: [
        'Read real RFC 822 email headers and correlate living-off-the-land script telemetry.',
        'Execute surgical endpoint containment before adversary lateral pivots reach domain controllers.',
        'Build documented, verifiable operational track records with transparent skill radars.',
      ],
      productView: [
        'Interactive triage queue with SLA timers',
        'Live terminal inspecting simulated host minidumps',
        'Personal progression radar across 6 core operational competencies',
      ],
    },
    {
      id: 'instructors',
      tabLabel: 'For Instructors',
      title: 'Run synchronized cohort exercises with total session control',
      description: 'Guide classes through structured scenarios with live session pausing, throttled speed, and custom synthetic injects.',
      outcomes: [
        'Monitor up to 4 squads simultaneously on a unified cohort grid with live containment status.',
        'Introduce tactical friction at critical moments (e.g., alert storms, noisy scanning decoys).',
        'Lead evidence-based post-round debriefs with scrubbable event markers and timeline review.',
      ],
      productView: [
        'Game Master control console with 0.5x–4x timeline speed',
        'Multi-squad leaderboard tracking detection latency and containment success',
        'Scrubbable event timeline pinpointing missed indicators and late escalations',
      ],
    },
    {
      id: 'security-leads',
      tabLabel: 'For Security Leads',
      title: 'Stress-test response playbooks against verified adversary tactics',
      description: 'Benchmark defensive agility and communication workflows against structured MITRE ATT&CK technique sequences.',
      outcomes: [
        'Measure team detection and containment latency without risking production infrastructure.',
        'Identify visibility blind spots where offensive maneuvers bypass standard SIEM correlation rules.',
        'Strengthen inter-team handoffs between Tier 1 triage, threat hunters, and network engineers.',
      ],
      productView: [
        'Objective attack vs defense scoring matrix',
        'Pipeline ingest latency analysis and telemetry gap breakdown',
        'Structured incident retrospective reports with actionable remediation priorities',
      ],
    },
  ] as AudienceItem[],
  architecture: {
    v1: {
      title: 'Live V1 Range (Current Production)',
      badge: 'Live in V1',
      description: 'Proxmox-based on-premise hypervisor infrastructure running dedicated, isolated virtual machines with synthetic datasets only.',
      points: [
        'Isolated private bridge networking with zero production route peering.',
        'All entities, credentials, and email records restricted to synthetic domain fintechcorp.local.',
        'Operator-provisioned, invite-only access governed by single-use 256-bit hashed tokens.',
        'Append-only audit logging with privacy-preserving one-way SHA-256 IP hashing.',
      ],
    },
    v2: {
      title: 'Planned V2 Cloud Architecture',
      badge: 'Upcoming (V2)',
      note: "System Architecture: Coming soon — we're still building and not yet integrated with AWS.",
      description: 'Scalable multi-tenant cloud cyber range designed for on-demand lab dispatching and browser-based access.',
      points: [
        'Browser-based access is planned for zero-footprint student workstations (nothing installed locally).',
        'Zero agent footprint or compute overhead claimed on client machines.',
        'Automated cloud lab teardown and micro-segmented training enclaves.',
      ],
    },
  },
  roadmap: [
    {
      stage: 'live-v1',
      title: 'Live Now (V1)',
      badge: 'Live in V1',
      badgeType: 'teal',
      items: [
        'Proxmox VE isolated training range',
        'Synthetic directory & email simulation (fintechcorp.local)',
        'Red vs Blue deterministic battle scenarios',
        'Triage workstation mini-game with 6-axis skill radar',
        'Operator invite system & append-only audit logging',
      ],
    },
    {
      stage: 'planned-v2',
      title: 'Planned (V2)',
      badge: 'Upcoming (V2)',
      badgeType: 'coral',
      items: [
        'AWS-hosted on-demand scalable cyber range',
        'Facilitator-led live multi-squad cohort console',
        'Automated adversary bot playbook runner',
        'Browser-based in-range interactive student terminals',
        'Self-service 3-tier deterministic hint ladder',
      ],
    },
    {
      stage: 'later',
      title: 'Future Roadmap',
      badge: 'Later',
      badgeType: 'muted',
      items: [
        'Governance, Risk & Compliance (GRC) module — Coming soon',
        'Custom student scenario authoring studio',
        'Third-party SIEM forwarder connectors',
      ],
    },
  ] as RoadmapItem[],
};

