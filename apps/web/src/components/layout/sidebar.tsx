'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/use-ui-store';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  KanbanSquare,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Building2,
  Plus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Workspace',
    href: '/workspace',
    icon: KanbanSquare,
    badge: 'Pro',
  },
  {
    title: 'AI Assistant',
    href: '/ai-chat',
    icon: Bot,
    badge: 'AI 15.0',
    highlight: true,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { currentWorkspace, workspaces, setWorkspace } = useWorkspaceStore();

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-border bg-card/60 backdrop-blur-xl transition-all duration-300 z-30 select-none',
        isSidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Sidebar Header & Workspace Selector */}
      <div className="flex h-14 items-center justify-between border-b border-border/60 px-3">
        {!isSidebarCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center justify-between rounded-lg p-1.5 hover:bg-accent/60 transition-colors">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs shadow-sm">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="truncate text-xs font-semibold leading-none text-foreground">
                      {currentWorkspace.name}
                    </span>
                    <span className="truncate text-[10px] text-muted-foreground">
                      {currentWorkspace.plan.toUpperCase()} Plan
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel className="text-[11px]">Workspaces</DropdownMenuLabel>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.id}
                  onClick={() => setWorkspace(ws)}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs">{ws.name}</span>
                  </div>
                  {ws.id === currentWorkspace.id && (
                    <Badge variant="indigo" className="text-[9px] px-1 py-0">
                      Active
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-xs text-primary">
                <Plus className="mr-2 h-3.5 w-3.5" />
                <span>Create Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-sm">
            <Layers className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/25 shadow-sm'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                  item.highlight && !isActive && 'text-purple-400 hover:text-purple-300'
                )}
                title={isSidebarCollapsed ? item.title : undefined}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                    item.highlight && 'text-purple-400'
                  )}
                />

                {!isSidebarCollapsed && (
                  <div className="flex flex-1 items-center justify-between overflow-hidden">
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant={item.highlight ? 'indigo' : 'secondary'}
                        className="text-[9px] px-1.5 py-0 font-normal"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Token & Quota Visualizer in Footer */}
      {!isSidebarCollapsed && (
        <div className="m-2 rounded-lg border border-border/80 bg-accent/30 p-3">
          <div className="flex items-center justify-between text-[11px] font-medium mb-1">
            <span className="flex items-center gap-1 text-purple-400">
              <Sparkles className="h-3 w-3" /> AI Token Usage
            </span>
            <span className="text-muted-foreground">28%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-[28%] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">
            1.42M / 5.0M monthly quota
          </p>
        </div>
      )}

      {/* Collapse Toggle Button */}
      <div className="border-t border-border/60 p-2 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
