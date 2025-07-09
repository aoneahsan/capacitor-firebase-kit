package com.zaions.capacitor.firebasekit.services

import android.app.Activity
import android.content.res.Resources
import android.util.DisplayMetrics
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.RelativeLayout
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.google.android.gms.ads.*
import com.google.android.gms.ads.initialization.InitializationStatus
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.google.android.gms.ads.rewardedinterstitial.RewardedInterstitialAd
import com.google.android.gms.ads.rewardedinterstitial.RewardedInterstitialAdLoadCallback
import com.google.android.ump.*

class AdMobService(private val plugin: Plugin) {
    
    private var consentInformation: ConsentInformation? = null
    private var bannerView: AdView? = null
    private var bannerViewContainer: ViewGroup? = null
    private var interstitialAd: InterstitialAd? = null
    private var rewardedAd: RewardedAd? = null
    private var rewardedInterstitialAd: RewardedInterstitialAd? = null
    
    fun initialize(call: PluginCall) {
        val testingDevices = call.getArray("testingDevices")?.toList<String>() ?: emptyList()
        val initializeForTesting = call.getBoolean("initializeForTesting", false) ?: false
        
        plugin.activity.runOnUiThread {
            // Initialize consent information
            consentInformation = UserMessagingPlatform.getConsentInformation(plugin.context)
            
            // Initialize the Mobile Ads SDK
            MobileAds.initialize(plugin.context) { initializationStatus ->
                // Set test devices if provided
                if (testingDevices.isNotEmpty() || initializeForTesting) {
                    val configuration = RequestConfiguration.Builder()
                        .setTestDeviceIds(testingDevices)
                        .build()
                    MobileAds.setRequestConfiguration(configuration)
                }
                
                call.resolve()
            }
        }
    }
    
    fun requestConsentInfo(call: PluginCall) {
        val tagForUnderAgeOfConsent = call.getBoolean("tagForUnderAgeOfConsent", false) ?: false
        val testDeviceIdentifiers = call.getArray("testDeviceIdentifiers")?.toList<String>() ?: emptyList()
        
        plugin.activity.runOnUiThread {
            val params = ConsentRequestParameters.Builder()
                .setTagForUnderAgeOfConsent(tagForUnderAgeOfConsent)
                
            if (testDeviceIdentifiers.isNotEmpty()) {
                val debugSettings = ConsentDebugSettings.Builder(plugin.context)
                    .setDebugGeography(ConsentDebugSettings.DebugGeography.DEBUG_GEOGRAPHY_EEA)
                    .addTestDeviceHashedId(testDeviceIdentifiers.first())
                    .build()
                params.setConsentDebugSettings(debugSettings)
            }
            
            consentInformation?.requestConsentInfoUpdate(
                plugin.activity,
                params.build(),
                {
                    // Success
                    val result = JSObject()
                    result.put("status", consentStatusToString(consentInformation?.consentStatus))
                    result.put("isConsentFormAvailable", consentInformation?.isConsentFormAvailable ?: false)
                    call.resolve(result)
                },
                { formError ->
                    // Error
                    call.reject("Failed to request consent info", formError)
                }
            )
        }
    }
    
    fun showConsentForm(call: PluginCall) {
        plugin.activity.runOnUiThread {
            UserMessagingPlatform.loadConsentForm(
                plugin.context,
                { consentForm ->
                    consentForm.show(plugin.activity) { formError ->
                        if (formError != null) {
                            call.reject("Failed to show consent form", formError)
                        } else {
                            call.resolve(consentStatusToString(consentInformation?.consentStatus))
                        }
                    }
                },
                { formError ->
                    call.reject("Failed to load consent form", formError)
                }
            )
        }
    }
    
    fun resetConsentInfo(call: PluginCall) {
        consentInformation?.reset()
        call.resolve()
    }
    
