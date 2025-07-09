package com.zaions.capacitor.firebasekit

import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.zaions.capacitor.firebasekit.services.*

@CapacitorPlugin(name = "FirebaseKit")
class FirebaseKitPlugin : Plugin() {
    
    private lateinit var appCheckService: AppCheckService
    private lateinit var adMobService: AdMobService
    private lateinit var crashlyticsService: CrashlyticsService
    private lateinit var performanceService: PerformanceService
    private lateinit var analyticsService: AnalyticsService
    private lateinit var remoteConfigService: RemoteConfigService
    
    override fun load() {
        super.load()
        
        // Initialize services
        appCheckService = AppCheckService(this)
        adMobService = AdMobService(this)
        crashlyticsService = CrashlyticsService(this)
        performanceService = PerformanceService(this)
        analyticsService = AnalyticsService(this)
        remoteConfigService = RemoteConfigService(this)
    }
    
    // App Check Methods
    
    @PluginMethod
    fun appCheckInitialize(call: PluginCall) {
        appCheckService.initialize(call)
    }
    
    @PluginMethod
    fun appCheckGetToken(call: PluginCall) {
        appCheckService.getToken(call)
    }
    
    @PluginMethod
    fun appCheckSetTokenAutoRefreshEnabled(call: PluginCall) {
        appCheckService.setTokenAutoRefreshEnabled(call)
    }
    
    // AdMob Methods
    
    @PluginMethod
    fun adMobInitialize(call: PluginCall) {
        adMobService.initialize(call)
    }
    
    @PluginMethod
    fun adMobRequestConsentInfo(call: PluginCall) {
        adMobService.requestConsentInfo(call)
    }
    
    @PluginMethod
    fun adMobShowConsentForm(call: PluginCall) {
        adMobService.showConsentForm(call)
    }
    
    @PluginMethod
    fun adMobResetConsentInfo(call: PluginCall) {
        adMobService.resetConsentInfo(call)
    }
    
    @PluginMethod
    fun adMobSetRequestConfiguration(call: PluginCall) {
        adMobService.setRequestConfiguration(call)
    }
    
    @PluginMethod
    fun adMobShowBanner(call: PluginCall) {
        adMobService.showBanner(call)
    }
    
    @PluginMethod
    fun adMobHideBanner(call: PluginCall) {
        adMobService.hideBanner(call)
    }
    
    @PluginMethod
    fun adMobRemoveBanner(call: PluginCall) {
        adMobService.removeBanner(call)
    }
    
    @PluginMethod
    fun adMobLoadInterstitial(call: PluginCall) {
        adMobService.loadInterstitial(call)
    }
    
    @PluginMethod
    fun adMobShowInterstitial(call: PluginCall) {
        adMobService.showInterstitial(call)
    }
    
    @PluginMethod
    fun adMobLoadRewarded(call: PluginCall) {
        adMobService.loadRewarded(call)
    }
    
    @PluginMethod
    fun adMobShowRewarded(call: PluginCall) {
        adMobService.showRewarded(call)
    }
    
    @PluginMethod
    fun adMobLoadRewardedInterstitial(call: PluginCall) {
        adMobService.loadRewardedInterstitial(call)
    }
    
    @PluginMethod
    fun adMobShowRewardedInterstitial(call: PluginCall) {
        adMobService.showRewardedInterstitial(call)
    }
    
    // Crashlytics Methods
    
    @PluginMethod
    fun crashlyticsCrash(call: PluginCall) {
        crashlyticsService.crash(call)
    }
    
    @PluginMethod
    fun crashlyticsForceCrash(call: PluginCall) {
        crashlyticsService.forceCrash(call)
    }
    
    @PluginMethod
    fun crashlyticsLog(call: PluginCall) {
        crashlyticsService.log(call)
    }
    
    @PluginMethod
    fun crashlyticsLogException(call: PluginCall) {
        crashlyticsService.logException(call)
    }
    
    @PluginMethod
    fun crashlyticsSetUserId(call: PluginCall) {
        crashlyticsService.setUserId(call)
    }
    
    @PluginMethod
    fun crashlyticsSetCustomKeys(call: PluginCall) {
        crashlyticsService.setCustomKeys(call)
    }
    
    @PluginMethod
    fun crashlyticsSetCrashlyticsCollectionEnabled(call: PluginCall) {
        crashlyticsService.setCrashlyticsCollectionEnabled(call)
    }
    
    @PluginMethod
    fun crashlyticsIsCrashlyticsCollectionEnabled(call: PluginCall) {
        crashlyticsService.isCrashlyticsCollectionEnabled(call)
    }
    
    @PluginMethod
    fun crashlyticsDeleteUnsentReports(call: PluginCall) {
        crashlyticsService.deleteUnsentReports(call)
    }
    
    @PluginMethod
    fun crashlyticsSendUnsentReports(call: PluginCall) {
        crashlyticsService.sendUnsentReports(call)
    }
    
    @PluginMethod
    fun crashlyticsRecordBreadcrumb(call: PluginCall) {
        crashlyticsService.recordBreadcrumb(call)
    }
    
    // Performance Methods
    
