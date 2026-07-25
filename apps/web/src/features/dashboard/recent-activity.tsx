'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockProjects, mockActivities } from '@/lib/api-client';
import { ArrowUpRight, Clock, FolderGit2, CheckCircle } from 'lucide-react';

export function RecentActivity() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Active Projects Overview */}
      <Card className="lg:col-span-2 border-border/80">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold">
              Active Projects
            </CardTitle>
            <CardDescription className="text-xs">
              Monitored project repositories and delivery status
            </CardDescription>
          </div>
          <Link href="/workspace">
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
              <span>View Workspace</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-accent/20 p-3 hover:bg-accent/40 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <FolderGit2 className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="truncate text-xs font-semibold text-foreground">
                    {project.name}
                  </h4>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-foreground">
                    {project.progress}% completed
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {project.completedTasksCount} / {project.tasksCount} tasks
                  </span>
                </div>
                <Badge variant="success" className="text-[10px] px-2 py-0.5 font-medium">
                  {project.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity Log Feed */}
      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-400" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-xs">
            Live actions across team workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockActivities.map((act) => (
            <div key={act.id} className="flex items-start gap-2.5 text-xs">
              <Avatar className="h-7 w-7 mt-0.5 border border-border">
                <AvatarImage src={act.user.avatarUrl} />
                <AvatarFallback>{act.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs text-foreground">
                  <strong className="font-semibold">{act.user.name}</strong>{' '}
                  <span className="text-muted-foreground">{act.action}</span>{' '}
                  <span className="text-primary font-medium">{act.target}</span>
                </p>
                <span className="text-[10px] text-muted-foreground/70">
                  {act.timestamp}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
