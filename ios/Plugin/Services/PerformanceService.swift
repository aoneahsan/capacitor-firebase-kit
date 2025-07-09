import Foundation
import Capacitor
import FirebasePerformance

class PerformanceService {
    private weak var plugin: CAPPlugin?
    private var traces: [String: Trace] = [:]
    
    init(plugin: CAPPlugin) {
        self.plugin = plugin
    }
    
    func initialize(_ call: CAPPluginCall) {
        let enabled = call.getBool("enabled", true)
        Performance.sharedInstance().isDataCollectionEnabled = enabled
        call.resolve()
    }
    
    func setPerformanceCollectionEnabled(_ call: CAPPluginCall) {
        guard let enabled = call.getBool("enabled") else {
            call.reject("Enabled parameter is required")
            return
        }
        
        Performance.sharedInstance().isDataCollectionEnabled = enabled
        call.resolve()
    }
    
    func isPerformanceCollectionEnabled(_ call: CAPPluginCall) {
        let enabled = Performance.sharedInstance().isDataCollectionEnabled
        call.resolve(["enabled": enabled])
    }
    
    func startTrace(_ call: CAPPluginCall) {
        guard let traceName = call.getString("traceName") else {
            call.reject("Trace name is required")
            return
        }
        
        guard let trace = Performance.startTrace(name: traceName) else {
            call.reject("Failed to start trace")
            return
        }
        
        let traceId = "trace_\(Date().timeIntervalSince1970)_\(traceName.hashValue)"
        traces[traceId] = trace
        
        call.resolve(["traceId": traceId])
    }
    
    func stopTrace(_ call: CAPPluginCall) {
        guard let traceId = call.getString("traceId") else {
            call.reject("Trace ID is required")
            return
        }
        
        guard let trace = traces.removeValue(forKey: traceId) else {
            call.reject("Trace not found: \(traceId)")
            return
        }
        
        trace.stop()
        call.resolve()
    }
    
    func incrementMetric(_ call: CAPPluginCall) {
        guard let traceId = call.getString("traceId"),
              let metricName = call.getString("metricName") else {
            call.reject("Trace ID and metric name are required")
            return
        }
        
        let value = call.getInt("value", 1)
        
        guard let trace = traces[traceId] else {
            call.reject("Trace not found: \(traceId)")
            return
        }
        
        trace.incrementMetric(metricName, by: Int64(value))
        call.resolve()
    }
    
    func setMetric(_ call: CAPPluginCall) {
        guard let traceId = call.getString("traceId"),
              let metricName = call.getString("metricName"),
              let value = call.getInt("value") else {
            call.reject("Trace ID, metric name, and value are required")
            return
        }
        
        guard let trace = traces[traceId] else {
            call.reject("Trace not found: \(traceId)")
            return
        }
        
        trace.setIntValue(Int64(value), forMetric: metricName)
        call.resolve()
    }
    
    func getMetric(_ call: CAPPluginCall) {
        guard let traceId = call.getString("traceId"),
              let metricName = call.getString("metricName") else {
            call.reject("Trace ID and metric name are required")
            return
        }
        
        guard let trace = traces[traceId] else {
            call.reject("Trace not found: \(traceId)")
            return
        }
        
        let value = trace.valueForIntMetric(metricName)
        call.resolve(["value": value])
    }
    
    func putAttribute(_ call: CAPPluginCall) {
        guard let traceId = call.getString("traceId"),
              let attribute = call.getString("attribute"),
              let value = call.getString("value") else {
            call.reject("Trace ID, attribute, and value are required")
            return
        }
        
        guard let trace = traces[traceId] else {
            call.reject("Trace not found: \(traceId)")
            return
        }
        
        trace.setValue(value, forAttribute: attribute)
        call.resolve()
    }
    
    func getAttributes(_ call: CAPPluginCall) {
        guard let traceId = call.getString("traceId") else {
            call.reject("Trace ID is required")
            return
        }
        
        guard let trace = traces[traceId] else {
            call.reject("Trace not found: \(traceId)")
            return
        }
        
        call.resolve(["attributes": trace.attributes])
    }
    
    func removeAttribute(_ call: CAPPluginCall) {
        guard let traceId = call.getString("traceId"),
              let attribute = call.getString("attribute") else {
            call.reject("Trace ID and attribute are required")
            return
        }
        
        guard let trace = traces[traceId] else {
            call.reject("Trace not found: \(traceId)")
            return
        }
        
        trace.removeAttribute(attribute)
        call.resolve()
    }
    
    func startScreenTrace(_ call: CAPPluginCall) {
        guard let screenName = call.getString("screenName") else {
            call.reject("Screen name is required")
            return
        }
        
        let traceName = "_st_\(screenName)"
        guard let trace = Performance.startTrace(name: traceName) else {
            call.reject("Failed to start screen trace")
            return
        }
        
        let traceId = "screen_\(Date().timeIntervalSince1970)_\(screenName.hashValue)"
        traces[traceId] = trace
        
        call.resolve(["traceId": traceId])
    }
    
    func stopScreenTrace(_ call: CAPPluginCall) {
        stopTrace(call)
    }
    
    func recordNetworkRequest(_ call: CAPPluginCall) {
        // TODO: Implement network request recording
        call.resolve()
    }
}