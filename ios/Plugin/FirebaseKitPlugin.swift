import Foundation
import Capacitor
import Firebase

/**
 * Main plugin implementation for iOS
 */
@objc(FirebaseKitPlugin)
public class FirebaseKitPlugin: CAPPlugin {
    
    // Service instances
    private lazy var appCheckService = AppCheckService(plugin: self)
    private lazy var adMobService = AdMobService(plugin: self)
    private lazy var crashlyticsService = CrashlyticsService(plugin: self)
    private lazy var performanceService = PerformanceService(plugin: self)
    private lazy var analyticsService = AnalyticsService(plugin: self)
    private lazy var remoteConfigService = RemoteConfigService(plugin: self)
    
    public override func load() {
        super.load()
        
        // Configure Firebase if needed
        if FirebaseApp.app() == nil {
            FirebaseApp.configure()
        }
    }
    
    // MARK: - App Check Methods
    
    @objc func appCheckInitialize(_ call: CAPPluginCall) {
        appCheckService.initialize(call)
    }
    
    @objc func appCheckGetToken(_ call: CAPPluginCall) {
        appCheckService.getToken(call)
    }
    
    @objc func appCheckSetTokenAutoRefreshEnabled(_ call: CAPPluginCall) {
        appCheckService.setTokenAutoRefreshEnabled(call)
    }
    
    // MARK: - AdMob Methods
    
    @objc func adMobInitialize(_ call: CAPPluginCall) {
        adMobService.initialize(call)
    }
    
    @objc func adMobRequestConsentInfo(_ call: CAPPluginCall) {
        adMobService.requestConsentInfo(call)
    }
    
    @objc func adMobShowConsentForm(_ call: CAPPluginCall) {
        adMobService.showConsentForm(call)
    }
    
    @objc func adMobResetConsentInfo(_ call: CAPPluginCall) {
        adMobService.resetConsentInfo(call)
    }
    
    @objc func adMobSetRequestConfiguration(_ call: CAPPluginCall) {
        adMobService.setRequestConfiguration(call)
    }
    
    @objc func adMobShowBanner(_ call: CAPPluginCall) {
        adMobService.showBanner(call)
    }
    
    @objc func adMobHideBanner(_ call: CAPPluginCall) {
        adMobService.hideBanner(call)
    }
    
    @objc func adMobRemoveBanner(_ call: CAPPluginCall) {
        adMobService.removeBanner(call)
    }
    
    @objc func adMobLoadInterstitial(_ call: CAPPluginCall) {
        adMobService.loadInterstitial(call)
    }
    
    @objc func adMobShowInterstitial(_ call: CAPPluginCall) {
        adMobService.showInterstitial(call)
    }
    
    @objc func adMobLoadRewarded(_ call: CAPPluginCall) {
        adMobService.loadRewarded(call)
    }
    
    @objc func adMobShowRewarded(_ call: CAPPluginCall) {
        adMobService.showRewarded(call)
    }
    
    @objc func adMobLoadRewardedInterstitial(_ call: CAPPluginCall) {
        adMobService.loadRewardedInterstitial(call)
    }
    
    @objc func adMobShowRewardedInterstitial(_ call: CAPPluginCall) {
        adMobService.showRewardedInterstitial(call)
    }
    
    // MARK: - Crashlytics Methods
    
    @objc func crashlyticsCrash(_ call: CAPPluginCall) {
        crashlyticsService.crash(call)
    }
    
    @objc func crashlyticsForceCrash(_ call: CAPPluginCall) {
        crashlyticsService.forceCrash(call)
    }
    
    @objc func crashlyticsLog(_ call: CAPPluginCall) {
        crashlyticsService.log(call)
    }
    
    @objc func crashlyticsLogException(_ call: CAPPluginCall) {
        crashlyticsService.logException(call)
    }
    
    @objc func crashlyticsSetUserId(_ call: CAPPluginCall) {
        crashlyticsService.setUserId(call)
    }
    
    @objc func crashlyticsSetCustomKeys(_ call: CAPPluginCall) {
        crashlyticsService.setCustomKeys(call)
    }
    
    @objc func crashlyticsSetCrashlyticsCollectionEnabled(_ call: CAPPluginCall) {
        crashlyticsService.setCrashlyticsCollectionEnabled(call)
    }
    
    @objc func crashlyticsIsCrashlyticsCollectionEnabled(_ call: CAPPluginCall) {
        crashlyticsService.isCrashlyticsCollectionEnabled(call)
    }
    
    @objc func crashlyticsDeleteUnsentReports(_ call: CAPPluginCall) {
        crashlyticsService.deleteUnsentReports(call)
    }
    
    @objc func crashlyticsSendUnsentReports(_ call: CAPPluginCall) {
        crashlyticsService.sendUnsentReports(call)
    }
    
    @objc func crashlyticsRecordBreadcrumb(_ call: CAPPluginCall) {
        crashlyticsService.recordBreadcrumb(call)
    }
    
    // MARK: - Performance Methods
    
