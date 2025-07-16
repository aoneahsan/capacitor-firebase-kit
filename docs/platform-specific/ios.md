# iOS Platform Guide

Complete guide for using Capacitor Firebase Kit on iOS platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Platform-Specific Features](#platform-specific-features)
- [Build Configuration](#build-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

### System Requirements
- Xcode 15.0 or later
- iOS 12.0 or later
- macOS 10.15 (Catalina) or later
- Swift 5.9 or later
- CocoaPods 1.12.0 or later

### Firebase Project Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add an iOS app to your project
3. Download `GoogleService-Info.plist` file
4. Enable required Firebase services (App Check, AdMob, Analytics, etc.)

## Installation

### 1. Install the Plugin

```bash
npm install capacitor-firebase-kit
npx cap sync ios
```

### 2. Add Firebase Configuration

1. Open your project in Xcode: `npx cap open ios`
2. Drag `GoogleService-Info.plist` into the project navigator
3. Ensure "Copy items if needed" is checked
4. Add to the correct target (usually "App")

### 3. Configure Podfile

The plugin automatically configures the Podfile, but you may need to add additional pods:

```ruby
# ios/App/Podfile
platform :ios, '12.0'
use_frameworks!

target 'App' do
  capacitor_pods
  
  # Firebase pods (automatically added by plugin)
  pod 'Firebase/Analytics'
  pod 'Firebase/Crashlytics'
  pod 'Firebase/Performance'
  pod 'Firebase/RemoteConfig'
  pod 'Firebase/AppCheck'
  pod 'Google-Mobile-Ads-SDK'
  
  # iOS-specific pods
  pod 'GoogleAppMeasurement'
  pod 'GoogleUtilities'
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_VERSION'] = '5.9'
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
    end
  end
end
```

### 4. Install Pods

```bash
cd ios/App
pod install
```

## Configuration

### Info.plist Configuration

Add to `ios/App/App/Info.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
    <!-- App Transport Security -->
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
    
    <!-- App Tracking Transparency (for AdMob) -->
    <key>NSUserTrackingUsageDescription</key>
    <string>This app uses tracking to provide personalized ads and improve user experience.</string>
    
    <!-- Firebase Configuration -->
    <key>FirebaseAutomaticScreenReportingEnabled</key>
    <true/>
    
    <key>FirebaseAppDelegateProxyEnabled</key>
    <true/>
    
    <!-- AdMob Configuration -->
    <key>GADApplicationIdentifier</key>
    <string>ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY</string>
    
    <!-- Optional: Disable automatic Firebase initialization -->
    <key>FirebaseAutomaticInitializationEnabled</key>
    <false/>
    
    <!-- App Check (optional) -->
    <key>FIRAppCheckDebugEnabled</key>
    <false/>
</dict>
</plist>
```

### Capabilities Configuration

In Xcode, add required capabilities:

1. **App Groups** (if using shared containers)
2. **Background App Refresh** (for analytics)
3. **Push Notifications** (if using FCM)

### Build Settings

In Xcode Build Settings:
- **iOS Deployment Target**: 12.0 or later
- **Swift Language Version**: 5.9
- **Build Active Architecture Only**: No (for Release)
- **Enable Bitcode**: No (required for some Firebase libraries)

## Platform-Specific Features

### App Check with Device Check

iOS uses Device Check or App Attest for App Check:

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// For iOS 14+, use App Attest
await FirebaseKit.appCheck.initialize({
  provider: 'appAttest',
  isTokenAutoRefreshEnabled: true
});

// For iOS 11-13, use Device Check
await FirebaseKit.appCheck.initialize({
  provider: 'deviceCheck',
  isTokenAutoRefreshEnabled: true
});
```

### AdMob Integration

iOS-specific AdMob features:

```typescript
// Initialize AdMob with App Tracking Transparency
await FirebaseKit.adMob.initialize({
  requestTrackingAuthorization: true,
  testingDevices: ['DEVICE_ID_HASH'] // For testing
});

// Show banner ad with iOS-specific sizing
await FirebaseKit.adMob.showBanner({
  adId: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  adSize: 'ADAPTIVE_BANNER', // iOS supports adaptive banners
  position: 'BOTTOM_CENTER'
});
```

### Crashlytics Integration

iOS-specific crash reporting:

```typescript
// Test crash (development only)
await FirebaseKit.crashlytics.crash();

// Log non-fatal exceptions with iOS context
await FirebaseKit.crashlytics.logException({
  message: 'Custom error message',
  code: 'CUSTOM_ERROR',
  domain: 'ios'
});

// Set iOS-specific custom keys
await FirebaseKit.crashlytics.setCustomKeys({
  attributes: {
    device_model: 'iPhone',
    os_version: '17.0',
    app_version: '1.0.0'
  }
});
```

### Performance Monitoring

iOS-specific performance features:

```typescript
// Start a trace with iOS-specific name
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'ios_view_controller_load'
});

// Add iOS-specific attributes
await FirebaseKit.performance.putAttribute({
  traceId,
  attribute: 'view_controller',
  value: 'MainViewController'
});

// Stop trace
await FirebaseKit.performance.stopTrace({ traceId });
```

## Build Configuration

### Scheme Configuration

In Xcode, configure your scheme:

1. Go to **Product** > **Scheme** > **Edit Scheme**
2. In **Run** > **Arguments**, add:
   - `-FIRDebugEnabled` (for debug logging)
   - `-FIRAnalyticsDebugEnabled` (for analytics debug)
   - `-FIRAppCheckDebugEnabled` (for App Check debug)

### Build Phases

Add a new Run Script Phase in Build Phases:

```bash
# Firebase Crashlytics Upload dSYMs
"${PODS_ROOT}/FirebaseCrashlytics/upload-symbols" \
  -gsp "${PROJECT_DIR}/App/GoogleService-Info.plist" \
  -p ios "${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}"
