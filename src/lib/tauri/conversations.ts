import type { Conversation } from '@/lib/types';

// Extend Window interface for Tauri
declare global {
  interface Window {
    __TAURI__?: any;
  }
}

// Check if Tauri is available
const isTauriAvailable = () => {
  try {
    return typeof window !== 'undefined' && window.__TAURI__;
  } catch {
    return false;
  }
};

// Fallback storage for browser mode
const fallbackConversationStorage = {
  conversations: [] as Conversation[],
         save: (conversation: Conversation) => {
           const existing = fallbackConversationStorage.conversations.findIndex(c => c.id === conversation.id);
           if (existing >= 0) {
             fallbackConversationStorage.conversations[existing] = conversation;
           } else {
             // Ensure model_used is set for new conversations
             const conversationWithModel = {
               ...conversation,
               model_used: conversation.model_used || 'unknown'
             };
             fallbackConversationStorage.conversations.push(conversationWithModel);
           }
           localStorage.setItem('aether_conversations', JSON.stringify(fallbackConversationStorage.conversations));
         },
  load: () => {
    try {
      const stored = localStorage.getItem('aether_conversations');
      if (stored) {
        fallbackConversationStorage.conversations = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load conversations from localStorage:', e);
    }
    return fallbackConversationStorage.conversations.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  },
  delete: (id: string) => {
    fallbackConversationStorage.conversations = fallbackConversationStorage.conversations.filter(c => c.id !== id);
    localStorage.setItem('aether_conversations', JSON.stringify(fallbackConversationStorage.conversations));
  },
  updateTitle: (id: string, title: string) => {
    const conversation = fallbackConversationStorage.conversations.find(c => c.id === id);
    if (conversation) {
      conversation.title = title;
      conversation.updated_at = new Date().toISOString();
      localStorage.setItem('aether_conversations', JSON.stringify(fallbackConversationStorage.conversations));
    }
  }
};

// Safe invoke function with error handling
const safeInvoke = async <T = any>(command: string, args?: any): Promise<T> => {
  if (!isTauriAvailable()) {
    // Use fallback storage when not in Tauri environment
    console.warn('Tauri API is not available. Using localStorage fallback for conversations.');
    
    if (command === 'get_all_conversations') {
      return fallbackConversationStorage.load() as T;
    } else if (command === 'save_conversation') {
      fallbackConversationStorage.save(args.conversation);
      return undefined as T;
    } else if (command === 'delete_conversation') {
      fallbackConversationStorage.delete(args.conversationId);
      return undefined as T;
    } else if (command === 'update_conversation_title') {
      fallbackConversationStorage.updateTitle(args.conversationId, args.title);
      return undefined as T;
    }
    
    return undefined as T;
  }
  
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<T>(command, args);
  } catch (error) {
    console.error(`Tauri command '${command}' failed:`, error);
    throw error;
  }
};

export async function saveConversation(conversation: Conversation): Promise<void> {
  return safeInvoke('save_conversation', { conversation });
}

export async function getAllConversations(): Promise<Conversation[]> {
  return safeInvoke('get_all_conversations');
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  return safeInvoke('get_conversation', { conversationId });
}

export async function deleteConversation(conversationId: string): Promise<void> {
  return safeInvoke('delete_conversation', { conversationId });
}

export async function updateConversationTitle(conversationId: string, title: string): Promise<void> {
  return safeInvoke('update_conversation_title', { conversationId, title });
}
