# API Reference

Complete API documentation for Capacitor Firebase Kit with all available methods, parameters, and return types.

## Overview

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';
```

The `FirebaseKit` object provides access to all Firebase services through dedicated service interfaces:

- `FirebaseKit.appCheck` - App Check service
- `FirebaseKit.adMob` - AdMob advertising service
- `FirebaseKit.analytics` - Analytics service
- `FirebaseKit.crashlytics` - Crashlytics service
- `FirebaseKit.performance` - Performance monitoring service
- `FirebaseKit.remoteConfig` - Remote Config service

## App Check API

### `appCheck.initialize(options)`

Initialize App Check with the specified provider.

**Parameters:**
- `options: AppCheckInitializeOptions`
  - `provider: AppCheckProvider` - Provider type ('debug' | 'deviceCheck' | 'appAttest' | 'safetyNet' | 'playIntegrity' | 'recaptchaV3' | 'recaptchaEnterprise')
  - `siteKey?: string` - Site key for reCAPTCHA providers (Web only)
  - `debugToken?: string` - Debug token for debug provider
  - `isTokenAutoRefreshEnabled?: boolean` - Whether to automatically refresh tokens

**Returns:** `Promise<void>`

**Example:**
```typescript
await FirebaseKit.appCheck.initialize({
  provider: 'playIntegrity',
  isTokenAutoRefreshEnabled: true
});
```

### `appCheck.getToken(options?)`

Get an App Check token.

**Parameters:**
- `options?: AppCheckTokenOptions`
  - `forceRefresh?: boolean` - Force refresh the token

**Returns:** `Promise<AppCheckTokenResult>`
- `token: string` - The App Check token
  
**Example:**
```typescript
const { token } = await FirebaseKit.appCheck.getToken({ forceRefresh: true });
```

### `appCheck.setTokenAutoRefreshEnabled(options)`

Set whether App Check token auto-refresh is enabled.

**Parameters:**
- `options: { enabled: boolean }` - Enable or disable auto-refresh

**Returns:** `Promise<void>`

### `appCheck.addListener(eventName, listenerFunc)`

Add a listener for App Check token changes.

**Parameters:**
- `eventName: 'appCheckTokenChanged'` - Event to listen for
- `listenerFunc: (token: AppCheckTokenResult) => void` - Callback function

**Returns:** `Promise<PluginListenerHandle>`

## AdMob API

### `adMob.initialize(options?)`

Initialize AdMob SDK.

**Parameters:**
- `options?: AdMobInitializeOptions`
  - `requestTrackingAuthorization?: boolean` - Request tracking authorization on iOS
  - `testingDevices?: string[]` - Array of test device IDs

**Returns:** `Promise<void>`

### `adMob.requestConsentInfo(options?)`

Request user consent information.

**Parameters:**
- `options?: ConsentRequestOptions`
  - `tagForUnderAgeOfConsent?: boolean` - Tag for users under age of consent
  - `testDeviceIdentifiers?: string[]` - Test device identifiers
  - `debugGeography?: 'DISABLED' | 'EEA' | 'NOT_EEA'` - Debug geography setting

**Returns:** `Promise<ConsentInfo>`
- `status: ConsentStatus` - Current consent status
- `isConsentFormAvailable: boolean` - Whether consent form is available

### `adMob.showConsentForm()`

Show the consent form.

**Returns:** `Promise<ConsentInfo>`

### `adMob.resetConsentInfo()`

Reset consent information (testing only).

**Returns:** `Promise<void>`

### Banner Ad Methods

#### `adMob.showBanner(options)`

Show a banner ad.

**Parameters:**
- `options: BannerAdOptions`
  - `adId: string` - Ad unit ID
  - `adSize: BannerAdSize` - Size of the banner
  - `position: BannerAdPosition` - Position on screen

**Returns:** `Promise<void>`

#### `adMob.hideBanner()`

Hide the current banner ad.

**Returns:** `Promise<void>`

#### `adMob.removeBanner()`

Remove the banner ad from memory.

**Returns:** `Promise<void>`

#### `adMob.resumeBanner()`

Resume a paused banner ad.

**Returns:** `Promise<void>`

### Interstitial Ad Methods

#### `adMob.loadInterstitial(options)`

Load an interstitial ad.

**Parameters:**
- `options: AdLoadOptions`
  - `adId: string` - Ad unit ID

**Returns:** `Promise<void>`

#### `adMob.showInterstitial()`

Show the loaded interstitial ad.

**Returns:** `Promise<void>`

### Rewarded Ad Methods

#### `adMob.loadRewarded(options)`

Load a rewarded ad.

**Parameters:**
- `options: AdLoadOptions`
  - `adId: string` - Ad unit ID

**Returns:** `Promise<void>`

#### `adMob.showRewarded()`

Show the loaded rewarded ad.

**Returns:** `Promise<void>`

### Rewarded Interstitial Ad Methods

#### `adMob.loadRewardedInterstitial(options)`

Load a rewarded interstitial ad.

**Parameters:**
- `options: AdLoadOptions`
  - `adId: string` - Ad unit ID

**Returns:** `Promise<void>`

#### `adMob.showRewardedInterstitial()`

Show the loaded rewarded interstitial ad.

**Returns:** `Promise<void>`

### AdMob Event Listeners

```typescript
// Banner events
await FirebaseKit.adMob.addListener('bannerAdLoaded', () => {});
await FirebaseKit.adMob.addListener('bannerAdFailedToLoad', (error) => {});
await FirebaseKit.adMob.addListener('bannerAdOpened', () => {});
await FirebaseKit.adMob.addListener('bannerAdClosed', () => {});
await FirebaseKit.adMob.addListener('bannerAdClicked', () => {});
await FirebaseKit.adMob.addListener('bannerAdImpression', () => {});

