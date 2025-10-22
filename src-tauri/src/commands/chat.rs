use tauri::{command, AppHandle};
use crate::models::{ChatMessage, ChatResponseChunk};
use crate::keyring::get_api_key;
use crate::llm::factory::create_provider;
use crate::config_store::PROVIDERS;

#[command]
pub async fn handle_chat_stream(
    _app: AppHandle,
    provider_id: String,
    messages: Vec<ChatMessage>,
    sender: tauri::ipc::Channel<ChatResponseChunk>,
) -> Result<(), String> {
    // 1. Retrieve Config from in-memory storage
    let config = {
        let providers = PROVIDERS.lock().map_err(|e| format!("Failed to lock providers: {}", e))?;
        providers.get(&provider_id)
            .ok_or("Provider not found")?
            .clone()
    }; // Lock is automatically released here
    
    // 2. Retrieve API key from keyring (secure proxy pattern)
    let api_key = get_api_key(&provider_id)?;
    
    // 3. Create provider via factory
    let provider = create_provider(config, api_key)
        .map_err(|e| format!("Failed to create provider: {}", e))?;
    
    // 4. Start streaming
    provider.stream_chat_completion(messages, sender).await
        .map_err(|e| format!("LLM streaming error: {}", e))?;
    
    Ok(())
}
