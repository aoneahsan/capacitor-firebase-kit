package com.zaions.capacitor.firebasekit.services

import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.google.firebase.Firebase
import com.google.firebase.remoteconfig.ConfigUpdate
import com.google.firebase.remoteconfig.ConfigUpdateListener
import com.google.firebase.remoteconfig.FirebaseRemoteConfig
import com.google.firebase.remoteconfig.FirebaseRemoteConfigException
import com.google.firebase.remoteconfig.FirebaseRemoteConfigSettings
import com.google.firebase.remoteconfig.remoteConfig
import com.google.firebase.remoteconfig.remoteConfigSettings

class RemoteConfigService(private val plugin: Plugin) {
    
    private val remoteConfig: FirebaseRemoteConfig by lazy {
        Firebase.remoteConfig
    }
    
    private var configUpdateListener: ConfigUpdateListener? = null
    
    fun initialize(call: PluginCall) {
        val minimumFetchInterval = call.getInt("minimumFetchIntervalInSeconds", 43200)?.toLong() ?: 43200L
        val fetchTimeout = call.getInt("fetchTimeoutInSeconds", 60)?.toLong() ?: 60L
        
        val configSettings = remoteConfigSettings {
            minimumFetchIntervalInSeconds = minimumFetchInterval
            fetchTimeoutInSeconds = fetchTimeout
        }
        
        remoteConfig.setConfigSettingsAsync(configSettings)
            .addOnSuccessListener {
                call.resolve()
            }
            .addOnFailureListener { e ->
                call.reject("Failed to initialize Remote Config", e)
            }
    }
    
    fun setDefaults(call: PluginCall) {
        val defaults = call.getObject("defaults") ?: return
        
        val defaultsMap = mutableMapOf<String, Any>()
        defaults.keys().forEach { key ->
            defaults.get(key)?.let { value ->
                defaultsMap[key] = value
            }
        }
        
        remoteConfig.setDefaultsAsync(defaultsMap)
            .addOnSuccessListener {
                call.resolve()
            }
            .addOnFailureListener { e ->
                call.reject("Failed to set defaults", e)
            }
    }
    
    fun fetch(call: PluginCall) {
        val minimumFetchInterval = call.getInt("minimumFetchIntervalInSeconds")
        
        val fetchTask = if (minimumFetchInterval != null) {
            remoteConfig.fetch(minimumFetchInterval.toLong())
        } else {
            remoteConfig.fetch()
        }
        
        fetchTask
            .addOnSuccessListener {
                call.resolve()
            }
            .addOnFailureListener { e ->
                call.reject("Failed to fetch config", e)
            }
    }
    
    fun activate(call: PluginCall) {
        remoteConfig.activate()
            .addOnSuccessListener { activated ->
                val result = JSObject()
                result.put("activated", activated)
                call.resolve(result)
            }
            .addOnFailureListener { e ->
                call.reject("Failed to activate config", e)
            }
    }
    
    fun fetchAndActivate(call: PluginCall) {
        val minimumFetchInterval = call.getInt("minimumFetchIntervalInSeconds")
        
        if (minimumFetchInterval != null) {
            val currentSettings = remoteConfig.configSettings
            val newSettings = remoteConfigSettings {
                minimumFetchIntervalInSeconds = minimumFetchInterval.toLong()
                fetchTimeoutInSeconds = currentSettings.fetchTimeoutInSeconds
            }
            remoteConfig.setConfigSettingsAsync(newSettings)
        }
        
        remoteConfig.fetchAndActivate()
            .addOnSuccessListener { activated ->
                val result = JSObject()
                result.put("activated", activated)
                call.resolve(result)
            }
            .addOnFailureListener { e ->
                call.reject("Failed to fetch and activate config", e)
            }
    }
    
    fun getValue(call: PluginCall) {
        val key = call.getString("key") ?: return
        val value = remoteConfig.getValue(key)
        
        val result = JSObject()
        result.put("asString", value.asString())
        result.put("asNumber", value.asDouble())
        result.put("asBoolean", value.asBoolean())
        result.put("source", when (value.source) {
            FirebaseRemoteConfig.VALUE_SOURCE_STATIC -> "static"
            FirebaseRemoteConfig.VALUE_SOURCE_DEFAULT -> "default"
            FirebaseRemoteConfig.VALUE_SOURCE_REMOTE -> "remote"
            else -> "static"
        })
        
        call.resolve(result)
    }
    
    fun getAll(call: PluginCall) {
        val all = remoteConfig.all
        val values = JSObject()
        
        all.forEach { (key, value) ->
            val valueObj = JSObject()
            valueObj.put("asString", value.asString())
            valueObj.put("asNumber", value.asDouble())
            valueObj.put("asBoolean", value.asBoolean())
            valueObj.put("source", when (value.source) {
                FirebaseRemoteConfig.VALUE_SOURCE_STATIC -> "static"
                FirebaseRemoteConfig.VALUE_SOURCE_DEFAULT -> "default"
                FirebaseRemoteConfig.VALUE_SOURCE_REMOTE -> "remote"
                else -> "static"
            })
            values.put(key, valueObj)
        }
        
        val result = JSObject()
        result.put("values", values)
        call.resolve(result)
    }
    
    fun getSettings(call: PluginCall) {
        val settings = remoteConfig.configSettings
        val result = JSObject()
        result.put("minimumFetchIntervalInSeconds", settings.minimumFetchIntervalInSeconds)
        result.put("fetchTimeoutInSeconds", settings.fetchTimeoutInSeconds)
        call.resolve(result)
    }
    
    fun setSettings(call: PluginCall) {
        val minimumFetchInterval = call.getLong("minimumFetchIntervalInSeconds") ?: return
        val fetchTimeout = call.getLong("fetchTimeoutInSeconds") ?: return
        
        val configSettings = remoteConfigSettings {
            minimumFetchIntervalInSeconds = minimumFetchInterval
            fetchTimeoutInSeconds = fetchTimeout
        }
        
        remoteConfig.setConfigSettingsAsync(configSettings)
            .addOnSuccessListener {
                call.resolve()
            }
            .addOnFailureListener { e ->
                call.reject("Failed to set config settings", e)
            }
    }
    
    fun ensureInitialized(call: PluginCall) {
        remoteConfig.ensureInitialized()
            .addOnSuccessListener {
                call.resolve()
            }
            .addOnFailureListener { e ->
                call.reject("Failed to ensure initialization", e)
            }
    }
    
    fun reset(call: PluginCall) {
        remoteConfig.reset()
            .addOnSuccessListener {
                call.resolve()
            }
            .addOnFailureListener { e ->
                call.reject("Failed to reset config", e)
            }
    }
    
    fun startListeningForUpdates() {
        if (configUpdateListener != null) return
        
        configUpdateListener = object : ConfigUpdateListener {
            override fun onUpdate(configUpdate: ConfigUpdate) {
                val event = JSObject()
                val updatedKeys = JSArray()
                configUpdate.updatedKeys.forEach { key ->
                    updatedKeys.put(key)
                }
                event.put("updatedKeys", updatedKeys)
                plugin.notifyListeners("remoteConfigUpdated", event)
            }
            
            override fun onError(error: FirebaseRemoteConfigException) {
                // Log error but don't notify listeners
            }
        }
        
        remoteConfig.addOnConfigUpdateListener(configUpdateListener!!)
    }
    
    fun stopListeningForUpdates() {
        configUpdateListener?.let {
            // Note: As of current Firebase SDK, there's no removeOnConfigUpdateListener method
            // The listener will be automatically removed when the app is destroyed
            configUpdateListener = null
        }
    }
}