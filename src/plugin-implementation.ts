import { WebPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';
import { FirebaseKitWeb } from './web';

/**
 * Web plugin implementation that routes method calls to appropriate Firebase services.
 * This class acts as a bridge between the Capacitor plugin system and the Firebase Web SDK.
 * 
 * @internal
 * @since 1.0.0
 */
export class FirebaseKitPluginImplementation extends WebPlugin {
  /**
   * Instance of the Firebase Web implementation containing all services.
   * @private
   */
  private implementation: FirebaseKitWeb;

  /**
   * Initialize the plugin implementation with Firebase Web SDK.
   * 
   * @since 1.0.0
   */
  constructor() {
    super();
    this.implementation = new FirebaseKitWeb();
  }

  // Proxy methods to route calls to the appropriate service
  
  // App Check methods
  async appCheckInitialize(options: any): Promise<void> {
    return this.implementation.appCheck.initialize(options);
  }

  async appCheckGetToken(options?: any): Promise<any> {
    return this.implementation.appCheck.getToken(options);
  }

  async appCheckSetTokenAutoRefreshEnabled(options: any): Promise<void> {
    return this.implementation.appCheck.setTokenAutoRefreshEnabled(options);
  }

  async appCheckAddListener(options: any): Promise<PluginListenerHandle> {
    return this.implementation.appCheck.addListener(options.eventName, options.listenerFunc);
  }

  // AdMob methods
  async adMobInitialize(options?: any): Promise<void> {
    return this.implementation.adMob.initialize(options);
  }

  async adMobRequestConsentInfo(options?: any): Promise<any> {
    return this.implementation.adMob.requestConsentInfo(options);
  }

  async adMobShowConsentForm(): Promise<any> {
    return this.implementation.adMob.showConsentForm();
  }

  async adMobResetConsentInfo(): Promise<void> {
    return this.implementation.adMob.resetConsentInfo();
  }

  async adMobSetRequestConfiguration(options: any): Promise<void> {
    return this.implementation.adMob.setRequestConfiguration(options);
  }

  async adMobShowBanner(options: any): Promise<void> {
    return this.implementation.adMob.showBanner(options);
  }

  async adMobHideBanner(): Promise<void> {
    return this.implementation.adMob.hideBanner();
  }

  async adMobRemoveBanner(): Promise<void> {
    return this.implementation.adMob.removeBanner();
  }

  async adMobLoadInterstitial(options: any): Promise<void> {
    return this.implementation.adMob.loadInterstitial(options);
  }

  async adMobShowInterstitial(): Promise<void> {
    return this.implementation.adMob.showInterstitial();
  }

  async adMobLoadRewarded(options: any): Promise<void> {
    return this.implementation.adMob.loadRewarded(options);
  }

  async adMobShowRewarded(): Promise<void> {
    return this.implementation.adMob.showRewarded();
  }

  async adMobLoadRewardedInterstitial(options: any): Promise<void> {
    return this.implementation.adMob.loadRewardedInterstitial(options);
  }

  async adMobShowRewardedInterstitial(): Promise<void> {
    return this.implementation.adMob.showRewardedInterstitial();
  }

  async adMobAddListener(options: any): Promise<PluginListenerHandle> {
    return this.implementation.adMob.addListener(options.eventName, options.listenerFunc);
  }

  // Crashlytics methods
  async crashlyticsCrash(): Promise<void> {
    return this.implementation.crashlytics.crash();
  }

  async crashlyticsForceCrash(options: any): Promise<void> {
    return this.implementation.crashlytics.forceCrash(options);
  }

  async crashlyticsLog(options: any): Promise<void> {
    return this.implementation.crashlytics.log(options);
  }

  async crashlyticsLogException(options: any): Promise<void> {
    return this.implementation.crashlytics.logException(options);
  }

  async crashlyticsSetUserId(options: any): Promise<void> {
    return this.implementation.crashlytics.setUserId(options);
  }

  async crashlyticsSetCustomKeys(options: any): Promise<void> {
    return this.implementation.crashlytics.setCustomKeys(options);
  }

  async crashlyticsSetCrashlyticsCollectionEnabled(options: any): Promise<void> {
    return this.implementation.crashlytics.setCrashlyticsCollectionEnabled(options);
  }

  async crashlyticsIsCrashlyticsCollectionEnabled(): Promise<any> {
    return this.implementation.crashlytics.isCrashlyticsCollectionEnabled();
  }

  async crashlyticsDeleteUnsentReports(): Promise<void> {
    return this.implementation.crashlytics.deleteUnsentReports();
  }

  async crashlyticsSendUnsentReports(): Promise<void> {
    return this.implementation.crashlytics.sendUnsentReports();
  }

  async crashlyticsRecordBreadcrumb(options: any): Promise<void> {
    return this.implementation.crashlytics.recordBreadcrumb(options);
  }

  // Performance methods
  async performanceInitialize(options?: any): Promise<void> {
    return this.implementation.performance.initialize(options);
  }

  async performanceSetPerformanceCollectionEnabled(options: any): Promise<void> {
    return this.implementation.performance.setPerformanceCollectionEnabled(options);
  }

  async performanceIsPerformanceCollectionEnabled(): Promise<any> {
    return this.implementation.performance.isPerformanceCollectionEnabled();
  }

  async performanceStartTrace(options: any): Promise<any> {
    return this.implementation.performance.startTrace(options);
  }

  async performanceStopTrace(options: any): Promise<void> {
    return this.implementation.performance.stopTrace(options);
  }

  async performanceIncrementMetric(options: any): Promise<void> {
    return this.implementation.performance.incrementMetric(options);
  }

  async performanceSetMetric(options: any): Promise<void> {
    return this.implementation.performance.setMetric(options);
  }

  async performanceGetMetric(options: any): Promise<any> {
    return this.implementation.performance.getMetric(options);
  }

  async performancePutAttribute(options: any): Promise<void> {
    return this.implementation.performance.putAttribute(options);
  }

  async performanceGetAttributes(options: any): Promise<any> {
    return this.implementation.performance.getAttributes(options);
  }

  async performanceRemoveAttribute(options: any): Promise<void> {
    return this.implementation.performance.removeAttribute(options);
  }

  async performanceStartScreenTrace(options: any): Promise<any> {
    return this.implementation.performance.startScreenTrace(options);
  }

  async performanceStopScreenTrace(options: any): Promise<void> {
    return this.implementation.performance.stopScreenTrace(options);
  }

  async performanceRecordNetworkRequest(options: any): Promise<void> {
    return this.implementation.performance.recordNetworkRequest(options);
  }

  // Analytics methods
  async analyticsInitialize(options?: any): Promise<void> {
    return this.implementation.analytics.initialize(options);
  }

  async analyticsSetCollectionEnabled(options: any): Promise<void> {
    return this.implementation.analytics.setCollectionEnabled(options);
  }

  async analyticsSetCurrentScreen(options: any): Promise<void> {
    return this.implementation.analytics.setCurrentScreen(options);
  }

  async analyticsLogEvent(options: any): Promise<void> {
    return this.implementation.analytics.logEvent(options);
  }

  async analyticsSetUserProperty(options: any): Promise<void> {
    return this.implementation.analytics.setUserProperty(options);
  }

  async analyticsSetUserId(options: any): Promise<void> {
    return this.implementation.analytics.setUserId(options);
  }

  async analyticsSetSessionTimeoutDuration(options: any): Promise<void> {
    return this.implementation.analytics.setSessionTimeoutDuration(options);
  }

  async analyticsGetAppInstanceId(): Promise<any> {
    return this.implementation.analytics.getAppInstanceId();
  }

  async analyticsResetAnalyticsData(): Promise<void> {
    return this.implementation.analytics.resetAnalyticsData();
  }

  async analyticsSetConsent(options: any): Promise<void> {
    return this.implementation.analytics.setConsent(options);
  }

  async analyticsSetDefaultEventParameters(options: any): Promise<void> {
    return this.implementation.analytics.setDefaultEventParameters(options);
  }

  // Remote Config methods
  async remoteConfigInitialize(options?: any): Promise<void> {
    return this.implementation.remoteConfig.initialize(options);
  }

  async remoteConfigSetDefaults(options: any): Promise<void> {
    return this.implementation.remoteConfig.setDefaults(options);
  }

  async remoteConfigFetch(options?: any): Promise<void> {
    return this.implementation.remoteConfig.fetch(options);
  }

  async remoteConfigActivate(): Promise<any> {
    return this.implementation.remoteConfig.activate();
  }

  async remoteConfigFetchAndActivate(options?: any): Promise<any> {
    return this.implementation.remoteConfig.fetchAndActivate(options);
  }

  async remoteConfigGetValue(options: any): Promise<any> {
    return this.implementation.remoteConfig.getValue(options);
  }

  async remoteConfigGetAll(): Promise<any> {
    return this.implementation.remoteConfig.getAll();
  }

  async remoteConfigGetSettings(): Promise<any> {
    return this.implementation.remoteConfig.getSettings();
  }

  async remoteConfigSetSettings(options: any): Promise<void> {
    return this.implementation.remoteConfig.setSettings(options);
  }

  async remoteConfigEnsureInitialized(): Promise<void> {
    return this.implementation.remoteConfig.ensureInitialized();
  }

  async remoteConfigReset(): Promise<void> {
    return this.implementation.remoteConfig.reset();
  }

  async remoteConfigAddListener(options: any): Promise<PluginListenerHandle> {
    return this.implementation.remoteConfig.addListener(options.eventName, options.listenerFunc);
  }
}