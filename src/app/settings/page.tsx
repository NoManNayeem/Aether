'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProviderList } from '@/components/providers/ProviderList';
import { TauriTest } from '@/components/debug/TauriTest';
import { DatabaseDebug } from '@/components/debug/DatabaseDebug';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your LLM providers and preferences</p>
          </div>
          
          <div className="space-y-6">
            {/* Providers Section */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>LLM Providers</CardTitle>
                  <CardDescription>
                    Configure your AI model providers and API keys
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ProviderList />
              </CardContent>
            </Card>
            
                   {/* Debug Section */}
                   <Card>
                     <CardHeader>
                       <CardTitle>Debug Information</CardTitle>
                       <CardDescription>
                         Tauri environment and API testing
                       </CardDescription>
                     </CardHeader>
                     <CardContent>
                       <TauriTest />
                     </CardContent>
                   </Card>
                   
                   {/* Database Debug Section */}
                   <Card>
                     <CardHeader>
                       <CardTitle>Database Persistence</CardTitle>
                       <CardDescription>
                         Test and monitor data persistence
                       </CardDescription>
                     </CardHeader>
                     <CardContent>
                       <DatabaseDebug />
                     </CardContent>
                   </Card>
            
            {/* App Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your Aether experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Theme</label>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Default Provider</label>
                    <p className="text-sm text-muted-foreground">Set your preferred default provider</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
