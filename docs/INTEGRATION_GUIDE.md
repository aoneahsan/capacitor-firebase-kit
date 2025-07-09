# Capacitor Firebase Kit - Integration Guide

This guide provides step-by-step instructions for integrating Capacitor Firebase Kit into your project, along with practical examples and best practices.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Platform Configuration](#platform-configuration)
3. [Service Integration Examples](#service-integration-examples)
4. [Complete App Example](#complete-app-example)
5. [Best Practices](#best-practices)
6. [Migration Guide](#migration-guide)

## Initial Setup

### 1. Install the Plugin

```bash
npm install capacitor-firebase-kit
npx cap sync
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or select existing project
3. Follow the setup wizard
4. Enable the services you plan to use:
   - Authentication (for App Check)
   - Analytics
   - Crashlytics
   - Performance Monitoring
   - Remote Config
   - AdMob (separate setup required)

### 3. Add Your Apps

#### Android App
1. Click "Add app" → Android
2. Enter your package name (must match your app's package name)
3. Download `google-services.json`
4. Place it in `android/app/google-services.json`

#### iOS App
1. Click "Add app" → iOS
2. Enter your bundle ID (must match your app's bundle ID)
3. Download `GoogleService-Info.plist`
4. Add it to your iOS project:
   - Open Xcode
   - Drag the file into your project
   - Ensure "Copy items if needed" is checked
   - Add to your app target

#### Web App
1. Click "Add app" → Web
2. Register your app with a nickname
3. Copy the Firebase configuration
4. Add to your web app (see Web Configuration below)

## Platform Configuration

### Android Configuration

#### 1. Update `android/build.gradle`

```gradle
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.0'
        classpath 'com.google.gms:google-services:4.4.0'
        classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.9'
        classpath 'com.google.firebase:perf-plugin:1.4.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
```

#### 2. Update `android/app/build.gradle`

```gradle
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services'
apply plugin: 'com.google.firebase.crashlytics'
apply plugin: 'com.google.firebase.firebase-perf'

android {
    defaultConfig {
        minSdkVersion 22  // Minimum for Firebase
    }
}

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    // Dependencies are automatically included by the plugin
}
```

#### 3. Update `android/app/src/main/AndroidManifest.xml`

```xml
<manifest>
    <application>
        <!-- AdMob App ID (replace with your actual ID) -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
            
        <!-- Optional: Disable automatic initialization -->
        <meta-data
            android:name="firebase_analytics_collection_enabled"
            android:value="false" />
        <meta-data
            android:name="firebase_crashlytics_collection_enabled"
            android:value="false" />
        <meta-data
            android:name="firebase_performance_collection_enabled"
            android:value="false" />
    </application>
</manifest>
```

### iOS Configuration

#### 1. Update `ios/App/Podfile`

```ruby
platform :ios, '13.0'
use_frameworks!

target 'App' do
  capacitor_pods
  # Pods for App
  
  # Firebase pods are automatically included by the plugin
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
    end
  end
end
```

#### 2. Update `ios/App/App/AppDelegate.swift`

```swift
import UIKit
import Capacitor
import Firebase

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize Firebase
        FirebaseApp.configure()
        
        return true
    }
}
```

#### 3. Update `ios/App/App/Info.plist`

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY</string>

<!-- For iOS 14+ App Tracking Transparency -->
<key>NSUserTrackingUsageDescription</key>
<string>This app uses tracking to provide personalized ads.</string>

<!-- Optional: Disable automatic collection -->
<key>FirebaseAnalyticsEnabled</key>
<false/>
<key>FirebaseCrashlyticsCollectionEnabled</key>
<false/>
<key>FirebasePerformanceCollectionEnabled</key>
<false/>
```

### Web Configuration

#### 1. Add Firebase SDK to `index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Other head elements -->
</head>
<body>
    <!-- Your app content -->
    
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-performance-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-remote-config-compat.js"></script>
    
    <!-- Initialize Firebase -->
    <script>
        const firebaseConfig = {
            apiKey: "your-api-key",
            authDomain: "your-auth-domain",
            projectId: "your-project-id",
            storageBucket: "your-storage-bucket",
            messagingSenderId: "your-messaging-sender-id",
            appId: "your-app-id",
            measurementId: "your-measurement-id"
        };
        
        firebase.initializeApp(firebaseConfig);
    </script>
</body>
</html>
```

## Service Integration Examples

### Complete Initialization Flow

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';
import { Capacitor } from '@capacitor/core';

export class FirebaseService {
  async initialize() {
    try {
      // 1. Initialize App Check first (protects other services)
      await this.initializeAppCheck();
      
      // 2. Initialize Analytics
      await this.initializeAnalytics();
      
      // 3. Initialize Performance Monitoring
      await this.initializePerformance();
      
      // 4. Initialize Crashlytics
      await this.initializeCrashlytics();
      
      // 5. Initialize Remote Config
      await this.initializeRemoteConfig();
      
      // 6. Initialize AdMob (if using ads)
      await this.initializeAdMob();
      
      console.log('Firebase services initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }
  
  private async initializeAppCheck() {
    const platform = Capacitor.getPlatform();
    
    let provider: string;
    let siteKey: string | undefined;
    
    switch (platform) {
      case 'ios':
        provider = 'deviceCheck'; // or 'appAttest' for iOS 14+
        break;
      case 'android':
        provider = 'playIntegrity'; // or 'safetyNet' for older devices
        break;
      case 'web':
        provider = 'recaptchaV3';
        siteKey = 'YOUR_RECAPTCHA_SITE_KEY';
        break;
      default:
        console.warn('Unsupported platform for App Check');
        return;
    }
    
    await FirebaseKit.appCheck.initialize({
      provider,
      siteKey,
      isTokenAutoRefreshEnabled: true
    });
    
    // Listen for token changes
    await FirebaseKit.appCheck.addListener('appCheckTokenChanged', (token) => {
      console.log('App Check token refreshed');
      // Update your API client with the new token
      this.updateApiToken(token.token);
    });
  }
  
  private async initializeAnalytics() {
    await FirebaseKit.analytics.initialize({
      collectionEnabled: true
    });
    
    // Set user properties
    await FirebaseKit.analytics.setUserProperty({
      key: 'app_version',
      value: '1.0.0'
    });
    
    // Log app open event
    await FirebaseKit.analytics.logEvent({
      name: 'app_open',
      params: {
        source: 'direct'
      }
    });
  }
  
  private async initializePerformance() {
    await FirebaseKit.performance.initialize({
      enabled: true
    });
  }
  
  private async initializeCrashlytics() {
    // Set up user identifier if logged in
    const userId = await this.getCurrentUserId();
    if (userId) {
      await FirebaseKit.crashlytics.setUserId({ userId });
    }
    
    // Set custom keys
    await FirebaseKit.crashlytics.setCustomKeys({
      attributes: {
        environment: 'production',
        version: '1.0.0'
      }
    });
  }
  
  private async initializeRemoteConfig() {
    // Set defaults
    await FirebaseKit.remoteConfig.setDefaults({
      defaults: {
        feature_new_ui: false,
        maintenance_mode: false,
        min_version: '1.0.0',
        api_base_url: 'https://api.example.com'
      }
    });
    
    // Fetch and activate
    await FirebaseKit.remoteConfig.fetchAndActivate();
    
    // Listen for updates
    await FirebaseKit.remoteConfig.addListener('remoteConfigUpdated', async (update) => {
      console.log('Remote config updated:', update.updatedKeys);
      await FirebaseKit.remoteConfig.fetchAndActivate();
      // Apply new configuration
      await this.applyRemoteConfig();
    });
  }
  
  private async initializeAdMob() {
    const platform = Capacitor.getPlatform();
    
    await FirebaseKit.adMob.initialize({
      requestTrackingAuthorization: platform === 'ios',
      testingDevices: [
        // Add your test device IDs
      ]
    });
    
    // Request consent
    const consentInfo = await FirebaseKit.adMob.requestConsentInfo();
    if (consentInfo.isConsentFormAvailable) {
      await FirebaseKit.adMob.showConsentForm();
    }
  }
  
  private updateApiToken(token: string) {
    // Update your API client headers
  }
  
  private async getCurrentUserId(): Promise<string | null> {
    // Get from your auth system
    return null;
  }
  
  private async applyRemoteConfig() {
    // Apply remote config values to your app
  }
}
```

### Analytics Integration Example

```typescript
export class AnalyticsService {
  // Track screen views
  async trackScreenView(screenName: string, screenClass?: string) {
    await FirebaseKit.analytics.setCurrentScreen({
      screenName,
      screenClass
    });
  }
  
  // Track user actions
  async trackAction(action: string, category: string, label?: string, value?: number) {
    await FirebaseKit.analytics.logEvent({
      name: 'user_action',
      params: {
        action,
        category,
        label,
        value
      }
    });
  }
  
  // Track purchases
  async trackPurchase(
    transactionId: string,
    amount: number,
    currency: string,
    items: Array<{id: string; name: string; price: number}>
  ) {
    await FirebaseKit.analytics.logEvent({
      name: 'purchase',
      params: {
        transaction_id: transactionId,
        value: amount,
        currency,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price
        }))
      }
    });
  }
  
  // Track user properties
  async updateUserProperties(properties: Record<string, string>) {
    for (const [key, value] of Object.entries(properties)) {
      await FirebaseKit.analytics.setUserProperty({ key, value });
    }
  }
  
  // Track user journey
  async trackUserJourney(step: string, params?: Record<string, any>) {
    await FirebaseKit.analytics.logEvent({
      name: `journey_${step}`,
      params: {
        timestamp: Date.now(),
        ...params
      }
    });
  }
}
```

### Performance Monitoring Example

```typescript
export class PerformanceService {
  private traces = new Map<string, string>();
  
  // Monitor API calls
  async trackApiCall<T>(
    url: string,
    method: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const traceName = `api_${method}_${url.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const { traceId } = await FirebaseKit.performance.startTrace({ traceName });
    
    const startTime = Date.now();
    
    try {
      const result = await apiCall();
      
      await FirebaseKit.performance.putAttribute({
        traceId,
        attribute: 'success',
        value: 'true'
      });
      
      await FirebaseKit.performance.putAttribute({
        traceId,
        attribute: 'http_method',
        value: method
      });
      
      return result;
    } catch (error) {
      await FirebaseKit.performance.putAttribute({
        traceId,
        attribute: 'success',
        value: 'false'
      });
      
      await FirebaseKit.performance.putAttribute({
        traceId,
        attribute: 'error_type',
        value: error.constructor.name
      });
      
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      
      await FirebaseKit.performance.setMetric({
        traceId,
        metricName: 'duration',
        value: duration
      });
      
      await FirebaseKit.performance.stopTrace({ traceId });
      
      // Also record as network request
      await FirebaseKit.performance.recordNetworkRequest({
        url,
        httpMethod: method as any,
        duration,
        httpResponseCode: 200 // or actual response code
      });
    }
  }
  
  // Monitor heavy operations
  async trackOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const { traceId } = await FirebaseKit.performance.startTrace({
      traceName: operationName
    });
    
    this.traces.set(operationName, traceId);
    
    try {
      return await operation();
    } finally {
      await FirebaseKit.performance.stopTrace({ traceId });
      this.traces.delete(operationName);
    }
  }
  
  // Add metric to ongoing trace
  async addMetric(operationName: string, metricName: string, value: number) {
    const traceId = this.traces.get(operationName);
    if (traceId) {
      await FirebaseKit.performance.incrementMetric({
        traceId,
        metricName,
        value
      });
    }
  }
  
  // Track screen rendering
  async trackScreenRender(screenName: string, renderFunc: () => Promise<void>) {
    const { traceId } = await FirebaseKit.performance.startScreenTrace({
      screenName
    });
    
    try {
      await renderFunc();
    } finally {
      await FirebaseKit.performance.stopScreenTrace({ traceId });
    }
  }
}
```

### Crashlytics Error Handling

```typescript
export class ErrorHandler {
  // Global error handler
  async handleError(error: Error, context?: string) {
    // Log to Crashlytics
    await FirebaseKit.crashlytics.logException({
      message: error.message,
      code: error.name,
      stackTrace: this.parseStackTrace(error.stack)
    });
    
    // Add context
    if (context) {
      await FirebaseKit.crashlytics.recordBreadcrumb({
        name: 'error_context',
        params: { context }
      });
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }
  
  // Parse stack trace
  private parseStackTrace(stack?: string): StackFrame[] {
    if (!stack) return [];
    
    const lines = stack.split('\n');
    const frames: StackFrame[] = [];
    
    for (const line of lines) {
      const match = line.match(/at (\S+) \((.+):(\d+):(\d+)\)/);
      if (match) {
        frames.push({
          methodName: match[1],
          fileName: match[2],
          lineNumber: parseInt(match[3]),
        });
      }
    }
    
    return frames;
  }
  
  // Track user actions for debugging
  async trackUserAction(action: string, details?: Record<string, any>) {
    await FirebaseKit.crashlytics.recordBreadcrumb({
      name: action,
      params: details
    });
  }
  
  // Set user context
  async setUserContext(userId: string, attributes: Record<string, any>) {
    await FirebaseKit.crashlytics.setUserId({ userId });
    await FirebaseKit.crashlytics.setCustomKeys({
      attributes: {
        ...attributes,
        last_active: new Date().toISOString()
      }
    });
  }
}
```

### AdMob Integration Example

```typescript
export class AdService {
  private bannerShown = false;
  private interstitialReady = false;
  private rewardedReady = false;
  
