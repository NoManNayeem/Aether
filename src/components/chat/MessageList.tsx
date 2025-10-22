'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from './Message';
import type { ChatMessage } from '@/lib/types';
import { useEffect, useRef } from 'react';
import { MessageSquare, Bot, User } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  streamingMessage?: string | null;
  isStreaming?: boolean;
}

export function MessageList({ messages, streamingMessage, isStreaming }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, streamingMessage]);

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full">
      <div className="p-4 space-y-4">
        {messages.length === 0 && !streamingMessage && (
          <div className="text-center text-muted-foreground py-8 animate-fade-in">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-muted/50">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">Welcome to Aether</p>
                <p className="text-sm">Start a conversation by typing a message below.</p>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        
        {streamingMessage && (
          <Message 
            message={{
              role: 'assistant',
              content: streamingMessage,
              timestamp: new Date().toISOString(),
            }}
            isStreaming={isStreaming}
          />
        )}
        
        {/* Show thinking indicator when starting to stream but no content yet */}
        {isStreaming && !streamingMessage && (
          <div className="flex gap-3 animate-fade-in">
            <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
            </div>
            <div className="flex-1 p-4 bg-muted border rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary animate-pulse-glow" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
                <span className="font-medium">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
