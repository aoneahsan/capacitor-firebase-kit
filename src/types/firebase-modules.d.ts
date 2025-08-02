// Type declarations for optional Firebase modules
// These modules are loaded dynamically and may not be installed

declare module 'firebase/app' {
  export function initializeApp(config: any): any;
  export function getApps(): any[];
}

declare module 'firebase/analytics' {
  export function getAnalytics(app: any): any;
  export function logEvent(analytics: any, eventName: string, eventParams?: any): void;
  export function setUserId(analytics: any, id: string): void;
  export function setUserProperties(analytics: any, properties: any): void;
  export function setCurrentScreen(analytics: any, screenName: string): void;
}

declare module 'firebase/app-check' {
  export function initializeAppCheck(app: any, options: any): any;
  export function getToken(appCheck: any, forceRefresh?: boolean): Promise<any>;
  export class ReCaptchaV3Provider {
    constructor(siteKey: string);
  }
  export class ReCaptchaEnterpriseProvider {
    constructor(siteKey: string);
  }
}

declare module 'firebase/performance' {
  export function getPerformance(app: any): any;
  export function trace(perf: any, name: string): any;
}

declare module 'firebase/remote-config' {
  export function getRemoteConfig(app: any): any;
  export function fetchAndActivate(remoteConfig: any): Promise<boolean>;
  export function getValue(remoteConfig: any, key: string): any;
  export function getString(remoteConfig: any, key: string): string;
  export function getNumber(remoteConfig: any, key: string): number;
  export function getBoolean(remoteConfig: any, key: string): boolean;
  export function setLogLevel(remoteConfig: any, logLevel: string): void;
}

declare module '@react-native-firebase/analytics' {
  const analytics: any;
  export default function(): any;
}

declare module '@react-native-firebase/app' {
  const app: any;
  export default function(): any;
}

declare module '@react-native-firebase/app-check' {
  const appCheck: any;
  export default function(): any;
}

declare module '@react-native-firebase/crashlytics' {
  const crashlytics: any;
  export default function(): any;
}

declare module '@react-native-firebase/perf' {
  const perf: any;
  export default function(): any;
}

declare module '@react-native-firebase/remote-config' {
  const remoteConfig: any;
  export default function(): any;
}

declare module 'react-native-google-mobile-ads' {
  export default function(): any;
  export const InterstitialAd: any;
  export const RewardedAd: any;
  export const TestIds: any;
}

declare module 'firebase-admin' {
  export const apps: any[];
  export function initializeApp(config: any): any;
}