  async initialize() {
    // Initialize AdMob
    await FirebaseKit.adMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['YOUR_TEST_DEVICE_ID']
    });
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Request consent
    await this.requestConsent();
    
    // Preload ads
    await this.preloadAds();
  }
  
  private setupEventListeners() {
    // Banner events
    FirebaseKit.adMob.addListener('bannerAdLoaded', () => {
      console.log('Banner loaded');
      this.bannerShown = true;
    });
    
    FirebaseKit.adMob.addListener('bannerAdFailedToLoad', (error) => {
      console.error('Banner failed to load:', error);
      this.bannerShown = false;
    });
    
    // Interstitial events
    FirebaseKit.adMob.addListener('interstitialAdLoaded', () => {
      console.log('Interstitial loaded');
      this.interstitialReady = true;
    });
    
    FirebaseKit.adMob.addListener('interstitialAdClosed', () => {
      console.log('Interstitial closed');
      this.interstitialReady = false;
      // Preload next interstitial
      this.loadInterstitial();
    });
    
    // Rewarded events
    FirebaseKit.adMob.addListener('rewardedAdLoaded', () => {
      console.log('Rewarded ad loaded');
      this.rewardedReady = true;
    });
    
    FirebaseKit.adMob.addListener('rewardedAdRewarded', (reward) => {
      console.log(`User earned ${reward.amount} ${reward.type}`);
      // Grant reward to user
      this.grantReward(reward);
    });
    
    FirebaseKit.adMob.addListener('rewardedAdClosed', () => {
      console.log('Rewarded ad closed');
      this.rewardedReady = false;
      // Preload next rewarded ad
      this.loadRewarded();
    });
  }
  
  private async requestConsent() {
    const consentInfo = await FirebaseKit.adMob.requestConsentInfo();
    
    if (consentInfo.isConsentFormAvailable && 
        consentInfo.status === 'required') {
      const status = await FirebaseKit.adMob.showConsentForm();
      console.log('Consent status:', status);
    }
  }
  
  private async preloadAds() {
    await this.loadInterstitial();
    await this.loadRewarded();
  }
  
  // Banner methods
  async showBanner(position: 'top' | 'bottom' = 'bottom') {
    if (this.bannerShown) return;
    
    await FirebaseKit.adMob.showBanner({
      adId: this.getBannerAdId(),
      adSize: 'ADAPTIVE_BANNER',
      position: position === 'top' ? 'TOP_CENTER' : 'BOTTOM_CENTER',
      margin: 0
    });
  }
  
  async hideBanner() {
    if (!this.bannerShown) return;
    await FirebaseKit.adMob.hideBanner();
  }
  
  async removeBanner() {
    if (!this.bannerShown) return;
    await FirebaseKit.adMob.removeBanner();
    this.bannerShown = false;
  }
  
  // Interstitial methods
  private async loadInterstitial() {
    try {
      await FirebaseKit.adMob.loadInterstitial({
        adId: this.getInterstitialAdId()
      });
    } catch (error) {
      console.error('Failed to load interstitial:', error);
    }
  }
  
  async showInterstitial(): Promise<boolean> {
    if (!this.interstitialReady) {
      console.log('Interstitial not ready');
      return false;
    }
    
    try {
      await FirebaseKit.adMob.showInterstitial();
      return true;
    } catch (error) {
      console.error('Failed to show interstitial:', error);
      return false;
    }
  }
  
  // Rewarded methods
  private async loadRewarded() {
    try {
      await FirebaseKit.adMob.loadRewarded({
        adId: this.getRewardedAdId()
      });
    } catch (error) {
      console.error('Failed to load rewarded ad:', error);
    }
  }
  
  async showRewarded(): Promise<boolean> {
    if (!this.rewardedReady) {
      console.log('Rewarded ad not ready');
      return false;
    }
    
    try {
      await FirebaseKit.adMob.showRewarded();
      return true;
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      return false;
    }
  }
  
  private grantReward(reward: { type: string; amount: number }) {
    // Implement your reward logic
    console.log('Granting reward:', reward);
  }
  
  // Ad unit IDs (replace with your actual IDs)
  private getBannerAdId(): string {
    if (Capacitor.getPlatform() === 'ios') {
      return 'ca-app-pub-3940256099942544/2934735716';
    } else {
      return 'ca-app-pub-3940256099942544/6300978111';
    }
  }
  
  private getInterstitialAdId(): string {
    if (Capacitor.getPlatform() === 'ios') {
      return 'ca-app-pub-3940256099942544/4411468910';
    } else {
      return 'ca-app-pub-3940256099942544/1033173712';
    }
  }
  
  private getRewardedAdId(): string {
    if (Capacitor.getPlatform() === 'ios') {
      return 'ca-app-pub-3940256099942544/1712485313';
    } else {
      return 'ca-app-pub-3940256099942544/5224354917';
    }
  }
}
```

### Remote Config Usage

```typescript
export class ConfigService {
  private config: Record<string, any> = {};
  
