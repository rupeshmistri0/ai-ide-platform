import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

// Enterprise Query Key Factory Pattern
export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  workspace: {
    all: ['workspaces'] as const,
    detail: (id: string) => ['workspaces', id] as const,
    projects: (workspaceId: string) => ['workspaces', workspaceId, 'projects'] as const,
    tasks: (workspaceId: string) => ['workspaces', workspaceId, 'tasks'] as const,
  },
  dashboard: {
    metrics: ['dashboard', 'metrics'] as const,
    activity: ['dashboard', 'activity'] as const,
  },
  chat: {
    conversations: ['chat', 'conversations'] as const,
    thread: (id: string) => ['chat', 'conversations', id] as const,
  },
  settings: {
    profile: ['settings', 'profile'] as const,
    ai: ['settings', 'ai'] as const,
  },
};
