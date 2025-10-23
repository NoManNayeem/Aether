'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export function ChatInput({ onSendMessage, disabled, isStreaming }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-background/80 backdrop-blur-sm border-t border-border/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (⏎ to send, ⇧⏎ for new line)"
              className="min-h-[80px] max-h-[200px] resize-none pr-24 py-4 px-4 rounded-2xl border-2 border-border/50 focus:border-primary/50 transition-all duration-200 focus:ring-4 focus:ring-primary/10 bg-card shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {isStreaming && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="text-xs font-medium">Responding</span>
                </div>
              )}
              {message.length > 0 && !isStreaming && (
                <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-muted">
                  {message.length}
                </span>
              )}
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={!message.trim() || disabled}
            size="icon"
            className="h-[80px] w-14 rounded-2xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:opacity-50 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {disabled ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Helpful hints */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">⏎</kbd>
              <span>Send</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">⇧⏎</kbd>
              <span>New line</span>
            </span>
          </div>
          {message.length > 500 && (
            <span className={`font-medium ${message.length > 1000 ? 'text-orange-500' : 'text-muted-foreground'}`}>
              {message.length > 1000 ? '⚠️ Long message' : ''}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
