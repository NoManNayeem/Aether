use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ProviderType {
    OpenAI,
    Local,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct McpServerConfig {
    pub id: String,
    pub name: String,
    pub provider_type: ProviderType,
    pub endpoint_url: Option<String>,
    pub default_model: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
    pub timestamp: DateTime<Utc>,
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatResponseChunk {
    pub text: String,
    pub finished: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Conversation {
    pub id: String,
    pub title: String,
    pub messages: Vec<ChatMessage>,
    pub provider_id: String,
    pub model_used: String, // Store the model used for this conversation
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum LLMError {
    NetworkError(String),
    AuthenticationError(String),
    ParseError(String),
    ProviderError(String),
    ConfigurationError(String),
    UnknownError(String),
}

impl std::fmt::Display for LLMError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            LLMError::NetworkError(msg) => write!(f, "Network error: {}", msg),
            LLMError::AuthenticationError(msg) => write!(f, "Authentication error: {}", msg),
            LLMError::ParseError(msg) => write!(f, "Parse error: {}", msg),
            LLMError::ProviderError(msg) => write!(f, "Provider error: {}", msg),
            LLMError::ConfigurationError(msg) => write!(f, "Configuration error: {}", msg),
            LLMError::UnknownError(msg) => write!(f, "Unknown error: {}", msg),
        }
    }
}

impl std::error::Error for LLMError {}
