# Android Platform Guide

Complete guide for using Capacitor Firebase Kit on Android platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Platform-Specific Features](#platform-specific-features)
- [Build Configuration](#build-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

### System Requirements
- Android Studio 4.2 or later
- Java 17 or later (OpenJDK recommended)
- Gradle 8.0 or later
- Android SDK API Level 22 or higher
- Google Play Services

### Firebase Project Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add an Android app to your project
3. Download `google-services.json` file
4. Enable required Firebase services (App Check, AdMob, Analytics, etc.)

## Installation

### 1. Install the Plugin

```bash
npm install capacitor-firebase-kit
npx cap sync android
```

### 2. Add Firebase Configuration

Place your `google-services.json` file in:
```
android/app/google-services.json
```

### 3. Configure Gradle

Add to `android/build.gradle`:
```gradle
buildscript {
    ext.kotlin_version = '1.9.21'
    dependencies {
        classpath 'com.android.tools.build:gradle:8.1.4'
        classpath 'com.google.gms:google-services:4.4.0'
        classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.9'
        classpath 'com.google.firebase:perf-plugin:1.4.2'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}
```

Add to `android/app/build.gradle`:
```gradle
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services'
apply plugin: 'com.google.firebase.crashlytics'
apply plugin: 'com.google.firebase.firebase-perf'

android {
    compileSdkVersion 34
    
    defaultConfig {
        minSdkVersion 22
        targetSdkVersion 34
        
        // AdMob App ID
        manifestPlaceholders = [
            AdMobAppId: "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
        ]
    }
    
    buildFeatures {
        buildConfig true
    }
}

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-analytics'
    implementation 'com.google.firebase:firebase-crashlytics'
    implementation 'com.google.firebase:firebase-perf'
    implementation 'com.google.firebase:firebase-config'
    implementation 'com.google.firebase:firebase-appcheck'
    implementation 'com.google.firebase:firebase-appcheck-playintegrity'
    implementation 'com.google.android.gms:play-services-ads:22.6.0'
    implementation 'androidx.multidex:multidex:2.0.1'
}
```

## Configuration

### AndroidManifest.xml

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.app">
    
    <!-- Internet permission for Firebase services -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Optional: For AdMob -->
    <uses-permission android:name="com.google.android.gms.permission.AD_ID" />
    
    <application
        android:name=".MainApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        
        <!-- AdMob App ID -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="${AdMobAppId}" />
        
        <!-- Firebase Auto-Collection -->
        <meta-data
            android:name="firebase_analytics_collection_enabled"
            android:value="true" />
        
        <meta-data
            android:name="firebase_crashlytics_collection_enabled"
            android:value="true" />
        
        <meta-data
            android:name="firebase_performance_collection_enabled"
            android:value="true" />
        
        <!-- Main Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### Variables Configuration

Update `android/variables.gradle`:
```gradle
ext {
    minSdkVersion = 22
    compileSdkVersion = 34
    targetSdkVersion = 34
    javaVersion = JavaVersion.VERSION_17
    
    // Firebase versions
    firebaseBomVersion = '32.7.0'
    playServicesAdsVersion = '22.6.0'
    
    // Other dependencies
    androidxMultidexVersion = '2.0.1'
}
```

## Platform-Specific Features

### App Check with Play Integrity

Android uses Play Integrity API for App Check:

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// Initialize App Check with Play Integrity
await FirebaseKit.appCheck.initialize({
  provider: 'playIntegrity',
  isTokenAutoRefreshEnabled: true
});
```

### AdMob Integration

Android-specific AdMob features:

```typescript
// Initialize AdMob
await FirebaseKit.adMob.initialize({
  requestTrackingAuthorization: false, // Not needed on Android
  testingDevices: ['DEVICE_ID_HASH'] // For testing
});

// Show banner ad
await FirebaseKit.adMob.showBanner({
  adId: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  adSize: 'BANNER',
  position: 'BOTTOM_CENTER'
});
```

### Crashlytics Integration

Android-specific crash reporting:

```typescript
// Test crash (development only)
await FirebaseKit.crashlytics.crash();

// Log non-fatal exceptions
await FirebaseKit.crashlytics.logException({
  message: 'Custom error message',
  code: 'CUSTOM_ERROR',
  domain: 'android'
});
```

### Performance Monitoring

Android-specific performance features:

```typescript
// Start a trace
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'android_specific_operation'
});

// Add Android-specific attributes
await FirebaseKit.performance.putAttribute({
  traceId,
  attribute: 'device_model',
  value: 'Android'
});

// Stop trace
await FirebaseKit.performance.stopTrace({ traceId });
```

## Build Configuration

### ProGuard Rules

Add to `android/app/proguard-rules.pro`:
```proguard
# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# AdMob
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }

