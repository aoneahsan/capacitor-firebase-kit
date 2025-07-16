# Capacitor Firebase Kit

[![npm version](https://badge.fury.io/js/capacitor-firebase-kit.svg)](https://badge.fury.io/js/capacitor-firebase-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/capacitor-firebase-kit.svg)](https://www.npmjs.com/package/capacitor-firebase-kit)

A comprehensive Firebase services plugin for Capacitor that provides secure, type-safe, and framework-independent access to Firebase services across Android, iOS, and Web platforms.

## 🚀 Features

- 🔐 **App Check** - Protect your backend resources from abuse
- 💰 **AdMob** - Monetize with banner, interstitial, and rewarded ads  
- 🐛 **Crashlytics** - Track and fix stability issues
- 📊 **Performance Monitoring** - Monitor app performance metrics
- 📈 **Analytics** - Understand user behavior and app usage
- ⚙️ **Remote Config** - Dynamically configure your app
- 📱 **Cross-platform** - Works on iOS, Android, and Web
- 🔍 **Type-safe** - Full TypeScript support with comprehensive types
- 🎯 **Framework-agnostic** - Works with any JavaScript framework
- 🛡️ **Production-ready** - Battle-tested and reliable

## 📦 Installation

```bash
npm install capacitor-firebase-kit
npx cap sync
```

Or with yarn:

```bash
yarn add capacitor-firebase-kit
npx cap sync
```

## 🔧 Setup

### Prerequisites

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Add your iOS and Android apps to the Firebase project
3. Download configuration files:
   - **Android**: Download `google-services.json` and place it in `android/app/`
   - **iOS**: Download `GoogleService-Info.plist` and add it to your Xcode project

### Automatic Setup (Recommended)

After installing the plugin, it will automatically check your project configuration. To apply automatic fixes:

```bash
# Configure both platforms
npx capacitor-firebase-kit configure all

# Or configure specific platform
npx capacitor-firebase-kit configure android
npx capacitor-firebase-kit configure ios
```

This will:
- ✅ Add required Gradle plugins for Android
- ✅ Configure Firebase initialization for iOS
- ✅ Update build files automatically
- ✅ Create backups of modified files

### Manual Setup (If Automatic Setup Fails)

#### Android Setup

1. Add the following to your app's `android/build.gradle`:

```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
        classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.9'
        classpath 'com.google.firebase:perf-plugin:1.4.2'
    }
}
```

2. Apply the plugins in `android/app/build.gradle`:

```gradle
apply plugin: 'com.google.gms.google-services'
apply plugin: 'com.google.firebase.crashlytics'
apply plugin: 'com.google.firebase.firebase-perf'
```

#### iOS Setup

1. Add the following to your `ios/App/Podfile`:

```ruby
platform :ios, '13.0'
use_frameworks!
```

2. Run `cd ios/App && pod install`

3. Initialize Firebase in your `AppDelegate.swift`:

```swift
import Firebase

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()
        return true
    }
}
```

### Why Manual Steps Are Needed

Some configuration must be done at the app level because:

1. **Build Configuration** - Firebase requires build-time processing of your configuration files
2. **App Lifecycle** - Firebase must be initialized before any plugins load
3. **Security** - Your Firebase configuration files contain project-specific credentials
4. **Platform Requirements** - Each platform has specific initialization requirements

The automatic setup script helps minimize these manual steps where possible.

## 📖 Usage

### Import the Plugin

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';
```

### App Check

Protect your backend resources from abuse.

```typescript
// Initialize App Check
await FirebaseKit.appCheck.initialize({
  provider: 'playIntegrity', // Android: 'playIntegrity' or 'safetyNet'
  // provider: 'deviceCheck', // iOS: 'deviceCheck' or 'appAttest'
  // provider: 'recaptchaV3', // Web: 'recaptchaV3' or 'recaptchaEnterprise'
  siteKey: 'your-recaptcha-site-key', // Required for web
  isTokenAutoRefreshEnabled: true
});

// Get App Check token
const { token } = await FirebaseKit.appCheck.getToken();

// Listen for token changes
await FirebaseKit.appCheck.addListener('appCheckTokenChanged', (token) => {
  console.log('New token:', token);
});
```

### AdMob

Monetize your app with Google AdMob.

```typescript
// Initialize AdMob
await FirebaseKit.adMob.initialize({
  requestTrackingAuthorization: true, // iOS only
  testingDevices: ['YOUR_TEST_DEVICE_ID']
});

// Request consent information
const consentInfo = await FirebaseKit.adMob.requestConsentInfo();
if (consentInfo.isConsentFormAvailable) {
  await FirebaseKit.adMob.showConsentForm();
}

// Show a banner ad
await FirebaseKit.adMob.showBanner({
  adId: 'ca-app-pub-3940256099942544/6300978111', // Test ad ID
  adSize: 'BANNER',
  position: 'BOTTOM_CENTER'
});

// Load and show an interstitial ad
await FirebaseKit.adMob.loadInterstitial({
  adId: 'ca-app-pub-3940256099942544/1033173712'
});
await FirebaseKit.adMob.showInterstitial();

// Load and show a rewarded ad
await FirebaseKit.adMob.loadRewarded({
  adId: 'ca-app-pub-3940256099942544/5224354917'
});
await FirebaseKit.adMob.showRewarded();

// Listen for ad events
await FirebaseKit.adMob.addListener('rewardedAdRewarded', (reward) => {
  console.log('User earned reward:', reward);
});
```

### Crashlytics

Track crashes and errors in your app.

```typescript
// Log a message
await FirebaseKit.crashlytics.log({ message: 'User clicked checkout' });

// Set user identifier
await FirebaseKit.crashlytics.setUserId({ userId: 'user123' });

// Set custom attributes
await FirebaseKit.crashlytics.setCustomKeys({
  attributes: {
    subscription_type: 'premium',
    user_level: 42,
    beta_tester: true
  }
});

// Log a non-fatal exception
await FirebaseKit.crashlytics.logException({
  message: 'API call failed',
  code: 'API_ERROR',
  stackTrace: [
    {
      fileName: 'api.service.ts',
      lineNumber: 123,
      methodName: 'fetchUserData'
    }
  ]
});

// Force a test crash (for testing only!)
await FirebaseKit.crashlytics.crash();
```

### Performance Monitoring

Monitor your app's performance.

```typescript
// Initialize Performance Monitoring
await FirebaseKit.performance.initialize({ enabled: true });

// Start a custom trace
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'checkout_flow'
});

