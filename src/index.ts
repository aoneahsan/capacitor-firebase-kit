// Provider-less Firebase Kit API
export { firebaseKit, firebaseKit as default } from './firebase-kit';
export type {
  FirebaseKitConfig,
  AnalyticsService,
  AppCheckService,
  AdMobService,
  CrashlyticsService,
  PerformanceService,
  RemoteConfigService,
} from './firebase-kit';

// Legacy Capacitor plugin support (for backward compatibility)
export { registerCapacitorPlugin } from './legacy/capacitor-plugin';

// Export platform detection utilities
export { platformDetector } from './core/platform-detector';
export type { Platform, PlatformInfo } from './core/platform-detector';

// Export all type definitions
export * from './definitions';

// Export error types explicitly for easier access
export { FirebaseKitErrorCode, FirebaseKitError } from './definitions';