// Interstitial events
await FirebaseKit.adMob.addListener('interstitialAdLoaded', () => {});
await FirebaseKit.adMob.addListener('interstitialAdFailedToLoad', (error) => {});
await FirebaseKit.adMob.addListener('interstitialAdShowed', () => {});
await FirebaseKit.adMob.addListener('interstitialAdFailedToShow', (error) => {});
await FirebaseKit.adMob.addListener('interstitialAdDismissed', () => {});
await FirebaseKit.adMob.addListener('interstitialAdClicked', () => {});
await FirebaseKit.adMob.addListener('interstitialAdImpression', () => {});

// Rewarded events
await FirebaseKit.adMob.addListener('rewardedAdLoaded', () => {});
await FirebaseKit.adMob.addListener('rewardedAdFailedToLoad', (error) => {});
await FirebaseKit.adMob.addListener('rewardedAdShowed', () => {});
await FirebaseKit.adMob.addListener('rewardedAdFailedToShow', (error) => {});
await FirebaseKit.adMob.addListener('rewardedAdDismissed', () => {});
await FirebaseKit.adMob.addListener('rewardedAdClicked', () => {});
await FirebaseKit.adMob.addListener('rewardedAdImpression', () => {});
await FirebaseKit.adMob.addListener('rewardedAdRewarded', (reward) => {
  console.log(`User earned ${reward.amount} ${reward.type}`);
});
```

## Analytics API

### `analytics.initialize(options?)`

Initialize Analytics.

**Parameters:**
- `options?: AnalyticsInitializeOptions`
  - `collectionEnabled?: boolean` - Enable/disable analytics collection

**Returns:** `Promise<void>`

### `analytics.logEvent(options)`

Log an analytics event.

**Parameters:**
- `options: LogEventOptions`
  - `name: string` - Event name (max 40 characters)
  - `params?: { [key: string]: any }` - Event parameters

**Returns:** `Promise<void>`

**Example:**
```typescript
await FirebaseKit.analytics.logEvent({
  name: 'purchase',
  params: {
    value: 29.99,
    currency: 'USD',
    items: ['SKU123']
  }
});
```

### `analytics.setUserId(options)`

Set the user ID.

**Parameters:**
- `options: { userId: string | null }` - User ID or null to clear

**Returns:** `Promise<void>`

### `analytics.setUserProperty(options)`

Set a user property.

**Parameters:**
- `options: SetUserPropertyOptions`
  - `key: string` - Property name (max 24 characters)
  - `value: string | null` - Property value (max 36 characters)

**Returns:** `Promise<void>`

### `analytics.setCurrentScreen(options)`

Set the current screen name.

**Parameters:**
- `options: SetCurrentScreenOptions`
  - `screenName: string` - Screen name
  - `screenClass?: string` - Screen class name

**Returns:** `Promise<void>`

### `analytics.setSessionTimeoutDuration(options)`

Set session timeout duration.

**Parameters:**
- `options: { seconds: number }` - Timeout in seconds

**Returns:** `Promise<void>`

### `analytics.setCollectionEnabled(options)`

Enable/disable analytics collection.

**Parameters:**
- `options: { enabled: boolean }` - Enable or disable collection

**Returns:** `Promise<void>`

### `analytics.setConsent(options)`

Set consent status for analytics.

**Parameters:**
- `options: ConsentSettings` - Consent settings object with:
  - `analyticsStorage?: 'granted' | 'denied'`
  - `adStorage?: 'granted' | 'denied'`
  - `adUserData?: 'granted' | 'denied'`
  - `adPersonalization?: 'granted' | 'denied'`

**Returns:** `Promise<void>`

### `analytics.resetAnalyticsData()`

Delete all analytics data for this app.

**Returns:** `Promise<void>`

## Crashlytics API

### `crashlytics.crash()`

Force a crash for testing.

**Returns:** `Promise<void>`

### `crashlytics.log(options)`

Log a message to Crashlytics.

**Parameters:**
- `options: { message: string }` - Message to log

**Returns:** `Promise<void>`

### `crashlytics.setUserId(options)`

Set the user identifier.

**Parameters:**
- `options: { userId: string }` - User identifier

**Returns:** `Promise<void>`

### `crashlytics.setCustomKeys(options)`

Set custom key-value pairs.

**Parameters:**
- `options: { attributes: { [key: string]: string | number | boolean } }`

**Returns:** `Promise<void>`

**Example:**
```typescript
await FirebaseKit.crashlytics.setCustomKeys({
  attributes: {
    subscription_type: 'premium',
    user_level: 42,
    beta_tester: true
  }
});
```

### `crashlytics.logException(options)`

Log a non-fatal exception.

**Parameters:**
- `options: LogExceptionOptions`
  - `message: string` - Exception message
  - `code?: string | number` - Exception code
  - `domain?: string` - Exception domain
  - `stackTrace?: StackTraceElement[]` - Stack trace

**Returns:** `Promise<void>`

### `crashlytics.setCrashlyticsCollectionEnabled(options)`

Enable/disable Crashlytics collection.

**Parameters:**
- `options: { enabled: boolean }` - Enable or disable

**Returns:** `Promise<void>`

### `crashlytics.didCrashOnPreviousExecution()`

Check if app crashed on previous execution.

**Returns:** `Promise<{ crashed: boolean }>`

### `crashlytics.sendUnsentReports()`

Send any unsent crash reports.

**Returns:** `Promise<void>`

### `crashlytics.deleteUnsentReports()`

Delete any unsent crash reports.

**Returns:** `Promise<void>`

## Performance API

### `performance.initialize(options?)`

Initialize Performance Monitoring.

**Parameters:**
- `options?: { enabled?: boolean }` - Enable/disable performance monitoring

**Returns:** `Promise<void>`

### `performance.setPerformanceCollectionEnabled(options)`

Enable/disable performance monitoring.

**Parameters:**
- `options: { enabled: boolean }` - Enable or disable

**Returns:** `Promise<void>`

### `performance.startTrace(options)`

Start a custom trace.

**Parameters:**
- `options: { traceName: string }` - Name of the trace

**Returns:** `Promise<{ traceId: string }>`

### `performance.stopTrace(options)`

Stop a custom trace.

**Parameters:**
- `options: { traceId: string }` - ID of the trace to stop

**Returns:** `Promise<void>`

### `performance.incrementMetric(options)`

Increment a metric on a trace.

**Parameters:**
- `options: IncrementMetricOptions`
  - `traceId: string` - Trace ID
  - `metricName: string` - Metric name
  - `value?: number` - Value to increment by (default: 1)

**Returns:** `Promise<void>`

### `performance.putAttribute(options)`

Add an attribute to a trace.

**Parameters:**
- `options: PutAttributeOptions`
  - `traceId: string` - Trace ID
  - `attribute: string` - Attribute name
  - `value: string` - Attribute value

**Returns:** `Promise<void>`

### `performance.startScreenTrace(options)`

Start a screen rendering trace.

**Parameters:**
- `options: { screenName: string }` - Screen name

**Returns:** `Promise<{ traceId: string }>`

### `performance.stopScreenTrace(options)`

Stop a screen rendering trace.

**Parameters:**
- `options: { traceId: string }` - Trace ID

**Returns:** `Promise<void>`

### `performance.recordNetworkRequest(options)`

Record a network request.

**Parameters:**
- `options: NetworkRequestMetric`
  - `url: string` - Request URL
  - `httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH' | 'OPTIONS' | 'TRACE' | 'CONNECT'`
  - `requestPayloadSize?: number` - Request payload size in bytes
  - `responsePayloadSize?: number` - Response payload size in bytes
  - `httpResponseCode?: number` - HTTP response code
  - `responseContentType?: string` - Response content type
  - `startTime?: number` - Start time in milliseconds
  - `endTime?: number` - End time in milliseconds

