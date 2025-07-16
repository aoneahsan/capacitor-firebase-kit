# Getting Started with Capacitor Firebase Kit

This guide will walk you through installing and setting up Capacitor Firebase Kit in your Capacitor application.

## 📋 Prerequisites

Before you begin, ensure you have:

1. **A Capacitor Project**: Version 7.0.0 or higher
2. **Firebase Project**: Created at [Firebase Console](https://console.firebase.google.com)
3. **Platform Requirements**:
   - iOS: Xcode 14+ and iOS 13.0+
   - Android: Android Studio and min SDK 21
   - Web: Modern browser with ES2017 support

## 🚀 Installation

### Step 1: Install the Plugin

```bash
npm install capacitor-firebase-kit
npx cap sync
```

Or with yarn:

```bash
yarn add capacitor-firebase-kit
npx cap sync
```

### Step 2: Download Firebase Configuration Files

1. Go to your [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Download configuration files:

#### For Android:
- Click the gear icon → Project Settings
- Under "Your apps", select your Android app
- Download `google-services.json`
- Place it in `android/app/` directory

#### For iOS:
- Click the gear icon → Project Settings
- Under "Your apps", select your iOS app
- Download `GoogleService-Info.plist`
- Open Xcode and drag the file into your app's folder
- Ensure "Copy items if needed" is checked

## ⚙️ Configuration

### Automatic Configuration (Recommended)

The plugin includes an automatic configuration script that handles most setup steps:

```bash
# Configure both platforms
npx capacitor-firebase-kit configure all

# Or configure specific platform
npx capacitor-firebase-kit configure android
npx capacitor-firebase-kit configure ios
```

This script will:
- ✅ Add required Gradle dependencies for Android
- ✅ Configure Firebase initialization for iOS
- ✅ Update build configurations
- ✅ Create backup files before modifications

### Manual Configuration

If automatic configuration fails or you prefer manual setup:

#### Android Configuration

1. **Add to `android/build.gradle`** (Project level):

```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
        classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.9'
        classpath 'com.google.firebase:perf-plugin:1.4.2'
    }
}
```

2. **Add to `android/app/build.gradle`** (App level):

```gradle
apply plugin: 'com.google.gms.google-services'
apply plugin: 'com.google.firebase.crashlytics'
apply plugin: 'com.google.firebase.firebase-perf'
```

3. **Sync your project** in Android Studio

#### iOS Configuration

1. **Update `ios/App/Podfile`**:

```ruby
platform :ios, '13.0'
use_frameworks!

# Add this at the end
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
    end
  end
end
```

2. **Install pods**:

```bash
cd ios/App
pod install
cd ../..
```

3. **Initialize Firebase in `AppDelegate.swift`**:

```swift
import UIKit
import Firebase
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize Firebase
        FirebaseApp.configure()
        
        return true
    }
}
```

## 🔧 Basic Setup

### 1. Import the Plugin

In your TypeScript/JavaScript code:

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';
```

### 2. Initialize Services

Different Firebase services require initialization. Here's a typical setup:

```typescript
// App.tsx or main.ts
import { FirebaseKit } from 'capacitor-firebase-kit';

async function initializeFirebase() {
  try {
    // Initialize App Check (recommended for security)
    await FirebaseKit.appCheck.initialize({
      provider: 'playIntegrity', // Android
      // provider: 'deviceCheck', // iOS
      // provider: 'recaptchaV3', // Web
      isTokenAutoRefreshEnabled: true
    });

    // Initialize Analytics
    await FirebaseKit.analytics.initialize({
      collectionEnabled: true
    });

    // Initialize Performance Monitoring
    await FirebaseKit.performance.initialize({
      enabled: true
    });

    // Initialize AdMob (if using ads)
    await FirebaseKit.adMob.initialize({
      requestTrackingAuthorization: true, // iOS only
      testingDevices: ['YOUR_TEST_DEVICE_ID']
    });

    console.log('Firebase services initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// Call on app startup
initializeFirebase();
```

## 📱 Platform-Specific Setup

### Android

For AdMob, add your AdMob App ID to `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"/>
</application>
```

### iOS

For AdMob, add to your `Info.plist`:

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy</string>
```

For App Tracking Transparency (iOS 14+):

```xml
<key>NSUserTrackingUsageDescription</key>
<string>This app uses tracking to provide personalized ads.</string>
```

### Web

For web platform, ensure you include the Firebase SDK in your `index.html`:

```html
<!-- Firebase App (the core Firebase SDK) -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>

<!-- Add services you need -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-remote-config-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check-compat.js"></script>

<script>
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
</script>
```

## ✅ Verify Installation

To verify everything is set up correctly:

```typescript
// Test basic functionality
async function testFirebase() {
  try {
    // Test Analytics
    await FirebaseKit.analytics.logEvent({
      name: 'test_event',
      params: { test: 'true' }
    });

    // Test App Check
    const { token } = await FirebaseKit.appCheck.getToken();
    console.log('App Check token obtained:', token ? 'Yes' : 'No');

    console.log('Firebase test completed successfully!');
  } catch (error) {
    console.error('Firebase test failed:', error);
  }
}
```

## 🎯 Next Steps

Now that you have Capacitor Firebase Kit installed and configured:

1. **Explore Service Guides**: Check out detailed guides for each service
2. **Review Examples**: See [real-world examples](./examples.md)
3. **Configure Services**: Set up the specific Firebase services you need
4. **Test on Devices**: Test your implementation on real devices

## 🆘 Troubleshooting

If you encounter issues:

1. **Check Prerequisites**: Ensure all requirements are met
2. **Verify Files**: Confirm Firebase config files are in correct locations
3. **Review Logs**: Check native platform logs for detailed errors
4. **Clean Build**: Try cleaning and rebuilding your project
5. **See [Troubleshooting Guide](./troubleshooting.md)**: For common issues and solutions

## 📚 Additional Resources

- [API Reference](./api-reference.md) - Complete API documentation
- [Platform Guides](./platform-specific/) - Platform-specific details
- [Firebase Console](https://console.firebase.google.com) - Manage your Firebase project
- [Capacitor Documentation](https://capacitorjs.com/docs) - Official Capacitor docs

---

Need help? [Open an issue](https://github.com/aoneahsan/capacitor-firebase-kit/issues) on GitHub.