  async initialize() {
    // Set defaults
    await FirebaseKit.remoteConfig.setDefaults({
      defaults: {
        api_endpoint: 'https://api.example.com',
        feature_flags: {
          new_onboarding: false,
          dark_mode: true,
          premium_features: false
        },
        maintenance_mode: false,
        min_app_version: '1.0.0',
        announcement: {
          enabled: false,
          title: '',
          message: '',
          action_url: ''
        }
      }
    });
    
    // Fetch and activate
    await this.fetchConfig();
    
    // Listen for updates
    FirebaseKit.remoteConfig.addListener('remoteConfigUpdated', async () => {
      await this.fetchConfig();
      this.notifyConfigChange();
    });
  }
  
  private async fetchConfig() {
    const { activated } = await FirebaseKit.remoteConfig.fetchAndActivate();
    if (activated) {
      await this.loadAllValues();
    }
  }
  
  private async loadAllValues() {
    const { values } = await FirebaseKit.remoteConfig.getAll();
    
    for (const [key, value] of Object.entries(values)) {
      this.config[key] = this.parseValue(value);
    }
  }
  
  private parseValue(value: RemoteConfigValue): any {
    // Try to parse as JSON first
    try {
      return JSON.parse(value.asString);
    } catch {
      // If not JSON, return appropriate type
      if (value.asString === 'true' || value.asString === 'false') {
        return value.asBoolean;
      } else if (!isNaN(Number(value.asString))) {
        return value.asNumber;
      }
      return value.asString;
    }
  }
  
