import type { PluginListenerHandle } from '@capacitor/core';

/**
 * Main plugin interface for Capacitor Firebase Kit
 * @since 1.0.0
 */
export interface FirebaseKitPlugin {
  // App Check Methods
  appCheck: AppCheckService;
  
  // AdMob Methods
  adMob: AdMobService;
  
  // Crashlytics Methods
  crashlytics: CrashlyticsService;
  
  // Performance Methods
  performance: PerformanceService;
  
  // Analytics Methods
  analytics: AnalyticsService;
  
  // Remote Config Methods
  remoteConfig: RemoteConfigService;
}

/**
 * Firebase App Check Service Interface
 * @since 1.0.0
 */
export interface AppCheckService {
  /**
   * Initialize App Check with the specified provider
   * @param options Configuration options for App Check
   * @returns Promise that resolves when initialization is complete
   * @since 1.0.0
   */
  initialize(options: AppCheckInitializeOptions): Promise<void>;

  /**
   * Get an App Check token
   * @param options Options for token generation
   * @returns Promise with the App Check token
   * @since 1.0.0
   */
  getToken(options?: AppCheckTokenOptions): Promise<AppCheckTokenResult>;

  /**
   * Set whether App Check token auto-refresh is enabled
   * @param options Auto-refresh configuration
   * @returns Promise that resolves when setting is updated
   * @since 1.0.0
   */
  setTokenAutoRefreshEnabled(options: { enabled: boolean }): Promise<void>;

  /**
   * Add a listener for App Check token changes
   * @param eventName The event to listen for
   * @param listenerFunc Callback function
   * @returns Promise with listener handle
   * @since 1.0.0
   */
  addListener(
    eventName: 'appCheckTokenChanged',
    listenerFunc: (token: AppCheckTokenResult) => void
  ): Promise<PluginListenerHandle>;
}

/**
 * App Check initialization options
 * @since 1.0.0
 */
export interface AppCheckInitializeOptions {
  /**
   * Provider type for App Check
   * - 'debug': Debug provider for testing
   * - 'deviceCheck': iOS DeviceCheck provider
   * - 'appAttest': iOS App Attest provider
   * - 'safetyNet': Android SafetyNet provider
   * - 'playIntegrity': Android Play Integrity provider
   * - 'recaptchaV3': Web reCAPTCHA v3 provider
   * - 'recaptchaEnterprise': Web reCAPTCHA Enterprise provider
   */
  provider: AppCheckProvider;
  
  /**
   * Site key for reCAPTCHA providers (Web only)
   */
  siteKey?: string;
  
  /**
   * Debug token for debug provider
   */
  debugToken?: string;
  
  /**
   * Whether to automatically refresh tokens
   */
  isTokenAutoRefreshEnabled?: boolean;
}

export type AppCheckProvider = 
  | 'debug'
  | 'deviceCheck'
  | 'appAttest'
  | 'safetyNet'
  | 'playIntegrity'
  | 'recaptchaV3'
  | 'recaptchaEnterprise';

/**
 * Options for getting an App Check token
 * @since 1.0.0
 */
export interface AppCheckTokenOptions {
  /**
   * Force refresh the token even if valid
   */
  forceRefresh?: boolean;
}

/**
 * App Check token result
 * @since 1.0.0
 */
export interface AppCheckTokenResult {
  /**
   * The App Check token
   */
  token: string;
  
  /**
   * Token expiration time in milliseconds
   */
  expireTimeMillis: number;
}

/**
 * Firebase AdMob Service Interface
 * @since 1.0.0
 */
export interface AdMobService {
  /**
   * Initialize AdMob with your app ID
   * @param options Initialization options
   * @returns Promise that resolves when initialization is complete
   * @since 1.0.0
   */
  initialize(options?: AdMobInitializeOptions): Promise<void>;

  /**
   * Request user consent for personalized ads
   * @param options Consent options
   * @returns Promise with consent result
   * @since 1.0.0
   */
  requestConsentInfo(options?: ConsentRequestOptions): Promise<ConsentInfo>;

  /**
   * Show the consent form
   * @returns Promise with consent status
   * @since 1.0.0
   */
  showConsentForm(): Promise<ConsentStatus>;

  /**
   * Reset consent information
   * @returns Promise that resolves when reset is complete
   * @since 1.0.0
   */
  resetConsentInfo(): Promise<void>;

