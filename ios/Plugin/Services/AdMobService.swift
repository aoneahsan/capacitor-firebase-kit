import Foundation
import Capacitor
import GoogleMobileAds
import UserMessagingPlatform
import AppTrackingTransparency
import AdSupport

class AdMobService: NSObject {
    private weak var plugin: CAPPlugin?
    private var bannerView: GADBannerView?
    private var interstitialAd: GADInterstitialAd?
    private var rewardedAd: GADRewardedAd?
    private var rewardedInterstitialAd: GADRewardedInterstitialAd?
    
    init(plugin: CAPPlugin) {
        self.plugin = plugin
        super.init()
    }
    
    func initialize(_ call: CAPPluginCall) {
        let testingDevices = call.getArray("testingDevices", String.self) ?? []
        let requestTrackingAuthorization = call.getBool("requestTrackingAuthorization", false)
        
        DispatchQueue.main.async {
            // Request tracking authorization if needed
            if requestTrackingAuthorization {
                if #available(iOS 14, *) {
                    ATTrackingManager.requestTrackingAuthorization { status in
                        self.initializeAds(testingDevices: testingDevices, call: call)
                    }
                } else {
                    self.initializeAds(testingDevices: testingDevices, call: call)
                }
            } else {
                self.initializeAds(testingDevices: testingDevices, call: call)
            }
        }
    }
    
    private func initializeAds(testingDevices: [String], call: CAPPluginCall) {
        GADMobileAds.sharedInstance().start { status in
            // Configure test devices
            if !testingDevices.isEmpty {
                GADMobileAds.sharedInstance().requestConfiguration.testDeviceIdentifiers = testingDevices
            }
            
            call.resolve()
        }
    }
    
    func requestConsentInfo(_ call: CAPPluginCall) {
        let tagForUnderAgeOfConsent = call.getBool("tagForUnderAgeOfConsent", false)
        let testDeviceIdentifiers = call.getArray("testDeviceIdentifiers", String.self) ?? []
        
        let parameters = UMPRequestParameters()
        parameters.tagForUnderAgeOfConsent = tagForUnderAgeOfConsent
        
        if !testDeviceIdentifiers.isEmpty {
            let debugSettings = UMPDebugSettings()
            debugSettings.testDeviceIdentifiers = testDeviceIdentifiers
            debugSettings.geography = .EEA
            parameters.debugSettings = debugSettings
        }
        
        UMPConsentInformation.sharedInstance.requestConsentInfoUpdate(with: parameters) { error in
            if let error = error {
                call.reject("Failed to request consent info", nil, error)
                return
            }
            
            let consentInfo = UMPConsentInformation.sharedInstance
            call.resolve([
                "status": self.consentStatusToString(consentInfo.consentStatus),
                "isConsentFormAvailable": consentInfo.formStatus == .available
            ])
        }
    }
    
    func showConsentForm(_ call: CAPPluginCall) {
        guard let viewController = self.plugin?.bridge?.viewController else {
            call.reject("View controller not available")
            return
        }
        
        UMPConsentForm.loadAndPresentIfRequired(from: viewController) { error in
            if let error = error {
                call.reject("Failed to show consent form", nil, error)
                return
            }
            
            let status = self.consentStatusToString(UMPConsentInformation.sharedInstance.consentStatus)
            call.resolve(status)
        }
    }
    
    func resetConsentInfo(_ call: CAPPluginCall) {
        UMPConsentInformation.sharedInstance.reset()
        call.resolve()
    }
    
    func setRequestConfiguration(_ call: CAPPluginCall) {
        let configuration = GADMobileAds.sharedInstance().requestConfiguration
        
        if let maxAdContentRating = call.getString("maxAdContentRating") {
            switch maxAdContentRating {
            case "G":
                configuration.maxAdContentRating = .general
            case "PG":
                configuration.maxAdContentRating = .parentalGuidance
            case "T":
                configuration.maxAdContentRating = .teen
            case "MA":
                configuration.maxAdContentRating = .matureAudience
            default:
                break
            }
        }
        
        if let tagForChildDirectedTreatment = call.getBool("tagForChildDirectedTreatment") {
            configuration.tag(forChildDirectedTreatment: tagForChildDirectedTreatment)
        }
        
        if let tagForUnderAgeOfConsent = call.getBool("tagForUnderAgeOfConsent") {
            configuration.tagForUnderAge(ofConsent: tagForUnderAgeOfConsent)
        }
        
        if let testDeviceIdentifiers = call.getArray("testDeviceIdentifiers", String.self) {
            configuration.testDeviceIdentifiers = testDeviceIdentifiers
        }
        
        call.resolve()
    }
    
    func showBanner(_ call: CAPPluginCall) {
        guard let adId = call.getString("adId") else {
            call.reject("adId is required")
            return
        }
        
        guard let viewController = plugin?.bridge?.viewController else {
            call.reject("View controller not available")
            return
        }
        
        let adSize = call.getString("adSize", "BANNER")
        let position = call.getString("position", "BOTTOM_CENTER")
        let margin = CGFloat(call.getInt("margin", 0))
        
        DispatchQueue.main.async {
            // Remove existing banner
            self.removeBannerView()
            
            // Create new banner
            self.bannerView = GADBannerView(adSize: self.getAdSize(adSize))
            guard let bannerView = self.bannerView else { return }
            
            bannerView.adUnitID = adId
            bannerView.rootViewController = viewController
            bannerView.delegate = self
            
            // Add to view
            viewController.view.addSubview(bannerView)
            bannerView.translatesAutoresizingMaskIntoConstraints = false
            
            // Set constraints based on position
            var constraints: [NSLayoutConstraint] = []
            
            switch position {
            case "TOP_CENTER":
                constraints = [
                    bannerView.topAnchor.constraint(equalTo: viewController.view.safeAreaLayoutGuide.topAnchor, constant: margin),
                    bannerView.centerXAnchor.constraint(equalTo: viewController.view.centerXAnchor)
                ]
            case "CENTER":
                constraints = [
                    bannerView.centerXAnchor.constraint(equalTo: viewController.view.centerXAnchor),
                    bannerView.centerYAnchor.constraint(equalTo: viewController.view.centerYAnchor)
                ]
            case "BOTTOM_CENTER":
                constraints = [
                    bannerView.bottomAnchor.constraint(equalTo: viewController.view.safeAreaLayoutGuide.bottomAnchor, constant: -margin),
                    bannerView.centerXAnchor.constraint(equalTo: viewController.view.centerXAnchor)
                ]
            default:
                constraints = [
                    bannerView.bottomAnchor.constraint(equalTo: viewController.view.safeAreaLayoutGuide.bottomAnchor, constant: -margin),
                    bannerView.centerXAnchor.constraint(equalTo: viewController.view.centerXAnchor)
                ]
            }
            
            NSLayoutConstraint.activate(constraints)
            
            // Load ad
            let request = GADRequest()
            bannerView.load(request)
            
            call.resolve()
        }
    }
    
    func hideBanner(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.bannerView?.isHidden = true
            call.resolve()
        }
    }
    
    func removeBanner(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.removeBannerView()
            call.resolve()
        }
    }
    
    private func removeBannerView() {
        bannerView?.removeFromSuperview()
        bannerView = nil
    }
    
    func loadInterstitial(_ call: CAPPluginCall) {
        guard let adId = call.getString("adId") else {
            call.reject("adId is required")
            return
        }
        
        let request = GADRequest()
        GADInterstitialAd.load(withAdUnitID: adId, request: request) { [weak self] ad, error in
            if let error = error {
                self?.plugin?.notifyListeners("interstitialAdFailedToLoad", data: [
                    "code": error._code,
                    "message": error.localizedDescription
                ])
                call.reject("Failed to load interstitial ad", nil, error)
                return
            }
            
            self?.interstitialAd = ad
            self?.interstitialAd?.fullScreenContentDelegate = self
            self?.plugin?.notifyListeners("interstitialAdLoaded", data: [:])
            call.resolve()
        }
    }
    
    func showInterstitial(_ call: CAPPluginCall) {
        guard let viewController = plugin?.bridge?.viewController else {
            call.reject("View controller not available")
            return
        }
        
        guard let interstitialAd = interstitialAd else {
            call.reject("Interstitial ad not loaded")
            return
        }
        
        DispatchQueue.main.async {
            interstitialAd.present(fromRootViewController: viewController)
            call.resolve()
        }
    }
    
    func loadRewarded(_ call: CAPPluginCall) {
        guard let adId = call.getString("adId") else {
            call.reject("adId is required")
            return
        }
        
        let request = GADRequest()
        GADRewardedAd.load(withAdUnitID: adId, request: request) { [weak self] ad, error in
            if let error = error {
                self?.plugin?.notifyListeners("rewardedAdFailedToLoad", data: [
                    "code": error._code,
                    "message": error.localizedDescription
                ])
                call.reject("Failed to load rewarded ad", nil, error)
                return
            }
            
            self?.rewardedAd = ad
            self?.rewardedAd?.fullScreenContentDelegate = self
            self?.plugin?.notifyListeners("rewardedAdLoaded", data: [:])
            call.resolve()
        }
    }
    
    func showRewarded(_ call: CAPPluginCall) {
        guard let viewController = plugin?.bridge?.viewController else {
            call.reject("View controller not available")
            return
        }
        
        guard let rewardedAd = rewardedAd else {
            call.reject("Rewarded ad not loaded")
            return
        }
        
        DispatchQueue.main.async {
            rewardedAd.present(fromRootViewController: viewController) { [weak self] in
                let reward = rewardedAd.adReward
                self?.plugin?.notifyListeners("rewardedAdRewarded", data: [
                    "type": reward.type,
                    "amount": reward.amount
                ])
            }
            call.resolve()
        }
    }
    
    func loadRewardedInterstitial(_ call: CAPPluginCall) {
        guard let adId = call.getString("adId") else {
            call.reject("adId is required")
            return
        }
        
        let request = GADRequest()
        GADRewardedInterstitialAd.load(withAdUnitID: adId, request: request) { [weak self] ad, error in
            if let error = error {
                self?.plugin?.notifyListeners("rewardedInterstitialAdFailedToLoad", data: [
                    "code": error._code,
                    "message": error.localizedDescription
                ])
                call.reject("Failed to load rewarded interstitial ad", nil, error)
                return
            }
            
            self?.rewardedInterstitialAd = ad
            self?.rewardedInterstitialAd?.fullScreenContentDelegate = self
            self?.plugin?.notifyListeners("rewardedInterstitialAdLoaded", data: [:])
            call.resolve()
        }
    }
    
    func showRewardedInterstitial(_ call: CAPPluginCall) {
        guard let viewController = plugin?.bridge?.viewController else {
            call.reject("View controller not available")
            return
        }
        
        guard let rewardedInterstitialAd = rewardedInterstitialAd else {
            call.reject("Rewarded interstitial ad not loaded")
            return
        }
        
        DispatchQueue.main.async {
            rewardedInterstitialAd.present(fromRootViewController: viewController) { [weak self] in
                let reward = rewardedInterstitialAd.adReward
                self?.plugin?.notifyListeners("rewardedInterstitialAdRewarded", data: [
                    "type": reward.type,
                    "amount": reward.amount
                ])
            }
            call.resolve()
        }
    }
    
    private func getAdSize(_ size: String) -> GADAdSize {
        switch size {
        case "BANNER":
            return GADAdSizeBanner
        case "FULL_BANNER":
            return GADAdSizeFullBanner
        case "LARGE_BANNER":
            return GADAdSizeLargeBanner
        case "MEDIUM_RECTANGLE":
            return GADAdSizeMediumRectangle
        case "LEADERBOARD":
            return GADAdSizeLeaderboard
        case "ADAPTIVE_BANNER":
            guard let viewController = plugin?.bridge?.viewController else {
                return GADAdSizeBanner
            }
            let frame = viewController.view.frame.inset(by: viewController.view.safeAreaInsets)
            return GADCurrentOrientationAnchoredAdaptiveBannerAdSizeWithWidth(frame.width)
        default:
            return GADAdSizeBanner
        }
    }
    
    private func consentStatusToString(_ status: UMPConsentStatus) -> String {
        switch status {
        case .unknown:
            return "unknown"
        case .notRequired:
            return "notRequired"
        case .required:
            return "required"
        case .obtained:
            return "obtained"
        @unknown default:
            return "unknown"
        }
    }
}

