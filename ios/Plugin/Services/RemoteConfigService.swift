import Foundation
import Capacitor
import FirebaseRemoteConfig

class RemoteConfigService {
    private weak var plugin: CAPPlugin?
    private var configUpdateListener: ConfigUpdateListenerRegistration?
    
    init(plugin: CAPPlugin) {
        self.plugin = plugin
    }
    
    func initialize(_ call: CAPPluginCall) {
        let minimumFetchInterval = call.getInt("minimumFetchIntervalInSeconds", 43200)
        let fetchTimeout = call.getInt("fetchTimeoutInSeconds", 60)
        
        let settings = RemoteConfigSettings()
        settings.minimumFetchInterval = TimeInterval(minimumFetchInterval)
        settings.fetchTimeout = TimeInterval(fetchTimeout)
        
        RemoteConfig.remoteConfig().configSettings = settings
        call.resolve()
    }
    
    func setDefaults(_ call: CAPPluginCall) {
        guard let defaults = call.getObject("defaults") else {
            call.reject("Defaults are required")
            return
        }
        
        RemoteConfig.remoteConfig().setDefaults(defaults)
        call.resolve()
    }
    
    func fetch(_ call: CAPPluginCall) {
        let completionHandler: (RemoteConfigFetchStatus, Error?) -> Void = { status, error in
            if let error = error {
                call.reject("Failed to fetch config", nil, error)
                return
            }
            
            call.resolve()
        }
        
        if let minimumFetchInterval = call.getInt("minimumFetchIntervalInSeconds") {
            RemoteConfig.remoteConfig().fetch(withExpirationDuration: TimeInterval(minimumFetchInterval), completionHandler: completionHandler)
        } else {
            RemoteConfig.remoteConfig().fetch(completionHandler: completionHandler)
        }
    }
    
    func activate(_ call: CAPPluginCall) {
        RemoteConfig.remoteConfig().activate { changed, error in
            if let error = error {
                call.reject("Failed to activate config", nil, error)
                return
            }
            
            call.resolve(["activated": changed])
        }
    }
    
    func fetchAndActivate(_ call: CAPPluginCall) {
        let completionHandler: (RemoteConfigFetchAndActivateStatus, Error?) -> Void = { status, error in
            if let error = error {
                call.reject("Failed to fetch and activate config", nil, error)
                return
            }
            
            let activated = status == .successFetchedFromRemote || status == .successUsingPreFetchedData
            call.resolve(["activated": activated])
        }
        
        RemoteConfig.remoteConfig().fetchAndActivate(completionHandler: completionHandler)
    }
    
    func getValue(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("Key is required")
            return
        }
        
        let configValue = RemoteConfig.remoteConfig().configValue(forKey: key)
        
        call.resolve([
            "asString": configValue.stringValue ?? "",
            "asNumber": configValue.numberValue.doubleValue,
            "asBoolean": configValue.boolValue,
            "source": sourceToString(configValue.source)
        ])
    }
    
    func getAll(_ call: CAPPluginCall) {
        let allKeys = RemoteConfig.remoteConfig().allKeys(from: .default)
            .union(RemoteConfig.remoteConfig().allKeys(from: .remote))
        
        var values: [String: Any] = [:]
        
        for key in allKeys {
            let configValue = RemoteConfig.remoteConfig().configValue(forKey: key)
            values[key] = [
                "asString": configValue.stringValue ?? "",
                "asNumber": configValue.numberValue.doubleValue,
                "asBoolean": configValue.boolValue,
                "source": sourceToString(configValue.source)
            ]
        }
        
        call.resolve(["values": values])
    }
    
    func getSettings(_ call: CAPPluginCall) {
        let settings = RemoteConfig.remoteConfig().configSettings
        
        call.resolve([
            "minimumFetchIntervalInSeconds": Int(settings.minimumFetchInterval),
            "fetchTimeoutInSeconds": Int(settings.fetchTimeout)
        ])
    }
    
    func setSettings(_ call: CAPPluginCall) {
        guard let minimumFetchInterval = call.getInt("minimumFetchIntervalInSeconds"),
              let fetchTimeout = call.getInt("fetchTimeoutInSeconds") else {
            call.reject("minimumFetchIntervalInSeconds and fetchTimeoutInSeconds are required")
            return
        }
        
        let settings = RemoteConfigSettings()
        settings.minimumFetchInterval = TimeInterval(minimumFetchInterval)
        settings.fetchTimeout = TimeInterval(fetchTimeout)
        
        RemoteConfig.remoteConfig().configSettings = settings
        call.resolve()
    }
    
    func ensureInitialized(_ call: CAPPluginCall) {
        RemoteConfig.remoteConfig().ensureInitialized { error in
            if let error = error {
                call.reject("Failed to ensure initialization", nil, error)
                return
            }
            
            call.resolve()
        }
    }
    
    func reset(_ call: CAPPluginCall) {
        // Note: Firebase iOS SDK doesn't have a direct reset method
        // Clear defaults as a workaround
        RemoteConfig.remoteConfig().setDefaults([:])
        call.resolve()
    }
    
    func startListeningForUpdates() {
        configUpdateListener = RemoteConfig.remoteConfig().addOnConfigUpdateListener { [weak self] configUpdate, error in
            if let error = error {
                print("Error listening for config updates: \(error)")
                return
            }
            
            guard let configUpdate = configUpdate else { return }
            
            self?.plugin?.notifyListeners("remoteConfigUpdated", data: [
                "updatedKeys": Array(configUpdate.updatedKeys)
            ])
        }
    }
    
    func stopListeningForUpdates() {
        configUpdateListener?.remove()
        configUpdateListener = nil
    }
    
    private func sourceToString(_ source: RemoteConfigSource) -> String {
        switch source {
        case .static:
            return "static"
        case .default:
            return "default"
        case .remote:
            return "remote"
        @unknown default:
            return "static"
        }
    }
}