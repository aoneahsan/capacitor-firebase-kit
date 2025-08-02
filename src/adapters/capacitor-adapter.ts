import { PlatformAdapter } from '../core/platform-adapter';
import type { FirebaseKitConfig } from '../core/types';
import type { CapacitorFirebaseKitPlugin } from '../definitions';

export class CapacitorAdapter extends PlatformAdapter {
  private capacitorPlugin: any = null;

  async initialize(config: FirebaseKitConfig): Promise<void> {
    this.validateConfig(config);
    this.config = config;

    try {
      // Dynamically import Capacitor core
      const { registerPlugin } = await import('@capacitor/core');

      // Import and register the plugin
      this.capacitorPlugin = registerPlugin<CapacitorFirebaseKitPlugin>('CapacitorFirebaseKit', {
        web: async () => {
          const { FirebaseKitPluginImplementation } = await import('../plugin-implementation');
          return new FirebaseKitPluginImplementation();
        },
      });
    } catch {
      throw new Error('Capacitor not found. Please install @capacitor/core to use Capacitor adapter.');
    }
  }

  async getService<T>(serviceName: string): Promise<T> {
    if (!this.isSupported(serviceName)) {
      throw new Error(`Service ${serviceName} is not supported on Capacitor platform`);
    }

    if (this.serviceCache.has(serviceName)) {
      return this.serviceCache.get(serviceName) as T;
    }

    const service = await this.loadServiceModule(serviceName);
    this.serviceCache.set(serviceName, service);
    return service as T;
  }

  protected async loadServiceModule(serviceName: string): Promise<any> {
    if (!this.capacitorPlugin) {
      throw new Error('Capacitor plugin not initialized');
    }

    // Create service wrapper that delegates to the Capacitor plugin
    switch (serviceName) {
      case 'analytics':
        return this.createAnalyticsService();
      case 'appCheck':
        return this.createAppCheckService();
      case 'adMob':
        return this.createAdMobService();
      case 'crashlytics':
        return this.createCrashlyticsService();
      case 'performance':
        return this.createPerformanceService();
      case 'remoteConfig':
        return this.createRemoteConfigService();
      default:
        throw new Error(`Unknown service: ${serviceName}`);
    }
  }

  private createAnalyticsService() {
    const plugin = this.capacitorPlugin;
    return {
      logEvent: (eventName: string, eventParams?: any) =>
        plugin.analyticsLogEvent({ eventName, eventParams }),
      setUserId: (userId: string) =>
        plugin.analyticsSetUserId({ userId }),
      setUserProperties: (properties: any) =>
        plugin.analyticsSetUserProperties({ properties }),
      setCurrentScreen: (screenName: string, screenClassOverride?: string) =>
        plugin.analyticsSetCurrentScreen({ screenName, screenClassOverride }),
      setEnabled: (enabled: boolean) =>
        plugin.analyticsSetEnabled({ enabled }),
      isSupported: () =>
        plugin.analyticsIsSupported(),
    };
  }

  private createAppCheckService() {
    const plugin = this.capacitorPlugin;
    return {
      initialize: (options: any) =>
        plugin.appCheckInitialize(options),
      getToken: (forceRefresh?: boolean) =>
        plugin.appCheckGetToken({ forceRefresh }),
      setTokenAutoRefreshEnabled: (enabled: boolean) =>
        plugin.appCheckSetTokenAutoRefreshEnabled({ enabled }),
    };
  }

  private createAdMobService() {
    const plugin = this.capacitorPlugin;
    return {
      initialize: (options?: any) =>
        plugin.adMobInitialize(options || {}),
      showBanner: (options: any) =>
        plugin.adMobShowBanner(options),
      hideBanner: () =>
        plugin.adMobHideBanner(),
      resumeBanner: () =>
        plugin.adMobResumeBanner(),
      removeBanner: () =>
        plugin.adMobRemoveBanner(),
      prepareInterstitial: (options: any) =>
        plugin.adMobPrepareInterstitial(options),
      showInterstitial: () =>
        plugin.adMobShowInterstitial(),
      prepareRewardVideoAd: (options: any) =>
        plugin.adMobPrepareRewardVideoAd(options),
      showRewardVideoAd: () =>
        plugin.adMobShowRewardVideoAd(),
      setApplicationMuted: (muted: boolean) =>
        plugin.adMobSetApplicationMuted({ muted }),
      setApplicationVolume: (volume: number) =>
        plugin.adMobSetApplicationVolume({ volume }),
    };
  }

  private createCrashlyticsService() {
    const plugin = this.capacitorPlugin;
    return {
      crash: () =>
        plugin.crashlyticsCrash(),
      setUserId: (userId: string) =>
        plugin.crashlyticsSetUserId({ userId }),
      log: (message: string) =>
        plugin.crashlyticsLog({ message }),
      setEnabled: (enabled: boolean) =>
        plugin.crashlyticsSetEnabled({ enabled }),
      isEnabled: () =>
        plugin.crashlyticsIsEnabled(),
      recordException: (error: any) =>
        plugin.crashlyticsRecordException({
          message: error.message || 'Unknown error',
          stacktrace: error.stack || '',
        }),
      setCustomKey: (key: string, value: any) =>
        plugin.crashlyticsSetCustomKey({ key, value }),
      setCustomKeys: (customKeys: any) =>
        plugin.crashlyticsSetCustomKeys({ customKeys }),
    };
  }

  private createPerformanceService() {
    const plugin = this.capacitorPlugin;
    return {
      startTrace: (traceName: string) =>
        plugin.performanceStartTrace({ traceName }),
      stopTrace: (traceName: string) =>
        plugin.performanceStopTrace({ traceName }),
      incrementMetric: (traceName: string, metricName: string, value: number) =>
        plugin.performanceIncrementMetric({ traceName, metricName, value }),
      setEnabled: (enabled: boolean) =>
        plugin.performanceSetEnabled({ enabled }),
      isEnabled: () =>
        plugin.performanceIsEnabled(),
    };
  }

  private createRemoteConfigService() {
    const plugin = this.capacitorPlugin;
    return {
      initialize: (options: any) =>
        plugin.remoteConfigInitialize(options),
      fetchAndActivate: () =>
        plugin.remoteConfigFetchAndActivate(),
      fetchConfig: () =>
        plugin.remoteConfigFetchConfig(),
      activate: () =>
        plugin.remoteConfigActivate(),
      getValue: (key: string) =>
        plugin.remoteConfigGetValue({ key }),
      getString: (key: string) =>
        plugin.remoteConfigGetString({ key }),
      getNumber: (key: string) =>
        plugin.remoteConfigGetNumber({ key }),
      getBoolean: (key: string) =>
        plugin.remoteConfigGetBoolean({ key }),
      setLogLevel: (logLevel: string) =>
        plugin.remoteConfigSetLogLevel({ logLevel }),
    };
  }

  isSupported(serviceName: string): boolean {
    const supportedServices = [
      'analytics',
      'appCheck',
      'adMob',
      'crashlytics',
      'performance',
      'remoteConfig',
    ];
    return supportedServices.includes(serviceName);
  }

  async cleanup(): Promise<void> {
    this.serviceCache.clear();
    this.capacitorPlugin = null;
  }
}