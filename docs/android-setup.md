# Android Setup Guide

## Prerequisites

1. Add your `google-services.json` file to `android/app/`
2. Ensure your app's package name matches the one in Firebase Console

## Gradle Configuration

### Project-level build.gradle

Add to your project-level `build.gradle`:

```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.1'
        classpath 'com.google.firebase:firebase-crashlytics-gradle:3.0.2'
        classpath 'com.google.firebase:perf-plugin:1.4.2'
    }
}
```

### App-level build.gradle

Add to your app-level `build.gradle`:

```gradle
apply plugin: 'com.google.gms.google-services'
apply plugin: 'com.google.firebase.crashlytics'
apply plugin: 'com.google.firebase.firebase-perf'

android {
    compileSdkVersion 34
    
    defaultConfig {
        minSdkVersion 22
        targetSdkVersion 34
    }
}

dependencies {
    // Firebase BOM
    implementation platform('com.google.firebase:firebase-bom:33.7.0')
    
    // Add the dependencies for Firebase products you want to use
    implementation 'com.google.firebase:firebase-analytics'
    implementation 'com.google.firebase:firebase-crashlytics'
    implementation 'com.google.firebase:firebase-perf'
    // ... other Firebase dependencies
}
```

## AndroidManifest.xml

Add the following to your `AndroidManifest.xml`:

```xml
<manifest>
    <!-- Required permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Optional permissions for better ad targeting -->
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    
    <application>
        <!-- AdMob App ID (replace with your actual ID) -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"/>
        
        <!-- Optional: Control Firebase service auto-initialization -->
        <meta-data
            android:name="firebase_crashlytics_collection_enabled"
            android:value="true" />
        
        <meta-data
            android:name="firebase_performance_collection_enabled"
            android:value="true" />
        
        <meta-data
            android:name="firebase_analytics_collection_enabled"
            android:value="true" />
    </application>
</manifest>
```

## ProGuard Rules

If using R8/ProGuard, add these rules to `proguard-rules.pro`:

```pro
# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Plugin classes
-keep class com.ahsanmahmood.capacitor.firebasekit.** { *; }
```

## Network Security Configuration

For Android 9 (API 28) and above, if you need to allow cleartext traffic for development:

1. Create `res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <debug-overrides>
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </debug-overrides>
</network-security-config>
```

2. Reference it in AndroidManifest.xml:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config">
```

## Multidex Support

If you encounter the 64K method limit, enable multidex:

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

## Google Play Services

Ensure Google Play Services is up to date on test devices. The plugin requires:
- Google Play Services 21.0.0 or higher
- Google Play Services Ads 23.6.0 or higher