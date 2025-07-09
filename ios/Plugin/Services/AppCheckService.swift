import Foundation
import Capacitor
import FirebaseCore
import FirebaseAppCheck

class AppCheckService {
    private weak var plugin: CAPPlugin?
    private var tokenRefreshListener: NSObjectProtocol?
    
    init(plugin: CAPPlugin) {
        self.plugin = plugin
    }
    
    func initialize(_ call: CAPPluginCall) {
        guard let provider = call.getString("provider") else {
            call.reject("Provider is required")
            return
        }
        
        let debugToken = call.getString("debugToken")
        let isTokenAutoRefreshEnabled = call.getBool("isTokenAutoRefreshEnabled", true)
        
        // Configure the provider factory
        switch provider {
        case "deviceCheck":
            #if !targetEnvironment(simulator)
            let providerFactory = DeviceCheckProviderFactory()
            AppCheck.setAppCheckProviderFactory(providerFactory)
            #else
            call.reject("DeviceCheck is not available on simulator")
            return
            #endif
            
        case "appAttest":
            if #available(iOS 14.0, *) {
                let providerFactory = AppAttestProviderFactory()
                AppCheck.setAppCheckProviderFactory(providerFactory)
            } else {
                call.reject("App Attest requires iOS 14.0 or later")
                return
            }
            
        case "debug":
            let providerFactory = DebugAppCheckProviderFactory()
            AppCheck.setAppCheckProviderFactory(providerFactory)
            
            if let debugToken = debugToken {
                UserDefaults.standard.set(debugToken, forKey: "FIRAppCheckDebugToken")
            }
            
        default:
            call.reject("Unsupported provider: \(provider)")
            return
        }
        
        // Get shared instance and configure
        let appCheck = AppCheck.appCheck()
        appCheck.isTokenAutoRefreshEnabled = isTokenAutoRefreshEnabled
        
        // Set up token refresh listener
        setupTokenRefreshListener()
        
        call.resolve()
    }
    
    func getToken(_ call: CAPPluginCall) {
        let forceRefresh = call.getBool("forceRefresh", false)
        
        AppCheck.appCheck().token(forcingRefresh: forceRefresh) { token, error in
            if let error = error {
                call.reject("Failed to get App Check token", nil, error)
                return
            }
            
            guard let token = token else {
                call.reject("No token received")
                return
            }
            
            call.resolve([
                "token": token.token,
                "expireTimeMillis": Int(token.expirationDate.timeIntervalSince1970 * 1000)
            ])
        }
    }
    
    func setTokenAutoRefreshEnabled(_ call: CAPPluginCall) {
        guard let enabled = call.getBool("enabled") else {
            call.reject("enabled parameter is required")
            return
        }
        
        AppCheck.appCheck().isTokenAutoRefreshEnabled = enabled
        call.resolve()
    }
    
    private func setupTokenRefreshListener() {
        tokenRefreshListener = NotificationCenter.default.addObserver(
            forName: .AppCheckAppCheckTokenDidChange,
            object: nil,
            queue: .main
        ) { [weak self] notification in
            if let token = notification.userInfo?[kFIRAppCheckTokenNotificationKey] as? AppCheckToken {
                self?.plugin?.notifyListeners("appCheckTokenChanged", data: [
                    "token": token.token,
                    "expireTimeMillis": Int(token.expirationDate.timeIntervalSince1970 * 1000)
                ])
            }
        }
    }
    
    deinit {
        if let listener = tokenRefreshListener {
            NotificationCenter.default.removeObserver(listener)
        }
    }
}