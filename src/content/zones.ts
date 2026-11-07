export interface ZoneItem {
  id: string;
  name: string;
  subnet: string;
  role: string;
  controls: string[];
  blocks: string[];
  verified: boolean;
  notes?: string;
}

/**
 * Trust zones config-driven list.
 * Truth pass: Only claims verified of this codebase are marked verified: true.
 * Everything requiring future infrastructure (SDN microsegmentation, Edge CDN, DMZ proxy, per-student VLANs)
 * is kept with verified: false and marked with an OWNER-TODO.
 */
export const ZONES_CONTENT: ZoneItem[] = [
  {
    id: 'public',
    name: 'Public Website',
    subnet: 'Public Web Endpoint',
    role: 'Marketing pages, static documentation, pilot/access requests, and responsible disclosure.',
    controls: [
      'Strict CSP (frame-ancestors none)',
      'HSTS, X-Content-Type-Options: nosniff, Referrer-Policy',
      'Coordinated vulnerability disclosure reporting channel',
    ],
    blocks: [
      'Framing and clickjacking attacks',
      'Arbitrary code execution via inline scripts',
      'Unparameterized state queries',
    ],
    verified: true,
  },
  {
    id: 'app',
    name: 'Application Tier',
    subnet: 'Next.js Application',
    role: 'Core business logic: authentication, session rotation, team formation, and queue dispatching.',
    controls: [
      'Strict Zod payload validation on every endpoint',
      'Parameterized SQLite queries',
      'HttpOnly + Secure + SameSite=Lax cookie sessions',
      'Operator role-based access control (RBAC)',
      'Single-use 256-bit hashed invite tokens',
    ],
    blocks: [
      'SQL injection payloads',
      'Unauthenticated access to operator routes',
      'User enumeration via generic auth error responses',
    ],
    verified: true,
  },
  {
    id: 'range',
    name: 'Isolated Training Range',
    subnet: 'Virtual Range Host (fintechcorp.local)',
    role: 'Isolated virtual lab running synthetic targets (fintechcorp.local) and non-functional simulation scenarios.',
    controls: [
      '100% synthetic enterprise topology (fintechcorp.local)',
      'RFC 1918 private IP addressing only',
      'Non-functional conceptual payloads and script logs',
    ],
    blocks: [
      'Real customer or production data ingestion',
      'External routing or real domain communication',
      'Execution of functional exploit payloads',
    ],
    verified: true,
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Audit',
    subnet: 'Local Telemetry & Audit Store',
    role: 'Append-only audit trail and telemetry logging with privacy-preserving IP hashing.',
    controls: [
      'Append-only SQLite audit_logs table protected by triggers',
      'One-way SHA-256 IP address hashing',
      'Operator-only read access to audit logs',
    ],
    blocks: [
      'Audit log modification or record deletion (aborted by trigger)',
      'Plaintext IP address exposure in persistent storage',
      'Unauthorized non-operator audit review',
    ],
    verified: true,
  },

  // Unverified Architecture Claims (OWNER-TODO to confirm before enabling)
  {
    id: 'dmz-proxy',
    name: 'DMZ Auth Proxy',
    subnet: '10.0.1.0/24 DMZ',
    role: 'Dedicated reverse proxy gateway separating perimeter ingress from web services.',
    controls: [
      'Hardware WAF inspection',
      'mTLS mutual authentication proxy',
    ],
    blocks: ['Direct network routing to app runtime'],
    verified: false,
    notes: 'OWNER-TODO: Confirm physical/cloud DMZ reverse proxy architecture once provisioned.',
  },
  {
    id: 'sdn-vlans',
    name: 'Proxmox SDN Per-Student VLANs',
    subnet: 'SDN EVPN / VxLAN Overlay',
    role: 'Hardware hypervisor micro-segmentation per student training pod.',
    controls: [
      'Isolated VxLAN virtual network overlays',
      'Strict SDN firewall drop rules between student pods',
    ],
    blocks: ['Lateral student cross-talk', 'Cross-pod packet inspection'],
    verified: false,
    notes: 'OWNER-TODO: Verify automated Proxmox EVPN VxLAN tenant provisioning in multi-node cluster.',
  },
];

