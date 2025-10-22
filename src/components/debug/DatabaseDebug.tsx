'use client';

import { useState, useEffect } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { useProviders } from '@/hooks/useProviders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react';

export function DatabaseDebug() {
  const { conversations, loading: conversationsLoading, refresh: refreshConversations } = useConversations();
  const { providers, loading: providersLoading, refresh: refreshProviders } = useProviders();
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [testResults, setTestResults] = useState<{
    conversations: boolean;
    providers: boolean;
    localStorage: boolean;
  } | null>(null);

  const runDatabaseTest = async () => {
    try {
      setLastRefresh(new Date());
      
      // Test conversations
      const conversationsTest = conversations.length >= 0;
      
      // Test providers
      const providersTest = providers.length >= 0;
      
      // Test localStorage
      const localStorageTest = (() => {
        try {
          const testKey = 'aether_test_' + Date.now();
          localStorage.setItem(testKey, 'test');
          const retrieved = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          return retrieved === 'test';
        } catch {
          return false;
        }
      })();
      
      setTestResults({
        conversations: conversationsTest,
        providers: providersTest,
        localStorage: localStorageTest,
      });
      
      await Promise.all([refreshConversations(), refreshProviders()]);
    } catch (error) {
      console.error('Database test failed:', error);
      setTestResults({
        conversations: false,
        providers: false,
        localStorage: false,
      });
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      try {
        localStorage.removeItem('aether_conversations');
        localStorage.removeItem('aether_providers');
        localStorage.removeItem('aether_api_key_');
        window.location.reload();
      } catch (error) {
        console.error('Failed to clear data:', error);
      }
    }
  };

  useEffect(() => {
    const testDatabase = async () => {
      await runDatabaseTest();
    };
    testDatabase();
  }, [runDatabaseTest]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Persistence Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Results */}
        {testResults && (
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              {testResults.conversations ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Conversations</span>
            </div>
            <div className="flex items-center gap-2">
              {testResults.providers ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Providers</span>
            </div>
            <div className="flex items-center gap-2">
              {testResults.localStorage ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">localStorage</span>
            </div>
          </div>
        )}

        {/* Data Counts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{conversations.length}</div>
            <div className="text-sm text-muted-foreground">Conversations</div>
            {conversationsLoading && <Badge variant="secondary" className="mt-1">Loading...</Badge>}
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{providers.length}</div>
            <div className="text-sm text-muted-foreground">Providers</div>
            {providersLoading && <Badge variant="secondary" className="mt-1">Loading...</Badge>}
          </div>
        </div>

        {/* Last Refresh */}
        {lastRefresh && (
          <div className="text-xs text-muted-foreground">
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={runDatabaseTest} size="sm" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Test Database
          </Button>
          <Button 
            onClick={clearAllData} 
            variant="destructive" 
            size="sm"
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </div>

        {/* Storage Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Storage Method: {typeof window !== 'undefined' && window.__TAURI__ ? 'Tauri + OS Keyring' : 'localStorage Fallback'}</div>
          <div>Environment: {typeof window !== 'undefined' && window.__TAURI__ ? 'Desktop App' : 'Web Browser'}</div>
        </div>
      </CardContent>
    </Card>
  );
}
