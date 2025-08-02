# Firebase Kit

[![npm version](https://badge.fury.io/js/capacitor-firebase-kit.svg)](https://badge.fury.io/js/capacitor-firebase-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/capacitor-firebase-kit.svg)](https://www.npmjs.com/package/capacitor-firebase-kit)

A **provider-less**, universal Firebase services integration that works seamlessly across React, React Native, and Capacitor apps - no providers or context required!

## ✨ Key Features

- 🚀 **Provider-less Architecture** - Works like Zustand, no React Context needed
- 🌍 **Universal Support** - React, React Native, Capacitor, and Node.js
- 📦 **Zero Config** - Automatic platform detection and adapter loading
- 🎯 **Tree-Shakeable** - Only loads the Firebase SDKs you actually use
- 💪 **TypeScript First** - Full type safety and IntelliSense support
- 🔄 **Dynamic Imports** - Firebase SDKs are loaded on-demand
- 🎨 **Works Anywhere** - In server components, dynamic imports, and more

## 🚀 Supported Services

- 🔐 **App Check** - Protect your backend resources from abuse
- 💰 **AdMob** - Monetize with banner, interstitial, and rewarded ads  
- 🐛 **Crashlytics** - Track and fix stability issues
- 📊 **Performance Monitoring** - Monitor app performance metrics
- 📈 **Analytics** - Understand user behavior and app usage
- ⚙️ **Remote Config** - Dynamically configure your app

## 📦 Installation

```bash
npm install capacitor-firebase-kit

# Firebase SDKs are loaded on-demand, but you can pre-install them:
# For Web/React apps:
npm install firebase

# For React Native apps:
npm install @react-native-firebase/app @react-native-firebase/analytics
# ... other React Native Firebase packages as needed

# For Capacitor apps:
npm install @capacitor/core  # Optional, only if using Capacitor
```

## 🔥 Quick Start

### React/Next.js App

```tsx
import firebaseKit from 'capacitor-firebase-kit';

// Initialize once in your app
await firebaseKit.initialize({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
});

// Use anywhere - no providers needed!
function MyComponent() {
  const trackEvent = () => {
    firebaseKit.analytics.logEvent('button_click', {
      screen: 'home',
      button: 'cta',
    });
  };

  return <button onClick={trackEvent}>Click Me</button>;
}

// Works in server components too!
export default async function ServerComponent() {
  const config = await firebaseKit.remoteConfig.getString('welcome_message');
  return <h1>{config.value}</h1>;
}
```

### React Native App

```tsx
import firebaseKit from 'capacitor-firebase-kit';

// Initialize in your App.tsx
firebaseKit.initialize({}); // Config from native files

// Use anywhere without providers
export function Screen() {
  const logPurchase = () => {
    firebaseKit.analytics.logEvent('purchase', {
      value: 29.99,
      currency: 'USD',
    });
  };

  return <Button onPress={logPurchase} title="Buy Now" />;
}
```

### Capacitor App

```typescript
import firebaseKit from 'capacitor-firebase-kit';

// Initialize on app start
firebaseKit.initialize({
  // Your Firebase config
});

// Use in any file or component
export function trackUserAction(action: string) {
  firebaseKit.analytics.logEvent('user_action', { action });
}
```

## 🎯 Why Provider-less?

Traditional Firebase integrations require wrapping your app in providers:

```tsx
// ❌ Traditional approach - requires providers
<FirebaseProvider>
  <AnalyticsProvider>
    <RemoteConfigProvider>
      <App />
    </RemoteConfigProvider>
  </AnalyticsProvider>
</FirebaseProvider>
```

With Firebase Kit:

```tsx
// ✅ Firebase Kit - no providers needed!
import firebaseKit from 'capacitor-firebase-kit';

// Just initialize and use anywhere
firebaseKit.initialize({ ... });

// Works in any component
firebaseKit.analytics.logEvent('app_open');
```

## 🔧 Platform-Specific Setup

### Web/React
No additional setup needed! Firebase SDKs are loaded dynamically when you use them.

### React Native
1. Follow the [React Native Firebase setup guide](https://rnfirebase.io/)
2. Add your `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)

### Capacitor
1. Add your `google-services.json` to `android/app/`
2. Add your `GoogleService-Info.plist` to your iOS project
3. Run `npx cap sync`

## 📚 API Examples

### Analytics
```typescript
// Log events
await firebaseKit.analytics.logEvent('level_complete', {
  level: 5,
  score: 1000,
});

// Set user properties
await firebaseKit.analytics.setUserProperties({
  subscription_type: 'premium',
});

// Set current screen
await firebaseKit.analytics.setCurrentScreen('HomeScreen');
```

### App Check
```typescript
// Initialize App Check
await firebaseKit.appCheck.initialize({
  provider: 'recaptcha-v3', // Web
  // provider: 'playIntegrity', // Android
  // provider: 'deviceCheck', // iOS
  siteKey: 'YOUR_SITE_KEY',
});

// Get token
const { token } = await firebaseKit.appCheck.getToken();
```

### Crashlytics
```typescript
// Record exceptions
try {
  riskyOperation();
} catch (error) {
  await firebaseKit.crashlytics.recordException(error);
}

// Set user identifier
await firebaseKit.crashlytics.setUserId('user123');

// Log custom messages
await firebaseKit.crashlytics.log('User clicked checkout');
```

### Performance Monitoring
```typescript
// Start a trace
const { traceId } = await firebaseKit.performance.startTrace('api_call');

// Add metrics
await firebaseKit.performance.incrementMetric('api_call', 'response_size', 2048);

// Stop the trace
await firebaseKit.performance.stopTrace('api_call');
```

### Remote Config
```typescript
// Initialize with defaults
await firebaseKit.remoteConfig.initialize({
  minimumFetchIntervalMillis: 3600000,
  defaultConfig: {
    feature_enabled: false,
    api_endpoint: 'https://api.example.com',
  },
});

// Fetch and activate
await firebaseKit.remoteConfig.fetchAndActivate();

// Get values
const { value: featureEnabled } = await firebaseKit.remoteConfig.getBoolean('feature_enabled');
```

### AdMob
```typescript
// Initialize AdMob
await firebaseKit.adMob.initialize();

// Show a banner ad
await firebaseKit.adMob.showBanner({
  adId: 'YOUR_BANNER_AD_ID',
  adSize: 'BANNER',
  position: 'BOTTOM_CENTER',
});

// Show an interstitial
await firebaseKit.adMob.prepareInterstitial({
  adId: 'YOUR_INTERSTITIAL_AD_ID',
});
await firebaseKit.adMob.showInterstitial();
```

## 🔄 Migration from Capacitor Plugin

If you're using the old Capacitor-specific version:

```typescript
// Old way (Capacitor only)
import { FirebaseKit } from 'capacitor-firebase-kit';
await FirebaseKit.analytics.logEvent({ name: 'event' });

// New way (Universal)
import firebaseKit from 'capacitor-firebase-kit';
await firebaseKit.analytics.logEvent('event');
```

## 📱 Platform Support

| Service | Web | iOS | Android | React Native | Node.js |
|---------|-----|-----|---------|--------------|---------|
| Analytics | ✅ | ✅ | ✅ | ✅ | ❌ |
| App Check | ✅ | ✅ | ✅ | ✅ | ❌ |
| AdMob | ❌ | ✅ | ✅ | ✅ | ❌ |
| Crashlytics | ❌ | ✅ | ✅ | ✅ | ❌ |
| Performance | ✅ | ✅ | ✅ | ✅ | ❌ |
| Remote Config | ✅ | ✅ | ✅ | ✅ | ❌ |

Note: Services marked with ❌ will log warnings but won't break your app.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Ahsan Mahmood](https://github.com/aoneahsan)

## 🙏 Credits

Built with ❤️ by [Ahsan Mahmood](https://aoneahsan.com)