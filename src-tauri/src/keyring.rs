use std::collections::HashMap;
use std::sync::{Mutex, LazyLock};

// Simple in-memory storage for now (in production, use OS keyring)
static API_KEYS: LazyLock<Mutex<HashMap<String, String>>> = LazyLock::new(|| Mutex::new(HashMap::new()));

#[tauri::command]
pub async fn store_api_key(provider_id: String, api_key: String) -> Result<(), String> {
    let mut keys = API_KEYS.lock().map_err(|e| format!("Failed to lock API keys: {}", e))?;
    keys.insert(provider_id, api_key);
    Ok(())
}

// Internal function - NOT exposed to frontend
pub fn get_api_key(provider_id: &str) -> Result<String, String> {
    let keys = API_KEYS.lock().map_err(|e| format!("Failed to lock API keys: {}", e))?;
    keys.get(provider_id)
        .ok_or_else(|| "API key not found".to_string())
        .map(|s| s.clone())
}

#[tauri::command]
pub async fn delete_api_key(provider_id: String) -> Result<(), String> {
    let mut keys = API_KEYS.lock().map_err(|e| format!("Failed to lock API keys: {}", e))?;
    keys.remove(&provider_id);
    Ok(())
}