  /**
   * Set request configuration
   * @param options Request configuration
   * @returns Promise that resolves when configuration is set
   * @since 1.0.0
   */
  setRequestConfiguration(options: RequestConfiguration): Promise<void>;

  /**
   * Show a banner ad
   * @param options Banner ad options
   * @returns Promise that resolves when banner is shown
   * @since 1.0.0
   */
  showBanner(options: BannerAdOptions): Promise<void>;

  /**
   * Hide the banner ad
   * @returns Promise that resolves when banner is hidden
   * @since 1.0.0
   */
  hideBanner(): Promise<void>;

  /**
   * Remove the banner ad
   * @returns Promise that resolves when banner is removed
   * @since 1.0.0
   */
  removeBanner(): Promise<void>;

  /**
   * Load an interstitial ad
   * @param options Interstitial ad options
   * @returns Promise that resolves when ad is loaded
   * @since 1.0.0
   */
  loadInterstitial(options: InterstitialAdOptions): Promise<void>;

  /**
   * Show a loaded interstitial ad
   * @returns Promise that resolves when ad is shown
   * @since 1.0.0
   */
  showInterstitial(): Promise<void>;

  /**
   * Load a rewarded ad
   * @param options Rewarded ad options
   * @returns Promise that resolves when ad is loaded
   * @since 1.0.0
   */
  loadRewarded(options: RewardedAdOptions): Promise<void>;

  /**
   * Show a loaded rewarded ad
   * @returns Promise that resolves when ad is shown
   * @since 1.0.0
   */
  showRewarded(): Promise<void>;

  /**
   * Load a rewarded interstitial ad
   * @param options Rewarded interstitial ad options
   * @returns Promise that resolves when ad is loaded
   * @since 1.0.0
   */
  loadRewardedInterstitial(options: RewardedInterstitialAdOptions): Promise<void>;

  /**
   * Show a loaded rewarded interstitial ad
   * @returns Promise that resolves when ad is shown
   * @since 1.0.0
   */
  showRewardedInterstitial(): Promise<void>;

  /**
   * Add listeners for ad events
   */
  addListener(
    eventName: AdMobEventType,
    listenerFunc: (info: any) => void
  ): Promise<PluginListenerHandle>;
}

/**
 * AdMob initialization options
 * @since 1.0.0
 */
export interface AdMobInitializeOptions {
  /**
   * An array of test device IDs
   */
  testingDevices?: string[];
  
  /**
   * Whether to initialize for mediation
   */
  initializeForTesting?: boolean;
  
  /**
   * Request track authorization on iOS
   */
  requestTrackingAuthorization?: boolean;
}

/**
 * Consent request options
 * @since 1.0.0
 */
export interface ConsentRequestOptions {
  /**
   * Tag for under age of consent
   */
  tagForUnderAgeOfConsent?: boolean;
  
  /**
   * Test device identifiers
   */
  testDeviceIdentifiers?: string[];
}

/**
 * Consent information
 * @since 1.0.0
 */
export interface ConsentInfo {
  /**
   * Consent status
   */
  status: ConsentStatus;
  
  /**
   * Whether consent form is available
   */
  isConsentFormAvailable: boolean;
}

export type ConsentStatus = 'unknown' | 'required' | 'notRequired' | 'obtained';

/**
 * Request configuration for ads
 * @since 1.0.0
 */
export interface RequestConfiguration {
  /**
   * Maximum ad content rating
   */
  maxAdContentRating?: MaxAdContentRating;
  
  /**
   * Tag for child-directed treatment
   */
  tagForChildDirectedTreatment?: boolean;
  
  /**
   * Tag for under age of consent
   */
  tagForUnderAgeOfConsent?: boolean;
  
  /**
   * Test device identifiers
   */
  testDeviceIdentifiers?: string[];
}

export type MaxAdContentRating = 'G' | 'PG' | 'T' | 'MA';

/**
 * Banner ad options
 * @since 1.0.0
 */
export interface BannerAdOptions {
  /**
   * Ad unit ID
   */
  adId: string;
  
  /**
   * Ad size
   */
  adSize: BannerAdSize;
  
  /**
   * Position on screen
   */
  position: BannerAdPosition;
  
  /**
   * Margin in pixels
   */
  margin?: number;
  
