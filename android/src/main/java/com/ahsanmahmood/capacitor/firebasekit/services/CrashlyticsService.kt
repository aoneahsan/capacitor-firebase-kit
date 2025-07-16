package com.ahsanmahmood.capacitor.firebasekit.services

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.google.firebase.Firebase
import com.google.firebase.crashlytics.FirebaseCrashlytics
import com.google.firebase.crashlytics.crashlytics

class CrashlyticsService(private val plugin: Plugin) {
    
    private val crashlytics: FirebaseCrashlytics by lazy {
        Firebase.crashlytics
    }
    
    fun crash(call: PluginCall) {
        throw RuntimeException("Test Crash - This is a test crash triggered by Firebase Kit")
    }
    
    fun forceCrash(call: PluginCall) {
        val message = call.getString("message") ?: "Forced crash"
        throw RuntimeException(message)
    }
    
    fun log(call: PluginCall) {
        val message = call.getString("message") ?: return
        crashlytics.log(message)
        call.resolve()
    }
    
    fun logException(call: PluginCall) {
        val message = call.getString("message") ?: "Custom exception"
        val code = call.getString("code")
        val domain = call.getString("domain")
        
        val exception = if (code != null || domain != null) {
            Exception("[$domain:$code] $message")
        } else {
            Exception(message)
        }
        
        crashlytics.recordException(exception)
        call.resolve()
    }
    
    fun setUserId(call: PluginCall) {
        val userId = call.getString("userId") ?: return
        crashlytics.setUserId(userId)
        call.resolve()
    }
    
    fun setCustomKeys(call: PluginCall) {
        val attributes = call.getObject("attributes") ?: return
        
        attributes.keys().forEach { key ->
            when (val value = attributes.get(key)) {
                is String -> crashlytics.setCustomKey(key, value)
                is Int -> crashlytics.setCustomKey(key, value)
                is Long -> crashlytics.setCustomKey(key, value)
                is Float -> crashlytics.setCustomKey(key, value)
                is Double -> crashlytics.setCustomKey(key, value)
                is Boolean -> crashlytics.setCustomKey(key, value)
            }
        }
        
        call.resolve()
    }
    
    fun setCrashlyticsCollectionEnabled(call: PluginCall) {
        val enabled = call.getBoolean("enabled") ?: return
        crashlytics.setCrashlyticsCollectionEnabled(enabled)
        call.resolve()
    }
    
    fun isCrashlyticsCollectionEnabled(call: PluginCall) {
        val result = JSObject()
        result.put("enabled", crashlytics.isCrashlyticsCollectionEnabled())
        call.resolve(result)
    }
    
    fun deleteUnsentReports(call: PluginCall) {
        crashlytics.deleteUnsentReports()
        call.resolve()
    }
    
    fun sendUnsentReports(call: PluginCall) {
        crashlytics.sendUnsentReports()
        call.resolve()
    }
    
    fun recordBreadcrumb(call: PluginCall) {
        val name = call.getString("name") ?: return
        val params = call.getObject("params")
        
        val breadcrumb = if (params != null) {
            "$name: $params"
        } else {
            name
        }
        
        crashlytics.log(breadcrumb)
        call.resolve()
    }
}