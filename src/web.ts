import { WebPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';

import type {
  FirebaseKitPlugin,
  AppCheckService,
  AppCheckInitializeOptions,
  AppCheckTokenOptions,
  AppCheckTokenResult,
  AdMobService,
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
  CrashlyticsService,
  CrashlyticsExceptionOptions,
  PerformanceService,
  PerformanceInitializeOptions,
  TraceMetricOptions,
  TraceAttributeOptions,
  NetworkRequestOptions,
  AnalyticsService,
  AnalyticsInitializeOptions,
  LogEventOptions,
  ConsentSettings,
  RemoteConfigService,
  RemoteConfigInitializeOptions,
  RemoteConfigFetchOptions,
  RemoteConfigValue,
  RemoteConfigSettings,
  RemoteConfigUpdate,
} from './definitions';
import { FirebaseKitErrorCode } from './definitions';

/**
 * Web implementation of Firebase Kit Plugin
 * Provides partial implementation for web platform where applicable
 */
export class FirebaseKitWeb extends WebPlugin implements FirebaseKitPlugin {
  appCheck: AppCheckService;
  adMob: AdMobService;
  crashlytics: CrashlyticsService;
  performance: PerformanceService;
  analytics: AnalyticsService;
  remoteConfig: RemoteConfigService;

  constructor() {
    super();

    // Initialize service implementations
    this.appCheck = new AppCheckWebService();
    this.adMob = new AdMobWebService();
    this.crashlytics = new CrashlyticsWebService();
    this.performance = new PerformanceWebService();
    this.analytics = new AnalyticsWebService();
    this.remoteConfig = new RemoteConfigWebService();
  }
}

/**
 * Web implementation of App Check Service
 */
class AppCheckWebService extends WebPlugin implements AppCheckService {
  private appCheckInstance: any = null;
  private isInitialized = false;

  async initialize(options: AppCheckInitializeOptions): Promise<void> {
    // Check if Firebase is loaded
    if (typeof window === 'undefined' || !(window as any).firebase) {
      throw this.createError('Firebase SDK not loaded', FirebaseKitErrorCode.NOT_INITIALIZED);
    }

    try {
      const firebase = (window as any).firebase;

      // Initialize App Check based on provider
      if (options.provider === 'recaptchaV3' || options.provider === 'recaptchaEnterprise') {
        if (!options.siteKey) {
          throw this.createError('Site key required for reCAPTCHA provider', FirebaseKitErrorCode.INVALID_ARGUMENT);
        }

        const provider = options.provider === 'recaptchaV3'
          ? new firebase.appCheck.ReCaptchaV3Provider(options.siteKey)
          : new firebase.appCheck.ReCaptchaEnterpriseProvider(options.siteKey);

        this.appCheckInstance = firebase.appCheck();
        // Default to false for token auto-refresh if not specified
        const isTokenAutoRefreshEnabled = options.isTokenAutoRefreshEnabled ?? false;
        await this.appCheckInstance.activate(provider, isTokenAutoRefreshEnabled);
        this.isInitialized = true;
      } else if (options.provider === 'debug') {
        // Debug provider for development
        if (options.debugToken) {
          (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = options.debugToken;
        }
        this.appCheckInstance = firebase.appCheck();
        this.isInitialized = true;
      } else {
        // Other providers not supported on web
        throw this.createError(
          `Provider ${options.provider} not supported on web platform`,
          FirebaseKitErrorCode.NOT_SUPPORTED_ON_PLATFORM,
        );
      }
    } catch (error: any) {
      throw this.createError(error.message || 'Failed to initialize App Check', FirebaseKitErrorCode.APP_CHECK_PROVIDER_ERROR);
    }
  }

  async getToken(options?: AppCheckTokenOptions): Promise<AppCheckTokenResult> {
    this.ensureInitialized();

    try {
      const tokenResult = await this.appCheckInstance.getToken(options?.forceRefresh);
      return {
        token: tokenResult.token,
        expireTimeMillis: tokenResult.expireTimeMillis,
      };
    } catch (error: any) {
      throw this.createError(error.message || 'Failed to get App Check token', FirebaseKitErrorCode.APP_CHECK_PROVIDER_ERROR);
    }
  }

  async setTokenAutoRefreshEnabled(options: { enabled: boolean }): Promise<void> {
    this.ensureInitialized();
    this.appCheckInstance.setTokenAutoRefreshEnabled(options.enabled);
  }

  async addListener(
    _eventName: 'appCheckTokenChanged',
    listenerFunc: (token: AppCheckTokenResult) => void,
  ): Promise<PluginListenerHandle> {
    this.ensureInitialized();

    const unsubscribe = this.appCheckInstance.onTokenChanged((tokenResult: any) => {
      listenerFunc({
        token: tokenResult.token,
        expireTimeMillis: tokenResult.expireTimeMillis,
      });
    });

    return {
      remove: async () => {
        unsubscribe();
      },
    };
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw this.createError('App Check not initialized. Call initialize() first.', FirebaseKitErrorCode.NOT_INITIALIZED);
    }
  }

  private createError(message: string, code: FirebaseKitErrorCode): Error {
    const error = new Error(message);
    (error as any).code = code;
    return error;
  }
}

/**
 * Web implementation of AdMob Service
 */
class AdMobWebService extends WebPlugin implements AdMobService {
  async initialize(_options?: AdMobInitializeOptions): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform. Use native platforms (iOS/Android) for ad functionality.');
  }

  async requestConsentInfo(_options?: ConsentRequestOptions): Promise<ConsentInfo> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async showConsentForm(): Promise<ConsentStatus> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async resetConsentInfo(): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async setRequestConfiguration(_options: RequestConfiguration): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async showBanner(_options: BannerAdOptions): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async hideBanner(): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async removeBanner(): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async loadInterstitial(_options: InterstitialAdOptions): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async showInterstitial(): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async loadRewarded(_options: RewardedAdOptions): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async showRewarded(): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async loadRewardedInterstitial(_options: RewardedInterstitialAdOptions): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async showRewardedInterstitial(): Promise<void> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }

  async addListener(
    _eventName: AdMobEventType,
    _listenerFunc: (info: any) => void,
  ): Promise<PluginListenerHandle> {
    throw this.unimplemented('AdMob is not supported on web platform.');
  }
}

