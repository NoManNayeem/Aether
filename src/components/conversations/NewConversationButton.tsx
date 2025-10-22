'use client';

import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function NewConversationButton() {
  const { setCurrentConversationId } = useAppStore();

  const handleNewConversation = () => {
    setCurrentConversationId(null);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleNewConversation}
    >
      <Plus className="h-4 w-4 mr-1" />
      New
    </Button>
  );
}
