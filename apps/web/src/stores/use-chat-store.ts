import { create } from 'zustand';
import { ChatConversation, ChatMessage, AIModel } from '@/types';
import { mockConversations, mockAIModels } from '@/lib/api-client';
import { tokenStorage } from '@/lib/token-storage';

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
  sendMessage: async (content) => {
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

    try {
      const activeConv = get().conversations.find((c) => c.id === activeConversationId);
      if (!activeConv) throw new Error('Active thread not found');

      // Prepare payload formatting for the backend
      const formattedMessages = activeConv.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const token = tokenStorage.getAccessToken();
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(`${apiBase}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          model: selectedModel.id,
          messages: formattedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API responded with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('Readable stream not supported');

      const assistantMsgId = `msg_a_${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        modelId: selectedModel.id,
      };

      // Append assistant message shell
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
      }));

      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        const lines = textChunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.substring(6));
              if (parsed.error) {
                accumulatedText += `\n[Error: ${parsed.error}]`;
              } else if (parsed.token) {
                accumulatedText += parsed.token;
              }

              // Update the assistant message in the conversation store
              set((state) => ({
                conversations: state.conversations.map((conv) => {
                  if (conv.id === activeConversationId) {
                    return {
                      ...conv,
                      messages: conv.messages.map((m) =>
                        m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                      ),
                    };
                  }
                  return conv;
                }),
              }));
            } catch {
              // Ignore JSON parse errors for split/partial packages
            }
          }
        }
      }

      // On completion, extract any markdown code blocks as interactive artifacts
      const codeBlockMatch = accumulatedText.match(/```(\w+)?(?:\s+filename:\s*([^\n\s]+))?\n([\s\S]*?)```/);
      if (codeBlockMatch) {
        const language = codeBlockMatch[1] || 'typescript';
        const filename = codeBlockMatch[2] || 'code_artifact';
        const code = codeBlockMatch[3].trim();
        
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id === activeConversationId) {
              return {
                ...conv,
                messages: conv.messages.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        codeSnippet: { language, filename, code },
                      }
                    : m
                ),
              };
            }
            return conv;
          }),
        }));
      }

    } catch (err: any) {
      const errMsg = err.message || 'Error occurred';
      set((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: `msg_err_${Date.now()}`,
                  role: 'assistant',
                  content: `Failed to retrieve response from AI service: ${errMsg}`,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }
          return conv;
        }),
      }));
    } finally {
      set({ isStreaming: false });
    }
  },
}));