**Returns:** `Promise<void>`

## Remote Config API

### `remoteConfig.initialize(options?)`

Initialize Remote Config.

**Parameters:**
- `options?: RemoteConfigInitializeOptions`
  - `minimumFetchIntervalInSeconds?: number` - Minimum fetch interval

**Returns:** `Promise<void>`

### `remoteConfig.setDefaults(options)`

Set default values.

**Parameters:**
- `options: { defaults: { [key: string]: any } }` - Default values

**Returns:** `Promise<void>`

### `remoteConfig.fetch()`

Fetch remote config from server.

**Returns:** `Promise<void>`

### `remoteConfig.activate()`

Activate fetched config.

**Returns:** `Promise<{ activated: boolean }>`

### `remoteConfig.fetchAndActivate()`

Fetch and activate in one call.

**Returns:** `Promise<{ activated: boolean }>`

### `remoteConfig.getValue(options)`

Get a config value.

**Parameters:**
- `options: { key: string }` - Config key

**Returns:** `Promise<RemoteConfigValue>`
- `asString: string` - Value as string
- `asNumber: number` - Value as number
- `asBoolean: boolean` - Value as boolean
- `source: 'default' | 'remote' | 'static'` - Value source

### `remoteConfig.getAll()`

Get all config values.

**Returns:** `Promise<{ values: { [key: string]: RemoteConfigValue } }>`

