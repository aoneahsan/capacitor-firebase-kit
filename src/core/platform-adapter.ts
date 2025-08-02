import type { FirebaseKitConfig } from './types';

export abstract class PlatformAdapter {
  protected config: FirebaseKitConfig | null = null;
  protected serviceCache: Map<string, any> = new Map();

  abstract initialize(config: FirebaseKitConfig): Promise<void>;

  abstract getService<T>(serviceName: string): Promise<T>;

  abstract isSupported(serviceName: string): boolean;

  abstract cleanup(): Promise<void>;

  protected async loadServiceModule(serviceName: string): Promise<any> {
    // Base implementation for loading service modules
    // Subclasses will override this with platform-specific logic
    throw new Error(`Service ${serviceName} not implemented for this platform`);
  }

  protected validateConfig(config: FirebaseKitConfig): void {
    if (!config.projectId) {
      throw new Error('FirebaseKit: projectId is required');
    }

    // Additional validation can be added here
  }
}