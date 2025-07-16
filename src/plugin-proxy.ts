import type { 
  FirebaseKitPlugin,
  AppCheckService,
  AdMobService,
  CrashlyticsService,
  PerformanceService,
  AnalyticsService,
  RemoteConfigService,
  AppCheckInitializeOptions,
  AppCheckTokenOptions,
  AppCheckTokenResult,
  AdMobInitializeOptions,
  ConsentRequestOptions,
  ConsentInfo,
  ConsentStatus,
  RequestConfiguration,
  BannerAdOptions,
  InterstitialAdOptions,
  RewardedAdOptions,
  RewardedInterstitialAdOptions,
  AdMobEventType,
  CrashlyticsExceptionOptions,
  PerformanceInitializeOptions,
  TraceMetricOptions,
  TraceAttributeOptions,
  NetworkRequestOptions,
  AnalyticsInitializeOptions,
  LogEventOptions,
  ConsentSettings,
  RemoteConfigInitializeOptions,
  RemoteConfigFetchOptions,
  RemoteConfigValue,
  RemoteConfigSettings,
  RemoteConfigUpdate,
} from './definitions';
import type { PluginListenerHandle } from '@capacitor/core';

/**
 * Creates a proxy for the Firebase Kit plugin that provides the nested service structure.
 * This proxy organizes the flat plugin interface into logical service groups for better developer experience.
 * 
 * @param plugin The native plugin instance
 * @returns FirebaseKitPlugin with organized service structure
 * @since 1.0.0
 */
