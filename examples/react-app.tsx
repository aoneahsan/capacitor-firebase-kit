import React, { useEffect, useState } from 'react';
import firebaseKit from 'capacitor-firebase-kit';

// Example: React Web App using Firebase Kit
export function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    // Initialize Firebase Kit - no provider needed!
    firebaseKit.initialize({
      apiKey: 'YOUR_API_KEY',
      authDomain: 'YOUR_AUTH_DOMAIN',
      projectId: 'YOUR_PROJECT_ID',
      storageBucket: 'YOUR_STORAGE_BUCKET',
      messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
      appId: 'YOUR_APP_ID',
      measurementId: 'YOUR_MEASUREMENT_ID',
    }).then(() => {
      setIsInitialized(true);
      
      // Check if analytics is supported
      firebaseKit.analytics.isSupported().then(({ isSupported }) => {
        setAnalyticsEnabled(isSupported);
      });
    });
  }, []);

  const trackEvent = async () => {
    // No need for hooks or context - just call the API directly
    await firebaseKit.analytics.logEvent('button_click', {
      button_name: 'track_event',
      screen_name: 'home',
    });
  };

  const initializeAppCheck = async () => {
    await firebaseKit.appCheck.initialize({
      provider: 'recaptcha-v3',
      siteKey: 'YOUR_RECAPTCHA_SITE_KEY',
      isTokenAutoRefreshEnabled: true,
    });
  };

  const fetchRemoteConfig = async () => {
    await firebaseKit.remoteConfig.initialize({
      minimumFetchIntervalMillis: 3600000,
      defaultConfig: {
        welcome_message: 'Welcome to Firebase Kit!',
        feature_enabled: false,
      },
    });

    const { activated } = await firebaseKit.remoteConfig.fetchAndActivate();
    console.log('Remote config activated:', activated);

    const { value } = await firebaseKit.remoteConfig.getString('welcome_message');
    console.log('Welcome message:', value);
  };

  const startPerformanceTrace = async () => {
    const { traceId } = await firebaseKit.performance.startTrace('custom_trace');
    
    // Do some work...
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await firebaseKit.performance.stopTrace('custom_trace');
  };

  return (
    <div>
      <h1>React App with Firebase Kit</h1>
      <p>Firebase Kit initialized: {isInitialized ? 'Yes' : 'No'}</p>
      <p>Analytics supported: {analyticsEnabled ? 'Yes' : 'No'}</p>
      
      <button onClick={trackEvent}>Track Event</button>
      <button onClick={initializeAppCheck}>Initialize App Check</button>
      <button onClick={fetchRemoteConfig}>Fetch Remote Config</button>
      <button onClick={startPerformanceTrace}>Start Performance Trace</button>
    </div>
  );
}

// Works in dynamically injected components too!
export function DynamicComponent() {
  const logDynamicEvent = () => {
    // No provider needed - works anywhere
    firebaseKit.analytics.logEvent('dynamic_component_interaction', {
      component_type: 'dynamic',
    });
  };

  return (
    <button onClick={logDynamicEvent}>
      Log from Dynamic Component
    </button>
  );
}