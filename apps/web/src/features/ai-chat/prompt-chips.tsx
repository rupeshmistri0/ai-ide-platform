'use client';

import React from 'react';
import { useChatStore } from '@/stores/use-chat-store';
import { Sparkles, Code2, Database, Shield } from 'lucide-react';

const suggestedPrompts = [
  {
    icon: Code2,
    label: 'Next.js 15 App Router Architecture',
    prompt: 'Explain the enterprise directory structure for Next.js 15 App Router with domain-driven feature modules.',
  },
  {
    icon: Database,
    label: 'TanStack Query v5 Key Factories',
    prompt: 'How to implement type-safe query key factories with TanStack Query v5 in React?',
  },
  {
    icon: Sparkles,
    label: 'Zustand Global State Store Slices',
    prompt: 'Create a Zustand store slice with TypeScript interfaces for workspace and task management.',
  },
];

export function PromptChips() {
  const { sendMessage } = useChatStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-4">
      {suggestedPrompts.map((chip, i) => {
        const Icon = chip.icon;
        return (
          <button
            key={i}
            onClick={() => sendMessage(chip.prompt)}
            className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card/60 p-3 text-left transition-all hover:border-primary/50 hover:bg-accent/40 hover:shadow-md group"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground block">
                {chip.label}
              </span>
              <span className="text-[10px] text-muted-foreground line-clamp-1">
                Click to send prompt
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