  // Get config value
  get<T>(key: string, defaultValue: T): T {
    return this.config[key] ?? defaultValue;
  }
  
  // Check feature flag
  isFeatureEnabled(feature: string): boolean {
    const flags = this.config.feature_flags || {};
    return flags[feature] || false;
  }
  
  // Check maintenance mode
  isMaintenanceMode(): boolean {
    return this.config.maintenance_mode || false;
  }
  
  // Get announcement
  getAnnouncement(): {
    enabled: boolean;
    title: string;
    message: string;
    actionUrl: string;
  } | null {
    const announcement = this.config.announcement;
    if (announcement?.enabled) {
      return announcement;
    }
    return null;
  }
  
  // Check minimum version
  isUpdateRequired(currentVersion: string): boolean {
    const minVersion = this.config.min_app_version;
    if (!minVersion) return false;
    
    return this.compareVersions(currentVersion, minVersion) < 0;
  }
  
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }
    
    return 0;
  }
  
  private notifyConfigChange() {
    // Implement your config change notification logic
    // e.g., emit event, update UI, etc.
  }
}
```

## Complete App Example

Here's a complete example showing how to integrate all services in a real app:

```typescript
// firebase.service.ts
import { FirebaseKit } from 'capacitor-firebase-kit';
import { Capacitor } from '@capacitor/core';

