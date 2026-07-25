'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/stores/use-chat-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Copy, Check, Code, ExternalLink } from 'lucide-react';

export function ArtifactDrawer() {
  const { isArtifactDrawerOpen, toggleArtifactDrawer, activeArtifactCode } = useChatStore();
  const [copied, setCopied] = useState(false);

  if (!isArtifactDrawerOpen || !activeArtifactCode) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeArtifactCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-96 border-l border-border bg-card/95 backdrop-blur-xl flex flex-col h-full z-20 shadow-xl transition-all duration-300">
      {/* Drawer Header */}
      <div className="flex h-12 items-center justify-between border-b border-border/80 px-4">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-bold text-foreground">
            {activeArtifactCode.filename || 'Generated Code Artifact'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title="Copy Code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleArtifactDrawer()}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="indigo" className="text-[10px] font-mono uppercase">
            {activeArtifactCode.language}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            Enterprise Module
          </span>
        </div>

        <pre className="rounded-xl border border-border/80 bg-slate-950 p-4 font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed">
          <code>{activeArtifactCode.code}</code>
        </pre>
      </div>
    </div>
  );
}
