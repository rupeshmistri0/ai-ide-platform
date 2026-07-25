import { User } from './user';

export type WorkspacePlan = 'free' | 'pro' | 'enterprise';
export type WorkspaceRole = 'owner' | 'admin' | 'developer' | 'viewer';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: WorkspacePlan;
  ownerId?: string;
  membersCount: number;
  projectsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  user: User;
  role: WorkspaceRole;
  joinedAt: string;
}
