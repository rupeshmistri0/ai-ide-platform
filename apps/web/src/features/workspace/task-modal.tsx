'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { TaskStatus } from '@/types';
import { Clock, User, CheckCircle2 } from 'lucide-react';

export function TaskModal() {
  const { activeTask, setActiveTask, updateTaskStatus } = useWorkspaceStore();

  if (!activeTask) return null;

  const handleStatusChange = (status: TaskStatus) => {
    updateTaskStatus(activeTask.id, status);
    setActiveTask(null);
  };

  return (
    <Dialog open={!!activeTask} onOpenChange={() => setActiveTask(null)}>
      <DialogContent className="sm:max-w-lg border-border/80 bg-card">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="indigo" className="text-[10px]">
              Task #{activeTask.id}
            </Badge>
            <Badge variant="outline" className="text-[10px] uppercase font-semibold">
              Priority: {activeTask.priority}
            </Badge>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            {activeTask.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {activeTask.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 border-t border-b border-border/60 my-2 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> Assignee
              </span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={activeTask.assignee?.avatarUrl} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">
                  {activeTask.assignee?.name || 'Unassigned'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Due Date
              </span>
              <span className="font-medium text-foreground">
                {activeTask.dueDate || 'No due date'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-muted-foreground">Move Status:</span>
            <div className="flex flex-wrap gap-2">
              {(['backlog', 'in_progress', 'in_review', 'completed'] as TaskStatus[]).map(
                (status) => (
                  <Button
                    key={status}
                    variant={activeTask.status === status ? 'gradient' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    className="h-7 text-[11px] capitalize"
                  >
                    {status.replace('_', ' ')}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