# Capacitor Firebase Kit
-keep class com.ahsanmahmood.capacitor.firebasekit.** { *; }
-keep interface com.ahsanmahmood.capacitor.firebasekit.** { *; }
```

### Multidex Configuration

For apps with many dependencies, add to `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        multiDexEnabled true
    }
}

dependencies {
    implementation 'androidx.multidex:multidex:2.0.1'
}
```

Update `MainApplication.java`:
```java
import androidx.multidex.MultiDexApplication;

public class MainApplication extends MultiDexApplication {
    @Override
    public void onCreate() {
        super.onCreate();
    }
}
```

### Build Variants

Configure different Firebase projects for different build variants:

```gradle
android {
    buildTypes {
        debug {
            applicationIdSuffix ".debug"
            debuggable true
        }
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

Place different `google-services.json` files:
- `android/app/src/debug/google-services.json`
- `android/app/src/release/google-services.json`

## Testing

### Debug Mode

Enable debug logging:
```bash
adb shell setprop log.tag.FirebaseKit VERBOSE
adb shell setprop debug.firebase.analytics.app com.example.app
```

### Test App Check

Use debug provider for testing:
```typescript
await FirebaseKit.appCheck.initialize({
  provider: 'debug',
  debugToken: 'YOUR_DEBUG_TOKEN'
});
```

### Test AdMob

Use test ad unit IDs:
```typescript
const TEST_AD_UNITS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917'
};
```

### Test Crashlytics

Force a crash for testing:
```typescript
// Only in debug builds
if (__DEV__) {
  await FirebaseKit.crashlytics.crash();
}
```

## Troubleshooting

### Common Issues

#### Google Services Plugin Not Applied
```
Error: Plugin with id 'com.google.gms.google-services' not found
```
**Solution:** Add the plugin to `android/build.gradle` buildscript dependencies.

#### Min SDK Version Conflict
```
Error: uses-sdk:minSdkVersion 21 cannot be smaller than version 22
```
**Solution:** Update `android/variables.gradle` to set `minSdkVersion = 22`.

#### Duplicate Firebase Classes
```
Error: Duplicate class com.google.firebase.* found
```
**Solution:** Use Firebase BOM in your dependencies.

#### App Check Token Issues
```
Error: App Check token is invalid
```
**Solution:** Verify Play Integrity is configured correctly in Firebase Console.

#### AdMob Initialization Failed
```
Error: The Google Mobile Ads SDK was initialized incorrectly
```
**Solution:** Ensure AdMob App ID is correctly added to AndroidManifest.xml.

### Debug Commands

```bash
# Clear app data
adb shell pm clear com.example.app

# View Firebase logs
adb logcat | grep Firebase

# Check app permissions
adb shell dumpsys package com.example.app | grep permission

# View crash logs
adb logcat | grep AndroidRuntime
```

## Best Practices

### 1. Resource Management
```kotlin
// Proper lifecycle management in custom activities
class CustomActivity : AppCompatActivity() {
    override fun onPause() {
        super.onPause()
        // Pause ad requests
    }
    
    override fun onResume() {
        super.onResume()
        // Resume ad requests
    }
}
```

### 2. Error Handling
```typescript
// Always handle platform-specific errors
try {
  await FirebaseKit.appCheck.getToken();
} catch (error) {
  if (error.code === 'PLAY_INTEGRITY_NOT_AVAILABLE') {
    // Handle Play Integrity not available
    console.log('Play Integrity not available on this device');
  }
}
```

### 3. Performance Optimization
```typescript
// Batch Firebase operations
const operations = [
  FirebaseKit.analytics.logEvent({ name: 'app_open' }),
  FirebaseKit.performance.startTrace({ traceName: 'startup' }),
  FirebaseKit.crashlytics.log({ message: 'App started' })
];

await Promise.all(operations);
```

### 4. Security
```typescript
// Don't log sensitive information
await FirebaseKit.crashlytics.setCustomKeys({
  attributes: {
    user_type: 'premium', // OK
    // user_email: 'user@example.com' // Don't include PII
  }
});
```

### 5. Testing
```typescript
// Use conditional initialization for testing
const isDebug = __DEV__;
const provider = isDebug ? 'debug' : 'playIntegrity';

await FirebaseKit.appCheck.initialize({
  provider,
  debugToken: isDebug ? 'YOUR_DEBUG_TOKEN' : undefined
});
```

## Additional Resources

- [Firebase Android Setup Guide](https://firebase.google.com/docs/android/setup)
- [Play Integrity API Documentation](https://developer.android.com/google/play/integrity)
- [AdMob Android Implementation](https://developers.google.com/admob/android)
- [Android Gradle Plugin Documentation](https://developer.android.com/studio/releases/gradle-plugin)
- [Firebase Android SDK Reference](https://firebase.google.com/docs/reference/android)

For more help, see the [main troubleshooting guide](../troubleshooting.md).