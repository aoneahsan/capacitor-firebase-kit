import { registerPlugin } from '@capacitor/core';
import { createFirebaseKitProxy } from './plugin-proxy';
import type { FirebaseKitPlugin } from './definitions';

/**
 * Register the Firebase Kit plugin with Capacitor.
 * This handles the native bridge for iOS and Android platforms,
 * and loads the web implementation for web platforms.
 * 
 * @internal
 */
const FirebaseKitNative = registerPlugin('FirebaseKit', {
  web: () => import('./plugin-implementation').then(m => new m.FirebaseKitPluginImplementation()),
});

/**
 * Capacitor Firebase Kit - Complete Firebase services integration for Capacitor applications.
 * 
 * This plugin provides a unified interface for all Firebase services including:
 * - App Check: Protect your backend resources from abuse
 * - AdMob: Monetize your app with Google AdMob
 * - Analytics: Track user behavior and app usage
 * - Crashlytics: Real-time crash reporting
 * - Performance: Monitor app performance metrics
 * - Remote Config: Dynamic app configuration
 * 
 * @public
 * @since 1.0.0
 * @example
 * ```typescript
 * import { FirebaseKit } from 'capacitor-firebase-kit';
 * 
 * // Initialize App Check
 * await FirebaseKit.appCheck.initialize({
 *   provider: 'playIntegrity',
 *   isTokenAutoRefreshEnabled: true
 * });
 * 
 * // Track an analytics event
 * await FirebaseKit.analytics.logEvent({
 *   name: 'app_open',
 *   params: { source: 'notification' }
 * });
 * 
 * // Show an ad
 * await FirebaseKit.adMob.showBanner({
 *   adId: 'ca-app-pub-xxx/yyy',
 *   adSize: 'BANNER',
 *   position: 'BOTTOM_CENTER'
 * });
 * ```
 */
const FirebaseKit = createFirebaseKitProxy(FirebaseKitNative) as FirebaseKitPlugin;

// Export all type definitions
export * from './definitions';

// Export the main plugin instance
export { FirebaseKit };