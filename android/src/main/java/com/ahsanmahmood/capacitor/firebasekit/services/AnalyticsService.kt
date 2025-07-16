package com.ahsanmahmood.capacitor.firebasekit.services

import android.os.Bundle
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.google.firebase.Firebase
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.analytics.analytics
import com.google.firebase.analytics.setConsent

class AnalyticsService(private val plugin: Plugin) {
    
    private val analytics: FirebaseAnalytics by lazy {
        Firebase.analytics
    }
    
    fun initialize(call: PluginCall) {
        val collectionEnabled = call.getBoolean("collectionEnabled", true) ?: true
        analytics.setAnalyticsCollectionEnabled(collectionEnabled)
        
        val sessionTimeout = call.getInt("sessionTimeoutDuration")
        if (sessionTimeout != null) {
            analytics.setSessionTimeoutDuration(sessionTimeout.toLong() * 1000)
        }
        
        call.resolve()
    }
    
    fun setCollectionEnabled(call: PluginCall) {
        val enabled = call.getBoolean("enabled") ?: return
        analytics.setAnalyticsCollectionEnabled(enabled)
        call.resolve()
    }
    
    fun setCurrentScreen(call: PluginCall) {
        val screenName = call.getString("screenName") ?: return
        val screenClass = call.getString("screenClass")
        
        plugin.activity.runOnUiThread {
            val params = Bundle().apply {
                putString(FirebaseAnalytics.Param.SCREEN_NAME, screenName)
                screenClass?.let { putString(FirebaseAnalytics.Param.SCREEN_CLASS, it) }
            }
            analytics.logEvent(FirebaseAnalytics.Event.SCREEN_VIEW, params)
            call.resolve()
        }
    }
    
    fun logEvent(call: PluginCall) {
        val name = call.getString("name") ?: return
        val params = call.getObject("params")
        
        val bundle = Bundle()
        params?.keys()?.forEach { key ->
            when (val value = params.get(key)) {
                is String -> bundle.putString(key, value)
                is Int -> bundle.putInt(key, value)
                is Long -> bundle.putLong(key, value)
                is Double -> bundle.putDouble(key, value)
                is Float -> bundle.putFloat(key, value)
                is Boolean -> bundle.putBoolean(key, value)
                is JSObject -> bundle.putString(key, value.toString())
            }
        }
        
        analytics.logEvent(name, bundle)
        call.resolve()
    }
    
    fun setUserProperty(call: PluginCall) {
        val key = call.getString("key") ?: return
        val value = call.getString("value") ?: return
        
        analytics.setUserProperty(key, value)
        call.resolve()
    }
    
    fun setUserId(call: PluginCall) {
        val userId = call.getString("userId")
        analytics.setUserId(userId)
        call.resolve()
    }
    
    fun setSessionTimeoutDuration(call: PluginCall) {
        val duration = call.getInt("duration") ?: return
        analytics.setSessionTimeoutDuration(duration.toLong() * 1000) // Convert to milliseconds
        call.resolve()
    }
    
    fun getAppInstanceId(call: PluginCall) {
        analytics.appInstanceId.addOnSuccessListener { id ->
            val result = JSObject()
            result.put("appInstanceId", id ?: "")
            call.resolve(result)
        }.addOnFailureListener { e ->
            call.reject("Failed to get app instance ID", e)
        }
    }
    
    fun resetAnalyticsData(call: PluginCall) {
        analytics.resetAnalyticsData()
        call.resolve()
    }
    
    fun setConsent(call: PluginCall) {
        val consentSettings = call.getObject("consent") ?: return
        
        analytics.setConsent {
            consentSettings.getString("analyticsStorage")?.let { consent ->
                when (consent) {
                    "granted" -> analyticsStorage(FirebaseAnalytics.ConsentStatus.GRANTED)
                    "denied" -> analyticsStorage(FirebaseAnalytics.ConsentStatus.DENIED)
                }
            }
            
            consentSettings.getString("adStorage")?.let { consent ->
                when (consent) {
                    "granted" -> adStorage(FirebaseAnalytics.ConsentStatus.GRANTED)
                    "denied" -> adStorage(FirebaseAnalytics.ConsentStatus.DENIED)
                }
            }
            
            consentSettings.getString("adUserData")?.let { consent ->
                when (consent) {
                    "granted" -> adUserData(FirebaseAnalytics.ConsentStatus.GRANTED)
                    "denied" -> adUserData(FirebaseAnalytics.ConsentStatus.DENIED)
                }
            }
            
            consentSettings.getString("adPersonalization")?.let { consent ->
                when (consent) {
                    "granted" -> adPersonalization(FirebaseAnalytics.ConsentStatus.GRANTED)
                    "denied" -> adPersonalization(FirebaseAnalytics.ConsentStatus.DENIED)
                }
            }
        }
        
        call.resolve()
    }
    
    fun setDefaultEventParameters(call: PluginCall) {
        val params = call.getObject("params")
        
        if (params == null) {
            analytics.setDefaultEventParameters(null)
        } else {
            val bundle = Bundle()
            params.keys().forEach { key ->
                when (val value = params.get(key)) {
                    is String -> bundle.putString(key, value)
                    is Int -> bundle.putInt(key, value)
                    is Long -> bundle.putLong(key, value)
                    is Double -> bundle.putDouble(key, value)
                    is Float -> bundle.putFloat(key, value)
                    is Boolean -> bundle.putBoolean(key, value)
                }
            }
            analytics.setDefaultEventParameters(bundle)
        }
        
        call.resolve()
    }
}