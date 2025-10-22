import type { McpServerConfig } from '@/lib/types';
import './index';

// Check if Tauri is available
const isTauriAvailable = () => {
  try {
    return typeof window !== 'undefined' && window.__TAURI__;
  } catch {
    return false;
  }
};

// Fallback storage for browser mode
const fallbackStorage = {
  providers: [] as McpServerConfig[],
  save: (config: McpServerConfig) => {
    const existing = fallbackStorage.providers.findIndex(p => p.id === config.id);
    if (existing >= 0) {
      fallbackStorage.providers[existing] = config;
    } else {
      fallbackStorage.providers.push(config);
    }
    localStorage.setItem('aether_providers', JSON.stringify(fallbackStorage.providers));
  },
  load: () => {
    try {
      const stored = localStorage.getItem('aether_providers');
      if (stored) {
        fallbackStorage.providers = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load providers from localStorage:', e);
    }
    return fallbackStorage.providers;
  },
  delete: (id: string) => {
    fallbackStorage.providers = fallbackStorage.providers.filter(p => p.id !== id);
    localStorage.setItem('aether_providers', JSON.stringify(fallbackStorage.providers));
  }
};

// Safe invoke function with error handling
const safeInvoke = async <T = unknown>(command: string, args?: Record<string, unknown>): Promise<T> => {
  if (!isTauriAvailable()) {
    // Use fallback storage when not in Tauri environment
    console.warn('Tauri API is not available. Using localStorage fallback.');
    
    if (command === 'get_all_providers') {
      return fallbackStorage.load() as T;
    } else if (command === 'save_provider_config') {
      if (args && args.config) {
        fallbackStorage.save(args.config as McpServerConfig);
      }
      return undefined as T;
    } else if (command === 'delete_provider') {
      if (args && args.providerId) {
        fallbackStorage.delete(args.providerId as string);
      }
      return undefined as T;
    } else if (command === 'update_provider_config') {
      if (args && args.config) {
        fallbackStorage.save(args.config as McpServerConfig);
      }
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

export async function saveProviderConfig(config: McpServerConfig): Promise<void> {
  return safeInvoke('save_provider_config', { config });
}

export async function getAllProviders(): Promise<McpServerConfig[]> {
  return safeInvoke('get_all_providers');
}

export async function deleteProvider(providerId: string): Promise<void> {
  return safeInvoke('delete_provider', { providerId });
}

export async function updateProviderConfig(config: McpServerConfig): Promise<void> {
  return safeInvoke('update_provider_config', { config });
}
