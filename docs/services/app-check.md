# App Check Service

Firebase App Check helps protect your backend resources from abuse, such as billing fraud or phishing. It works by attesting that requests originate from your authentic app and blocks traffic without valid credentials.

## Overview

App Check uses platform-specific attestation providers to verify app authenticity:
- **iOS**: DeviceCheck or App Attest
- **Android**: Play Integrity or SafetyNet
- **Web**: reCAPTCHA v3 or reCAPTCHA Enterprise

## Setup

### 1. Enable App Check in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **App Check** in the left menu
4. Register your apps and configure attestation providers

### 2. Initialize App Check

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// iOS - DeviceCheck
await FirebaseKit.appCheck.initialize({
  provider: 'deviceCheck',
  isTokenAutoRefreshEnabled: true  // Default: false
});

// Android - Play Integrity
await FirebaseKit.appCheck.initialize({
  provider: 'playIntegrity',
  isTokenAutoRefreshEnabled: true  // Default: false
});

// Web - reCAPTCHA v3
await FirebaseKit.appCheck.initialize({
  provider: 'recaptchaV3',
  siteKey: 'your-recaptcha-site-key',
  isTokenAutoRefreshEnabled: true  // Default: false
});
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `provider` | `AppCheckProvider` | Required | The attestation provider to use |
| `siteKey` | `string` | - | Required for reCAPTCHA providers (Web only) |
| `debugToken` | `string` | - | Debug token for testing (Debug provider only) |
| `isTokenAutoRefreshEnabled` | `boolean` | `false` | Whether to automatically refresh tokens |

## Provider Configuration

### iOS Providers

#### DeviceCheck (Recommended)
- Works on real devices only
- Requires iOS 11.0+
- No additional setup required

```typescript
await FirebaseKit.appCheck.initialize({
  provider: 'deviceCheck',
  isTokenAutoRefreshEnabled: true  // Default: false
});
```

#### App Attest
- Works on real devices only
- Requires iOS 14.0+
- More secure but has usage limits

```typescript
await FirebaseKit.appCheck.initialize({
  provider: 'appAttest',
  isTokenAutoRefreshEnabled: true  // Default: false
});
```

### Android Providers

#### Play Integrity (Recommended)
- Recommended for new apps
- Requires Google Play Services

```typescript
await FirebaseKit.appCheck.initialize({
  provider: 'playIntegrity',
  isTokenAutoRefreshEnabled: true  // Default: false
});
```

#### SafetyNet (Deprecated)
- Use only for existing implementations
- Being phased out by Google

```typescript
await FirebaseKit.appCheck.initialize({
  provider: 'safetyNet',
  isTokenAutoRefreshEnabled: true  // Default: false
});
```

### Web Providers

#### reCAPTCHA v3
- Invisible to users
- Free tier available

```typescript
await FirebaseKit.appCheck.initialize({
  provider: 'recaptchaV3',
  siteKey: 'your-recaptcha-v3-site-key',
  isTokenAutoRefreshEnabled: true  // Default: false
});
```

#### reCAPTCHA Enterprise
- Advanced features and analytics
- Better bot detection

```typescript
await FirebaseKit.appCheck.initialize({
  provider: 'recaptchaEnterprise',
  siteKey: 'your-recaptcha-enterprise-site-key',
  isTokenAutoRefreshEnabled: true  // Default: false
});
```

## Debug Provider

For testing in development environments:

```typescript
await FirebaseKit.appCheck.initialize({
  provider: 'debug',
  debugToken: 'your-debug-token', // Get from Firebase Console
  isTokenAutoRefreshEnabled: true  // Default: false
});
```

## Token Management

### Get Token

```typescript
// Get current token
const { token } = await FirebaseKit.appCheck.getToken();

// Force refresh token
const { token: newToken } = await FirebaseKit.appCheck.getToken({
  forceRefresh: true  // Default: false
});
```

#### Get Token Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `forceRefresh` | `boolean` | `false` | Force refresh the token even if valid |

### Auto-Refresh

```typescript
// Enable auto-refresh
await FirebaseKit.appCheck.setTokenAutoRefreshEnabled({ enabled: true });

// Listen for token changes
const listener = await FirebaseKit.appCheck.addListener(
  'appCheckTokenChanged',
  (tokenResult) => {
    console.log('New App Check token:', tokenResult.token);
  }
);

// Remove listener when done
await listener.remove();
```

