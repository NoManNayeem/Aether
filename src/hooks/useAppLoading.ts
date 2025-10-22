import { useState, useEffect } from 'react';
import { useProviders } from './useProviders';
import { useConversations } from './useConversations';

export function useAppLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  
  const { loading: providersLoading } = useProviders();
  const { loading: conversationsLoading } = useConversations();

  useEffect(() => {
    const checkLoadingState = () => {
      const steps = [
        { message: 'Initializing Aether', progress: 20 },
        { message: 'Loading providers', progress: 40 },
        { message: 'Loading conversations', progress: 60 },
        { message: 'Preparing interface', progress: 80 },
        { message: 'Ready to launch', progress: 100 },
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setLoadingMessage(steps[currentStep].message);
          setLoadingProgress(steps[currentStep].progress);
          currentStep++;
        } else {
          clearInterval(interval);
          // Wait a bit more for actual data loading
          if (!providersLoading && !conversationsLoading) {
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }
        }
      }, 300);

      return () => clearInterval(interval);
    };

    const timeoutId = setTimeout(checkLoadingState, 100);
    return () => clearTimeout(timeoutId);
  }, [providersLoading, conversationsLoading]);

  return {
    isLoading,
    loadingProgress,
    loadingMessage,
  };
}
