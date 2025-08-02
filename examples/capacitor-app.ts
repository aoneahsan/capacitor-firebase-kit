import { Capacitor } from '@capacitor/core';
import firebaseKit from 'capacitor-firebase-kit';

// Example: Capacitor App using Firebase Kit
export class FirebaseService {
  async initialize() {
    // Initialize Firebase Kit for Capacitor
    await firebaseKit.initialize({
      // Config can be provided here or read from native config files
      apiKey: 'YOUR_API_KEY',
      authDomain: 'YOUR_AUTH_DOMAIN',
      projectId: 'YOUR_PROJECT_ID',
      storageBucket: 'YOUR_STORAGE_BUCKET',
      messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
      appId: 'YOUR_APP_ID',
    });

    // Platform-specific initialization
    if (Capacitor.getPlatform() === 'ios') {
      await this.setupIOSAppCheck();
    } else if (Capacitor.getPlatform() === 'android') {
      await this.setupAndroidAppCheck();
    }
  }

  private async setupIOSAppCheck() {
    await firebaseKit.appCheck.initialize({
      provider: 'deviceCheck',
      isTokenAutoRefreshEnabled: true,
    });
  }

  private async setupAndroidAppCheck() {
    await firebaseKit.appCheck.initialize({
      provider: 'playIntegrity',
      isTokenAutoRefreshEnabled: true,
    });
  }

  async trackUserBehavior(userId: string) {
    // Set user ID for all services
    await firebaseKit.analytics.setUserId(userId);
    await firebaseKit.crashlytics.setUserId(userId);

    // Set user properties
    await firebaseKit.analytics.setUserProperties({
      subscription_type: 'premium',
      account_created: new Date().toISOString(),
    });

    // Log sign in event
    await firebaseKit.analytics.logEvent('login', {
      method: 'email',
    });
  }

  async showBannerAd() {
    await firebaseKit.adMob.showBanner({
      adId: Capacitor.getPlatform() === 'ios' 
        ? 'ca-app-pub-ios-banner-id' 
        : 'ca-app-pub-android-banner-id',
      adSize: 'BANNER',
      position: 'BOTTOM_CENTER',
      margin: 0,
      isTesting: false,
    });
  }

  async loadRemoteFeatures() {
    // Initialize remote config with defaults
    await firebaseKit.remoteConfig.initialize({
      minimumFetchIntervalMillis: 43200000, // 12 hours
      defaultConfig: {
        feature_dark_mode: false,
        feature_premium_content: false,
        api_endpoint: 'https://api.example.com',
        max_upload_size: 10485760, // 10MB
      },
    });

    // Fetch and activate
    const { activated } = await firebaseKit.remoteConfig.fetchAndActivate();
    
    if (activated) {
      // Get feature flags
      const { value: darkModeEnabled } = await firebaseKit.remoteConfig.getBoolean('feature_dark_mode');
      const { value: apiEndpoint } = await firebaseKit.remoteConfig.getString('api_endpoint');
      const { value: maxUploadSize } = await firebaseKit.remoteConfig.getNumber('max_upload_size');

      return {
        darkModeEnabled,
        apiEndpoint,
        maxUploadSize,
      };
    }

    return null;
  }

  async monitorAppPerformance() {
    // Enable performance monitoring
    await firebaseKit.performance.setEnabled(true);

    // Start monitoring app startup
    const { traceId } = await firebaseKit.performance.startTrace('app_startup');

    // Add custom metrics during startup
    await firebaseKit.performance.incrementMetric('app_startup', 'modules_loaded', 1);
    await firebaseKit.performance.incrementMetric('app_startup', 'cache_hits', 5);

    // Stop trace when startup is complete
    await firebaseKit.performance.stopTrace('app_startup');
  }

  async handleError(error: Error, context: Record<string, any>) {
    // Log to Crashlytics
    await firebaseKit.crashlytics.recordException(error);
    
    // Add context
    for (const [key, value] of Object.entries(context)) {
      await firebaseKit.crashlytics.setCustomKey(key, value);
    }

    // Also log to analytics
    await firebaseKit.analytics.logEvent('app_error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  }
}

// Usage in Capacitor app
const firebaseService = new FirebaseService();

// Initialize on app start
document.addEventListener('deviceready', async () => {
  await firebaseService.initialize();
  await firebaseService.trackUserBehavior('user123');
  
  // Load remote config
  const features = await firebaseService.loadRemoteFeatures();
  if (features?.darkModeEnabled) {
    document.body.classList.add('dark-mode');
  }
});

// No providers needed - works anywhere in your app
export function logEventFromAnyComponent() {
  firebaseKit.analytics.logEvent('component_interaction', {
    component_name: 'dynamic_component',
    action: 'click',
  });
}