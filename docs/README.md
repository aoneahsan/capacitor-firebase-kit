# Capacitor Firebase Kit Documentation

Welcome to the comprehensive documentation for Capacitor Firebase Kit - a complete Firebase services integration plugin for Capacitor applications.

## 📚 Table of Contents

### Getting Started
- [Installation & Setup](./getting-started.md) - Complete guide to get up and running
- [API Reference](./api-reference.md) - Detailed documentation of all available methods

### Service Guides
- [App Check](./services/app-check.md) - Protect your backend resources from abuse
- [AdMob](./services/admob.md) - Monetization with Google AdMob
- [Analytics](./services/analytics.md) - Track user behavior and app usage
- [Crashlytics](./services/crashlytics.md) - Crash reporting and stability monitoring
- [Performance Monitoring](./services/performance.md) - Monitor app performance metrics
- [Remote Config](./services/remote-config.md) - Dynamic app configuration

### Advanced Topics
- [Examples](./examples.md) - Real-world implementation examples
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
- [Migration Guide](./migration-guide.md) - Migrating from other Firebase plugins

### Platform-Specific Guides
- [Android Configuration](./platform-specific/android.md) - Android-specific setup and features
- [iOS Configuration](./platform-specific/ios.md) - iOS-specific setup and features
- [Web Implementation](./platform-specific/web.md) - Web platform details and limitations

## 🚀 Quick Start

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// Initialize App Check
await FirebaseKit.appCheck.initialize({
  provider: 'playIntegrity',
  isTokenAutoRefreshEnabled: true
});

// Track an event
await FirebaseKit.analytics.logEvent({
  name: 'tutorial_begin',
  params: { tutorial_id: '123' }
});

// Show an ad
await FirebaseKit.adMob.showBanner({
  adId: 'ca-app-pub-xxxxx',
  adSize: 'BANNER',
  position: 'BOTTOM_CENTER'
});
```

## 🔍 What is Capacitor Firebase Kit?

Capacitor Firebase Kit is a comprehensive plugin that brings the full power of Firebase services to your Capacitor applications. It provides:

- **Unified API**: Single, consistent API across all Firebase services
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Cross-Platform**: Works seamlessly on iOS, Android, and Web
- **Production Ready**: Battle-tested implementation with proper error handling
- **Easy Integration**: Automatic configuration scripts to simplify setup

## 📱 Supported Services

| Service | Description | iOS | Android | Web |
|---------|-------------|-----|---------|-----|
| **App Check** | Protect backend resources from abuse | ✅ | ✅ | ✅ |
| **AdMob** | Monetization with ads | ✅ | ✅ | ❌ |
| **Analytics** | User behavior tracking | ✅ | ✅ | ✅ |
| **Crashlytics** | Crash reporting | ✅ | ✅ | ⚠️ |
| **Performance** | Performance monitoring | ✅ | ✅ | ⚠️ |
| **Remote Config** | Dynamic configuration | ✅ | ✅ | ✅ |

✅ Fully supported | ⚠️ Partially supported | ❌ Not supported

## 🛠️ Requirements

- Capacitor 7.0.0 or higher
- iOS 13.0+ for iOS apps
- Android 5.0 (API 21)+ for Android apps
- Modern browsers for web support

## 📄 License

This plugin is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## 👨‍💻 Author

Created with ❤️ by **Ahsan Mahmood** for the Capacitor community.

- Website: [https://aoneahsan.com](https://aoneahsan.com)
- GitHub: [@aoneahsan](https://github.com/aoneahsan)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/aoneahsan/capacitor-firebase-kit/blob/main/CONTRIBUTING.md) for details.

## 🆘 Need Help?

- 📖 Check the [Troubleshooting Guide](./troubleshooting.md)
- 💬 [Open an issue](https://github.com/aoneahsan/capacitor-firebase-kit/issues) on GitHub
- 📧 Contact: aoneahsan@gmail.com