import type { CapacitorConfig } from '@capacitor/cli';

// Native shell loads the LIVE PWA (server-rendered app + APIs stay on Netlify).
const config: CapacitorConfig = {
  appId: 'ai.wihgo.connecthub',
  appName: 'WIHGO AI',
  webDir: 'public',
  server: {
    url: 'https://wihgo.netlify.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
