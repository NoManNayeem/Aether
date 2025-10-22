import type { ChatMessage, ChatResponseChunk } from '@/lib/types';

// Extend Window interface for Tauri
declare global {
  interface Window {
    __TAURI__?: {
      invoke: (command: string, args?: Record<string, unknown>) => Promise<unknown>;
      listen: (event: string, handler: (event: { payload: unknown }) => void) => Promise<() => void>;
    };
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

export function startChatStream(
  providerId: string,
  messages: ChatMessage[],
  callback: (chunk: ChatResponseChunk) => void
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (!isTauriAvailable()) {
      console.warn('Tauri API is not available. Using browser fallback for chat.');
      
      // Try to make a direct HTTP request to the local LLM
      try {
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage) {
          throw new Error('No messages provided');
        }

        const response = await fetch('http://localhost:11434/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'phi3', // Default model
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            stream: true
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                callback({ text: '', finished: true });
                resolve();
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  callback({ text: content, finished: false });
                }
              } catch {
                // Ignore parsing errors for malformed JSON
              }
            }
          }
        }

        callback({ text: '', finished: true });
        resolve();
      } catch (error) {
        console.error('Failed to connect to local LLM:', error);
        // Fallback to demo response
        setTimeout(() => {
          callback({
            text: `Demo response: I'm running in browser mode. To use the local LLM, please ensure Docker Ollama is running on localhost:11434. Error: ${error}`,
            finished: true
          });
          resolve();
        }, 1000);
      }
      return;
    }

    try {
      const { invoke, Channel } = await import('@tauri-apps/api/core');
      
      const sender = new Channel<ChatResponseChunk>((chunk) => {
        callback(chunk);
        if (chunk.finished) {
          resolve();
        }
      });
      
      await invoke('handle_chat_stream', {
        providerId,
        messages,
        sender,
      });
    } catch (error) {
      console.error('Chat stream failed:', error);
      reject(error);
    }
  });
}
