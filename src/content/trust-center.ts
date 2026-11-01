export interface ComplianceRow {
  id: string;
  framework: string;
  description: string;
  status: 'not-certified' | 'in-progress' | 'certified';
  statusLabel: string;
  evidenceUrl?: string; // only render 'in-progress' or 'certified' if evidenceUrl is supplied
  notes: string;
}

export interface DataCollectedItem {
  table: string;
  fields: string;
  purpose: string;
  isHashed: string;
}

export interface SubprocessorItem {
  id: string;
  name: string;
  purpose: string;
  dataShared: string;
  status: string;
  isVisible: boolean;
}

export interface SecurityQuestion {
  id: string;
  question: string;
  answer: string;
  controlId?: string;
  isInPlace: boolean;
}

export interface TrustCenterContent {
  meta: {
    title: string;
    description: string;
    lastReviewed: string;
    reviewedBy: string;
  };
  posture: {
    title: string;
    sentences: string[];
  };
  compliance: {
    title: string;
    subtitle: string;
    disclaimer: string;
    rows: ComplianceRow[];
  };
  applicationSecurity: {
    title: string;
    subtitle: string;
    sdlcPractices: Array<{
      title: string;
      description: string;
    }>;
    roadmap: Array<{
      title: string;
      description: string;
    }>;
  };
  infrastructure: {
    title: string;
    subtitle: string;
    encryptionAtRestNote: string;
    baseline: Array<{
      category: string;
      detail: string;
    }>;
  };
  dataCollected: {
    title: string;
    subtitle: string;
    items: DataCollectedItem[];
    plainSummary: string;
    retentionNote: string;
    hostingRegion?: string; // hidden until owner confirms
    aiDisclosure: string;
  };
  subprocessors: {
    title: string;
    subtitle: string;
    roster: SubprocessorItem[];
    noVendorsStatement: string;
  };
  accessControl: {
    title: string;
    subtitle: string;
    principles: Array<{
      title: string;
      detail: string;
    }>;
  };
  incidentResponse: {
    title: string;
    subtitle: string;
    contactEmail: string;
    securityTxtUrl: string;
    responseTargetsNote: string;
    acknowledgementTarget?: string; // rendered only if supplied
    triageTarget?: string; // rendered only if supplied
    guidelines: string[];
  };
  quickAnswers: {
    title: string;
    subtitle: string;
    questions: SecurityQuestion[];
  };
  documents: {
    title: string;
    subtitle: string;
    contactEmail: string;
    items: Array<{
      title: string;
      type: string;
      href: string;
      isExternal?: boolean;
      action?: 'print';
    }>;
  };
}

