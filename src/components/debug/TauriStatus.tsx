'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TauriStatus() {
  const [status, setStatus] = useState({
    isTauri: false,
    userAgent: '',
    error: null as string | null,
    testResult: null as string | null,
  });

  useEffect(() => {
    const checkTauri = () => {
      try {
        // @ts-ignore
        const isTauri = typeof window !== 'undefined' && window.__TAURI__;
        const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A';
        setStatus({ isTauri, userAgent, error: null, testResult: null });
      } catch (error) {
        setStatus(prev => ({ ...prev, error: String(error) }));
      }
    };
    
    checkTauri();
  }, []);

  const testTauriCommand = async () => {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const result = await invoke('get_all_providers');
      setStatus(prev => ({ ...prev, testResult: `Success: ${JSON.stringify(result)}` }));
    } catch (error) {
      setStatus(prev => ({ ...prev, testResult: `Error: ${error}` }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Tauri Status
          <Badge variant={status.isTauri ? "default" : "destructive"}>
            {status.isTauri ? "Connected" : "Not Connected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Environment:</strong> {status.isTauri ? "Tauri Desktop" : "Web Browser"}
          </div>
          <div>
            <strong>User Agent:</strong> {status.userAgent.slice(0, 50)}...
          </div>
        </div>
        
        {status.error && (
          <div className="p-2 bg-red-100 text-red-800 rounded text-sm">
            <strong>Error:</strong> {status.error}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button onClick={testTauriCommand} disabled={!status.isTauri} size="sm">
            Test Tauri Command
          </Button>
        </div>
        
        {status.testResult && (
          <div className="p-2 bg-gray-100 rounded text-sm">
            <strong>Result:</strong> {status.testResult}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
