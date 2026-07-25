'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, CheckSquare, Sparkles, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { DashboardMetrics } from '@/types';

export function DashboardStats({ metrics }: { metrics: DashboardMetrics }) {
  const statCards = [
    {
      title: 'Active Projects',
      value: metrics.totalProjects,
      change: '+14%',
      period: 'vs last month',
      icon: FolderKanban,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Pending Tasks',
      value: metrics.activeTasks,
      change: '8 Urgent',
      period: 'requires review',
      icon: CheckSquare,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'AI Tokens Consumed',
      value: `${(metrics.aiTokensUsed / 1000000).toFixed(2)}M`,
      change: '28% quota',
      period: '5.0M monthly limit',
      icon: Sparkles,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Team Members',
      value: metrics.teamMembers,
      change: '+3 new',
      period: 'active this week',
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="relative overflow-hidden border-border/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {stat.title}
                </span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium border-border/80">
                  <TrendingUp className="mr-1 h-3 w-3 text-emerald-400" />
                  {stat.change}
                </Badge>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {stat.period}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
