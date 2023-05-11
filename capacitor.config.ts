import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'order.app',
  appName: 'order-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
