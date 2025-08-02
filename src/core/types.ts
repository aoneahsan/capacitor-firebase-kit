export interface FirebaseKitConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
  databaseURL?: string;

  // Platform-specific configurations
  android?: {
    googleServicesJson?: string;
  };
  ios?: {
    googleServicesPlist?: string;
  };

  // Service-specific configurations
  appCheck?: {
    provider?: 'recaptcha-v3' | 'recaptcha-enterprise' | 'custom';
    siteKey?: string;
  };
  admob?: {
    testMode?: boolean;
  };
}

export interface FirebaseKitInstance {
  analytics: () => Promise<any>;
  appCheck: () => Promise<any>;
  adMob: () => Promise<any>;
  crashlytics: () => Promise<any>;
  performance: () => Promise<any>;
  remoteConfig: () => Promise<any>;
}

export interface ServiceFactory<T> {
  create(config: FirebaseKitConfig): Promise<T>;
}