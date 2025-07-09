# Capacitor Firebase Kit - Troubleshooting Guide

This guide helps you resolve common issues when using Capacitor Firebase Kit.

## Table of Contents

- [General Issues](#general-issues)
- [Platform-Specific Issues](#platform-specific-issues)
  - [Android Issues](#android-issues)
  - [iOS Issues](#ios-issues)
  - [Web Issues](#web-issues)
- [Service-Specific Issues](#service-specific-issues)
  - [App Check](#app-check-issues)
  - [AdMob](#admob-issues)
  - [Crashlytics](#crashlytics-issues)
  - [Performance](#performance-issues)
  - [Analytics](#analytics-issues)
  - [Remote Config](#remote-config-issues)
- [Build Errors](#build-errors)
- [Runtime Errors](#runtime-errors)
- [Debugging Tips](#debugging-tips)
- [Common Solutions](#common-solutions)

## General Issues

### Plugin Not Found

**Error:**
```
Cannot find module 'capacitor-firebase-kit'
```

**Solution:**
1. Ensure the plugin is installed:
   ```bash
   npm install capacitor-firebase-kit
   ```
2. Run sync:
   ```bash
   npx cap sync
   ```
3. Rebuild your project

### TypeScript Errors

**Error:**
```
Property 'FirebaseKit' does not exist on type 'PluginRegistry'
```

**Solution:**
1. Import the plugin correctly:
   ```typescript
   import { FirebaseKit } from 'capacitor-firebase-kit';
   ```
2. Don't use the old `Plugins` import pattern

### Method Not Implemented

**Error:**
```
"METHOD_NAME" is not implemented on [platform]
```

**Solution:**
Check the platform support in the documentation. Some features are not available on all platforms.

## Platform-Specific Issues

### Android Issues

#### Google Services Plugin Not Found

**Error:**
```
Plugin with id 'com.google.gms.google-services' not found
```

**Solution:**
Add to `android/build.gradle`:
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

#### google-services.json Not Found

**Error:**
```
File google-services.json is missing from module root folder
```

**Solution:**
1. Download `google-services.json` from Firebase Console
2. Place it in `android/app/google-services.json`

#### Minimum SDK Version

**Error:**
```
Manifest merger failed : uses-sdk:minSdkVersion 21 cannot be smaller than version 22
```

**Solution:**
Update `android/variables.gradle`:
```gradle
ext {
    minSdkVersion = 22
}
```

#### Duplicate Classes

**Error:**
```
Duplicate class com.google.firebase.* found
```

**Solution:**
Ensure you're using Firebase BOM in `android/app/build.gradle`:
```gradle
dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
}
```

#### AdMob App ID Missing

**Error:**
```
The Google Mobile Ads SDK was initialized incorrectly
```

**Solution:**
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
```

### iOS Issues

#### Firebase Configuration File Missing

**Error:**
```
Could not locate configuration file: 'GoogleService-Info.plist'
```

**Solution:**
1. Download `GoogleService-Info.plist` from Firebase Console
2. Add to Xcode project (drag into project navigator)
3. Ensure "Copy items if needed" is checked
4. Add to correct target

#### Swift Version Incompatibility

**Error:**
```
Module compiled with Swift X.X cannot be imported by Swift Y.Y
```

**Solution:**
Update `ios/App/Podfile`:
```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_VERSION'] = '5.9'
    end
  end
end
```

Then run:
```bash
cd ios/App && pod update
```

#### App Tracking Transparency

**Error:**
```
This app does not have permission to track
```

**Solution:**
1. Add to `Info.plist`:
   ```xml
   <key>NSUserTrackingUsageDescription</key>
   <string>This app uses tracking to provide personalized ads.</string>
   ```
2. Request permission before showing ads:
   ```typescript
   await FirebaseKit.adMob.initialize({
     requestTrackingAuthorization: true
   });
   ```

#### Linker Errors

**Error:**
```
Undefined symbols for architecture arm64
```

**Solution:**
1. Clean build folder: Cmd+Shift+K
2. Delete `DerivedData`
3. Run `pod install` again
4. Add to `Podfile`:
   ```ruby
   use_frameworks! :linkage => :static
   ```

### Web Issues

#### Firebase Not Defined

**Error:**
```
ReferenceError: firebase is not defined
```

**Solution:**
Add Firebase SDK to `index.html`:
```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<!-- Add other Firebase services as needed -->
```

#### Invalid API Key

**Error:**
```
Firebase: Error (auth/invalid-api-key)
```

**Solution:**
1. Check Firebase configuration in `index.html`
2. Ensure you're using the correct project
3. Regenerate config from Firebase Console

## Service-Specific Issues

### App Check Issues

#### Token Expired

**Error:**
```
APP_CHECK_TOKEN_EXPIRED
```

**Solution:**
```typescript
try {
  const { token } = await FirebaseKit.appCheck.getToken();
} catch (error) {
  if (error.code === 'APP_CHECK_TOKEN_EXPIRED') {
    // Force refresh
    const { token } = await FirebaseKit.appCheck.getToken({ 
      forceRefresh: true 
    });
  }
}
```

#### Provider Not Supported

**Error:**
```
Provider X not supported on platform Y
```

**Solution:**
Use platform-appropriate providers:
```typescript
const providers = {
  ios: 'deviceCheck',      // or 'appAttest' for iOS 14+
  android: 'playIntegrity', // or 'safetyNet'
  web: 'recaptchaV3'       // or 'recaptchaEnterprise'
};

await FirebaseKit.appCheck.initialize({
  provider: providers[Capacitor.getPlatform()]
});
```

#### Debug Token Issues

**Solution for testing:**
1. iOS: Add `-FIRDebugEnabled` to scheme arguments
2. Android: Use debug provider
3. Web: Use debug token in console

```typescript
// For testing only
await FirebaseKit.appCheck.initialize({
  provider: 'debug',
  debugToken: 'YOUR_DEBUG_TOKEN'
});
```

### AdMob Issues

#### Ads Not Loading

**Common causes:**
1. Invalid ad unit ID
2. No internet connection
3. Account issues
4. Testing on emulator without test mode

**Solution:**
```typescript
// Use test IDs during development
const TEST_IDS = {
  banner: {
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111'
  },
  interstitial: {
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712'
  }
};

// Add error handling
FirebaseKit.adMob.addListener('bannerAdFailedToLoad', (error) => {
  console.error('Ad failed to load:', error);
  // Retry after delay
  setTimeout(() => {
    FirebaseKit.adMob.showBanner({ adId: TEST_IDS.banner[platform] });
  }, 30000);
});
```

#### Consent Form Not Showing

**Solution:**
```typescript
// Ensure proper setup
const consentInfo = await FirebaseKit.adMob.requestConsentInfo({
  tagForUnderAgeOfConsent: false,
  testDeviceIdentifiers: ['YOUR_TEST_DEVICE_HASH']
});

console.log('Consent status:', consentInfo.status);
console.log('Form available:', consentInfo.isConsentFormAvailable);

if (consentInfo.isConsentFormAvailable) {
  await FirebaseKit.adMob.showConsentForm();
}
```

### Crashlytics Issues

#### Crashes Not Appearing

**Common causes:**
1. Collection disabled
2. Debugger attached
3. Not enough time to upload

**Solution:**
```typescript
// Enable collection
await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({ 
  enabled: true 
});

// Force a test crash
await FirebaseKit.crashlytics.crash();

// For non-fatal errors, ensure app runs long enough
await FirebaseKit.crashlytics.logException({
  message: 'Test exception',
  code: 'TEST_001'
});

// Wait before closing app
setTimeout(() => {
  // Allow time for upload
}, 5000);
```

#### Debug Builds Not Reporting

**Solution:**
1. Android: Remove `debuggable true` temporarily
2. iOS: Run without debugger attached
3. Use `forceCrash()` instead of `crash()` for testing

### Performance Issues

#### Traces Not Appearing

**Solution:**
```typescript
// Ensure trace is stopped
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'my_trace'
});

try {
  // Your code
} finally {
  // Always stop trace
  await FirebaseKit.performance.stopTrace({ traceId });
}
```

#### Metrics Not Recording

**Solution:**
```typescript
// Set metric before stopping trace
await FirebaseKit.performance.setMetric({
  traceId,
  metricName: 'items_count',
  value: 42
});

// Then stop trace
await FirebaseKit.performance.stopTrace({ traceId });
```

### Analytics Issues

#### Events Not Showing

**Common causes:**
1. Collection disabled
2. Wrong event names
3. Delayed reporting (up to 24 hours)

**Solution:**
```typescript
// Enable debug mode for immediate reporting
// iOS: -FIRAnalyticsDebugEnabled in scheme
// Android: adb shell setprop debug.firebase.analytics.app com.example.app

// Use valid event names
await FirebaseKit.analytics.logEvent({
  name: 'select_content', // Use standard events when possible
  params: {
    content_type: 'product',
    item_id: 'SKU123'
  }
});

// Check DebugView in Firebase Console
```

#### User Properties Not Updating

**Solution:**
```typescript
// Use valid property names (24 chars max, alphanumeric + underscore)
await FirebaseKit.analytics.setUserProperty({
  key: 'user_type', // Good
  value: 'premium'
});

// Not: 'user-type', 'user type', 'userType'
```

### Remote Config Issues

#### Values Not Updating

**Solution:**
```typescript
// Check fetch status
const { activated } = await FirebaseKit.remoteConfig.fetchAndActivate();
console.log('New config activated:', activated);

// Force fetch (bypass cache)
await FirebaseKit.remoteConfig.fetch({
  minimumFetchIntervalInSeconds: 0
});

// Check source
const value = await FirebaseKit.remoteConfig.getValue({ key: 'my_key' });
console.log('Value source:', value.source); // 'remote', 'default', or 'static'
```

#### Real-time Updates Not Working

**Solution:**
1. Ensure real-time updates are enabled in Firebase Console
2. Check listener registration:
   ```typescript
   const listener = await FirebaseKit.remoteConfig.addListener(
     'remoteConfigUpdated',
     async (update) => {
       console.log('Updated keys:', update.updatedKeys);
       // Fetch and activate
       await FirebaseKit.remoteConfig.fetchAndActivate();
     }
   );
   ```

## Build Errors

### Android Build Errors

#### Java Version Issues

**Error:**
```
Unsupported class file major version 61
```

**Solution:**
Set Java version in `android/gradle.properties`:
```properties
org.gradle.java.home=/Applications/Android Studio.app/Contents/jbr/Contents/Home
```

#### Gradle Build Failed

**Solution:**
```bash
cd android
./gradlew clean
./gradlew build --refresh-dependencies
```

### iOS Build Errors

#### Pod Install Failed

**Solution:**
```bash
cd ios/App
pod cache clean --all
pod deintegrate
pod install --repo-update
```

#### Archive Failed

**Solution:**
1. Clean build folder
2. Update pods
3. Check provisioning profiles
4. Ensure all capabilities are properly configured

## Runtime Errors

### Memory Leaks

**Prevention:**
```typescript
class Component {
  private listeners: PluginListenerHandle[] = [];
  
  async ionViewDidEnter() {
    // Store all listeners
    this.listeners.push(
      await FirebaseKit.appCheck.addListener('appCheckTokenChanged', this.onTokenChange),
      await FirebaseKit.adMob.addListener('rewardedAdRewarded', this.onAdReward)
    );
  }
  
  async ionViewWillLeave() {
    // Clean up all listeners
    await Promise.all(this.listeners.map(l => l.remove()));
    this.listeners = [];
  }
}
```

### Performance Impact

**Optimization:**
```typescript
// Batch operations
const operations = [
  FirebaseKit.analytics.logEvent({ name: 'event1' }),
  FirebaseKit.analytics.logEvent({ name: 'event2' }),
  FirebaseKit.analytics.logEvent({ name: 'event3' })
];

await Promise.all(operations);

// Debounce frequent operations
import { debounce } from 'lodash';

const trackScroll = debounce(async (position: number) => {
  await FirebaseKit.analytics.logEvent({
    name: 'scroll_position',
    params: { position }
  });
}, 1000);
```

## Debugging Tips

### Enable Debug Logging

#### Android
```bash
adb shell setprop log.tag.FirebasePlugin VERBOSE
adb shell setprop debug.firebase.analytics.app com.example.app
```

#### iOS
Add to scheme launch arguments:
- `-FIRDebugEnabled`
- `-FIRAnalyticsDebugEnabled`

### Check Service Status

```typescript
async function checkFirebaseStatus() {
  console.log('Checking Firebase services...');
  
  try {
    // App Check
    const token = await FirebaseKit.appCheck.getToken();
    console.log('App Check: ✓', token.token.substring(0, 10) + '...');
  } catch (e) {
    console.error('App Check: ✗', e);
  }
  
  try {
    // Analytics
    const { appInstanceId } = await FirebaseKit.analytics.getAppInstanceId();
    console.log('Analytics: ✓', appInstanceId);
  } catch (e) {
    console.error('Analytics: ✗', e);
  }
  
  try {
    // Crashlytics
    const { enabled } = await FirebaseKit.crashlytics.isCrashlyticsCollectionEnabled();
    console.log('Crashlytics: ✓', enabled ? 'Enabled' : 'Disabled');
  } catch (e) {
    console.error('Crashlytics: ✗', e);
  }
  
  try {
    // Performance
    const { enabled } = await FirebaseKit.performance.isPerformanceCollectionEnabled();
    console.log('Performance: ✓', enabled ? 'Enabled' : 'Disabled');
  } catch (e) {
    console.error('Performance: ✗', e);
  }
  
  try {
    // Remote Config
    const { values } = await FirebaseKit.remoteConfig.getAll();
    console.log('Remote Config: ✓', Object.keys(values).length + ' values');
  } catch (e) {
    console.error('Remote Config: ✗', e);
  }
}
```

### Network Debugging

Use Chrome DevTools for web:
1. Open DevTools → Network tab
2. Filter by `firebase` or `google`
3. Check request/response details

For native platforms:
- Android: Use Android Studio Network Profiler
- iOS: Use Xcode Instruments

## Common Solutions

### Reset Everything

```bash
# Clean all caches
npm cache clean --force
cd android && ./gradlew clean && cd ..
cd ios/App && pod cache clean --all && cd ../..

# Remove and reinstall
rm -rf node_modules
rm -rf android/app/build
rm -rf ios/App/Pods
rm package-lock.json

# Reinstall
npm install
npx cap sync

# Rebuild
cd ios/App && pod install && cd ../..
npm run build
npx cap copy
```

### Verify Configuration

```typescript
async function verifyFirebaseConfig() {
  const config = {
    project: {
      android: {
        packageName: 'com.example.app',
        googleServicesJson: 'android/app/google-services.json'
      },
      ios: {
        bundleId: 'com.example.app',
        googleServicePlist: 'ios/App/App/GoogleService-Info.plist'
      }
    },
    services: {
      appCheck: true,
      analytics: true,
      crashlytics: true,
      performance: true,
      remoteConfig: true,
      adMob: true
    }
  };
  
  // Check files exist
  const fs = require('fs');
  
  if (Capacitor.getPlatform() === 'android') {
    if (!fs.existsSync(config.project.android.googleServicesJson)) {
      console.error('Missing google-services.json');
    }
  }
  
  if (Capacitor.getPlatform() === 'ios') {
    if (!fs.existsSync(config.project.ios.googleServicePlist)) {
      console.error('Missing GoogleService-Info.plist');
    }
  }
  
  return config;
}
```

### Contact Support

If you're still experiencing issues:

1. Check [GitHub Issues](https://github.com/aoneahsan/capacitor-firebase-kit/issues)
2. Create a new issue with:
   - Platform (iOS/Android/Web)
   - Plugin version
   - Capacitor version
   - Error messages
   - Minimal reproduction code
3. Include any relevant logs

## Prevention Tips

1. **Always handle errors** - Wrap Firebase calls in try-catch
2. **Check platform** - Some features are platform-specific
3. **Use TypeScript** - Catch errors at compile time
4. **Test on real devices** - Some features don't work on simulators
5. **Keep dependencies updated** - Regular updates fix bugs
6. **Monitor Firebase Console** - Check for service issues
7. **Enable debug logging** - During development
8. **Clean up resources** - Remove listeners, stop traces

Remember: Most issues are configuration-related. Double-check your setup against the integration guide.