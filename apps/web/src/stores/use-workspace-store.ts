import { create } from 'zustand';
import { Workspace, Project, Task } from '@/types';
import { mockWorkspaces, mockProjects, mockTasks } from '@/lib/api-client';

interface WorkspaceState {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  projects: Project[];
  tasks: Task[];
  activeTask: Task | null;
  setWorkspace: (workspace: Workspace) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  setActiveTask: (task: Task | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: mockWorkspaces[0],
  workspaces: mockWorkspaces,
  projects: mockProjects,
  tasks: mockTasks,
  activeTask: null,
  setWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    })),
  addTask: (newTaskData) =>
    set((state) => {
      const newTask: Task = {
        ...newTaskData,
        id: `task_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return { tasks: [newTask, ...state.tasks] };
    }),
  setActiveTask: (task) => set({ activeTask: task }),
}));
