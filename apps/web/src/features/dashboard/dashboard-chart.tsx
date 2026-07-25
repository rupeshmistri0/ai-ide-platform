'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BarChart3 } from 'lucide-react';

export function DashboardChart() {
  const bars = [
    { day: 'Mon', height: '40%', tokens: '180K' },
    { day: 'Tue', height: '65%', tokens: '290K' },
    { day: 'Wed', height: '85%', tokens: '410K' },
    { day: 'Thu', height: '55%', tokens: '230K' },
    { day: 'Fri', height: '95%', tokens: '490K' },
    { day: 'Sat', height: '30%', tokens: '110K' },
    { day: 'Sun', height: '20%', tokens: '80K' },
  ];

  return (
    <Card className="col-span-full lg:col-span-2 border-border/80">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            AI Execution & Inference Velocity
          </CardTitle>
          <CardDescription className="text-xs">
            Daily token volume processed across Gemini Pro, Claude 3.5 & GPT-4o
          </CardDescription>
        </div>
        <Badge variant="indigo" className="text-xs">
          7-Day Activity
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex h-48 items-end gap-3 pt-6 pb-2 px-2 border-b border-border/60">
          {bars.map((bar, i) => (
            <div key={i} className="group relative flex flex-1 flex-col items-center gap-2 h-full justify-end">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 rounded bg-popover px-2 py-1 text-[10px] font-semibold text-popover-foreground border border-border shadow-md pointer-events-none">
                {bar.tokens}
              </div>

              {/* Bar */}
              <div
                style={{ height: bar.height }}
                className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 via-purple-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-400 transition-all duration-300 shadow-md shadow-purple-500/10"
              />
              <span className="text-[10px] font-medium text-muted-foreground">
                {bar.day}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            <span>Peak Token Volume: <strong className="text-foreground">490K / day</strong></span>
          </div>
          <span className="text-[11px] text-purple-400 font-semibold flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Average Latency: 140ms
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
