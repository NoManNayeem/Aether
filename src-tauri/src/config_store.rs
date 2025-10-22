use std::collections::HashMap;
use std::sync::{Mutex, LazyLock};
use crate::models::McpServerConfig;

// Simple in-memory storage for now
pub static PROVIDERS: LazyLock<Mutex<HashMap<String, McpServerConfig>>> = LazyLock::new(|| Mutex::new(HashMap::new()));

#[tauri::command]
pub async fn save_provider_config(
    _app_handle: tauri::AppHandle,
    config: McpServerConfig,
) -> Result<(), String> {
    println!("Saving provider config: {:?}", config);
    let mut providers = PROVIDERS.lock().map_err(|e| format!("Failed to lock providers: {}", e))?;
    providers.insert(config.id.clone(), config);
    println!("Provider saved successfully. Total providers: {}", providers.len());
    Ok(())
}

#[tauri::command]
pub async fn get_all_providers(
    _app_handle: tauri::AppHandle,
) -> Result<Vec<McpServerConfig>, String> {
    println!("Getting all providers...");
    let providers = PROVIDERS.lock().map_err(|e| format!("Failed to lock providers: {}", e))?;
    let result: Vec<McpServerConfig> = providers.values().cloned().collect();
    println!("Retrieved {} providers", result.len());
    Ok(result)
}

#[tauri::command]
pub async fn delete_provider(
    _app_handle: tauri::AppHandle,
    provider_id: String,
) -> Result<(), String> {
    let mut providers = PROVIDERS.lock().map_err(|e| format!("Failed to lock providers: {}", e))?;
    providers.remove(&provider_id);
    Ok(())
}

#[tauri::command]
pub async fn update_provider_config(
    app_handle: tauri::AppHandle,
    config: McpServerConfig,
) -> Result<(), String> {
    // This is the same as save_provider_config since we're using HashMap
    save_provider_config(app_handle, config).await
}