  /**
   * Whether to show ad on top of web view
   */
  isTesting?: boolean;
}

export type BannerAdSize = 
  | 'BANNER'
  | 'FULL_BANNER'
  | 'LARGE_BANNER'
  | 'MEDIUM_RECTANGLE'
  | 'LEADERBOARD'
  | 'ADAPTIVE_BANNER'
  | 'SMART_BANNER';

export type BannerAdPosition = 'TOP_CENTER' | 'CENTER' | 'BOTTOM_CENTER';

/**
 * Interstitial ad options
 * @since 1.0.0
 */
export interface InterstitialAdOptions {
  /**
   * Ad unit ID
   */
  adId: string;
  
  /**
   * Whether this is a test ad
   */
  isTesting?: boolean;
}

/**
 * Rewarded ad options
 * @since 1.0.0
 */
export interface RewardedAdOptions {
  /**
   * Ad unit ID
   */
  adId: string;
  
  /**
   * Whether this is a test ad
   */
  isTesting?: boolean;
}

/**
 * Rewarded interstitial ad options
 * @since 1.0.0
 */
export interface RewardedInterstitialAdOptions {
  /**
   * Ad unit ID
   */
  adId: string;
  
  /**
   * Whether this is a test ad
   */
  isTesting?: boolean;
}

export type AdMobEventType = 
  | 'bannerAdLoaded'
  | 'bannerAdFailedToLoad'
  | 'bannerAdOpened'
  | 'bannerAdClicked'
  | 'bannerAdClosed'
  | 'bannerAdImpression'
  | 'interstitialAdLoaded'
  | 'interstitialAdFailedToLoad'
  | 'interstitialAdOpened'
  | 'interstitialAdClosed'
  | 'interstitialAdFailedToShow'
  | 'interstitialAdImpression'
  | 'rewardedAdLoaded'
  | 'rewardedAdFailedToLoad'
  | 'rewardedAdOpened'
  | 'rewardedAdClosed'
  | 'rewardedAdFailedToShow'
  | 'rewardedAdImpression'
  | 'rewardedAdRewarded'
  | 'rewardedInterstitialAdLoaded'
  | 'rewardedInterstitialAdFailedToLoad'
  | 'rewardedInterstitialAdOpened'
  | 'rewardedInterstitialAdClosed'
  | 'rewardedInterstitialAdFailedToShow'
  | 'rewardedInterstitialAdImpression'
  | 'rewardedInterstitialAdRewarded';

/**
 * Firebase Crashlytics Service Interface
 * @since 1.0.0
 */
export interface CrashlyticsService {
  /**
   * Manually trigger a crash for testing
   * @returns Promise that resolves after crash
   * @since 1.0.0
   */
  crash(): Promise<void>;

  /**
   * Force a fatal crash (for testing)
   * @param options Crash options
   * @returns Promise that resolves after crash
   * @since 1.0.0
   */
  forceCrash(options: { message: string }): Promise<void>;

  /**
   * Log a message to Crashlytics
   * @param options Log options
   * @returns Promise that resolves when logged
   * @since 1.0.0
   */
  log(options: { message: string }): Promise<void>;

  /**
   * Log an exception to Crashlytics
   * @param options Exception details
   * @returns Promise that resolves when logged
   * @since 1.0.0
   */
  logException(options: CrashlyticsExceptionOptions): Promise<void>;

  /**
   * Set a user identifier
   * @param options User ID options
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setUserId(options: { userId: string }): Promise<void>;

  /**
   * Set custom attributes
   * @param options Attributes to set
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setCustomKeys(options: { attributes: Record<string, string | number | boolean> }): Promise<void>;

  /**
   * Enable or disable Crashlytics collection
   * @param options Enable/disable options
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setCrashlyticsCollectionEnabled(options: { enabled: boolean }): Promise<void>;

  /**
   * Check if Crashlytics collection is enabled
   * @returns Promise with enabled status
   * @since 1.0.0
   */
  isCrashlyticsCollectionEnabled(): Promise<{ enabled: boolean }>;

  /**
   * Delete unsent reports
   * @returns Promise that resolves when deleted
   * @since 1.0.0
   */
  deleteUnsentReports(): Promise<void>;

  /**
   * Send unsent reports
   * @returns Promise that resolves when sent
   * @since 1.0.0
   */
  sendUnsentReports(): Promise<void>;

