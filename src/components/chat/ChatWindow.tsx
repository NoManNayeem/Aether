'use client';

import { useAppStore } from '@/store/useAppStore';
import { useConversations } from '@/hooks/useConversations';
import { useChatStream } from '@/hooks/useChatStream';
import { useProviders } from '@/hooks/useProviders';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { StreamingIndicator } from './StreamingIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ChatMessage } from '@/lib/types';

export function ChatWindow() {
  const { 
    currentConversationId, 
    selectedProviderId, 
    setSelectedProviderId,
    currentConversation,
    setCurrentConversation
  } = useAppStore();
  
  const { conversations, addConversation, updateConversation } = useConversations();
  const { providers } = useProviders();
  const { isStreaming, currentResponse, sendMessage, reset } = useChatStream();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load conversation messages when conversation changes
  useEffect(() => {
    const loadConversation = () => {
      if (currentConversationId && conversations.length > 0) {
        const conversation = conversations.find(c => c.id === currentConversationId);
        if (conversation) {
          setCurrentConversation(conversation);
          setMessages(conversation.messages);
          
          // Restore the provider selection based on the conversation
          if (conversation.provider_id && conversation.provider_id !== selectedProviderId) {
            setSelectedProviderId(conversation.provider_id);
          }
        }
      } else {
        setCurrentConversation(null);
        setMessages([]);
      }
    };
    
    loadConversation();
  }, [currentConversationId, conversations, setCurrentConversation, selectedProviderId, setSelectedProviderId]);

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!selectedProviderId) {
      alert('Please select a provider first');
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

           // If no current conversation, create a new one
           let conversationId = currentConversationId;
           let currentConversationData = currentConversation;
           
           if (!conversationId) {
             // Get the provider to get the model
             const provider = providers.find(p => p.id === selectedProviderId);
             const modelUsed = provider?.default_model || 'unknown';
             
             const newConversation = {
               id: crypto.randomUUID(),
               title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
               messages: newMessages,
               provider_id: selectedProviderId,
               model_used: modelUsed,
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString(),
             };
             
             await addConversation(newConversation);
             conversationId = newConversation.id;
             currentConversationData = newConversation;
           }

           // Send to LLM
           try {
             let accumulatedResponse = '';
             
             await sendMessage(selectedProviderId, newMessages, async (chunk) => {
               if (!chunk.finished) {
                 accumulatedResponse += chunk.text;
               } else {
                 // Create the assistant message with the accumulated response
                 const assistantMessage: ChatMessage = {
                   role: 'assistant',
                   content: accumulatedResponse,
                   timestamp: new Date().toISOString(),
                 };
                 
                 const finalMessages = [...newMessages, assistantMessage];
                 setMessages(finalMessages);
                 
                 // Update the conversation in storage
                 if (conversationId && currentConversationData) {
                   const updatedConversation = {
                     ...currentConversationData,
                     messages: finalMessages,
                     updated_at: new Date().toISOString(),
                   };
                   
                   // Save the updated conversation
                   await updateConversation(updatedConversation);
                   setCurrentConversation(updatedConversation);
                   
                   // Update the conversation ID in the store if it's a new conversation
                   if (!currentConversationId) {
                     setCurrentConversationId(conversationId);
                   }
                 }
               }
             });
             
             reset();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Show empty state if no providers
  if (providers.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Welcome to Aether</CardTitle>
            <CardDescription>
              Get started by adding your first LLM provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-muted-foreground">
              <p className="mb-4">No providers configured yet.</p>
              <p className="text-sm">Add a provider to start chatting with AI models.</p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => window.location.href = '/settings'}
            >
              <Settings className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show provider selection if no provider selected
  if (!selectedProviderId) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Select a Provider</CardTitle>
            <CardDescription>
              Choose an LLM provider to start chatting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-muted-foreground">
              <p className="mb-4">No provider selected.</p>
              <p className="text-sm">Select a provider from the sidebar to start chatting.</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => window.location.href = '/settings'}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Providers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
             <div className="flex-1 overflow-hidden">
               <MessageList 
                 messages={messages} 
                 streamingMessage={isStreaming ? currentResponse : null}
                 isStreaming={isStreaming}
               />
             </div>
      
      {/* Status indicator */}
      {isStreaming && (
        <div className="border-t bg-muted/30">
          <StreamingIndicator 
            message="AI is responding..." 
            showCard={false}
          />
        </div>
      )}
      
      {/* Input */}
      <div className="border-t p-4">
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isStreaming || !selectedProviderId}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
