export * from './types';
export * from './config';
export * from './http-client';
export * from './logger';

export interface AgentTask {
  id: string;
  instruction: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export class AgentEngine {
  constructor(private apiEndpoint: string) {}
  
  async executeTask(task: AgentTask): Promise<AgentTask> {
    console.log(`Executing task ${task.id} through ${this.apiEndpoint}`);
    return { ...task, status: 'completed' };
  }
}