export const TRUST_CENTER_CONTENT: TrustCenterContent = {
  meta: {
    title: 'Trust Center | Cynchor Security & Transparency',
    description:
      'Truthful security posture, evidence-backed controls, compliance roadmap, and architecture trust boundaries for the Cynchor cybersecurity training platform.',
    lastReviewed: 'November 2026',
    reviewedBy: 'Cynchor Engineering Team',
  },
  posture: {
    title: 'Our posture in plain language',
    sentences: [
      'Cynchor is an early-stage cybersecurity training platform and does not hold independent compliance attestations (such as SOC 2 or ISO 27001).',
      'Every control marked "In place" on this page is implemented directly in our production repository and verified by automated tests in our build pipeline.',
      'Unimplemented capabilities are cataloged transparently on our roadmap so security reviewers and evaluating organizations have a clear, truthful baseline.',
    ],
  },
  compliance: {
    title: 'Compliance Status',
    subtitle: 'Independent third-party certifications and regulatory compliance tracking.',
    disclaimer: 'We publish no compliance badges or third-party seals. Formal audit status is shown only when backed by an independent auditor report.',
    rows: [
      {
        id: 'soc2',
        framework: 'SOC 2 (Security / Confidentiality)',
        description: 'AICPA Service Organization Control standard for cloud service providers.',
        status: 'not-certified',
        statusLabel: 'Not certified',
        notes: 'Pre-certification startup. Continuous compliance and independent audit planned post-launch.',
      },
      {
        id: 'iso27001',
        framework: 'ISO/IEC 27001',
        description: 'International standard for Information Security Management Systems (ISMS).',
        status: 'not-certified',
        statusLabel: 'Not certified',
        notes: 'Formal ISMS governance framework planned for future growth stage.',
      },
      {
        id: 'hipaa',
        framework: 'HIPAA Security Rule',
        description: 'Standards for protecting sensitive patient health information (PHI).',
        status: 'not-certified',
        statusLabel: 'Not certified',
        notes: 'Not applicable to current operations; Cynchor never ingests or stores protected health information.',
      },
      {
        id: 'pci-dss',
        framework: 'PCI-DSS',
        description: 'Payment Card Industry Data Security Standard.',
        status: 'not-certified',
        statusLabel: 'Not certified',
        notes: 'No payment card processing in the platform today.',
      },
      {
        id: 'fedramp',
        framework: 'FedRAMP',
        description: 'Federal Risk and Authorization Management Program for US government agencies.',
        status: 'not-certified',
        statusLabel: 'Not certified',
        notes: 'Architecture roadmap targeting future evaluation; no agency sponsorship or assessment underway.',
      },
      {
        id: 'gdpr-ccpa',
        framework: 'GDPR / CCPA',
        description: 'European General Data Protection Regulation and California Consumer Privacy Act.',
        status: 'not-certified',
        statusLabel: 'Not formally assessed; see Data we collect',
        notes: 'Data minimization is practiced in code, but no formal legal assessment has been conducted.',
      },
    ],
  },
  applicationSecurity: {
    title: 'Application Security & SDLC',
    subtitle: 'Software development lifecycle practices, testing standards, and static controls.',
    sdlcPractices: [
      {
        title: 'Input Validation via Zod',
        description: 'All incoming HTTP request payloads are strictly validated against strongly-typed Zod schemas with length limits and format constraints.',
      },
      {
        title: 'Parameterized Database Queries',
        description: 'All database queries use SQLite prepared statements with parameter binding, preventing SQL injection vulnerabilities.',
      },
      {
        title: 'Automated Test Harness',
        description: 'Continuous testing executed via npm test covering password hashing, session revocation, single-use invites, audit immutability, and rate limits.',
      },
      {
        title: 'Continuous Dependency Scanning',
        description: 'Automated CI workflow in .github/workflows/ci.yml runs npm audit on every push and pull request to identify vulnerable dependencies.',
      },
      {
        title: 'Strict TypeScript',
        description: 'Full TypeScript coverage across the server runtime, frontend components, and simulation engines to catch type errors at build time.',
      },
      {
        title: 'Environment Secrets Isolation',
        description: 'Session signing keys and cryptographic salts are injected exclusively via runtime environment variables; no secrets exist in the git repository.',
      },
    ],
    roadmap: [
      {
        title: 'Static & Dynamic Code Analysis (SAST/DAST)',
        description: 'Automated static analysis and dynamic runtime scanning integrated into pull request pipelines.',
      },
      {
        title: 'Formal Peer-Review Change Policy',
        description: 'Mandatory branch protection requiring dual-operator code reviews and signed commits.',
      },
    ],
  },
  infrastructure: {
    title: 'Infrastructure & Data Protection Baseline',
    subtitle: 'Transport layer security, defense-in-depth headers, and session boundaries.',
    encryptionAtRestNote: 'Data encryption at rest depends on the deployment host\'s disk encryption; it is not enforced by the application layer today.',
    baseline: [
      {
        category: 'Transport Encryption',
        detail: 'TLS expected on production ingress with HTTP Strict Transport Security (HSTS, max-age=31536000, includeSubDomains, preload).',
      },
      {
        category: 'HTTP Defense Headers',
        detail: 'Strict Content-Security-Policy with frame-ancestors none, X-Content-Type-Options nosniff, and strict Referrer-Policy.',
      },
      {
        category: 'Authentication Hardening',
        detail: 'Salted cryptographic scrypt key derivation with timing-safe comparisons and sliding-window lockout backoff.',
      },
      {
        category: 'Session Protection',
        detail: 'HMAC-SHA256 signed tokens delivered in HttpOnly, SameSite=Lax, Secure cookies with server-side version invalidation.',
      },
      {
        category: 'Range Segmentation',
        detail: 'Simulated lab environments operate strictly under fintechcorp.local private addressing without access to production logic.',
      },
    ],
  },
  dataCollected: {
    title: 'Data We Collect',
    subtitle: 'Exhaustive data inventory derived directly from the application database schema.',
    items: [
      {
        table: 'users',
        fields: 'id, email, password_hash, name, role, experience_level, is_operator, created_at',
        purpose: 'Operator authentication and role assignment for cyber range administration.',
        isHashed: 'Passwords stored as salted scrypt hashes. User IDs and names are stored in plaintext.',
      },
      {
        table: 'access_requests',
        fields: 'id, name, email, source, status, created_at, approved_at',
        purpose: 'Waitlist review and operator evaluation for pilot range admission.',
        isHashed: 'Plaintext operational contact fields (name, email). Minimal data collection.',
      },
      {
        table: 'disclaimers',
        fields: 'id, accepted_at, user_identifier, ip_address, version',
        purpose: 'Audit record of participant acknowledgment before interactive sessions.',
        isHashed: 'IP address is stored as a one-way SHA-256 hash. user_identifier is a truncated user-agent string.',
      },
      {
        table: 'audit_logs',
        fields: 'id, user_id, action, details, ip_hash, created_at',
        purpose: 'Append-only audit trail capturing logins, provisioning, and administrative actions.',
        isHashed: 'Client IP addresses are stored exclusively as one-way SHA-256 hashes with cryptographic salt.',
      },
      {
        table: 'teams & matchmaking',
        fields: 'team_id, name, side, leader_id, user_id, mode, status, created_at',
        purpose: 'Cohort formation, queue dispatching, and multiplayer simulation state.',
        isHashed: 'Internal simulation UUIDs and squad names; no external personal data.',
      },
    ],
    plainSummary: 'The disclaimer record stores a hashed IP and a truncated user-agent; access requests store name and email; passwords are stored only as scrypt hashes.',
    retentionNote: 'Retention schedule: on roadmap (retention and purge schedule not yet formally enforced).',
    // hostingRegion is deliberately omitted / undefined until confirmed by deployment owner
    aiDisclosure: 'Cynchor does not use customer or user data to train models. Hints and validators in the product are rule-based, not AI-generated. The range uses only synthetic data.',
  },
  subprocessors: {
    title: 'Third Parties & Subprocessors',
    subtitle: 'External services contacted by the platform runtime based on code inspection.',
    roster: [
      {
        id: 'google-fonts',
        name: 'Google Fonts',
        purpose: 'Typography assets (Inter & Lexend) for web interface styling.',
        dataShared: 'Browser IP address and User-Agent upon client asset fetch.',
        status: 'Active Web Dependency',
        isVisible: true,
      },
      {
        id: 'aws',
        name: 'Amazon Web Services (AWS)',
        purpose: 'Target cloud hosting architecture for V2 multi-region training infrastructure.',
        dataShared: 'None currently.',
        status: 'Planned (V2); not yet integrated',
        isVisible: true,
      },
      {
        id: 'hosting-provider',
        name: 'Hosting Provider',
        purpose: 'Infrastructure hosting.',
        dataShared: 'Application data and database storage.',
        status: 'Owner to confirm',
        isVisible: false, // hidden until owner supplies
      },
    ],
    noVendorsStatement: 'No analytics, advertising or email-delivery vendors are used.',
  },
  accessControl: {
    title: 'Access Control & Operator Identity',
    subtitle: 'Administrative authentication, authorization boundaries, and session lifecycles.',
    principles: [
      {
        title: 'Invite-Only Operator Provisioning',
        detail: 'Public self-registration is disabled. Operator accounts require an invitation or manual provisioning by an active administrator.',
      },
      {
        title: 'Server-Side Operator RBAC',
        detail: 'All administrative routes and API endpoints verify the operator flag on the server for each request; client assertions are untrusted.',
      },
      {
        title: 'Append-Only Audit Logging',
        detail: 'Administrative actions (invite generation, account creation, access approvals) are written to an append-only log with database trigger guards.',
      },
      {
        title: 'Immediate Session Revocation',
        detail: 'Logout and administrative revocation instantly invalidate user sessions server-side by advancing the session version counter.',
      },
    ],
  },
  incidentResponse: {
    title: 'Incident Response & Vulnerability Disclosure',
    subtitle: 'Coordinated vulnerability disclosure guidelines and reporting channels.',
    contactEmail: 'security@cynchor.com',
    securityTxtUrl: '/.well-known/security.txt',
    responseTargetsNote: 'Formal incident-response runbook with response targets is on our roadmap.',
    // acknowledgementTarget & triageTarget omitted until owner supplies numbers
    guidelines: [
      'Do not disrupt live range environments or degrade service availability for other participants.',
      'Do not access, download, or attempt to modify data belonging to other accounts.',
      'Allow reasonable time for our engineering team to review and resolve reported findings before public disclosure.',
      'Report vulnerabilities directly to our coordinated disclosure inbox.',
    ],
  },
  quickAnswers: {
    title: 'Security Questionnaire Quick Answers',
    subtitle: 'Direct answers to the 14 most common security assessment questions.',
    questions: [
      {
        id: 'q-certifications',
        question: 'Do you hold SOC 2, ISO 27001, or FedRAMP certifications?',
        answer: 'No. Cynchor is an early-stage startup and has not yet undergone independent third-party compliance audits. See our compliance roadmap.',
        isInPlace: false,
      },
      {
        id: 'q-encryption-at-rest',
        question: 'Do you encrypt customer data at rest?',
        answer: 'Not at the application level; this capability is on our roadmap. Disk-level encryption depends on the host infrastructure deployment.',
        controlId: 'ctrl-encryption-at-rest',
        isInPlace: false,
      },
      {
        id: 'q-mfa-sso',
        question: 'Do you support Single Sign-On (SSO) or Multi-Factor Authentication (MFA)?',
        answer: 'Not in place today. MFA for operator accounts is cataloged on our roadmap for V2.',
        controlId: 'ctrl-mfa',
        isInPlace: false,
      },
      {
        id: 'q-pentest',
        question: 'Have you conducted an independent third-party penetration test?',
        answer: 'Not yet. A formal third-party penetration test is planned on our roadmap prior to enterprise release.',
        controlId: 'ctrl-pen-test',
        isInPlace: false,
      },
      {
        id: 'q-data-storage',
        question: 'Where is customer data stored?',
        answer: 'Cynchor does not ingest or store enterprise customer data; training exercises run purely on synthetic data. Hosting infrastructure location is to be confirmed by deployment owner.',
        isInPlace: true,
      },
      {
        id: 'q-ai-training',
        question: 'Do you use customer or participant data to train AI models?',
        answer: 'No. Cynchor does not use customer or user data to train models. Hints and validators in the product are rule-based, not AI-generated. The range uses only synthetic data.',
        isInPlace: true,
      },
      {
        id: 'q-passwords',
        question: 'How are passwords stored and verified?',
        answer: 'Passwords are protected using salted scrypt cryptographic key derivation and verified using constant-time timingSafeEqual comparisons.',
        controlId: 'ctrl-pw-scrypt',
        isInPlace: true,
      },
      {
        id: 'q-vulnerability-handling',
        question: 'How do you handle vulnerability reports?',
        answer: 'Through our published RFC 9116 security.txt manifest and coordinated vulnerability disclosure policy at security@cynchor.com.',
        controlId: 'ctrl-security-txt',
        isInPlace: true,
      },
      {
        id: 'q-bug-bounty',
        question: 'Do you operate a public bug bounty program?',
        answer: 'No. We do not offer cash bounties or run a paid bounty program at this time.',
        isInPlace: false,
      },
      {
        id: 'q-subprocessors',
        question: 'What third-party subprocessors or external vendors are contacted?',
        answer: 'Google Fonts for typography assets. No analytics, advertising, or email-delivery vendors are used. AWS is planned for V2 and not yet integrated.',
        isInPlace: true,
      },
      {
        id: 'q-range-isolation',
        question: 'Is the training range isolated from production systems?',
        answer: 'Yes. Exercises run in isolated network environments under synthetic domain fintechcorp.local with synthetic data only. No customer data enters the range.',
        isInPlace: true,
      },
      {
        id: 'q-admin-governance',
        question: 'How are administrative privileges governed?',
        answer: 'Operator privileges require server-side RBAC verification on every request. Accounts are provisioned by invitation only; public signup is disabled.',
        controlId: 'ctrl-rbac-enforcement',
        isInPlace: true,
      },
      {
        id: 'q-session-hygiene',
        question: 'How are user sessions protected against hijacking?',
        answer: 'Sessions use HMAC-SHA256 signed cookies marked HttpOnly, Secure, and SameSite=Lax, with instant server-side revocation on logout.',
        controlId: 'ctrl-session-sec',
        isInPlace: true,
      },
      {
        id: 'q-audit-logging',
        question: 'What audit logging is in place for sensitive events?',
        answer: 'Security actions are recorded in an append-only database table with one-way SHA-256 hashed IP addresses, protected by database triggers that abort update/delete attempts.',
        controlId: 'ctrl-audit-trail',
        isInPlace: true,
      },
    ],
  },
  documents: {
    title: 'Documents & Verification Requests',
    subtitle: 'Public security artifacts, printable posture summaries, and questionnaire requests.',
    contactEmail: 'security@cynchor.com',
    items: [
      {
        title: 'RFC 9116 security.txt',
        type: 'Public Manifest',
        href: '/.well-known/security.txt',
        isExternal: true,
      },
      {
        title: 'Printable Trust Center Summary',
        type: 'Browser Print / PDF',
        href: '#',
        action: 'print',
      },
      {
        title: 'Live V1 Lab Architecture Inspection',
        type: 'Architecture Demo',
        href: '/demo/architecture',
      },
    ],
  },
};
