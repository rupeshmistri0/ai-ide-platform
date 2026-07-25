import { User } from './user';

export type ProjectStatus = 'active' | 'archived' | 'draft' | 'deleted';
export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
  id: string;
  workspaceId?: string;
  ownerId?: string;
  name: string;
  slug?: string;
  description?: string;
  repositoryUrl?: string;
  programmingLanguage?: string;
  status: ProjectStatus;
  progress: number;
  tasksCount: number;
  completedTasksCount: number;
  environmentConfig?: Record<string, any>;
  createdAt?: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
}
