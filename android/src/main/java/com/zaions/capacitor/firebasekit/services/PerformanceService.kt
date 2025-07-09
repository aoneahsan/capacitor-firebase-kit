package com.zaions.capacitor.firebasekit.services

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.google.firebase.Firebase
import com.google.firebase.perf.FirebasePerformance
import com.google.firebase.perf.metrics.Trace
import com.google.firebase.perf.performance
import java.util.concurrent.ConcurrentHashMap

class PerformanceService(private val plugin: Plugin) {
    
    private val performance: FirebasePerformance by lazy {
        Firebase.performance
    }
    
    private val traces = ConcurrentHashMap<String, Trace>()
    
    fun initialize(call: PluginCall) {
        val enabled = call.getBoolean("enabled", true) ?: true
        performance.isPerformanceCollectionEnabled = enabled
        call.resolve()
    }
    
    fun setPerformanceCollectionEnabled(call: PluginCall) {
        val enabled = call.getBoolean("enabled") ?: return
        performance.isPerformanceCollectionEnabled = enabled
        call.resolve()
    }
    
    fun isPerformanceCollectionEnabled(call: PluginCall) {
        val result = JSObject()
        result.put("enabled", performance.isPerformanceCollectionEnabled)
        call.resolve(result)
    }
    
    fun startTrace(call: PluginCall) {
        val traceName = call.getString("traceName") ?: return
        val traceId = "trace_${System.currentTimeMillis()}_${traceName.hashCode()}"
        
        val trace = performance.newTrace(traceName)
        trace.start()
        traces[traceId] = trace
        
        val result = JSObject()
        result.put("traceId", traceId)
        call.resolve(result)
    }
    
    fun stopTrace(call: PluginCall) {
        val traceId = call.getString("traceId") ?: return
        val trace = traces.remove(traceId)
        
        if (trace != null) {
            trace.stop()
            call.resolve()
        } else {
            call.reject("Trace not found: $traceId")
        }
    }
    
    fun incrementMetric(call: PluginCall) {
        val traceId = call.getString("traceId") ?: return
        val metricName = call.getString("metricName") ?: return
        val value = call.getInt("value") ?: 1
        
        val trace = traces[traceId]
        if (trace != null) {
            trace.incrementMetric(metricName, value.toLong())
            call.resolve()
        } else {
            call.reject("Trace not found: $traceId")
        }
    }
    
    fun setMetric(call: PluginCall) {
        val traceId = call.getString("traceId") ?: return
        val metricName = call.getString("metricName") ?: return
        val value = call.getInt("value") ?: return
        
        val trace = traces[traceId]
        if (trace != null) {
            trace.putMetric(metricName, value.toLong())
            call.resolve()
        } else {
            call.reject("Trace not found: $traceId")
        }
    }
    
    fun getMetric(call: PluginCall) {
        val traceId = call.getString("traceId") ?: return
        val metricName = call.getString("metricName") ?: return
        
        val trace = traces[traceId]
        if (trace != null) {
            val value = trace.getLongMetric(metricName)
            val result = JSObject()
            result.put("value", value)
            call.resolve(result)
        } else {
            call.reject("Trace not found: $traceId")
        }
    }
    
    fun putAttribute(call: PluginCall) {
        val traceId = call.getString("traceId") ?: return
        val attribute = call.getString("attribute") ?: return
        val value = call.getString("value") ?: return
        
        val trace = traces[traceId]
        if (trace != null) {
            trace.putAttribute(attribute, value)
            call.resolve()
        } else {
            call.reject("Trace not found: $traceId")
        }
    }
    
    fun getAttributes(call: PluginCall) {
        val traceId = call.getString("traceId") ?: return
        
        val trace = traces[traceId]
        if (trace != null) {
            val attributes = trace.attributes
            val result = JSObject()
            result.put("attributes", JSObject().apply {
                attributes.forEach { (key, value) ->
                    put(key, value)
                }
            })
            call.resolve(result)
        } else {
            call.reject("Trace not found: $traceId")
        }
    }
    
    fun removeAttribute(call: PluginCall) {
        val traceId = call.getString("traceId") ?: return
        val attribute = call.getString("attribute") ?: return
        
        val trace = traces[traceId]
        if (trace != null) {
            trace.removeAttribute(attribute)
            call.resolve()
        } else {
            call.reject("Trace not found: $traceId")
        }
    }
    
    fun startScreenTrace(call: PluginCall) {
        val screenName = call.getString("screenName") ?: return
        val traceId = "screen_${System.currentTimeMillis()}_${screenName.hashCode()}"
        
        val trace = performance.newTrace("_st_$screenName")
        trace.start()
        traces[traceId] = trace
        
        val result = JSObject()
        result.put("traceId", traceId)
        call.resolve(result)
    }
    
    fun stopScreenTrace(call: PluginCall) {
        stopTrace(call)
    }
    
    fun recordNetworkRequest(call: PluginCall) {
        // TODO: Implement network request recording
        call.resolve()
    }
}