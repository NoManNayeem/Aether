'use client';

import { McpServerConfig } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Key } from 'lucide-react';
import { useState } from 'react';
import { ProviderDialog } from './ProviderDialog';
import { useProviders } from '@/hooks/useProviders';

interface ProviderCardProps {
  provider: McpServerConfig;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const { deleteProvider } = useProviders();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${provider.name}"?`)) {
      setIsDeleting(true);
      try {
        await deleteProvider(provider.id);
      } catch (error) {
        console.error('Failed to delete provider:', error);
        alert('Failed to delete provider. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getProviderTypeColor = (type: string) => {
    switch (type) {
      case 'OpenAI':
        return 'bg-green-100 text-green-800';
      case 'Local':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base">{provider.name}</CardTitle>
              <CardDescription className="text-sm">
                {provider.endpoint_url || 'Default endpoint'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getProviderTypeColor(provider.provider_type)}>
                {provider.provider_type}
              </Badge>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Key className="h-3 w-3" />
              <span>API Key: ••••••••</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Model: {provider.default_model}
            </div>
          </div>
        </CardContent>
      </Card>

      <ProviderDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        provider={provider}
      />
    </>
  );
}
