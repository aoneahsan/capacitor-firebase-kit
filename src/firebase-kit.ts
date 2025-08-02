import { firebaseKitSingleton } from './core/firebase-kit-singleton';
import type { FirebaseKitConfig } from './core/types';

// Service interfaces
export interface AnalyticsService {
  logEvent(eventName: string, eventParams?: any): Promise<void>;
  setUserId(userId: string): Promise<void>;
  setUserProperties(properties: any): Promise<void>;
  setCurrentScreen(screenName: string, screenClassOverride?: string): Promise<void>;
  setEnabled(enabled: boolean): Promise<void>;
  isSupported(): Promise<{ isSupported: boolean }>;
}

export interface AppCheckService {
  initialize(options: any): Promise<void>;
  getToken(forceRefresh?: boolean): Promise<{ token: string }>;
  setTokenAutoRefreshEnabled(enabled: boolean): Promise<void>;
}

export interface AdMobService {
  initialize(options?: any): Promise<void>;
  showBanner(options: any): Promise<void>;
  hideBanner(): Promise<void>;
  resumeBanner(): Promise<void>;
  removeBanner(): Promise<void>;
  prepareInterstitial(options: any): Promise<void>;
  showInterstitial(): Promise<void>;
  prepareRewardVideoAd(options: any): Promise<void>;
  showRewardVideoAd(): Promise<void>;
  setApplicationMuted(muted: boolean): Promise<void>;
  setApplicationVolume(volume: number): Promise<void>;
}

export interface CrashlyticsService {
  crash(): Promise<void>;
  setUserId(userId: string): Promise<void>;
  log(message: string): Promise<void>;
  setEnabled(enabled: boolean): Promise<void>;
  isEnabled(): Promise<{ isEnabled: boolean }>;
  recordException(error: any): Promise<void>;
  setCustomKey(key: string, value: any): Promise<void>;
  setCustomKeys(customKeys: any): Promise<void>;
}

export interface PerformanceService {
  startTrace(traceName: string): Promise<{ traceName: string; traceId: string }>;
  stopTrace(traceName: string): Promise<void>;
  incrementMetric(traceName: string, metricName: string, value: number): Promise<void>;
  setEnabled(enabled: boolean): Promise<void>;
  isEnabled(): Promise<{ isEnabled: boolean }>;
}

export interface RemoteConfigService {
  initialize(options: any): Promise<void>;
  fetchAndActivate(): Promise<{ activated: boolean }>;
  fetchConfig(): Promise<void>;
  activate(): Promise<{ activated: boolean }>;
  getValue(key: string): Promise<{ value: string; source: string }>;
  getString(key: string): Promise<{ value: string }>;
  getNumber(key: string): Promise<{ value: number }>;
  getBoolean(key: string): Promise<{ value: boolean }>;
  setLogLevel(logLevel: string): Promise<void>;
}

// Main FirebaseKit class
class FirebaseKit {
  private analyticsService?: AnalyticsService;
  private appCheckService?: AppCheckService;
  private adMobService?: AdMobService;
  private crashlyticsService?: CrashlyticsService;
  private performanceService?: PerformanceService;
  private remoteConfigService?: RemoteConfigService;

  async initialize(config: FirebaseKitConfig): Promise<void> {
    await firebaseKitSingleton.initialize(config);
  }

  get analytics(): AnalyticsService {
    if (!this.analyticsService) {
      this.analyticsService = {
        logEvent: async (eventName: string, eventParams?: any) => {
          const service = await firebaseKitSingleton.getService<AnalyticsService>('analytics');
          return service.logEvent(eventName, eventParams);
        },
        setUserId: async (userId: string) => {
          const service = await firebaseKitSingleton.getService<AnalyticsService>('analytics');
          return service.setUserId(userId);
        },
        setUserProperties: async (properties: any) => {
          const service = await firebaseKitSingleton.getService<AnalyticsService>('analytics');
          return service.setUserProperties(properties);
        },
        setCurrentScreen: async (screenName: string, screenClassOverride?: string) => {
          const service = await firebaseKitSingleton.getService<AnalyticsService>('analytics');
          return service.setCurrentScreen(screenName, screenClassOverride);
        },
        setEnabled: async (enabled: boolean) => {
          const service = await firebaseKitSingleton.getService<AnalyticsService>('analytics');
          return service.setEnabled(enabled);
        },
        isSupported: async () => {
          const service = await firebaseKitSingleton.getService<AnalyticsService>('analytics');
          return service.isSupported();
        },
      };
    }
    return this.analyticsService;
  }

  get appCheck(): AppCheckService {
    if (!this.appCheckService) {
      this.appCheckService = {
        initialize: async (options: any) => {
          const service = await firebaseKitSingleton.getService<AppCheckService>('appCheck');
          return service.initialize(options);
        },
        getToken: async (forceRefresh?: boolean) => {
          const service = await firebaseKitSingleton.getService<AppCheckService>('appCheck');
          return service.getToken(forceRefresh);
        },
        setTokenAutoRefreshEnabled: async (enabled: boolean) => {
          const service = await firebaseKitSingleton.getService<AppCheckService>('appCheck');
          return service.setTokenAutoRefreshEnabled(enabled);
        },
      };
    }
    return this.appCheckService;
  }

