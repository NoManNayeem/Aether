export type ProviderType = 'OpenAI' | 'Local';

export interface McpServerConfig {
  id: string;
  name: string;
  provider_type: ProviderType;
  endpoint_url?: string;
  default_model: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: string; // ISO string format
}

export interface ChatResponseChunk {
  text: string;
  finished: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  provider_id: string;
  model_used: string; // Store the model used for this conversation
  created_at: string;
  updated_at: string;
}