export class FirebaseManager {
  private static instance: FirebaseManager;
  
  private analytics: AnalyticsService;
  private performance: PerformanceService;
  private crashlytics: ErrorHandler;
  private config: ConfigService;
  private ads: AdService;
  
  private constructor() {
    this.analytics = new AnalyticsService();
    this.performance = new PerformanceService();
    this.crashlytics = new ErrorHandler();
    this.config = new ConfigService();
    this.ads = new AdService();
  }
  
  static getInstance(): FirebaseManager {
    if (!FirebaseManager.instance) {
      FirebaseManager.instance = new FirebaseManager();
    }
    return FirebaseManager.instance;
  }
  
  async initialize() {
    try {
      // Initialize all services
      await this.initializeAppCheck();
      await this.analytics.initialize();
      await this.performance.initialize();
      await this.crashlytics.initialize();
      await this.config.initialize();
      
      // Initialize ads if not in maintenance mode
      if (!this.config.isMaintenanceMode()) {
        await this.ads.initialize();
      }
      
      // Check for app updates
      await this.checkForUpdates();
      
      // Show announcements
      await this.showAnnouncements();
      
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      // Continue app execution even if some services fail
    }
  }
  
  private async initializeAppCheck() {
    const platform = Capacitor.getPlatform();
    
    const providers = {
      ios: 'deviceCheck',
      android: 'playIntegrity',
      web: 'recaptchaV3'
    };
    
    await FirebaseKit.appCheck.initialize({
      provider: providers[platform] || 'debug',
      siteKey: platform === 'web' ? process.env.RECAPTCHA_SITE_KEY : undefined,
      isTokenAutoRefreshEnabled: true
    });
  }
  
