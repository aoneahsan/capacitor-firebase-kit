# iOS Setup Guide

## Info.plist Requirements

Add the following entries to your iOS app's Info.plist file:

### Required Entries

```xml
<!-- Firebase Configuration -->
<key>FirebaseAppDelegateProxyEnabled</key>
<false/>

<!-- AdMob Configuration -->
<key>GADApplicationIdentifier</key>
<string>YOUR_ADMOB_APP_ID</string>

<!-- SKAdNetwork identifiers for AdMob -->
<key>SKAdNetworkItems</key>
<array>
    <dict>
        <key>SKAdNetworkIdentifier</key>
        <string>cstr6suwn9.skadnetwork</string>
    </dict>
    <!-- Add more SKAdNetwork identifiers as needed -->
</array>

<!-- App Transport Security for AdMob -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
    <key>NSAllowsArbitraryLoadsForMedia</key>
    <true/>
    <key>NSAllowsArbitraryLoadsInWebContent</key>
    <true/>
</dict>

<!-- User Tracking Usage Description (iOS 14.5+) -->
<key>NSUserTrackingUsageDescription</key>
<string>This app uses tracking to deliver personalized ads.</string>

<!-- Location Usage (Optional for better ad targeting) -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app uses your location to provide relevant ads.</string>
```

### Optional Entries

```xml
<!-- Disable automatic Firebase Analytics collection -->
<key>FirebaseAnalyticsCollectionEnabled</key>
<false/>

<!-- Disable automatic Firebase Crashlytics collection -->
<key>FirebaseCrashlyticsCollectionEnabled</key>
<false/>

<!-- Disable automatic Firebase Performance collection -->
<key>FirebasePerformanceCollectionEnabled</key>
<false/>
```

## App Capabilities

Enable the following capabilities in your Xcode project:

1. **Push Notifications** - Required for Firebase Cloud Messaging
2. **Background Modes** - Enable "Remote notifications" if using FCM
3. **App Groups** - If sharing data between app and extensions

## Firebase Configuration

1. Add your `GoogleService-Info.plist` file to your iOS project
2. Ensure it's added to your app target
3. The file should be at the root of your iOS project

## Build Settings

Ensure the following build settings:

- **iOS Deployment Target**: 14.0 or higher
- **Swift Language Version**: 5.9 or higher
- **Build Active Architecture Only**: Set to "No" for Release builds

## Privacy Manifest (iOS 17+)

If targeting iOS 17+, add a Privacy Manifest file (`PrivacyInfo.xcprivacy`) with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyTrackingDomains</key>
    <array/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeCrashData</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```