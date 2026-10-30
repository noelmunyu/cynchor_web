export interface SecurityControl {
  id: string;
  title: string;
  description: string;
  status: 'live-v1' | 'designed-v2';
  verified: boolean;
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
    // Verified Section 5 Controls (Implemented & Verified with Unit/Integration Tests)
    {
      id: 'ctrl-session-sec',
      title: 'Cryptographic Session & Cookie Hygiene',
      description: 'Session identifiers are cryptographically generated, re-issued with fresh entropy on every login and revoked server-side on logout, and delivered via HttpOnly, Secure, and SameSite=Lax cookie headers.',
      status: 'live-v1',
      verified: true,
      howWeVerify: 'Enforced in src/lib/session.ts: HMAC-signed tokens, timing-safe comparison, HttpOnly and SameSite cookie flags. Verified by code review.',
    },
    {
      id: 'ctrl-pw-rate-limit',
      title: 'Password Hashing and Login Lockout',
      description: 'Salted cryptographic key derivation with constant-time equality checks. Login endpoints enforce rate limiting with lockout backoff to prevent brute-force attacks.',
      status: 'live-v1',
      verified: true,
      howWeVerify: 'Unit tests cover salted scrypt hashing and the rate-limit lockout logic. Timing-safe comparison is enforced in code.',
    },
    {
      id: 'ctrl-invite-tokens',
      title: 'Single-Use 256-bit Hashed Invite Tokens',
      description: 'Lab invitations use CSPRNG 256-bit entropy, stored as SHA-256 hashes in the invites table, with strict 7-day expiration and single-use invalidation upon consumption.',
      status: 'live-v1',
      verified: true,
      howWeVerify: 'A unit test confirms the 256-bit token format and single-use enforcement. Lookups are by SHA-256 hash only.',
    },
    {
      id: 'ctrl-input-validation',
      title: 'Strict Zod Input Validation & SQL Parameterization',
      description: 'Login and access-request payloads are validated against Zod schemas with length limits. All database interactions utilize prepared statements.',
      status: 'live-v1',
      verified: true,
      howWeVerify: 'Unit tests run malformed and script-injection payloads against the Zod schemas.',
    },
    {
      id: 'ctrl-security-headers',
      title: 'Hardened HTTP Security Headers and CSP',
      description: 'Every route delivers a Content-Security-Policy (frame-ancestors none), Strict-Transport-Security, X-Content-Type-Options nosniff, and Referrer-Policy strict-origin-when-cross-origin.',
      status: 'live-v1',
      verified: true,
      howWeVerify: 'Headers are set for every route in src/middleware.ts and can be inspected in any browser network panel.',
    },
    {
      id: 'ctrl-audit-trail',
      title: 'Append-Only Audit Logging with IP Hashing',
      description: 'Security-critical actions (logins, invite creation, access approvals) are recorded in an append-only audit log table with one-way SHA-256 hashed IP addresses.',
      status: 'live-v1',
      verified: true,
      howWeVerify: 'Unit tests assert entries are written with hashed IPs and that the database rejects updates and deletes.',
    },
    {
      id: 'ctrl-rbac-enforcement',
      title: 'Role-Based Access Control (RBAC) on Protected Routes',
      description: 'Administrative API routes verify the operator flag on the server for every request. Unauthenticated or unauthorized callers receive immediate 401/403 responses.',
      status: 'live-v1',
      verified: true,
      howWeVerify: 'Every admin route checks the operator flag on the server for each request. Automated RBAC tests are on our roadmap.',
    },
    {
      id: 'ctrl-security-txt',
      title: 'Standardized Responsible Disclosure (security.txt)',
      description: 'RFC 9116 security.txt metadata published at /.well-known/security.txt defining vulnerability reporting policy and public disclosure guidelines.',
      status: 'live-v1',
      verified: true,
      howWeVerify: 'A unit test checks the file contains the Contact, Expires, Preferred-Languages and Canonical fields.',
    },

    // Unverified / Future V2 Designed Controls (verified: false -> must NOT be rendered)
    {
      id: 'ctrl-cloudhsm',
      title: 'AWS CloudHSM Hardware Root of Trust',
      description: 'FIPS 140-2 Level 3 hardware security module key generation and storage.',
      status: 'designed-v2',
      verified: false,
      howWeVerify: 'Pending AWS GovCloud production infrastructure deployment.',
    },
    {
      id: 'ctrl-fedramp',
      title: 'FedRAMP High Continuous Monitoring Baseline',
      description: 'Continuous monitoring automation conforming to FedRAMP High baseline requirements.',
      status: 'designed-v2',
      verified: false,
      howWeVerify: 'Formal 3PAO assessment pending future release.',
    },
    {
      id: 'ctrl-soc2',
      title: 'Automated SOC 2 Type II Evidence Harvester',
      description: 'Continuous automated compliance evidence aggregation across infrastructure tiers.',
      status: 'designed-v2',
      verified: false,
      howWeVerify: 'Auditor review scheduled post-V2 launch.',
    },
  ] as SecurityControl[],
  honestyBlock: {
    title: "What we don't claim",
    points: [
      'We do NOT claim SOC 2, ISO 27001, FedRAMP, or PCI-DSS certifications today. [OWNER TODO: Add formal compliance status once independent third-party audits are completed].',
      'The cyber range never stores, ingests, or processes real enterprise customer data or production credentials. All simulated entities, mail headers, and logs are 100% synthetic (fintechcorp.local).',
      'Our matchmaking algorithms do not claim AI-driven or skill-weighted balancing in V1; experience levels are saved to user profiles for self-organization.',
    ],
  },
  responsibleDisclosure: {
    title: 'Responsible Disclosure Policy',
    description: 'We welcome security researchers who discover potential vulnerabilities in our website, API, or simulation architecture to report them responsibly.',
    contactEmail: 'security@cynchor.com',
    pgpKeyUrl: '/.well-known/security.txt',
    guidelines: [
      'Do not disrupt live range environments or degrade service availability for other users.',
      'Do not access or attempt to access data belonging to other organizations or accounts.',
      'Allow reasonable time for our engineering team to review and resolve the issue before public disclosure.',
    ],
  },
};

