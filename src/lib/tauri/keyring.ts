// Extend Window interface for Tauri
declare global {
  interface Window {
    __TAURI__?: any;
  }
}

// Check if Tauri is available
const isTauriAvailable = () => {
  try {
    return typeof window !== 'undefined' && window.__TAURI__;
  } catch {
    return false;
  }
};

// Fallback storage for browser mode
const fallbackKeyring = {
  save: (providerId: string, apiKey: string) => {
    try {
      localStorage.setItem(`aether_api_key_${providerId}`, apiKey);
    } catch (e) {
      console.warn('Failed to save API key to localStorage:', e);
    }
  },
  delete: (providerId: string) => {
    try {
      localStorage.removeItem(`aether_api_key_${providerId}`);
    } catch (e) {
      console.warn('Failed to delete API key from localStorage:', e);
    }
  }
};

// Safe invoke function with error handling
const safeInvoke = async <T = any>(command: string, args?: any): Promise<T> => {
  if (!isTauriAvailable()) {
    // Use fallback storage when not in Tauri environment
    console.warn('Tauri API is not available. Using localStorage fallback for keyring.');
    
    if (command === 'store_api_key') {
      fallbackKeyring.save(args.providerId, args.apiKey);
      return undefined as T;
    } else if (command === 'delete_api_key') {
      fallbackKeyring.delete(args.providerId);
      return undefined as T;
    }
    
    return undefined as T;
  }
  
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<T>(command, args);
  } catch (error) {
    console.error(`Tauri command '${command}' failed:`, error);
    throw error;
  }
};

export async function storeApiKey(providerId: string, apiKey: string): Promise<void> {
  return safeInvoke('store_api_key', { providerId, apiKey });
}

export async function deleteApiKey(providerId: string): Promise<void> {
  return safeInvoke('delete_api_key', { providerId });
}
