# Contributing to Aether

Thank you for your interest in contributing to Aether! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (required for Next.js 16)
- **Rust** 1.70+ (for Tauri)
- **Git** for version control
- **npm** or **yarn** for package management

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/Aether.git
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

## 🛠️ Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/add-new-provider` - New features
- `fix/chat-streaming-issue` - Bug fixes
- `docs/update-readme` - Documentation updates
- `refactor/cleanup-components` - Code refactoring

### Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **Rust**: Follow Rust conventions, use `cargo fmt`
- **React**: Use functional components with hooks
- **CSS**: Use Tailwind CSS classes, avoid custom CSS

### Testing

Before submitting a PR:

```bash
# Run linting
npm run lint

# Build the application
npm run build

# Test Tauri build
npm run tauri:build -- --help
```

## 📝 Pull Request Process

### Before Submitting

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   npm run tauri:dev
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Submitting a PR

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**
   - Use the GitHub PR template
   - Provide a clear description
   - Link any related issues

3. **Wait for review**
   - Address feedback promptly
   - Make requested changes
   - Keep commits clean

## 🏗️ Project Structure

```
Aether/
├── src/                    # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   │   ├── chat/         # Chat-related components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and types
│   └── store/            # Zustand state management
├── src-tauri/            # Tauri backend
│   ├── src/              # Rust source code
│   │   ├── commands/     # Tauri commands
│   │   ├── llm/          # LLM provider implementations
│   │   └── main.rs       # Main Rust entry point
│   └── Cargo.toml        # Rust dependencies
├── .github/              # GitHub Actions workflows
│   └── workflows/        # CI/CD workflows
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🎯 Areas for Contribution

### High Priority

- **New LLM Providers**: Add support for more AI providers
- **UI Improvements**: Enhance the user interface
- **Performance**: Optimize memory usage and speed
- **Testing**: Add comprehensive test coverage
- **Documentation**: Improve code documentation

### Medium Priority

- **Plugin System**: Extensible architecture
- **Advanced Settings**: More configuration options
- **Keyboard Shortcuts**: Power user features
- **Themes**: Additional theme options
- **Accessibility**: Improve accessibility features

### Low Priority

- **Mobile App**: React Native companion
- **Team Features**: Collaboration tools
- **Analytics**: Usage statistics
- **Plugin Marketplace**: Third-party extensions

## 🔧 Adding New LLM Providers

### 1. Create Provider Struct

```rust
// src-tauri/src/llm/your_provider.rs
use crate::llm::trait_def::{LLMProvider, LLMError};
use crate::types::{ChatMessage, ChatResponseChunk};
use tauri::ipc::Channel;

pub struct YourProvider {
    client: reqwest::Client,
    api_key: String,
    endpoint: String,
}

impl YourProvider {
    pub fn new(api_key: String, endpoint: String) -> Self {
        Self {
            client: reqwest::Client::new(),
            api_key,
            endpoint,
        }
    }
}

#[async_trait]
impl LLMProvider for YourProvider {
    async fn stream_chat_completion(
        &self,
        messages: Vec<ChatMessage>,
        channel: Channel<ChatResponseChunk>,
    ) -> Result<(), LLMError> {
        // Implementation here
    }
}
```

### 2. Add to Factory

```rust
// src-tauri/src/llm/factory.rs
use crate::llm::your_provider::YourProvider;

pub fn create_provider(config: &McpServerConfig) -> Result<Box<dyn LLMProvider>, LLMError> {
    match config.provider_type.as_str() {
        "your_provider" => {
            let provider = YourProvider::new(
                config.api_key.clone(),
                config.endpoint.clone(),
            );
            Ok(Box::new(provider))
        }
        // ... other providers
    }
}
```

### 3. Update Frontend Types

```typescript
// src/lib/types.ts
export type ProviderType = 'openai' | 'local' | 'your_provider';
```

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Environment**
   - OS version
   - Node.js version
   - Rust version
   - Browser (if applicable)

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected behavior
   - Actual behavior

3. **Additional Context**
   - Screenshots if applicable
   - Error messages
   - Log files

### Feature Requests

For feature requests, please include:

1. **Problem Description**
   - What problem does this solve?
   - Why is it important?

2. **Proposed Solution**
   - How should it work?
   - Any design considerations?

3. **Alternatives Considered**
   - Other approaches you've considered
   - Why this solution is better

## 📋 Code Review Guidelines

### For Contributors

- **Keep PRs small** - Focus on one feature/fix per PR
- **Write clear commit messages** - Use conventional commits
- **Add tests** - Include tests for new features
- **Update documentation** - Keep docs in sync with code
- **Be responsive** - Address review feedback promptly

### For Reviewers

- **Be constructive** - Provide helpful feedback
- **Test changes** - Verify the code works as expected
- **Check for security** - Look for potential security issues
- **Consider performance** - Ensure changes don't impact performance
- **Verify documentation** - Ensure docs are updated

## 📄 License

By contributing to Aether, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- **README.md** - Contributor list
- **Release notes** - Feature acknowledgments
- **GitHub contributors** - Automatic recognition

## 📞 Getting Help

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Email** - [nayeem@example.com](mailto:nayeem@example.com)

---

Thank you for contributing to Aether! 🚀
