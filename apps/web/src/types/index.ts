export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  createdAt: string;
  twoFactorEnabled?: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: 'free' | 'pro' | 'enterprise';
  membersCount: number;
  projectsCount: number;
  createdAt: string;
}

export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  tags: string[];
  dueDate?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  status: 'active' | 'archived' | 'draft';
  progress: number;
  tasksCount: number;
  completedTasksCount: number;
  updatedAt: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'Google' | 'Anthropic' | 'OpenAI' | 'DeepSeek';
  contextWindow: string;
  description: string;
  isPopular?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelId?: string;
  codeSnippet?: {
    language: string;
    code: string;
    filename?: string;
  };
  isStreaming?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  modelId: string;
  messages: ChatMessage[];
  isPinned?: boolean;
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
