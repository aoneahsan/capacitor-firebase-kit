# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-08-02

### 🎉 Major Release - Provider-less Architecture

This is a complete rewrite of capacitor-firebase-kit with a provider-less architecture that works seamlessly across React, React Native, and Capacitor apps without requiring any providers or React Context.

### ✨ Added
- **Provider-less Architecture**: Implemented Zustand-like singleton pattern that doesn't require React Context
- **Universal Platform Support**: Now works on Web, React Native, Capacitor, and Node.js
- **Automatic Platform Detection**: Detects the platform and loads the appropriate adapter automatically
- **Dynamic Imports**: All Firebase SDKs are loaded on-demand to reduce bundle size
- **Tree-Shaking Support**: Only the services you use are included in your bundle
- **TypeScript Support**: Full TypeScript support with improved type definitions
- **Lazy Loading**: Services are only initialized when first accessed
- **Works in Server Components**: Can be used in Next.js server components and dynamic imports

### 🔄 Changed
- **BREAKING**: Changed from provider-based to provider-less API
- **BREAKING**: Capacitor is now an optional peer dependency
- **BREAKING**: New initialization API: `firebaseKit.initialize()` instead of provider setup
- **BREAKING**: Services are now accessed as methods: `firebaseKit.analytics()` instead of properties
- Updated all dependencies to latest versions
- Improved error handling with specific error codes
- Enhanced platform-specific implementations

### 🗑️ Removed
- **BREAKING**: Removed React provider components
- **BREAKING**: Removed requirement for wrapping app in providers
- **BREAKING**: Removed direct Capacitor dependency (now optional)

### 📦 Migration Guide

#### Before (v1.x)
```tsx
import { FirebaseKitProvider } from 'capacitor-firebase-kit';

<FirebaseKitProvider config={firebaseConfig}>
  <App />
</FirebaseKitProvider>

// In components
const { analytics } = useFirebaseKit();
analytics.logEvent('event_name');
```

#### After (v2.0)
```tsx
import firebaseKit from 'capacitor-firebase-kit';

// Initialize once
await firebaseKit.initialize(firebaseConfig);

// Use anywhere - no providers needed!
const analytics = await firebaseKit.analytics();
await analytics.logEvent('event_name');
```

### 🐛 Fixed
- Fixed circular dependency issues
- Fixed TypeScript compilation errors
- Fixed ESLint warnings
- Improved error messages for missing SDKs

### 🔒 Security
- All dependencies updated to latest secure versions
- Added proper error handling for failed SDK loads

## [0.0.1] - 2024-01-09

### Added
- Initial release of Capacitor Firebase Kit
- App Check service with support for:
  - DeviceCheck (iOS)
  - App Attest (iOS 14+)
  - Play Integrity (Android)
  - SafetyNet (Android)
  - reCAPTCHA v3 (Web)
  - reCAPTCHA Enterprise (Web)
  - Debug provider for testing
- AdMob service with support for:
  - Banner ads
  - Interstitial ads
  - Rewarded ads
  - Rewarded interstitial ads
  - User consent management (UMP)
  - Test device configuration
- Crashlytics service with support for:
  - Crash reporting
  - Custom logging
  - User identification
  - Custom keys/attributes
  - Exception logging
  - Breadcrumb tracking
- Performance Monitoring service with support for:
  - Custom traces
  - Screen traces
  - Metrics and attributes
  - Network request monitoring
  - Performance collection toggle
- Analytics service with support for:
  - Event logging
  - User properties
  - Screen tracking
  - User ID
  - Consent management
  - Default parameters
- Remote Config service with support for:
  - Default values
  - Fetch and activate
  - Real-time updates
  - Configuration settings
- Full TypeScript support with comprehensive type definitions
- Support for Android, iOS, and Web platforms
- Comprehensive documentation and examples

[2.0.0]: https://github.com/aoneahsan/capacitor-firebase-kit/compare/v0.0.1...v2.0.0
[0.0.1]: https://github.com/aoneahsan/capacitor-firebase-kit/releases/tag/v0.0.1