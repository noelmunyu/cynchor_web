export interface TriageIndicator {
  id: string;
  label: string;
  isFlagged: boolean;
  explanation: string;
}

export interface TriageCase {
  id: string;
  caseNumber: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  slaMinutes: number;
  syntheticTimestamp: string;
  email: {
    from: string;
    to: string;
    returnPath: string;
    subject: string;
    date: string;
    spf: 'PASS' | 'FAIL' | 'NEUTRAL';
    dkim: 'PASS' | 'FAIL';
    dmarc: 'PASS' | 'FAIL';
    body: string;
    attachment?: string;
  };
  terminalOutput: string[];
  indicators: TriageIndicator[];
  correctVerdict: 'phishing' | 'legitimate' | 'escalate';
  feedback: {
    correct: string;
    incorrect: string;
  };
  incidentReportTemplate: {
    summary: string;
    recommendedAction: string;
  };
  radarImpact: {
    recon: number;
    detection: number;
    forensics: number;
    networkDefense: number;
    incidentResponse: number;
    reporting: number;
  };
}

export const INDIVIDUALS_CONTENT = {
  hero: {
    badge: 'Upcoming (V2)',
    title: 'Your shift starts now.',
    subtitle: 'Triage alerts, investigate cases, build your craft, at your own pace.',
    conceptLabel: 'Concept preview',
  },
  workstation: {
    shift: 'Shift 08:00 – 16:00 UTC',
    callsigns: ['Operator Nova', 'Sentinel Echo', 'Vanguard Lynx', 'Cipher Wraith'],
    initialRank: 'Analyst I (Tier 1)',
    initialXP: 320,
    maxRankXP: 600,
    streakDays: 4,
  },
  cases: [
    {
      id: 'case-402',
      caseNumber: 'SEC-4029',
      title: 'Urgent Direct Deposit Re-validation',
      severity: 'HIGH',
      slaMinutes: 12,
      syntheticTimestamp: '08:14:22 UTC',
      email: {
        from: 'FintechCorp Payroll <payroll-service@fintechcorp-secure.invalid>',
        to: 'sarah.jenkins@fintechcorp.local',
        returnPath: 'bounce-tracker@relay-99.mail-relay.invalid',
        subject: 'ACTION REQUIRED: Confirm Q3 Direct Deposit Bank Routing Number',
        date: 'Today at 08:12:04 UTC',
        spf: 'FAIL',
        dkim: 'FAIL',
        dmarc: 'FAIL',
        body: 'Dear Sarah,\n\nOur automated payroll synchronization detected an unverified banking profile routing discrepancy for your employee ID #FIN-8821.\n\nPlease immediately download the attached reconciliation spreadsheet (Q3_Adjustment_Form.xlsx) and re-verify your direct deposit details within 2 hours to avoid payroll release suspension.\n\nCorporate Finance Operations\nFintechCorp Enterprise Services',
        attachment: 'Q3_Adjustment_Form.xlsx (Macro-enabled Excel)',
      },
      terminalOutput: [
        'fintechcorp-soc-cli analyze-msg --msg-id MSG-99124',
        '[1] SPF Check: FAIL - 198.51.100.82 not permitted by sender domain SPF record',
        '[2] DKIM Signature: Header signature corrupted / RSA verification failed',
        '[3] Header Anomaly: Return-Path host relay-99.mail-relay.invalid mismatch with From field',
        '[4] Sandbox Status: Macro payload matches synthetic T1566 lure pattern',
      ],
      indicators: [
        {
          id: 'ind-lookalike',
          label: 'Lookalike domain (@fintechcorp-secure.invalid instead of fintechcorp.local)',
          isFlagged: true,
          explanation: 'External adversary registered typo-squatted domain mimicking legitimate enterprise portal.',
        },
        {
          id: 'ind-return-path',
          label: 'Return-Path header mismatch with From address',
          isFlagged: true,
          explanation: 'Bounces route to external untrusted relay: bounce-tracker@relay-99.mail-relay.invalid.',
        },
        {
          id: 'ind-spf-dkim',
          label: 'SPF and DKIM cryptographic validation failed',
          isFlagged: true,
          explanation: 'Sending host has zero authorized records in enterprise DNS zone.',
        },
        {
          id: 'ind-urgency',
          label: 'Urgent language coercion ("within 2 hours or deposit suspended")',
          isFlagged: true,
          explanation: 'Social engineering urgency tactic to compel user into running the attached macro spreadsheet.',
        },
      ],
      correctVerdict: 'phishing',
      feedback: {
        correct: 'Excellent triage! You flagged the typo-squatted domain, header mismatch, SPF failure, and coercive urgency before any credentials or payloads could compromise the host.',
        incorrect: 'Incorrect assessment. Notice the synthetic external domain (@fintechcorp-secure.invalid) and failed cryptographic authentication headers.',
      },
      incidentReportTemplate: {
        summary: 'Targeted spearphishing campaign impersonating payroll administration delivering weaponized macro attachment. Attacker attempted credential lure and initial execution.',
        recommendedAction: 'Quarantine message across all enterprise mailboxes, blacklist sending relay IP 198.51.100.82, and submit attachment hash to EDR blocklist.',
      },
      radarImpact: {
        recon: 10,
        detection: 35,
        forensics: 25,
        networkDefense: 15,
        incidentResponse: 30,
        reporting: 20,
      },
    },
    {
      id: 'case-403',
      caseNumber: 'SEC-4030',
      title: 'Scheduled Hypervisor Maintenance Window',
      severity: 'LOW',
      slaMinutes: 45,
      syntheticTimestamp: '08:26:01 UTC',
      email: {
        from: 'IT Infrastructure Operations <it-notifications@fintechcorp.local>',
        to: 'engineering-all@fintechcorp.local',
        returnPath: 'it-notifications@fintechcorp.local',
        subject: 'NOTICE: Planned Proxmox VE Cluster SDN Maintenance Sunday 02:00-04:00 UTC',
        date: 'Today at 08:24:55 UTC',
        spf: 'PASS',
        dkim: 'PASS',
        dmarc: 'PASS',
        body: 'Hi Team,\n\nThis is a standard announcement regarding our bi-weekly virtualization maintenance window on Sunday from 02:00 to 04:00 UTC. Secondary SDN gateways will handle failover.\n\nNo operator action or credential re-entry is required. For questions, see internal wiki documentation at https://wiki.fintechcorp.local/sdn-ops.\n\nInfrastructure Operations Team',
      },
      terminalOutput: [
        'fintechcorp-soc-cli analyze-msg --msg-id MSG-99125',
        '[1] SPF Check: PASS - Internal gateway IP 10.0.1.10 is authorized',
        '[2] DKIM Signature: PASS - Verified with d=fintechcorp.local key',
        '[3] DMARC Policy: PASS (p=reject, disposition=none)',
        '[4] URL Destination: Internal RFC 1918 enterprise intranet zone only',
      ],
      indicators: [
        {
          id: 'ind-lookalike',
          label: 'Lookalike domain (@fintechcorp-secure.invalid instead of fintechcorp.local)',
          isFlagged: false,
          explanation: 'Sender domain fintechcorp.local is the exact legitimate internal enterprise domain.',
        },
        {
          id: 'ind-return-path',
          label: 'Return-Path header mismatch with From address',
          isFlagged: false,
          explanation: 'Return-path matches sender address identically.',
        },
        {
          id: 'ind-spf-dkim',
          label: 'SPF and DKIM cryptographic validation failed',
          isFlagged: false,
          explanation: 'Both SPF and DKIM pass cryptographic verification.',
        },
        {
          id: 'ind-urgency',
          label: 'Urgent language coercion',
          isFlagged: false,
          explanation: 'Informational broadcast with no urgency or requests for action/passwords.',
        },
      ],
      correctVerdict: 'legitimate',
      feedback: {
        correct: 'Accurate triage! Valid cryptographic signatures, authentic sender headers, and no malicious call-to-actions confirm this is legitimate internal operations communication.',
        incorrect: 'Incorrect verdict. This email passed all SPF, DKIM, and DMARC verifications and contained no malicious links or credential forms.',
      },
      incidentReportTemplate: {
        summary: 'Routine operational advisory broadcast from internal IT operations. Fully verified through cryptographic signing and authorized gateway routing.',
        recommendedAction: 'Close ticket as benign / false positive alert. No quarantine or defensive rules required.',
      },
      radarImpact: {
        recon: 5,
        detection: 20,
        forensics: 15,
        networkDefense: 10,
        incidentResponse: 15,
        reporting: 25,
      },
    },
  ] as TriageCase[],
  careerLadder: [
    {
      level: 'Tier 1',
      rank: 'Analyst I',
      badge: 'Beginner',
      xpRequired: '0 – 1,000 XP',
      unlocks: 'Triage queue, email header analysis, basic indicator tagging, single-host SDN isolation',
    },
    {
      level: 'Tier 2',
      rank: 'Analyst II',
      badge: 'Intermediate',
      xpRequired: '1,000 – 3,500 XP',
      unlocks: 'Multi-stage MITRE kill chain correlation, memory volatility analysis, SMB pivot containment, custom YARA rules',
    },
    {
      level: 'Tier 3',
      rank: 'Lead Analyst',
      badge: 'Expert',
      xpRequired: '3,500+ XP',
      unlocks: 'Adversary campaign attribution, live Red vs Blue live-fire scenarios, custom range scenario authoring',
    },
  ],
  ladderDisclaimer: 'Rank names and tier levels are gamification progression markers only, not formal industry credentials or job placement guarantees.',
  dayOnTheRange: [
    {
      step: 1,
      title: 'Brief',
      description: 'Receive threat intel brief on new synthetic adversary campaigns and active attack vectors.',
      time: '09:00',
    },
    {
      step: 2,
      title: 'Investigate',
      description: 'Inspect live telemetry, Sysmon events, and network streams to reconstruct the attack timeline.',
      time: '09:30',
    },
    {
      step: 3,
      title: 'Contain',
      description: 'Execute surgical host micro-segmentation and revoke compromised tokens in the range.',
      time: '11:15',
    },
    {
      step: 4,
      title: 'Report',
      description: 'Generate concise, structured incident report cards with verified MITRE technique mappings.',
      time: '14:00',
    },
    {
      step: 5,
      title: 'Review',
      description: 'Review end-of-shift telemetry graphs, XP gains, MTTD metrics, and skill radar evolution.',
      time: '15:45',
    },
  ],
  cta: {
    headline: 'Ready to take your first live shift?',
    sub: 'Try our solo training flow in the live V1 demo today.',
    buttonLabel: 'Learn alone in the demo',
    href: '/demo/login',
  },
};

