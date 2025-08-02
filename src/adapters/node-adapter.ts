import { PlatformAdapter } from '../core/platform-adapter';
import type { FirebaseKitConfig } from '../core/types';

export class NodeAdapter extends PlatformAdapter {
  private adminApp: any = null;

  async initialize(config: FirebaseKitConfig): Promise<void> {
    this.validateConfig(config);
    this.config = config;

    try {
      const admin = await import('firebase-admin');

      if (!admin.apps.length) {
        this.adminApp = admin.initializeApp({
          projectId: config.projectId,
          // Additional admin SDK config can be added here
        });
      } else {
        this.adminApp = admin.apps[0];
      }
    } catch {
      console.warn('Firebase Admin SDK not found. Limited functionality available.');
    }
  }

  async getService<T>(serviceName: string): Promise<T> {
    if (!this.isSupported(serviceName)) {
      throw new Error(`Service ${serviceName} is not supported on Node.js platform`);
    }

    if (this.serviceCache.has(serviceName)) {
      return this.serviceCache.get(serviceName) as T;
    }

    const service = await this.loadServiceModule(serviceName);
    this.serviceCache.set(serviceName, service);
    return service as T;
  }

  protected async loadServiceModule(serviceName: string): Promise<any> {
    // Most Firebase services are not available in Node.js
    // Return stubs that log warnings
    switch (serviceName) {
      case 'analytics':
        return this.createAnalyticsStub();
      case 'appCheck':
        return this.createAppCheckStub();
      case 'crashlytics':
        return this.createCrashlyticsStub();
      case 'performance':
        return this.createPerformanceStub();
      case 'remoteConfig':
        return this.createRemoteConfigStub();
      case 'adMob':
        return this.createAdMobStub();
      default:
        throw new Error(`Unknown service: ${serviceName}`);
    }
  }

  private createAnalyticsStub() {
    const warn = (method: string) =>
      console.warn(`Analytics.${method}() is not supported in Node.js environment`);

    return {
      logEvent: async () => warn('logEvent'),
      setUserId: async () => warn('setUserId'),
      setUserProperties: async () => warn('setUserProperties'),
      setCurrentScreen: async () => warn('setCurrentScreen'),
      setEnabled: async () => warn('setEnabled'),
      isSupported: async () => ({ isSupported: false }),
    };
  }

  private createAppCheckStub() {
    const warn = (method: string) =>
      console.warn(`AppCheck.${method}() is not supported in Node.js environment`);

    return {
      initialize: async () => warn('initialize'),
      getToken: async () => {
        warn('getToken');
        return { token: '' };
      },
      setTokenAutoRefreshEnabled: async () => warn('setTokenAutoRefreshEnabled'),
    };
  }

  private createCrashlyticsStub() {
    const warn = (method: string) =>
      console.warn(`Crashlytics.${method}() is not supported in Node.js environment`);

    return {
      crash: async () => warn('crash'),
      setUserId: async () => warn('setUserId'),
      log: async () => warn('log'),
      setEnabled: async () => warn('setEnabled'),
      isEnabled: async () => ({ isEnabled: false }),
      recordException: async () => warn('recordException'),
      setCustomKey: async () => warn('setCustomKey'),
      setCustomKeys: async () => warn('setCustomKeys'),
    };
  }

  private createPerformanceStub() {
    const warn = (method: string) =>
      console.warn(`Performance.${method}() is not supported in Node.js environment`);

    return {
      startTrace: async () => {
        warn('startTrace');
        return { traceName: '', traceId: '' };
      },
      stopTrace: async () => warn('stopTrace'),
      incrementMetric: async () => warn('incrementMetric'),
      setEnabled: async () => warn('setEnabled'),
      isEnabled: async () => ({ isEnabled: false }),
    };
  }

  private createRemoteConfigStub() {
    const warn = (method: string) =>
      console.warn(`RemoteConfig.${method}() is not supported in Node.js environment`);

    return {
      initialize: async () => warn('initialize'),
      fetchAndActivate: async () => {
        warn('fetchAndActivate');
        return { activated: false };
      },
      fetchConfig: async () => warn('fetchConfig'),
      activate: async () => {
        warn('activate');
        return { activated: false };
      },
      getValue: async () => {
        warn('getValue');
        return { value: '', source: 'default' };
      },
      getString: async () => {
        warn('getString');
        return { value: '' };
      },
      getNumber: async () => {
        warn('getNumber');
        return { value: 0 };
      },
      getBoolean: async () => {
        warn('getBoolean');
        return { value: false };
      },
      setLogLevel: async () => warn('setLogLevel'),
    };
  }

  private createAdMobStub() {
    const warn = (method: string) =>
      console.warn(`AdMob.${method}() is not supported in Node.js environment`);

    return {
      initialize: async () => warn('initialize'),
      showBanner: async () => warn('showBanner'),
      hideBanner: async () => warn('hideBanner'),
      resumeBanner: async () => warn('resumeBanner'),
      removeBanner: async () => warn('removeBanner'),
      prepareInterstitial: async () => warn('prepareInterstitial'),
      showInterstitial: async () => warn('showInterstitial'),
      prepareRewardVideoAd: async () => warn('prepareRewardVideoAd'),
      showRewardVideoAd: async () => warn('showRewardVideoAd'),
      setApplicationMuted: async () => warn('setApplicationMuted'),
      setApplicationVolume: async () => warn('setApplicationVolume'),
    };
  }

  isSupported(serviceName: string): boolean {
    // All services return stubs in Node.js
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
    if (this.adminApp) {
      try {
        await this.adminApp.delete();
      } catch {
        console.warn('Error cleaning up Firebase Admin app');
      }
    }
    this.adminApp = null;
  }
}