// MARK: - GADBannerViewDelegate
extension AdMobService: GADBannerViewDelegate {
    func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {
        plugin?.notifyListeners("bannerAdLoaded", data: [:])
    }
    
    func bannerView(_ bannerView: GADBannerView, didFailToReceiveAdWithError error: Error) {
        plugin?.notifyListeners("bannerAdFailedToLoad", data: [
            "code": (error as NSError).code,
            "message": error.localizedDescription
        ])
    }
    
    func bannerViewWillPresentScreen(_ bannerView: GADBannerView) {
        plugin?.notifyListeners("bannerAdOpened", data: [:])
    }
    
    func bannerViewDidDismissScreen(_ bannerView: GADBannerView) {
        plugin?.notifyListeners("bannerAdClosed", data: [:])
    }
    
    func bannerViewDidRecordClick(_ bannerView: GADBannerView) {
        plugin?.notifyListeners("bannerAdClicked", data: [:])
    }
    
    func bannerViewDidRecordImpression(_ bannerView: GADBannerView) {
        plugin?.notifyListeners("bannerAdImpression", data: [:])
    }
}

// MARK: - GADFullScreenContentDelegate
extension AdMobService: GADFullScreenContentDelegate {
    func adDidRecordImpression(_ ad: GADFullScreenPresentingAd) {
        if ad is GADInterstitialAd {
            plugin?.notifyListeners("interstitialAdImpression", data: [:])
        } else if ad is GADRewardedAd {
            plugin?.notifyListeners("rewardedAdImpression", data: [:])
        } else if ad is GADRewardedInterstitialAd {
            plugin?.notifyListeners("rewardedInterstitialAdImpression", data: [:])
        }
    }
    
