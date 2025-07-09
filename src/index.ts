import { registerPlugin } from '@capacitor/core';
import { createFirebaseKitProxy } from './plugin-proxy';
import type { FirebaseKitPlugin } from './definitions';

// Register the plugin
const FirebaseKitNative = registerPlugin('FirebaseKit', {
  web: () => import('./plugin-implementation').then(m => new m.FirebaseKitPluginImplementation()),
});

// Create the proxy to provide the nested service structure
const FirebaseKit = createFirebaseKitProxy(FirebaseKitNative) as FirebaseKitPlugin;

export * from './definitions';
export { FirebaseKit };