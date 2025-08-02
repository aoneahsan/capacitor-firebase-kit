import { PlatformAdapter } from '../core/platform-adapter';
import type { FirebaseKitConfig } from '../core/types';

export class ReactNativeAdapter extends PlatformAdapter {
  async initialize(config: FirebaseKitConfig): Promise<void> {
    this.validateConfig(config);
    this.config = config;

    // React Native Firebase auto-initializes from native config files
    console.warn('React Native Firebase initialized with native config');
  }

  async getService<T>(serviceName: string): Promise<T> {
    if (!this.isSupported(serviceName)) {
      throw new Error(`Service ${serviceName} is not supported on React Native platform`);
    }

    if (this.serviceCache.has(serviceName)) {
      return this.serviceCache.get(serviceName) as T;
    }

    const service = await this.loadServiceModule(serviceName);
    this.serviceCache.set(serviceName, service);
    return service as T;
  }

  protected async loadServiceModule(serviceName: string): Promise<any> {
    switch (serviceName) {
      case 'analytics':
        return this.loadAnalytics();
      case 'appCheck':
        return this.loadAppCheck();
      case 'crashlytics':
        return this.loadCrashlytics();
      case 'performance':
        return this.loadPerformance();
      case 'remoteConfig':
        return this.loadRemoteConfig();
      case 'adMob':
        return this.loadAdMob();
      default:
        throw new Error(`Unknown service: ${serviceName}`);
    }
  }

  private async loadAnalytics() {
    try {
      const analytics = await import('@react-native-firebase/analytics');
      const analyticsInstance = analytics.default();

      return {
        logEvent: (eventName: string, eventParams?: any) =>
          analyticsInstance.logEvent(eventName, eventParams),
        setUserId: (userId: string) =>
          analyticsInstance.setUserId(userId),
        setUserProperties: (properties: any) =>
          analyticsInstance.setUserProperties(properties),
        setCurrentScreen: (screenName: string, screenClassOverride?: string) =>
          analyticsInstance.logScreenView({
            screen_name: screenName,
            screen_class: screenClassOverride,
          }),
        setEnabled: (enabled: boolean) =>
          analyticsInstance.setAnalyticsCollectionEnabled(enabled),
        isSupported: async () => ({ isSupported: true }),
      };
    } catch {
      throw new Error('@react-native-firebase/analytics not installed. Run: npm install @react-native-firebase/analytics');
    }
  }

  private async loadAppCheck() {
    try {
      const appCheck = await import('@react-native-firebase/app-check');
      const appCheckInstance = appCheck.default();

      return {
        initialize: async (options: any) => {
          if (options.provider === 'debug') {
            await appCheckInstance.newReactNativeFirebaseAppCheckProvider();
          }
          await appCheckInstance.initializeAppCheck({
            provider: appCheckInstance.newReactNativeFirebaseAppCheckProvider(),
            isTokenAutoRefreshEnabled: options.isTokenAutoRefreshEnabled ?? true,
          });
        },
        getToken: async (forceRefresh?: boolean) => {
          const result = await appCheckInstance.getToken(forceRefresh);
          return { token: result.token };
        },
        setTokenAutoRefreshEnabled: async (_enabled: boolean) => {
          console.warn('setTokenAutoRefreshEnabled must be set during initialization');
        },
      };
    } catch {
      throw new Error('@react-native-firebase/app-check not installed. Run: npm install @react-native-firebase/app-check');
    }
  }

  private async loadCrashlytics() {
    try {
      const crashlytics = await import('@react-native-firebase/crashlytics');
      const crashlyticsInstance = crashlytics.default();

      return {
        crash: () => crashlyticsInstance.crash(),
        setUserId: (userId: string) => crashlyticsInstance.setUserId(userId),
        log: (message: string) => crashlyticsInstance.log(message),
        setEnabled: (enabled: boolean) => crashlyticsInstance.setCrashlyticsCollectionEnabled(enabled),
        isEnabled: async () => ({
          isEnabled: await crashlyticsInstance.isCrashlyticsCollectionEnabled(),
        }),
        recordException: (error: any) => crashlyticsInstance.recordError(error),
        setCustomKey: (key: string, value: any) =>
          crashlyticsInstance.setAttribute(key, String(value)),
        setCustomKeys: (customKeys: any) =>
          crashlyticsInstance.setAttributes(customKeys),
      };
    } catch {
      throw new Error('@react-native-firebase/crashlytics not installed. Run: npm install @react-native-firebase/crashlytics');
    }
  }

