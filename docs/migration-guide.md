# Migration Guide

Guide for migrating from other Firebase plugins to Capacitor Firebase Kit.

## Table of Contents

- [Overview](#overview)
- [Migration from @capacitor-firebase/analytics](#migration-from-capacitor-firebaseanalytics)
- [Migration from @capacitor-firebase/crashlytics](#migration-from-capacitor-firebasecrashllytics)
- [Migration from @capacitor-firebase/performance](#migration-from-capacitor-firebaseperformance)
- [Migration from @capacitor-firebase/remote-config](#migration-from-capacitor-firebaseremote-config)
- [Migration from @capacitor-firebase/app-check](#migration-from-capacitor-firebaseapp-check)
- [Migration from @capacitor-community/admob](#migration-from-capacitor-communityadmob)
- [Migration from Official Firebase JavaScript SDK](#migration-from-official-firebase-javascript-sdk)
- [Breaking Changes](#breaking-changes)
- [Migration Checklist](#migration-checklist)
- [Common Issues](#common-issues)

## Overview

Capacitor Firebase Kit consolidates multiple Firebase services into a single plugin, providing a unified API and better performance. This guide helps you migrate from individual Firebase plugins or the official Firebase JavaScript SDK.

### Benefits of Migration

- **Unified API**: All Firebase services in one plugin
- **Better Performance**: Reduced bundle size and faster initialization
- **Consistent Interface**: Same API patterns across all services
- **Type Safety**: Full TypeScript support
- **Cross-Platform**: Works on iOS, Android, and Web
- **Comprehensive Documentation**: Detailed guides and examples

### Migration Process

1. **Audit Current Usage**: Identify which Firebase services you're using
2. **Update Dependencies**: Replace individual plugins with Capacitor Firebase Kit
3. **Update Code**: Migrate to the new API
4. **Test Functionality**: Verify all features work correctly
5. **Update Configuration**: Adjust build configurations if needed

## Migration from @capacitor-firebase/analytics

### Before (Old API)
```typescript
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

// Initialize
await FirebaseAnalytics.initializeFirebase({
  apiKey: 'YOUR_API_KEY',
  // ... other config
});

// Log event
await FirebaseAnalytics.logEvent({
  name: 'login',
  parameters: {
    method: 'google'
  }
});

// Set user property
await FirebaseAnalytics.setUserProperty({
  key: 'favorite_food',
  value: 'pizza'
});

// Set user ID
await FirebaseAnalytics.setUserId({
  userId: 'user123'
});
```

### After (New API)
```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// Initialize (usually done once in app startup)
await FirebaseKit.analytics.initialize({
  collectionEnabled: true
});

// Log event
await FirebaseKit.analytics.logEvent({
  name: 'login',
  params: {
    method: 'google'
  }
});

// Set user property
await FirebaseKit.analytics.setUserProperty({
  key: 'favorite_food',
  value: 'pizza'
});

// Set user ID
await FirebaseKit.analytics.setUserId({
  userId: 'user123'
});
```

### Key Changes
- `FirebaseAnalytics` → `FirebaseKit.analytics`
- `parameters` → `params`
- No need to pass Firebase config (handled by native configuration)
- Simplified initialization

## Migration from @capacitor-firebase/crashlytics

### Before (Old API)
```typescript
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';

// Set user ID
await FirebaseCrashlytics.setUserId({
  userId: 'user123'
});

// Log message
await FirebaseCrashlytics.log({
  message: 'Test message'
});

// Set custom key
await FirebaseCrashlytics.setCustomKey({
  key: 'level',
  value: '5'
});

// Record exception
await FirebaseCrashlytics.recordException({
  message: 'Test exception'
});
```

### After (New API)
```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// Set user ID
await FirebaseKit.crashlytics.setUserId({
  userId: 'user123'
});

// Log message
await FirebaseKit.crashlytics.log({
  message: 'Test message'
});

// Set custom keys (multiple at once)
await FirebaseKit.crashlytics.setCustomKeys({
  attributes: {
    level: '5',
    screen: 'home'
  }
});

// Record exception with more details
await FirebaseKit.crashlytics.logException({
  message: 'Test exception',
  code: 'TEST_ERROR',
  stackTrace: [{
    fileName: 'test.ts',
    lineNumber: 42,
    methodName: 'testMethod'
  }]
});
```

### Key Changes
- `FirebaseCrashlytics` → `FirebaseKit.crashlytics`
- `setCustomKey` → `setCustomKeys` (supports multiple keys)
- `recordException` → `logException` (enhanced with stack trace)

## Migration from @capacitor-firebase/performance

### Before (Old API)
```typescript
import { FirebasePerformance } from '@capacitor-firebase/performance';

// Start trace
await FirebasePerformance.startTrace({
  traceName: 'my_trace'
});

// Stop trace
await FirebasePerformance.stopTrace({
  traceName: 'my_trace'
});

// Increment metric
await FirebasePerformance.incrementMetric({
  traceName: 'my_trace',
  metricName: 'items_count',
  incrementBy: 5
});
```

### After (New API)
```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// Start trace (returns traceId)
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'my_trace'
});

// Stop trace (uses traceId)
await FirebaseKit.performance.stopTrace({
  traceId
});

// Increment metric (uses traceId)
await FirebaseKit.performance.incrementMetric({
  traceId,
  metricName: 'items_count',
  value: 5
});
```

### Key Changes
- `FirebasePerformance` → `FirebaseKit.performance`
- Trace operations now use `traceId` instead of `traceName`
- `incrementBy` → `value`

## Migration from @capacitor-firebase/remote-config

### Before (Old API)
```typescript
import { FirebaseRemoteConfig } from '@capacitor-firebase/remote-config';

// Initialize
await FirebaseRemoteConfig.initializeFirebase({
  apiKey: 'YOUR_API_KEY',
  // ... other config
});

// Fetch and activate
await FirebaseRemoteConfig.fetchAndActivate();

// Get value
const result = await FirebaseRemoteConfig.getValue({
  key: 'welcome_message'
});
```

### After (New API)
```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// Initialize
await FirebaseKit.remoteConfig.initialize({
  minimumFetchIntervalInSeconds: 3600
});

// Fetch and activate
const { activated } = await FirebaseKit.remoteConfig.fetchAndActivate();

// Get value
const result = await FirebaseKit.remoteConfig.getValue({
  key: 'welcome_message'
});
```

### Key Changes
- `FirebaseRemoteConfig` → `FirebaseKit.remoteConfig`
- Enhanced initialization options
- Return values include more metadata

## Migration from @capacitor-firebase/app-check

### Before (Old API)
```typescript
import { FirebaseAppCheck } from '@capacitor-firebase/app-check';

// Initialize
await FirebaseAppCheck.initialize({
  provider: 'playIntegrity',
  isTokenAutoRefreshEnabled: true
});

// Get token
const token = await FirebaseAppCheck.getToken();
```

### After (New API)
```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// Initialize
await FirebaseKit.appCheck.initialize({
  provider: 'playIntegrity',
  isTokenAutoRefreshEnabled: true
});

// Get token
const { token } = await FirebaseKit.appCheck.getToken();
```

### Key Changes
- `FirebaseAppCheck` → `FirebaseKit.appCheck`
- Token response is now wrapped in an object

## Migration from @capacitor-community/admob

### Before (Old API)
```typescript
import { AdMob } from '@capacitor-community/admob';

// Initialize
await AdMob.initialize({
  requestTrackingAuthorization: true,
  testingDevices: ['device_id']
});

// Show banner
await AdMob.showBanner({
  adId: 'ca-app-pub-xxx',
  adSize: 'BANNER',
  position: 'BOTTOM_CENTER'
});
```

### After (New API)
```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// Initialize
await FirebaseKit.adMob.initialize({
  requestTrackingAuthorization: true,
  testingDevices: ['device_id']
});

// Show banner
await FirebaseKit.adMob.showBanner({
  adId: 'ca-app-pub-xxx',
  adSize: 'BANNER',
  position: 'BOTTOM_CENTER'
});
```

### Key Changes
- `AdMob` → `FirebaseKit.adMob`
- API is mostly compatible
- Enhanced error handling and events

## Migration from Official Firebase JavaScript SDK

### Before (Firebase v9+ Modular SDK)
```typescript
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const remoteConfig = getRemoteConfig(app);

// Log event
logEvent(analytics, 'login', {
  method: 'google'
});

// Remote config
await fetchAndActivate(remoteConfig);
const value = getValue(remoteConfig, 'welcome_message');
```

### After (Capacitor Firebase Kit)
```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// Initialize services
await FirebaseKit.analytics.initialize({ collectionEnabled: true });
await FirebaseKit.remoteConfig.initialize({ minimumFetchIntervalInSeconds: 3600 });

// Log event
await FirebaseKit.analytics.logEvent({
  name: 'login',
  params: {
    method: 'google'
  }
});

// Remote config
await FirebaseKit.remoteConfig.fetchAndActivate();
const value = await FirebaseKit.remoteConfig.getValue({
  key: 'welcome_message'
});
```

### Key Changes
- Unified initialization per service
- Promise-based API (no callback style)
- Native performance on mobile platforms
- Automatic configuration from native files

## Breaking Changes

### API Changes
1. **Service Namespacing**: All services are now under `FirebaseKit.*`
2. **Method Signatures**: Some methods have different parameter structures
3. **Return Values**: Enhanced return objects with more metadata
4. **Initialization**: Service-specific initialization instead of global

### Configuration Changes
1. **Native Configuration**: Uses `google-services.json` and `GoogleService-Info.plist`
2. **No Web Config**: No need to pass Firebase config in JavaScript
3. **Plugin Registration**: Automatic plugin registration

### Dependency Changes
```json
// Remove these dependencies
{
  "@capacitor-firebase/analytics": "^x.x.x",
  "@capacitor-firebase/crashlytics": "^x.x.x",
  "@capacitor-firebase/performance": "^x.x.x",
  "@capacitor-firebase/remote-config": "^x.x.x",
  "@capacitor-firebase/app-check": "^x.x.x",
  "@capacitor-community/admob": "^x.x.x"
}

// Add this dependency
{
  "capacitor-firebase-kit": "^x.x.x"
}
```

## Migration Checklist

### Pre-Migration
- [ ] **Audit current Firebase usage**
- [ ] **Identify all Firebase services in use**
- [ ] **Document current API usage**
- [ ] **Create test cases for verification**

### During Migration
- [ ] **Update package.json dependencies**
- [ ] **Install Capacitor Firebase Kit**
- [ ] **Update import statements**
- [ ] **Migrate API calls**
- [ ] **Update method signatures**
- [ ] **Test each service individually**

### Post-Migration
- [ ] **Run full test suite**
- [ ] **Verify native builds work**
- [ ] **Test on all target platforms**
- [ ] **Update documentation**
- [ ] **Monitor for issues**

### Code Review Checklist
- [ ] **All imports updated**
- [ ] **Method signatures match new API**
- [ ] **Error handling updated**
- [ ] **TypeScript types are correct**
- [ ] **No deprecated methods used**

## Common Issues

### 1. Import Errors
```typescript
// ❌ Old import
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

// ✅ New import
import { FirebaseKit } from 'capacitor-firebase-kit';
```

### 2. Method Signature Changes
```typescript
// ❌ Old method
await FirebaseAnalytics.logEvent({
  name: 'login',
  parameters: { method: 'google' }
});

// ✅ New method
await FirebaseKit.analytics.logEvent({
  name: 'login',
  params: { method: 'google' }
});
```

### 3. Return Value Changes
```typescript
// ❌ Old return value
const token = await FirebaseAppCheck.getToken();

// ✅ New return value
const { token } = await FirebaseKit.appCheck.getToken();
```

### 4. Initialization Differences
```typescript
// ❌ Old initialization
await FirebaseAnalytics.initializeFirebase(firebaseConfig);

// ✅ New initialization
await FirebaseKit.analytics.initialize({ collectionEnabled: true });
```

## Step-by-Step Migration Example

Here's a complete migration example:

### 1. Update Dependencies
```bash
# Remove old dependencies
npm uninstall @capacitor-firebase/analytics @capacitor-firebase/crashlytics

# Install new dependency
npm install capacitor-firebase-kit
npx cap sync
```

### 2. Update Code
```typescript
// Before
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';

class AnalyticsService {
  async initialize() {
    await FirebaseAnalytics.initializeFirebase(firebaseConfig);
    await FirebaseCrashlytics.setUserId({ userId: 'user123' });
  }

  async trackEvent(name: string, parameters: any) {
    await FirebaseAnalytics.logEvent({ name, parameters });
  }
}

// After
import { FirebaseKit } from 'capacitor-firebase-kit';

class AnalyticsService {
  async initialize() {
    await FirebaseKit.analytics.initialize({ collectionEnabled: true });
    await FirebaseKit.crashlytics.setUserId({ userId: 'user123' });
  }

  async trackEvent(name: string, params: any) {
    await FirebaseKit.analytics.logEvent({ name, params });
  }
}
```

### 3. Update Tests
```typescript
// Before
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
jest.mock('@capacitor-firebase/analytics');

// After
import { FirebaseKit } from 'capacitor-firebase-kit';
jest.mock('capacitor-firebase-kit');
```

### 4. Verify Functionality
```typescript
// Test all migrated services
const testServices = async () => {
  try {
    await FirebaseKit.analytics.logEvent({ name: 'test' });
    await FirebaseKit.crashlytics.log({ message: 'Test' });
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
```

## Getting Help

If you encounter issues during migration:

1. **Check the troubleshooting guide**: [troubleshooting.md](./troubleshooting.md)
2. **Review the API documentation**: [api-reference.md](./api-reference.md)
3. **Check examples**: [examples.md](./examples.md)
4. **Create an issue**: [GitHub Issues](https://github.com/aoneahsan/capacitor-firebase-kit/issues)

## Support

For migration assistance:
- 📧 Email: aoneahsan@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/aoneahsan/capacitor-firebase-kit/issues)
- 📚 Documentation: [Full Documentation](./README.md)

---

Happy migrating! 🚀