  /**
   * Record a breadcrumb event
   * @param options Breadcrumb options
   * @returns Promise that resolves when recorded
   * @since 1.0.0
   */
  recordBreadcrumb(options: { name: string; params?: Record<string, any> }): Promise<void>;
}

/**
 * Crashlytics exception options
 * @since 1.0.0
 */
export interface CrashlyticsExceptionOptions {
  /**
   * Exception message
   */
  message: string;
  
  /**
   * Exception code
   */
  code?: string;
  
  /**
   * Exception domain (iOS)
   */
  domain?: string;
  
  /**
   * Stack trace frames
   */
  stackTrace?: StackFrame[];
}

/**
 * Stack frame information
 * @since 1.0.0
 */
export interface StackFrame {
  /**
   * File name
   */
  fileName?: string;
  
  /**
   * Line number
   */
  lineNumber?: number;
  
  /**
   * Method/function name
   */
  methodName?: string;
  
  /**
   * Class name
   */
  className?: string;
}

/**
 * Firebase Performance Service Interface
 * @since 1.0.0
 */
export interface PerformanceService {
  /**
   * Initialize Performance Monitoring
   * @param options Initialization options
   * @returns Promise that resolves when initialized
   * @since 1.0.0
   */
  initialize(options?: PerformanceInitializeOptions): Promise<void>;

  /**
   * Enable or disable performance monitoring
   * @param options Enable/disable options
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setPerformanceCollectionEnabled(options: { enabled: boolean }): Promise<void>;

  /**
   * Check if performance monitoring is enabled
   * @returns Promise with enabled status
   * @since 1.0.0
   */
  isPerformanceCollectionEnabled(): Promise<{ enabled: boolean }>;

  /**
   * Start a custom trace
   * @param options Trace options
   * @returns Promise with trace ID
   * @since 1.0.0
   */
  startTrace(options: { traceName: string }): Promise<{ traceId: string }>;

  /**
   * Stop a custom trace
   * @param options Trace options
   * @returns Promise that resolves when stopped
   * @since 1.0.0
   */
  stopTrace(options: { traceId: string }): Promise<void>;

  /**
   * Add a metric to a trace
   * @param options Metric options
   * @returns Promise that resolves when added
   * @since 1.0.0
   */
  incrementMetric(options: TraceMetricOptions): Promise<void>;

  /**
   * Set a metric value
   * @param options Metric options
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setMetric(options: TraceMetricOptions): Promise<void>;

  /**
   * Get a metric value
   * @param options Metric options
   * @returns Promise with metric value
   * @since 1.0.0
   */
  getMetric(options: { traceId: string; metricName: string }): Promise<{ value: number }>;

  /**
   * Add attributes to a trace
   * @param options Attribute options
   * @returns Promise that resolves when added
   * @since 1.0.0
   */
  putAttribute(options: TraceAttributeOptions): Promise<void>;

  /**
   * Get attributes from a trace
   * @param options Trace options
   * @returns Promise with attributes
   * @since 1.0.0
   */
  getAttributes(options: { traceId: string }): Promise<{ attributes: Record<string, string> }>;

  /**
   * Remove an attribute from a trace
   * @param options Attribute options
   * @returns Promise that resolves when removed
   * @since 1.0.0
   */
  removeAttribute(options: { traceId: string; attribute: string }): Promise<void>;

  /**
   * Start a screen trace
   * @param options Screen trace options
   * @returns Promise with trace ID
   * @since 1.0.0
   */
  startScreenTrace(options: { screenName: string }): Promise<{ traceId: string }>;

  /**
   * Stop a screen trace
   * @param options Screen trace options
   * @returns Promise that resolves when stopped
   * @since 1.0.0
   */
  stopScreenTrace(options: { traceId: string }): Promise<void>;

  /**
   * Record a network request
   * @param options Network request options
   * @returns Promise that resolves when recorded
   * @since 1.0.0
   */
  recordNetworkRequest(options: NetworkRequestOptions): Promise<void>;
}

/**
 * Performance initialization options
 * @since 1.0.0
 */
export interface PerformanceInitializeOptions {
  /**
   * Whether to enable performance monitoring on startup
   */
  enabled?: boolean;
  
  /**
   * Data collection preferences
   */
  dataCollectionEnabled?: boolean;
  
