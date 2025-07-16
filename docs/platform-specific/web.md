# Web Platform Guide

Complete guide for using Capacitor Firebase Kit on web platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Platform-Specific Features](#platform-specific-features)
- [Limitations](#limitations)
- [Browser Support](#browser-support)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

### System Requirements
- Modern web browser (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- HTTPS connection (required for most Firebase features)
- Node.js 18.0 or later
- npm or yarn package manager

### Firebase Project Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add a web app to your project
3. Copy Firebase configuration object
4. Enable required Firebase services (App Check, AdMob, Analytics, etc.)

## Installation

### 1. Install the Plugin

```bash
npm install capacitor-firebase-kit
npx cap sync
```

### 2. Add Firebase JavaScript SDK

Add Firebase SDK to your `index.html`:

```html
<!-- Firebase v10 (Modular SDK) -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-remote-config-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-performance-compat.js"></script>

<!-- Google AdSense (for AdMob web) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

### 3. Initialize Firebase

Add Firebase configuration to your `index.html`:

```html
<script>
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456789",
    measurementId: "G-XXXXXXXXXX"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
</script>
```

## Configuration

### Web App Configuration

The plugin automatically detects web environment and uses JavaScript SDK implementations.

### Content Security Policy

Add to your CSP headers:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' 
    https://www.gstatic.com 
    https://www.googletagmanager.com
    https://pagead2.googlesyndication.com
    https://www.google.com
    https://www.recaptcha.net;
  connect-src 'self' 
    https://firebaseinstallations.googleapis.com
    https://firebaseremoteconfig.googleapis.com
    https://firebaselogging.googleapis.com
    https://firebase.googleapis.com
    https://*.googlesyndication.com;
  frame-src 'self' 
    https://www.google.com
    https://www.recaptcha.net
    https://*.googlesyndication.com;
  img-src 'self' data: 
    https://*.googlesyndication.com
    https://www.google.com;
">
```

### Service Worker

For offline functionality, configure service worker:

```javascript
// sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  // Your config
});

// Handle background messages
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload);
});
```

## Platform-Specific Features

### App Check with reCAPTCHA

Web uses reCAPTCHA for App Check:

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// Initialize App Check with reCAPTCHA v3
await FirebaseKit.appCheck.initialize({
  provider: 'recaptchaV3',
  siteKey: 'YOUR_RECAPTCHA_SITE_KEY',
  isTokenAutoRefreshEnabled: true
});

// Or use reCAPTCHA Enterprise
await FirebaseKit.appCheck.initialize({
  provider: 'recaptchaEnterprise',
  siteKey: 'YOUR_RECAPTCHA_ENTERPRISE_SITE_KEY',
  isTokenAutoRefreshEnabled: true
});
```

### AdMob Web Implementation

Web uses Google AdSense for ads:

```typescript
// Initialize AdMob (limited web support)
await FirebaseKit.adMob.initialize({
  requestTrackingAuthorization: false, // Not applicable on web
  testingDevices: [] // Not applicable on web
});

// Show banner ad using AdSense
await FirebaseKit.adMob.showBanner({
  adId: 'ca-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  adSize: 'BANNER',
  position: 'BOTTOM_CENTER'
});
```

**Note:** Full AdMob functionality is limited on web. Consider using Google AdSense directly.

### Analytics Web Implementation

Web analytics with enhanced e-commerce:

```typescript
// Initialize Analytics
await FirebaseKit.analytics.initialize({
  collectionEnabled: true
});

// Log events with web-specific parameters
await FirebaseKit.analytics.logEvent({
  name: 'page_view',
  params: {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname
  }
});

// Track single-page application navigation
await FirebaseKit.analytics.logEvent({
  name: 'page_view',
  params: {
    page_title: 'Product Details',
    page_location: window.location.href,
    content_group1: 'Products'
  }
});
```

### Performance Monitoring

Web performance monitoring:

```typescript
// Initialize Performance
await FirebaseKit.performance.initialize({
  enabled: true
});

// Track navigation timing
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'page_load'
});

// Add web-specific metrics
await FirebaseKit.performance.incrementMetric({
  traceId,
  metricName: 'dom_content_loaded',
  value: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
});

await FirebaseKit.performance.incrementMetric({
  traceId,
  metricName: 'load_complete',
  value: performance.timing.loadEventEnd - performance.timing.navigationStart
});

await FirebaseKit.performance.stopTrace({ traceId });
```

### Crashlytics Web Implementation

Web crash reporting (limited):

```typescript
// Log JavaScript errors
window.addEventListener('error', async (event) => {
  await FirebaseKit.crashlytics.logException({
    message: event.message,
    code: 'JAVASCRIPT_ERROR',
    stackTrace: [{
      fileName: event.filename,
      lineNumber: event.lineno,
      methodName: 'global'
    }]
  });
});

// Log promise rejections
window.addEventListener('unhandledrejection', async (event) => {
  await FirebaseKit.crashlytics.logException({
    message: event.reason?.message || 'Unhandled Promise Rejection',
    code: 'PROMISE_REJECTION'
  });
});
```

### Remote Config Web Implementation

Web remote configuration:

```typescript
// Initialize Remote Config
await FirebaseKit.remoteConfig.initialize({
  minimumFetchIntervalInSeconds: 3600
});

// Set defaults
await FirebaseKit.remoteConfig.setDefaults({
  defaults: {
    theme_color: '#1976d2',
    feature_enabled: false,
    welcome_message: 'Welcome to our web app!'
  }
});

// Fetch and activate
const { activated } = await FirebaseKit.remoteConfig.fetchAndActivate();
if (activated) {
  // Update UI based on new config
  updateWebAppTheme();
}
```

## Limitations

### Service Limitations on Web

| Service | Web Support | Limitations |
|---------|-------------|-------------|
| **App Check** | ✅ Full | Requires reCAPTCHA |
| **AdMob** | ⚠️ Limited | Use AdSense instead |
| **Analytics** | ✅ Full | Enhanced e-commerce supported |
| **Crashlytics** | ⚠️ Limited | JavaScript errors only |
| **Performance** | ⚠️ Limited | Basic metrics only |
| **Remote Config** | ✅ Full | Full functionality |

### Technical Limitations

1. **Native Features**: No access to native device features
2. **Background Processing**: Limited background capabilities
3. **App Lifecycle**: Different lifecycle events compared to mobile
4. **Security**: Browser security restrictions apply
5. **Offline**: Limited offline capabilities
6. **Storage**: Browser storage limitations

### AdMob Limitations

```typescript
// Web-specific AdMob limitations
const webLimitations = {
  interstitial: false,    // Not supported
  rewarded: false,        // Not supported
  banner: true,          // Limited support
  nativeAdvanced: false  // Not supported
};
```

## Browser Support

### Minimum Requirements

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 60+ | Full support |
| Firefox | 55+ | Full support |
| Safari | 12+ | Some limitations |
| Edge | 79+ | Full support |
| Opera | 47+ | Full support |

### Feature Support by Browser

```typescript
// Check browser capabilities
const browserSupport = {
  serviceWorker: 'serviceWorker' in navigator,
  localStorage: typeof Storage !== 'undefined',
  webGL: !!document.createElement('canvas').getContext('webgl'),
  webRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
};
```

## Testing

### Development Server

Use HTTPS in development:

```bash
# Using Capacitor's built-in server
npx cap serve --ssl

# Or with custom certificate
npx cap serve --ssl --ssl-cert ./cert.pem --ssl-key ./key.pem
```

### Local Testing

```html
<!-- Add to index.html for local testing -->
<script>
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    // Enable debug mode
    window.FIREBASE_DEBUG = true;
  }
</script>
```

### Browser Developer Tools

```typescript
// Enable verbose logging
await FirebaseKit.analytics.logEvent({
  name: 'debug_mode',
  params: { debug: true }
});

// Check Firebase initialization
console.log('Firebase apps:', firebase.apps);
console.log('Firebase config:', firebase.app().options);
```

## Troubleshooting

### Common Issues

#### Firebase Not Defined
```
Error: firebase is not defined
```
**Solution:** Ensure Firebase SDK is loaded before your app code.

#### HTTPS Required
```
Error: Firebase requires HTTPS
```
**Solution:** Use HTTPS in development and production.

#### CORS Issues
```
Error: CORS policy blocked the request
```
**Solution:** Configure Firebase domains in your project settings.

#### reCAPTCHA Issues
```
Error: reCAPTCHA verification failed
```
**Solution:** Verify reCAPTCHA site key and domain configuration.

#### Content Security Policy
```
Error: Refused to load script due to CSP
```
**Solution:** Update CSP headers to allow Firebase domains.

### Debug Tools

```typescript
// Enable Firebase debug mode
if (window.location.hostname === 'localhost') {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = 'YOUR_DEBUG_TOKEN';
}

// Log Firebase events
firebase.analytics().logEvent('debug_info', {
  user_agent: navigator.userAgent,
  screen_resolution: `${screen.width}x${screen.height}`,
  color_depth: screen.colorDepth
});
```

## Best Practices

### 1. Performance Optimization

```typescript
// Lazy load Firebase services
const loadFirebaseService = async (service: string) => {
  switch (service) {
    case 'analytics':
      await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js');
      break;
    case 'performance':
      await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-performance-compat.js');
      break;
  }
};
```

### 2. Error Handling

```typescript
// Comprehensive error handling
try {
  await FirebaseKit.analytics.logEvent({ name: 'test_event' });
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // Handle network issues
    console.log('Network error, retrying...');
  } else if (error.code === 'PERMISSION_DENIED') {
    // Handle permission issues
    console.log('Permission denied');
  }
}
```

### 3. Browser Compatibility

```typescript
// Feature detection
const hasSupport = {
  localStorage: typeof Storage !== 'undefined',
  serviceWorker: 'serviceWorker' in navigator,
  webGL: !!document.createElement('canvas').getContext('webgl')
};