    fun setRequestConfiguration(call: PluginCall) {
        val maxAdContentRating = call.getString("maxAdContentRating")
        val tagForChildDirectedTreatment = call.getBoolean("tagForChildDirectedTreatment")
        val tagForUnderAgeOfConsent = call.getBoolean("tagForUnderAgeOfConsent")
        val testDeviceIdentifiers = call.getArray("testDeviceIdentifiers")?.toList<String>() ?: emptyList()
        
        val builder = MobileAds.getRequestConfiguration().toBuilder()
        
        maxAdContentRating?.let { rating ->
            when (rating) {
                "G" -> builder.setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_G)
                "PG" -> builder.setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_PG)
                "T" -> builder.setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_T)
                "MA" -> builder.setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_MA)
            }
        }
        
        tagForChildDirectedTreatment?.let { tag ->
            builder.setTagForChildDirectedTreatment(if (tag) RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE else RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_FALSE)
        }
        
        tagForUnderAgeOfConsent?.let { tag ->
            builder.setTagForUnderAgeOfConsent(if (tag) RequestConfiguration.TAG_FOR_UNDER_AGE_OF_CONSENT_TRUE else RequestConfiguration.TAG_FOR_UNDER_AGE_OF_CONSENT_FALSE)
        }
        
        if (testDeviceIdentifiers.isNotEmpty()) {
            builder.setTestDeviceIds(testDeviceIdentifiers)
        }
        
        MobileAds.setRequestConfiguration(builder.build())
        call.resolve()
    }
    
    fun showBanner(call: PluginCall) {
        val adId = call.getString("adId") ?: run {
            call.reject("adId is required")
            return
        }
        val adSize = call.getString("adSize", "BANNER")
        val position = call.getString("position", "BOTTOM_CENTER")
        val margin = call.getInt("margin", 0) ?: 0
        
        plugin.activity.runOnUiThread {
            // Remove existing banner if any
            removeBannerView()
            
            // Create new banner
            bannerView = AdView(plugin.context)
            bannerView?.adUnitId = adId
            bannerView?.setAdSize(getAdSize(adSize))
            
            // Create container
            val params = RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT
            )
            
            when (position) {
                "TOP_CENTER" -> {
                    params.addRule(RelativeLayout.ALIGN_PARENT_TOP)
                    params.addRule(RelativeLayout.CENTER_HORIZONTAL)
                    params.topMargin = margin
                }
                "CENTER" -> {
                    params.addRule(RelativeLayout.CENTER_IN_PARENT)
                }
                "BOTTOM_CENTER" -> {
                    params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM)
                    params.addRule(RelativeLayout.CENTER_HORIZONTAL)
                    params.bottomMargin = margin
                }
            }
            
            bannerViewContainer = RelativeLayout(plugin.context)
            bannerViewContainer?.layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            
            bannerView?.layoutParams = params
            bannerViewContainer?.addView(bannerView)
            
            val webView = plugin.bridge.webView
            (webView.parent as ViewGroup).addView(bannerViewContainer)
            
            // Set ad listener
            bannerView?.adListener = object : AdListener() {
                override fun onAdLoaded() {
                    plugin.notifyListeners("bannerAdLoaded", JSObject())
                }
                
                override fun onAdFailedToLoad(error: LoadAdError) {
                    val data = JSObject()
                    data.put("code", error.code)
                    data.put("message", error.message)
                    plugin.notifyListeners("bannerAdFailedToLoad", data)
                }
                
                override fun onAdOpened() {
                    plugin.notifyListeners("bannerAdOpened", JSObject())
                }
                
                override fun onAdClicked() {
                    plugin.notifyListeners("bannerAdClicked", JSObject())
                }
                
                override fun onAdClosed() {
                    plugin.notifyListeners("bannerAdClosed", JSObject())
                }
                
                override fun onAdImpression() {
                    plugin.notifyListeners("bannerAdImpression", JSObject())
                }
            }
            
            // Load ad
            val adRequest = AdRequest.Builder().build()
            bannerView?.loadAd(adRequest)
            
            call.resolve()
        }
    }
    
    fun hideBanner(call: PluginCall) {
        plugin.activity.runOnUiThread {
            bannerViewContainer?.visibility = View.GONE
            call.resolve()
        }
    }
    
    fun removeBanner(call: PluginCall) {
        plugin.activity.runOnUiThread {
            removeBannerView()
            call.resolve()
        }
    }
    
    private fun removeBannerView() {
        bannerView?.destroy()
        bannerView = null
        
        bannerViewContainer?.let { container ->
            (container.parent as? ViewGroup)?.removeView(container)
        }
        bannerViewContainer = null
    }
    
    fun loadInterstitial(call: PluginCall) {
        val adId = call.getString("adId") ?: run {
            call.reject("adId is required")
            return
        }
        
        val adRequest = AdRequest.Builder().build()
        
        InterstitialAd.load(
            plugin.context,
            adId,
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                    setupInterstitialCallbacks()
                    plugin.notifyListeners("interstitialAdLoaded", JSObject())
                    call.resolve()
                }
                
                override fun onAdFailedToLoad(error: LoadAdError) {
                    interstitialAd = null
                    val data = JSObject()
                    data.put("code", error.code)
                    data.put("message", error.message)
                    plugin.notifyListeners("interstitialAdFailedToLoad", data)
                    call.reject("Failed to load interstitial ad", error.toString())
                }
            }
        )
    }
    
    fun showInterstitial(call: PluginCall) {
        if (interstitialAd != null) {
            plugin.activity.runOnUiThread {
                interstitialAd?.show(plugin.activity)
                call.resolve()
            }
        } else {
            call.reject("Interstitial ad not loaded")
        }
    }
    
    private fun setupInterstitialCallbacks() {
        interstitialAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                plugin.notifyListeners("interstitialAdClosed", JSObject())
                interstitialAd = null
            }
            
            override fun onAdFailedToShowFullScreenContent(error: AdError) {
                val data = JSObject()
                data.put("code", error.code)
                data.put("message", error.message)
                plugin.notifyListeners("interstitialAdFailedToShow", data)
                interstitialAd = null
            }
            
            override fun onAdShowedFullScreenContent() {
                plugin.notifyListeners("interstitialAdOpened", JSObject())
            }
            
            override fun onAdImpression() {
                plugin.notifyListeners("interstitialAdImpression", JSObject())
            }
        }
    }
    
    fun loadRewarded(call: PluginCall) {
        val adId = call.getString("adId") ?: run {
            call.reject("adId is required")
            return
        }
        
        val adRequest = AdRequest.Builder().build()
        
        RewardedAd.load(
            plugin.context,
            adId,
            adRequest,
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    rewardedAd = ad
                    setupRewardedCallbacks()
                    plugin.notifyListeners("rewardedAdLoaded", JSObject())
                    call.resolve()
                }
                
                override fun onAdFailedToLoad(error: LoadAdError) {
                    rewardedAd = null
                    val data = JSObject()
                    data.put("code", error.code)
                    data.put("message", error.message)
                    plugin.notifyListeners("rewardedAdFailedToLoad", data)
                    call.reject("Failed to load rewarded ad", error.toString())
                }
            }
        )
    }
    
    fun showRewarded(call: PluginCall) {
        if (rewardedAd != null) {
            plugin.activity.runOnUiThread {
                rewardedAd?.show(plugin.activity) { reward ->
                    val data = JSObject()
                    data.put("type", reward.type)
                    data.put("amount", reward.amount)
                    plugin.notifyListeners("rewardedAdRewarded", data)
                }
                call.resolve()
            }
        } else {
            call.reject("Rewarded ad not loaded")
        }
    }
    
    private fun setupRewardedCallbacks() {
        rewardedAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                plugin.notifyListeners("rewardedAdClosed", JSObject())
                rewardedAd = null
            }
            
            override fun onAdFailedToShowFullScreenContent(error: AdError) {
                val data = JSObject()
                data.put("code", error.code)
                data.put("message", error.message)
                plugin.notifyListeners("rewardedAdFailedToShow", data)
                rewardedAd = null
            }
            
            override fun onAdShowedFullScreenContent() {
                plugin.notifyListeners("rewardedAdOpened", JSObject())
            }
            
            override fun onAdImpression() {
                plugin.notifyListeners("rewardedAdImpression", JSObject())
            }
        }
    }
    
    fun loadRewardedInterstitial(call: PluginCall) {
        val adId = call.getString("adId") ?: run {
            call.reject("adId is required")
            return
        }
        
        val adRequest = AdRequest.Builder().build()
        
        RewardedInterstitialAd.load(
            plugin.context,
            adId,
            adRequest,
            object : RewardedInterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedInterstitialAd) {
                    rewardedInterstitialAd = ad
                    setupRewardedInterstitialCallbacks()
                    plugin.notifyListeners("rewardedInterstitialAdLoaded", JSObject())
                    call.resolve()
                }
                
                override fun onAdFailedToLoad(error: LoadAdError) {
                    rewardedInterstitialAd = null
                    val data = JSObject()
                    data.put("code", error.code)
                    data.put("message", error.message)
                    plugin.notifyListeners("rewardedInterstitialAdFailedToLoad", data)
                    call.reject("Failed to load rewarded interstitial ad", error.toString())
                }
            }
        )
    }
    
    fun showRewardedInterstitial(call: PluginCall) {
        if (rewardedInterstitialAd != null) {
            plugin.activity.runOnUiThread {
                rewardedInterstitialAd?.show(plugin.activity) { reward ->
                    val data = JSObject()
                    data.put("type", reward.type)
                    data.put("amount", reward.amount)
                    plugin.notifyListeners("rewardedInterstitialAdRewarded", data)
                }
                call.resolve()
            }
        } else {
            call.reject("Rewarded interstitial ad not loaded")
        }
    }
    
    private fun setupRewardedInterstitialCallbacks() {
        rewardedInterstitialAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                plugin.notifyListeners("rewardedInterstitialAdClosed", JSObject())
                rewardedInterstitialAd = null
            }
            
            override fun onAdFailedToShowFullScreenContent(error: AdError) {
                val data = JSObject()
                data.put("code", error.code)
                data.put("message", error.message)
                plugin.notifyListeners("rewardedInterstitialAdFailedToShow", data)
                rewardedInterstitialAd = null
            }
            
            override fun onAdShowedFullScreenContent() {
                plugin.notifyListeners("rewardedInterstitialAdOpened", JSObject())
            }
            
            override fun onAdImpression() {
                plugin.notifyListeners("rewardedInterstitialAdImpression", JSObject())
            }
        }
    }
    
    private fun getAdSize(size: String): AdSize {
        return when (size) {
            "BANNER" -> AdSize.BANNER
            "FULL_BANNER" -> AdSize.FULL_BANNER
            "LARGE_BANNER" -> AdSize.LARGE_BANNER
            "MEDIUM_RECTANGLE" -> AdSize.MEDIUM_RECTANGLE
            "LEADERBOARD" -> AdSize.LEADERBOARD
            "ADAPTIVE_BANNER" -> {
                val display = plugin.activity.windowManager.defaultDisplay
                val outMetrics = DisplayMetrics()
                display.getMetrics(outMetrics)
                val density = outMetrics.density
                val adWidth = (outMetrics.widthPixels / density).toInt()
                AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(plugin.context, adWidth)
            }
            "SMART_BANNER" -> AdSize.SMART_BANNER
            else -> AdSize.BANNER
        }
    }
    
    private fun consentStatusToString(status: Int?): String {
        return when (status) {
            ConsentInformation.ConsentStatus.UNKNOWN -> "unknown"
            ConsentInformation.ConsentStatus.NOT_REQUIRED -> "notRequired"
            ConsentInformation.ConsentStatus.REQUIRED -> "required"
            ConsentInformation.ConsentStatus.OBTAINED -> "obtained"
            else -> "unknown"
        }
    }
}