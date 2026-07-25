'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { api, mockMetrics } from '@/lib/api-client';
import { DashboardStats } from '@/features/dashboard/dashboard-stats';
import { DashboardChart } from '@/features/dashboard/dashboard-chart';
import { RecentActivity } from '@/features/dashboard/recent-activity';

export default function DashboardPage() {
  const { data: metrics = mockMetrics } = useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: () => api.dashboard.getMetrics(),
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Executive Overview
          </h1>
          <p className="text-xs text-muted-foreground">
            Realtime metrics, AI tokens velocity, and project delivery pipeline
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <DashboardStats metrics={metrics} />

      {/* Analytics Visualizer Chart */}
      <DashboardChart />

      {/* Active Projects Table & Recent Feed */}
      <RecentActivity />
    </div>
  );
}
