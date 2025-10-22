import { create } from 'zustand';
import type { Conversation, McpServerConfig } from '@/lib/types';

interface AppState {
  // Current conversation
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  
  // Selected provider
  selectedProviderId: string | null;
  setSelectedProviderId: (id: string | null) => void;
  
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Message buffer for active stream
  streamingMessage: string;
  setStreamingMessage: (message: string) => void;
  appendToStreamingMessage: (text: string) => void;
  clearStreamingMessage: () => void;
  
  // Current conversation data
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  
  // Current provider data
  currentProvider: McpServerConfig | null;
  setCurrentProvider: (provider: McpServerConfig | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Current conversation
  currentConversationId: null,
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  
  // Selected provider
  selectedProviderId: null,
  setSelectedProviderId: (id) => set({ selectedProviderId: id }),
  
  // UI state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // Message buffer for active stream
  streamingMessage: '',
  setStreamingMessage: (message) => set({ streamingMessage: message }),
  appendToStreamingMessage: (text) => set((state) => ({ 
    streamingMessage: state.streamingMessage + text 
  })),
  clearStreamingMessage: () => set({ streamingMessage: '' }),
  
  // Current conversation data
  currentConversation: null,
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  
  // Current provider data
  currentProvider: null,
  setCurrentProvider: (provider) => set({ currentProvider: provider }),
}));
