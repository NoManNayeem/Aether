'use client';

import { useProviders } from '@/hooks/useProviders';
import { ProviderCard } from './ProviderCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ProviderDialog } from './ProviderDialog';

export function ProviderList() {
  const { providers, loading, error } = useProviders();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Providers</h3>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Provider
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>Loading providers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Providers</h3>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Provider
          </Button>
        </div>
        <div className="text-center py-8 text-red-500">
          <p>Error loading providers: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Providers</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>
      
      {providers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No providers configured yet.</p>
          <p className="text-sm mt-2">Add your first provider to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}

      <ProviderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