/**
 * Web implementation of Crashlytics Service
 */
class CrashlyticsWebService extends WebPlugin implements CrashlyticsService {
  private logs: string[] = [];
  private customKeys: Record<string, any> = {};
  private userId: string | null = null;

  async crash(): Promise<void> {
    // Log warning instead of crashing on web
    console.warn('[FirebaseKit] Crashlytics crash() called - simulated on web platform');
    console.warn('Crash simulation: Manual crash triggered');
  }

  async forceCrash(options: { message: string }): Promise<void> {
    console.error('[FirebaseKit] Force crash:', options.message);
    throw new Error(`Forced crash: ${options.message}`);
  }

  async log(options: { message: string }): Promise<void> {
    this.logs.push(`[${new Date().toISOString()}] ${options.message}`);
    console.log('[FirebaseKit Crashlytics]', options.message);
  }

  async logException(options: CrashlyticsExceptionOptions): Promise<void> {
    const error = {
      message: options.message,
      code: options.code,
      domain: options.domain,
      stackTrace: options.stackTrace,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      customKeys: { ...this.customKeys },
    };

    console.error('[FirebaseKit Crashlytics Exception]', error);

    // In a real implementation, this would send to a logging service
    if ((window as any).firebase?.crashlytics) {
      try {
        (window as any).firebase.crashlytics().recordError(new Error(options.message));
      } catch (e) {
        console.warn('Firebase Crashlytics not available on web');
      }
    }
  }

  async setUserId(options: { userId: string }): Promise<void> {
    this.userId = options.userId;
    console.log('[FirebaseKit Crashlytics] User ID set:', options.userId);
  }

  async setCustomKeys(options: { attributes: Record<string, string | number | boolean> }): Promise<void> {
    this.customKeys = { ...this.customKeys, ...options.attributes };
    console.log('[FirebaseKit Crashlytics] Custom keys updated:', this.customKeys);
  }

  async setCrashlyticsCollectionEnabled(options: { enabled: boolean }): Promise<void> {
    console.log('[FirebaseKit Crashlytics] Collection enabled:', options.enabled);
  }

  async isCrashlyticsCollectionEnabled(): Promise<{ enabled: boolean }> {
    // Always return true for web as it's simulated
    return { enabled: true };
  }

  async deleteUnsentReports(): Promise<void> {
    this.logs = [];
    console.log('[FirebaseKit Crashlytics] Unsent reports deleted');
  }

  async sendUnsentReports(): Promise<void> {
    console.log('[FirebaseKit Crashlytics] Sending reports:', this.logs);
    // In a real implementation, this would send logs to a service
  }