// Conditional initialization
if (hasSupport.localStorage) {
  await FirebaseKit.remoteConfig.initialize({
    minimumFetchIntervalInSeconds: 3600
  });
}
```

### 4. Progressive Web App

```typescript
// PWA integration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      });
  });
}
```

### 5. Single Page Application

```typescript
// SPA navigation tracking
import { Router } from 'your-router-library';

Router.afterEach(async (to) => {
  await FirebaseKit.analytics.logEvent({
    name: 'page_view',
    params: {
      page_title: to.meta.title,
      page_location: window.location.href,
      page_path: to.path
    }
  });
});
```

### 6. User Privacy

```typescript
// GDPR compliance
const userConsent = localStorage.getItem('firebase-consent');
if (userConsent === 'granted') {
  await FirebaseKit.analytics.setConsent({
    analyticsStorage: 'granted',
    adStorage: 'granted'
  });
}
```

## Additional Resources

- [Firebase Web Setup Guide](https://firebase.google.com/docs/web/setup)
- [Firebase JavaScript SDK Reference](https://firebase.google.com/docs/reference/js)
- [reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [Google AdSense Documentation](https://support.google.com/adsense)
- [Progressive Web Apps Guide](https://web.dev/progressive-web-apps/)

For more help, see the [main troubleshooting guide](../troubleshooting.md).