use async_trait::async_trait;
use tauri::ipc::Channel;
use reqwest::Client;
use serde_json::{json, Value};
use futures_util::StreamExt;
use crate::models::{ChatMessage, ChatResponseChunk, LLMError};
use crate::llm::trait_def::LLMProvider;

pub struct OpenAIProvider {
    client: Client,
    api_key: String,
    model: String,
}

impl OpenAIProvider {
    pub fn new(api_key: String, model: String) -> Self {
        Self {
            client: Client::new(),
            api_key,
            model,
        }
    }
}

#[async_trait]
impl LLMProvider for OpenAIProvider {
    async fn stream_chat_completion(
        &self,
        messages: Vec<ChatMessage>,
        channel: Channel<ChatResponseChunk>,
    ) -> Result<(), LLMError> {
        let url = "https://api.openai.com/v1/chat/completions";
        
        let request_body = json!({
            "model": self.model,
            "messages": messages.iter().map(|msg| {
                json!({
                    "role": msg.role,
                    "content": msg.content
                })
            }).collect::<Vec<_>>(),
            "stream": true
        });

        let response = self.client
            .post(url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(&request_body)
            .send()
            .await
            .map_err(|e| LLMError::NetworkError(e.to_string()))?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            return Err(LLMError::ProviderError(format!("HTTP {}: {}", status, error_text)));
        }

        let mut stream = response.bytes_stream();
        let mut buffer = String::new();

        while let Some(chunk) = stream.next().await {
            let chunk = chunk.map_err(|e| LLMError::NetworkError(e.to_string()))?;
            let chunk_str = String::from_utf8_lossy(&chunk);
            buffer.push_str(&chunk_str);

            // Process complete lines
            while let Some(newline_pos) = buffer.find('\n') {
                let line = buffer[..newline_pos].trim();
                let remaining = buffer[newline_pos + 1..].to_string();
                
                if line.starts_with("data: ") {
                    let data = &line[6..];
                    if data == "[DONE]" {
                        let _ = channel.send(ChatResponseChunk {
                            text: String::new(),
                            finished: true,
                        });
                        return Ok(());
                    }

                    if let Ok(parsed) = serde_json::from_str::<Value>(data) {
                        if let Some(choices) = parsed.get("choices") {
                            if let Some(choice) = choices.get(0) {
                                if let Some(delta) = choice.get("delta") {
                                    if let Some(content) = delta.get("content") {
                                        if let Some(text) = content.as_str() {
                                            let _ = channel.send(ChatResponseChunk {
                                                text: text.to_string(),
                                                finished: false,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Update buffer after processing the line
                buffer = remaining;
            }
        }

        Ok(())
    }

}
