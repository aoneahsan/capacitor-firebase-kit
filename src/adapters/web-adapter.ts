import { PlatformAdapter } from '../core/platform-adapter';
import type { FirebaseKitConfig } from '../core/types';

export class WebAdapter extends PlatformAdapter {
  private firebaseApp: any = null;
  private loadedSDKs: Set<string> = new Set();

  async initialize(config: FirebaseKitConfig): Promise<void> {
    this.validateConfig(config);
    this.config = config;

    // Dynamically import Firebase app
    if (!this.firebaseApp) {
      try {
        const firebaseApp = await import('firebase/app');
        const { initializeApp, getApps } = firebaseApp;

        // Check if app is already initialized
        const apps = getApps();
        if (apps.length > 0) {
          this.firebaseApp = apps[0];
        } else {
          this.firebaseApp = initializeApp(config);
        }
      } catch {
        console.warn('Firebase SDK not found. Services will load on demand.');
      }
    }
  }

  async getService<T>(serviceName: string): Promise<T> {
    if (!this.isSupported(serviceName)) {
      throw new Error(`Service ${serviceName} is not supported on web platform`);
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
      case 'performance':
        return this.loadPerformance();
      case 'remoteConfig':
        return this.loadRemoteConfig();
      case 'crashlytics':
        // Crashlytics is not available for web, return a mock
        return this.createCrashlyticsStub();
      case 'adMob':
        // AdMob is not available for web, return a mock
        return this.createAdMobStub();
      default:
        throw new Error(`Unknown service: ${serviceName}`);
    }
  }

  private async loadAnalytics() {
    try {
      const analyticsModule = await import('firebase/analytics');
      const { getAnalytics, logEvent, setUserId, setUserProperties, setCurrentScreen } = analyticsModule;

      if (!this.firebaseApp) {
        throw new Error('Firebase app not initialized. Please install firebase package.');
      }

      const analytics = getAnalytics(this.firebaseApp);

      return {
        logEvent: (eventName: string, eventParams?: any) => logEvent(analytics, eventName, eventParams),
        setUserId: (userId: string) => setUserId(analytics, userId),
        setUserProperties: (properties: any) => setUserProperties(analytics, properties),
        setCurrentScreen: (screenName: string) => setCurrentScreen(analytics, screenName),
        setEnabled: async (_enabled: boolean) => {
          console.warn('Analytics.setEnabled is not supported on web');
        },
        isSupported: async () => ({ isSupported: true }),
      };
    } catch {
      throw new Error('Firebase Analytics SDK not installed. Run: npm install firebase');
    }
  }

  private async loadAppCheck() {
    try {
      const appCheckModule = await import('firebase/app-check');
      const { initializeAppCheck, getToken, ReCaptchaV3Provider, ReCaptchaEnterpriseProvider } = appCheckModule;

      if (!this.firebaseApp) {
        throw new Error('Firebase app not initialized. Please install firebase package.');
      }

      let appCheck: any;

      return {
        initialize: async (options: any) => {
          let provider;

          if (options.provider === 'recaptcha-v3' && options.siteKey) {
            provider = new ReCaptchaV3Provider(options.siteKey);
          } else if (options.provider === 'recaptcha-enterprise' && options.siteKey) {
            provider = new ReCaptchaEnterpriseProvider(options.siteKey);
          } else {
            throw new Error('Invalid App Check provider configuration');
          }

          appCheck = initializeAppCheck(this.firebaseApp, {
            provider,
            isTokenAutoRefreshEnabled: options.isTokenAutoRefreshEnabled ?? true,
          });
        },
        getToken: async (forceRefresh?: boolean) => {
          if (!appCheck) {
            throw new Error('App Check not initialized');
          }
          const result = await getToken(appCheck, forceRefresh);
          return { token: result.token };
        },
        setTokenAutoRefreshEnabled: async (_enabled: boolean) => {
          console.warn('setTokenAutoRefreshEnabled must be set during initialization');
        },
      };
    } catch {
      throw new Error('Firebase App Check SDK not installed. Run: npm install firebase');
    }
  }

  private async loadPerformance() {
    try {
      const perfModule = await import('firebase/performance');
      const { getPerformance, trace } = perfModule;

      if (!this.firebaseApp) {
        throw new Error('Firebase app not initialized. Please install firebase package.');
      }

      const perf = getPerformance(this.firebaseApp);

      return {
        startTrace: async (traceName: string) => {
          const t = trace(perf, traceName);
          t.start();
          return { traceName, traceId: traceName };
        },
        stopTrace: async (_traceName: string) => {
          // Note: Firebase web SDK doesn't provide a way to get existing traces
          console.warn('Trace stopping not supported in web SDK. Traces auto-complete.');
        },
        incrementMetric: async (_traceName: string, _metricName: string, _value: number) => {
          console.warn('Metric increment not supported in web SDK after trace starts.');
        },
        setEnabled: async (_enabled: boolean) => {
          console.warn('Performance.setEnabled is not supported on web');
        },
        isEnabled: async () => ({ isEnabled: true }),
      };
    } catch {
      throw new Error('Firebase Performance SDK not installed. Run: npm install firebase');
    }
  }

