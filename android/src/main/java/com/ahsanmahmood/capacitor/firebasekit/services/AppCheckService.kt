package com.ahsanmahmood.capacitor.firebasekit.services

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.google.firebase.Firebase
import com.google.firebase.appcheck.AppCheckToken
import com.google.firebase.appcheck.FirebaseAppCheck
import com.google.firebase.appcheck.appCheck
import com.google.firebase.appcheck.playintegrity.PlayIntegrityAppCheckProviderFactory
import com.google.firebase.appcheck.safetynet.SafetyNetAppCheckProviderFactory
import com.google.firebase.appcheck.debug.DebugAppCheckProviderFactory
import com.google.firebase.initialize

class AppCheckService(private val plugin: Plugin) {
    
    private var appCheck: FirebaseAppCheck? = null
    private var tokenListener: FirebaseAppCheck.AppCheckListener? = null
    
    fun initialize(call: PluginCall) {
        val provider = call.getString("provider")
        val debugToken = call.getString("debugToken")
        val isTokenAutoRefreshEnabled = call.getBoolean("isTokenAutoRefreshEnabled", true) ?: true
        
        try {
            // Initialize Firebase if not already initialized
            if (Firebase.app == null) {
                Firebase.initialize(plugin.context)
            }
            
            appCheck = Firebase.appCheck
            
            when (provider) {
                "playIntegrity" -> {
                    appCheck?.installAppCheckProviderFactory(
                        PlayIntegrityAppCheckProviderFactory.getInstance()
                    )
                }
                "safetyNet" -> {
                    appCheck?.installAppCheckProviderFactory(
                        SafetyNetAppCheckProviderFactory.getInstance()
                    )
                }
                "debug" -> {
                    if (debugToken != null) {
                        System.setProperty("app.check.debug.token", debugToken)
                    }
                    appCheck?.installAppCheckProviderFactory(
                        DebugAppCheckProviderFactory.getInstance()
                    )
                }
                else -> {
                    call.reject("Invalid provider: $provider")
                    return
                }
            }
            
            appCheck?.setTokenAutoRefreshEnabled(isTokenAutoRefreshEnabled)
            
            call.resolve()
        } catch (e: Exception) {
            call.reject("Failed to initialize App Check", e)
        }
    }
    
    fun getToken(call: PluginCall) {
        val forceRefresh = call.getBoolean("forceRefresh", false) ?: false
        
        if (appCheck == null) {
            call.reject("App Check not initialized")
            return
        }
        
        val tokenTask = if (forceRefresh) {
            appCheck!!.getAppCheckToken(true)
        } else {
            appCheck!!.getAppCheckToken(false)
        }
        
        tokenTask
            .addOnSuccessListener { tokenResponse ->
                val result = JSObject()
                result.put("token", tokenResponse.token)
                result.put("expireTimeMillis", tokenResponse.expireTimeMillis)
                call.resolve(result)
            }
            .addOnFailureListener { e ->
                call.reject("Failed to get App Check token", e)
            }
    }
    
    fun setTokenAutoRefreshEnabled(call: PluginCall) {
        val enabled = call.getBoolean("enabled") ?: return
        
        if (appCheck == null) {
            call.reject("App Check not initialized")
            return
        }
        
        appCheck?.setTokenAutoRefreshEnabled(enabled)
        call.resolve()
    }
    
    fun addTokenChangedListener() {
        if (appCheck == null || tokenListener != null) return
        
        tokenListener = FirebaseAppCheck.AppCheckListener { token ->
            val event = JSObject()
            event.put("token", token.token)
            event.put("expireTimeMillis", token.expireTimeMillis)
            plugin.notifyListeners("appCheckTokenChanged", event)
        }
        
        appCheck?.addAppCheckListener(tokenListener!!)
    }
    
    fun removeTokenChangedListener() {
        tokenListener?.let {
            appCheck?.removeAppCheckListener(it)
            tokenListener = null
        }
    }
}