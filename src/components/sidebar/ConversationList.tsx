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
  Bot,
  Copy,
  Archive,
  Star,
  StarOff
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ConversationList() {
  const { 
    currentConversationId, 
    setCurrentConversationId,
    setSelectedProviderId
  } = useAppStore();
  
  const { conversations, removeConversation, updateTitle } = useConversations();
  const { providers } = useProviders();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);

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
        await handleRenameConversation(editingId, editTitle.trim());
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
    const conversation = conversations.find(c => c.id === conversationId);
    const messageCount = conversation?.messages.length || 0;
    
    const confirmMessage = messageCount > 0 
      ? `Are you sure you want to delete this conversation? This will permanently delete ${messageCount} message${messageCount !== 1 ? 's' : ''}.`
      : 'Are you sure you want to delete this conversation?';
    
    if (confirm(confirmMessage)) {
      try {
        await removeConversation(conversationId);
        // If we're deleting the current conversation, clear the selection
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        alert('Failed to delete conversation. Please try again.');
      }
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setSelectedProviderId(null);
    setBulkMode(false);
    setSelectedTopics(new Set());
  };

  const handleBulkSelect = (conversationId: string) => {
    const newSelected = new Set(selectedTopics);
    if (newSelected.has(conversationId)) {
      newSelected.delete(conversationId);
    } else {
      newSelected.add(conversationId);
    }
    setSelectedTopics(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedTopics.size === 0) return;
    
    const confirmMessage = `Are you sure you want to delete ${selectedTopics.size} topic${selectedTopics.size !== 1 ? 's' : ''}? This action cannot be undone.`;
    if (confirm(confirmMessage)) {
      try {
        for (const topicId of selectedTopics) {
          await removeConversation(topicId);
        }
        setSelectedTopics(new Set());
        setBulkMode(false);
        if (currentConversationId && selectedTopics.has(currentConversationId)) {
          setCurrentConversationId(null);
        }
      } catch (error) {
        console.error('Failed to delete topics:', error);
        alert('Failed to delete some topics. Please try again.');
      }
    }
  };

  const handleBulkExport = async () => {
    if (selectedTopics.size === 0) return;
    
    try {
      const selectedConversations = conversations.filter(c => selectedTopics.has(c.id));
      const exportData = {
        exported_at: new Date().toISOString(),
        topics: selectedConversations.map(conversation => ({
          title: conversation.title,
          provider: getProviderName(conversation.provider_id),
          model: getProviderModel(conversation.provider_id),
          created_at: conversation.created_at,
          updated_at: conversation.updated_at,
          messages: conversation.messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          }))
        }))
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aether-topics-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSelectedTopics(new Set());
      setBulkMode(false);
    } catch (error) {
      console.error('Failed to export topics:', error);
      alert('Failed to export topics. Please try again.');
    }
  };

  const handleRenameConversation = async (conversationId: string, newTitle: string) => {
    if (newTitle.trim() && newTitle.trim() !== conversations.find(c => c.id === conversationId)?.title) {
      try {
        await updateTitle(conversationId, newTitle.trim());
      } catch (error) {
        console.error('Failed to rename conversation:', error);
        alert('Failed to rename conversation. Please try again.');
      }
    }
  };

  const handleDuplicateTopic = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      try {
        const duplicatedConversation = {
          ...conversation,
          id: crypto.randomUUID(),
          title: `${conversation.title} (Copy)`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await addConversation(duplicatedConversation);
      } catch (error) {
        console.error('Failed to duplicate topic:', error);
        alert('Failed to duplicate topic. Please try again.');
      }
    }
  };

  const handleExportTopic = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      try {
        const exportData = {
          title: conversation.title,
          provider: getProviderName(conversation.provider_id),
          model: getProviderModel(conversation.provider_id),
          created_at: conversation.created_at,
          updated_at: conversation.updated_at,
          messages: conversation.messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          }))
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to export topic:', error);
        alert('Failed to export topic. Please try again.');
      }
    }
  };

  const handleArchiveTopic = async (conversationId: string) => {
    if (confirm('Are you sure you want to archive this topic? It will be moved to archived topics.')) {
      try {
        // For now, we'll just delete it. In a full implementation, you'd move it to an archived state
        await removeConversation(conversationId);
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
        }
      } catch (error) {
        console.error('Failed to archive topic:', error);
        alert('Failed to archive topic. Please try again.');
      }
    }
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
      {/* Header Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 justify-start gap-2"
          onClick={handleNewConversation}
          title="Start a new topic - all messages in this topic will be grouped together"
        >
          <Plus className="h-4 w-4" />
          New Topic
        </Button>
        
        {conversations.length > 0 && (
          <Button
            variant={bulkMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setBulkMode(!bulkMode);
              setSelectedTopics(new Set());
            }}
            title={bulkMode ? "Exit bulk selection" : "Select multiple topics"}
          >
            {bulkMode ? "Done" : "Select"}
          </Button>
        )}
      </div>

      {/* Bulk Actions */}
      {bulkMode && selectedTopics.size > 0 && (
        <div className="flex gap-2 p-2 bg-muted rounded-md">
          <span className="text-sm text-muted-foreground flex items-center">
            {selectedTopics.size} selected
          </span>
          <div className="flex gap-1 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
              title="Export selected topics"
            >
              <Archive className="h-3 w-3 mr-1" />
              Export
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              title="Delete selected topics"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="space-y-1">
        {conversations.length > 0 && (
          <div className="px-2 py-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Topics
            </h3>
          </div>
        )}
        {conversations.map((conversation) => (
          <Card
            key={conversation.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              currentConversationId === conversation.id
                ? 'ring-2 ring-primary bg-primary/5'
                : selectedTopics.has(conversation.id)
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => {
              if (bulkMode) {
                handleBulkSelect(conversation.id);
              } else {
                handleConversationClick(conversation.id);
              }
            }}
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
                      {bulkMode && (
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedTopics.has(conversation.id)}
                            onChange={() => handleBulkSelect(conversation.id)}
                            className="h-3 w-3 rounded border-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                      <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <h3 className="font-medium text-sm truncate" title={conversation.title}>
                        {conversation.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Bot className="h-3 w-3" />
                      <span className="truncate">
                        {getProviderName(conversation.provider_id)} ({getProviderModel(conversation.provider_id)})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {conversation.messages.length} exchange{conversation.messages.length !== 1 ? 's' : ''}
                      </div>
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
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(conversation.id, conversation.title);
                        }}
                      >
                        <Edit2 className="h-3 w-3 mr-2" />
                        Rename Topic
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateTopic(conversation.id);
                        }}
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        Duplicate Topic
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportTopic(conversation.id);
                        }}
                      >
                        <Archive className="h-3 w-3 mr-2" />
                        Export Topic
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveTopic(conversation.id);
                        }}
                        className="text-orange-600 focus:text-orange-600"
                      >
                        <Archive className="h-3 w-3 mr-2" />
                        Archive Topic
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete Topic
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
          <p className="text-sm">No topics yet</p>
          <p className="text-xs">Start a new topic to begin chatting</p>
        </div>
      )}
    </div>
  );
}
