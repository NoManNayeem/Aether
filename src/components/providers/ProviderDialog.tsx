'use client';

import { useState, useEffect } from 'react';
import { McpServerConfig, ProviderType } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProviders } from '@/hooks/useProviders';
import { useKeyring } from '@/hooks/useKeyring';

interface ProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider?: McpServerConfig;
}

export function ProviderDialog({ open, onOpenChange, provider }: ProviderDialogProps) {
  const { saveProvider, updateProvider } = useProviders();
  const { storeApiKey } = useKeyring();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    provider_type: 'OpenAI' as ProviderType,
    endpoint_url: '',
    default_model: '',
    api_key: '',
  });

  const isEditing = !!provider;

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name,
        provider_type: provider.provider_type,
        endpoint_url: provider.endpoint_url || '',
        default_model: provider.default_model,
        api_key: '', // Never show existing API key
      });
    } else {
      setFormData({
        name: '',
        provider_type: 'OpenAI',
        endpoint_url: '',
        default_model: '',
        api_key: '',
      });
    }
  }, [provider, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const providerData: McpServerConfig = {
        id: provider?.id || crypto.randomUUID(),
        name: formData.name,
        provider_type: formData.provider_type,
        endpoint_url: formData.endpoint_url || undefined,
        default_model: formData.default_model,
      };

      if (isEditing) {
        await updateProvider(providerData);
      } else {
        await saveProvider(providerData);
      }

      // Store API key separately if provided
      if (formData.api_key.trim()) {
        await storeApiKey(providerData.id, formData.api_key);
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save provider:', error);
      alert('Failed to save provider. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDefaultEndpoint = (type: ProviderType) => {
    switch (type) {
      case 'OpenAI':
        return 'https://api.openai.com/v1/chat/completions';
      case 'Local':
        return 'http://localhost:8000/v1/chat/completions';
      default:
        return '';
    }
  };

  const getDefaultModel = (type: ProviderType) => {
    switch (type) {
      case 'OpenAI':
        return 'gpt-4o';
      case 'Local':
        return 'local-model';
      default:
        return '';
    }
  };

  const handleProviderTypeChange = (type: ProviderType) => {
    setFormData(prev => ({
      ...prev,
      provider_type: type,
      endpoint_url: getDefaultEndpoint(type),
      default_model: getDefaultModel(type),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Provider' : 'Add New Provider'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update your provider configuration.' 
                : 'Configure a new LLM provider for Aether.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Provider Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My OpenAI Provider"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider_type">Provider Type</Label>
              <Select
                value={formData.provider_type}
                onValueChange={handleProviderTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OpenAI">OpenAI</SelectItem>
                  <SelectItem value="Local">Local (OpenAI-compatible)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint_url">Endpoint URL</Label>
              <Input
                id="endpoint_url"
                value={formData.endpoint_url}
                onChange={(e) => setFormData(prev => ({ ...prev, endpoint_url: e.target.value }))}
                placeholder={getDefaultEndpoint(formData.provider_type)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use the default endpoint for this provider type.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_model">Default Model</Label>
              <Input
                id="default_model"
                value={formData.default_model}
                onChange={(e) => setFormData(prev => ({ ...prev, default_model: e.target.value }))}
                placeholder={getDefaultModel(formData.provider_type)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api_key">API Key</Label>
              <Input
                id="api_key"
                type="password"
                value={formData.api_key}
                onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                placeholder={isEditing ? 'Enter new API key to update' : 'Enter your API key'}
              />
              <p className="text-xs text-muted-foreground">
                {isEditing 
                  ? 'Leave empty to keep the existing API key.' 
                  : 'Your API key will be stored securely in the system keyring.'
                }
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Provider' : 'Add Provider')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
