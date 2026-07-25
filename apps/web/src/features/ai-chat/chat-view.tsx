'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/stores/use-chat-store';
import { ModelSelector } from './model-selector';
import { PromptChips } from './prompt-chips';
import { ArtifactDrawer } from './artifact-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/use-auth-store';
import {
  Send,
  Plus,
  Sparkles,
  Bot,
  User as UserIcon,
  Code2,
  Copy,
  Check,
  Search,
  MessageSquare,
} from 'lucide-react';

export function ChatView() {
  const { user } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    selectConversation,
    sendMessage,
    isStreaming,
    toggleArtifactDrawer,
    createNewConversation,
  } = useChatStore();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  ) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleCopySnippet = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      {/* Left Chat Threads Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r border-border bg-card/40 p-3 space-y-3">
        <Button
          onClick={createNewConversation}
          variant="gradient"
          size="sm"
          className="w-full h-9 text-xs font-semibold gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>New AI Thread</span>
        </Button>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8 h-8 text-xs bg-background/50 border-border/80"
          />
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto pt-1">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground px-2">
            History
          </span>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={`flex w-full items-center gap-2 rounded-lg p-2 text-left text-xs transition-colors ${
                conv.id === activeConversationId
                  ? 'bg-primary/15 text-primary border border-primary/20 font-semibold'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span className="truncate flex-1">{conv.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Thread Area */}
      <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
        {/* Header Bar */}
        <div className="flex h-12 items-center justify-between border-b border-border/80 px-4 bg-card/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <ModelSelector />
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
              {activeConversation?.title}
            </span>
          </div>
          <Badge variant="indigo" className="text-[10px]">
            Streaming API Connected
          </Badge>
        </div>

        {/* Message Thread List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeConversation?.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/20 shadow-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Enterprise AI Reasoning Assistant
              </h3>
              <p className="text-xs text-muted-foreground">
                Ask architectural questions, request code refactoring, or generate Next.js 15 App Router components.
              </p>
              <PromptChips />
            </div>
          ) : (
            activeConversation?.messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${
                    isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'
                  }`}
                >
                  <Avatar className="h-8 w-8 shrink-0 border border-border">
                    {isAssistant ? (
                      <AvatarFallback className="bg-purple-600/20 text-purple-400">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarImage src={user?.avatarUrl} />
                    )}
                  </Avatar>

                  <div className="space-y-2 overflow-hidden">
                    <div
                      className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                        isAssistant
                          ? 'bg-card/90 border border-border/80 text-foreground'
                          : 'bg-primary text-primary-foreground font-medium'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {/* Generated Code Snippet Card */}
                      {msg.codeSnippet && (
                        <div className="mt-3 rounded-xl border border-border/80 bg-slate-950 p-3 space-y-2 font-mono text-[11px] text-slate-200">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                            <span className="flex items-center gap-1">
                              <Code2 className="h-3 w-3 text-purple-400" />
                              {msg.codeSnippet.filename || 'Code Snippet'}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleCopySnippet(msg.id, msg.codeSnippet!.code)}
                                className="hover:text-white flex items-center gap-1"
                              >
                                {copiedId === msg.id ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleArtifactDrawer(msg.codeSnippet)}
                                className="text-purple-400 hover:text-purple-300 font-sans text-[10px] font-semibold"
                              >
                                Open Artifact Drawer →
                              </button>
                            </div>
                          </div>
                          <pre className="overflow-x-auto">
                            <code>{msg.codeSnippet.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Live Streaming Loading Indicator */}
          {isStreaming && (
            <div className="flex gap-3 max-w-3xl mr-auto items-center text-xs text-purple-400 font-semibold animate-pulse">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-600/20 text-purple-400">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span>AI Agent is generating structured response...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-border/80 bg-card/60 backdrop-blur-md">
          <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Agent anything about Next.js 15, Zustand, TanStack Query..."
              className="flex-1 text-xs h-10 bg-background/80 border-border/80 shadow-inner"
            />
            <Button
              type="submit"
              disabled={isStreaming || !input.trim()}
              variant="gradient"
              className="h-10 px-4 text-xs font-semibold gap-1.5 shadow-lg shadow-purple-600/20"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Right Artifact Drawer */}
      <ArtifactDrawer />
    </div>
  );
}
