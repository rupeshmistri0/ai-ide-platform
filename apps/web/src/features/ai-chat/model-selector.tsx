'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/stores/use-chat-store';
import { mockAIModels } from '@/lib/api-client';
import { Sparkles, ChevronDown, Check } from 'lucide-react';

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChatStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-semibold border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{selectedModel.name}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {mockAIModels.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => setSelectedModel(model)}
            className="cursor-pointer flex items-start justify-between p-2.5"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-foreground">
                  {model.name}
                </span>
                {model.isPopular && (
                  <Badge variant="indigo" className="text-[9px] px-1 py-0">
                    Recommended
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {model.description}
              </p>
            </div>
            {model.id === selectedModel.id && (
              <Check className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
