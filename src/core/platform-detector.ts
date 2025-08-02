export type Platform = 'web' | 'react-native' | 'capacitor' | 'node';

export interface PlatformInfo {
  platform: Platform;
  isWeb: boolean;
  isReactNative: boolean;
  isCapacitor: boolean;
  isNode: boolean;
  hasDOM: boolean;
}

class PlatformDetector {
  private cachedPlatform: PlatformInfo | null = null;

  detect(): PlatformInfo {
    if (this.cachedPlatform) {
      return this.cachedPlatform;
    }

    const info: PlatformInfo = {
      platform: 'web',
      isWeb: false,
      isReactNative: false,
      isCapacitor: false,
      isNode: false,
      hasDOM: false,
    };

    // Check if we're in Node.js environment
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      info.platform = 'node';
      info.isNode = true;
      this.cachedPlatform = info;
      return info;
    }

    // Check for DOM availability
    info.hasDOM = typeof window !== 'undefined' && typeof document !== 'undefined';

    // Check for React Native
    if (typeof global !== 'undefined' && (global as any).nativePerformanceNow) {
      info.platform = 'react-native';
      info.isReactNative = true;
      this.cachedPlatform = info;
      return info;
    }

    // Check for Capacitor
    if (info.hasDOM && (window as any).Capacitor) {
      info.platform = 'capacitor';
      info.isCapacitor = true;
      this.cachedPlatform = info;
      return info;
    }

    // Default to web
    if (info.hasDOM) {
      info.platform = 'web';
      info.isWeb = true;
    }

    this.cachedPlatform = info;
    return info;
  }

  reset(): void {
    this.cachedPlatform = null;
  }
}

export const platformDetector = new PlatformDetector();