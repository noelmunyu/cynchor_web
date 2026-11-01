export interface LabToolItem {
  id: string;
  name: string;
  role: string;
  status: 'live-v1' | 'planned-v2';
  verified: boolean;
  notes?: string;
}

/**
 * Lab tools config list.
 * Render ONLY verified: true items.
 * Everything else marked verified: false with OWNER-TODO.
 */
export const LAB_TOOLS: LabToolItem[] = [
  {
    id: 'gophish',
    name: 'GoPhish',
    role: 'Simulated phishing campaigns and lookalike email delivery across synthetic test mailboxes.',
    status: 'live-v1',
    verified: true,
  },
  {
    id: 'active-directory',
    name: 'Active Directory',
    role: 'Synthetic domain services (fintechcorp.local), Kerberos tickets, and LDAP directory trees.',
    status: 'live-v1',
    verified: true,
  },
  {
    id: 'proxmox-ve',
    name: 'Proxmox VE',
    role: 'Virtualization hypervisor powering isolated lab node environments.',
    status: 'live-v1',
    verified: true,
  },
  {
    id: 'email-auth',
    name: 'SPF / DKIM / DMARC Checks',
    role: 'Cryptographic email authentication header verification and delivery policy enforcement.',
    status: 'live-v1',
    verified: true,
  },

  // Planned tools (verified: false with OWNER-TODO)
  {
    id: 'splunk-forwarder',
    name: 'Splunk Universal Forwarder',
    role: 'Enterprise log shipping pipeline to external indexing clusters.',
    status: 'planned-v2',
    verified: false,
    notes: 'OWNER-TODO: Verify enterprise Splunk forwarder license and container stack for V2 cloud range.',
  },
  {
    id: 'velociraptor',
    name: 'Velociraptor DFIR',
    role: 'Endpoint forensics, artifact collection, and live host memory triage.',
    status: 'planned-v2',
    verified: false,
    notes: 'OWNER-TODO: Confirm Velociraptor server deployment on student network segments.',
  },
  {
    id: 'zeek-ids',
    name: 'Zeek Network Security Monitor',
    role: 'Deep packet inspection, network protocol analysis, and connection stream parsing.',
    status: 'planned-v2',
    verified: false,
    notes: 'OWNER-TODO: Benchmark Zeek sensor packet loss on high-throughput Proxmox bridges.',
  },
  {
    id: 'suricata',
    name: 'Suricata IDS/IPS',
    role: 'Rule-based network intrusion detection and signature-driven automated packet drops.',
    status: 'planned-v2',
    verified: false,
    notes: 'OWNER-TODO: Author and test synthetic ATT&CK signature rule packs.',
  },
];

