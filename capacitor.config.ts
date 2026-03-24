import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.elarapro.app',
  appName: 'Elara Pro',
  webDir: 'out',
  server: {
    // During development, point to your local Next.js server
    // Remove this block for production builds
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0f0f1a',
  },
  android: {
    backgroundColor: '#0f0f1a',
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f0f1a',
      showSpinner: false,
    },
  },
};

export default config;
