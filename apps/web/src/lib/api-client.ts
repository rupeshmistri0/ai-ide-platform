import {
  User,
  Workspace,
  Project,
  Task,
  AIModel,
  ChatConversation,
  DashboardMetrics,
  ActivityItem,
} from '@/types';

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export const mockUser: User = {
  id: 'usr_101',
  name: 'Alex Rivera',
  email: 'alex.rivera@enterprise.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'owner',
  createdAt: '2025-01-15T08:00:00Z',
  twoFactorEnabled: true,
};

export const mockWorkspaces: Workspace[] = [
  {
    id: 'ws_prod',
    name: 'AI Engineering Platform',
    slug: 'ai-engineering',
    plan: 'enterprise',
    membersCount: 24,
    projectsCount: 8,
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'ws_dev',
    name: 'Data Science Lab',
    slug: 'ds-lab',
    plan: 'pro',
    membersCount: 8,
    projectsCount: 3,
    createdAt: '2025-02-01T12:00:00Z',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'proj_1',
    name: 'Next.js 15 Core App Router Engine',
    description: 'Enterprise scalable React framework architecture with server component streaming',
    workspaceId: 'ws_prod',
    status: 'active',
    progress: 85,
    tasksCount: 14,
    completedTasksCount: 11,
    updatedAt: '2026-07-24T14:30:00Z',
  },
  {
    id: 'proj_2',
    name: 'LLM Agent Gateway & Router',
    description: 'High-performance API Proxy supporting Gemini 1.5, Claude 3.5 & GPT-4o',
    workspaceId: 'ws_prod',
    status: 'active',
    progress: 60,
    tasksCount: 20,
    completedTasksCount: 12,
    updatedAt: '2026-07-23T11:20:00Z',
  },
  {
    id: 'proj_3',
    name: 'Realtime Vector Index Pipeline',
    description: 'pgvector & Pinecone syncing engine for rag documentation',
    workspaceId: 'ws_prod',
    status: 'active',
    progress: 30,
    tasksCount: 8,
    completedTasksCount: 2,
    updatedAt: '2026-07-20T09:15:00Z',
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task_101',
    title: 'Implement Zustand persistent storage slice',
    description: 'Add state hydration and local storage sync for workspace preferences',
    status: 'completed',
    priority: 'high',
    assignee: mockUser,
    tags: ['Frontend', 'Zustand'],
    dueDate: '2026-07-25',
    createdAt: '2026-07-22T08:00:00Z',
  },
  {
    id: 'task_102',
    title: 'Configure TanStack Query optimistic updates',
    description: 'Ensure smooth UX when mutating task statuses on Kanban cards',
    status: 'in_progress',
    priority: 'urgent',
    assignee: mockUser,
    tags: ['React Query', 'API'],
    dueDate: '2026-07-26',
    createdAt: '2026-07-23T09:30:00Z',
  },
  {
    id: 'task_103',
    title: 'Setup AI Chat streaming text renderer',
    description: 'Handle SSE events, markdown parsing and code block copy triggers',
    status: 'in_review',
    priority: 'urgent',
    assignee: mockUser,
    tags: ['AI', 'UI'],
    dueDate: '2026-07-27',
    createdAt: '2026-07-24T10:00:00Z',
  },
  {
    id: 'task_104',
    title: 'Security audit for JWT Refresh Token rotation',
    description: 'Verify HTTP-only cookie security headers and revocation list',
    status: 'backlog',
    priority: 'medium',
    assignee: mockUser,
    tags: ['Security', 'Auth'],
    dueDate: '2026-08-01',
    createdAt: '2026-07-24T12:00:00Z',
  },
];

export const mockAIModels: AIModel[] = [
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    contextWindow: '2,000,000 tokens',
    description: 'Best for complex multimodal reasoning, code synthesis, and deep analysis.',
    isPopular: true,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    contextWindow: '200,000 tokens',
    description: 'Superior coding capability, nuanced writing, and high instruction compliance.',
    isPopular: true,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    contextWindow: '128,000 tokens',
    description: 'Fast flagship model for general conversation, structured JSON output, and coding.',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    provider: 'DeepSeek',
    contextWindow: '64,000 tokens',
    description: 'Open reasoning model specialized for mathematical and algorithmic problems.',
  },
  {
    id: 'qwen2.5-coder:7b',
    name: 'Qwen 2.5 Coder 7B',
    provider: 'Ollama',
    contextWindow: '32,000 tokens',
    description: 'Local coding model with superior syntax generation, reasoning, and context understanding.',
    isPopular: true,
  },
];

