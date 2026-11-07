import fs from 'fs';
import path from 'path';

export interface SecurityEvidence {
  file: string;
  contains: string;
}

export type ControlCategory =
  | 'application'
  | 'infrastructure'
  | 'identity'
  | 'data'
  | 'monitoring'
  | 'disclosure';

export interface SecurityControl {
  id: string;
  category: ControlCategory;
  title: string;
  description: string;
  visibility: 'claimed' | 'roadmap' | 'hidden';
  status: 'live-v1' | 'designed-v2';
  verified: boolean;
  evidence?: SecurityEvidence[];
  howWeVerify: string;
}

export interface SecurityPrinciple {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const SECURITY_CONTENT = {
  hero: {
    badge: 'Upcoming (V2)',
    title: 'Security is the architecture, not an add-on.',
    subtitle: 'Network segmentation, least privilege, and audit logging are built into every range boundary.',
  },
  principles: [
    {
      id: 'segmentation',
      title: 'Micro-Segmentation',
      description: 'Each training exercise runs in an isolated SDN overlay network. Training traffic cannot cross into production infrastructure or adjacent student lab environments.',
      icon: 'layers',
    },
    {
      id: 'least-privilege',
      title: 'Least Privilege RBAC',
      description: 'Strict role separation between anonymous visitors, registered operators, lab defenders, and administrative consoles. Privileges are scoped per session.',
      icon: 'shield-check',
    },
    {
      id: 'synthetic-data',
      title: 'Isolated Range & Synthetic Data',
      description: 'All exercise targets, credentials, user directories, and database tables use purely fictional data under the fintechcorp.local test domain. No customer data ever enters the range.',
      icon: 'database',
    },
    {
      id: 'audit-logging',
      title: 'Monitoring & Audit Logging',
      description: 'Cryptographic IP hashing and append-only audit logging capture every login, approval, invite generation, and administrative action for governance.',
      icon: 'file-text',
    },
    {
      id: 'operator-provisioned',
      title: 'Invite-Only Operator Access',
      description: 'Self-registration is disabled. Access requires vetted operator invitation or an approved access request with expiring, single-use 256-bit hashed tokens.',
      icon: 'key',
    },
    {
      id: 'data-minimization',
      title: 'Data Minimization',
      description: 'The platform intentionally collects only the minimal information required for lab access: name and email address. No unnecessary personal data is requested or stored.',
      icon: 'user-check',
    },
  ] as SecurityPrinciple[],
  controls: [
    // ════════════════════════════════════════════════════════════
    // CLAIMED CONTROLS (Live in V1, Verified with File Evidence)
    // ════════════════════════════════════════════════════════════
    {
      id: 'ctrl-pw-scrypt',
      category: 'identity',
      title: 'Salted scrypt password hashing & constant-time compare',
      description: 'Passwords are protected using cryptographic key derivation (scrypt) with individual salts and verified using constant-time timingSafeEqual comparisons to eliminate timing attack vectors.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: 'src/lib/db.ts', contains: 'crypto.scryptSync(password, actualSalt, 64)' },
        { file: 'src/lib/db.ts', contains: 'crypto.timingSafeEqual' },
      ],
      howWeVerify: 'Automated test suite validates unique salts per user and constant-time equality comparisons.',
    },
    {
      id: 'ctrl-session-sec',
      category: 'identity',
      title: 'Cryptographic HMAC session cookies with server-side revocation',
      description: 'Session tokens are signed with HMAC-SHA256, delivered with HttpOnly, SameSite=Lax, and Secure cookie flags, and validated against session versioning for immediate server-side revocation on logout.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: 'src/lib/session.ts', contains: 'crypto.createHmac("sha256", getSessionSecret())' },
        { file: 'src/lib/session.ts', contains: "sameSite: 'lax'" },
        { file: 'src/lib/session.ts', contains: 'export function revokeUserSessions' },
      ],
      howWeVerify: 'Server-side session management actively enforces token validation and immediate revocation.',
    },
    {
      id: 'ctrl-invite-tokens',
      category: 'identity',
      title: 'Single-use 256-bit hashed invite tokens',
      description: 'Access invitations use CSPRNG 256-bit entropy, stored strictly as SHA-256 hashes in the invites table, with 7-day expiration and single-use consumption.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: 'src/lib/db.ts', contains: "crypto.randomBytes(32).toString('hex')" },
        { file: 'src/lib/db.ts', contains: 'export function verifyAndConsumeInvite' },
      ],
      howWeVerify: 'Cryptographic test suite asserts 256-bit token entropy and replay rejection.',
    },
    {
      id: 'ctrl-rate-limiting',
      category: 'application',
      title: 'IP & account authentication rate limiting',
      description: 'Authentication endpoints and public access request routes enforce sliding-window rate limiting with exponential lockout backoff to protect against automated credential attacks.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: 'src/lib/session.ts', contains: 'export function checkRateLimit' },
        { file: 'src/app/api/auth/login/route.ts', contains: 'checkRateLimit(`login_${ip}`, 5, 60)' },
      ],
      howWeVerify: 'Automated test suite verifies sliding-window attempt thresholds and lockout retry-after duration.',
    },
    {
      id: 'ctrl-input-validation',
      category: 'application',
      title: 'Strict Zod schema validation & parameterized SQL',
      description: 'All incoming request payloads are strictly parsed and sanitized against Zod schemas. Database queries use prepared statements with parameter binding to prevent injection.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: 'src/lib/validators.ts', contains: 'export const loginSchema = z.object' },
        { file: 'src/lib/validators.ts', contains: 'export const accessRequestSchema = z.object' },
      ],
      howWeVerify: 'Input parsing suite asserts schema rejection on malformed inputs and script injections.',
    },
    {
      id: 'ctrl-security-headers',
      category: 'infrastructure',
      title: 'Hardened HTTP headers, CSP & cross-origin write blocking',
      description: 'Every HTTP response delivers strict security headers including frame-ancestors none CSP, HSTS, nosniff, and cross-origin write blocking to prevent clickjacking and state manipulation.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: 'src/middleware.ts', contains: "frame-ancestors 'none'" },
        { file: 'src/middleware.ts', contains: 'Cross-origin request blocked.' },
      ],
      howWeVerify: 'HTTP middleware actively enforces strict transport security, framing denial, and CSP across all routes.',
    },
    {
      id: 'ctrl-rbac-enforcement',
      category: 'identity',
      title: 'Server-side route guards & operator RBAC',
      description: 'Administrative and operational capabilities require server-verified operator privileges. Requests lacking operator credentials receive immediate 401/403 responses.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: 'src/lib/guards.ts', contains: 'if (opts.operator === true && isOperator === false) redirect' },
        { file: 'src/app/api/admin/route.ts', contains: 'Forbidden: Operator privileges required' },
      ],
      howWeVerify: 'Server-side authorization guards verify signed operator credentials before rendering admin views or executing APIs.',
    },
    {
      id: 'ctrl-audit-trail',
      category: 'monitoring',
      title: 'Append-only audit logging with privacy IP hashing',
      description: 'Security actions (authentication, access approval, invite provisioning) are recorded with one-way SHA-256 hashed IP addresses and protected against modification by database triggers.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: 'src/lib/db.ts', contains: 'CREATE TRIGGER IF NOT EXISTS audit_logs_no_update' },
        { file: 'src/lib/db.ts', contains: 'CREATE TRIGGER IF NOT EXISTS audit_logs_no_delete' },
      ],
      howWeVerify: 'Database integrity suite verifies that update and delete attempts on audit records raise abort exceptions.',
    },
    {
      id: 'ctrl-invite-only',
      category: 'identity',
      title: 'Operator-provisioned invite-only access',
      description: 'Public self-registration is disabled. Access to interactive ranges requires an invitation issued by an operator or manual provisioning through administrative routes.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: 'src/app/api/admin/route.ts', contains: "action === 'PROVISION_USER'" },
      ],
      howWeVerify: 'Public signup routes are omitted by design; account creation requires verified operator session.',
    },
    {
      id: 'ctrl-data-minimization',
      category: 'data',
      title: 'Data minimization on access requests',
      description: 'The platform collects only operational name and email for waitlist and access requests. No unnecessary personal, financial, or tracking data is gathered.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: 'src/lib/validators.ts', contains: 'export const accessRequestSchema = z.object' },
      ],
      howWeVerify: 'Schema validation suite verifies that access payloads reject extraneous unmodeled fields.',
    },
    {
      id: 'ctrl-vuln-disclosure',
      category: 'disclosure',
      title: 'Coordinated vulnerability disclosure reporting channel',
      description: 'Security researchers can report potential vulnerabilities directly to our engineering team via security@cynchor.com.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: 'src/content/security-controls.ts', contains: 'contactEmail: \'security@cynchor.com\'' },
      ],
      howWeVerify: 'Dedicated monitoring of the coordinated disclosure intake inbox for security reports.',
    },

    // ════════════════════════════════════════════════════════════
    // ROADMAP CONTROLS (Designed for V2, Not Yet In Place)
    // ════════════════════════════════════════════════════════════
    {
      id: 'ctrl-mfa',
      category: 'identity',
      title: 'MFA for operator accounts',
      description: 'Time-based one-time password (TOTP) or WebAuthn hardware key multi-factor authentication for administrative accounts.',
      visibility: 'roadmap',
      status: 'designed-v2',
      verified: false,
      howWeVerify: 'Planned for operator authentication in V2.',
    },
    {
      id: 'ctrl-ci-dep-scanning',
      category: 'application',
      title: 'Automated dependency scanning in CI',
      description: 'Automated vulnerability scanning of dependencies in continuous integration pipelines on every push and pull request via npm audit.',
      visibility: 'claimed',
      status: 'live-v1',
      verified: true,
      evidence: [
        { file: '.github/workflows/ci.yml', contains: 'npm audit' },
      ],
      howWeVerify: 'Automated dependency vulnerability scanning is enforced on continuous integration pipelines.',
    },
    {
      id: 'ctrl-encryption-at-rest',
      category: 'data',
      title: 'Encryption at rest (disk-level, deployment-dependent)',
      description: 'Persistent volume and database file encryption depends on deployment host disk encryption; not enforced by the application today.',
      visibility: 'roadmap',
      status: 'designed-v2',
      verified: false,
      howWeVerify: 'Host disk volume encryption verification.',
    },
    {
      id: 'ctrl-pen-test',
      category: 'application',
      title: 'Third-party penetration test',
      description: 'Independent third-party penetration testing and vulnerability assessment across web application and simulation boundaries.',
      visibility: 'roadmap',
      status: 'designed-v2',
      verified: false,
      howWeVerify: 'Formal third-party assessment report and remediation audit.',
    },
    {
      id: 'ctrl-ir-runbook',
      category: 'disclosure',
      title: 'Formal incident-response runbook with response targets',
      description: 'Documented incident response classification, escalation matrix, and customer notification SLA commitments.',
      visibility: 'roadmap',
      status: 'designed-v2',
      verified: false,
      howWeVerify: 'Simulated tabletop exercise and documented incident response runbooks.',
    },
    {
      id: 'ctrl-data-retention',
      category: 'data',
      title: 'Data-retention schedule',
      description: 'Automated retention and purge schedules for expired invite tokens, inactive demo accounts, and audit log records.',
      visibility: 'roadmap',
      status: 'designed-v2',
      verified: false,
      howWeVerify: 'Automated database retention prune job execution.',
    },

    // ════════════════════════════════════════════════════════════
    // HIDDEN CONTROLS (Never Rendered)
    // ════════════════════════════════════════════════════════════
    {
      id: 'ctrl-cloudhsm',
      category: 'infrastructure',
      title: 'Hardware Security Module (HSM) Root of Trust',
      description: 'FIPS 140-2 Level 3 hardware security module key generation and storage.',
      visibility: 'hidden',
      status: 'designed-v2',
      verified: false,
      howWeVerify: 'Pending cloud-hosted production infrastructure deployment.',
    },
    {
      id: 'ctrl-fedramp',
      category: 'infrastructure',
      title: 'FedRAMP High Continuous Monitoring Baseline',
      description: 'Continuous monitoring automation conforming to FedRAMP High baseline requirements.',
      visibility: 'hidden',
      status: 'designed-v2',
      verified: false,
      howWeVerify: 'Formal 3PAO assessment pending future release.',
    },
    {
      id: 'ctrl-soc2',
      category: 'application',
      title: 'Automated SOC 2 Type II Evidence Harvester',
      description: 'Continuous automated compliance evidence aggregation across infrastructure tiers.',
      visibility: 'hidden',
      status: 'designed-v2',
      verified: false,
      howWeVerify: 'Auditor review scheduled post-V2 launch.',
    },
  ] as SecurityControl[],
  honestyBlock: {
    title: "What we don't claim",
    points: [
      'We do NOT claim SOC 2, ISO 27001, FedRAMP, or PCI-DSS certifications today. Independent third-party audit assessments are planned for future evaluation.',
      'The cyber range never stores, ingests, or processes real enterprise customer data or production credentials. All simulated entities, mail headers, and logs are 100% synthetic (fintechcorp.local).',
      'Our matchmaking algorithms do not claim AI-driven or skill-weighted balancing in V1; experience levels are saved to user profiles for self-organization.',
    ],
  },
  responsibleDisclosure: {
    title: 'Responsible Disclosure Policy',
    description: 'We welcome security researchers who discover potential vulnerabilities in our website, API, or simulation architecture to report them responsibly.',
    contactEmail: 'security@cynchor.com',
    guidelines: [
      'Do not disrupt live range environments or degrade service availability for other users.',
      'Do not access or attempt to access data belonging to other organizations or accounts.',
      'Allow reasonable time for our engineering team to review and resolve the issue before public disclosure.',
    ],
  },
};
