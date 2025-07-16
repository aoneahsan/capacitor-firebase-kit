# AdMob Service

Google AdMob is a mobile advertising platform that allows you to monetize your app with ads. This service supports banner, interstitial, and rewarded ads with proper consent management.

## Overview

AdMob provides multiple ad formats:
- **Banner Ads**: Small rectangular ads displayed at top/bottom of screen
- **Interstitial Ads**: Full-screen ads shown at natural transition points
- **Rewarded Ads**: Full-screen ads that reward users for watching
- **Rewarded Interstitial Ads**: Skippable full-screen ads with rewards

## Setup

### 1. Create AdMob Account

1. Sign up at [AdMob Console](https://admob.google.com)
2. Create your app
3. Generate ad units for each ad format
4. Get your AdMob App ID

### 2. Configure Platform

#### Android Setup

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
    <!-- AdMob App ID -->
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"/>
    
    <!-- Optional: Delay app measurement -->
    <meta-data
        android:name="com.google.android.gms.ads.DELAY_APP_MEASUREMENT_INIT"
        android:value="true"/>
</application>
```

#### iOS Setup

Add to `ios/App/App/Info.plist`:

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy</string>

<!-- For iOS 14+ App Tracking Transparency -->
<key>NSUserTrackingUsageDescription</key>
<string>This app uses tracking to provide personalized ads.</string>
```

### 3. Initialize AdMob

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

await FirebaseKit.adMob.initialize({
  requestTrackingAuthorization: true, // iOS only
  testingDevices: ['YOUR_TEST_DEVICE_ID'] // Optional
});
```

## Test Ad Units

Use these test ad units during development:

```typescript
const TEST_AD_UNITS = {
  banner: {
    android: 'ca-app-pub-3940256099942544/6300978111',
    ios: 'ca-app-pub-3940256099942544/2934735716'
  },
  interstitial: {
    android: 'ca-app-pub-3940256099942544/1033173712',
    ios: 'ca-app-pub-3940256099942544/4411468910'
  },
  rewarded: {
    android: 'ca-app-pub-3940256099942544/5224354917',
    ios: 'ca-app-pub-3940256099942544/1712485313'
  },
  rewardedInterstitial: {
    android: 'ca-app-pub-3940256099942544/5354046379',
    ios: 'ca-app-pub-3940256099942544/6978759866'
  }
};
```

## Consent Management

### Request Consent Information

```typescript
const consentInfo = await FirebaseKit.adMob.requestConsentInfo({
  tagForUnderAgeOfConsent: false,
  debugGeography: 'DISABLED' // Use 'EEA' for testing in Europe
});

console.log('Consent status:', consentInfo.status);
console.log('Form available:', consentInfo.isConsentFormAvailable);
```

### Show Consent Form

```typescript
if (consentInfo.isConsentFormAvailable) {
  const updatedConsentInfo = await FirebaseKit.adMob.showConsentForm();
  console.log('Updated consent status:', updatedConsentInfo.status);
}
```

## Banner Ads

### Basic Banner Ad

```typescript
await FirebaseKit.adMob.showBanner({
  adId: 'ca-app-pub-3940256099942544/6300978111',
  adSize: 'BANNER',
  position: 'BOTTOM_CENTER'
});
```

### Banner Ad Sizes

```typescript
type BannerAdSize = 
  | 'BANNER'              // 320x50
  | 'LARGE_BANNER'        // 320x100
  | 'MEDIUM_RECTANGLE'    // 300x250
  | 'FULL_BANNER'         // 468x60
  | 'LEADERBOARD'         // 728x90
  | 'SMART_BANNER'        // Screen width x 32|50|90
  | 'ADAPTIVE_BANNER';    // Responsive height
```

### Banner Ad Positions

```typescript
type BannerAdPosition = 
  | 'TOP_CENTER'
  | 'TOP_LEFT'
  | 'TOP_RIGHT'
  | 'BOTTOM_CENTER'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_RIGHT';
```

### Banner Ad Management

```typescript
// Show banner
await FirebaseKit.adMob.showBanner({
  adId: 'your-banner-ad-id',
  adSize: 'BANNER',
  position: 'BOTTOM_CENTER'
});

// Hide banner (keeps in memory)
await FirebaseKit.adMob.hideBanner();

// Resume banner (if hidden)
await FirebaseKit.adMob.resumeBanner();

// Remove banner (removes from memory)
await FirebaseKit.adMob.removeBanner();
```

## Interstitial Ads

### Load and Show Interstitial

```typescript
try {
  // Load the ad
  await FirebaseKit.adMob.loadInterstitial({
    adId: 'ca-app-pub-3940256099942544/1033173712'
  });

  // Show when ready (e.g., between levels)
  await FirebaseKit.adMob.showInterstitial();
} catch (error) {
  console.error('Interstitial ad error:', error);
}
```

### Interstitial Best Practices

```typescript
class InterstitialManager {
  private isLoaded = false;
  private isShowing = false;

  async loadAd() {
    if (this.isLoaded || this.isShowing) return;

    try {
      await FirebaseKit.adMob.loadInterstitial({
        adId: 'your-interstitial-ad-id'
      });
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load interstitial:', error);
    }
  }

  async showAd() {
    if (!this.isLoaded || this.isShowing) return;

    try {
      this.isShowing = true;
      await FirebaseKit.adMob.showInterstitial();
    } catch (error) {
      console.error('Failed to show interstitial:', error);
    } finally {
      this.isLoaded = false;
      this.isShowing = false;
      // Load next ad
      setTimeout(() => this.loadAd(), 1000);
    }
  }
}
```

## Rewarded Ads

### Load and Show Rewarded Ad

```typescript
try {
  // Load the ad
  await FirebaseKit.adMob.loadRewarded({
    adId: 'ca-app-pub-3940256099942544/5224354917'
  });

  // Show when user wants reward
  await FirebaseKit.adMob.showRewarded();
} catch (error) {
  console.error('Rewarded ad error:', error);
}
```

### Handle Rewards

```typescript
// Listen for reward events
const rewardListener = await FirebaseKit.adMob.addListener(
  'rewardedAdRewarded',
  (reward) => {
    console.log(`User earned ${reward.amount} ${reward.type}`);
    // Grant reward to user
    grantReward(reward.amount, reward.type);
  }
);

// Listen for other events
const dismissListener = await FirebaseKit.adMob.addListener(
  'rewardedAdDismissed',
  () => {
    console.log('Rewarded ad dismissed');
    // Load next ad
    loadNextRewardedAd();
  }
);
```

## Rewarded Interstitial Ads

```typescript
try {
  // Load the ad
  await FirebaseKit.adMob.loadRewardedInterstitial({
    adId: 'ca-app-pub-3940256099942544/5354046379'
  });

  // Show when appropriate
  await FirebaseKit.adMob.showRewardedInterstitial();
} catch (error) {
  console.error('Rewarded interstitial error:', error);
}
```

## Event Handling

### Complete Event Handling Example

```typescript
class AdMobManager {
  private listeners: PluginListenerHandle[] = [];

  async initialize() {
    // Initialize AdMob
    await FirebaseKit.adMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['YOUR_TEST_DEVICE_ID']
    });

    // Setup event listeners
    this.setupEventListeners();
  }

  private async setupEventListeners() {
    // Banner events
    this.listeners.push(
      await FirebaseKit.adMob.addListener('bannerAdLoaded', () => {
        console.log('Banner ad loaded');
      }),
      await FirebaseKit.adMob.addListener('bannerAdFailedToLoad', (error) => {
        console.error('Banner ad failed to load:', error);
      })
    );

    // Interstitial events
    this.listeners.push(
      await FirebaseKit.adMob.addListener('interstitialAdLoaded', () => {
        console.log('Interstitial ad loaded');
      }),
      await FirebaseKit.adMob.addListener('interstitialAdFailedToLoad', (error) => {
        console.error('Interstitial ad failed to load:', error);
      }),
      await FirebaseKit.adMob.addListener('interstitialAdDismissed', () => {
        console.log('Interstitial ad dismissed');
        // Load next ad
        this.loadNextInterstitial();
      })
    );

    // Rewarded events
    this.listeners.push(
      await FirebaseKit.adMob.addListener('rewardedAdRewarded', (reward) => {
        console.log(`User rewarded: ${reward.amount} ${reward.type}`);
        this.handleReward(reward);
      }),
      await FirebaseKit.adMob.addListener('rewardedAdDismissed', () => {
        console.log('Rewarded ad dismissed');
        this.loadNextRewarded();
      })
    );
  }

  private handleReward(reward: AdMobReward) {
    // Grant reward to user
    switch (reward.type) {
      case 'coins':
        addCoins(reward.amount);
        break;
      case 'lives':
        addLives(reward.amount);
        break;
      default:
        console.log('Unknown reward type:', reward.type);
    }
  }

  cleanup() {
    // Remove all listeners
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }
}
```

## Ad Frequency Management

### Implement Ad Frequency Capping

```typescript
class AdFrequencyManager {
  private lastInterstitialTime = 0;
  private interstitialInterval = 5 * 60 * 1000; // 5 minutes