  /**
   * Instrumentation options
   */
  instrumentationEnabled?: boolean;
}

/**
 * Trace metric options
 * @since 1.0.0
 */
export interface TraceMetricOptions {
  /**
   * Trace ID
   */
  traceId: string;
  
  /**
   * Metric name
   */
  metricName: string;
  
  /**
   * Metric value
   */
  value: number;
}

/**
 * Trace attribute options
 * @since 1.0.0
 */
export interface TraceAttributeOptions {
  /**
   * Trace ID
   */
  traceId: string;
  
  /**
   * Attribute name
   */
  attribute: string;
  
  /**
   * Attribute value
   */
  value: string;
}

/**
 * Network request options for performance monitoring
 * @since 1.0.0
 */
export interface NetworkRequestOptions {
  /**
   * URL of the request
   */
  url: string;
  
  /**
   * HTTP method
   */
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH' | 'OPTIONS';
  
  /**
   * Request payload size in bytes
   */
  requestPayloadSize?: number;
  
  /**
   * Response content type
   */
  responseContentType?: string;
  
  /**
   * Response payload size in bytes
   */
  responsePayloadSize?: number;
  
  /**
   * HTTP response code
   */
  httpResponseCode?: number;
  
  /**
   * Start time in milliseconds
   */
  startTime?: number;
  
  /**
   * Duration in milliseconds
   */
  duration?: number;
}

/**
 * Firebase Analytics Service Interface
 * @since 1.0.0
 */
export interface AnalyticsService {
  /**
   * Initialize Analytics
   * @param options Initialization options
   * @returns Promise that resolves when initialized
   * @since 1.0.0
   */
  initialize(options?: AnalyticsInitializeOptions): Promise<void>;

  /**
   * Set whether analytics collection is enabled
   * @param options Enable/disable options
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setCollectionEnabled(options: { enabled: boolean }): Promise<void>;

  /**
   * Set the current screen name
   * @param options Screen name options
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setCurrentScreen(options: { screenName: string; screenClass?: string }): Promise<void>;

  /**
   * Log an event
   * @param options Event options
   * @returns Promise that resolves when logged
   * @since 1.0.0
   */
  logEvent(options: LogEventOptions): Promise<void>;

  /**
   * Set a user property
   * @param options User property options
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setUserProperty(options: { key: string; value: string }): Promise<void>;

  /**
   * Set the user ID
   * @param options User ID options
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setUserId(options: { userId: string | null }): Promise<void>;

  /**
   * Set the session timeout duration
   * @param options Timeout options
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setSessionTimeoutDuration(options: { duration: number }): Promise<void>;

  /**
   * Get the app instance ID
   * @returns Promise with app instance ID
   * @since 1.0.0
   */
  getAppInstanceId(): Promise<{ appInstanceId: string }>;

  /**
   * Reset analytics data
   * @returns Promise that resolves when reset
   * @since 1.0.0
   */
  resetAnalyticsData(): Promise<void>;

  /**
   * Set consent mode
   * @param options Consent options
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setConsent(options: ConsentSettings): Promise<void>;

  /**
   * Set default event parameters
   * @param options Default parameters
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setDefaultEventParameters(options: { params: Record<string, any> | null }): Promise<void>;
}

/**
 * Analytics initialization options
 * @since 1.0.0
 */
export interface AnalyticsInitializeOptions {
  /**
   * Whether to enable analytics collection on startup
   */
  collectionEnabled?: boolean;
  
  /**
   * Session timeout in seconds
   */
  sessionTimeoutDuration?: number;
}

/**
 * Log event options
 * @since 1.0.0
 */
export interface LogEventOptions {
  /**
   * Event name
   */
  name: string;
  
  /**
   * Event parameters
   */
  params?: Record<string, any>;
}

/**
 * Consent settings for analytics
 * @since 1.0.0
 */
export interface ConsentSettings {
  /**
   * Analytics storage consent
   */
  analyticsStorage?: ConsentType;
  
  /**
   * Ad storage consent
   */
  adStorage?: ConsentType;
  
  /**
   * Ad user data consent
   */
  adUserData?: ConsentType;
  