  async recordBreadcrumb(options: { name: string; params?: Record<string, any> }): Promise<void> {
    const breadcrumb = `[Breadcrumb] ${options.name}${options.params ? `: ${  JSON.stringify(options.params)}` : ''}`;
    this.logs.push(`[${new Date().toISOString()}] ${breadcrumb}`);
    console.log('[FirebaseKit Crashlytics]', breadcrumb);
  }
}

/**
 * Web implementation of Performance Service
 */
class PerformanceWebService extends WebPlugin implements PerformanceService {
  private traces: Map<string, any> = new Map();
  private performanceInstance: any = null;

  async initialize(options?: PerformanceInitializeOptions): Promise<void> {
    if (typeof window !== 'undefined' && (window as any).firebase?.performance) {
      try {
        this.performanceInstance = (window as any).firebase.performance();

        // Set performance collection enabled with proper default (true if not specified)
        const enabled = options?.enabled ?? true;
        this.performanceInstance.setPerformanceCollectionEnabled(enabled);

        // Set data collection enabled if specified
        if (options?.dataCollectionEnabled !== undefined) {
          this.performanceInstance.setPerformanceCollectionEnabled(options.dataCollectionEnabled);
        }

        // Note: instrumentationEnabled is typically handled at SDK initialization level
        // and may not be configurable after initialization on web
      } catch (error) {
        console.warn('[FirebaseKit Performance] Failed to initialize:', error);
      }
    }
  }

  async setPerformanceCollectionEnabled(options: { enabled: boolean }): Promise<void> {
    if (this.performanceInstance) {
      this.performanceInstance.setPerformanceCollectionEnabled(options.enabled);
    }
  }

  async isPerformanceCollectionEnabled(): Promise<{ enabled: boolean }> {
    if (this.performanceInstance) {
      return { enabled: this.performanceInstance.isPerformanceCollectionEnabled() };
    }
    return { enabled: false };
  }

