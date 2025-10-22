'use client';

import { useAppStore } from '@/store/useAppStore';
import { useProviders } from '@/hooks/useProviders';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Home } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  const { selectedProviderId, setSelectedProviderId } = useAppStore();
  const { providers, loading } = useProviders();
  const router = useRouter();
  const pathname = usePathname();

  const handleProviderChange = (providerId: string) => {
    setSelectedProviderId(providerId);
  };

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-lg font-semibold">Aether</h1>
          
          {!loading && providers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Provider:</span>
              <Select value={selectedProviderId || ''} onValueChange={handleProviderChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleHomeClick}
            className={pathname === '/' ? 'bg-primary text-primary-foreground' : ''}
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleSettingsClick}
            className={pathname === '/settings' ? 'bg-primary text-primary-foreground' : ''}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