  /**
   * Ad personalization consent
   */
  adPersonalization?: ConsentType;
}

export type ConsentType = 'granted' | 'denied';

/**
 * Firebase Remote Config Service Interface
 * @since 1.0.0
 */
export interface RemoteConfigService {
  /**
   * Initialize Remote Config
   * @param options Initialization options
   * @returns Promise that resolves when initialized
   * @since 1.0.0
   */
  initialize(options?: RemoteConfigInitializeOptions): Promise<void>;

  /**
   * Set default config values
   * @param options Default values
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setDefaults(options: { defaults: Record<string, any> }): Promise<void>;

  /**
   * Fetch remote config
   * @param options Fetch options
   * @returns Promise that resolves when fetched
   * @since 1.0.0
   */
  fetch(options?: RemoteConfigFetchOptions): Promise<void>;

  /**
   * Activate fetched config
   * @returns Promise with activation result
   * @since 1.0.0
   */
  activate(): Promise<{ activated: boolean }>;

  /**
   * Fetch and activate config
   * @param options Fetch options
   * @returns Promise with activation result
   * @since 1.0.0
   */
  fetchAndActivate(options?: RemoteConfigFetchOptions): Promise<{ activated: boolean }>;

  /**
   * Get a config value
   * @param options Key options
   * @returns Promise with config value
   * @since 1.0.0
   */
  getValue(options: { key: string }): Promise<RemoteConfigValue>;

  /**
   * Get all config values
   * @returns Promise with all values
   * @since 1.0.0
   */
  getAll(): Promise<{ values: Record<string, RemoteConfigValue> }>;

  /**
   * Get config settings
   * @returns Promise with settings
   * @since 1.0.0
   */
  getSettings(): Promise<RemoteConfigSettings>;

  /**
   * Set config settings
   * @param options Settings options
   * @returns Promise that resolves when set
   * @since 1.0.0
   */
  setSettings(options: RemoteConfigSettings): Promise<void>;

  /**
   * Ensure config is initialized
   * @param options Initialization options
   * @returns Promise that resolves when ensured
   * @since 1.0.0
   */
  ensureInitialized(): Promise<void>;

  /**
   * Reset config
   * @returns Promise that resolves when reset
   * @since 1.0.0
   */
  reset(): Promise<void>;

  /**
   * Add listener for config updates
   * @param eventName Event name
   * @param listenerFunc Listener function
   * @returns Promise with listener handle
   * @since 1.0.0
   */
  addListener(
    eventName: 'remoteConfigUpdated',
    listenerFunc: (config: RemoteConfigUpdate) => void
  ): Promise<PluginListenerHandle>;
}

/**
 * Remote Config initialization options
 * @since 1.0.0
 */
export interface RemoteConfigInitializeOptions {
  /**
   * Minimum fetch interval in seconds
   */
  minimumFetchIntervalInSeconds?: number;
  
  /**
   * Fetch timeout in seconds
   */
  fetchTimeoutInSeconds?: number;
}

/**
 * Remote Config fetch options
 * @since 1.0.0
 */
export interface RemoteConfigFetchOptions {
  /**
   * Minimum fetch interval for this request
   */
  minimumFetchIntervalInSeconds?: number;
}

/**
 * Remote Config value
 * @since 1.0.0
 */
export interface RemoteConfigValue {
  /**
   * String value
   */
  asString: string;
  
  /**
   * Number value
   */
  asNumber: number;
  
  /**
   * Boolean value
   */
  asBoolean: boolean;
  
  /**
   * Source of the value
   */
  source: RemoteConfigSource;
}

export type RemoteConfigSource = 'static' | 'default' | 'remote';

/**
 * Remote Config settings
 * @since 1.0.0
 */
export interface RemoteConfigSettings {
  /**
   * Minimum fetch interval in seconds
   */
  minimumFetchIntervalInSeconds: number;
  
  /**
   * Fetch timeout in seconds
   */
  fetchTimeoutInSeconds: number;
}

/**
 * Remote Config update event
 * @since 1.0.0
 */
export interface RemoteConfigUpdate {
  /**
   * Updated keys
   */
  updatedKeys: string[];
}

/**
 * Common error codes across all services
 * @since 1.0.0
 */
export enum FirebaseKitErrorCode {
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

/**
 * Extended error information
 * @since 1.0.0
 */
export interface FirebaseKitError {
  /**
   * Error code
   */
  code: FirebaseKitErrorCode;
  
  /**
   * Error message
   */
  message: string;
  
  /**
   * Additional error details
   */
  details?: any;
}