  private async checkForUpdates() {
    const currentVersion = await this.getAppVersion();
    if (this.config.isUpdateRequired(currentVersion)) {
      // Show update dialog
      this.showUpdateDialog();
    }
  }
  
  private async showAnnouncements() {
    const announcement = this.config.getAnnouncement();
    if (announcement) {
      // Show announcement dialog
      this.showAnnouncementDialog(announcement);
    }
  }
  
  // Public methods for app to use
  
  async trackScreen(name: string) {
    await this.analytics.trackScreenView(name);
  }
  
  async trackEvent(name: string, params?: Record<string, any>) {
    await FirebaseKit.analytics.logEvent({ name, params });
  }
  
  async trackError(error: Error, context?: string) {
    await this.crashlytics.handleError(error, context);
  }
  
  async trackApiCall<T>(
    url: string,
    method: string,
    call: () => Promise<T>
  ): Promise<T> {
    return this.performance.trackApiCall(url, method, call);
  }
  
  getFeatureFlag(flag: string): boolean {
    return this.config.isFeatureEnabled(flag);
  }
  
  async showAd(type: 'banner' | 'interstitial' | 'rewarded') {
    switch (type) {
      case 'banner':
        await this.ads.showBanner();
        break;
      case 'interstitial':
        await this.ads.showInterstitial();
        break;
      case 'rewarded':
        await this.ads.showRewarded();
        break;
    }
  }
  
