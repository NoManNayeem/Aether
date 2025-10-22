import { useState, useEffect, useCallback } from 'react';
import { getAllConversations, saveConversation, deleteConversation, updateConversationTitle } from '@/lib/tauri/conversations';
import type { Conversation } from '@/lib/types';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllConversations();
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const addConversation = useCallback(async (conversation: Conversation) => {
    try {
      await saveConversation(conversation);
      await loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add conversation');
      throw err;
    }
  }, [loadConversations]);

  const removeConversation = useCallback(async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      await loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove conversation');
      throw err;
    }
  }, [loadConversations]);

  const updateTitle = useCallback(async (conversationId: string, title: string) => {
    try {
      await updateConversationTitle(conversationId, title);
      await loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update conversation title');
      throw err;
    }
  }, [loadConversations]);

  const updateConversation = useCallback(async (conversation: Conversation) => {
    try {
      await saveConversation(conversation);
      await loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update conversation');
      throw err;
    }
  }, [loadConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    addConversation,
    removeConversation,
    updateTitle,
    updateConversation,
    refresh: loadConversations,
  };
}