  async startTrace(options: { traceName: string }): Promise<{ traceId: string }> {
    const traceId = `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (this.performanceInstance) {
      try {
        const trace = this.performanceInstance.trace(options.traceName);
        trace.start();
        this.traces.set(traceId, trace);
      } catch (error) {
        console.warn('[FirebaseKit Performance] Failed to start trace:', error);
      }
    } else {
      // Fallback implementation
      this.traces.set(traceId, {
        name: options.traceName,
        startTime: performance.now(),
        metrics: {},
        attributes: {},
      });
    }

    return { traceId };
  }

  async stopTrace(options: { traceId: string }): Promise<void> {
    const trace = this.traces.get(options.traceId);
    if (trace) {
      if (trace.stop) {
        trace.stop();
      } else {
        trace.duration = performance.now() - trace.startTime;
      }
      this.traces.delete(options.traceId);
    }
  }

  async incrementMetric(options: TraceMetricOptions): Promise<void> {
    const trace = this.traces.get(options.traceId);
    if (trace) {
      if (trace.incrementMetric) {
        trace.incrementMetric(options.metricName, options.value);
      } else {
        trace.metrics[options.metricName] = (trace.metrics[options.metricName] || 0) + options.value;
      }
    }
  }

  async setMetric(options: TraceMetricOptions): Promise<void> {
    const trace = this.traces.get(options.traceId);
    if (trace) {
      if (trace.putMetric) {
        trace.putMetric(options.metricName, options.value);
      } else {
        trace.metrics[options.metricName] = options.value;
      }
    }
  }

  async getMetric(options: { traceId: string; metricName: string }): Promise<{ value: number }> {
    const trace = this.traces.get(options.traceId);
    if (trace) {
      if (trace.getMetric) {
        return { value: trace.getMetric(options.metricName) };
      } else {
        return { value: trace.metrics[options.metricName] || 0 };
      }
    }
    return { value: 0 };
  }

  async putAttribute(options: TraceAttributeOptions): Promise<void> {
    const trace = this.traces.get(options.traceId);
    if (trace) {
      if (trace.putAttribute) {
        trace.putAttribute(options.attribute, options.value);
      } else {
        trace.attributes[options.attribute] = options.value;
      }
    }
  }

  async getAttributes(options: { traceId: string }): Promise<{ attributes: Record<string, string> }> {
    const trace = this.traces.get(options.traceId);
    if (trace) {
      if (trace.getAttributes) {
        return { attributes: trace.getAttributes() };
      } else {
        return { attributes: trace.attributes || {} };
      }
    }
    return { attributes: {} };
  }

  async removeAttribute(options: { traceId: string; attribute: string }): Promise<void> {
    const trace = this.traces.get(options.traceId);
    if (trace) {
      if (trace.removeAttribute) {
        trace.removeAttribute(options.attribute);
      } else if (trace.attributes) {
        delete trace.attributes[options.attribute];
      }
    }
  }

  async startScreenTrace(options: { screenName: string }): Promise<{ traceId: string }> {
    return this.startTrace({ traceName: `screen_${options.screenName}` });
  }

  async stopScreenTrace(options: { traceId: string }): Promise<void> {
    return this.stopTrace(options);
  }

  async recordNetworkRequest(options: NetworkRequestOptions): Promise<void> {
    if (this.performanceInstance) {
      try {
        // Firebase Performance automatically tracks network requests
        console.log('[FirebaseKit Performance] Network request recorded:', options.url);
      } catch (error) {
        console.warn('[FirebaseKit Performance] Failed to record network request:', error);
      }
    }
  }
}

/**
 * Web implementation of Analytics Service
 */
class AnalyticsWebService extends WebPlugin implements AnalyticsService {
  private analyticsInstance: any = null;
  private gtag: any = null;
  private isInitialized = false;

  async initialize(options?: AnalyticsInitializeOptions): Promise<void> {
    // Try Firebase Analytics first
    if (typeof window !== 'undefined' && (window as any).firebase?.analytics) {
      try {
        this.analyticsInstance = (window as any).firebase.analytics();
        this.isInitialized = true;

        // Set collection enabled with proper default (true if not specified)
        const collectionEnabled = options?.collectionEnabled ?? true;
        await this.analyticsInstance.setAnalyticsCollectionEnabled(collectionEnabled);

        // Set session timeout if provided
        if (options?.sessionTimeoutDuration !== undefined) {
          await this.analyticsInstance.setSessionTimeoutDuration(options.sessionTimeoutDuration * 1000);
        }
      } catch (error) {
        console.warn('[FirebaseKit Analytics] Firebase Analytics not available:', error);
      }
    }

    // Fallback to gtag if available
    if (!this.isInitialized && typeof window !== 'undefined' && (window as any).gtag) {
      this.gtag = (window as any).gtag;
      this.isInitialized = true;
    }

    if (!this.isInitialized) {
      throw this.createError('Analytics not available. Load Firebase or Google Analytics first.', FirebaseKitErrorCode.NOT_INITIALIZED);
    }
  }

  async setCollectionEnabled(options: { enabled: boolean }): Promise<void> {
    if (this.analyticsInstance) {
      await this.analyticsInstance.setAnalyticsCollectionEnabled(options.enabled);
    } else if (this.gtag) {
      this.gtag('config', 'GA_MEASUREMENT_ID', {
        'send_page_view': options.enabled,
        'allow_google_signals': options.enabled,
      });
    }
  }

  async setCurrentScreen(options: { screenName: string; screenClass?: string }): Promise<void> {
    this.ensureInitialized();

    if (this.analyticsInstance) {
      await this.analyticsInstance.setCurrentScreen(options.screenName, options.screenClass);
    } else if (this.gtag) {
      this.gtag('event', 'screen_view', {
        screen_name: options.screenName,
        screen_class: options.screenClass,
      });
    }
  }

  async logEvent(options: LogEventOptions): Promise<void> {
    this.ensureInitialized();

    if (this.analyticsInstance) {
      await this.analyticsInstance.logEvent(options.name, options.params);
    } else if (this.gtag) {
      this.gtag('event', options.name, options.params);
    }
  }

  async setUserProperty(options: { key: string; value: string }): Promise<void> {
    this.ensureInitialized();

    if (this.analyticsInstance) {
      await this.analyticsInstance.setUserProperties({ [options.key]: options.value });
    } else if (this.gtag) {
      this.gtag('set', 'user_properties', { [options.key]: options.value });
    }
  }

  async setUserId(options: { userId: string | null }): Promise<void> {
    this.ensureInitialized();

    if (this.analyticsInstance) {
      await this.analyticsInstance.setUserId(options.userId);
    } else if (this.gtag) {
      this.gtag('config', 'GA_MEASUREMENT_ID', {
        'user_id': options.userId,
      });
    }
  }

  async setSessionTimeoutDuration(options: { duration: number }): Promise<void> {
    this.ensureInitialized();

    if (this.analyticsInstance) {
      await this.analyticsInstance.setSessionTimeoutDuration(options.duration);
    } else if (this.gtag) {
      this.gtag('config', 'GA_MEASUREMENT_ID', {
        'session_timeout': options.duration,
      });
    }
  }

  async getAppInstanceId(): Promise<{ appInstanceId: string }> {
    this.ensureInitialized();

    if (this.analyticsInstance) {
      const appInstanceId = await this.analyticsInstance.getAppInstanceId();
      return { appInstanceId };
    }

    // Generate a pseudo app instance ID for gtag
    const storedId = localStorage.getItem('firebase_kit_app_instance_id');
    if (storedId) {
      return { appInstanceId: storedId };
    }

    const newId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('firebase_kit_app_instance_id', newId);
    return { appInstanceId: newId };
  }

  async resetAnalyticsData(): Promise<void> {
    this.ensureInitialized();

    if (this.analyticsInstance) {
      // Firebase doesn't have a direct reset method on web
      console.warn('[FirebaseKit Analytics] Reset not directly supported on web. Clear user properties and ID instead.');
      await this.analyticsInstance.setUserId(null);
    }

    localStorage.removeItem('firebase_kit_app_instance_id');
  }

  async setConsent(options: ConsentSettings): Promise<void> {
    this.ensureInitialized();

    if (this.gtag) {
      const consentConfig: any = {};

      if (options.analyticsStorage !== undefined) {
        consentConfig.analytics_storage = options.analyticsStorage;
      }
      if (options.adStorage !== undefined) {
        consentConfig.ad_storage = options.adStorage;
      }
      if (options.adUserData !== undefined) {
        consentConfig.ad_user_data = options.adUserData;
      }
      if (options.adPersonalization !== undefined) {
        consentConfig.ad_personalization = options.adPersonalization;
      }

      this.gtag('consent', 'update', consentConfig);
    } else {
      console.warn('[FirebaseKit Analytics] Consent management requires gtag');
    }
  }

  async setDefaultEventParameters(options: { params: Record<string, any> | null }): Promise<void> {
    this.ensureInitialized();

    if (this.analyticsInstance) {
      // Firebase Analytics web SDK doesn't support default parameters directly
      console.warn('[FirebaseKit Analytics] Default parameters not supported in Firebase Analytics web SDK');
    } else if (this.gtag) {
      if (options.params) {
        this.gtag('set', options.params);
      }
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw this.createError('Analytics not initialized. Call initialize() first.', FirebaseKitErrorCode.NOT_INITIALIZED);
    }
  }

  private createError(message: string, code: FirebaseKitErrorCode): Error {
    const error = new Error(message);
    (error as any).code = code;
    return error;
  }
}

/**
 * Web implementation of Remote Config Service
 */
class RemoteConfigWebService extends WebPlugin implements RemoteConfigService {
  private remoteConfigInstance: any = null;
  private isInitialized = false;
  private configListeners: Map<string, Function[]> = new Map();

  async initialize(options?: RemoteConfigInitializeOptions): Promise<void> {
    if (typeof window === 'undefined' || !(window as any).firebase?.remoteConfig) {
      throw this.createError('Firebase Remote Config not loaded', FirebaseKitErrorCode.NOT_INITIALIZED);
    }

    try {
      this.remoteConfigInstance = (window as any).firebase.remoteConfig();

      // Set settings with proper defaults
      const settings: any = {};

      // Default minimum fetch interval is 12 hours (43200 seconds) for production
      const minimumFetchIntervalInSeconds = options?.minimumFetchIntervalInSeconds ?? 43200;
      settings.minimumFetchIntervalMillis = minimumFetchIntervalInSeconds * 1000;

      // Default fetch timeout is 60 seconds
      const fetchTimeoutInSeconds = options?.fetchTimeoutInSeconds ?? 60;
      settings.fetchTimeoutMillis = fetchTimeoutInSeconds * 1000;

      this.remoteConfigInstance.settings = settings;
      this.isInitialized = true;
    } catch (error: any) {
      throw this.createError(error.message || 'Failed to initialize Remote Config', FirebaseKitErrorCode.INTERNAL);
    }
  }

  async setDefaults(options: { defaults: Record<string, any> }): Promise<void> {
    this.ensureInitialized();
    this.remoteConfigInstance.defaultConfig = options.defaults;
  }

  async fetch(options?: RemoteConfigFetchOptions): Promise<void> {
    this.ensureInitialized();

    try {
      if (options?.minimumFetchIntervalInSeconds !== undefined) {
        const settings = { ...this.remoteConfigInstance.settings };
        settings.minimumFetchIntervalMillis = options.minimumFetchIntervalInSeconds * 1000;
        this.remoteConfigInstance.settings = settings;
      }

      await this.remoteConfigInstance.fetch();
    } catch (error: any) {
      throw this.createError(error.message || 'Failed to fetch config', FirebaseKitErrorCode.CONFIG_FETCH_FAILED);
    }
  }

  async activate(): Promise<{ activated: boolean }> {
    this.ensureInitialized();

    try {
      const activated = await this.remoteConfigInstance.activate();

      // Notify listeners if activated
      if (activated) {
        this.notifyConfigListeners();
      }

      return { activated };
    } catch (error: any) {
      throw this.createError(error.message || 'Failed to activate config', FirebaseKitErrorCode.CONFIG_UPDATE_FAILED);
    }
  }

  async fetchAndActivate(options?: RemoteConfigFetchOptions): Promise<{ activated: boolean }> {
    this.ensureInitialized();

    try {
      await this.fetch(options);
      return await this.activate();
    } catch (error: any) {
      throw this.createError(error.message || 'Failed to fetch and activate config', FirebaseKitErrorCode.CONFIG_FETCH_FAILED);
    }
  }

  async getValue(options: { key: string }): Promise<RemoteConfigValue> {
    this.ensureInitialized();

    const value = this.remoteConfigInstance.getValue(options.key);

    return {
      asString: value.asString(),
      asNumber: value.asNumber(),
      asBoolean: value.asBoolean(),
      source: value.getSource() as any,
    };
  }

  async getAll(): Promise<{ values: Record<string, RemoteConfigValue> }> {
    this.ensureInitialized();

    const all = this.remoteConfigInstance.getAll();
    const values: Record<string, RemoteConfigValue> = {};

    for (const [key, value] of Object.entries(all)) {
      values[key] = {
        asString: (value as any).asString(),
        asNumber: (value as any).asNumber(),
        asBoolean: (value as any).asBoolean(),
        source: (value as any).getSource() as any,
      };
    }

    return { values };
  }

  async getSettings(): Promise<RemoteConfigSettings> {
    this.ensureInitialized();

    const settings = this.remoteConfigInstance.settings;

    return {
      minimumFetchIntervalInSeconds: settings.minimumFetchIntervalMillis / 1000,
      fetchTimeoutInSeconds: settings.fetchTimeoutMillis / 1000,
    };
  }

  async setSettings(options: RemoteConfigSettings): Promise<void> {
    this.ensureInitialized();

    this.remoteConfigInstance.settings = {
      minimumFetchIntervalMillis: options.minimumFetchIntervalInSeconds * 1000,
      fetchTimeoutMillis: options.fetchTimeoutInSeconds * 1000,
    };
  }

  async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  async reset(): Promise<void> {
    this.ensureInitialized();

    // Clear all values by setting empty defaults
    this.remoteConfigInstance.defaultConfig = {};

    // Clear listeners
    this.configListeners.clear();
  }

  async addListener(
    eventName: 'remoteConfigUpdated',
    listenerFunc: (config: RemoteConfigUpdate) => void,
  ): Promise<PluginListenerHandle> {
    if (!this.configListeners.has(eventName)) {
      this.configListeners.set(eventName, []);
    }

    this.configListeners.get(eventName)!.push(listenerFunc);

    return {
      remove: async () => {
        const listeners = this.configListeners.get(eventName);
        if (listeners) {
          const index = listeners.indexOf(listenerFunc);
          if (index > -1) {
            listeners.splice(index, 1);
          }
        }
      },
    };
  }

  private notifyConfigListeners(): void {
    const listeners = this.configListeners.get('remoteConfigUpdated');
    if (listeners) {
      // Get all keys that have been updated
      const all = this.remoteConfigInstance.getAll();
      const updatedKeys = Object.keys(all);

      const update: RemoteConfigUpdate = { updatedKeys };

      listeners.forEach(listener => {
        try {
          listener(update);
        } catch (error) {
          console.error('[FirebaseKit RemoteConfig] Error in listener:', error);
        }
      });
    }
  }

  private createError(message: string, code: FirebaseKitErrorCode): Error {
    const error = new Error(message);
    (error as any).code = code;
    return error;
  }
}