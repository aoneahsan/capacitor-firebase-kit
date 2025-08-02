import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'CapacitorFirebaseKit',
      exports: 'named',
      globals: {
        '@capacitor/core': 'capacitorExports',
        'firebase/app': 'firebase',
        'firebase/analytics': 'firebase',
        'firebase/app-check': 'firebase',
        'firebase/performance': 'firebase',
        'firebase/remote-config': 'firebase',
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/plugin.cjs.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  external: [
    '@capacitor/core',
    'firebase/app',
    'firebase/analytics',
    'firebase/app-check',
    'firebase/performance', 
    'firebase/remote-config',
    '@react-native-firebase/analytics',
    '@react-native-firebase/app',
    '@react-native-firebase/app-check',
    '@react-native-firebase/crashlytics',
    '@react-native-firebase/perf',
    '@react-native-firebase/remote-config',
    'react-native-google-mobile-ads',
    'firebase-admin'
  ],
  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true,
    }),
    json(),
  ],
};