'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task } from '@/types';
import { Clock, Tag } from 'lucide-react';

export function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  const priorityColors: Record<Task['priority'], 'default' | 'warning' | 'destructive' | 'indigo'> = {
    low: 'default',
    medium: 'indigo',
    high: 'warning',
    urgent: 'destructive',
  };

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer border-border/80 p-3 hover:border-primary/50 hover:shadow-md transition-all space-y-2.5 bg-card/90"
    >
      <div className="flex items-center justify-between">
        <Badge variant={priorityColors[task.priority]} className="text-[10px] px-1.5 py-0 uppercase">
          {task.priority}
        </Badge>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {task.dueDate}
          </span>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold text-foreground leading-snug">
          {task.title}
        </h4>
        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
          {task.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <div className="flex items-center gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-accent/60 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {task.assignee && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatarUrl} />
            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </Card>
  );
}
