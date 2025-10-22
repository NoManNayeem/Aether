import { useCallback } from 'react';
import { storeApiKey, deleteApiKey } from '@/lib/tauri/keyring';

export function useKeyring() {
  const storeKey = useCallback(async (providerId: string, apiKey: string) => {
    try {
      await storeApiKey(providerId, apiKey);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to store API key');
    }
  }, []);

  const removeKey = useCallback(async (providerId: string) => {
    try {
      await deleteApiKey(providerId);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete API key');
    }
  }, []);

  return {
    storeApiKey: storeKey,
    deleteApiKey: removeKey,
  };
}