// Add metrics and attributes
await FirebaseKit.performance.incrementMetric({
  traceId,
  metricName: 'items_processed',
  value: 5
});

await FirebaseKit.performance.putAttribute({
  traceId,
  attribute: 'payment_method',
  value: 'credit_card'
});

// Stop the trace
await FirebaseKit.performance.stopTrace({ traceId });

// Monitor screen rendering
const { traceId: screenTrace } = await FirebaseKit.performance.startScreenTrace({
  screenName: 'ProductList'
});
// ... screen renders ...
await FirebaseKit.performance.stopScreenTrace({ traceId: screenTrace });
```

### Analytics

Track user behavior and app usage.

```typescript
// Initialize Analytics
await FirebaseKit.analytics.initialize({
  collectionEnabled: true
});

// Log events
await FirebaseKit.analytics.logEvent({
  name: 'purchase',
  params: {
    value: 29.99,
    currency: 'USD',
    items: ['SKU123', 'SKU456']
  }
});

// Set user properties
await FirebaseKit.analytics.setUserProperty({
  key: 'favorite_category',
  value: 'electronics'
});

// Set user ID
await FirebaseKit.analytics.setUserId({ userId: 'user123' });

// Track screen views
await FirebaseKit.analytics.setCurrentScreen({
  screenName: 'ProductDetails',
  screenClass: 'ProductViewController'
});

// Set consent
await FirebaseKit.analytics.setConsent({
  analyticsStorage: 'granted',
  adStorage: 'granted',
  adUserData: 'granted',
  adPersonalization: 'granted'
});
```

### Remote Config

Dynamically configure your app.

```typescript
// Initialize Remote Config
await FirebaseKit.remoteConfig.initialize({
  minimumFetchIntervalInSeconds: 3600
});

// Set default values
await FirebaseKit.remoteConfig.setDefaults({
  defaults: {
    welcome_message: 'Welcome!',
    button_color: '#FF0000',
    feature_enabled: false
  }
});

// Fetch and activate
const { activated } = await FirebaseKit.remoteConfig.fetchAndActivate();

// Get values
const { asString, asBoolean } = await FirebaseKit.remoteConfig.getValue({
  key: 'welcome_message'
});

// Get all values
const { values } = await FirebaseKit.remoteConfig.getAll();

// Listen for updates
await FirebaseKit.remoteConfig.addListener('remoteConfigUpdated', (update) => {
  console.log('Config updated:', update.updatedKeys);
});
```

## 🔒 Type Safety

This plugin is fully typed with TypeScript. All methods, parameters, and return types are strongly typed for better development experience and fewer runtime errors.

```typescript
import type {
  AppCheckTokenResult,
  ConsentStatus,
  RemoteConfigValue,
  LogEventOptions
} from 'capacitor-firebase-kit';
```

## 🚨 Error Handling

All methods return promises and will reject with typed error codes:

```typescript
try {
  await FirebaseKit.appCheck.getToken();
} catch (error) {
  if (error.code === 'APP_CHECK_TOKEN_EXPIRED') {
    // Handle token expiration
  }
}
```

## 📱 Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| App Check | ✅ | ✅ | ✅ |
| AdMob | ✅ | ✅ | ❌ |
| Crashlytics | ✅ | ✅ | ⚠️ |
| Performance | ✅ | ✅ | ⚠️ |
| Analytics | ✅ | ✅ | ✅ |
| Remote Config | ✅ | ✅ | ✅ |

✅ Fully supported
⚠️ Partially supported (some features may not be available)
❌ Not supported

## 📄 License

MIT

## 👨‍💻 Author

**Ahsan Mahmood**

An experienced software engineer passionate about creating high-quality, open-source tools for the developer community.

- 🌐 Website: [https://aoneahsan.com](https://aoneahsan.com)
- 📧 Email: aoneahsan@gmail.com
- 💼 LinkedIn: [https://linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan)
- 🐦 Twitter: [@aoneahsan](https://twitter.com/aoneahsan)
- 💻 GitHub: [@aoneahsan](https://github.com/aoneahsan)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## 🆘 Support

For issues and feature requests, please [create an issue](https://github.com/aoneahsan/capacitor-firebase-kit/issues) on GitHub.

## 🌟 Acknowledgments

This plugin is open-source and created for the community. Special thanks to all contributors and users who help make this project better.

---

Made with ❤️ by Ahsan Mahmood for the Capacitor community