  canShowInterstitial(): boolean {
    const now = Date.now();
    return now - this.lastInterstitialTime >= this.interstitialInterval;
  }

  async showInterstitialIfReady() {
    if (!this.canShowInterstitial()) {
      console.log('Interstitial cooldown active');
      return;
    }

    try {
      await FirebaseKit.adMob.showInterstitial();
      this.lastInterstitialTime = Date.now();
    } catch (error) {
      console.error('Failed to show interstitial:', error);
    }
  }
}
```

## Revenue Optimization

### A/B Testing Different Ad Placements

```typescript
class AdPlacementTester {
  private testGroup: 'A' | 'B' = Math.random() > 0.5 ? 'A' : 'B';

  getBannerPosition(): BannerAdPosition {
    return this.testGroup === 'A' ? 'TOP_CENTER' : 'BOTTOM_CENTER';
  }

  async showBannerWithTesting() {
    await FirebaseKit.adMob.showBanner({
      adId: 'your-banner-ad-id',
      adSize: 'BANNER',
      position: this.getBannerPosition()
    });

    // Track placement performance
    await FirebaseKit.analytics.logEvent({
      name: 'banner_placement_test',
      params: { test_group: this.testGroup }
    });
  }
}
```

## Error Handling

### Robust Error Handling

```typescript
async function safelyShowInterstitial() {
  try {
    await FirebaseKit.adMob.loadInterstitial({
      adId: 'your-interstitial-ad-id'
    });
    
    await FirebaseKit.adMob.showInterstitial();
  } catch (error) {
    switch (error.code) {
      case 'AD_ALREADY_LOADED':
        console.log('Ad already loaded, showing existing ad');
        await FirebaseKit.adMob.showInterstitial();
        break;
      case 'AD_NOT_LOADED':
        console.log('Ad not loaded, loading first');
        await FirebaseKit.adMob.loadInterstitial({
          adId: 'your-interstitial-ad-id'
        });
        break;
      case 'AD_FAILED_TO_LOAD':
        console.error('Ad failed to load:', error.message);
        // Maybe try again later
        break;
      case 'AD_FAILED_TO_SHOW':
        console.error('Ad failed to show:', error.message);
        break;
      default:
        console.error('Unknown ad error:', error);
    }
  }
}
```

## Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Banner Ads | ✅ | ✅ | ❌ |
| Interstitial Ads | ✅ | ✅ | ❌ |
| Rewarded Ads | ✅ | ✅ | ❌ |
| Rewarded Interstitial | ✅ | ✅ | ❌ |
| Consent Management | ✅ | ✅ | ❌ |
| App Tracking Transparency | ✅ | ❌ | ❌ |

## Best Practices

### 1. Consent Management
- Always request consent before showing ads
- Handle consent changes gracefully
- Respect user privacy preferences

### 2. Ad Placement
- Show interstitials at natural break points
- Don't interrupt user actions
- Respect frequency caps

### 3. Performance
- Pre-load ads when possible
- Handle loading states gracefully
- Monitor ad performance metrics

### 4. User Experience
- Provide clear value for rewarded ads
- Don't show too many ads
- Ensure ads are relevant to your audience

### 5. Testing
- Use test ad units during development
- Test on real devices
- Test different ad placements and sizes

## Additional Resources

- [AdMob Documentation](https://developers.google.com/admob)
- [AdMob Policy Guidelines](https://support.google.com/admob/answer/6128877)
- [App Tracking Transparency](https://developer.apple.com/app-store/user-privacy-and-data-use/)
- [GDPR Compliance](https://developers.google.com/admob/android/privacy/gdpr)