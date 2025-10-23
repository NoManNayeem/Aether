'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from './Message';
import type { ChatMessage } from '@/lib/types';
import { useEffect, useRef } from 'react';
import { MessageSquare, Bot } from 'lucide-react';

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
    <ScrollArea ref={scrollAreaRef} className="h-full scrollbar-custom">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {messages.length === 0 && !streamingMessage && (
          <div className="text-center py-16 animate-fade-in">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
                <div className="relative p-6 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-border/50">
                  <MessageSquare className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="heading-2 gradient-text">Welcome to Aether</h2>
                <p className="body-normal text-muted-foreground max-w-md">
                  Start a conversation by typing a message below. I'm here to help with anything you need.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 w-full max-w-2xl">
                {[
                  { icon: '💡', text: 'Explain a concept' },
                  { icon: '✍️', text: 'Write content' },
                  { icon: '🔍', text: 'Research a topic' },
                  { icon: '💻', text: 'Code assistance' },
                ].map((suggestion, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-200 hover-lift cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <span className="body-small font-medium group-hover:text-primary transition-colors">
                        {suggestion.text}
                      </span>
                    </div>
                  </div>
                ))}
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
          <div className="flex gap-4 animate-scale-in">
            <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center ring-2 ring-accent/20">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 p-5 bg-card border border-border/50 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
                <span className="body-small font-semibold text-primary">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
