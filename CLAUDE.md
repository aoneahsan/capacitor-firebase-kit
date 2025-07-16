# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Capacitor plugin library called "capacitor-firebase-kit" that provides comprehensive Firebase services integration for Capacitor applications across Android, iOS, and Web platforms.

## Essential Commands

### Development
```bash
# Install dependencies (using Yarn)
yarn install

# Build the plugin
npm run build

# Watch mode for development
npm run watch

# Lint the code
npm run lint

# Format code with Prettier
npm run prettier

# Clean build artifacts
npm run clean

# iOS Swift linting (when iOS code is added)
npm run swiftlint
```

### Build Process
The build command executes: `npm run clean && npm run tsc && npm run rollup`
- TypeScript compilation outputs to `dist/esm/`
- Rollup bundles to `dist/plugin.js` (CommonJS) and `dist/plugin.cjs.js`

## Architecture

### Plugin Structure
This follows the standard Capacitor plugin architecture:
- **src/**: TypeScript source code
  - `index.ts`: Main entry point exporting the plugin
  - `definitions.ts`: TypeScript interfaces for the plugin API
  - `web.ts`: Web implementation of the plugin
- **android/**: Android native implementation (to be created)
- **ios/**: iOS native implementation (to be created)

### Key Technologies
- **Capacitor 7.x**: Native runtime framework
- **TypeScript 5.8.3**: With strict mode enabled
- **Rollup 4.x**: Module bundler
- **ESLint 9.x**: With TypeScript ESLint plugin
- **Prettier 3.x**: Code formatting

### Firebase Services to Implement
According to the README, this plugin will provide:
- App Check
- AdMob
- Crashlytics
- Performance Monitoring
- Analytics
- Remote Config
- Release Monitoring

## Development Guidelines

### TypeScript Configuration
- Strict mode is enabled
- Target: ES2017
- Module: ESNext
- Outputs to `dist/esm/`

### Capacitor Plugin Development
1. Define the plugin interface in `src/definitions.ts`
2. Implement web functionality in `src/web.ts`
3. Export from `src/index.ts`
4. Native implementations go in `android/` and `ios/` directories

### Platform Configuration
The `apps-config.yaml` contains platform-specific settings:
- iOS Bundle ID: `com.ahsanmahmood.cap_firebase`
- Android Package: `com.ahsanmahmood.cap_firebase`
- App ID: `com.ahsanmahmood.cap_firebase`

## Important Notes
- Uses Yarn for dependency management (yarn.lock present)
- No testing framework is currently set up
- The project follows Capacitor plugin best practices and conventions
- All Firebase services have been implemented with full TypeScript support
- Native implementations include placeholder methods marked with TODO comments for future completion