'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useConversations } from '@/hooks/useConversations';
import { useProviders } from '@/hooks/useProviders';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  MessageSquare, 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Bot
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ConversationList() {
  const { 
    currentConversationId, 
    setCurrentConversationId, 
    selectedProviderId,
    setSelectedProviderId 
  } = useAppStore();
  
  const { conversations, removeConversation, updateTitle } = useConversations();
  const { providers } = useProviders();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleConversationClick = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    
    // Set the provider based on the conversation's provider_id
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedProviderId(conversation.provider_id);
    }
  };

  const handleStartEdit = (conversationId: string, currentTitle: string) => {
    setEditingId(conversationId);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = async () => {
    if (editingId && editTitle.trim()) {
      try {
        await updateTitle(editingId, editTitle.trim());
        setEditingId(null);
        setEditTitle('');
      } catch (error) {
        console.error('Failed to update conversation title:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      try {
        await removeConversation(conversationId);
        // If we're deleting the current conversation, clear the selection
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setSelectedProviderId(null);
  };

  const getProviderName = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider?.name || 'Unknown Provider';
  };

  const getProviderModel = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider?.default_model || 'Unknown Model';
  };

  return (
    <div className="space-y-2">
      {/* New Conversation Button */}
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={handleNewConversation}
      >
        <Plus className="h-4 w-4" />
        New Conversation
      </Button>

      {/* Conversations List */}
      <div className="space-y-1">
        {conversations.map((conversation) => (
          <Card
            key={conversation.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              currentConversationId === conversation.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <CardContent className="p-3">
              {editingId === conversation.id ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 h-8"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <h3 className="font-medium text-sm truncate">
                        {conversation.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Bot className="h-3 w-3" />
                      <span className="truncate">
                        {getProviderName(conversation.provider_id)} ({getProviderModel(conversation.provider_id)})
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(conversation.id, conversation.title);
                        }}
                      >
                        <Edit2 className="h-3 w-3 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {conversations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs">Start a new conversation to begin</p>
        </div>
      )}
    </div>
  );
}
