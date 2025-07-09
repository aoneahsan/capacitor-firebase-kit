import { registerPlugin } from '@capacitor/core';

import type { FirebaseKitPlugin } from './definitions';

const FirebaseKit = registerPlugin<FirebaseKitPlugin>('FirebaseKit', {
  web: () => import('./web').then(m => new m.FirebaseKitWeb()),
});

export * from './definitions';
export { FirebaseKit };