  // Helper methods
  
  private async getAppVersion(): Promise<string> {
    // Get from your app config
    return '1.0.0';
  }
  
  private showUpdateDialog() {
    // Implement update dialog
  }
  
  private showAnnouncementDialog(announcement: any) {
    // Implement announcement dialog
  }
}

// Usage in your app
const firebase = FirebaseManager.getInstance();

// In app initialization
await firebase.initialize();

// Track screens
await firebase.trackScreen('Home');

// Track events
await firebase.trackEvent('button_click', { button_id: 'purchase' });

// Handle errors
try {
  // Your code
} catch (error) {
  await firebase.trackError(error, 'purchase_flow');
}

// Check feature flags
if (firebase.getFeatureFlag('new_feature')) {
  // Show new feature
}

// Track API calls
const data = await firebase.trackApiCall(
  '/api/users',
  'GET',
  async () => {
    const response = await fetch('/api/users');
    return response.json();
  }
);
```

## Best Practices

### 1. Error Handling

Always wrap Firebase calls in try-catch blocks:

```typescript
async function safeFirebaseCall<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    console.error('Firebase operation failed:', error);
    await FirebaseKit.crashlytics.logException({
      message: error.message,
      code: error.code || 'UNKNOWN'
    });
    return fallback;
  }
}

// Usage
const token = await safeFirebaseCall(
  () => FirebaseKit.appCheck.getToken(),
  { token: '', expireTimeMillis: 0 }
);
```

### 2. Performance Optimization

Use performance monitoring strategically:

```typescript
class PerformanceOptimizer {
  private criticalTraces = new Set<string>();
  
  async trackCriticalOperation<T>(
    name: string,
    operation: () => Promise<T>
  ): Promise<T> {
    // Only track if not already tracking
    if (this.criticalTraces.has(name)) {
      return operation();
    }
    
    this.criticalTraces.add(name);
    
    try {
      return await this.performance.trackOperation(name, operation);
    } finally {
      this.criticalTraces.delete(name);
    }
  }
}
```

### 3. Privacy and Consent

Respect user privacy:

```typescript
class PrivacyManager {
  private consentGiven = false;
  
