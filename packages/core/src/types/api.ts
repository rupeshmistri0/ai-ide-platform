import { User } from './user';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface ApiErrorDetail {
  message: string;
  code?: string;
  detail?: string | Record<string, any>;
  status: number;
}

export interface DashboardMetrics {
  totalProjects: number;
  activeTasks: number;
  aiTokensUsed: number;
  monthlyTokensQuota: number;
  teamMembers: number;
  systemHealth: 'Optimal' | 'Degraded' | 'Maintenance';
}

export interface ActivityItem {
  id: string;
  user: User;
  action: string;
  target: string;
  timestamp: string;
  category: 'workspace' | 'chat' | 'settings' | 'deploy';
}
