# Capacitor Firebase Kit - API Documentation

This document provides detailed API documentation for all methods and options available in the Capacitor Firebase Kit plugin.

## Table of Contents

- [App Check](#app-check)
- [AdMob](#admob)
- [Crashlytics](#crashlytics)
- [Performance Monitoring](#performance-monitoring)
- [Analytics](#analytics)
- [Remote Config](#remote-config)
- [Error Handling](#error-handling)
- [Event Listeners](#event-listeners)

## App Check

Firebase App Check helps protect your backend resources from abuse by attesting that requests originate from legitimate apps.

### initialize(options: AppCheckInitializeOptions)

Initializes App Check with the specified provider.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `provider` | `string` | Yes | The attestation provider to use. See provider types below. |
| `siteKey` | `string` | No* | Required for web reCAPTCHA providers |
| `debugToken` | `string` | No | Debug token for testing (debug provider only) |
| `isTokenAutoRefreshEnabled` | `boolean` | No | Enable automatic token refresh (default: true) |

#### Provider Types

| Platform | Provider Options |
|----------|-----------------|
| iOS | `'deviceCheck'`, `'appAttest'`, `'debug'` |
| Android | `'playIntegrity'`, `'safetyNet'`, `'debug'` |
| Web | `'recaptchaV3'`, `'recaptchaEnterprise'`, `'debug'` |

#### Example

```typescript
// iOS
await FirebaseKit.appCheck.initialize({
  provider: 'deviceCheck',
  isTokenAutoRefreshEnabled: true
});

// Android
await FirebaseKit.appCheck.initialize({
  provider: 'playIntegrity'
});

// Web
await FirebaseKit.appCheck.initialize({
  provider: 'recaptchaV3',
  siteKey: 'your-recaptcha-site-key'
});
```

### getToken(options?: AppCheckTokenOptions)

Gets an App Check token.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `forceRefresh` | `boolean` | No | Force refresh even if token is valid (default: false) |

#### Returns

`Promise<AppCheckTokenResult>`

| Property | Type | Description |
|----------|------|-------------|
| `token` | `string` | The App Check token |
| `expireTimeMillis` | `number` | Token expiration time in milliseconds |

#### Example

```typescript
const { token, expireTimeMillis } = await FirebaseKit.appCheck.getToken({
  forceRefresh: false
});

// Use token in your API requests
const response = await fetch('https://api.example.com/data', {
  headers: {
    'X-Firebase-AppCheck': token
  }
});
```

### setTokenAutoRefreshEnabled(options)

Enables or disables automatic token refresh.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | `boolean` | Yes | Whether to enable auto-refresh |

#### Example

```typescript
await FirebaseKit.appCheck.setTokenAutoRefreshEnabled({ enabled: true });
```

### Event: appCheckTokenChanged

Fired when the App Check token changes.

#### Example

```typescript
const listener = await FirebaseKit.appCheck.addListener('appCheckTokenChanged', (token) => {
  console.log('New token:', token.token);
  console.log('Expires at:', new Date(token.expireTimeMillis));
});

// Remove listener when done
await listener.remove();
```

## AdMob

Google AdMob integration for monetizing your app with ads.

### initialize(options?: AdMobInitializeOptions)

Initializes the AdMob SDK.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `testingDevices` | `string[]` | No | Array of test device IDs |
| `initializeForTesting` | `boolean` | No | Initialize in test mode |
| `requestTrackingAuthorization` | `boolean` | No | Request iOS tracking authorization |

#### Example

```typescript
await FirebaseKit.adMob.initialize({
  requestTrackingAuthorization: true,
  testingDevices: ['YOUR_TEST_DEVICE_ID']
});
```

### requestConsentInfo(options?: ConsentRequestOptions)

Requests user consent information for personalized ads.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tagForUnderAgeOfConsent` | `boolean` | No | Tag for users under age of consent |
| `testDeviceIdentifiers` | `string[]` | No | Test device identifiers for consent testing |

#### Returns

`Promise<ConsentInfo>`

| Property | Type | Description |
|----------|------|-------------|
| `status` | `ConsentStatus` | Current consent status |
| `isConsentFormAvailable` | `boolean` | Whether a consent form is available |

#### ConsentStatus Values

- `'unknown'` - Consent status unknown
- `'required'` - Consent required but not yet obtained
- `'notRequired'` - Consent not required
- `'obtained'` - Consent obtained

#### Example

```typescript
const consentInfo = await FirebaseKit.adMob.requestConsentInfo({
  tagForUnderAgeOfConsent: false
});

if (consentInfo.isConsentFormAvailable && consentInfo.status === 'required') {
  // Show consent form
}
```

### showConsentForm()

Shows the consent form for user consent.

#### Returns

`Promise<ConsentStatus>` - The consent status after form interaction

#### Example

```typescript
const status = await FirebaseKit.adMob.showConsentForm();
console.log('Consent status:', status);
```

### setRequestConfiguration(options: RequestConfiguration)

Sets the global request configuration for ads.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `maxAdContentRating` | `MaxAdContentRating` | No | Maximum content rating |
| `tagForChildDirectedTreatment` | `boolean` | No | COPPA compliance flag |
| `tagForUnderAgeOfConsent` | `boolean` | No | Users under age of consent |
| `testDeviceIdentifiers` | `string[]` | No | Test device IDs |

#### MaxAdContentRating Values

- `'G'` - General audiences
- `'PG'` - Parental guidance suggested
- `'T'` - Teen
- `'MA'` - Mature audiences

#### Example

```typescript
await FirebaseKit.adMob.setRequestConfiguration({
  maxAdContentRating: 'PG',
  tagForChildDirectedTreatment: false,
  testDeviceIdentifiers: ['YOUR_DEVICE_ID']
});
```

### Banner Ads

#### showBanner(options: BannerAdOptions)

Shows a banner ad.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `adId` | `string` | Yes | Ad unit ID |
| `adSize` | `BannerAdSize` | No | Banner size (default: 'BANNER') |
| `position` | `BannerAdPosition` | No | Position (default: 'BOTTOM_CENTER') |
| `margin` | `number` | No | Margin in pixels (default: 0) |
| `isTesting` | `boolean` | No | Use test ad |

##### BannerAdSize Options

- `'BANNER'` - 320x50
- `'FULL_BANNER'` - 468x60
- `'LARGE_BANNER'` - 320x100
- `'MEDIUM_RECTANGLE'` - 300x250
- `'LEADERBOARD'` - 728x90
- `'ADAPTIVE_BANNER'` - Adaptive width
- `'SMART_BANNER'` - Deprecated, use ADAPTIVE_BANNER

##### BannerAdPosition Options

- `'TOP_CENTER'`
- `'CENTER'`
- `'BOTTOM_CENTER'`

##### Example

```typescript
await FirebaseKit.adMob.showBanner({
  adId: 'ca-app-pub-3940256099942544/6300978111',
  adSize: 'ADAPTIVE_BANNER',
  position: 'BOTTOM_CENTER',
  margin: 10
});
```

#### hideBanner()

Hides the banner ad without removing it.

```typescript
await FirebaseKit.adMob.hideBanner();
```

#### removeBanner()

Removes the banner ad completely.

```typescript
await FirebaseKit.adMob.removeBanner();
```

### Interstitial Ads

#### loadInterstitial(options: InterstitialAdOptions)

Loads an interstitial ad.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `adId` | `string` | Yes | Ad unit ID |
| `isTesting` | `boolean` | No | Use test ad |

##### Example

```typescript
await FirebaseKit.adMob.loadInterstitial({
  adId: 'ca-app-pub-3940256099942544/1033173712'
});
```

#### showInterstitial()

Shows a loaded interstitial ad.

```typescript
await FirebaseKit.adMob.showInterstitial();
```

### Rewarded Ads

#### loadRewarded(options: RewardedAdOptions)

Loads a rewarded ad.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `adId` | `string` | Yes | Ad unit ID |
| `isTesting` | `boolean` | No | Use test ad |

##### Example

```typescript
await FirebaseKit.adMob.loadRewarded({
  adId: 'ca-app-pub-3940256099942544/5224354917'
});
```

#### showRewarded()

Shows a loaded rewarded ad.

```typescript
await FirebaseKit.adMob.showRewarded();
```

### AdMob Events

```typescript
// Banner events
await FirebaseKit.adMob.addListener('bannerAdLoaded', () => {
  console.log('Banner loaded');
});

await FirebaseKit.adMob.addListener('bannerAdFailedToLoad', (error) => {
  console.error('Banner failed to load:', error);
});

// Interstitial events
await FirebaseKit.adMob.addListener('interstitialAdLoaded', () => {
  console.log('Interstitial loaded');
});

await FirebaseKit.adMob.addListener('interstitialAdClosed', () => {
  console.log('Interstitial closed');
});

// Rewarded events
await FirebaseKit.adMob.addListener('rewardedAdRewarded', (reward) => {
  console.log(`User earned ${reward.amount} ${reward.type}`);
});
```

#### Available Events

**Banner Events:**
- `bannerAdLoaded`
- `bannerAdFailedToLoad`
- `bannerAdOpened`
- `bannerAdClicked`
- `bannerAdClosed`
- `bannerAdImpression`

**Interstitial Events:**
- `interstitialAdLoaded`
- `interstitialAdFailedToLoad`
- `interstitialAdOpened`
- `interstitialAdClosed`
- `interstitialAdFailedToShow`
- `interstitialAdImpression`

**Rewarded Events:**
- `rewardedAdLoaded`
- `rewardedAdFailedToLoad`
- `rewardedAdOpened`
- `rewardedAdClosed`
- `rewardedAdFailedToShow`
- `rewardedAdImpression`
- `rewardedAdRewarded`

## Crashlytics

Firebase Crashlytics helps you track, prioritize, and fix stability issues.

### crash()

Triggers a test crash. Use only for testing crash reporting.

```typescript
// WARNING: This will crash your app!
await FirebaseKit.crashlytics.crash();
```

### forceCrash(options)

Forces a crash with a custom message.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | `string` | Yes | Crash message |

```typescript
await FirebaseKit.crashlytics.forceCrash({ 
  message: 'Testing crash reporting' 
});
```

### log(options)

Logs a custom message to Crashlytics.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | `string` | Yes | Log message |

```typescript
await FirebaseKit.crashlytics.log({ 
  message: 'User reached checkout page' 
});
```

### logException(options: CrashlyticsExceptionOptions)

Logs a non-fatal exception.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | `string` | Yes | Exception message |
| `code` | `string` | No | Error code |
| `domain` | `string` | No | Error domain (iOS) |
| `stackTrace` | `StackFrame[]` | No | Stack trace |

#### StackFrame Properties

| Property | Type | Description |
|----------|------|-------------|
| `fileName` | `string` | File name |
| `lineNumber` | `number` | Line number |
| `methodName` | `string` | Method/function name |
| `className` | `string` | Class name |

```typescript
await FirebaseKit.crashlytics.logException({
  message: 'Network request failed',
  code: 'NETWORK_ERROR',
  stackTrace: [{
    fileName: 'api.service.ts',
    lineNumber: 42,
    methodName: 'fetchData',
    className: 'ApiService'
  }]
});
```

### setUserId(options)

Sets a user identifier for crash reports.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | `string` | Yes | User identifier |

```typescript
await FirebaseKit.crashlytics.setUserId({ userId: 'user123' });
```

### setCustomKeys(options)

Sets custom keys for crash reports.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `attributes` | `Record<string, string \| number \| boolean>` | Yes | Custom attributes |

```typescript
await FirebaseKit.crashlytics.setCustomKeys({
  attributes: {
    plan: 'premium',
    level: 42,
    beta_user: true
  }
});
```

### setCrashlyticsCollectionEnabled(options)

Enables or disables Crashlytics collection.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | `boolean` | Yes | Whether to enable collection |

```typescript
await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({ 
  enabled: true 
});
```

### recordBreadcrumb(options)

Records a breadcrumb event.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Breadcrumb name |
| `params` | `Record<string, any>` | No | Additional parameters |

```typescript
await FirebaseKit.crashlytics.recordBreadcrumb({
  name: 'user_action',
  params: {
    screen: 'checkout',
    action: 'add_payment_method'
  }
});
```

## Performance Monitoring

Firebase Performance Monitoring helps you understand app performance.

### initialize(options?: PerformanceInitializeOptions)

Initializes Performance Monitoring.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | `boolean` | No | Enable performance monitoring |
| `dataCollectionEnabled` | `boolean` | No | Enable data collection |
| `instrumentationEnabled` | `boolean` | No | Enable instrumentation |

```typescript
await FirebaseKit.performance.initialize({
  enabled: true,
  dataCollectionEnabled: true
});
```

### Custom Traces

#### startTrace(options)

Starts a custom trace.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `traceName` | `string` | Yes | Name of the trace |

##### Returns

`Promise<{ traceId: string }>`

```typescript
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'image_processing'
});
```

#### stopTrace(options)

Stops a custom trace.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `traceId` | `string` | Yes | Trace ID from startTrace |

```typescript
await FirebaseKit.performance.stopTrace({ traceId });
```

### Metrics

#### incrementMetric(options: TraceMetricOptions)

Increments a metric value.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `traceId` | `string` | Yes | Trace ID |
| `metricName` | `string` | Yes | Metric name |
| `value` | `number` | Yes | Value to increment by |

```typescript
await FirebaseKit.performance.incrementMetric({
  traceId,
  metricName: 'items_processed',
  value: 1
});
```

#### setMetric(options: TraceMetricOptions)

Sets a metric value.

```typescript
await FirebaseKit.performance.setMetric({
  traceId,
  metricName: 'cache_size',
  value: 1024
});
```

#### getMetric(options)

Gets a metric value.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `traceId` | `string` | Yes | Trace ID |
| `metricName` | `string` | Yes | Metric name |

##### Returns

`Promise<{ value: number }>`

```typescript
const { value } = await FirebaseKit.performance.getMetric({
  traceId,
  metricName: 'items_processed'
});
```

### Attributes

#### putAttribute(options: TraceAttributeOptions)

Adds an attribute to a trace.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `traceId` | `string` | Yes | Trace ID |
| `attribute` | `string` | Yes | Attribute name |
| `value` | `string` | Yes | Attribute value |

```typescript
await FirebaseKit.performance.putAttribute({
  traceId,
  attribute: 'user_type',
  value: 'premium'
});
```

### Screen Traces

#### startScreenTrace(options)

Starts a screen rendering trace.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `screenName` | `string` | Yes | Name of the screen |

```typescript
const { traceId } = await FirebaseKit.performance.startScreenTrace({
  screenName: 'ProductList'
});
```

### Network Monitoring

#### recordNetworkRequest(options: NetworkRequestOptions)

Records a network request for monitoring.

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | `string` | Yes | Request URL |
| `httpMethod` | `string` | Yes | HTTP method |
| `requestPayloadSize` | `number` | No | Request size in bytes |
| `responseContentType` | `string` | No | Response content type |
| `responsePayloadSize` | `number` | No | Response size in bytes |
| `httpResponseCode` | `number` | No | HTTP response code |
| `startTime` | `number` | No | Start time in milliseconds |
| `duration` | `number` | No | Duration in milliseconds |

```typescript
const startTime = Date.now();
const response = await fetch('https://api.example.com/data');
const duration = Date.now() - startTime;

await FirebaseKit.performance.recordNetworkRequest({
  url: 'https://api.example.com/data',
  httpMethod: 'GET',
  httpResponseCode: response.status,
  responseContentType: response.headers.get('content-type'),
  startTime,
  duration
});
```

## Analytics

Firebase Analytics helps you understand user behavior.

### initialize(options?: AnalyticsInitializeOptions)

Initializes Analytics.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `collectionEnabled` | `boolean` | No | Enable analytics collection |
| `sessionTimeoutDuration` | `number` | No | Session timeout in seconds |

```typescript
await FirebaseKit.analytics.initialize({
  collectionEnabled: true,
  sessionTimeoutDuration: 1800 // 30 minutes
});
```

### logEvent(options: LogEventOptions)

Logs an analytics event.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Event name |
| `params` | `Record<string, any>` | No | Event parameters |

#### Predefined Events

Firebase provides many predefined events. Some common ones:

- `add_payment_info`
- `add_to_cart`
- `add_to_wishlist`
- `app_open`
- `begin_checkout`
- `generate_lead`
- `login`
- `purchase`
- `refund`
- `remove_from_cart`
- `search`
- `select_content`
- `share`
- `sign_up`
- `spend_virtual_currency`
- `tutorial_begin`
- `tutorial_complete`
- `unlock_achievement`
- `view_item`
- `view_item_list`

```typescript
// Custom event
await FirebaseKit.analytics.logEvent({
  name: 'tutorial_step_completed',
  params: {
    step_number: 3,
    step_name: 'profile_setup'
  }
});

// Predefined event
await FirebaseKit.analytics.logEvent({
  name: 'purchase',
  params: {
    transaction_id: '12345',
    value: 29.99,
    currency: 'USD',
    items: [
      {
        item_id: 'SKU123',
        item_name: 'Premium Subscription',
        price: 29.99
      }
    ]
  }
});
```

### setCurrentScreen(options)

Sets the current screen name.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `screenName` | `string` | Yes | Screen name |
| `screenClass` | `string` | No | Screen class/type |

```typescript
await FirebaseKit.analytics.setCurrentScreen({
  screenName: 'ProductDetails',
  screenClass: 'ProductViewController'
});
```

### setUserProperty(options)

Sets a user property.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | `string` | Yes | Property name |
| `value` | `string` | Yes | Property value |

```typescript
await FirebaseKit.analytics.setUserProperty({
  key: 'subscription_type',
  value: 'premium'
});
```

### setUserId(options)

Sets the user ID.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | `string \| null` | Yes | User ID or null to clear |

```typescript
await FirebaseKit.analytics.setUserId({ userId: 'user123' });

// Clear user ID
await FirebaseKit.analytics.setUserId({ userId: null });
```

### setConsent(options: ConsentSettings)

Sets consent mode for analytics.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `analyticsStorage` | `ConsentType` | No | Analytics storage consent |
| `adStorage` | `ConsentType` | No | Ad storage consent |
| `adUserData` | `ConsentType` | No | Ad user data consent |
| `adPersonalization` | `ConsentType` | No | Ad personalization consent |

#### ConsentType Values

- `'granted'`
- `'denied'`

```typescript
await FirebaseKit.analytics.setConsent({
  analyticsStorage: 'granted',
  adStorage: 'granted',
  adUserData: 'granted',
  adPersonalization: 'denied'
});
```

### setDefaultEventParameters(options)

Sets default parameters for all events.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `params` | `Record<string, any> \| null` | Yes | Default parameters or null to clear |

```typescript
await FirebaseKit.analytics.setDefaultEventParameters({
  params: {
    app_version: '1.2.3',
    environment: 'production'
  }
});
```

### getAppInstanceId()

Gets the app instance ID.

#### Returns

`Promise<{ appInstanceId: string }>`

```typescript
const { appInstanceId } = await FirebaseKit.analytics.getAppInstanceId();
```

## Remote Config

Firebase Remote Config allows you to dynamically change app behavior.

### initialize(options?: RemoteConfigInitializeOptions)

Initializes Remote Config.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `minimumFetchIntervalInSeconds` | `number` | No | Minimum fetch interval |
| `fetchTimeoutInSeconds` | `number` | No | Fetch timeout |

```typescript
await FirebaseKit.remoteConfig.initialize({
  minimumFetchIntervalInSeconds: 3600, // 1 hour
  fetchTimeoutInSeconds: 60
});
```

### setDefaults(options)

Sets default config values.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `defaults` | `Record<string, any>` | Yes | Default values |

```typescript
await FirebaseKit.remoteConfig.setDefaults({
  defaults: {
    welcome_message: 'Welcome to our app!',
    theme_color: '#0066CC',
    feature_flag_new_ui: false,
    max_upload_size: 10485760, // 10MB
    promotional_banner: {
      enabled: true,
      image_url: 'https://example.com/banner.jpg',
      link: 'https://example.com/promo'
    }
  }
});
```

### fetch(options?: RemoteConfigFetchOptions)

Fetches config from the Remote Config backend.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `minimumFetchIntervalInSeconds` | `number` | No | Override minimum fetch interval |

```typescript
// Regular fetch
await FirebaseKit.remoteConfig.fetch();

// Force fetch (bypass cache)
await FirebaseKit.remoteConfig.fetch({
  minimumFetchIntervalInSeconds: 0
});
```

### activate()

Activates fetched config.

#### Returns

`Promise<{ activated: boolean }>` - Whether new config was activated

```typescript
const { activated } = await FirebaseKit.remoteConfig.activate();
if (activated) {
  console.log('New config activated');
}
```

### fetchAndActivate(options?)

Fetches and activates config in one call.

```typescript
const { activated } = await FirebaseKit.remoteConfig.fetchAndActivate();
```

### getValue(options)

Gets a config value.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | `string` | Yes | Config key |

#### Returns

`Promise<RemoteConfigValue>`

| Property | Type | Description |
|----------|------|-------------|
| `asString` | `string` | String representation |
| `asNumber` | `number` | Number representation |
| `asBoolean` | `boolean` | Boolean representation |
| `source` | `RemoteConfigSource` | Value source |

#### RemoteConfigSource Values

- `'static'` - Hardcoded default value
- `'default'` - Default value from setDefaults
- `'remote'` - Value from Remote Config backend

```typescript
const welcomeMessage = await FirebaseKit.remoteConfig.getValue({
  key: 'welcome_message'
});

console.log('Message:', welcomeMessage.asString);
console.log('Source:', welcomeMessage.source);

// Type-specific access
const maxSize = await FirebaseKit.remoteConfig.getValue({
  key: 'max_upload_size'
});
const sizeInBytes = maxSize.asNumber;

const featureEnabled = await FirebaseKit.remoteConfig.getValue({
  key: 'feature_flag_new_ui'
});
if (featureEnabled.asBoolean) {
  // Show new UI
}
```

### getAll()

Gets all config values.

#### Returns

`Promise<{ values: Record<string, RemoteConfigValue> }>`

```typescript
const { values } = await FirebaseKit.remoteConfig.getAll();

Object.entries(values).forEach(([key, value]) => {
  console.log(`${key}: ${value.asString} (source: ${value.source})`);
});
```

### Event: remoteConfigUpdated

Fired when config is updated in real-time.

```typescript
const listener = await FirebaseKit.remoteConfig.addListener(
  'remoteConfigUpdated',
  async (update) => {
    console.log('Config updated. Keys:', update.updatedKeys);
    
    // Fetch and activate new config
    const { activated } = await FirebaseKit.remoteConfig.fetchAndActivate();
    if (activated) {
      // Apply new config values
      update.updatedKeys.forEach(async (key) => {
        const value = await FirebaseKit.remoteConfig.getValue({ key });
        console.log(`${key} = ${value.asString}`);
      });
    }
  }
);
```

## Error Handling

All methods return promises that may reject with errors containing:

| Property | Type | Description |
|----------|------|-------------|
| `code` | `FirebaseKitErrorCode` | Error code |
| `message` | `string` | Error message |
| `details` | `any` | Additional error details |

### Error Codes

```typescript
enum FirebaseKitErrorCode {
  // General errors
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNAVAILABLE = 'UNAVAILABLE',
  INTERNAL = 'INTERNAL',
  
  // App Check errors
  APP_CHECK_TOKEN_EXPIRED = 'APP_CHECK_TOKEN_EXPIRED',
  APP_CHECK_PROVIDER_ERROR = 'APP_CHECK_PROVIDER_ERROR',
  
  // AdMob errors
  AD_LOAD_FAILED = 'AD_LOAD_FAILED',
  AD_SHOW_FAILED = 'AD_SHOW_FAILED',
  AD_NOT_READY = 'AD_NOT_READY',
  
  // Remote Config errors
  CONFIG_FETCH_FAILED = 'CONFIG_FETCH_FAILED',
  CONFIG_UPDATE_FAILED = 'CONFIG_UPDATE_FAILED',
  
  // Platform errors
  NOT_SUPPORTED_ON_PLATFORM = 'NOT_SUPPORTED_ON_PLATFORM',
  WEB_NOT_SUPPORTED = 'WEB_NOT_SUPPORTED',
}
```

### Error Handling Example

```typescript
try {
  await FirebaseKit.appCheck.getToken();
} catch (error) {
  if (error.code === FirebaseKitErrorCode.APP_CHECK_TOKEN_EXPIRED) {
    // Handle expired token
    await FirebaseKit.appCheck.getToken({ forceRefresh: true });
  } else if (error.code === FirebaseKitErrorCode.NOT_INITIALIZED) {
    // Initialize App Check first
    await FirebaseKit.appCheck.initialize({ provider: 'deviceCheck' });
  } else {
    // Handle other errors
    console.error('Error:', error.message);
  }
}
```

## Event Listeners

All services support event listeners following the Capacitor pattern:

```typescript
// Add listener
const listener = await FirebaseKit.SERVICE.addListener('eventName', (data) => {
  // Handle event
});

// Remove listener
await listener.remove();

// Remove all listeners for an event
await FirebaseKit.SERVICE.removeAllListeners('eventName');
```

### Best Practices

1. **Always remove listeners** when components unmount to prevent memory leaks
2. **Store listener references** for proper cleanup
3. **Use typed event names** from the TypeScript definitions
4. **Handle errors in listeners** to prevent uncaught exceptions

```typescript
// Component lifecycle example
class MyComponent {
  private listeners: PluginListenerHandle[] = [];
  
  async onMount() {
    // Add listeners
    this.listeners.push(
      await FirebaseKit.appCheck.addListener('appCheckTokenChanged', this.handleTokenChange),
      await FirebaseKit.remoteConfig.addListener('remoteConfigUpdated', this.handleConfigUpdate)
    );
  }
  
  async onUnmount() {
    // Remove all listeners
    await Promise.all(this.listeners.map(l => l.remove()));
    this.listeners = [];
  }
  
  private handleTokenChange = (token: AppCheckTokenResult) => {
    // Handle token change
  };
  
  private handleConfigUpdate = (update: RemoteConfigUpdate) => {
    // Handle config update
  };
}
```