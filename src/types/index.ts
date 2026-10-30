export type UserRole = 'RED_TEAM' | 'BLUE_TEAM' | 'NET_SEC' | 'GRC';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
export type TeamSide = 'RED' | 'BLUE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole | null;
  experience_level: ExperienceLevel | null;
  is_profile_completed: number; // 0 or 1
  is_operator: number; // 0 or 1
  created_at: string;
}

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  approved_at?: string;
  generated_invite_token?: string;
}

export interface Invite {
  id: string;
  token: string;
  email: string;
  is_used: number;
  used_at?: string;
  expires_at: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  side: TeamSide;
  leader_id: string;
  is_complete: number;
  status: 'RECRUITING' | 'QUEUED' | 'MATCHED';
  created_at: string;
  members?: User[];
}

export interface MatchSession {
  id: string;
  red_team_id?: string;
  blue_team_id?: string;
  mode: 'SOLO' | 'TEAM';
  side?: TeamSide | 'SOLO';
  user_id?: string;
  lab_id?: string;
  status: string;
  created_at: string;
}

export interface LabLaunchConfig {
  sessionId: string;
  mode: 'SOLO' | 'TEAM';
  side?: TeamSide | 'SOLO';
  userId?: string;
}

export interface LabLaunchResult {
  status: 'PENDING' | 'PROVISIONING' | 'READY' | 'STUBBED';
  sessionId: string;
  mode: 'SOLO' | 'TEAM';
  side?: TeamSide | 'SOLO';
  allocatedSubnet: string;
  gatewayIp: string;
  adapterMessage: string;
  targetDomain: string;
  endpointUrl: string | null;
  isLiveProxmoxConnected: false;
}

