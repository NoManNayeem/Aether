import { useState, useCallback } from 'react';
import { startChatStream } from '@/lib/tauri/chat';
import type { ChatMessage, ChatResponseChunk } from '@/lib/types';

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    providerId: string,
    messages: ChatMessage[],
    onChunk?: (chunk: ChatResponseChunk) => void
  ) => {
    setIsStreaming(true);
    setCurrentResponse('');
    setError(null);

    try {
      await startChatStream(providerId, messages, (chunk) => {
        if (chunk.finished) {
          setIsStreaming(false);
        } else {
          setCurrentResponse(prev => prev + chunk.text);
        }
        onChunk?.(chunk);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsStreaming(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsStreaming(false);
    setCurrentResponse('');
    setError(null);
  }, []);

  return {
    isStreaming,
    currentResponse,
    error,
    sendMessage,
    reset,
  };
}
