export interface AIModel {
  id: string;
  name: string;
  provider: 'Google' | 'Anthropic' | 'OpenAI' | 'DeepSeek';
  contextWindow: string;
  description: string;
  isPopular?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelId?: string;
  promptTokens?: number;
  completionTokens?: number;
  codeSnippet?: {
    language: string;
    code: string;
    filename?: string;
  };
  isStreaming?: boolean;
}

export interface ChatConversation {
  id: string;
  projectId?: string;
  title: string;
  modelId: string;
  messages: ChatMessage[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  quotaLimit: number;
  percentageUsed: number;
}
