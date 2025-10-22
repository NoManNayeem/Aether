use crate::models::{McpServerConfig, LLMError};
use crate::llm::{LLMProvider, OpenAIProvider, LocalProvider};

pub fn create_provider(
    config: McpServerConfig,
    api_key: String,
) -> Result<Box<dyn LLMProvider>, LLMError> {
    match config.provider_type {
        crate::models::ProviderType::OpenAI => {
            Ok(Box::new(OpenAIProvider::new(api_key, config.default_model)))
        }
        crate::models::ProviderType::Local => {
            let endpoint_url = config.endpoint_url
                .unwrap_or_else(|| "http://localhost:8000/v1/chat/completions".to_string());
            
            let api_key = if api_key.is_empty() { None } else { Some(api_key) };
            
            Ok(Box::new(LocalProvider::new(
                api_key,
                config.default_model,
                endpoint_url,
            )))
        }
    }
}
