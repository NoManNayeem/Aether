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
    <header className="glass-strong border-b border-border/50 sticky top-0 z-50">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-6 flex-1">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg blur opacity-50" />
              <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            </div>
            <h1 className="heading-3 gradient-text">Aether</h1>
          </div>
          
          {/* Provider Selection */}
          {!loading && providers.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="h-6 w-px bg-border/50" />
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedProviderId || ''} onValueChange={handleProviderChange}>
                  <SelectTrigger className="w-[220px] border-border/50 hover:border-primary/50 transition-colors bg-card/50">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span>{provider.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleHomeClick}
            className={`rounded-xl transition-all duration-200 hover-lift ${
              pathname === '/' 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'hover:bg-accent/10'
            }`}
            title="Home"
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSettingsClick}
            className={`rounded-xl transition-all duration-200 hover-lift ${
              pathname === '/settings' 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'hover:bg-accent/10'
            }`}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