export const mockConversations: ChatConversation[] = [
  {
    id: 'conv_1',
    title: 'Next.js 15 App Router Folder Strategy',
    createdAt: '2026-07-24T14:00:00Z',
    updatedAt: '2026-07-24T14:15:00Z',
    modelId: 'gemini-1.5-pro',
    isPinned: true,
    messages: [
      {
        id: 'msg_1',
        role: 'user',
        content: 'How should we structure features in a Next.js 15 enterprise monorepo app?',
        timestamp: '2026-07-24T14:00:00Z',
      },
      {
        id: 'msg_2',
        role: 'assistant',
        content: 'To build a scalable enterprise Next.js 15 project, adopt a **Domain-Driven Modular Architecture**:\n\n1. `src/features/*`: Encapsulate domain logic (e.g. `auth`, `workspace`, `ai-chat`, `settings`).\n2. `src/components/ui/*`: Reusable atomic UI primitives (shadcn/ui).\n3. `src/stores/*`: Global Zustand stores for client state.\n4. `src/providers/*`: React Query, Theme, and Toast providers.',
        timestamp: '2026-07-24T14:00:05Z',
        codeSnippet: {
          language: 'typescript',
          filename: 'src/features/workspace/use-workspace.ts',
          code: `import { useQuery } from '@tanstack/react-query';\nimport { queryKeys } from '@/lib/query-client';\n\nexport function useWorkspaceProjects(workspaceId: string) {\n  return useQuery({\n    queryKey: queryKeys.workspace.projects(workspaceId),\n    queryFn: () => fetchProjects(workspaceId),\n  });\n}`,
        },
      },
    ],
  },
  {
    id: 'conv_2',
    title: 'TanStack Query v5 Optimization Tips',
    createdAt: '2026-07-23T10:00:00Z',
    updatedAt: '2026-07-23T10:20:00Z',
    modelId: 'claude-3-5-sonnet',
    messages: [
      {
        id: 'msg_3',
        role: 'user',
        content: 'What are the key changes in TanStack Query v5 for key factories?',
        timestamp: '2026-07-23T10:00:00Z',
      },
      {
        id: 'msg_4',
        role: 'assistant',
        content: 'TanStack Query v5 introduces object syntax for `useQuery` and stricter key factory recommendations.',
        timestamp: '2026-07-23T10:00:04Z',
      },
    ],
  },
];

export const mockMetrics: DashboardMetrics = {
  totalProjects: 12,
  activeTasks: 34,
  aiTokensUsed: 1420500,
  monthlyTokensQuota: 5000000,
  teamMembers: 18,
  systemHealth: 'Optimal',
};

export const mockActivities: ActivityItem[] = [
  {
    id: 'act_1',
    user: mockUser,
    action: 'created new project',
    target: 'Next.js 15 Core App Router Engine',
    timestamp: '10 minutes ago',
    category: 'workspace',
  },
  {
    id: 'act_2',
    user: mockUser,
    action: 'promoted model to default',
    target: 'Gemini 1.5 Pro',
    timestamp: '1 hour ago',
    category: 'chat',
  },
  {
    id: 'act_3',
    user: mockUser,
    action: 'updated security settings',
    target: '2FA authentication',
    timestamp: '3 hours ago',
    category: 'settings',
  },
];

// Mock API Methods
export const api = {
  auth: {
    getUser: async () => {
      await delay(200);
      return mockUser;
    },
    login: async (email: string) => {
      await delay(500);
      return { ...mockUser, email };
    },
  },
  workspace: {
    getWorkspaces: async () => {
      await delay(300);
      return mockWorkspaces;
    },
    getProjects: async (wsId: string) => {
      await delay(300);
      return mockProjects.filter((p) => p.workspaceId === wsId || wsId === 'ws_prod');
    },
    getTasks: async () => {
      await delay(300);
      return mockTasks;
    },
  },
  dashboard: {
    getMetrics: async () => {
      await delay(250);
      return mockMetrics;
    },
    getActivities: async () => {
      await delay(250);
      return mockActivities;
    },
  },
  chat: {
    getConversations: async () => {
      await delay(200);
      return mockConversations;
    },
  },
};