  async requestConsent(): Promise<boolean> {
    // Check if consent already given
    const saved = localStorage.getItem('analytics_consent');
    if (saved === 'true') {
      this.consentGiven = true;
      return true;
    }
    
    // Show consent dialog
    const consent = await this.showConsentDialog();
    
    if (consent) {
      localStorage.setItem('analytics_consent', 'true');
      await this.enableTracking();
    } else {
      await this.disableTracking();
    }
    
    this.consentGiven = consent;
    return consent;
  }
  
  private async enableTracking() {
    await FirebaseKit.analytics.setCollectionEnabled({ enabled: true });
    await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({ enabled: true });
    await FirebaseKit.performance.setPerformanceCollectionEnabled({ enabled: true });
  }
  
  private async disableTracking() {
    await FirebaseKit.analytics.setCollectionEnabled({ enabled: false });
    await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({ enabled: false });
    await FirebaseKit.performance.setPerformanceCollectionEnabled({ enabled: false });
  }
  
  private async showConsentDialog(): Promise<boolean> {
    // Implement your consent dialog
    return true;
  }
}
```

### 4. Testing

Use debug providers for testing:

```typescript
class TestingConfig {
  static async setupForTesting() {
    // Use debug providers
    await FirebaseKit.appCheck.initialize({
      provider: 'debug',
      debugToken: 'YOUR_DEBUG_TOKEN'
    });
    
    // Use test ad IDs
    await FirebaseKit.adMob.initialize({
      testingDevices: ['YOUR_TEST_DEVICE'],
      initializeForTesting: true
    });
    
    // Disable crash collection in development
    if (process.env.NODE_ENV === 'development') {
      await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({
        enabled: false
      });
    }
  }
}
```

### 5. Memory Management

Clean up listeners properly:

```typescript
class ComponentWithFirebase {
  private listeners: PluginListenerHandle[] = [];
  
  async onMount() {
    // Add listeners
    this.listeners.push(
      await FirebaseKit.appCheck.addListener(
        'appCheckTokenChanged',
        this.handleTokenChange
      ),
      await FirebaseKit.remoteConfig.addListener(
        'remoteConfigUpdated',
        this.handleConfigUpdate
      )
    );
  }
  
  async onUnmount() {
    // Remove all listeners
    await Promise.all(
      this.listeners.map(listener => listener.remove())
    );
    this.listeners = [];
  }
  
  private handleTokenChange = (token: AppCheckTokenResult) => {
    // Handle token change
  };
  
  private handleConfigUpdate = (update: RemoteConfigUpdate) => {
    // Handle config update
  };
}
```

## Migration Guide

### From Other Firebase Plugins

If you're migrating from other Capacitor Firebase plugins:

```typescript
// Old plugin style
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
await FirebaseAnalytics.logEvent({ name: 'event_name' });

// New unified style
import { FirebaseKit } from 'capacitor-firebase-kit';
await FirebaseKit.analytics.logEvent({ name: 'event_name' });
```

### Key Differences

1. **Unified API**: All Firebase services are accessed through a single `FirebaseKit` object
2. **Nested Structure**: Services are organized logically (e.g., `FirebaseKit.analytics`, `FirebaseKit.crashlytics`)
3. **TypeScript First**: Full type safety with comprehensive interfaces
4. **Consistent Patterns**: All methods follow similar patterns for options and returns

### Migration Checklist

- [ ] Update imports to use `capacitor-firebase-kit`
- [ ] Replace individual service calls with `FirebaseKit.service.method()`
- [ ] Update event listener registrations
- [ ] Review error handling (now uses typed error codes)
- [ ] Update any custom TypeScript types to use exported interfaces
- [ ] Test thoroughly on all platforms

## Conclusion

This guide covered the complete integration of Capacitor Firebase Kit into your application. Remember to:

1. Always handle errors gracefully
2. Respect user privacy and consent
3. Test thoroughly on all platforms
4. Monitor performance impact
5. Keep Firebase SDKs updated

For more details, refer to the [API Documentation](./API.md) and [Troubleshooting Guide](./TROUBLESHOOTING.md).