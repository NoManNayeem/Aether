import { useState, useEffect, useCallback } from 'react';
import { getAllProviders, saveProviderConfig, deleteProvider, updateProviderConfig } from '@/lib/tauri/providers';
import type { McpServerConfig } from '@/lib/types';

export function useProviders() {
  const [providers, setProviders] = useState<McpServerConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProviders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllProviders();
      setProviders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load providers');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProvider = useCallback(async (config: McpServerConfig) => {
    try {
      await saveProviderConfig(config);
      await loadProviders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add provider');
      throw err;
    }
  }, [loadProviders]);

  const removeProvider = useCallback(async (providerId: string) => {
    try {
      await deleteProvider(providerId);
      await loadProviders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove provider');
      throw err;
    }
  }, [loadProviders]);

  const editProvider = useCallback(async (config: McpServerConfig) => {
    try {
      await updateProviderConfig(config);
      await loadProviders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update provider');
      throw err;
    }
  }, [loadProviders]);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  return {
    providers,
    loading,
    error,
    saveProvider: addProvider,
    deleteProvider: removeProvider,
    updateProvider: editProvider,
    refresh: loadProviders,
  };
}
