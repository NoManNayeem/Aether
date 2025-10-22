# 🌌 Aether - Cross-Platform MCP Client

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-000000?logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-FFC131?logo=tauri&logoColor=black)](https://tauri.app/)

> A modern, cross-platform Multi-Client Protocol (MCP) client for Large Language Models, built with Tauri and Next.js.

## ✨ Features

### 🚀 **Core Capabilities**
- **Cross-Platform Desktop App** - Built with Tauri for native performance
- **Multi-Provider Support** - OpenAI, Local LLMs (Ollama, LM Studio, vLLM)
- **Real-time Streaming** - Live chat responses with typing indicators
- **Secure API Key Management** - OS-native keyring integration
- **Conversation Management** - Full CRUD operations with persistence
- **Model Tracking** - Remember which model was used for each conversation

### 🎨 **User Experience**
- **Beautiful UI** - Modern design with shadcn/ui components
- **Animated Splash Screen** - Elegant loading experience
- **Dark/Light Themes** - Adaptive theming support
- **Responsive Design** - Works on all screen sizes
- **Keyboard Shortcuts** - Efficient workflow navigation

### 🔧 **Technical Features**
- **TypeScript** - Full type safety across the stack
- **Rust Backend** - High-performance system integration
- **Next.js Frontend** - Modern React with SSG optimization
- **Secure Storage** - Encrypted API key storage
- **Offline Support** - Works without internet (for local LLMs)
- **Hot Reload** - Fast development experience

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js UI    │    │   Tauri Core    │    │   LLM Providers │
│                 │    │                 │    │                 │
│ • React Components│◄──►│ • Rust Backend  │◄──►│ • OpenAI API    │
│ • State Management│    │ • IPC Commands   │    │ • Local Ollama  │
│ • UI Components  │    │ • Secure Storage │    │ • Custom APIs   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** 1.70+ (for Tauri)
- **Git** for cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NoManNayeem/Aether.git
   cd Aether
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run tauri:dev
   ```

### Building for Production

```bash
# Build the desktop application
npm run tauri:build

# Build only the web version
npm run build
```

## 📖 Usage

### Adding LLM Providers

1. **Open Settings** - Click the settings icon in the sidebar
2. **Add Provider** - Click "Add Provider" button
3. **Configure** - Enter provider details:
   - **Name**: Your provider name
   - **Type**: OpenAI or Local
   - **Endpoint**: API endpoint URL
   - **Model**: Default model to use
   - **API Key**: Your secure API key

### Starting Conversations

1. **Select Provider** - Choose from the sidebar
2. **Start Chatting** - Type your message and press Enter
3. **Manage Conversations** - Use the sidebar to organize chats

### Local LLM Setup

#### Using Ollama (Recommended)

1. **Install Ollama**
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Run Ollama**
   ```bash
   ollama serve
   ```

3. **Add Model**
   ```bash
   ollama pull phi3
   ```

4. **Configure in Aether**
   - Provider Type: Local
   - Endpoint: `http://localhost:11434/v1/chat/completions`
   - Model: `phi3`

#### Using Docker

```bash
# Run Ollama in Docker
docker run -d -p 11434:11434 --name ollama ollama/ollama

# Pull a model
docker exec -it ollama ollama pull phi3
```

## 🛠️ Development

### Project Structure

```
Aether/
├── src/                    # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and types
│   └── store/            # State management
├── src-tauri/            # Tauri backend
│   ├── src/              # Rust source code
│   └── Cargo.toml        # Rust dependencies
├── public/               # Static assets
└── docs/                 # Documentation
```

### Available Scripts

```bash
# Development
npm run dev              # Next.js dev server
npm run tauri:dev       # Tauri development
npm run tauri:build     # Build desktop app

# Production
npm run build           # Build web version
npm run start           # Start production server

# Utilities
npm run lint            # Run ESLint
npm run tauri           # Tauri CLI commands
```

### Adding New LLM Providers

1. **Create Provider Struct** in `src-tauri/src/llm/`
2. **Implement LLMProvider Trait**
3. **Add to Factory** in `src-tauri/src/llm/factory.rs`
4. **Update Frontend Types** in `src/lib/types.ts`

Example:
```rust
// src-tauri/src/llm/custom.rs
pub struct CustomProvider {
    client: Client,
    api_key: String,
    endpoint: String,
}

#[async_trait]
impl LLMProvider for CustomProvider {
    async fn stream_chat_completion(
        &self,
        messages: Vec<ChatMessage>,
        channel: Channel<ChatResponseChunk>,
    ) -> Result<(), LLMError> {
        // Implementation here
    }
}
```

## 🔒 Security

- **API Keys** stored in OS keyring (Keychain on macOS, Credential Manager on Windows)
- **No Network Calls** from frontend - all API calls go through Tauri
- **Secure IPC** - Tauri's built-in security model
- **Local Storage** - Conversations stored locally by default

## 🐛 Troubleshooting

### Common Issues

**App won't start**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tauri build fails**
```bash
# Update Rust
rustup update

# Clean Tauri cache
npm run tauri build -- --verbose
```

**Local LLM not connecting**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Check Docker container
docker ps | grep ollama
```

### Debug Mode

Enable debug logging:
```bash
RUST_LOG=debug npm run tauri:dev
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) - Cross-platform desktop framework
- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Rust](https://www.rust-lang.org/) - Systems programming language
- [Ollama](https://ollama.ai/) - Local LLM runner

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/NoManNayeem/Aether/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NoManNayeem/Aether/discussions)
- **Email**: [Your Email]

---

<div align="center">
  <strong>Built with ❤️ by the Aether Team</strong>
</div>