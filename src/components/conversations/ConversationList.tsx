'use client';

import { useConversations } from '@/hooks/useConversations';
import { useAppStore } from '@/store/useAppStore';
import { ConversationItem } from './ConversationItem';
import { NewConversationButton } from './NewConversationButton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';

export function ConversationList() {
  const { conversations, loading, error } = useConversations();
  const { currentConversationId, setCurrentConversationId } = useAppStore();

  const handleNewConversation = () => {
    setCurrentConversationId(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Conversations</h3>
          <Button variant="outline" size="sm" disabled>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Conversations</h3>
          <Button variant="outline" size="sm" onClick={handleNewConversation}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        <div className="text-center py-8 text-red-500">
          <p>Error loading conversations: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Conversations</h3>
        <NewConversationButton />
      </div>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new conversation to begin</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={currentConversationId === conversation.id}
                onClick={() => setCurrentConversationId(conversation.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
