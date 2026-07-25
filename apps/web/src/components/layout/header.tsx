'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { UserNav } from '@/components/layout/user-nav';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Sparkles, Command } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-lg">
      {/* Left: Breadcrumbs navigation */}
      <div className="flex items-center gap-3">
        <Breadcrumbs />
      </div>

      {/* Middle: Search Bar / Quick Command Bar */}
      <div className="hidden md:flex items-center w-full max-w-sm relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects, tasks, AI models... (Ctrl + K)"
          className="pl-8 pr-12 h-8 text-xs bg-accent/30 border-border/80 focus:bg-background transition-all"
        />
        <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <Command className="h-2.5 w-2.5" /> K
        </div>
      </div>

      {/* Right: Actions, Notifications, Theme & Profile */}
      <div className="flex items-center gap-2">
        <Link href="/ai-chat">
          <Button
            variant="gradient"
            size="sm"
            className="h-8 gap-1.5 text-xs font-semibold px-3 shadow-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ask AI Agent</span>
          </Button>
        </Link>

        {/* Notifications Popover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between text-xs">
              <span>Notifications</span>
              <Badge variant="indigo" className="text-[9px] px-1 py-0">
                3 New
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-1 p-1 text-xs">
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1 p-2">
                <span className="font-semibold text-foreground">
                  AI Model Gemini 1.5 Pro Updated
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Context window expanded to 2M tokens.
                </span>
                <span className="text-[10px] text-muted-foreground/60">5m ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1 p-2">
                <span className="font-semibold text-foreground">
                  Task Assigned: Next.js 15 Migration
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Alex Rivera assigned you to App Router optimization.
                </span>
                <span className="text-[10px] text-muted-foreground/60">1h ago</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
        <div className="h-4 w-px bg-border mx-1" />
        <UserNav />
      </div>
    </header>
  );
}
