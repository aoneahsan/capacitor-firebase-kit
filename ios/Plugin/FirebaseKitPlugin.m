#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(FirebaseKitPlugin, "FirebaseKit",
    // App Check Methods
    CAP_PLUGIN_METHOD(appCheckInitialize, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(appCheckGetToken, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(appCheckSetTokenAutoRefreshEnabled, CAPPluginReturnPromise);
    
    // AdMob Methods
    CAP_PLUGIN_METHOD(adMobInitialize, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobRequestConsentInfo, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobShowConsentForm, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobResetConsentInfo, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobSetRequestConfiguration, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobShowBanner, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobHideBanner, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobRemoveBanner, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobLoadInterstitial, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobShowInterstitial, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobLoadRewarded, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobShowRewarded, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobLoadRewardedInterstitial, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(adMobShowRewardedInterstitial, CAPPluginReturnPromise);
    
    // Crashlytics Methods
    CAP_PLUGIN_METHOD(crashlyticsCrash, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(crashlyticsForceCrash, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(crashlyticsLog, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(crashlyticsLogException, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(crashlyticsSetUserId, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(crashlyticsSetCustomKeys, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(crashlyticsSetCrashlyticsCollectionEnabled, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(crashlyticsIsCrashlyticsCollectionEnabled, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(crashlyticsDeleteUnsentReports, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(crashlyticsSendUnsentReports, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(crashlyticsRecordBreadcrumb, CAPPluginReturnPromise);
    
    // Performance Methods
    CAP_PLUGIN_METHOD(performanceInitialize, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceSetPerformanceCollectionEnabled, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceIsPerformanceCollectionEnabled, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceStartTrace, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceStopTrace, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceIncrementMetric, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceSetMetric, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceGetMetric, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performancePutAttribute, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceGetAttributes, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceRemoveAttribute, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceStartScreenTrace, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceStopScreenTrace, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(performanceRecordNetworkRequest, CAPPluginReturnPromise);
    
    // Analytics Methods
    CAP_PLUGIN_METHOD(analyticsInitialize, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(analyticsSetCollectionEnabled, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(analyticsSetCurrentScreen, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(analyticsLogEvent, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(analyticsSetUserProperty, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(analyticsSetUserId, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(analyticsSetSessionTimeoutDuration, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(analyticsGetAppInstanceId, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(analyticsResetAnalyticsData, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(analyticsSetConsent, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(analyticsSetDefaultEventParameters, CAPPluginReturnPromise);
    
    // Remote Config Methods
    CAP_PLUGIN_METHOD(remoteConfigInitialize, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(remoteConfigSetDefaults, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(remoteConfigFetch, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(remoteConfigActivate, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(remoteConfigFetchAndActivate, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(remoteConfigGetValue, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(remoteConfigGetAll, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(remoteConfigGetSettings, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(remoteConfigSetSettings, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(remoteConfigEnsureInitialized, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(remoteConfigReset, CAPPluginReturnPromise);
)