## Backend Integration

### Verify Tokens in Cloud Functions

```javascript
// Cloud Function example
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.protectedAPI = functions.https.onCall(async (data, context) => {
  // App Check token is automatically verified by Cloud Functions
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }
  
  // Your protected logic here
  return { message: 'Success!' };
});
```

### Verify Tokens in Custom Backend

```javascript
// Node.js example
const admin = require('firebase-admin');

async function verifyAppCheckToken(appCheckToken) {
  try {
    const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);
    return appCheckClaims;
  } catch (err) {
    console.error('App Check verification failed:', err);
    throw err;
  }
}
```

## Enforcement Modes

### Monitor Mode
- Logs invalid requests but doesn't block them
- Good for initial rollout

### Enforce Mode
- Blocks requests without valid App Check tokens
- Use after monitoring period

## Best Practices

### 1. Gradual Rollout
- Start with monitor mode
- Analyze metrics in Firebase Console
- Switch to enforce mode gradually

### 2. Handle Token Errors
```typescript
try {
  const { token } = await FirebaseKit.appCheck.getToken();
  // Use token
} catch (error) {
  if (error.code === 'APP_CHECK_TOKEN_EXPIRED') {
    // Retry with force refresh
    const { token } = await FirebaseKit.appCheck.getToken({ forceRefresh: true });
  }
}
```

### 3. Debug Token Security
- Never commit debug tokens to source control
- Use environment variables for debug tokens
- Rotate debug tokens regularly

### 4. Platform-Specific Handling
```typescript
import { Capacitor } from '@capacitor/core';

async function initializeAppCheck() {
  const platform = Capacitor.getPlatform();
  
  if (platform === 'ios') {
    await FirebaseKit.appCheck.initialize({
      provider: 'deviceCheck',
      isTokenAutoRefreshEnabled: true  // Default: false
    });
  } else if (platform === 'android') {
    await FirebaseKit.appCheck.initialize({
      provider: 'playIntegrity',
      isTokenAutoRefreshEnabled: true  // Default: false
    });
  } else if (platform === 'web') {
    await FirebaseKit.appCheck.initialize({
      provider: 'recaptchaV3',
      siteKey: process.env.RECAPTCHA_SITE_KEY,
      isTokenAutoRefreshEnabled: true  // Default: false
    });
  }
}
```

## Troubleshooting

### Common Issues

#### "App Check token expired"
- Enable auto-refresh: `isTokenAutoRefreshEnabled: true`
- Force refresh when needed: `getToken({ forceRefresh: true })`

#### "Provider not available"
- Ensure you're testing on real devices (not simulators) for device attestation
- Check minimum OS versions for providers
- Verify provider is enabled in Firebase Console

#### "Invalid site key"
- Check reCAPTCHA site key matches Firebase Console
- Ensure domain is whitelisted in reCAPTCHA admin

### Testing Tips

1. **Use Debug Provider in Development**
   ```typescript
   if (__DEV__) {
     await FirebaseKit.appCheck.initialize({
       provider: 'debug',
       debugToken: process.env.APP_CHECK_DEBUG_TOKEN
     });
   }
   ```

2. **Test on Real Devices**
   - Device attestation providers don't work on simulators
   - Use debug provider for simulator testing

3. **Monitor Firebase Console**
   - Check App Check metrics
   - Review invalid request patterns
   - Adjust enforcement gradually

## Platform Limitations

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| DeviceCheck | ✅ | ❌ | ❌ |
| App Attest | ✅ | ❌ | ❌ |
| Play Integrity | ❌ | ✅ | ❌ |
| SafetyNet | ❌ | ✅ | ❌ |
| reCAPTCHA v3 | ❌ | ❌ | ✅ |
| reCAPTCHA Enterprise | ❌ | ❌ | ✅ |
| Debug Provider | ✅ | ✅ | ✅ |
| Auto Token Refresh | ✅ | ✅ | ✅ |

## Additional Resources

- [Firebase App Check Documentation](https://firebase.google.com/docs/app-check)
- [App Check Best Practices](https://firebase.google.com/docs/app-check/best-practices)
- [reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [Play Integrity API](https://developer.android.com/google/play/integrity)