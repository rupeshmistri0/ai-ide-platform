'use client';

import React from 'react';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { TaskCard } from './task-card';
import { TaskStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { CircleDot, Clock, Eye, CheckCircle2 } from 'lucide-react';

const columns: { id: TaskStatus; title: string; icon: any; badgeColor: any }[] = [
  { id: 'backlog', title: 'Backlog', icon: CircleDot, badgeColor: 'default' },
  { id: 'in_progress', title: 'In Progress', icon: Clock, badgeColor: 'warning' },
  { id: 'in_review', title: 'In Review', icon: Eye, badgeColor: 'indigo' },
  { id: 'completed', title: 'Completed', icon: CheckCircle2, badgeColor: 'success' },
];

export function TaskKanban() {
  const { tasks, setActiveTask } = useWorkspaceStore();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 items-start">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const Icon = column.icon;

        return (
          <div
            key={column.id}
            className="flex flex-col rounded-xl border border-border/60 bg-accent/10 p-3 min-h-[450px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">
                  {column.title}
                </span>
              </div>
              <Badge variant={column.badgeColor} className="text-[10px] px-1.5 py-0">
                {columnTasks.length}
              </Badge>
            </div>

            {/* Task List */}
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border/60 text-[11px] text-muted-foreground">
                  No tasks in column
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setActiveTask(task)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