    @objc func performanceInitialize(_ call: CAPPluginCall) {
        performanceService.initialize(call)
    }
    
    @objc func performanceSetPerformanceCollectionEnabled(_ call: CAPPluginCall) {
        performanceService.setPerformanceCollectionEnabled(call)
    }
    
    @objc func performanceIsPerformanceCollectionEnabled(_ call: CAPPluginCall) {
        performanceService.isPerformanceCollectionEnabled(call)
    }
    
    @objc func performanceStartTrace(_ call: CAPPluginCall) {
        performanceService.startTrace(call)
    }
    
    @objc func performanceStopTrace(_ call: CAPPluginCall) {
        performanceService.stopTrace(call)
    }
    
    @objc func performanceIncrementMetric(_ call: CAPPluginCall) {
        performanceService.incrementMetric(call)
    }
    
    @objc func performanceSetMetric(_ call: CAPPluginCall) {
        performanceService.setMetric(call)
    }
    
    @objc func performanceGetMetric(_ call: CAPPluginCall) {
        performanceService.getMetric(call)
    }
    
    @objc func performancePutAttribute(_ call: CAPPluginCall) {
        performanceService.putAttribute(call)
    }
    
    @objc func performanceGetAttributes(_ call: CAPPluginCall) {
        performanceService.getAttributes(call)
    }
    
    @objc func performanceRemoveAttribute(_ call: CAPPluginCall) {
        performanceService.removeAttribute(call)
    }
    
    @objc func performanceStartScreenTrace(_ call: CAPPluginCall) {
        performanceService.startScreenTrace(call)
    }
    
    @objc func performanceStopScreenTrace(_ call: CAPPluginCall) {
        performanceService.stopScreenTrace(call)
    }
    
    @objc func performanceRecordNetworkRequest(_ call: CAPPluginCall) {
        performanceService.recordNetworkRequest(call)
    }
    
    // MARK: - Analytics Methods
    
    @objc func analyticsInitialize(_ call: CAPPluginCall) {
        analyticsService.initialize(call)
    }
    
    @objc func analyticsSetCollectionEnabled(_ call: CAPPluginCall) {
        analyticsService.setCollectionEnabled(call)
    }
    
    @objc func analyticsSetCurrentScreen(_ call: CAPPluginCall) {
        analyticsService.setCurrentScreen(call)
    }
    
    @objc func analyticsLogEvent(_ call: CAPPluginCall) {
        analyticsService.logEvent(call)
    }
    
    @objc func analyticsSetUserProperty(_ call: CAPPluginCall) {
        analyticsService.setUserProperty(call)
    }
    
    @objc func analyticsSetUserId(_ call: CAPPluginCall) {
        analyticsService.setUserId(call)
    }
    
    @objc func analyticsSetSessionTimeoutDuration(_ call: CAPPluginCall) {
        analyticsService.setSessionTimeoutDuration(call)
    }
    
    @objc func analyticsGetAppInstanceId(_ call: CAPPluginCall) {
        analyticsService.getAppInstanceId(call)
    }
    
    @objc func analyticsResetAnalyticsData(_ call: CAPPluginCall) {
        analyticsService.resetAnalyticsData(call)
    }
    
    @objc func analyticsSetConsent(_ call: CAPPluginCall) {
        analyticsService.setConsent(call)
    }
    
    @objc func analyticsSetDefaultEventParameters(_ call: CAPPluginCall) {
        analyticsService.setDefaultEventParameters(call)
    }
    
    // MARK: - Remote Config Methods
    
    @objc func remoteConfigInitialize(_ call: CAPPluginCall) {
        remoteConfigService.initialize(call)
    }
    
    @objc func remoteConfigSetDefaults(_ call: CAPPluginCall) {
        remoteConfigService.setDefaults(call)
    }
    
    @objc func remoteConfigFetch(_ call: CAPPluginCall) {
        remoteConfigService.fetch(call)
    }
    
    @objc func remoteConfigActivate(_ call: CAPPluginCall) {
        remoteConfigService.activate(call)
    }
    
    @objc func remoteConfigFetchAndActivate(_ call: CAPPluginCall) {
        remoteConfigService.fetchAndActivate(call)
    }
    
    @objc func remoteConfigGetValue(_ call: CAPPluginCall) {
        remoteConfigService.getValue(call)
    }
    
    @objc func remoteConfigGetAll(_ call: CAPPluginCall) {
        remoteConfigService.getAll(call)
    }
    
    @objc func remoteConfigGetSettings(_ call: CAPPluginCall) {
        remoteConfigService.getSettings(call)
    }
    
    @objc func remoteConfigSetSettings(_ call: CAPPluginCall) {
        remoteConfigService.setSettings(call)
    }
    
    @objc func remoteConfigEnsureInitialized(_ call: CAPPluginCall) {
        remoteConfigService.ensureInitialized(call)
    }
    
    @objc func remoteConfigReset(_ call: CAPPluginCall) {
        remoteConfigService.reset(call)
    }
}