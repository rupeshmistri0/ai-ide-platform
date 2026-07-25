'use client';

import React from 'react';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { TaskKanban } from '@/features/workspace/task-kanban';
import { TaskModal } from '@/features/workspace/task-modal';
import { NewTaskDialog } from '@/features/workspace/new-task-dialog';
import { Badge } from '@/components/ui/badge';
import { Layers, CheckCircle2 } from 'lucide-react';

export default function WorkspacePage() {
  const { currentWorkspace, tasks } = useWorkspaceStore();
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-sm shadow-md">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {currentWorkspace.name}
              </h1>
              <Badge variant="indigo" className="text-[10px] uppercase">
                {currentWorkspace.plan}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Task delivery pipeline • {tasks.length} total tasks ({completedCount} completed)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NewTaskDialog />
        </div>
      </div>

      {/* Interactive Kanban Task Board */}
      <TaskKanban />

      {/* Task Detail Modal */}
      <TaskModal />
    </div>
  );
}