  private async loadRemoteConfig() {
    try {
      const remoteConfigModule = await import('firebase/remote-config');
      const { getRemoteConfig, fetchAndActivate, getValue, getString, getNumber, getBoolean, setLogLevel } = remoteConfigModule;

      if (!this.firebaseApp) {
        throw new Error('Firebase app not initialized. Please install firebase package.');
      }

      const remoteConfig = getRemoteConfig(this.firebaseApp);

      return {
        initialize: async (options: any) => {
          remoteConfig.settings.minimumFetchIntervalMillis = options.minimumFetchIntervalMillis ?? 43200000;
          remoteConfig.settings.fetchTimeoutMillis = options.fetchTimeoutMillis ?? 60000;

          if (options.defaultConfig) {
            remoteConfig.defaultConfig = options.defaultConfig;
          }
        },
        fetchAndActivate: async () => {
          const activated = await fetchAndActivate(remoteConfig);
          return { activated };
        },
        fetchConfig: async () => {
          await remoteConfig.fetch();
        },
        activate: async () => {
          const activated = await remoteConfig.activate();
          return { activated };
        },
        getValue: async (key: string) => {
          const value = getValue(remoteConfig, key);
          return {
            value: value.asString(),
            source: value.getSource(),
          };
        },
        getString: async (key: string) => {
          return { value: getString(remoteConfig, key) };
        },
        getNumber: async (key: string) => {
          return { value: getNumber(remoteConfig, key) };
        },
        getBoolean: async (key: string) => {
          return { value: getBoolean(remoteConfig, key) };
        },
        setLogLevel: async (logLevel: string) => {
          setLogLevel(remoteConfig, logLevel as any);
        },
      };
    } catch {
      throw new Error('Firebase Remote Config SDK not installed. Run: npm install firebase');
    }
  }

  private createCrashlyticsStub() {
    console.warn('Crashlytics is not supported on web platform');
    return {
      crash: async () => console.warn('Crashlytics.crash() not supported on web'),
      setUserId: async (_userId: string) => console.warn('Crashlytics.setUserId() not supported on web'),
      log: async (_message: string) => console.warn('Crashlytics.log() not supported on web'),
      setEnabled: async (_enabled: boolean) => console.warn('Crashlytics.setEnabled() not supported on web'),
      isEnabled: async () => ({ isEnabled: false }),
      recordException: async (_error: any) => console.warn('Crashlytics.recordException() not supported on web'),
      setCustomKey: async (_key: string, _value: any) => console.warn('Crashlytics.setCustomKey() not supported on web'),
      setCustomKeys: async (_keys: any) => console.warn('Crashlytics.setCustomKeys() not supported on web'),
    };
  }

  private createAdMobStub() {
    console.warn('AdMob is not supported on web platform');
    return {
      initialize: async () => console.warn('AdMob.initialize() not supported on web'),
      showBanner: async () => console.warn('AdMob.showBanner() not supported on web'),
      hideBanner: async () => console.warn('AdMob.hideBanner() not supported on web'),
      resumeBanner: async () => console.warn('AdMob.resumeBanner() not supported on web'),
      removeBanner: async () => console.warn('AdMob.removeBanner() not supported on web'),
      prepareInterstitial: async () => console.warn('AdMob.prepareInterstitial() not supported on web'),
      showInterstitial: async () => console.warn('AdMob.showInterstitial() not supported on web'),
      prepareRewardVideoAd: async () => console.warn('AdMob.prepareRewardVideoAd() not supported on web'),
      showRewardVideoAd: async () => console.warn('AdMob.showRewardVideoAd() not supported on web'),
      setApplicationMuted: async () => console.warn('AdMob.setApplicationMuted() not supported on web'),
      setApplicationVolume: async () => console.warn('AdMob.setApplicationVolume() not supported on web'),
    };
  }

  isSupported(serviceName: string): boolean {
    const supportedServices = [
      'analytics',
      'appCheck',
      'performance',
      'remoteConfig',
      'crashlytics', // Returns stub
      'adMob', // Returns stub
    ];
    return supportedServices.includes(serviceName);
  }

  async cleanup(): Promise<void> {
    this.serviceCache.clear();
    this.firebaseApp = null;
    this.loadedSDKs.clear();
  }
}