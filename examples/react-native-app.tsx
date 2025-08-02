import React, { useEffect } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import firebaseKit from 'capacitor-firebase-kit';

// Example: React Native App using Firebase Kit
export function App() {
  useEffect(() => {
    // Initialize Firebase Kit
    // Note: React Native Firebase auto-initializes from native config files
    // So you just need to call this to set up the Firebase Kit instance
    firebaseKit.initialize({
      // Config is read from google-services.json (Android) and GoogleService-Info.plist (iOS)
    });
  }, []);

  const trackScreenView = async () => {
    await firebaseKit.analytics.setCurrentScreen('home_screen', 'HomeScreen');
    await firebaseKit.analytics.logEvent('screen_view', {
      screen_name: 'home_screen',
      screen_class: 'HomeScreen',
    });
  };

  const testCrashlytics = async () => {
    // Set user information
    await firebaseKit.crashlytics.setUserId('user123');
    await firebaseKit.crashlytics.setCustomKeys({
      str_key: 'hello',
      int_key: 123,
      bool_key: true,
    });

    // Log a message
    await firebaseKit.crashlytics.log('User clicked test crash button');

    // Force a crash (only in test/debug builds)
    try {
      throw new Error('Test crash from React Native');
    } catch (error) {
      await firebaseKit.crashlytics.recordException(error);
    }
  };

  const showAd = async () => {
    try {
      // Initialize AdMob
      await firebaseKit.adMob.initialize({
        testMode: __DEV__, // Use test ads in development
      });

      // Show interstitial ad
      await firebaseKit.adMob.prepareInterstitial({
        adId: __DEV__ ? 'ca-app-pub-test' : 'YOUR_AD_ID',
        testing: __DEV__,
      });
      
      await firebaseKit.adMob.showInterstitial();
    } catch (error) {
      Alert.alert('Ad Error', error.message);
    }
  };

  const measurePerformance = async () => {
    // Start a custom trace
    const { traceId } = await firebaseKit.performance.startTrace('api_call');
    
    try {
      // Simulate API call
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      
      // Add custom metrics
      await firebaseKit.performance.incrementMetric('api_call', 'response_size', data.length);
      
    } finally {
      // Stop the trace
      await firebaseKit.performance.stopTrace('api_call');
    }
  };

  const initializeAppCheck = async () => {
    try {
      await firebaseKit.appCheck.initialize({
        provider: 'playIntegrity', // or 'deviceCheck' for iOS
        isTokenAutoRefreshEnabled: true,
      });
      
      // Get App Check token
      const { token } = await firebaseKit.appCheck.getToken();
      console.log('App Check token obtained');
    } catch (error) {
      console.error('App Check error:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        React Native Firebase Kit
      </Text>
      
      <Button title="Track Screen View" onPress={trackScreenView} />
      <View style={{ height: 10 }} />
      
      <Button title="Test Crashlytics" onPress={testCrashlytics} />
      <View style={{ height: 10 }} />
      
      <Button title="Show Ad" onPress={showAd} />
      <View style={{ height: 10 }} />
      
      <Button title="Measure Performance" onPress={measurePerformance} />
      <View style={{ height: 10 }} />
      
      <Button title="Initialize App Check" onPress={initializeAppCheck} />
    </View>
  );
}

// Works in any component without providers
export function NestedComponent() {
  const logPurchase = () => {
    // Direct API call - no hooks or context needed
    firebaseKit.analytics.logEvent('purchase', {
      value: 9.99,
      currency: 'USD',
      items: ['item_1', 'item_2'],
    });
  };

  return (
    <Button title="Log Purchase" onPress={logPurchase} />
  );
}