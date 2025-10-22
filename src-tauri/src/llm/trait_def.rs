use async_trait::async_trait;
use tauri::ipc::Channel;
use crate::models::{ChatMessage, ChatResponseChunk, LLMError};

#[async_trait]
pub trait LLMProvider: Send + Sync {
    async fn stream_chat_completion(
        &self,
        messages: Vec<ChatMessage>,
        channel: Channel<ChatResponseChunk>,
    ) -> Result<(), LLMError>;
    
}