```

### Code Signing

Ensure proper code signing:
1. Select your development team
2. Choose appropriate provisioning profiles
3. Enable automatic signing (recommended)

### Bitcode

Disable Bitcode in Build Settings:
- **Enable Bitcode**: No

This is required for some Firebase libraries.

## Testing

### Debug Mode

Enable debug logging by adding launch arguments:
- `-FIRDebugEnabled`
- `-FIRAnalyticsDebugEnabled`
- `-FIRAppCheckDebugEnabled`

### Test App Check

Use debug provider for testing:
```typescript
await FirebaseKit.appCheck.initialize({
  provider: 'debug',
  debugToken: 'YOUR_DEBUG_TOKEN'
});
```

### Test AdMob

Use test ad unit IDs:
```typescript
const TEST_AD_UNITS = {
  banner: 'ca-app-pub-3940256099942544/2934735716',
  interstitial: 'ca-app-pub-3940256099942544/4411468910',
  rewarded: 'ca-app-pub-3940256099942544/1712485313'
};
```

### Test Crashlytics

Force a crash for testing:
```typescript
// Only in debug builds
if (__DEV__) {
  await FirebaseKit.crashlytics.crash();
}
```

### Simulator vs Device

Some features work differently on simulator:
- **App Check**: Limited functionality on simulator
- **AdMob**: Test ads work on simulator
- **Performance**: Limited metrics on simulator
- **Crashlytics**: Works on simulator

## Troubleshooting

### Common Issues

#### GoogleService-Info.plist Not Found
```
Error: Could not locate configuration file: 'GoogleService-Info.plist'
```
**Solution:** Ensure the file is added to Xcode project and target.

#### Pod Install Failed
```
Error: CocoaPods could not find compatible versions
```
**Solution:** Update CocoaPods and clear cache:
```bash
sudo gem install cocoapods
pod repo update
pod cache clean --all
```

#### Swift Version Incompatibility
```
Error: Module compiled with Swift X.X cannot be imported by Swift Y.Y
```
**Solution:** Update Swift version in post_install hook.

#### App Tracking Transparency
```
Error: This app does not have permission to track
```
**Solution:** Add `NSUserTrackingUsageDescription` to Info.plist and request permission.

#### Archive Build Failed
```
Error: Command PhaseScriptExecution failed with a nonzero exit code
```
**Solution:** Check build phases and script permissions.

#### Device Check Not Available
```
Error: Device Check is not available on this device
```
**Solution:** Use App Attest for iOS 14+ or debug provider for testing.

### Debug Commands

```bash
# View iOS logs
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "App"'

# Clear app data
xcrun simctl uninstall booted com.example.app

# Reset simulator
xcrun simctl erase all

# Check capabilities
codesign -d --entitlements - App.app
```

## Best Practices

### 1. Memory Management
```swift
// Proper memory management in custom view controllers
class CustomViewController: UIViewController {
    deinit {
        // Clean up Firebase listeners
        NotificationCenter.default.removeObserver(self)
    }
}
```

### 2. Background Handling
```typescript
// Handle app state changes
import { App } from '@capacitor/app';

App.addListener('appStateChange', ({ isActive }) => {
  if (isActive) {
    // Resume Firebase operations
    FirebaseKit.analytics.logEvent({ name: 'app_resume' });
  } else {
    // Pause Firebase operations
    FirebaseKit.analytics.logEvent({ name: 'app_pause' });
  }
});
```

### 3. Error Handling
```typescript
// Handle iOS-specific errors
try {
  await FirebaseKit.appCheck.getToken();
} catch (error) {
  if (error.code === 'DEVICE_CHECK_NOT_AVAILABLE') {
    // Handle Device Check not available
    console.log('Device Check not available on this device');
  }
}
```

### 4. Performance Optimization
```typescript
// Use iOS-specific performance optimizations
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'ios_ui_rendering'
});

// Add iOS-specific metrics
await FirebaseKit.performance.incrementMetric({
  traceId,
  metricName: 'view_rendering_time',
  value: renderingTime
});
```

### 5. Privacy Compliance
```typescript
// Request tracking permission before initializing AdMob
await FirebaseKit.adMob.initialize({
  requestTrackingAuthorization: true
});

// Check authorization status
const { status } = await FirebaseKit.adMob.getTrackingAuthorizationStatus();
if (status === 'authorized') {
  // User has granted permission
}
```

### 6. Testing Strategy
```typescript
// Use different configurations for debug/release
const isDebug = __DEV__;
const provider = isDebug ? 'debug' : 'appAttest';

await FirebaseKit.appCheck.initialize({
  provider,
  debugToken: isDebug ? 'YOUR_DEBUG_TOKEN' : undefined
});
```

## Additional Resources

- [Firebase iOS Setup Guide](https://firebase.google.com/docs/ios/setup)
- [App Attest Documentation](https://developer.apple.com/documentation/devicecheck/app_attest)
- [AdMob iOS Implementation](https://developers.google.com/admob/ios)
- [iOS App Development Guide](https://developer.apple.com/ios/)
- [Firebase iOS SDK Reference](https://firebase.google.com/docs/reference/ios)

For more help, see the [main troubleshooting guide](../troubleshooting.md).