  private async loadPerformance() {
    try {
      const perf = await import('@react-native-firebase/perf');
      const perfInstance = perf.default();
      const traces = new Map<string, any>();

      return {
        startTrace: async (traceName: string) => {
          const trace = await perfInstance.startTrace(traceName);
          traces.set(traceName, trace);
          return { traceName, traceId: traceName };
        },
        stopTrace: async (traceName: string) => {
          const trace = traces.get(traceName);
          if (trace) {
            await trace.stop();
            traces.delete(traceName);
          }
        },
        incrementMetric: async (traceName: string, metricName: string, value: number) => {
          const trace = traces.get(traceName);
          if (trace) {
            trace.incrementMetric(metricName, value);
          }
        },
        setEnabled: (enabled: boolean) =>
          perfInstance.setPerformanceCollectionEnabled(enabled),
        isEnabled: async () => ({
          isEnabled: await perfInstance.isPerformanceCollectionEnabled(),
        }),
      };
    } catch {
      throw new Error('@react-native-firebase/perf not installed. Run: npm install @react-native-firebase/perf');
    }
  }

  private async loadRemoteConfig() {
    try {
      const remoteConfig = await import('@react-native-firebase/remote-config');
      const remoteConfigInstance = remoteConfig.default();

      return {
        initialize: async (options: any) => {
          await remoteConfigInstance.setConfigSettings({
            minimumFetchIntervalMillis: options.minimumFetchIntervalMillis ?? 43200000,
          });

          if (options.defaultConfig) {
            await remoteConfigInstance.setDefaults(options.defaultConfig);
          }
        },
        fetchAndActivate: async () => {
          const activated = await remoteConfigInstance.fetchAndActivate();
          return { activated };
        },
        fetchConfig: async () => {
          await remoteConfigInstance.fetch();
        },
        activate: async () => {
          const activated = await remoteConfigInstance.activate();
          return { activated };
        },
        getValue: async (key: string) => {
          const value = remoteConfigInstance.getValue(key);
          return {
            value: value.asString(),
            source: value.getSource(),
          };
        },
        getString: async (key: string) => {
          const value = remoteConfigInstance.getString(key);
          return { value };
        },
        getNumber: async (key: string) => {
          const value = remoteConfigInstance.getNumber(key);
          return { value };
        },
        getBoolean: async (key: string) => {
          const value = remoteConfigInstance.getBoolean(key);
          return { value };
        },
        setLogLevel: async (_logLevel: string) => {
          console.warn('setLogLevel not supported in React Native');
        },
      };
    } catch {
      throw new Error('@react-native-firebase/remote-config not installed. Run: npm install @react-native-firebase/remote-config');
    }
  }

  private async loadAdMob() {
    try {
      const admob = await import('react-native-google-mobile-ads');

      return {
        initialize: async (options?: any) => {
          await admob.default().initialize();
          if (options?.testMode) {
            // Set test device IDs if needed
          }
        },
        showBanner: async (_options: any) => {
          console.warn('Use BannerAd component from react-native-google-mobile-ads');
        },
        hideBanner: async () => {
          console.warn('Control banner visibility through component state');
        },
        resumeBanner: async () => {
          console.warn('Control banner visibility through component state');
        },
        removeBanner: async () => {
          console.warn('Remove BannerAd component from render');
        },
        prepareInterstitial: async (options: any) => {
          const { InterstitialAd, TestIds } = admob;
          const adUnitId = options.testing ? TestIds.INTERSTITIAL : options.adId;
          const interstitial = InterstitialAd.createForAdRequest(adUnitId);
          return { interstitial };
        },
        showInterstitial: async () => {
          console.warn('Use interstitial.show() from prepareInterstitial result');
        },
        prepareRewardVideoAd: async (options: any) => {
          const { RewardedAd, TestIds } = admob;
          const adUnitId = options.testing ? TestIds.REWARDED : options.adId;
          const rewarded = RewardedAd.createForAdRequest(adUnitId);
          return { rewarded };
        },
        showRewardVideoAd: async () => {
          console.warn('Use rewarded.show() from prepareRewardVideoAd result');
        },
        setApplicationMuted: async (muted: boolean) => {
          await admob.default().setAppMuted(muted);
        },
        setApplicationVolume: async (volume: number) => {
          await admob.default().setAppVolume(volume);
        },
      };
    } catch {
      throw new Error('react-native-google-mobile-ads not installed. Run: npm install react-native-google-mobile-ads');
    }
  }

  isSupported(serviceName: string): boolean {
    const supportedServices = [
      'analytics',
      'appCheck',
      'crashlytics',
      'performance',
      'remoteConfig',
      'adMob',
    ];
    return supportedServices.includes(serviceName);
  }

  async cleanup(): Promise<void> {
    this.serviceCache.clear();
  }
}