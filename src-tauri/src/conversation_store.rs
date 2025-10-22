use std::collections::HashMap;
use std::sync::{Mutex, LazyLock};
use crate::models::Conversation;

// Simple in-memory storage for now
static CONVERSATIONS: LazyLock<Mutex<HashMap<String, Conversation>>> = LazyLock::new(|| Mutex::new(HashMap::new()));

#[tauri::command]
pub async fn save_conversation(
    _app_handle: tauri::AppHandle,
    conversation: Conversation,
) -> Result<(), String> {
    let mut conversations = CONVERSATIONS.lock().map_err(|e| format!("Failed to lock conversations: {}", e))?;
    conversations.insert(conversation.id.clone(), conversation);
    Ok(())
}

#[tauri::command]
pub async fn get_all_conversations(
    _app_handle: tauri::AppHandle,
) -> Result<Vec<Conversation>, String> {
    let conversations = CONVERSATIONS.lock().map_err(|e| format!("Failed to lock conversations: {}", e))?;
    let mut conversation_list: Vec<Conversation> = conversations.values().cloned().collect();
    conversation_list.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    Ok(conversation_list)
}

#[tauri::command]
pub async fn get_conversation(
    _app_handle: tauri::AppHandle,
    conversation_id: String,
) -> Result<Option<Conversation>, String> {
    let conversations = CONVERSATIONS.lock().map_err(|e| format!("Failed to lock conversations: {}", e))?;
    Ok(conversations.get(&conversation_id).cloned())
}

#[tauri::command]
pub async fn delete_conversation(
    _app_handle: tauri::AppHandle,
    conversation_id: String,
) -> Result<(), String> {
    let mut conversations = CONVERSATIONS.lock().map_err(|e| format!("Failed to lock conversations: {}", e))?;
    conversations.remove(&conversation_id);
    Ok(())
}

#[tauri::command]
pub async fn update_conversation_title(
    _app_handle: tauri::AppHandle,
    conversation_id: String,
    title: String,
) -> Result<(), String> {
    let mut conversations = CONVERSATIONS.lock().map_err(|e| format!("Failed to lock conversations: {}", e))?;
    
    if let Some(conversation) = conversations.get_mut(&conversation_id) {
        conversation.title = title;
        conversation.updated_at = chrono::Utc::now();
    } else {
        return Err(format!("Conversation {} not found", conversation_id));
    }
    
    Ok(())
}
