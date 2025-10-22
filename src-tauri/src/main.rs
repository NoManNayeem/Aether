// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod models;
mod keyring;
mod config_store;
mod conversation_store;
mod llm;
mod commands;


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // Keyring commands
            keyring::store_api_key,
            keyring::delete_api_key,
            
            // Config store commands
            config_store::save_provider_config,
            config_store::get_all_providers,
            config_store::delete_provider,
            config_store::update_provider_config,
            
            // Conversation store commands
            conversation_store::save_conversation,
            conversation_store::get_all_conversations,
            conversation_store::get_conversation,
            conversation_store::delete_conversation,
            conversation_store::update_conversation_title,
            
            // Chat commands
            commands::chat::handle_chat_stream,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