  get adMob(): AdMobService {
    if (!this.adMobService) {
      this.adMobService = {
        initialize: async (options?: any) => {
          const service = await firebaseKitSingleton.getService<AdMobService>('adMob');
          return service.initialize(options);
        },
        showBanner: async (options: any) => {
          const service = await firebaseKitSingleton.getService<AdMobService>('adMob');
          return service.showBanner(options);
        },
        hideBanner: async () => {
          const service = await firebaseKitSingleton.getService<AdMobService>('adMob');
          return service.hideBanner();
        },
        resumeBanner: async () => {
          const service = await firebaseKitSingleton.getService<AdMobService>('adMob');
          return service.resumeBanner();
        },
        removeBanner: async () => {
          const service = await firebaseKitSingleton.getService<AdMobService>('adMob');
          return service.removeBanner();
        },
        prepareInterstitial: async (options: any) => {
          const service = await firebaseKitSingleton.getService<AdMobService>('adMob');
          return service.prepareInterstitial(options);
        },
        showInterstitial: async () => {
          const service = await firebaseKitSingleton.getService<AdMobService>('adMob');
          return service.showInterstitial();
        },
        prepareRewardVideoAd: async (options: any) => {
          const service = await firebaseKitSingleton.getService<AdMobService>('adMob');
          return service.prepareRewardVideoAd(options);
        },
        showRewardVideoAd: async () => {
          const service = await firebaseKitSingleton.getService<AdMobService>('adMob');
          return service.showRewardVideoAd();
        },
        setApplicationMuted: async (muted: boolean) => {
          const service = await firebaseKitSingleton.getService<AdMobService>('adMob');
          return service.setApplicationMuted(muted);
        },
        setApplicationVolume: async (volume: number) => {
          const service = await firebaseKitSingleton.getService<AdMobService>('adMob');
          return service.setApplicationVolume(volume);
        },
      };
    }
    return this.adMobService;
  }

  get crashlytics(): CrashlyticsService {
    if (!this.crashlyticsService) {
      this.crashlyticsService = {
        crash: async () => {
          const service = await firebaseKitSingleton.getService<CrashlyticsService>('crashlytics');
          return service.crash();
        },
        setUserId: async (userId: string) => {
          const service = await firebaseKitSingleton.getService<CrashlyticsService>('crashlytics');
          return service.setUserId(userId);
        },
        log: async (message: string) => {
          const service = await firebaseKitSingleton.getService<CrashlyticsService>('crashlytics');
          return service.log(message);
        },
        setEnabled: async (enabled: boolean) => {
          const service = await firebaseKitSingleton.getService<CrashlyticsService>('crashlytics');
          return service.setEnabled(enabled);
        },
        isEnabled: async () => {
          const service = await firebaseKitSingleton.getService<CrashlyticsService>('crashlytics');
          return service.isEnabled();
        },
        recordException: async (error: any) => {
          const service = await firebaseKitSingleton.getService<CrashlyticsService>('crashlytics');
          return service.recordException(error);
        },
        setCustomKey: async (key: string, value: any) => {
          const service = await firebaseKitSingleton.getService<CrashlyticsService>('crashlytics');
          return service.setCustomKey(key, value);
        },
        setCustomKeys: async (customKeys: any) => {
          const service = await firebaseKitSingleton.getService<CrashlyticsService>('crashlytics');
          return service.setCustomKeys(customKeys);
        },
      };
    }
    return this.crashlyticsService;
  }

  get performance(): PerformanceService {
    if (!this.performanceService) {
      this.performanceService = {
        startTrace: async (traceName: string) => {
          const service = await firebaseKitSingleton.getService<PerformanceService>('performance');
          return service.startTrace(traceName);
        },
        stopTrace: async (traceName: string) => {
          const service = await firebaseKitSingleton.getService<PerformanceService>('performance');
          return service.stopTrace(traceName);
        },
        incrementMetric: async (traceName: string, metricName: string, value: number) => {
          const service = await firebaseKitSingleton.getService<PerformanceService>('performance');
          return service.incrementMetric(traceName, metricName, value);
        },
        setEnabled: async (enabled: boolean) => {
          const service = await firebaseKitSingleton.getService<PerformanceService>('performance');
          return service.setEnabled(enabled);
        },
        isEnabled: async () => {
          const service = await firebaseKitSingleton.getService<PerformanceService>('performance');
          return service.isEnabled();
        },
      };
    }
    return this.performanceService;
  }

  get remoteConfig(): RemoteConfigService {
    if (!this.remoteConfigService) {
      this.remoteConfigService = {
        initialize: async (options: any) => {
          const service = await firebaseKitSingleton.getService<RemoteConfigService>('remoteConfig');
          return service.initialize(options);
        },
        fetchAndActivate: async () => {
          const service = await firebaseKitSingleton.getService<RemoteConfigService>('remoteConfig');
          return service.fetchAndActivate();
        },
        fetchConfig: async () => {
          const service = await firebaseKitSingleton.getService<RemoteConfigService>('remoteConfig');
          return service.fetchConfig();
        },
        activate: async () => {
          const service = await firebaseKitSingleton.getService<RemoteConfigService>('remoteConfig');
          return service.activate();
        },
        getValue: async (key: string) => {
          const service = await firebaseKitSingleton.getService<RemoteConfigService>('remoteConfig');
          return service.getValue(key);
        },
        getString: async (key: string) => {
          const service = await firebaseKitSingleton.getService<RemoteConfigService>('remoteConfig');
          return service.getString(key);
        },
        getNumber: async (key: string) => {
          const service = await firebaseKitSingleton.getService<RemoteConfigService>('remoteConfig');
          return service.getNumber(key);
        },
        getBoolean: async (key: string) => {
          const service = await firebaseKitSingleton.getService<RemoteConfigService>('remoteConfig');
          return service.getBoolean(key);
        },
        setLogLevel: async (logLevel: string) => {
          const service = await firebaseKitSingleton.getService<RemoteConfigService>('remoteConfig');
          return service.setLogLevel(logLevel);
        },
      };
    }
    return this.remoteConfigService;
  }
}

// Export singleton instance
export const firebaseKit = new FirebaseKit();

// Also export the types
export type { FirebaseKitConfig } from './core/types';