    @PluginMethod
    fun performanceInitialize(call: PluginCall) {
        performanceService.initialize(call)
    }
    
    @PluginMethod
    fun performanceSetPerformanceCollectionEnabled(call: PluginCall) {
        performanceService.setPerformanceCollectionEnabled(call)
    }
    
    @PluginMethod
    fun performanceIsPerformanceCollectionEnabled(call: PluginCall) {
        performanceService.isPerformanceCollectionEnabled(call)
    }
    
    @PluginMethod
    fun performanceStartTrace(call: PluginCall) {
        performanceService.startTrace(call)
    }
    
    @PluginMethod
    fun performanceStopTrace(call: PluginCall) {
        performanceService.stopTrace(call)
    }
    
    @PluginMethod
    fun performanceIncrementMetric(call: PluginCall) {
        performanceService.incrementMetric(call)
    }
    
    @PluginMethod
    fun performanceSetMetric(call: PluginCall) {
        performanceService.setMetric(call)
    }
    
    @PluginMethod
    fun performanceGetMetric(call: PluginCall) {
        performanceService.getMetric(call)
    }
    
    @PluginMethod
    fun performancePutAttribute(call: PluginCall) {
        performanceService.putAttribute(call)
    }
    
    @PluginMethod
    fun performanceGetAttributes(call: PluginCall) {
        performanceService.getAttributes(call)
    }
    
    @PluginMethod
    fun performanceRemoveAttribute(call: PluginCall) {
        performanceService.removeAttribute(call)
    }
    
    @PluginMethod
    fun performanceStartScreenTrace(call: PluginCall) {
        performanceService.startScreenTrace(call)
    }
    
    @PluginMethod
    fun performanceStopScreenTrace(call: PluginCall) {
        performanceService.stopScreenTrace(call)
    }
    
    @PluginMethod
    fun performanceRecordNetworkRequest(call: PluginCall) {
        performanceService.recordNetworkRequest(call)
    }
    
    // Analytics Methods
    
    @PluginMethod
    fun analyticsInitialize(call: PluginCall) {
        analyticsService.initialize(call)
    }
    
    @PluginMethod
    fun analyticsSetCollectionEnabled(call: PluginCall) {
        analyticsService.setCollectionEnabled(call)
    }
    
    @PluginMethod
    fun analyticsSetCurrentScreen(call: PluginCall) {
        analyticsService.setCurrentScreen(call)
    }
    
    @PluginMethod
    fun analyticsLogEvent(call: PluginCall) {
        analyticsService.logEvent(call)
    }
    
    @PluginMethod
    fun analyticsSetUserProperty(call: PluginCall) {
        analyticsService.setUserProperty(call)
    }
    
    @PluginMethod
    fun analyticsSetUserId(call: PluginCall) {
        analyticsService.setUserId(call)
    }
    
    @PluginMethod
    fun analyticsSetSessionTimeoutDuration(call: PluginCall) {
        analyticsService.setSessionTimeoutDuration(call)
    }
    
    @PluginMethod
    fun analyticsGetAppInstanceId(call: PluginCall) {
        analyticsService.getAppInstanceId(call)
    }
    
    @PluginMethod
    fun analyticsResetAnalyticsData(call: PluginCall) {
        analyticsService.resetAnalyticsData(call)
    }
    
    @PluginMethod
    fun analyticsSetConsent(call: PluginCall) {
        analyticsService.setConsent(call)
    }
    
    @PluginMethod
    fun analyticsSetDefaultEventParameters(call: PluginCall) {
        analyticsService.setDefaultEventParameters(call)
    }
    
    // Remote Config Methods
    
    @PluginMethod
    fun remoteConfigInitialize(call: PluginCall) {
        remoteConfigService.initialize(call)
    }
    
    @PluginMethod
    fun remoteConfigSetDefaults(call: PluginCall) {
        remoteConfigService.setDefaults(call)
    }
    
    @PluginMethod
    fun remoteConfigFetch(call: PluginCall) {
        remoteConfigService.fetch(call)
    }
    
    @PluginMethod
    fun remoteConfigActivate(call: PluginCall) {
        remoteConfigService.activate(call)
    }
    
    @PluginMethod
    fun remoteConfigFetchAndActivate(call: PluginCall) {
        remoteConfigService.fetchAndActivate(call)
    }
    
    @PluginMethod
    fun remoteConfigGetValue(call: PluginCall) {
        remoteConfigService.getValue(call)
    }
    
    @PluginMethod
    fun remoteConfigGetAll(call: PluginCall) {
        remoteConfigService.getAll(call)
    }
    
    @PluginMethod
    fun remoteConfigGetSettings(call: PluginCall) {
        remoteConfigService.getSettings(call)
    }
    
    @PluginMethod
    fun remoteConfigSetSettings(call: PluginCall) {
        remoteConfigService.setSettings(call)
    }
    
    @PluginMethod
    fun remoteConfigEnsureInitialized(call: PluginCall) {
        remoteConfigService.ensureInitialized(call)
    }
    
    @PluginMethod
    fun remoteConfigReset(call: PluginCall) {
        remoteConfigService.reset(call)
    }
}