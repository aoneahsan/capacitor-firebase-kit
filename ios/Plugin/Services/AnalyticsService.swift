import Foundation
import Capacitor
import FirebaseAnalytics

class AnalyticsService {
    private weak var plugin: CAPPlugin?
    
    init(plugin: CAPPlugin) {
        self.plugin = plugin
    }
    
    func initialize(_ call: CAPPluginCall) {
        let collectionEnabled = call.getBool("collectionEnabled", true)
        Analytics.setAnalyticsCollectionEnabled(collectionEnabled)
        
        if let sessionTimeout = call.getInt("sessionTimeoutDuration") {
            Analytics.setSessionTimeoutInterval(TimeInterval(sessionTimeout))
        }
        
        call.resolve()
    }
    
    func setCollectionEnabled(_ call: CAPPluginCall) {
        guard let enabled = call.getBool("enabled") else {
            call.reject("Enabled parameter is required")
            return
        }
        
        Analytics.setAnalyticsCollectionEnabled(enabled)
        call.resolve()
    }
    
    func setCurrentScreen(_ call: CAPPluginCall) {
        guard let screenName = call.getString("screenName") else {
            call.reject("Screen name is required")
            return
        }
        
        let screenClass = call.getString("screenClass")
        
        DispatchQueue.main.async {
            Analytics.logEvent(AnalyticsEventScreenView, parameters: [
                AnalyticsParameterScreenName: screenName,
                AnalyticsParameterScreenClass: screenClass ?? ""
            ])
            call.resolve()
        }
    }
    
    func logEvent(_ call: CAPPluginCall) {
        guard let name = call.getString("name") else {
            call.reject("Event name is required")
            return
        }
        
        let params = call.getObject("params")
        Analytics.logEvent(name, parameters: params)
        call.resolve()
    }
    
    func setUserProperty(_ call: CAPPluginCall) {
        guard let key = call.getString("key"),
              let value = call.getString("value") else {
            call.reject("Key and value are required")
            return
        }
        
        Analytics.setUserProperty(value, forName: key)
        call.resolve()
    }
    
    func setUserId(_ call: CAPPluginCall) {
        let userId = call.getString("userId")
        Analytics.setUserID(userId)
        call.resolve()
    }
    
    func setSessionTimeoutDuration(_ call: CAPPluginCall) {
        guard let duration = call.getInt("duration") else {
            call.reject("Duration is required")
            return
        }
        
        Analytics.setSessionTimeoutInterval(TimeInterval(duration))
        call.resolve()
    }
    
    func getAppInstanceId(_ call: CAPPluginCall) {
        let appInstanceId = Analytics.appInstanceID() ?? ""
        call.resolve(["appInstanceId": appInstanceId])
    }
    
    func resetAnalyticsData(_ call: CAPPluginCall) {
        Analytics.resetAnalyticsData()
        call.resolve()
    }
    
    func setConsent(_ call: CAPPluginCall) {
        guard let consentSettings = call.getObject("consent") else {
            call.reject("Consent settings are required")
            return
        }
        
        var consentDict: [ConsentType: ConsentStatus] = [:]
        
        if let analyticsStorage = consentSettings["analyticsStorage"] as? String {
            consentDict[.analyticsStorage] = analyticsStorage == "granted" ? .granted : .denied
        }
        
        if let adStorage = consentSettings["adStorage"] as? String {
            consentDict[.adStorage] = adStorage == "granted" ? .granted : .denied
        }
        
        if let adUserData = consentSettings["adUserData"] as? String {
            consentDict[.adUserData] = adUserData == "granted" ? .granted : .denied
        }
        
        if let adPersonalization = consentSettings["adPersonalization"] as? String {
            consentDict[.adPersonalization] = adPersonalization == "granted" ? .granted : .denied
        }
        
        Analytics.setConsent(consentDict)
        call.resolve()
    }
    
    func setDefaultEventParameters(_ call: CAPPluginCall) {
        let params = call.getObject("params")
        Analytics.setDefaultEventParameters(params)
        call.resolve()
    }
}