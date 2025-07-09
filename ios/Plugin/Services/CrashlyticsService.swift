import Foundation
import Capacitor
import FirebaseCrashlytics

class CrashlyticsService {
    private weak var plugin: CAPPlugin?
    
    init(plugin: CAPPlugin) {
        self.plugin = plugin
    }
    
    func crash(_ call: CAPPluginCall) {
        fatalError("Test Crash - This is a test crash triggered by Firebase Kit")
    }
    
    func forceCrash(_ call: CAPPluginCall) {
        let message = call.getString("message") ?? "Forced crash"
        fatalError(message)
    }
    
    func log(_ call: CAPPluginCall) {
        guard let message = call.getString("message") else {
            call.reject("Message is required")
            return
        }
        
        Crashlytics.crashlytics().log(message)
        call.resolve()
    }
    
    func logException(_ call: CAPPluginCall) {
        guard let message = call.getString("message") else {
            call.reject("Message is required")
            return
        }
        
        let code = call.getString("code") ?? "CUSTOM_ERROR"
        let domain = call.getString("domain") ?? "FirebaseKit"
        
        let userInfo: [String: Any] = [
            NSLocalizedDescriptionKey: message
        ]
        
        let error = NSError(domain: domain, code: code.hashValue, userInfo: userInfo)
        Crashlytics.crashlytics().record(error: error)
        
        call.resolve()
    }
    
    func setUserId(_ call: CAPPluginCall) {
        guard let userId = call.getString("userId") else {
            call.reject("User ID is required")
            return
        }
        
        Crashlytics.crashlytics().setUserID(userId)
        call.resolve()
    }
    
    func setCustomKeys(_ call: CAPPluginCall) {
        guard let attributes = call.getObject("attributes") else {
            call.reject("Attributes are required")
            return
        }
        
        let crashlytics = Crashlytics.crashlytics()
        
        for (key, value) in attributes {
            switch value {
            case let stringValue as String:
                crashlytics.setCustomValue(stringValue, forKey: key)
            case let intValue as Int:
                crashlytics.setCustomValue(intValue, forKey: key)
            case let doubleValue as Double:
                crashlytics.setCustomValue(doubleValue, forKey: key)
            case let boolValue as Bool:
                crashlytics.setCustomValue(boolValue, forKey: key)
            default:
                crashlytics.setCustomValue(String(describing: value), forKey: key)
            }
        }
        
        call.resolve()
    }
    
    func setCrashlyticsCollectionEnabled(_ call: CAPPluginCall) {
        guard let enabled = call.getBool("enabled") else {
            call.reject("Enabled parameter is required")
            return
        }
        
        Crashlytics.crashlytics().setCrashlyticsCollectionEnabled(enabled)
        call.resolve()
    }
    
    func isCrashlyticsCollectionEnabled(_ call: CAPPluginCall) {
        let enabled = Crashlytics.crashlytics().isCrashlyticsCollectionEnabled()
        call.resolve(["enabled": enabled])
    }
    
    func deleteUnsentReports(_ call: CAPPluginCall) {
        Crashlytics.crashlytics().deleteUnsentReports()
        call.resolve()
    }
    
    func sendUnsentReports(_ call: CAPPluginCall) {
        Crashlytics.crashlytics().sendUnsentReports()
        call.resolve()
    }
    
    func recordBreadcrumb(_ call: CAPPluginCall) {
        guard let name = call.getString("name") else {
            call.reject("Name is required")
            return
        }
        
        let params = call.getObject("params")
        let breadcrumb = params != nil ? "\(name): \(params!)" : name
        
        Crashlytics.crashlytics().log(breadcrumb)
        call.resolve()
    }
}