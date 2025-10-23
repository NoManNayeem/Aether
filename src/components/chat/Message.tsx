'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
// Temporarily disabled syntax highlighting to fix build issues
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { ChatMessage } from '@/lib/types';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function Message({ message, isStreaming = false }: MessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-slide-in`}>
      <Avatar className={`h-10 w-10 flex-shrink-0 ring-2 transition-all duration-200 ${
        isUser 
          ? 'ring-primary/20 hover:ring-primary/40' 
          : 'ring-accent/20 hover:ring-accent/40'
      }`}>
        <AvatarFallback className={`${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
        }`}>
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      
      <Card className={`flex-1 p-5 transition-all duration-300 group relative overflow-hidden ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 border-0' 
          : 'bg-card border border-border/50 hover:border-border hover:shadow-lg hover-lift'
      }`}>
        {/* Subtle gradient overlay for assistant messages */}
        {isAssistant && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
        <div className={`prose prose-sm max-w-none relative z-10 ${
          isUser 
            ? 'prose-invert' 
            : 'dark:prose-invert'
        } prose-headings:font-semibold prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:shadow-lg`}>
          {isAssistant ? (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative group/code">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto border border-slate-700 shadow-lg">
                        <code className={`language-${match[1]} text-sm font-mono`} {...props}>
                          {String(children).replace(/\n$/, '')}
                        </code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(String(children));
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity h-8 w-8 p-0 bg-slate-800 hover:bg-slate-700"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <code className={`${
                      isUser 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800'
                    } px-1.5 py-0.5 rounded text-sm font-mono`} {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote({ children }) {
                  return (
                    <blockquote className={`border-l-4 pl-4 italic ${
                      isUser 
                        ? 'border-white/40 text-white/90' 
                        : 'border-blue-500 text-slate-600 dark:text-slate-300'
                    }`}>
                      {children}
                    </blockquote>
                  );
                },
                ul({ children }) {
                  return <ul className="list-disc pl-6 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-6 space-y-1">{children}</ol>;
                },
                li({ children }) {
                  return <li className="leading-relaxed">{children}</li>;
                },
                p({ children }) {
                  return <p className="leading-relaxed mb-3 last:mb-0">{children}</p>;
                },
                h1({ children }) {
                  return <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-lg font-semibold mb-2 mt-3 first:mt-0">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-base font-semibold mb-2 mt-3 first:mt-0">{children}</h3>;
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600">
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className="border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-left font-semibold">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">
                      {children}
                    </td>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          )}
        </div>
        
        {isStreaming && (
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <div className="flex space-x-1">
              <div className={`w-2 h-2 rounded-full animate-bounce ${
                isUser ? 'bg-white/70' : 'bg-primary'
              }`} />
              <div className={`w-2 h-2 rounded-full animate-bounce ${
                isUser ? 'bg-white/70' : 'bg-primary'
              }`} style={{ animationDelay: '0.1s' }} />
              <div className={`w-2 h-2 rounded-full animate-bounce ${
                isUser ? 'bg-white/70' : 'bg-primary'
              }`} style={{ animationDelay: '0.2s' }} />
            </div>
            <span className={`text-xs font-medium ${
              isUser ? 'text-white/80' : 'text-muted-foreground'
            }`}>Generating response...</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 relative z-10">
          <div className={`text-xs font-medium ${
            isUser ? 'text-white/70' : 'text-muted-foreground'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
          
          {isAssistant && (
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 hover:bg-accent/10 hover:scale-110"
              title="Copy message"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
