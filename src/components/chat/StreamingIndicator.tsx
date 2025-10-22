'use client';

import { Card } from '@/components/ui/card';
import { Bot, Loader2 } from 'lucide-react';

export function StreamingIndicator() {
  return (
    <div className="px-4 py-2 animate-fade-in">
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary animate-pulse-glow" />
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <span className="text-muted-foreground font-medium">AI is thinking...</span>
        </div>
      </Card>
    </div>
  );
}
