'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';

export function TauriTest() {
  const [isTauri, setIsTauri] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [userAgent, setUserAgent] = useState<string>('');

  useEffect(() => {
    // Check if we're in Tauri environment
    const checkTauri = () => {
      try {
        // @ts-ignore
        return typeof window !== 'undefined' && window.__TAURI__;
      } catch {
        return false;
      }
    };
    
    setIsTauri(checkTauri());
    setUserAgent(typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A');
  }, []);

  const testTauriCommand = async () => {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const result = await invoke('get_all_providers');
      setTestResult(`Success: ${JSON.stringify(result)}`);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    }
  };

  const copyToClipboard = async () => {
    try {
      const debugInfo = {
        tauriEnvironment: isTauri,
        userAgent: userAgent,
        testResult: testResult,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'N/A'
      };
      
      await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Tauri Debug Test
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Tauri Environment:</strong> {isTauri ? '✅ Yes' : '❌ No'}
        </div>
        <div>
          <strong>User Agent:</strong> {userAgent}
        </div>
        <Button onClick={testTauriCommand} disabled={!isTauri}>
          Test Tauri Command
        </Button>
        {testResult && (
          <div className="p-2 bg-muted rounded text-sm">
            <strong>Result:</strong> {testResult}
          </div>
        )}
        {copied && (
          <div className="text-xs text-green-600">
            ✅ Debug info copied to clipboard!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