    func ad(_ ad: GADFullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        let errorData = [
            "code": (error as NSError).code,
            "message": error.localizedDescription
        ]
        
        if ad is GADInterstitialAd {
            plugin?.notifyListeners("interstitialAdFailedToShow", data: errorData)
            interstitialAd = nil
        } else if ad is GADRewardedAd {
            plugin?.notifyListeners("rewardedAdFailedToShow", data: errorData)
            rewardedAd = nil
        } else if ad is GADRewardedInterstitialAd {
            plugin?.notifyListeners("rewardedInterstitialAdFailedToShow", data: errorData)
            rewardedInterstitialAd = nil
        }
    }
    
    func adWillPresentFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        if ad is GADInterstitialAd {
            plugin?.notifyListeners("interstitialAdOpened", data: [:])
        } else if ad is GADRewardedAd {
            plugin?.notifyListeners("rewardedAdOpened", data: [:])
        } else if ad is GADRewardedInterstitialAd {
            plugin?.notifyListeners("rewardedInterstitialAdOpened", data: [:])
        }
    }
    
    func adDidDismissFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        if ad is GADInterstitialAd {
            plugin?.notifyListeners("interstitialAdClosed", data: [:])
            interstitialAd = nil
        } else if ad is GADRewardedAd {
            plugin?.notifyListeners("rewardedAdClosed", data: [:])
            rewardedAd = nil
        } else if ad is GADRewardedInterstitialAd {
            plugin?.notifyListeners("rewardedInterstitialAdClosed", data: [:])
            rewardedInterstitialAd = nil
        }
    }
}