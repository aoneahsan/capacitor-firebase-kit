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
 * Creates a proxy for the Firebase Kit plugin that provides the nested service structure
 */
export function createFirebaseKitProxy(plugin: any): FirebaseKitPlugin {
  // Create service proxies
  const appCheck: AppCheckService = {
    async initialize(options: AppCheckInitializeOptions): Promise<void> {
      return plugin.appCheckInitialize(options);
    },
    async getToken(options?: AppCheckTokenOptions): Promise<AppCheckTokenResult> {
      return plugin.appCheckGetToken(options);
    },
    async setTokenAutoRefreshEnabled(options: { enabled: boolean }): Promise<void> {
      return plugin.appCheckSetTokenAutoRefreshEnabled(options);
    },
    async addListener(
      eventName: 'appCheckTokenChanged',
      listenerFunc: (token: AppCheckTokenResult) => void
    ): Promise<PluginListenerHandle> {
      return plugin.addListener(eventName, listenerFunc);
    }
  };

  const adMob: AdMobService = {
    async initialize(options?: AdMobInitializeOptions): Promise<void> {
      return plugin.adMobInitialize(options);
    },
    async requestConsentInfo(options?: ConsentRequestOptions): Promise<ConsentInfo> {
      return plugin.adMobRequestConsentInfo(options);
    },
    async showConsentForm(): Promise<ConsentStatus> {
      return plugin.adMobShowConsentForm();
    },
    async resetConsentInfo(): Promise<void> {
      return plugin.adMobResetConsentInfo();
    },
    async setRequestConfiguration(options: RequestConfiguration): Promise<void> {
      return plugin.adMobSetRequestConfiguration(options);
    },
    async showBanner(options: BannerAdOptions): Promise<void> {
      return plugin.adMobShowBanner(options);
    },
    async hideBanner(): Promise<void> {
      return plugin.adMobHideBanner();
    },
    async removeBanner(): Promise<void> {
      return plugin.adMobRemoveBanner();
    },
    async loadInterstitial(options: InterstitialAdOptions): Promise<void> {
      return plugin.adMobLoadInterstitial(options);
    },
    async showInterstitial(): Promise<void> {
      return plugin.adMobShowInterstitial();
    },
    async loadRewarded(options: RewardedAdOptions): Promise<void> {
      return plugin.adMobLoadRewarded(options);
    },
    async showRewarded(): Promise<void> {
      return plugin.adMobShowRewarded();
    },
    async loadRewardedInterstitial(options: RewardedInterstitialAdOptions): Promise<void> {
      return plugin.adMobLoadRewardedInterstitial(options);
    },
    async showRewardedInterstitial(): Promise<void> {
      return plugin.adMobShowRewardedInterstitial();
    },
    async addListener(
      eventName: AdMobEventType,
      listenerFunc: (info: any) => void
    ): Promise<PluginListenerHandle> {
      return plugin.addListener(eventName, listenerFunc);
    }
  };

  const crashlytics: CrashlyticsService = {
    async crash(): Promise<void> {
      return plugin.crashlyticsCrash();
    },
    async forceCrash(options: { message: string }): Promise<void> {
      return plugin.crashlyticsForceCrash(options);
    },
    async log(options: { message: string }): Promise<void> {
      return plugin.crashlyticsLog(options);
    },
    async logException(options: CrashlyticsExceptionOptions): Promise<void> {
      return plugin.crashlyticsLogException(options);
    },
    async setUserId(options: { userId: string }): Promise<void> {
      return plugin.crashlyticsSetUserId(options);
    },
    async setCustomKeys(options: { attributes: Record<string, string | number | boolean> }): Promise<void> {
      return plugin.crashlyticsSetCustomKeys(options);
    },
    async setCrashlyticsCollectionEnabled(options: { enabled: boolean }): Promise<void> {
      return plugin.crashlyticsSetCrashlyticsCollectionEnabled(options);
    },
    async isCrashlyticsCollectionEnabled(): Promise<{ enabled: boolean }> {
      return plugin.crashlyticsIsCrashlyticsCollectionEnabled();
    },
    async deleteUnsentReports(): Promise<void> {
      return plugin.crashlyticsDeleteUnsentReports();
    },
    async sendUnsentReports(): Promise<void> {
      return plugin.crashlyticsSendUnsentReports();
    },
    async recordBreadcrumb(options: { name: string; params?: Record<string, any> }): Promise<void> {
      return plugin.crashlyticsRecordBreadcrumb(options);
    }
  };

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

  // Return the proxy object with nested services
  return {
    appCheck,
    adMob,
    crashlytics,
    performance,
    analytics,
    remoteConfig
  };
}