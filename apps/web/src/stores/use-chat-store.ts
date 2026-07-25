import { create } from 'zustand';
import { ChatConversation, ChatMessage, AIModel } from '@/types';
import { mockConversations, mockAIModels } from '@/lib/api-client';

interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string;
  selectedModel: AIModel;
  isStreaming: boolean;
  isArtifactDrawerOpen: boolean;
  activeArtifactCode: { language: string; code: string; filename?: string } | null;
  selectConversation: (id: string) => void;
  setSelectedModel: (model: AIModel) => void;
  sendMessage: (content: string) => void;
  toggleArtifactDrawer: (code?: { language: string; code: string; filename?: string }) => void;
  createNewConversation: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: mockConversations,
  activeConversationId: mockConversations[0].id,
  selectedModel: mockAIModels[0],
  isStreaming: false,
  isArtifactDrawerOpen: false,
  activeArtifactCode: mockConversations[0].messages[1]?.codeSnippet || null,
  selectConversation: (id) => set({ activeConversationId: id }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  toggleArtifactDrawer: (code) =>
    set((state) => ({
      isArtifactDrawerOpen: code ? true : !state.isArtifactDrawerOpen,
      activeArtifactCode: code || state.activeArtifactCode,
    })),
  createNewConversation: () => {
    const newId = `conv_${Date.now()}`;
    const newConv: ChatConversation = {
      id: newId,
      title: 'New AI Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modelId: get().selectedModel.id,
      messages: [],
    };
    set((state) => ({
      conversations: [newConv, ...state.conversations],
      activeConversationId: newId,
    }));
  },
  sendMessage: (content) => {
    const { activeConversationId, conversations, selectedModel } = get();
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set({
      conversations: conversations.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, userMsg],
            updatedAt: new Date().toISOString(),
          };
        }
        return conv;
      }),
      isStreaming: true,
    });

    // Simulate AI Streaming response
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: `I've analyzed your query using **${selectedModel.name}** with ${selectedModel.contextWindow} context window. Here is a suggested production solution:`,
        timestamp: new Date().toISOString(),
        modelId: selectedModel.id,
        codeSnippet: {
          language: 'typescript',
          filename: 'src/lib/optimizations.ts',
          code: `// Processed via ${selectedModel.name}\nexport function optimizePipeline(data: unknown[]) {\n  console.log('Processing enterprise data pipeline...');\n  return data.map(item => ({ ...item, processed: true }));\n}`,
        },
      };

      set((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, assistantMsg],
            };
          }
          return conv;
        }),
        isStreaming: false,
      }));
    }, 1200);
  },
}));
