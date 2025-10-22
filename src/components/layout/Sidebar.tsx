'use client';

import { useAppStore } from '@/store/useAppStore';
import { useProviders } from '@/hooks/useProviders';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { ConversationList } from '@/components/sidebar/ConversationList';

export function Sidebar() {
  const { selectedProviderId, setSelectedProviderId } = useAppStore();
  const { providers, loading: providersLoading } = useProviders();

  const handleSelectProvider = (id: string) => {
    setSelectedProviderId(id);
  };

  return (
    <div className="flex flex-col h-full bg-muted/50 border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Aether</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.location.href = '/settings'}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Provider Selection */}
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium mb-2">Provider</h3>
        <div className="space-y-2">
          {providersLoading ? (
            <div className="text-sm text-muted-foreground">Loading providers...</div>
          ) : providers.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              <div>No providers configured</div>
              <div className="text-xs mt-1">
                <a href="/settings" className="text-primary hover:underline">
                  Add a provider
                </a>
              </div>
            </div>
          ) : (
            providers.map((provider) => (
              <Button
                key={provider.id}
                variant={selectedProviderId === provider.id ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => handleSelectProvider(provider.id)}
              >
                {provider.name}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 p-4">
        <ConversationList />
      </div>
    </div>
  );
}
