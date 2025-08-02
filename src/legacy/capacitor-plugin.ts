import { createFirebaseKitProxy } from '../plugin-proxy';
import type { FirebaseKitPlugin } from '../definitions';

/**
 * Register the legacy Capacitor plugin for backward compatibility
 *
 * @deprecated Use the new provider-less `firebaseKit` API instead
 * @example
 * ```typescript
 * // Old way (deprecated)
 * import { registerCapacitorPlugin } from 'capacitor-firebase-kit';
 * const FirebaseKit = registerCapacitorPlugin();
 *
 * // New way (recommended)
 * import firebaseKit from 'capacitor-firebase-kit';
 * await firebaseKit.initialize({ ... });
 * ```
 */
export async function registerCapacitorPlugin(): Promise<FirebaseKitPlugin> {
  try {
    const { registerPlugin } = await import('@capacitor/core');

    const FirebaseKitNative = registerPlugin('FirebaseKit', {
      web: () => import('../plugin-implementation').then(m => new m.FirebaseKitPluginImplementation()),
    });

    return createFirebaseKitProxy(FirebaseKitNative) as FirebaseKitPlugin;
  } catch {
    throw new Error('Capacitor not found. Please install @capacitor/core to use the legacy plugin API.');
  }
}