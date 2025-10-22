# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Aether project.

## Workflows

### 1. CI (`ci.yml`)
- **Triggers**: Push to `main` branch, pull requests to `main`
- **Purpose**: Continuous Integration
- **Actions**:
  - Lint code with ESLint
  - Build Next.js application
  - Test Tauri build process
- **Node.js Version**: 20.x (fixes the 18.20.8 compatibility issue)

### 2. Pages (`pages.yml`)
- **Triggers**: Push to `gh-pages` branch
- **Purpose**: Deploy GitHub Pages site
- **Actions**:
  - Build Next.js application
  - Deploy to GitHub Pages
- **Node.js Version**: 20.x

### 3. Release (`release.yml`)
- **Triggers**: Git tags starting with `v*`, manual dispatch
- **Purpose**: Build and release desktop applications
- **Platforms**:
  - macOS (Intel & Apple Silicon)
  - Windows (x64 & ARM64)
  - Linux (x64 & ARM64)
- **Outputs**: DMG, MSI, AppImage, and DEB packages

## Setup Instructions

### For Desktop Releases

1. **Generate Tauri Keys** (one-time setup):
   ```bash
   npm install -g @tauri-apps/cli
   tauri signer generate -w ~/.tauri/myapp.key
   ```

2. **Add Secrets to GitHub Repository**:
   - Go to Repository Settings → Secrets and variables → Actions
   - Add `TAURI_PRIVATE_KEY`: Content of the private key file
   - Add `TAURI_KEY_PASSWORD`: Password for the key (if set)

3. **Create a Release**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

### For GitHub Pages

The GitHub Pages site will automatically deploy when you push to the `gh-pages` branch.

## Node.js Version Fix

The workflows use Node.js 20.x to resolve the compatibility issue with Next.js 16, which requires Node.js >=20.9.0.

## Troubleshooting

- **Build Failures**: Check that all dependencies are properly installed
- **Tauri Build Issues**: Ensure Rust toolchain is properly configured
- **Release Issues**: Verify Tauri signing keys are correctly set up