export function createFirebaseKitProxy(plugin: any): FirebaseKitPlugin {
  // Create App Check service proxy
  const appCheck: AppCheckService = {
    /**
     * Initialize Firebase App Check with the specified provider.
     * This must be called before using any other Firebase services.
     * 
     * @param options Configuration options for App Check initialization
     * @returns Promise that resolves when App Check is initialized
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.appCheck.initialize({
     *   provider: 'playIntegrity',
     *   isTokenAutoRefreshEnabled: true
     * });
     * ```
     */
    async initialize(options: AppCheckInitializeOptions): Promise<void> {
      return plugin.appCheckInitialize(options);
    },
    
    /**
     * Get an App Check token for API requests.
     * 
     * @param options Optional token generation options
     * @returns Promise with the App Check token result
     * @since 1.0.0
     * @example
     * ```typescript
     * const { token } = await FirebaseKit.appCheck.getToken();
     * ```
     */
    async getToken(options?: AppCheckTokenOptions): Promise<AppCheckTokenResult> {
      return plugin.appCheckGetToken(options);
    },
    
    /**
     * Enable or disable automatic token refresh.
     * 
     * @param options Configuration for auto-refresh
     * @returns Promise that resolves when setting is updated
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.appCheck.setTokenAutoRefreshEnabled({ enabled: true });
     * ```
     */
    async setTokenAutoRefreshEnabled(options: { enabled: boolean }): Promise<void> {
      return plugin.appCheckSetTokenAutoRefreshEnabled(options);
    },
    
    /**
     * Add a listener for App Check token changes.
     * 
     * @param eventName The event to listen for
     * @param listenerFunc Callback function to handle token updates
     * @returns Promise with listener handle for cleanup
     * @since 1.0.0
     * @example
     * ```typescript
     * const listener = await FirebaseKit.appCheck.addListener(
     *   'appCheckTokenChanged',
     *   (token) => console.log('Token updated:', token)
     * );
     * ```
     */
    async addListener(
      eventName: 'appCheckTokenChanged',
      listenerFunc: (token: AppCheckTokenResult) => void
    ): Promise<PluginListenerHandle> {
      return plugin.addListener(eventName, listenerFunc);
    }
  };

  // Create AdMob service proxy
  const adMob: AdMobService = {
    /**
     * Initialize Google AdMob with configuration options.
     * Should be called before showing any ads.
     * 
     * @param options Optional initialization configuration
     * @returns Promise that resolves when AdMob is initialized
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.initialize({
     *   requestTrackingAuthorization: true,
     *   testingDevices: ['device_id_hash']
     * });
     * ```
     */
    async initialize(options?: AdMobInitializeOptions): Promise<void> {
      return plugin.adMobInitialize(options);
    },
    
    /**
     * Request consent information from Google UMP SDK.
     * Required for GDPR compliance.
     * 
     * @param options Optional consent request configuration
     * @returns Promise with consent information
     * @since 1.0.0
     * @example
     * ```typescript
     * const consent = await FirebaseKit.adMob.requestConsentInfo({
     *   tagForUnderAgeOfConsent: false
     * });
     * ```
     */
    async requestConsentInfo(options?: ConsentRequestOptions): Promise<ConsentInfo> {
      return plugin.adMobRequestConsentInfo(options);
    },
    
    /**
     * Show the consent form to the user.
     * 
     * @returns Promise with consent status after form completion
     * @since 1.0.0
     * @example
     * ```typescript
     * const status = await FirebaseKit.adMob.showConsentForm();
     * ```
     */
    async showConsentForm(): Promise<ConsentStatus> {
      return plugin.adMobShowConsentForm();
    },
    
    /**
     * Reset consent information (for testing purposes).
     * 
     * @returns Promise that resolves when consent info is reset
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.resetConsentInfo();
     * ```
     */
    async resetConsentInfo(): Promise<void> {
      return plugin.adMobResetConsentInfo();
    },
    
    /**
     * Set global request configuration for all ad requests.
     * 
     * @param options Request configuration options
     * @returns Promise that resolves when configuration is set
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.setRequestConfiguration({
     *   testDeviceIds: ['test_device_id']
     * });
     * ```
     */
    async setRequestConfiguration(options: RequestConfiguration): Promise<void> {
      return plugin.adMobSetRequestConfiguration(options);
    },
    
    /**
     * Show a banner ad at the specified position.
     * 
     * @param options Banner ad configuration
     * @returns Promise that resolves when banner is shown
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.showBanner({
     *   adId: 'ca-app-pub-xxx/yyy',
     *   adSize: 'BANNER',
     *   position: 'BOTTOM_CENTER'
     * });
     * ```
     */
    async showBanner(options: BannerAdOptions): Promise<void> {
      return plugin.adMobShowBanner(options);
    },
    
    /**
     * Hide the currently displayed banner ad.
     * 
     * @returns Promise that resolves when banner is hidden
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.hideBanner();
     * ```
     */
    async hideBanner(): Promise<void> {
      return plugin.adMobHideBanner();
    },
    
    /**
     * Remove the banner ad from the view hierarchy.
     * 
     * @returns Promise that resolves when banner is removed
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.removeBanner();
     * ```
     */
    async removeBanner(): Promise<void> {
      return plugin.adMobRemoveBanner();
    },
    
    /**
     * Load an interstitial ad for later display.
     * 
     * @param options Interstitial ad configuration
     * @returns Promise that resolves when ad is loaded
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.loadInterstitial({
     *   adId: 'ca-app-pub-xxx/yyy'
     * });
     * ```
     */
    async loadInterstitial(options: InterstitialAdOptions): Promise<void> {
      return plugin.adMobLoadInterstitial(options);
    },
    
    /**
     * Show the previously loaded interstitial ad.
     * 
     * @returns Promise that resolves when ad is shown
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.showInterstitial();
     * ```
     */
    async showInterstitial(): Promise<void> {
      return plugin.adMobShowInterstitial();
    },
    
    /**
     * Load a rewarded ad for later display.
     * 
     * @param options Rewarded ad configuration
     * @returns Promise that resolves when ad is loaded
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.loadRewarded({
     *   adId: 'ca-app-pub-xxx/yyy'
     * });
     * ```
     */
    async loadRewarded(options: RewardedAdOptions): Promise<void> {
      return plugin.adMobLoadRewarded(options);
    },
    
    /**
     * Show the previously loaded rewarded ad.
     * 
     * @returns Promise that resolves when ad is shown
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.showRewarded();
     * ```
     */
    async showRewarded(): Promise<void> {
      return plugin.adMobShowRewarded();
    },
    
    /**
     * Load a rewarded interstitial ad for later display.
     * 
     * @param options Rewarded interstitial ad configuration
     * @returns Promise that resolves when ad is loaded
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.loadRewardedInterstitial({
     *   adId: 'ca-app-pub-xxx/yyy'
     * });
     * ```
     */
    async loadRewardedInterstitial(options: RewardedInterstitialAdOptions): Promise<void> {
      return plugin.adMobLoadRewardedInterstitial(options);
    },
    
    /**
     * Show the previously loaded rewarded interstitial ad.
     * 
     * @returns Promise that resolves when ad is shown
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.adMob.showRewardedInterstitial();
     * ```
     */
    async showRewardedInterstitial(): Promise<void> {
      return plugin.adMobShowRewardedInterstitial();
    },
    
    /**
     * Add a listener for AdMob events.
     * 
     * @param eventName The AdMob event to listen for
     * @param listenerFunc Callback function to handle the event
     * @returns Promise with listener handle for cleanup
     * @since 1.0.0
     * @example
     * ```typescript
     * const listener = await FirebaseKit.adMob.addListener(
     *   'bannerAdLoaded',
     *   (info) => console.log('Banner loaded:', info)
     * );
     * ```
     */
    async addListener(
      eventName: AdMobEventType,
      listenerFunc: (info: any) => void
    ): Promise<PluginListenerHandle> {
      return plugin.addListener(eventName, listenerFunc);
    }
  };

  // Create Crashlytics service proxy
  const crashlytics: CrashlyticsService = {
    /**
     * Force a crash for testing purposes.
     * Should only be used in development builds.
     * 
     * @returns Promise that resolves before the crash
     * @since 1.0.0
     * @example
     * ```typescript
     * if (__DEV__) {
     *   await FirebaseKit.crashlytics.crash();
     * }
     * ```
     */
    async crash(): Promise<void> {
      return plugin.crashlyticsCrash();
    },
    
    /**
     * Force a crash with a custom message.
     * Should only be used in development builds.
     * 
     * @param options Configuration with crash message
     * @returns Promise that resolves before the crash
     * @since 1.0.0
     * @example
     * ```typescript
     * if (__DEV__) {
     *   await FirebaseKit.crashlytics.forceCrash({
     *     message: 'Test crash for debugging'
     *   });
     * }
     * ```
     */
    async forceCrash(options: { message: string }): Promise<void> {
      return plugin.crashlyticsForceCrash(options);
    },
    
    /**
     * Log a custom message to Crashlytics.
     * These messages appear in crash reports to help with debugging.
     * 
     * @param options Configuration with log message
     * @returns Promise that resolves when message is logged
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.crashlytics.log({
     *   message: 'User clicked the purchase button'
     * });
     * ```
     */
    async log(options: { message: string }): Promise<void> {
      return plugin.crashlyticsLog(options);
    },
    
    /**
     * Log a non-fatal exception with details.
     * 
     * @param options Exception details and stack trace
     * @returns Promise that resolves when exception is logged
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.crashlytics.logException({
     *   message: 'API call failed',
     *   code: 'NETWORK_ERROR',
     *   stackTrace: [{
     *     fileName: 'api.service.ts',
     *     lineNumber: 42,
     *     methodName: 'fetchData'
     *   }]
     * });
     * ```
     */
    async logException(options: CrashlyticsExceptionOptions): Promise<void> {
      return plugin.crashlyticsLogException(options);
    },
    
    /**
     * Set a user identifier for crash reports.
     * 
     * @param options Configuration with user ID
     * @returns Promise that resolves when user ID is set
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.crashlytics.setUserId({
     *   userId: 'user_123'
     * });
     * ```
     */
    async setUserId(options: { userId: string }): Promise<void> {
      return plugin.crashlyticsSetUserId(options);
    },
    
    /**
     * Set custom key-value pairs for crash reports.
     * 
     * @param options Configuration with custom attributes
     * @returns Promise that resolves when custom keys are set
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.crashlytics.setCustomKeys({
     *   attributes: {
     *     screen: 'checkout',
     *     user_type: 'premium',
     *     level: 5
     *   }
     * });
     * ```
     */
    async setCustomKeys(options: { attributes: Record<string, string | number | boolean> }): Promise<void> {
      return plugin.crashlyticsSetCustomKeys(options);
    },
    
    /**
     * Enable or disable crash collection.
     * 
     * @param options Configuration for crash collection
     * @returns Promise that resolves when setting is updated
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({
     *   enabled: true
     * });
     * ```
     */
    async setCrashlyticsCollectionEnabled(options: { enabled: boolean }): Promise<void> {
      return plugin.crashlyticsSetCrashlyticsCollectionEnabled(options);
    },
    
    /**
     * Check if crash collection is enabled.
     * 
     * @returns Promise with crash collection status
     * @since 1.0.0
     * @example
     * ```typescript
     * const { enabled } = await FirebaseKit.crashlytics.isCrashlyticsCollectionEnabled();
     * ```
     */
    async isCrashlyticsCollectionEnabled(): Promise<{ enabled: boolean }> {
      return plugin.crashlyticsIsCrashlyticsCollectionEnabled();
    },
    
    /**
     * Delete unsent crash reports.
     * 
     * @returns Promise that resolves when reports are deleted
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.crashlytics.deleteUnsentReports();
     * ```
     */
    async deleteUnsentReports(): Promise<void> {
      return plugin.crashlyticsDeleteUnsentReports();
    },
    
    /**
     * Send unsent crash reports immediately.
     * 
     * @returns Promise that resolves when reports are sent
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.crashlytics.sendUnsentReports();
     * ```
     */
    async sendUnsentReports(): Promise<void> {
      return plugin.crashlyticsSendUnsentReports();
    },
    
    /**
     * Record a breadcrumb for crash context.
     * 
     * @param options Breadcrumb configuration
     * @returns Promise that resolves when breadcrumb is recorded
     * @since 1.0.0
     * @example
     * ```typescript
     * await FirebaseKit.crashlytics.recordBreadcrumb({
     *   name: 'button_click',
     *   params: { button_id: 'checkout' }
     * });
     * ```
     */
    async recordBreadcrumb(options: { name: string; params?: Record<string, any> }): Promise<void> {
      return plugin.crashlyticsRecordBreadcrumb(options);
    }
  };

  // Create Performance service proxy
  const performance: PerformanceService = {
    async initialize(options?: PerformanceInitializeOptions): Promise<void> {
      return plugin.performanceInitialize(options);
    },
    async setPerformanceCollectionEnabled(options: { enabled: boolean }): Promise<void> {
      return plugin.performanceSetPerformanceCollectionEnabled(options);
    },
    async isPerformanceCollectionEnabled(): Promise<{ enabled: boolean }> {
      return plugin.performanceIsPerformanceCollectionEnabled();
    },
    async startTrace(options: { traceName: string }): Promise<{ traceId: string }> {
      return plugin.performanceStartTrace(options);
    },
    async stopTrace(options: { traceId: string }): Promise<void> {
      return plugin.performanceStopTrace(options);
    },
    async incrementMetric(options: TraceMetricOptions): Promise<void> {
      return plugin.performanceIncrementMetric(options);
    },
    async setMetric(options: TraceMetricOptions): Promise<void> {
      return plugin.performanceSetMetric(options);
    },
    async getMetric(options: { traceId: string; metricName: string }): Promise<{ value: number }> {
      return plugin.performanceGetMetric(options);
    },
    async putAttribute(options: TraceAttributeOptions): Promise<void> {
      return plugin.performancePutAttribute(options);
    },
    async getAttributes(options: { traceId: string }): Promise<{ attributes: Record<string, string> }> {
      return plugin.performanceGetAttributes(options);
    },
    async removeAttribute(options: { traceId: string; attribute: string }): Promise<void> {
      return plugin.performanceRemoveAttribute(options);
    },
    async startScreenTrace(options: { screenName: string }): Promise<{ traceId: string }> {
      return plugin.performanceStartScreenTrace(options);
    },
    async stopScreenTrace(options: { traceId: string }): Promise<void> {
      return plugin.performanceStopScreenTrace(options);
    },
    async recordNetworkRequest(options: NetworkRequestOptions): Promise<void> {
      return plugin.performanceRecordNetworkRequest(options);
    }
  };

  // Create Analytics service proxy
  const analytics: AnalyticsService = {
    async initialize(options?: AnalyticsInitializeOptions): Promise<void> {
      return plugin.analyticsInitialize(options);
    },
    async setCollectionEnabled(options: { enabled: boolean }): Promise<void> {
      return plugin.analyticsSetCollectionEnabled(options);
    },
    async setCurrentScreen(options: { screenName: string; screenClass?: string }): Promise<void> {
      return plugin.analyticsSetCurrentScreen(options);
    },
    async logEvent(options: LogEventOptions): Promise<void> {
      return plugin.analyticsLogEvent(options);
    },
    async setUserProperty(options: { key: string; value: string }): Promise<void> {
      return plugin.analyticsSetUserProperty(options);
    },
    async setUserId(options: { userId: string | null }): Promise<void> {
      return plugin.analyticsSetUserId(options);
    },
    async setSessionTimeoutDuration(options: { duration: number }): Promise<void> {
      return plugin.analyticsSetSessionTimeoutDuration(options);
    },
    async getAppInstanceId(): Promise<{ appInstanceId: string }> {
      return plugin.analyticsGetAppInstanceId();
    },
    async resetAnalyticsData(): Promise<void> {
      return plugin.analyticsResetAnalyticsData();
    },
    async setConsent(options: ConsentSettings): Promise<void> {
      return plugin.analyticsSetConsent(options);
    },
    async setDefaultEventParameters(options: { params: Record<string, any> | null }): Promise<void> {
      return plugin.analyticsSetDefaultEventParameters(options);
    }
  };

  // Create Remote Config service proxy
  const remoteConfig: RemoteConfigService = {
    async initialize(options?: RemoteConfigInitializeOptions): Promise<void> {
      return plugin.remoteConfigInitialize(options);
    },
    async setDefaults(options: { defaults: Record<string, any> }): Promise<void> {
      return plugin.remoteConfigSetDefaults(options);
    },
    async fetch(options?: RemoteConfigFetchOptions): Promise<void> {
      return plugin.remoteConfigFetch(options);
    },
    async activate(): Promise<{ activated: boolean }> {
      return plugin.remoteConfigActivate();
    },
    async fetchAndActivate(options?: RemoteConfigFetchOptions): Promise<{ activated: boolean }> {
      return plugin.remoteConfigFetchAndActivate(options);
    },
    async getValue(options: { key: string }): Promise<RemoteConfigValue> {
      return plugin.remoteConfigGetValue(options);
    },
    async getAll(): Promise<{ values: Record<string, RemoteConfigValue> }> {
      return plugin.remoteConfigGetAll();
    },
    async getSettings(): Promise<RemoteConfigSettings> {
      return plugin.remoteConfigGetSettings();
    },
    async setSettings(options: RemoteConfigSettings): Promise<void> {
      return plugin.remoteConfigSetSettings(options);
    },
    async ensureInitialized(): Promise<void> {
      return plugin.remoteConfigEnsureInitialized();
    },
    async reset(): Promise<void> {
      return plugin.remoteConfigReset();
    },
    async addListener(
      eventName: 'remoteConfigUpdated',
      listenerFunc: (config: RemoteConfigUpdate) => void
    ): Promise<PluginListenerHandle> {
      return plugin.addListener(eventName, listenerFunc);
    }
  };

  // Return the complete Firebase Kit proxy with all services
  return {
    appCheck,
    adMob,
    crashlytics,
    performance,
    analytics,
    remoteConfig
  };
}