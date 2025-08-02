import type { FirebaseKitConfig } from './types';
import { platformDetector } from './platform-detector';
import type { PlatformAdapter } from './platform-adapter';

class FirebaseKitSingleton {
  private static instance: FirebaseKitSingleton;
  private initialized = false;
  private config: FirebaseKitConfig | null = null;
  private adapter: PlatformAdapter | null = null;
  private serviceInstances: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): FirebaseKitSingleton {
    if (!FirebaseKitSingleton.instance) {
      FirebaseKitSingleton.instance = new FirebaseKitSingleton();
    }
    return FirebaseKitSingleton.instance;
  }

  async initialize(config: FirebaseKitConfig): Promise<void> {
    if (this.initialized) {
      console.warn('FirebaseKit is already initialized');
      return;
    }

    this.config = config;
    const platformInfo = platformDetector.detect();

    // Dynamically load the appropriate adapter based on platform
    this.adapter = await this.loadPlatformAdapter(platformInfo.platform);
    await this.adapter.initialize(config);

    this.initialized = true;
  }

  private async loadPlatformAdapter(platform: string): Promise<PlatformAdapter> {
    switch (platform) {
      case 'web':
        const { WebAdapter } = await import('../adapters/web-adapter');
        return new WebAdapter();

      case 'react-native':
        const { ReactNativeAdapter } = await import('../adapters/react-native-adapter');
        return new ReactNativeAdapter();

      case 'capacitor':
        const { CapacitorAdapter } = await import('../adapters/capacitor-adapter');
        return new CapacitorAdapter();

      case 'node':
        const { NodeAdapter } = await import('../adapters/node-adapter');
        return new NodeAdapter();

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  async getService<T>(serviceName: string): Promise<T> {
    if (!this.initialized || !this.adapter) {
      throw new Error('FirebaseKit must be initialized before accessing services');
    }

    // Check if service instance already exists
    if (this.serviceInstances.has(serviceName)) {
      return this.serviceInstances.get(serviceName) as T;
    }

    // Lazy load the service
    const service = await this.adapter.getService<T>(serviceName);
    this.serviceInstances.set(serviceName, service);

    return service;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getConfig(): FirebaseKitConfig | null {
    return this.config;
  }

  reset(): void {
    this.initialized = false;
    this.config = null;
    this.adapter = null;
    this.serviceInstances.clear();
  }
}

export const firebaseKitSingleton = FirebaseKitSingleton.getInstance();