### `remoteConfig.setLogLevel(options)`

Set Remote Config log level.

**Parameters:**
- `options: { logLevel: 'debug' | 'info' | 'warning' | 'error' }` - Log level

**Returns:** `Promise<void>`

### `remoteConfig.addListener(eventName, listenerFunc)`

Add a listener for config updates.

**Parameters:**
- `eventName: 'remoteConfigUpdated'` - Event name
- `listenerFunc: (update: RemoteConfigUpdate) => void` - Callback

**Returns:** `Promise<PluginListenerHandle>`

## Error Handling

All methods can throw errors with the following error codes:

```typescript
enum FirebaseKitErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INITIALIZATION_ERROR = 'INITIALIZATION_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  INVALID_PARAMETER = 'INVALID_PARAMETER',
  NOT_SUPPORTED = 'NOT_SUPPORTED',
  // Service-specific errors
  APP_CHECK_TOKEN_EXPIRED = 'APP_CHECK_TOKEN_EXPIRED',
  APP_CHECK_PROVIDER_ERROR = 'APP_CHECK_PROVIDER_ERROR',
  AD_ALREADY_LOADED = 'AD_ALREADY_LOADED',
  AD_NOT_LOADED = 'AD_NOT_LOADED',
  AD_FAILED_TO_LOAD = 'AD_FAILED_TO_LOAD',
  AD_FAILED_TO_SHOW = 'AD_FAILED_TO_SHOW',
  TRACE_NOT_FOUND = 'TRACE_NOT_FOUND',
  TRACE_ALREADY_EXISTS = 'TRACE_ALREADY_EXISTS',
  METRIC_NOT_FOUND = 'METRIC_NOT_FOUND',
  REMOTE_CONFIG_FETCH_FAILED = 'REMOTE_CONFIG_FETCH_FAILED',
  REMOTE_CONFIG_NOT_INITIALIZED = 'REMOTE_CONFIG_NOT_INITIALIZED'
}
```

**Example error handling:**
```typescript
try {
  await FirebaseKit.appCheck.getToken();
} catch (error) {
  if (error.code === 'APP_CHECK_TOKEN_EXPIRED') {
    // Handle token expiration
  } else {
    // Handle other errors
  }
}
```

## Type Definitions

For complete type definitions, see the [TypeScript definitions file](https://github.com/aoneahsan/capacitor-firebase-kit/blob/main/src/definitions.ts).

---

For more detailed guides on each service, see the [service documentation](./services/).